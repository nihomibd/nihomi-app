import {
  EntitlementFeature,
  FeatureKey,
  PlanId,
  Subscription,
  User,
  AccessDecision,
  RequiredTier
} from '../types.js';
import { db } from '../db.js';

export const PLAN_LIMITS: Record<PlanId, { aiMonthlyQuota: number; maxLevel: string }> = {
  free: { aiMonthlyQuota: 10, maxLevel: 'N5' },
  starter: { aiMonthlyQuota: 100, maxLevel: 'N4' },
  pro: { aiMonthlyQuota: 1000, maxLevel: 'N3' },
  japan_ready: { aiMonthlyQuota: 3000, maxLevel: 'N1' }
};

export const FEATURE_TIER_MATRIX: Record<FeatureKey, RequiredTier | 'FREE'> = {
  // Free Tier
  n5_basic: 'FREE',
  n5: 'FREE',
  quizzes: 'FREE',

  // Starter Tier
  n5_full: 'STARTER',
  n4_full: 'STARTER',
  n4: 'STARTER',
  grammar_bank: 'STARTER',
  kanji_master: 'STARTER',

  // Pro Tier
  n3_full: 'PRO',
  n3: 'PRO',
  jlpt_mock_exams: 'PRO',
  jlpt_pro: 'PRO',
  keigo_mastery: 'PRO',
  business_japanese: 'PRO',

  // Japan Ready Tier
  japan_readiness: 'JAPAN_READY',
  japan_ready: 'JAPAN_READY',
  interview_prep: 'JAPAN_READY',
  living_in_japan: 'JAPAN_READY',
  certificates: 'JAPAN_READY',
  priority_ai: 'JAPAN_READY',

  // Dynamic / Quota based
  ai_coach: 'FREE'
};

export const PLAN_ENTITLEMENTS: Record<PlanId, FeatureKey[]> = {
  free: ['n5_basic', 'n5', 'quizzes', 'ai_coach'],
  starter: [
    'n5_basic',
    'n5',
    'n5_full',
    'n4',
    'n4_full',
    'grammar_bank',
    'kanji_master',
    'quizzes',
    'ai_coach'
  ],
  pro: [
    'n5_basic',
    'n5',
    'n5_full',
    'n4',
    'n4_full',
    'grammar_bank',
    'kanji_master',
    'n3',
    'n3_full',
    'jlpt_mock_exams',
    'jlpt_pro',
    'keigo_mastery',
    'business_japanese',
    'quizzes',
    'ai_coach'
  ],
  japan_ready: [
    'n5_basic',
    'n5',
    'n5_full',
    'n4',
    'n4_full',
    'grammar_bank',
    'kanji_master',
    'n3',
    'n3_full',
    'jlpt_mock_exams',
    'jlpt_pro',
    'keigo_mastery',
    'business_japanese',
    'japan_readiness',
    'japan_ready',
    'interview_prep',
    'living_in_japan',
    'certificates',
    'priority_ai',
    'quizzes',
    'ai_coach'
  ]
};

const TIER_ORDER: Record<PlanId, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  japan_ready: 3
};

const REQUIRED_TIER_TO_PLAN_ID: Record<RequiredTier, PlanId> = {
  STARTER: 'starter',
  PRO: 'pro',
  JAPAN_READY: 'japan_ready'
};

/**
 * Check if a subscription is considered in good standing for active features.
 * Active or trialing subscriptions get full access.
 * Past_due gives grace period access.
 * Cancelled with period not ended gives access until currentPeriodEnd.
 */
export function isSubscriptionActive(sub?: Subscription | null): boolean {
  if (!sub) return false;
  const now = new Date().getTime();
  const periodEnd = new Date(sub.currentPeriodEnd).getTime();

  if (sub.status === 'active' || sub.status === 'trialing') {
    return true;
  }

  if (sub.status === 'cancelled' && sub.cancelAtPeriodEnd) {
    return now <= periodEnd;
  }

  if (sub.status === 'past_due' && sub.gracePeriodEnd) {
    return now <= new Date(sub.gracePeriodEnd).getTime();
  }

  return false;
}

