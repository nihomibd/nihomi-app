// src/app/api/billing/subscription/route.ts
// Nihomi (にほみ) — User Subscription & Invoices Query API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_current_session';

    // Query active or latest subscription
    const subscription = await db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Query invoices for this user
    const invoices = await db.invoice.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({
      subscription: subscription || {
        id: 'free_sub',
        planId: 'free',
        status: 'active',
        billingInterval: 'monthly',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      },
      invoices,
    });
  } catch (err: any) {
    console.error('[Billing API Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch billing info' }, { status: 500 });
  }
}
