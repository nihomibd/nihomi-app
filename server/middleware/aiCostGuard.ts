import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../authHelper.js';
import { db } from '../db.js';

export interface AiCostGuardOptions {
  estimatedTokens?: number;
  operationType?: 'coach' | 'vision' | 'dna' | 'drill' | 'pronunciation' | 'explainer';
  maxRatePerMinute?: number;
}

/**
 * Distributed AI Cost Guard Middleware
 * 
 * Guarantees that every billable AI call:
 * 1. Has an authenticated user identity
 * 2. Checks active subscription entitlement & tier limits in PostgreSQL (UsageRecord)
 * 3. Enforces monthly query quotas & token bounds atomically
 * 4. Applies distributed concurrency locks to prevent race conditions during rapid concurrent burst calls
 * 5. Applies distributed sliding window rate limits (e.g. max 20/min on Pro, 6/min on Free)
 * 6. Fails securely (blocks usage) if database verification encounters an error
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

    // 1. Atomic Database Quota & Concurrency Lock Check
    const decision = db.checkAndAcquireAiQuotaLock({
      userId,
      featureKey: `ai_${operationType}`,
      estimatedTokens,
      maxRatePerMinute: options.maxRatePerMinute
    });

    // 2. Enforce Rejection with HTTP 429 Too Many Requests
    if (!decision.allowed) {
      if (decision.reason === 'QUOTA_EXCEEDED') {
        return res.status(429).json({
          error: decision.error || `Monthly AI Sensei query quota reached (${decision.monthlyQuota} queries on ${decision.planName} plan). Top up AI credits or upgrade your plan to continue!`,
          code: 'AI_QUOTA_EXCEEDED',
          quotaExceeded: true,
          currentUsage: decision.currentUsage,
          monthlyQuota: decision.monthlyQuota,
          planId: decision.planId
        });
      }

      if (decision.reason === 'TOKEN_CAP_REACHED') {
        return res.status(429).json({
          error: decision.error || `Monthly AI token bandwidth budget reached for the ${decision.planName} tier.`,
          code: 'AI_TOKEN_CAP_REACHED',
          quotaExceeded: true,
          tokensUsed: decision.tokensUsed,
          tokenCap: decision.tokenCap,
          planId: decision.planId
        });
      }

      if (decision.reason === 'CONCURRENT_REQUEST_BLOCKED') {
        return res.status(429).json({
          error: decision.error || 'Another AI analysis is currently in progress for your account. Please wait a moment.',
          code: 'CONCURRENT_REQUEST_BLOCKED',
          retryAfterSeconds: decision.retryAfterSeconds || 2
        });
      }

      if (decision.reason === 'RATE_LIMIT_EXCEEDED') {
        return res.status(429).json({
          error: decision.error || `AI query speed limit reached. Please wait ${decision.retryAfterSeconds} seconds before your next query.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: decision.retryAfterSeconds || 10
        });
      }

      // Fail-Secure default for database or unexpected errors
      return res.status(429).json({
        error: decision.error || 'AI request could not be safely verified. Please try again shortly.',
        code: decision.reason || 'AI_COST_GUARD_BLOCKED'
      });
    }

    // 3. Attach guard context to request
    (req as any).aiCostGuard = {
      planId: decision.planId,
      monthlyQuota: decision.monthlyQuota,
      currentUsage: decision.currentUsage,
      tokensUsed: decision.tokensUsed,
      lockId: decision.lockId,
      estimatedTokens,
      operationType,
      startTime: Date.now()
    };

    // 4. Ensure distributed concurrency lock is released upon response completion or client disconnect
    const lockId = decision.lockId;
    let released = false;
    const cleanup = () => {
      if (!released) {
        released = true;
        db.releaseAiConcurrencyLock(userId, lockId);
      }
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
export function recordAiCostUsage(userId: string, actualTokens = 400, operationType = 'coach') {
  try {
    return db.recordAtomicAiUsage({
      userId,
      featureKey: `ai_${operationType}`,
      actualTokens,
      countIncrement: 1
    });
  } catch (err) {
    console.error('[AI Cost Guard] Error recording atomic token usage:', err);
    return db.getAIUsageForCurrentMonth(userId);
  }
}
