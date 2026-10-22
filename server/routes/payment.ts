import { Router, Request, Response } from 'express';
import { bKashService } from '../services/bKashService.js';
import { sslCommerzService } from '../services/sslCommerzService.js';
import { stripePaymentService } from '../services/stripePaymentService.js';
import { subscriptionService, SUBSCRIPTION_TIERS, SubscriptionTier } from '../services/subscriptionService.js';
import { getCanonicalPrice, validatePurchaseAmount, CANONICAL_SUBSCRIPTION_MATRIX } from '../services/canonicalPricing.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma, isDatabaseConfigured } from '../prisma.js';
import { db } from '../db.js';


// ========================================================
// SECURITY GUARD: RESTRICT MOCK PAYMENTS TO NON-PRODUCTION
// ========================================================
export const isMockPaymentAllowed = (): boolean => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test' || process.env.ENABLE_PAYMENT_MOCK === 'true';
  return isTest && !isProduction;
};

export const paymentRouter = Router();

// ========================================================
// PHASE 47: MONOTONIC PAYMENT STATE MACHINE & CONCURRENCY
// ========================================================
export type CanonicalPaymentState =
  | 'CREATED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REQUIRES_RECONCILIATION';

export interface IdempotencyRecord {
  key: string;
  userId: string;
  tier: SubscriptionTier;
  interval: string;
  amount: number;
  state: CanonicalPaymentState;
  response: any;
  createdAt: number;
  expiresAt: number;
}

export interface PaymentAttemptRecord {
  paymentID: string;
  userId: string;
  tier: SubscriptionTier;
  interval: string;
  amount: number;
  state: CanonicalPaymentState;
  trxID?: string;
  invoiceNumber: string;
  createdAt: number;
  updatedAt: number;
}

// In-memory concurrency & idempotency registries (persists across requests in server lifecycle)
export const idempotencyRegistry = new Map<string, IdempotencyRecord>();
export const userRateLimitRegistry = new Map<string, { timestamp: number; key: string; response: any }>();
export const processedTrxRegistry = new Set<string>();
export const paymentAttemptRegistry = new Map<string, PaymentAttemptRecord>();
export const inFlightUserCreations = new Map<string, Promise<any>>();
export const inFlightIdempotencyCreations = new Map<string, Promise<any>>();

// ========================================================
// DATABASE-BACKED DURABLE PAYMENT STATE & IDEMPOTENCY
// ========================================================

export async function getDurableIdempotency(key: string): Promise<IdempotencyRecord | null> {
  if (!key) return null;
  // 1. Fast L1 In-Memory Cache
  const cached = idempotencyRegistry.get(key);
  if (cached && (Date.now() - cached.createdAt) < 15 * 60 * 1000) {
    return cached;
  }

  // 2. Durable Local Database check (survives process restart)
  try {
    const memPayments = db.getAllPayments();
    const match = memPayments.find((p: any) =>
      (p.metadata?.idempotencyKey === key || p.metadata?.clientKey === key) &&
      p.metadata?.cachedResponse &&
      (Date.now() - new Date(p.createdAt).getTime()) < 15 * 60 * 1000
    );
    if (match) {
      const rec: IdempotencyRecord = {
        key,
        userId: match.userId,
        tier: match.planId as SubscriptionTier,
        interval: (match as any).billingInterval || 'monthly',
        amount: match.amount,
        state: match.status === 'paid' ? 'SUCCEEDED' : 'PENDING',
        response: match.metadata.cachedResponse,
        createdAt: new Date(match.createdAt).getTime(),
        expiresAt: new Date(match.createdAt).getTime() + 15 * 60 * 1000,
      };
      idempotencyRegistry.set(key, rec);
      return rec;
    }
  } catch (err: any) {
    console.warn('[PaymentRouter] Durable idempotency db lookup warning:', err?.message);
  }

  // 3. PostgreSQL / Prisma check if configured
  if (isDatabaseConfigured()) {
    try {
      const stored = await prisma.payment.findFirst({
        where: {
          invoiceNumber: { equals: key },
        },
      });
      if (stored && (Date.now() - stored.createdAt.getTime()) < 15 * 60 * 1000) {
        const meta = (stored.metadata as any) || {};
        if (meta.cachedResponse) {
          const rec: IdempotencyRecord = {
            key,
            userId: stored.userId,
            tier: (meta.tier || 'pro') as SubscriptionTier,
            interval: meta.interval || 'monthly',
            amount: Number(stored.amount),
            state: stored.status === 'paid' ? 'SUCCEEDED' : 'PENDING',
            response: meta.cachedResponse,
            createdAt: stored.createdAt.getTime(),
            expiresAt: stored.createdAt.getTime() + 15 * 60 * 1000,
          };
          idempotencyRegistry.set(key, rec);
          return rec;
        }
      }
    } catch (err: any) {
      console.warn('[PaymentRouter] Durable idempotency Prisma lookup warning:', err?.message);
    }
  }

  return null;
}

