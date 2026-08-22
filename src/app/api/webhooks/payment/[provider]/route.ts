// src/app/api/webhooks/payment/[provider]/route.ts
// Nihomi (にほみ) — Inbound Payment Webhook Handler with Idempotency Guard

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getPaymentProvider } from '@/lib/billing/providers';
import { fulfillSuccessfulSubscriptionPayment } from '@/lib/billing/subscriptionFulfillment';
import { BillingInterval, PlanId } from '@/types/subscription';

export async function POST(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerName = params.provider.toLowerCase();
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

  const provider = getPaymentProvider(providerName);

  // Parse webhook via provider adapter
  const webhookResult = await provider.handleWebhook(rawBody, headersObj, parsedPayload);
  const eventId =
    parsedPayload.eventId ||
    parsedPayload.paymentID ||
    parsedPayload.trxID ||
    parsedPayload.transaction_id ||
    `EVT_${Date.now()}`;

  // 1. Idempotency Check — Prevent duplicate webhook execution
  const existingEvent = await db.webhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider: providerName,
        eventId: eventId.toString(),
      },
    },
  });

  if (existingEvent && existingEvent.processed) {
    return NextResponse.json({ status: 'ignored_duplicate', message: 'Event already processed' }, { status: 200 });
  }

  // 2. Log webhook in audit database
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
    },
    create: {
      eventId: eventId.toString(),
      provider: providerName,
      eventType: webhookResult.eventType,
      transactionId: webhookResult.transactionId,
      rawHeaders: headersObj,
      rawPayload: parsedPayload,
      signature: headersObj['x-signature'] || null,
      signatureValid: true,
      processed: false,
    },
  });

  // 3. Process Transaction
  try {
    if (webhookResult.status === 'paid' && webhookResult.transactionId) {
      const metadata = parsedPayload.metadata || {};
      const userId = metadata.userId || parsedPayload.payerReference || parsedPayload.userId;
      const planId = (metadata.planId || parsedPayload.planId || 'pro') as PlanId;
      const billingInterval = (metadata.billingInterval || parsedPayload.billingInterval || 'monthly') as BillingInterval;
      const planPriceId = metadata.planPriceId || `price_${planId}_${billingInterval}`;
      const amountPaid = webhookResult.amount || parseFloat(parsedPayload.amount || '599');

      if (userId) {
        await fulfillSuccessfulSubscriptionPayment({
          userId,
          planId,
          planPriceId,
          billingInterval,
          amountPaid,
          currency: 'BDT',
          paymentProvider: providerName,
          providerTransactionId: webhookResult.transactionId,
          paymentMethod: webhookResult.paymentMethod,
          rawGatewayResponse: parsedPayload,
        });
      }
    }

    // Mark as processed
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
    console.error(`[Webhook Error] Processing failed for ${eventId}:`, error);

    await db.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processed: false,
        errorLog: error.message || 'Execution failed',
        responseCode: 500,
      },
    });

    return NextResponse.json({ error: 'Processing error', details: error.message }, { status: 500 });
  }
}
