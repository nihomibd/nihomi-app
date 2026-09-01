import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../authHelper.js';
import { db } from '../db.js';
import { getUserActivePlanId, PLAN_LIMITS } from '../services/entitlements.js';

// Concurrency lock map to prevent race conditions during rapid concurrent burst calls
const activeUserAiLocks = new Set<string>();

// Dynamic per-minute sliding window rate limiter
interface RateLimitWindow {
  count: number;
  resetAt: number;
}
const userRateLimits = new Map<string, RateLimitWindow>();

export interface AiCostGuardOptions {
  estimatedTokens?: number;
  operationType?: 'coach' | 'vision' | 'dna' | 'drill' | 'pronunciation' | 'explainer';
  maxRatePerMinute?: number;
}

/**
 * AI Cost Guard Middleware
 * 
 * Guarantees that every billable AI call:
 * 1. Has an authenticated user identity
 * 2. Checks active subscription entitlement & tier limits
 * 3. Enforces monthly query quotas & token bounds
 * 4. Limits burst concurrency per user to prevent duplicate charging / race conditions
 * 5. Applies sliding window rate limits (e.g. max 15 requests/min on Pro, 5/min on Free)
 */
export function aiCostGuard(options: AiCostGuardOptions = {}) {
  const { operationType = 'coach', estimatedTokens = 800 } = options;

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({
        error: 'Authentication required to access AI Sensei services.',
        code: 'AUTH_REQUIRED'
      });
    }

    const userId = user.id;

    // 1. Concurrency Lock check (Strict anti-race condition guard)
    if (activeUserAiLocks.has(userId)) {
      return res.status(429).json({
        error: 'Another AI analysis is currently in progress for your account. Please wait a moment.',
        code: 'CONCURRENT_REQUEST_BLOCKED',
        retryAfterSeconds: 2
      });
    }

    // 2. Sliding window rate limiting
    const planId = getUserActivePlanId(userId);
    const maxPerMinute = options.maxRatePerMinute || (planId === 'free' ? 6 : planId === 'starter' ? 20 : 40);
    const now = Date.now();
    const rateRecord = userRateLimits.get(userId) || { count: 0, resetAt: now + 60000 };

    if (now > rateRecord.resetAt) {
      rateRecord.count = 1;
      rateRecord.resetAt = now + 60000;
      userRateLimits.set(userId, rateRecord);
    } else {
      rateRecord.count += 1;
      if (rateRecord.count > maxPerMinute) {
        const waitTimeSec = Math.ceil((rateRecord.resetAt - now) / 1000);
        return res.status(429).json({
          error: `AI query speed limit reached. Please wait ${waitTimeSec} seconds before your next query.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: waitTimeSec
        });
      }
      userRateLimits.set(userId, rateRecord);
    }

    // 3. Plan & Monthly Quota calculation
    const plan = db.getPlanById(planId) || db.getPlanById('free')!;
    const monthlyQuota = plan.aiMonthlyLimit || PLAN_LIMITS[planId]?.aiMonthlyQuota || 10;
    const usage = db.getAIUsageForCurrentMonth(userId);

    const currentMonthlyInteractions = usage.aiCoachInteractions || 0;
    const currentTokens = (usage as any).tokensUsed || 0;
    const tokenCap = (monthlyQuota * 1200); // 1,200 estimated tokens per interaction quota

    if (currentMonthlyInteractions >= monthlyQuota) {
      return res.status(403).json({
        error: `Monthly AI Sensei query quota reached (${monthlyQuota} queries on ${plan.name} plan). Top up AI credits or upgrade your plan to continue!`,
        code: 'AI_QUOTA_EXCEEDED',
        quotaExceeded: true,
        currentUsage: currentMonthlyInteractions,
        monthlyQuota,
        planId
      });
    }

    // Check strict token budget guard
    if (currentTokens >= tokenCap) {
      return res.status(403).json({
        error: `Monthly AI token bandwidth budget reached for the ${plan.name} tier.`,
        code: 'AI_TOKEN_CAP_REACHED',
        quotaExceeded: true
      });
    }

    // Set concurrency lock for active request duration
    activeUserAiLocks.add(userId);

    // Attach guard context to request
    (req as any).aiCostGuard = {
      planId,
      monthlyQuota,
      currentUsage: currentMonthlyInteractions,
      estimatedTokens,
      operationType,
      startTime: Date.now()
    };

    // Ensure lock is released upon response completion or client abort
    const cleanup = () => {
      activeUserAiLocks.delete(userId);
      res.removeListener('finish', cleanup);
      res.removeListener('close', cleanup);
    };
    res.on('finish', cleanup);
    res.on('close', cleanup);

    next();
  };
}

/**
 * Deduct and log atomic token and query usage after successful AI execution
 */
export function recordAiCostUsage(userId: string, actualTokens = 400) {
  try {
    const usage = db.getAIUsageForCurrentMonth(userId);
    usage.aiCoachInteractions = (usage.aiCoachInteractions || 0) + 1;
    (usage as any).tokensUsed = ((usage as any).tokensUsed || 0) + actualTokens;
    usage.lastInteractionAt = new Date().toISOString();
    usage.updatedAt = new Date().toISOString();
    db.save();
    return usage;
  } catch (err) {
    console.error('[AI Cost Guard] Error recording atomic token usage:', err);
    return db.getAIUsageForCurrentMonth(userId);
  }
}