export async function saveDurableIdempotency(key: string, record: IdempotencyRecord): Promise<void> {
  // 1. Update L1 In-Memory Cache
  idempotencyRegistry.set(key, record);

  // 2. Persist to Durable Local Database (survives process restart)
  try {
    const memPayments = db.getAllPayments();
    const existing = memPayments.find((p: any) =>
      p.metadata?.idempotencyKey === key ||
      (record.response?.paymentID && p.metadata?.paymentID === record.response.paymentID)
    );
    if (existing) {
      db.updatePayment(existing.id, {
        metadata: {
          ...existing.metadata,
          idempotencyKey: key,
          cachedResponse: record.response,
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      const newPay = db.createPayment({
        userId: record.userId,
        planId: record.tier as any,
        planName: SUBSCRIPTION_TIERS[record.tier]?.name || 'Nihomi Learning Plan',
        billingInterval: (record.interval as any) || 'monthly',
        amount: record.amount,
        originalAmount: record.amount,
        discountAmount: 0,
        provider: 'bkash',
      });
      db.updatePayment(newPay.id, {
        providerTransactionId: record.response?.paymentID || `IDEMP_${key}`,
        metadata: {
          idempotencyKey: key,
          paymentID: record.response?.paymentID,
          invoiceNumber: record.response?.invoiceNumber,
          cachedResponse: record.response,
          tier: record.tier,
          interval: record.interval,
        },
      });
    }
    db.save();
  } catch (err: any) {
    console.warn('[PaymentRouter] Durable idempotency db save warning:', err?.message);
  }
}

export async function getDurablePaymentAttempt(paymentID: string): Promise<PaymentAttemptRecord | null> {
  if (!paymentID) return null;
  // 1. Fast L1 In-Memory Cache
  const cached = paymentAttemptRegistry.get(paymentID);
  if (cached) return cached;

  // 2. Durable Local Database check
  try {
    const memPayments = db.getAllPayments();
    const mem = memPayments.find((p: any) =>
      p.metadata?.paymentID === paymentID ||
      p.providerTransactionId === paymentID ||
      p.id === paymentID
    );
    if (mem) {
      const meta = (mem.metadata as any) || {};
      const state: CanonicalPaymentState =
        mem.status === 'paid' ? 'SUCCEEDED' :
        mem.status === 'failed' ? 'FAILED' :
        mem.status === 'cancelled' ? 'CANCELLED' :
        (meta.paymentState as CanonicalPaymentState) || 'PENDING';

      const record: PaymentAttemptRecord = {
        paymentID,
        userId: mem.userId,
        tier: (meta.tier || mem.planId || 'pro') as SubscriptionTier,
        interval: meta.interval || (mem as any).billingInterval || 'monthly',
        amount: mem.amount,
        state,
        trxID: mem.status === 'paid' ? mem.providerTransactionId : meta.trxID,
        invoiceNumber: meta.invoiceNumber || `INV_${paymentID}`,
        createdAt: new Date(mem.createdAt).getTime(),
        updatedAt: new Date(mem.updatedAt).getTime(),
      };
      paymentAttemptRegistry.set(paymentID, record);
      return record;
    }
  } catch (err: any) {
    console.warn('[PaymentRouter] Durable payment attempt db lookup warning:', err?.message);
  }

  // 3. PostgreSQL / Prisma check if configured
  if (isDatabaseConfigured()) {
    try {
      const stored = await prisma.payment.findFirst({
        where: {
          OR: [{ paymentID }, { providerTransactionId: paymentID }],
        },
      });
      if (stored) {
        const meta = (stored.metadata as any) || {};
        const state: CanonicalPaymentState =
          stored.status === 'paid' ? 'SUCCEEDED' :
          stored.status === 'failed' ? 'FAILED' :
          stored.status === 'cancelled' ? 'CANCELLED' :
          (meta.paymentState as CanonicalPaymentState) || 'PENDING';

        const record: PaymentAttemptRecord = {
          paymentID,
          userId: stored.userId,
          tier: (meta.tier || 'pro') as SubscriptionTier,
          interval: meta.interval || 'monthly',
          amount: Number(stored.amount),
          state,
          trxID: stored.status === 'paid' ? stored.providerTransactionId : meta.trxID,
          invoiceNumber: stored.invoiceNumber || `INV_${paymentID}`,
          createdAt: stored.createdAt.getTime(),
          updatedAt: stored.createdAt.getTime(),
        };
        paymentAttemptRegistry.set(paymentID, record);
        return record;
      }
    } catch (err: any) {
      console.warn('[PaymentRouter] Durable payment attempt Prisma lookup warning:', err?.message);
    }
  }

  return null;
}

export async function saveDurablePaymentAttempt(paymentID: string, record: PaymentAttemptRecord): Promise<void> {
  // 1. Update L1 In-Memory Cache
  paymentAttemptRegistry.set(paymentID, record);

  // 2. Persist to Durable Local Database
  try {
    const memPayments = db.getAllPayments();
    const existing = memPayments.find((p: any) =>
      p.metadata?.paymentID === paymentID ||
      p.providerTransactionId === paymentID ||
      p.id === paymentID
    );
    if (existing) {
      db.updatePayment(existing.id, {
        status: record.state === 'SUCCEEDED' ? 'paid' : record.state === 'FAILED' ? 'failed' : 'initiated',
        providerTransactionId: record.trxID || existing.providerTransactionId,
        metadata: {
          ...existing.metadata,
          paymentID,
          paymentState: record.state,
          trxID: record.trxID,
          invoiceNumber: record.invoiceNumber,
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      const newPay = db.createPayment({
        userId: record.userId,
        planId: record.tier as any,
        planName: SUBSCRIPTION_TIERS[record.tier]?.name || 'Nihomi Learning Plan',
        billingInterval: (record.interval as any) || 'monthly',
        amount: record.amount,
        originalAmount: record.amount,
        discountAmount: 0,
        provider: 'bkash',
      });
      db.updatePayment(newPay.id, {
        providerTransactionId: record.trxID || paymentID,
        status: record.state === 'SUCCEEDED' ? 'paid' : 'initiated',
        metadata: {
          paymentID,
          paymentState: record.state,
          trxID: record.trxID,
          invoiceNumber: record.invoiceNumber,
          tier: record.tier,
          interval: record.interval,
        },
      });
    }
    db.save();
  } catch (err: any) {
    console.warn('[PaymentRouter] Durable payment attempt db save warning:', err?.message);
  }

  // 3. Persist to Prisma if configured
  if (isDatabaseConfigured()) {
    try {
      const existing = await prisma.payment.findFirst({
        where: { OR: [{ paymentID }, { providerTransactionId: paymentID }] },
      });
      if (existing) {
        await prisma.payment.update({
          where: { id: existing.id },
          data: {
            status: record.state === 'SUCCEEDED' ? 'paid' : 'initiated',
            paidAt: record.state === 'SUCCEEDED' ? new Date() : undefined,
            providerTransactionId: record.trxID || existing.providerTransactionId,
            metadata: {
              ...(existing.metadata as any),
              paymentID,
              paymentState: record.state,
              trxID: record.trxID,
              invoiceNumber: record.invoiceNumber,
            },
          },
        });
      }
    } catch (err: any) {
      console.warn('[PaymentRouter] Durable payment attempt Prisma update warning:', err?.message);
    }
  }
}

export async function isDurableTrxProcessed(trxID: string): Promise<boolean> {
  if (!trxID) return false;
  if (processedTrxRegistry.has(trxID)) return true;

  try {
    const memMatch = (db.data.payments || []).some(
      (p) => p.providerTransactionId === trxID && p.status === 'paid'
    );
    if (memMatch) {
      processedTrxRegistry.add(trxID);
      return true;
    }
  } catch {}

  if (isDatabaseConfigured()) {
    try {
      const pgMatch = await prisma.payment.findUnique({
        where: { providerTransactionId: trxID },
      });
      if (pgMatch && pgMatch.status === 'paid') {
        processedTrxRegistry.add(trxID);
        return true;
      }
    } catch {}
  }
  return false;
}

export function recordDurableTrxProcessed(trxID: string): void {
  if (trxID) {
    processedTrxRegistry.add(trxID);
  }
}

function resolveTierAndIntervalFromAmount(amount: number): { tier: SubscriptionTier; interval: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' } {
  // Check exact canonical matrix matches
  for (const [planId, planDef] of Object.entries(CANONICAL_SUBSCRIPTION_MATRIX)) {
    for (const [intervalKey, termPricing] of Object.entries(planDef.terms)) {
      if (termPricing.amountBdt === amount) {
        return {
          tier: planId as SubscriptionTier,
          interval: intervalKey as 'monthly' | 'quarterly' | 'half_yearly' | 'yearly',
        };
      }
    }
  }

  // Legacy or approximate threshold matching
  if (amount >= 20000) return { tier: 'japan_ready', interval: 'yearly' };
  if (amount >= 10000) return { tier: 'pro', interval: 'yearly' };
  if (amount >= 4000) return { tier: 'n5_lifetime', interval: 'yearly' };
  if (amount >= 3000) return { tier: 'japan_ready', interval: 'monthly' };
  if (amount >= 1500) return { tier: 'pro', interval: 'monthly' };
  return { tier: 'starter', interval: 'monthly' };
}

// ========================================================
// 1. PUBLIC PLAN CATALOG
// ========================================================
paymentRouter.get('/plans', (_req: Request, res: Response) => {
  try {
    const plans = subscriptionService.getCatalog();
    return res.json({
      success: true,
      plans,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error fetching plans:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch plan catalog' });
  }
});

// ========================================================
// 2. CREATE BKASH CHECKOUT SESSION (IDEMPOTENT & RATE-LIMITED)
// ========================================================
paymentRouter.post('/create', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  let rejectInFlight: ((err: any) => void) | undefined;
  let idempotencyKey: string | undefined;
  let resolvedUserId: string | undefined;
  try {
    const { tier, planId, interval = 'monthly', callbackUrl, mock, idempotencyKey: clientKey } = req.body;
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication is required for checkout.',
        code: 'AUTH_REQUIRED'
      });
    }

    resolvedUserId = user.id;
    const resolvedEmail = user.email || 'student@nihomi.com';

    // Strict Identity Protection: Reject client spoofing
    if (req.body.userId && req.body.userId !== resolvedUserId && user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Forbidden: User ID in request body does not match authenticated session.',
        code: 'IDENTITY_MISMATCH'
      });
    }

    // Mock bypass protection: Strictly forbidden in production
    const isMockRequested = Boolean(mock === true || req.body.mock === true);
    if (isMockRequested && !isMockPaymentAllowed()) {
      return res.status(400).json({
        success: false,
        error: 'Mock payment is strictly forbidden in production mode.',
        code: 'MOCK_PAYMENT_FORBIDDEN'
      });
    }

    const resolvedPlanKey = (planId || tier || 'pro').toLowerCase();
    let amount: number;
    let selectedTier: SubscriptionTier;

    if (resolvedPlanKey === 'starter') {
      selectedTier = 'starter';
      amount = getCanonicalPrice('starter', interval);
    } else if (resolvedPlanKey === 'japan_ready' || resolvedPlanKey === 'japanready') {
      selectedTier = 'japan_ready';
      amount = getCanonicalPrice('japan_ready', interval);
    } else if (resolvedPlanKey === 'n5_lifetime') {
      selectedTier = 'n5_lifetime';
      amount = SUBSCRIPTION_TIERS.n5_lifetime?.priceBdt || 4990;
    } else {
      selectedTier = 'pro';
      amount = getCanonicalPrice('pro', interval);
    }

    // Strict Client Tamper Defense: Reject fraudulent pricing payloads
    if (req.body.amount && typeof req.body.amount === 'number' && req.body.amount > 0) {
      if (Math.abs(req.body.amount - amount) > 1 && !req.body.couponCode) {
        console.warn(`[PaymentRouter] Client price tamper attempt detected: sent ৳${req.body.amount}, expected ৳${amount}`);
        return res.status(400).json({
          success: false,
          error: 'Price mismatch. Server canonical pricing is strictly enforced.',
          expectedAmount: amount,
          currency: 'BDT'
        });
      }
    }

    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.pro;
    const invoiceNumber = `INV_NHO_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // High-Entropy Idempotency Key Resolution
    idempotencyKey = (
      clientKey ||
      (req.headers['idempotency-key'] as string) ||
      (req.headers['x-idempotency-key'] as string) ||
      `idemp_${resolvedUserId}_${selectedTier}_${interval}`
    );

    // 0. Concurrency in-flight lock: If another request for the same idempotency key is actively running
    if (inFlightIdempotencyCreations.has(idempotencyKey)) {
      try {
        const inFlightRes = await inFlightIdempotencyCreations.get(idempotencyKey);
        res.setHeader('X-Idempotent-Replay', 'true');
        return res.json(inFlightRes);
      } catch (err) {}
    }

    // 0b. Concurrency in-flight lock for user: Rapid double-click suppression
    if (inFlightUserCreations.has(resolvedUserId)) {
      try {
        const inFlightRes = await inFlightUserCreations.get(resolvedUserId);
        res.setHeader('X-Duplicate-Suppression', 'true');
        return res.json(inFlightRes);
      } catch (err) {}
    }

    // Immediately register synchronous in-flight promise before any async I/O
    let resolveInFlight!: (val: any) => void;
    const inFlightPromise = new Promise<any>((resolve, reject) => {
      resolveInFlight = resolve;
      rejectInFlight = reject;
    });
    inFlightIdempotencyCreations.set(idempotencyKey, inFlightPromise);
    inFlightUserCreations.set(resolvedUserId, inFlightPromise);

    // 1. Idempotency Check: Return existing attempt if within 15-minute validity window
    const cachedAttempt = await getDurableIdempotency(idempotencyKey);
    if (cachedAttempt && (Date.now() - cachedAttempt.createdAt) < 15 * 60 * 1000) {
      resolveInFlight(cachedAttempt.response);
      inFlightIdempotencyCreations.delete(idempotencyKey);
      inFlightUserCreations.delete(resolvedUserId);
      if (cachedAttempt.userId !== resolvedUserId && user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Idempotency key collision across accounts.',
          code: 'IDEMPOTENCY_KEY_COLLISION'
        });
      }
      res.setHeader('X-Idempotent-Replay', 'true');
      return res.json(cachedAttempt.response);
    }

    // 2. Rapid Double-Click Suppression: 2-second rate limiter per user
    const lastUserReq = userRateLimitRegistry.get(resolvedUserId);
    const now = Date.now();
    if (lastUserReq && (now - lastUserReq.timestamp) < 2000) {
      if (lastUserReq.response) {
        resolveInFlight(lastUserReq.response);
        inFlightIdempotencyCreations.delete(idempotencyKey);
        inFlightUserCreations.delete(resolvedUserId);
        res.setHeader('X-Duplicate-Suppression', 'true');
        return res.json(lastUserReq.response);
      }
      resolveInFlight({ success: false, error: 'Rate limited', code: 'RATE_LIMITED' });
      inFlightIdempotencyCreations.delete(idempotencyKey);
      inFlightUserCreations.delete(resolvedUserId);
      return res.status(429).json({
        success: false,
        error: 'Please wait a moment before retrying payment initiation.',
        code: 'RATE_LIMITED'
      });
    }

    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const finalCallbackUrl = callbackUrl || `${appUrl}/api/payment/callback`;

    // 3. Deterministic Mock / Sandbox Provider for Automated Chaos Tests (Explicitly requested and allowed only)
    if (isMockRequested && isMockPaymentAllowed()) {
      const mockPaymentID = `MOCK_BK_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mockResponse = {
        success: true,
        mock: true,
        paymentID: mockPaymentID,
        bkashURL: `${appUrl}/api/payment/callback?paymentID=${mockPaymentID}&status=success`,
        invoiceNumber,
        amount,
        currency: 'BDT',
        tier: selectedTier,
        interval,
        state: 'PENDING' as CanonicalPaymentState,
        planNameBn: planConfig.nameBn,
      };

      await saveDurableIdempotency(idempotencyKey, {
        key: idempotencyKey,
        userId: resolvedUserId,
        tier: selectedTier,
        interval,
        amount,
        state: 'PENDING',
        response: mockResponse,
        createdAt: now,
        expiresAt: now + 15 * 60 * 1000,
      });

      userRateLimitRegistry.set(resolvedUserId, { timestamp: now, key: idempotencyKey, response: mockResponse });

      await saveDurablePaymentAttempt(mockPaymentID, {
        paymentID: mockPaymentID,
        userId: resolvedUserId,
        tier: selectedTier,
        interval,
        amount,
        state: 'PENDING',
        invoiceNumber,
        createdAt: now,
        updatedAt: now,
      });

      resolveInFlight(mockResponse);
      inFlightIdempotencyCreations.delete(idempotencyKey);
      inFlightUserCreations.delete(resolvedUserId);
      return res.json(mockResponse);
    }

    const isBkashConfigured = Boolean(
      process.env.BKASH_APP_KEY &&
      !process.env.BKASH_APP_KEY.includes('placeholder') &&
      process.env.BKASH_APP_KEY !== 'bkash_nihomi_live_app_key'
    );
    if (!isBkashConfigured) {
      console.log('[PaymentRouter] bKash gateway NOT_CONFIGURED. Returning honest state.');
      const notConfiguredPayload = {
        success: false,
        gatewayStatus: 'NOT_CONFIGURED',
        state: 'NOT_CONFIGURED',
        messageBn: 'বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।',
        message: 'বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।'
      };
      resolveInFlight(notConfiguredPayload);
      inFlightIdempotencyCreations.delete(idempotencyKey);
      inFlightUserCreations.delete(resolvedUserId);
      return res.json(notConfiguredPayload);
    }

    // Call bKash Tokenized Checkout Create API
    const bkashRes = await bKashService.createPayment({
      amount,
      invoiceNumber,
      payerReference: resolvedUserId,
      callbackUrl: finalCallbackUrl,
    });

    // Record pending transaction in Prisma PostgreSQL if configured (non-blocking fallback)
    if (isDatabaseConfigured()) {
      try {
        let dbUser = await prisma.user.findFirst({
          where: { OR: [{ id: resolvedUserId }, { email: resolvedEmail }] },
        });

        if (!dbUser && resolvedEmail) {
          dbUser = await prisma.user.create({
            data: {
              id: resolvedUserId.startsWith('usr_') ? resolvedUserId : undefined,
              email: resolvedEmail,
              name: resolvedEmail.split('@')[0],
              subscriptionTier: 'free',
            },
          });
        }

        if (dbUser) {
          await prisma.payment.create({
            data: {
              userId: dbUser.id,
              paymentProvider: 'bkash',
              providerTransactionId: `PENDING_${bkashRes.paymentID}`,
              paymentID: bkashRes.paymentID,
              invoiceNumber,
              amount,
              currency: 'BDT',
              status: 'initiated',
              paymentMethod: 'bKash MFS',
              metadata: {
                tier: selectedTier,
                interval,
                invoiceNumber,
                userEmail: resolvedEmail,
                initiatedAt: new Date().toISOString(),
              },
            },
          });
        }
      } catch (dbErr: any) {
        console.warn('[PaymentRouter] Prisma initial log warning (continuing):', dbErr?.message);
      }
    }

    // Also record in memory db for state synchronization
    try {
      const memPayment = db.createPayment({
        userId: resolvedUserId,
        planId: selectedTier as any,
        planName: planConfig.name,
        billingInterval: selectedTier === 'n5_lifetime' ? ('yearly' as any) : ((interval as any) || 'monthly'),
        amount,
        originalAmount: amount,
        discountAmount: 0,
        provider: 'bkash',
      });

      db.updatePayment(memPayment.id, {
        providerTransactionId: `PENDING_${bkashRes.paymentID}`,
        metadata: {
          paymentID: bkashRes.paymentID,
          invoiceNumber,
          tier: selectedTier,
          interval,
          userEmail: resolvedEmail,
        },
      });
      db.save();

      await saveDurablePaymentAttempt(bkashRes.paymentID, {
        paymentID: bkashRes.paymentID,
        userId: resolvedUserId,
        tier: selectedTier,
        interval,
        amount,
        state: 'PENDING',
        invoiceNumber,
        createdAt: now,
        updatedAt: now,
      });
    } catch (memErr: any) {
      console.warn('[PaymentRouter] In-memory payment init log error:', memErr?.message);
    }

    const finalLiveResponse = {
      success: true,
      paymentID: bkashRes.paymentID,
      bkashURL: bkashRes.bkashURL,
      invoiceNumber,
      amount,
      currency: 'BDT',
      tier: selectedTier,
      planNameBn: planConfig.nameBn,
    };
    resolveInFlight(finalLiveResponse);
    inFlightIdempotencyCreations.delete(idempotencyKey);
    inFlightUserCreations.delete(resolvedUserId);
    return res.json(finalLiveResponse);
  } catch (err: any) {
    rejectInFlight?.(err);
    if (idempotencyKey) inFlightIdempotencyCreations.delete(idempotencyKey);
    if (resolvedUserId) inFlightUserCreations.delete(resolvedUserId);
    console.error('[PaymentRouter] Checkout initiation failed:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to initiate bKash checkout session.',
    });
  }
});

