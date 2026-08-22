// src/app/api/billing/checkout/route.ts
// Nihomi (にほみ) — Checkout Initiation API Route

import { NextRequest, NextResponse } from 'next/server';
import { PLANS, NIHOMI_BRAND } from '@/lib/constants/plans';
import { getPaymentProvider } from '@/lib/billing/providers';
import { BillingInterval, PlanId } from '@/types/subscription';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, billingInterval = 'monthly', provider = 'bkash', userId, userEmail, userName } = body;

    // 1. Validation
    const selectedPlan = PLANS[planId as PlanId];
    if (!selectedPlan || planId === 'free') {
      return NextResponse.json({ error: 'Invalid or non-billable plan selected' }, { status: 400 });
    }

    const interval = billingInterval as BillingInterval;
    const pricing = selectedPlan.pricing[interval];
    if (!pricing) {
      return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 });
    }

    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 });
    }

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentGateway = getPaymentProvider(provider);

    // 2. Create Hosted Payment Session
    const session = await paymentGateway.createCheckoutSession({
      userId,
      userEmail,
      userName,
      planId: planId as PlanId,
      planPriceId: pricing.planPriceId,
      billingInterval: interval,
      amount: pricing.price,
      currency: NIHOMI_BRAND.currencyCode,
      redirectUrl: `${appBaseUrl}/api/billing/callback?provider=${provider}&planId=${planId}&interval=${interval}&userId=${userId}`,
      cancelUrl: `${appBaseUrl}/pricing?status=cancelled`,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      gatewayUrl: session.gatewayUrl,
    });
  } catch (err: any) {
    console.error('[Checkout Error]:', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
