import { Router } from 'express';
import { db } from '../db.js';
import { optionalAuth, requireAuth, AuthenticatedRequest } from '../authHelper.js';

export const referralRouter = Router();

interface ReferralRecord {
  id: string;
  referrerUserId: string;
  refereeUserId: string;
  referralCode: string;
  coinsGranted: number;
  proDaysGranted: number;
  createdAt: string;
}

// Ensure in-memory / persistent store for referrals on db
function getReferralRecords(): ReferralRecord[] {
  if (!(db as any).data.referralRecords) {
    (db as any).data.referralRecords = [];
  }
  return (db as any).data.referralRecords;
}

/**
 * POST /api/referral/claim
 * Claims referral reward for referee and awards bonus to both parties
 */
referralRouter.post('/claim', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { referralCode, userId } = req.body;
  const refereeUserId = req.user?.id || userId;

  if (!referralCode || typeof referralCode !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid referral code' });
  }

  const cleanRefCode = referralCode.trim();

  // Find referrer
  const allUsers = (db as any).data.users || [];
  const allProfiles = (db as any).data.profiles || [];

  const referrer = allUsers.find(
    (u: any) =>
      u.id === cleanRefCode ||
      u.id.replace('usr-', '') === cleanRefCode ||
      u.email?.toLowerCase() === cleanRefCode.toLowerCase() ||
      allProfiles.find((p: any) => p.userId === u.id && (p.nihomiAccountId === cleanRefCode || p.displayName === cleanRefCode))
  );

  if (!referrer) {
    // If exact match not found, but code is valid format, fallback to default admin/ambassador account
    return res.status(404).json({ error: 'Referral code not found. Please check your invite link.' });
  }

  // Prevent self-referral
  if (refereeUserId && referrer.id === refereeUserId) {
    return res.status(400).json({ error: 'Cannot claim your own referral code' });
  }

  // Prevent duplicate claims by the same referee
  const records = getReferralRecords();
  if (refereeUserId) {
    const existing = records.find((r) => r.refereeUserId === refereeUserId);
    if (existing) {
      return res.status(409).json({ error: 'You have already claimed a referral bonus' });
    }
  }

  const coinsToGrant = 50;
  const proDaysToGrant = 7;
  const now = new Date().toISOString();

  // 1. Credit Referrer
  try {
    db.creditUserCoinsAndAI(referrer.id, coinsToGrant, 50, `Referral reward for inviting student ${refereeUserId || 'new student'}`);
    
    // Extend or activate Pro subscription for 7 days
    const referrerSub = db.getUserActiveSubscription(referrer.id);
    if (referrerSub) {
      const currentEnd = new Date(referrerSub.currentPeriodEnd).getTime();
      const newEnd = new Date(Math.max(Date.now(), currentEnd) + proDaysToGrant * 24 * 60 * 60 * 1000).toISOString();
      db.updateSubscription(referrerSub.id, { currentPeriodEnd: newEnd });
    } else {
      const sub = db.createSubscription({
        userId: referrer.id,
        planId: 'pro',
        billingInterval: 'monthly',
        status: 'active',
        paymentMethod: 'referral_bonus'
      });
      db.updateSubscription(sub.id, {
        currentPeriodEnd: new Date(Date.now() + proDaysToGrant * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: true
      });
    }
  } catch (err) {
    console.warn('[Referral] Failed to credit referrer:', err);
  }

  // 2. Credit Referee (if registered)
  if (refereeUserId) {
    try {
      db.creditUserCoinsAndAI(refereeUserId, coinsToGrant, 50, `Welcome bonus for joining via referral from ${referrer.id}`);
      
      const refereeSub = db.getUserActiveSubscription(refereeUserId);
      if (refereeSub) {
        const currentEnd = new Date(refereeSub.currentPeriodEnd).getTime();
        const newEnd = new Date(Math.max(Date.now(), currentEnd) + proDaysToGrant * 24 * 60 * 60 * 1000).toISOString();
        db.updateSubscription(refereeSub.id, { currentPeriodEnd: newEnd });
      } else {
        const sub = db.createSubscription({
          userId: refereeUserId,
          planId: 'pro',
          billingInterval: 'monthly',
          status: 'active',
          paymentMethod: 'referral_bonus'
        });
        db.updateSubscription(sub.id, {
          currentPeriodEnd: new Date(Date.now() + proDaysToGrant * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: true
        });
      }
    } catch (err) {
      console.warn('[Referral] Failed to credit referee:', err);
    }
  }

  // Record referral
  const newRecord: ReferralRecord = {
    id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    referrerUserId: referrer.id,
    refereeUserId: refereeUserId || 'pending_signup',
    referralCode: cleanRefCode,
    coinsGranted: coinsToGrant,
    proDaysGranted: proDaysToGrant,
    createdAt: now
  };
  records.push(newRecord);
  (db as any).save();

  console.log(JSON.stringify({
    level: 'INFO',
    timestamp: now,
    event: 'referral_reward_granted',
    referrerId: referrer.id,
    refereeId: refereeUserId,
    coinsGranted: coinsToGrant,
    proDaysGranted: proDaysToGrant
  }));

  return res.json({
    success: true,
    message: `🎁 Referral bonus applied! You and your friend both receive ${proDaysToGrant} Days Pro + ${coinsToGrant} Nihomi AI Coins.`,
    coinsGranted: coinsToGrant,
    proDaysGranted: proDaysToGrant
  });
});

/**
 * GET /api/referral/stats
 * Returns student's referral statistics and unique link
 */
referralRouter.get('/stats', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || (req.query.userId as string);

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const profile = db.getProfileByUserId(userId);
  const user = db.findUserById(userId);
  const referralCode = (profile as any)?.nihomiAccountId || user?.id || userId;

  const records = getReferralRecords().filter((r) => r.referrerUserId === userId);
  const totalReferred = records.length;
  const coinsEarned = records.reduce((acc, r) => acc + (r.coinsGranted || 50), 0);
  const proDaysEarned = records.reduce((acc, r) => acc + (r.proDaysGranted || 7), 0);

  return res.json({
    referralCode,
    referralLink: `https://nihomi.com?ref=${encodeURIComponent(referralCode)}`,
    totalReferred,
    coinsEarned,
    proDaysEarned,
    history: records.slice(-10)
  });
});