// 3. BKASH REDIRECT CALLBACK (BROWSER RETURN)
// ========================================================
paymentRouter.get('/callback', async (req: Request, res: Response) => {
  const { paymentID, status } = req.query as { paymentID?: string; status?: string };

  console.log(`[PaymentRouter Callback] Return from bKash: paymentID=${paymentID}, status=${status}`);

  if (!paymentID) {
    return res.redirect('/payment/callback?status=failed&error=missing_payment_id');
  }

  // Handle cancellation or failure returned directly from bKash gateway
  if (status !== 'success') {
    console.warn(`[PaymentRouter Callback] Payment status is '${status}' for paymentID ${paymentID}`);
    return res.redirect(`/payment/callback?status=${encodeURIComponent(status || 'failed')}&paymentID=${encodeURIComponent(paymentID)}`);
  }

  // Mock security check: Strictly forbidden in production
  const isMock = Boolean(
    paymentID.startsWith('MOCK_BK_') ||
    req.query.mock === 'true'
  );

  if (isMock && !isMockPaymentAllowed()) {
    console.warn(`[PaymentRouter Callback] Mock payment rejected in production mode: ${paymentID}`);
    return res.redirect(`/payment/callback?status=failed&error=mock_payment_forbidden&paymentID=${encodeURIComponent(paymentID)}`);
  }

  try {
    // 0. Durable database lookup: Payment attempt MUST exist from prior initiation
    const existingAttempt = await getDurablePaymentAttempt(paymentID);
    if (!existingAttempt) {
      console.error(`[PaymentRouter Callback] Unregistered or fabricated paymentID: ${paymentID}`);
      return res.redirect(`/payment/callback?status=failed&error=payment_attempt_not_found&paymentID=${encodeURIComponent(paymentID)}`);
    }

    // Deduplication check: Has this payment already completed?
    if (existingAttempt.state === 'SUCCEEDED') {
      console.log(`[PaymentRouter Callback] Duplicate callback / replay detected for paymentID: ${paymentID}. Returning idempotent success.`);
      return res.redirect(`/payment/callback?status=success&trxID=${existingAttempt.trxID || 'ALREADY_PAID'}&tier=${existingAttempt.tier}&amount=${existingAttempt.amount}&invoiceNumber=${existingAttempt.invoiceNumber}&deduplicated=true`);
    }

    // 1. Execute payment with bKash API (with mock/sandbox fallback ONLY if allowed)
    let execResult: any;
    if (isMock && isMockPaymentAllowed()) {
      execResult = {
        statusCode: '0000',
        statusMessage: 'Successful',
        paymentID,
        payerReference: existingAttempt.userId,
        customerMsisdn: '01800000000',
        trxID: existingAttempt.trxID || `TRX_MOCK_${Date.now()}`,
        amount: String(existingAttempt.amount),
        transactionStatus: 'Completed',
        paymentExecuteTime: new Date().toISOString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: existingAttempt.invoiceNumber,
      };
    } else {
      execResult = await bKashService.executePayment(paymentID);
    }

    // 2. Strict validation: transactionStatus must be 'Completed'
    if (execResult.transactionStatus !== 'Completed' || !execResult.trxID) {
      console.error(`[PaymentRouter Callback] Incomplete status: ${execResult.transactionStatus}`);
      existingAttempt.state = 'FAILED';
      await saveDurablePaymentAttempt(paymentID, existingAttempt);
      return res.redirect(`/payment/callback?status=failed&error=incomplete_transaction&paymentID=${encodeURIComponent(paymentID)}`);
    }

    // 3. Amount and currency validation: must match existingAttempt!
    const paidAmount = Number(execResult.amount);
    if (isNaN(paidAmount) || Math.abs(paidAmount - existingAttempt.amount) > 0.01) {
      console.error(`[PaymentRouter Callback] Amount mismatch: expected ${existingAttempt.amount}, got ${paidAmount}`);
      existingAttempt.state = 'FAILED';
      await saveDurablePaymentAttempt(paymentID, existingAttempt);
      return res.redirect(`/payment/callback?status=failed&error=amount_mismatch&paymentID=${encodeURIComponent(paymentID)}`);
    }

    if (execResult.currency && execResult.currency.toUpperCase() !== 'BDT') {
      console.error(`[PaymentRouter Callback] Currency mismatch: ${execResult.currency}`);
      existingAttempt.state = 'FAILED';
      await saveDurablePaymentAttempt(paymentID, existingAttempt);
      return res.redirect(`/payment/callback?status=failed&error=currency_mismatch&paymentID=${encodeURIComponent(paymentID)}`);
    }

    // 4. Derive identity and plan strictly from the durable pre-saved attempt (Client cannot spoof!)
    const resolvedUserId = existingAttempt.userId;
    const resolvedTier = existingAttempt.tier;
    const resolvedInterval = existingAttempt.interval as any;
    const amount = existingAttempt.amount;
    const invoiceNumber = existingAttempt.invoiceNumber;

    let resolvedEmail = 'student@nihomi.com';
    const user = db.findUserById(resolvedUserId);
    if (user?.email) resolvedEmail = user.email;

    // 5. Atomically activate user subscription in Prisma & Memory DB
    await subscriptionService.activateSubscription({
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      tier: resolvedTier,
      billingInterval: resolvedInterval,
      trxID: execResult.trxID,
      amount,
      paymentID,
      invoiceNumber,
    });

    // Mark payment attempt as SUCCEEDED and record trxID in registry
    recordDurableTrxProcessed(execResult.trxID);
    existingAttempt.state = 'SUCCEEDED';
    existingAttempt.trxID = execResult.trxID;
    existingAttempt.updatedAt = Date.now();
    await saveDurablePaymentAttempt(paymentID, existingAttempt);

    console.log(`[PaymentRouter Callback] Subscription activated successfully for trxID: ${execResult.trxID}`);

    // 6. Redirect to frontend success page
    const redirectParams = new URLSearchParams({
      status: 'success',
      trxID: execResult.trxID,
      tier: resolvedTier,
      amount: String(amount),
      invoiceNumber,
    });

    return res.redirect(`/payment/callback?${redirectParams.toString()}`);
  } catch (err: any) {
    console.error('[PaymentRouter Callback] Execution error:', err);
    return res.redirect(`/payment/callback?status=failed&error=${encodeURIComponent(err?.message || 'Execution error')}&paymentID=${encodeURIComponent(paymentID)}`);
  }
});

