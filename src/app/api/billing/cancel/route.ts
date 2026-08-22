// src/app/api/billing/cancel/route.ts
// Nihomi (にほみ) — Subscription Cancellation API Route

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || 'user_current_session';

    const activeSub = await db.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing', 'past_due'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeSub) {
      return NextResponse.json({ error: 'No active subscription found to cancel' }, { status: 404 });
    }

    const updated = await db.$transaction(async (tx) => {
      const sub = await tx.subscription.update({
        where: { id: activeSub.id },
        data: {
          cancelAtPeriodEnd: true,
          cancelledAt: new Date(),
        },
      });

      await tx.subscriptionEvent.create({
        data: {
          subscriptionId: sub.id,
          previousState: activeSub.status,
          newState: activeSub.status,
          reason: 'Subscription scheduled for cancellation at period end',
          triggeredBy: 'user_portal',
        },
      });

      return sub;
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (err: any) {
    console.error('[Cancel Subscription Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to cancel subscription' }, { status: 500 });
  }
}
