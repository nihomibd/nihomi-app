// src/lib/billing/subscriptionFulfillment.ts
// Nihomi (にほみ) — Atomic Subscription Activation & Invoicing Service

import { db } from '@/lib/db';
import { PLANS } from '@/lib/constants/plans';
import { BillingInterval, PlanId } from '@/types/subscription';
import { addMonths, addYears } from 'date-fns';

export interface FulfillSubscriptionParams {
  userId: string;
  planId: PlanId;
  planPriceId: string;
  billingInterval: BillingInterval;
  amountPaid: number;
  currency: string;
  paymentProvider: string;
  providerTransactionId: string;
  paymentMethod?: string;
  rawGatewayResponse?: any;
}

export async function fulfillSuccessfulSubscriptionPayment(params: FulfillSubscriptionParams) {
  const now = new Date();
  const planConfig = PLANS[params.planId];
  if (!planConfig) {
    throw new Error(`Invalid plan configuration for: ${params.planId}`);
  }

  // Calculate new currentPeriodEnd
  const periodEnd =
    params.billingInterval === 'yearly' ? addYears(now, 1) : addMonths(now, 1);

  // Generate official serial invoice number (e.g. NIH-2026-0042)
  const count = await db.invoice.count();
  const invoiceNumber = `NIH-${now.getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;

  // Execute all updates inside an isolated Atomic Database Transaction
  return await db.$transaction(async (tx) => {
    // 1. Check for existing active or past_due subscription
    const existingSub = await tx.subscription.findFirst({
      where: {
        userId: params.userId,
        status: { in: ['active', 'past_due', 'trialing', 'cancelled'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    let subscription;

    if (existingSub) {
      // Extend or upgrade existing subscription
      subscription = await tx.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: params.planId,
          planPriceId: params.planPriceId,
          status: 'active',
          billingInterval: params.billingInterval,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          cancelledAt: null,
          gracePeriodEnd: null,
        },
      });

      // Record state transition event
      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: subscription.id,
          previousState: existingSub.status,
          newState: 'active',
          reason: `Subscription renewed/upgraded to ${params.planId.toUpperCase()} (${params.billingInterval})`,
          triggeredBy: 'webhook',
          metadata: { amount: params.amountPaid, txnId: params.providerTransactionId },
        },
      });
    } else {
      // Create fresh active subscription
      subscription = await tx.subscription.create({
        data: {
          userId: params.userId,
          planId: params.planId,
          planPriceId: params.planPriceId,
          status: 'active',
          billingInterval: params.billingInterval,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
      });

      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: subscription.id,
          previousState: 'trialing',
          newState: 'active',
          reason: `New ${params.planId.toUpperCase()} subscription started`,
          triggeredBy: 'user_checkout',
        },
      });
    }

    // 2. Create Official Paid Invoice first or Payment first
    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        userId: params.userId,
        subscriptionId: subscription.id,
        planName: planConfig.name,
        billingInterval: params.billingInterval,
        subtotal: params.amountPaid,
        discountAmount: 0.0,
        totalAmount: params.amountPaid,
        currency: params.currency || 'BDT',
        status: 'paid',
        billingPeriodStart: now,
        billingPeriodEnd: periodEnd,
        paidAt: now,
      },
    });

    // 3. Record Payment Record
    const payment = await tx.payment.create({
      data: {
        userId: params.userId,
        subscriptionId: subscription.id,
        invoiceId: invoice.id,
        paymentProvider: params.paymentProvider,
        providerTransactionId: params.providerTransactionId,
        amount: params.amountPaid,
        currency: params.currency || 'BDT',
        status: 'paid',
        paymentMethod: params.paymentMethod || 'bkash_wallet',
        metadata: params.rawGatewayResponse || {},
        paidAt: now,
      },
    });

    // 4. Initialize / Reset AI Coach Monthly Usage Record
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    await tx.usageRecord.upsert({
      where: {
        userId_featureKey_periodStart: {
          userId: params.userId,
          featureKey: 'ai_coach',
          periodStart: startOfMonth,
        },
      },
      update: {},
      create: {
        userId: params.userId,
        featureKey: 'ai_coach',
        usageCount: 0,
        periodStart: startOfMonth,
        periodEnd: endOfMonth,
      },
    });

    return { subscription, payment, invoice };
  });
}