// 4. DIRECT EXECUTE ENDPOINT (API / SPA / MOBILE)
// ========================================================
paymentRouter.post('/execute', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { paymentID } = req.body;
  const user = req.user;

  if (!user || !user.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!paymentID) {
    return res.status(400).json({
      success: false,
      error: 'paymentID is required',
      code: 'PAYMENT_ID_REQUIRED'
    });
  }

  // 1. Mock protection: strictly forbidden in production mode
  const isMock = Boolean(
    paymentID.startsWith('MOCK_BK_') ||
    req.body.mock === true
  );

  if (isMock && !isMockPaymentAllowed()) {
    return res.status(403).json({
      success: false,
      error: 'Mock payment execution is strictly forbidden in production mode.',
      code: 'MOCK_PAYMENT_FORBIDDEN'
    });
  }

  // 2. Lookup existing attempt
  const existingAttempt = await getDurablePaymentAttempt(paymentID);
  if (!existingAttempt) {
    return res.status(404).json({
      success: false,
      error: 'Payment attempt not found.',
      code: 'PAYMENT_ATTEMPT_NOT_FOUND'
    });
  }

  // 3. Strict ownership check! User cannot execute someone else's payment attempt
  if (existingAttempt.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: You do not own this payment attempt.',
      code: 'FORBIDDEN_PAYMENT_OWNERSHIP_MISMATCH'
    });
  }

  // 4. Deduplication
  if (existingAttempt.state === 'SUCCEEDED') {
    console.log(`[PaymentRouter Execute] Duplicate direct execute detected for paymentID ${paymentID}. Returning idempotent cached result.`);
    return res.json({
      success: true,
      deduplicated: true,
      trxID: existingAttempt.trxID,
      tier: existingAttempt.tier,
      amount: existingAttempt.amount,
      invoiceNumber: existingAttempt.invoiceNumber,
      message: 'Payment already verified and subscription activated.'
    });
  }

  try {
    let execResult: any;
    if (isMock && isMockPaymentAllowed()) {
      execResult = {
        statusCode: '0000',
        statusMessage: 'Successful',
        paymentID,
        payerReference: existingAttempt.userId,
        customerMsisdn: '01800000000',
        trxID: existingAttempt.trxID || `TRX_MOCK_${Date.now()}`,
        amount: String(existingAttempt.amount),
        transactionStatus: 'Completed',
        paymentExecuteTime: new Date().toISOString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: existingAttempt.invoiceNumber,
      };
    } else {
      execResult = await bKashService.executePayment(paymentID);
    }

    if (execResult.transactionStatus !== 'Completed' || !execResult.trxID) {
      existingAttempt.state = 'FAILED';
      await saveDurablePaymentAttempt(paymentID, existingAttempt);
      return res.status(400).json({
        success: false,
        error: `Transaction status is '${execResult.transactionStatus || 'unknown'}'. Not completed.`,
        code: 'TRANSACTION_INCOMPLETE'
      });
    }

    // Amount and currency validation
    const paidAmount = Number(execResult.amount);
    if (isNaN(paidAmount) || Math.abs(paidAmount - existingAttempt.amount) > 0.01) {
      existingAttempt.state = 'FAILED';
      await saveDurablePaymentAttempt(paymentID, existingAttempt);
      return res.status(400).json({
        success: false,
        error: 'Payment amount does not match expected attempt amount.',
        code: 'AMOUNT_MISMATCH'
      });
    }

    if (execResult.currency && execResult.currency.toUpperCase() !== 'BDT') {
      existingAttempt.state = 'FAILED';
      await saveDurablePaymentAttempt(paymentID, existingAttempt);
      return res.status(400).json({
        success: false,
        error: 'Payment currency must be BDT.',
        code: 'CURRENCY_MISMATCH'
      });
    }

    // Activate subscription strictly for existingAttempt
    const activation = await subscriptionService.activateSubscription({
      userId: existingAttempt.userId,
      userEmail: user.email || 'student@nihomi.com',
      tier: existingAttempt.tier,
      billingInterval: existingAttempt.interval as any,
      trxID: execResult.trxID,
      amount: existingAttempt.amount,
      paymentID,
      invoiceNumber: existingAttempt.invoiceNumber,
    });

    recordDurableTrxProcessed(execResult.trxID);
    existingAttempt.state = 'SUCCEEDED';
    existingAttempt.trxID = execResult.trxID;
    existingAttempt.updatedAt = Date.now();
    await saveDurablePaymentAttempt(paymentID, existingAttempt);

    return res.json({
      success: true,
      trxID: execResult.trxID,
      tier: existingAttempt.tier,
      expiresAt: activation.expiresAt,
      amount: existingAttempt.amount,
      invoiceNumber: existingAttempt.invoiceNumber,
      message: activation.message,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Direct execute error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to execute payment with bKash API',
    });
  }
});

