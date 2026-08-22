// src/app/api/webhooks/billing/route.ts
// Nihomi (にほみ) — Universal Inbound Payment & Billing Webhook Route Handler

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getPaymentProvider } from '@/lib/billing/providers';
import { fulfillSuccessfulSubscriptionPayment } from '@/lib/billing/subscriptionFulfillment';
import { BillingInterval, PlanId } from '@/types/subscription';
import crypto from 'crypto';

/**
 * Verifies webhook HMAC signature if secret is configured
 */
function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  providerSecret: string
): boolean {
  if (!providerSecret || !signatureHeader) {
    // If webhook secret is not set in development mode, pass verification
    return process.env.NODE_ENV === 'development';
  }

  try {
    const computedSignature = crypto
      .createHmac('sha256', providerSecret)
      .update(rawBody)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, 'utf8'),
      Buffer.from(signatureHeader, 'utf8')
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const headersObj: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersObj[key.toLowerCase()] = value;
  });

  let parsedPayload: any = {};
  try {
    parsedPayload = JSON.parse(rawBody);
  } catch {
    parsedPayload = {};
  }

  // 1. Identify provider
  const providerParam =
    req.nextUrl.searchParams.get('provider') ||
    headersObj['x-payment-provider'] ||
    parsedPayload.provider ||
    'bkash';
  const providerName = providerParam.toLowerCase();

  const signature = headersObj['x-signature'] || headersObj['x-webhook-signature'] || null;
  const webhookSecret = process.env[`${providerName.toUpperCase()}_WEBHOOK_SECRET`] || '';
  const isSignatureValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

  const eventId =
    parsedPayload.eventId ||
    parsedPayload.paymentID ||
    parsedPayload.trxID ||
    parsedPayload.transaction_id ||
    `EVT_${Date.now()}`;

  // 2. Idempotency Check — avoid duplicate processing
  const existingEvent = await db.webhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider: providerName,
        eventId: eventId.toString(),
      },
    },
  });

  if (existingEvent && existingEvent.processed) {
    return NextResponse.json(
      { status: 'ignored_duplicate', message: 'Webhook event already processed.' },
      { status: 200 }
    );
  }

  // 3. Log webhook audit entry
  const webhookRecord = await db.webhookEvent.upsert({
    where: {
      provider_eventId: {
        provider: providerName,
        eventId: eventId.toString(),
      },
    },
    update: {
      rawPayload: parsedPayload,
      rawHeaders: headersObj,
      signature,
      signatureValid: isSignatureValid,
    },
    create: {
      eventId: eventId.toString(),
      provider: providerName,
      eventType: parsedPayload.eventType || parsedPayload.transactionStatus || 'payment.event',
      transactionId: parsedPayload.trxID || parsedPayload.paymentID || null,
      rawHeaders: headersObj,
      rawPayload: parsedPayload,
      signature,
      signatureValid: isSignatureValid,
      processed: false,
    },
  });

  if (!isSignatureValid && process.env.NODE_ENV === 'production') {
    await db.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        errorLog: 'Invalid webhook HMAC signature',
        responseCode: 401,
      },
    });
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  // 4. Process event with state transition transaction
  try {
    const provider = getPaymentProvider(providerName);
    const result = await provider.handleWebhook(rawBody, headersObj, parsedPayload);

    if (result.status === 'paid' && result.transactionId) {
      const metadata = parsedPayload.metadata || {};
      const userId = metadata.userId || parsedPayload.payerReference || parsedPayload.userId;
      const planId = (metadata.planId || parsedPayload.planId || 'pro') as PlanId;
      const billingInterval = (metadata.billingInterval || parsedPayload.billingInterval || 'monthly') as BillingInterval;
      const planPriceId = metadata.planPriceId || `price_${planId}_${billingInterval}`;
      const amountPaid = result.amount || parseFloat(parsedPayload.amount || '599');

      if (userId) {
        await fulfillSuccessfulSubscriptionPayment({
          userId,
          planId,
          planPriceId,
          billingInterval,
          amountPaid,
          currency: result.currency || 'BDT',
          paymentProvider: providerName,
          providerTransactionId: result.transactionId,
          paymentMethod: result.paymentMethod,
          rawGatewayResponse: parsedPayload,
        });
      }
    } else if (result.status === 'failed') {
      // Payment failure handling: enter past_due state with grace period
      const metadata = parsedPayload.metadata || {};
      const userId = metadata.userId || parsedPayload.payerReference || parsedPayload.userId;

      if (userId) {
        await db.$transaction(async (tx) => {
          const activeSub = await tx.subscription.findFirst({
            where: { userId, status: { in: ['active', 'trialing'] } },
            orderBy: { createdAt: 'desc' },
          });

          if (activeSub) {
            const gracePeriodEnd = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // +4 days grace
            await tx.subscription.update({
              where: { id: activeSub.id },
              data: {
                status: 'past_due',
                gracePeriodEnd,
              },
            });

            await tx.subscriptionEvent.create({
              data: {
                subscriptionId: activeSub.id,
                previousState: activeSub.status,
                newState: 'past_due',
                reason: 'Renewal payment charge failed; 4-day grace period initiated',
                triggeredBy: 'webhook',
                metadata: { error: result.error || 'Payment failed' },
              },
            });
          }
        });
      }
    }

    // Mark webhook as successfully processed
    await db.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processed: true,
        processedAt: new Date(),
        responseCode: 200,
      },
    });

    return NextResponse.json({ status: 'success', eventId }, { status: 200 });
  } catch (error: any) {
    console.error(`[Billing Webhook Error] Failed to process ${eventId}:`, error);

    await db.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processed: false,
        errorLog: error.message || 'Unknown transaction failure',
        responseCode: 500,
      },
    });

    return NextResponse.json({ error: 'Internal processing failure', details: error.message }, { status: 500 });
  }
}