/**
 * Retrieve effective active plan ID for a user.
 */
export function getUserActivePlanId(userId: string): PlanId {
  // Ensure lifecycle runs
  db.processSubscriptionLifecycle();

  const user = db.findUserById(userId);
  if (!user) return 'free';

  // Admin gets all-access (Japan Ready)
  if (user.role === 'admin') {
    return 'japan_ready';
  }

  const sub = db.getUserActiveSubscription(userId);
  if (sub && isSubscriptionActive(sub)) {
    return sub.planId;
  }

  return 'free';
}

/**
 * Granular declarative evaluation: evaluateAccess(userOrId, feature, context) -> AccessDecision
 */
export function evaluateAccess(
  userOrId: string | User,
  feature: FeatureKey,
  context?: {
    lessonLevel?: string;
    lessonNumber?: number;
    scenarioLevel?: string;
    category?: string;
  }
): AccessDecision {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId.id;
  const user = typeof userOrId === 'string' ? db.findUserById(userId) : userOrId;

  if (user?.role === 'admin') {
    return { allowed: true };
  }

  const sub = db.getUserActiveSubscription(userId);
  const planId = getUserActivePlanId(userId);

  // 1. Check AI Coach Monthly Quota
  if (feature === 'ai_coach') {
    const quota = PLAN_LIMITS[planId]?.aiMonthlyQuota || 10;
    const usage = db.getAIUsageForCurrentMonth(userId);
    const count = usage.aiCoachInteractions || 0;

    if (count >= quota) {
      return {
        allowed: false,
        reason: 'QUOTA_EXCEEDED',
        requiredTier: planId === 'free' ? 'STARTER' : planId === 'starter' ? 'PRO' : 'JAPAN_READY',
        currentUsage: count,
        usageLimit: quota
      };
    }

    return { allowed: true, currentUsage: count, usageLimit: quota };
  }

  // 2. Check Subscription Expired / Past Due restrictions
  if (sub) {
    if (sub.status === 'expired') {
      const required = FEATURE_TIER_MATRIX[feature];
      if (required && required !== 'FREE') {
        return {
          allowed: false,
          reason: 'SUBSCRIPTION_EXPIRED',
          requiredTier: required
        };
      }
    }
  }

  // 3. Free Tier Granular Lesson Restrictions (N5 Lessons 1 & 2 only)
  if (planId === 'free') {
    if ((feature === 'n5' || feature === 'n5_basic') && context?.lessonNumber && context.lessonNumber > 2) {
      return {
        allowed: false,
        reason: 'TIER_RESTRICTED',
        requiredTier: 'STARTER'
      };
    }
  }

  // 4. Matrix Evaluation
  const required = FEATURE_TIER_MATRIX[feature] || 'FREE';
  if (required !== 'FREE') {
    const requiredPlanId = REQUIRED_TIER_TO_PLAN_ID[required];
    if (TIER_ORDER[planId] < TIER_ORDER[requiredPlanId]) {
      return {
        allowed: false,
        reason: 'TIER_RESTRICTED',
        requiredTier: required
      };
    }
  }

  const allowedFeatures = PLAN_ENTITLEMENTS[planId] || PLAN_ENTITLEMENTS.free;
  if (!allowedFeatures.includes(feature)) {
    return {
      allowed: false,
      reason: 'TIER_RESTRICTED',
      requiredTier: 'PRO'
    };
  }

  return { allowed: true };
}

/**
 * Backward compatible boolean access check: canAccess(userOrId, feature, context)
 */
export function canAccess(
  userOrId: string | User,
  feature: FeatureKey | EntitlementFeature,
  context?: {
    lessonLevel?: string;
    lessonNumber?: number;
    scenarioLevel?: string;
    category?: string;
  }
): boolean {
  const decision = evaluateAccess(userOrId, feature as FeatureKey, context);
  return decision.allowed;
}

/**
 * Get full list of active entitlements for a user.
 */
export function getUserEntitlements(userId: string): FeatureKey[] {
  const planId = getUserActivePlanId(userId);
  return PLAN_ENTITLEMENTS[planId] || PLAN_ENTITLEMENTS.free;
}