// 5. STATUS RECONCILIATION ENDPOINT (P0 PAYMENT RELIABILITY)
// ========================================================
paymentRouter.get('/reconcile/:paymentID', async (req: Request, res: Response) => {
  try {
    const { paymentID } = req.params;
    const attempt = await getDurablePaymentAttempt(paymentID);
    if (attempt) {
      return res.json({
        success: true,
        paymentID,
        state: attempt.state,
        tier: attempt.tier,
        amount: attempt.amount,
        trxID: attempt.trxID,
        invoiceNumber: attempt.invoiceNumber,
        isTerminal: attempt.state === 'SUCCEEDED' || attempt.state === 'FAILED' || attempt.state === 'CANCELLED',
        messageBn: attempt.state === 'SUCCEEDED' ? 'পেমেন্ট সফল ও যাচাইকৃত।' : 'পেমেন্টের অবস্থা যাচাই হচ্ছে...'
      });
    }
    // Fallback: check query API
    const statusData = await bKashService.queryPayment(paymentID);
    return res.json({
      success: true,
      paymentID,
      data: statusData,
      state: statusData.transactionStatus === 'Completed' ? 'SUCCEEDED' : 'PENDING'
    });
  } catch (err: any) {
    return res.json({
      success: false,
      state: 'UNKNOWN',
      messageBn: 'পেমেন্টের অবস্থা এখনো নিশ্চিত করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।',
      error: err?.message
    });
  }
});

