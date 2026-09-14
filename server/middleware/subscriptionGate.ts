import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { subscriptionService, SubscriptionTier } from '../services/subscriptionService.js';

/**
 * NIHOMI.COM — Commercial Paywall & Subscription Gate Middleware
 * Restricts access to premium educational features:
 * - Minna no Nihongo grammar bank
 * - JLPT N5 Full Mock Exam engine
 * - Unlimited AI Sensei conversational turns
 */
export function requireSubscription(requiredTier: 'n5_pro' | 'n5_lifetime' = 'n5_pro') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // Allow founder/admin roles full bypass
      if (
        user?.role === 'founder' ||
        user?.role === 'admin' ||
        user?.email === 'mdtanvirkabirbiplob@gmail.com'
      ) {
        return next();
      }

      const identifier = user?.id || user?.email || (req.headers['x-user-id'] as string) || (req.query.userId as string);

      if (!identifier) {
        return res.status(401).json({
          success: false,
          paywall: true,
          error: 'Authentication Required',
          message: 'প্রিমিয়াম কনটেন্ট অ্যাক্সেস করতে অনুগ্রহ করে লগইন করুন।',
          requiredTier,
        });
      }

      const access = await subscriptionService.canAccess(identifier, requiredTier);

      if (!access.allowed) {
        return res.status(402).json({
          success: false,
          paywall: true,
          error: 'Subscription Required',
          requiredTier,
          currentTier: access.currentTier,
          message: access.reason || 'এই ফিচারটি ব্যবহার করতে N5 প্রো সাবস্ক্রিপশন প্রয়োজন।',
          plans: subscriptionService.getCatalog().filter((p) => p.id !== 'free'),
        });
      }

      next();
    } catch (err: any) {
      console.error('[SubscriptionGate] Error verifying subscription:', err);
      // Fail safely to next or reject depending on strictness
      return res.status(500).json({
        success: false,
        error: 'Subscription Verification Error',
        message: 'সাবস্ক্রিপশন স্ট্যাটাস যাচাই করতে সমস্যা হয়েছে।',
      });
    }
  };
}
