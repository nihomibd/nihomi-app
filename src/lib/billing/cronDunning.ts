// src/lib/billing/cronDunning.ts
// Nihomi (にほみ) — Server-Side Dunning & Grace Period Expiration Cron Task

import { db } from '@/lib/db';

export interface DunningJobResult {
  processedCount: number;
  expiredCount: number;
  expiredSubscriptionIds: string[];
  errors: Array<{ subscriptionId: string; error: string }>;
}

/**
 * Identifies subscriptions in 'past_due' status whose grace period has passed.
 * Automatically transitions them to 'expired' and logs the event in SubscriptionEvent.
 */
export async function runPastDueExpirationJob(): Promise<DunningJobResult> {
  const now = new Date();
  const result: DunningJobResult = {
    processedCount: 0,
    expiredCount: 0,
    expiredSubscriptionIds: [],
    errors: [],
  };

  try {
    // Query all past_due subscriptions where gracePeriodEnd is in the past
    const pastDueSubs = await db.subscription.findMany({
      where: {
        status: 'past_due',
        gracePeriodEnd: {
          lte: now,
        },
      },
      include: {
        user: true,
      },
    });

    result.processedCount = pastDueSubs.length;

    for (const sub of pastDueSubs) {
      try {
        await db.$transaction(async (tx) => {
          // Transition subscription to 'expired'
          await tx.subscription.update({
            where: { id: sub.id },
            data: {
              status: 'expired',
              updatedAt: now,
            },
          });

          // Log the state transition in SubscriptionEvent
          await tx.subscriptionEvent.create({
            data: {
              subscriptionId: sub.id,
              previousState: 'past_due',
              newState: 'expired',
              reason: 'Grace period (+4 days) lapsed without successful renewal payment',
              triggeredBy: 'cron_dunning',
              metadata: {
                gracePeriodEnd: sub.gracePeriodEnd,
                expiredAt: now,
                userEmail: sub.user?.email,
              },
            },
          });
        });

        result.expiredCount += 1;
        result.expiredSubscriptionIds.push(sub.id);
        console.log(`[Dunning Cron] Subscription ${sub.id} transitioned to expired.`);
      } catch (err: any) {
        console.error(`[Dunning Cron] Failed to expire subscription ${sub.id}:`, err);
        result.errors.push({
          subscriptionId: sub.id,
          error: err.message || 'Unknown error',
        });
      }
    }
  } catch (globalErr: any) {
    console.error('[Dunning Cron] Fatal error during dunning execution:', globalErr);
  }

  return result;
}