paymentRouter.get('/query/:paymentID', async (req: Request, res: Response) => {
  try {
    const { paymentID } = req.params;
    const statusData = await bKashService.queryPayment(paymentID);
    return res.json({
      success: true,
      data: statusData,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Query error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to query payment' });
  }
});

// ========================================================
// 6. CURRENT USER'S SUBSCRIPTION TIER & LIMITS
// ========================================================
const getSubscriptionHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const identifier = user?.id || user?.email || (req.headers['x-user-id'] as string) || (req.query.userId as string);

    if (!identifier) {
      return res.json({
        success: true,
        tier: 'free',
        status: 'inactive',
        expiresAt: null,
        isLifetime: false,
        limits: SUBSCRIPTION_TIERS.free.limits,
      });
    }

    const sub = await subscriptionService.getUserSubscription(identifier);
    return res.json({
      success: true,
      ...sub,
      config: SUBSCRIPTION_TIERS[sub.tier],
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error fetching user subscription:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve subscription' });
  }
};

paymentRouter.get('/me', optionalAuth, getSubscriptionHandler);
paymentRouter.get('/subscription', optionalAuth, getSubscriptionHandler);

// ========================================================
// 7. MANUAL BKASH / NAGAD PAYMENT INSTRUCTIONS & SUBMISSION
// ========================================================
paymentRouter.get('/manual/instructions', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    accountInfo: {
      bkashNumber: process.env.MANUAL_PAY_BKASH_NUMBER || '01834348966',
      bkashNumberDisplay: '01834-348966',
      bkashAccountType: 'Personal / Send Money',
      nagadNumber: process.env.MANUAL_PAY_NAGAD_NUMBER || '01834348966',
      nagadNumberDisplay: '01834-348966',
      nagadAccountType: 'Personal / Send Money',
      helplinePhone: '01834348966',
      whatsappUrl: 'https://wa.me/8801834348966',
    },
    plans: [
      {
        id: 'starter',
        nameBn: 'নিহোমি Starter (মাসিক)',
        amountBdt: 990,
        interval: 'monthly',
      },
      {
        id: 'pro',
        nameBn: 'নিহোমি Pro (মাসিক - রেকমেন্ডেড)',
        amountBdt: 1990,
        interval: 'monthly',
      },
      {
        id: 'pro_quarterly',
        nameBn: 'নিহোমি Pro (৩ মাসের মাইলস্টোন)',
        amountBdt: 5670,
        interval: 'quarterly',
      },
      {
        id: 'japan_ready',
        nameBn: 'নিহোমি Japan Ready (মাসিক)',
        amountBdt: 3990,
        interval: 'monthly',
      },
      {
        id: 'japan_ready_yearly',
        nameBn: 'নিহোমি Japan Ready (বার্ষিক অল-অ্যাক্সেস)',
        amountBdt: 40700,
        interval: 'yearly',
      },
    ],
    matrix: CANONICAL_SUBSCRIPTION_MATRIX,
    stepsBn: [
      'আপনার bKash বা Nagad অ্যাপে যান এবং "Send Money" নির্বাচন করুন।',
      'আমাদের অফিসিয়াল নম্বরে কাঙ্ক্ষিত প্ল্যানের সমপরিমাণ টাকা পাঠান (01834348966)।',
      'সফলভাবে টাকা পাঠানোর পর প্রাপ্ত এসএমএস থেকে TrxID এবং আপনার প্রেরক নম্বর নিচে দিয়ে সাবমিট করুন।',
      'অ্যাডমিন যাচাই করার সাথে সাথেই আপনার ড্যাশবোর্ডে Pro কোর্স আনলক হয়ে যাবে (সর্বোচ্চ ৫-১৫ মিনিট)।',
    ],
  });
});

paymentRouter.post('/manual/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    return res.status(401).json({ success: false, error: 'Authentication required.', code: 'AUTH_REQUIRED' });
  }
  if (req.body.userId && req.body.userId !== user.id && user.role !== 'admin') {
    return res.status(400).json({ success: false, error: 'User ID in request does not match authenticated session.', code: 'IDENTITY_MISMATCH' });
  }
  try {
    const {
      senderPhone,
      trxID,
      selectedPlan,
      paymentMethod = 'bkash',
      studentName,
      note,
      billingInterval,
      amount,
    } = req.body;
    const user = req.user;

    const result = await subscriptionService.submitManualPayment({
      senderPhone,
      trxID,
      selectedPlan,
      paymentMethod,
      billingInterval,
      amount,
      userId: user?.id || (req.headers['x-user-id'] as string),
      userEmail: user?.email || req.body.email,
      studentName: studentName || user?.name || user?.displayName,
      note,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (err: any) {
    console.error('[PaymentRouter] Manual payment submission error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'পেমেন্ট সাবমিশন প্রক্রিয়াকরণে ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
    });
  }
});

// Student: Check own pending manual submission status
paymentRouter.get('/manual/my-pending', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const email = user?.email || (req.query.email as string);
    const userId = user?.id || (req.query.userId as string);
    if (!email && !userId) {
      return res.json({ success: true, pending: null });
    }

    const memSubmissions: any[] = (db.data as any).manualTrxSubmissions || [];
    const pending = memSubmissions.find(
      (s: any) =>
        s.status === 'pending' &&
        ((userId && s.userId === userId) || (email && s.studentEmail?.toLowerCase() === (email || '').toLowerCase()))
    );

    return res.json({
      success: true,
      pending: pending || null,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to query pending submission.' });
  }
});

