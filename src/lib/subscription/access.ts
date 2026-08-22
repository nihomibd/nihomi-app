// src/lib/subscription/access.ts
// Nihomi (にほみ) — Subscription Access Control & Quota Management Engine

import { db } from '@/lib/db';
import { PLANS } from '@/lib/constants/plans';
import { AccessDecision, FeatureKey, PlanId } from '@/types/subscription';

/**
 * Minimum required tier mapping for each feature key
 */
export const FEATURE_TIER_REQUIREMENTS: Record<FeatureKey, PlanId> = {
  n5_basic: 'free',
  n5_full: 'starter',
  n4_full: 'starter',
  n3_full: 'pro',
  grammar_bank: 'starter',
  kanji_master: 'starter',
  keigo_mastery: 'pro',
  business_japanese: 'pro',
  jlpt_mock_exams: 'pro',
  japan_readiness: 'japan_ready',
  interview_prep: 'japan_ready',
  living_in_japan: 'japan_ready',
  certificates: 'japan_ready',
  ai_coach: 'free', // Available on all tiers, governed by monthly quota
};

const TIER_ORDER: Record<PlanId, number> = {
  free: 1,
  starter: 2,
  pro: 3,
  japan_ready: 4,
};

/**
 * Determines whether a user has access to a specific application feature.
 * Validates active subscriptions, grace periods, tier entitlements, and quota consumption.
 */
export async function canAccess(
  userOrUserId: { id: string } | string,
  featureKey: FeatureKey
): Promise<AccessDecision> {
  const userId = typeof userOrUserId === 'string' ? userOrUserId : userOrUserId?.id;
  if (!userId) {
    return {
      allowed: false,
      reason: 'TIER_RESTRICTED',
      message: 'Authentication required to evaluate feature access.',
    };
  }

  const now = new Date();

  // 1. Fetch user subscription details
  const subscription = await db.subscription.findFirst({
    where: {
      userId,
    },
    orderBy: { createdAt: 'desc' },
  });

  let effectivePlanId: PlanId = 'free';

  if (subscription) {
    const { status, currentPeriodEnd, gracePeriodEnd, planId } = subscription;
    const normPlanId = (planId?.toLowerCase() || 'free') as PlanId;

    if (status === 'expired') {
      // Expired subscriptions fallback to free tier
      effectivePlanId = 'free';
    } else if (status === 'past_due') {
      // Past due: check if grace period is active
      if (gracePeriodEnd && now > gracePeriodEnd) {
        return {
          allowed: false,
          reason: 'PAST_DUE_RESTRICTED',
          message: 'Your payment is past due and the grace period has ended. Please update your billing method.',
        };
      }
      // If still in grace period, permit temporary access
      effectivePlanId = normPlanId;
    } else if (status === 'paused') {
      return {
        allowed: false,
        reason: 'TIER_RESTRICTED',
        message: 'Your subscription is currently paused. Please resume it in your account settings.',
      };
    } else if (status === 'active' || status === 'trialing') {
      effectivePlanId = normPlanId;
    } else if (status === 'cancelled') {
      // Cancelled subscriptions remain active until end of current period
      if (now <= currentPeriodEnd) {
        effectivePlanId = normPlanId;
      } else {
        effectivePlanId = 'free';
      }
    }
  }

  const currentPlan = PLANS[effectivePlanId] || PLANS.free;
  const requiredTier = FEATURE_TIER_REQUIREMENTS[featureKey] || 'free';

  // 2. Tier Level Check
  if (TIER_ORDER[effectivePlanId] < TIER_ORDER[requiredTier]) {
    return {
      allowed: false,
      reason: 'TIER_RESTRICTED',
      requiredTier,
      message: `The '${featureKey}' module requires a ${PLANS[requiredTier]?.name || requiredTier} plan or higher.`,
    };
  }

  // 3. Quota Limits Check (e.g. AI Sensei Coach)
  if (featureKey === 'ai_coach') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const usageRecord = await db.usageRecord.findUnique({
      where: {
        userId_featureKey_periodStart: {
          userId,
          featureKey: 'ai_coach',
          periodStart: startOfMonth,
        },
      },
    });

    const currentUsage = usageRecord?.usageCount || 0;
    const usageLimit = currentPlan.aiCoachLimitMonthly;

    if (usageLimit !== -1 && currentUsage >= usageLimit) {
      return {
        allowed: false,
        reason: 'QUOTA_EXCEEDED',
        currentUsage,
        usageLimit,
        message: `You have reached your monthly limit of ${usageLimit} AI Coach interactions on the ${currentPlan.name} plan.`,
      };
    }

    return {
      allowed: true,
      currentUsage,
      usageLimit,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * Increments monthly feature usage count for a user in the UsageRecord table.
 * Validates usage limit before incrementing.
 */
export async function incrementUsage(
  userId: string,
  featureKey: FeatureKey = 'ai_coach',
  amount: number = 1
): Promise<{ success: boolean; currentUsage: number; usageLimit: number; message?: string }> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Check access before incrementing
  const decision = await canAccess(userId, featureKey);
  if (!decision.allowed) {
    return {
      success: false,
      currentUsage: decision.currentUsage || 0,
      usageLimit: decision.usageLimit || 0,
      message: decision.message || 'Feature access denied',
    };
  }

  // Atomically upsert & increment usage record
  const record = await db.usageRecord.upsert({
    where: {
      userId_featureKey_periodStart: {
        userId,
        featureKey,
        periodStart: startOfMonth,
      },
    },
    update: {
      usageCount: { increment: amount },
    },
    create: {
      userId,
      featureKey,
      usageCount: amount,
      periodStart: startOfMonth,
      periodEnd: endOfMonth,
    },
  });

  const activeSub = await db.subscription.findFirst({
    where: { userId, status: { in: ['active', 'trialing'] } },
    orderBy: { createdAt: 'desc' },
  });
  const planId = (activeSub?.planId?.toLowerCase() || 'free') as PlanId;
  const limit = PLANS[planId]?.aiCoachLimitMonthly ?? PLANS.free.aiCoachLimitMonthly;

  return {
    success: true,
    currentUsage: record.usageCount,
    usageLimit: limit,
  };
}
