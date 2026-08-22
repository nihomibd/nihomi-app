// src/app/api/billing/callback/route.ts
// Nihomi (にほみ) — Server-Side Payment Verification Callback

import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/billing/providers';
import { fulfillSuccessfulSubscriptionPayment } from '@/lib/billing/subscriptionFulfillment';
import { BillingInterval, PlanId } from '@/types/subscription';
import { PLANS } from '@/lib/constants/plans';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const providerName = searchParams.get('provider') || 'bkash';
  const paymentID = searchParams.get('paymentID') || searchParams.get('payment_id');
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');
  const planId = (searchParams.get('planId') || 'pro') as PlanId;
  const interval = (searchParams.get('interval') || 'monthly') as BillingInterval;

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!paymentID || status === 'cancel' || status === 'failure') {
    return NextResponse.redirect(`${appBaseUrl}/pricing?status=failed`);
  }

  try {
    const provider = getPaymentProvider(providerName);

    // CRITICAL: Strict server-side verification with Gateway API
    const verification = await provider.verifyPayment(paymentID, {
      amount: PLANS[planId]?.pricing[interval]?.price,
    });

    if (verification.isVerified && verification.status === 'paid' && userId) {
      const planPriceId = PLANS[planId]?.pricing[interval]?.planPriceId || `price_${planId}_${interval}`;

      await fulfillSuccessfulSubscriptionPayment({
        userId,
        planId,
        planPriceId,
        billingInterval: interval,
        amountPaid: verification.amount,
        currency: verification.currency,
        paymentProvider: providerName,
        providerTransactionId: verification.providerTransactionId,
        paymentMethod: verification.paymentMethod,
        rawGatewayResponse: verification.rawResponse,
      });

      return NextResponse.redirect(`${appBaseUrl}/dashboard?payment=success&plan=${planId}`);
    } else {
      return NextResponse.redirect(`${appBaseUrl}/pricing?status=unverified&reason=${encodeURIComponent(verification.errorMessage || 'Verification Failed')}`);
    }
  } catch (err: any) {
    console.error('[Payment Callback Error]:', err);
    return NextResponse.redirect(`${appBaseUrl}/pricing?status=error&message=${encodeURIComponent(err.message)}`);
  }
}