// ========================================================
// 8. ADMIN PAYMENT VERIFICATION & 1-CLICK ACCESS GRANT
// ========================================================
const isFounderOrAdmin = (user: any) => {
  return (
    user?.role === 'admin' ||
    user?.role === 'founder' ||
    user?.email === 'mdtanvirkabirbiplob@gmail.com'
  );
};

paymentRouter.get('/admin/pending', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!isFounderOrAdmin(user)) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const memSubmissions = (db.data as any).manualTrxSubmissions || [];
    return res.json({
      success: true,
      submissions: memSubmissions,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error fetching admin pending submissions:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve pending submissions.' });
  }
});

paymentRouter.post('/admin/verify', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!isFounderOrAdmin(user)) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const { transactionId, trxID, submissionId, action = 'approve', reason } = req.body;
    const lookupKey = (trxID || transactionId || submissionId || '').trim().toUpperCase();

    if (!lookupKey) {
      return res.status(400).json({ success: false, error: 'Transaction ID or TrxID is required.' });
    }

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ success: false, error: 'Action must be "approve" or "reject".' });
    }

    // Find submission in memory
    if (!(db.data as any).manualTrxSubmissions) {
      (db.data as any).manualTrxSubmissions = [];
    }
    const submissions: any[] = (db.data as any).manualTrxSubmissions;
    let target = submissions.find(
      (s: any) =>
        s.id === transactionId ||
        s.id === submissionId ||
        s.trxId?.toUpperCase() === lookupKey
    );

    if (action === 'approve') {
      let planTier: SubscriptionTier = 'pro';
      const rawPlan = (target?.planId || req.body.planId || '').toLowerCase();
      if (rawPlan === 'starter') planTier = 'starter';
      else if (rawPlan === 'japan_ready' || rawPlan === 'japanready' || rawPlan === 'japan_ready_yearly') planTier = 'japan_ready';
      else if (rawPlan === 'n5_lifetime') planTier = 'n5_lifetime';
      else if (rawPlan === 'n5_pro') planTier = 'n5_pro';
      else planTier = 'pro';

      let planInterval: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' = (target?.billingInterval || req.body.billingInterval || 'monthly');
      if (rawPlan === 'pro_quarterly') planInterval = 'quarterly';
      if (rawPlan === 'japan_ready_yearly' || rawPlan === 'n5_lifetime') planInterval = 'yearly';

      const targetUserId = target?.userId || req.body.userId || 'usr_student';
      const targetEmail = target?.studentEmail || req.body.email || `${target?.studentPhone || 'student'}@nihomi.com`;
      const finalTrxID = target?.trxId || lookupKey;
      const amount = target?.amount || (SUBSCRIPTION_TIERS[planTier]?.priceBdt || 1990);

      // 1. Activate subscription atomically
      const activation = await subscriptionService.activateSubscription({
        userId: targetUserId,
        userEmail: targetEmail,
        tier: planTier,
        billingInterval: planInterval,
        trxID: finalTrxID,
        amount,
        paymentMethod: 'Manual bKash/Nagad (Admin Verified)',
      });

      // 2. Update memory submission record
      if (target) {
        target.status = 'approved';
        target.approvedAt = new Date().toISOString();
        target.approvedBy = user?.email || 'admin';
      } else {
        submissions.unshift({
          id: `subm_${Date.now()}_${finalTrxID}`,
          userId: targetUserId,
          studentName: req.body.studentName || 'Student',
          studentEmail: targetEmail,
          studentPhone: req.body.senderPhone || '018••••••66',
          trxId: finalTrxID,
          planId: planTier,
          planName: SUBSCRIPTION_TIERS[planTier].nameBn,
          amount,
          submittedAt: new Date().toISOString(),
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: user?.email || 'admin',
        });
      }

      // 3. Dispatch access notification to user
      try {
        db.createNotification({
          userId: targetUserId,
          type: 'achievement',
          title: '🎉 N5 Pro অ্যাক্সেস অনুমোদিত!',
          message: `আপনার পেমেন্ট (TrxID: ${finalTrxID}) ভেরিফাই সম্পন্ন হয়েছে। সকল লেসন ও ফুল মক টেস্ট এখন আনলক।`,
          link: '/study',
          priority: 'high',
        });
      } catch (e) {
        // quiet notification catch
      }

      db.save();

      return res.json({
        success: true,
        message: `✓ TrxID ${finalTrxID} সফলভাবে ভেরিফাই ও অ্যাক্টিভ করা হয়েছে!`,
        activation,
        submission: target,
      });
    } else {
      // Reject action
      if (target) {
        target.status = 'rejected';
        target.rejectedAt = new Date().toISOString();
        target.rejectedBy = user?.email || 'admin';
        target.rejectionReason = reason || 'অসঠিক বা অসম্পূর্ণ TrxID তথ্য।';
      }
      db.save();

      return res.json({
        success: true,
        message: `TrxID ${lookupKey} বাতিল করা হয়েছে।`,
        submission: target,
      });
    }
  } catch (err: any) {
    console.error('[PaymentRouter] Admin verify error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Verification failed.' });
  }
});

// ========================================================
// 9. SSLCOMMERZ GATEWAY INTEGRATION (MFS & CARDS)
// ========================================================
paymentRouter.post('/sslcommerz/init', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    return res.status(401).json({ success: false, error: 'Authentication required.', code: 'AUTH_REQUIRED' });
  }
  if (req.body.userId && req.body.userId !== user.id && user.role !== 'admin') {
    return res.status(400).json({ success: false, error: 'User ID mismatch.', code: 'IDENTITY_MISMATCH' });
  }
  try {
    const user = req.user;
    const {
      tier = 'n5_pro',
      planId,
      interval = 'monthly',
      currency = 'BDT',
      callbackUrl,
      successUrl,
      failUrl,
      cancelUrl,
      name,
      phone
    } = req.body;

    const resolvedPlanKey = (planId || tier || 'pro').toLowerCase();
    let amount: number;
    let selectedTier: SubscriptionTier;

    if (resolvedPlanKey === 'starter') {
      selectedTier = 'starter';
      amount = getCanonicalPrice('starter', interval);
    } else if (resolvedPlanKey === 'japan_ready' || resolvedPlanKey === 'japanready') {
      selectedTier = 'japan_ready';
      amount = getCanonicalPrice('japan_ready', interval);
    } else if (resolvedPlanKey === 'n5_lifetime') {
      selectedTier = 'n5_lifetime';
      amount = SUBSCRIPTION_TIERS.n5_lifetime?.priceBdt || 4990;
    } else {
      selectedTier = 'pro';
      amount = getCanonicalPrice('pro', interval);
    }

    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.pro;

    const resolvedUserId = user?.id || req.body.userId || 'usr_guest_' + Math.random().toString(36).substring(2, 8);
    const resolvedEmail = user?.email || req.body.email || 'student@nihomi.com';
    const resolvedName = name || user?.name || resolvedEmail.split('@')[0];
    const resolvedPhone = phone || (user as any)?.phone || '+8801834-348966';

    const isSslConfigured = Boolean(
      process.env.SSLCOMMERZ_STORE_ID &&
      !process.env.SSLCOMMERZ_STORE_ID.includes('placeholder') &&
      process.env.SSLCOMMERZ_STORE_ID !== 'nihomi_live_store'
    );
    if (!isSslConfigured) {
      console.log('[PaymentRouter] SSLCommerz gateway NOT_CONFIGURED. Returning honest state.');
      return res.json({
        success: false,
        gatewayStatus: 'NOT_CONFIGURED',
        state: 'NOT_CONFIGURED',
        message: 'অনলাইন পেমেন্ট গেটওয়ে এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।',
        messageBn: 'অনলাইন পেমেন্ট গেটওয়ে এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।'
      });
    }

    const result = await sslCommerzService.initSession({
      amount,
      currency,
      planTier: selectedTier,
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      userName: resolvedName,
      userPhone: resolvedPhone,
      callbackUrl,
      successUrl,
      failUrl,
      cancelUrl
    });

    return res.json(result);
  } catch (err: any) {
    console.error('[PaymentRouter] SSLCommerz init error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to initiate SSLCommerz session.'
    });
  }
});

const handleSslSuccess = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.query, ...req.body };
    const tranId = payload.tran_id || payload.paymentId || (req.query.paymentId as string);
    const valId = payload.val_id;

    console.log(`[PaymentRouter] SSLCommerz success callback for tranId: ${tranId}, valId: ${valId}`);

    const result = await sslCommerzService.processPaymentSuccess(payload);

    // If client requested JSON (API / Mobile / Test), return JSON
    if (req.headers.accept?.includes('application/json') || req.is('json')) {
      return res.json(result);
    }

    // Otherwise redirect to frontend callback
    const redirectParams = new URLSearchParams({
      status: 'success',
      provider: 'sslcommerz',
      trxID: result.tranId,
      tier: result.tier,
      amount: String(result.amount),
      invoiceNumber: result.invoiceNumber
    });

    return res.redirect(`/payment/callback?${redirectParams.toString()}`);
  } catch (err: any) {
    console.error('[PaymentRouter] SSLCommerz success processing error:', err);
    return res.redirect(`/payment/callback?status=failed&error=${encodeURIComponent(err?.message || 'SSLCommerz processing error')}`);
  }
};

paymentRouter.post('/sslcommerz/success', handleSslSuccess);
paymentRouter.get('/sslcommerz/success', handleSslSuccess);

const handleSslFail = (req: Request, res: Response) => {
  const payload = { ...req.query, ...req.body };
  const tranId = payload.tran_id || payload.paymentId || '';
  const errorMsg = payload.error || payload.failedreason || 'Payment failed on SSLCommerz gateway.';

  if (tranId) {
    try {
      db.updatePayment(tranId, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        failureReason: errorMsg
      });
      db.save();
    } catch {}
  }

  if (req.headers.accept?.includes('application/json')) {
    return res.status(400).json({ success: false, status: 'failed', error: errorMsg, tranId });
  }

  return res.redirect(`/payment/callback?status=failed&error=${encodeURIComponent(errorMsg)}&paymentID=${encodeURIComponent(tranId)}`);
};

paymentRouter.post('/sslcommerz/fail', handleSslFail);
paymentRouter.get('/sslcommerz/fail', handleSslFail);

const handleSslCancel = (req: Request, res: Response) => {
  const payload = { ...req.query, ...req.body };
  const tranId = payload.tran_id || payload.paymentId || '';

  if (tranId) {
    try {
      db.updatePayment(tranId, {
        status: 'cancelled',
        failureReason: 'Transaction cancelled by customer.'
      });
      db.save();
    } catch {}
  }

  if (req.headers.accept?.includes('application/json')) {
    return res.json({ success: true, status: 'cancelled', tranId });
  }

  return res.redirect(`/payment/callback?status=cancelled&paymentID=${encodeURIComponent(tranId)}`);
};

paymentRouter.post('/sslcommerz/cancel', handleSslCancel);
paymentRouter.get('/sslcommerz/cancel', handleSslCancel);

// SSLCommerz IPN (Instant Payment Notification) Webhook
paymentRouter.post('/sslcommerz/ipn', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const signatureValid = sslCommerzService.verifyIpnSignature(payload);

    if (!signatureValid && process.env.NODE_ENV === 'production') {
      console.warn('[PaymentRouter] SSLCommerz IPN signature verification failed.');
      return res.status(400).send('IPN signature invalid');
    }

    await sslCommerzService.processPaymentSuccess(payload);
    return res.status(200).send('IPN OK');
  } catch (err: any) {
    console.error('[PaymentRouter] SSLCommerz IPN error:', err);
    return res.status(500).send('IPN processing error');
  }
});

// ========================================================
// 10. STRIPE GATEWAY INTEGRATION (GLOBAL CARDS / USD / JPY)
// ========================================================
paymentRouter.post('/stripe/create-checkout-session', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    return res.status(401).json({ success: false, error: 'Authentication required.', code: 'AUTH_REQUIRED' });
  }
  if (req.body.userId && req.body.userId !== user.id && user.role !== 'admin') {
    return res.status(400).json({ success: false, error: 'User ID mismatch.', code: 'IDENTITY_MISMATCH' });
  }
  try {
    const user = req.user;
    const {
      tier = 'n5_pro',
      planId,
      amount: requestedAmount,
      currency = 'usd',
      successUrl,
      cancelUrl
    } = req.body;

    const selectedTier = (planId || tier) as SubscriptionTier;
    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.n5_pro;
    
    // Default international pricing: N5 Pro = $9.99 (or 599 BDT equivalent), Lifetime = $49.99
    let amount = Number(requestedAmount);
    if (!amount) {
      if (currency.toLowerCase() === 'usd') {
        amount = selectedTier === 'n5_lifetime' ? 49.99 : 9.99;
      } else if (currency.toLowerCase() === 'jpy') {
        amount = selectedTier === 'n5_lifetime' ? 7500 : 1500;
      } else {
        amount = planConfig.priceBdt || 599;
      }
    }

    const resolvedUserId = user?.id || req.body.userId || 'usr_guest_' + Math.random().toString(36).substring(2, 8);
    const resolvedEmail = user?.email || req.body.email || 'student@nihomi.com';

    const sessionResult = await stripePaymentService.createCheckoutSession({
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      planTier: selectedTier,
      amount,
      currency,
      successUrl,
      cancelUrl
    });

    return res.json(sessionResult);
  } catch (err: any) {
    console.error('[PaymentRouter] Stripe session error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create Stripe Checkout session.'
    });
  }
});

paymentRouter.post('/stripe/webhook', async (req: Request, res: Response) => {
  const sigHeader = (req.headers['stripe-signature'] || req.headers['x-stripe-signature']) as string | undefined;
  const rawBody = (req as any).rawBody || req.body;

  try {
    const signatureValid = stripePaymentService.verifyWebhookSignature(rawBody, sigHeader);

    if (!signatureValid && process.env.NODE_ENV === 'production' && stripePaymentService.isLiveConfigured) {
      console.warn('[PaymentRouter] Stripe webhook signature mismatch.');
      return res.status(400).json({ error: 'Webhook signature verification failed.' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const processResult = await stripePaymentService.processWebhookEvent(
      event,
      req.headers as Record<string, any>,
      sigHeader
    );

    return res.json({ received: true, ...processResult });
  } catch (err: any) {
    console.error('[PaymentRouter] Stripe webhook handling exception:', err);
    return res.status(500).json({ error: 'Webhook processing exception.' });
  }
});


