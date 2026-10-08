import { prisma, isDatabaseConfigured } from '../prisma.js';
import { db } from '../db.js';
import { coinWalletService, SUBSCRIPTION_COIN_ALLOWANCES } from './coinWalletService.js';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'japan_ready' | 'n5_pro' | 'n5_lifetime';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  nameBn: string;
  priceBdt: number;
  interval: 'free' | 'monthly' | 'lifetime';
  descriptionBn: string;
  featuresBn: string[];
  limits: {
    vocabPerDay: number;
    aiChatTurns: number;
    mockExamsAllowed: boolean;
    fullGrammarBankAllowed: boolean;
    srsFlashcardsAllowed: boolean;
    certificateAllowed: boolean;
  };
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    nameBn: 'ফ্রি (১০ টার্ন/দিন)',
    priceBdt: 0,
    interval: 'free',
    descriptionBn: 'শুরুর জন্য বেসিক জাপানিজ পরিচিতি ও দৈনিক ১০টি AI সেনসেই চ্যাট টার্ন',
    featuresBn: [
      'প্রতিদিন ১০টি ফ্রি AI সেনসেই চ্যাট টার্ন (Google Login এর পর)',
      'হিরাগানা ও কাতাকানা সম্পূর্ণ চার্ট',
      'বেসিক N5 প্র্যাকটিস কুইজ'
    ],
    limits: {
      vocabPerDay: 5,
      aiChatTurns: 10,
      mockExamsAllowed: false,
      fullGrammarBankAllowed: false,
      srsFlashcardsAllowed: false,
      certificateAllowed: false,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    nameBn: 'স্টারটার (৳৯৯০/মাস - ৫০০ কয়েন)',
    priceBdt: 990,
    interval: 'monthly',
    descriptionBn: 'নিয়মিত শিক্ষার্থীদের জন্য ৫০০ নিহোমি কয়েন ও পূর্ণ সিলেবাস',
    featuresBn: [
      'প্রতি মাসে ৫০০ নিহোমি কয়েন (১ কয়েন = ১ সেনসেই টার্ন)',
      'JLPT N5 ও N4 সম্পূর্ণ কারিকুলাম আনলক',
      'ভোকাবুলারি, ব্যাকরণ ও কাঞ্জি ডেক',
      'মাস্টারি কুইজ ও প্রগ্রেস ট্র্যাকিং'
    ],
    limits: {
      vocabPerDay: Infinity,
      aiChatTurns: 500,
      mockExamsAllowed: true,
      fullGrammarBankAllowed: true,
      srsFlashcardsAllowed: true,
      certificateAllowed: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameBn: 'প্রো (৳১,৯৯০/মাস - ১,৫০০ কয়েন)',
    priceBdt: 1990,
    interval: 'monthly',
    descriptionBn: 'সিরিয়াস শিক্ষার্থীদের জন্য ১,৫০০ নিহোমি কয়েন ও ফুল JLPT প্রিপারেশন',
    featuresBn: [
      'প্রতি মাসে ১,৫০০ নিহোমি কয়েন (১ কয়েন = ১ সেনসেই টার্ন)',
      'N5, N4 এবং ইন্টারমিডিয়েট N3 কোর্সসমূহ',
      'বিজনেস কেইগো ও কাজের জাপানিজ মাস্টারক্লাস',
      'সিমুলেটেড মক এক্সাম ও অ্যাডভান্সড রিটেনশন ট্র্যাকার'
    ],
    limits: {
      vocabPerDay: Infinity,
      aiChatTurns: 1500,
      mockExamsAllowed: true,
      fullGrammarBankAllowed: true,
      srsFlashcardsAllowed: true,
      certificateAllowed: false,
    },
  },
  japan_ready: {
    id: 'japan_ready',
    name: 'Japan Ready',
    nameBn: 'জাপান রেডি (৳৩,৯৯০/মাস - ৪,০০০ কয়েন)',
    priceBdt: 3990,
    interval: 'monthly',
    descriptionBn: 'জাপানে চাকরি ও অভিবাসনের জন্য ইনটেন্সিভ ৪,০০০ কয়েন ও কর্মক্ষেত্র সিমুলেশন',
    featuresBn: [
      'প্রতি মাসে ৪,০০০ নিহোমি কয়েন (১ কয়েন = ১ সেনসেই টার্ন)',
      'কর্মক্ষেত্র ও কনবিনি সিমুলেশন Hub',
      'জাপানি চাকরির ইন্টারভিউ প্রস্তুতি ও সংস্কৃতি শিষ্টাচার',
      'অফিসিয়াল সার্টিফিকেট ও প্রায়োরিটি সাপোর্ট'
    ],
    limits: {
      vocabPerDay: Infinity,
      aiChatTurns: 4000,
      mockExamsAllowed: true,
      fullGrammarBankAllowed: true,
      srsFlashcardsAllowed: true,
      certificateAllowed: true,
    },
  },
  n5_pro: {
    id: 'n5_pro',
    name: 'Pro (Legacy N5 Pro)',
    nameBn: 'N5 প্রো (মাসিক)',
    priceBdt: 1990,
    interval: 'monthly',
    descriptionBn: 'সম্পূর্ণ N5 সিলেবাস ও ১,৫০০ কয়েন',
    featuresBn: [
      'প্রতি মাসে ১,৫০০ নিহোমি কয়েন',
      'সম্পূর্ণ N5 ভোকাবুলারি ব্যাংক',
      'JLPT N5 অফিসিয়াল ফুল মক এক্সাম ইঞ্জিন'
    ],
    limits: {
      vocabPerDay: Infinity,
      aiChatTurns: 1500,
      mockExamsAllowed: true,
      fullGrammarBankAllowed: true,
      srsFlashcardsAllowed: true,
      certificateAllowed: false,
    },
  },
  n5_lifetime: {
    id: 'n5_lifetime',
    name: 'Japan Ready All-Access',
    nameBn: 'জাপান রেডি অল-অ্যাক্সেস',
    priceBdt: 4990,
    interval: 'lifetime',
    descriptionBn: 'আজীবন অ্যাক্সেস, সার্টিফিকেট ও ৪,০০০ কয়েন',
    featuresBn: [
      'আজীবন সম্পূর্ণ অ্যাক্সেস',
      '৪,০০০ নিহোমি কয়েন অন্তর্ভুক্ত',
      'ফুল JLPT N5 মক টেস্ট ও ভেরিফায়েড সার্টিফিকেট'
    ],
    limits: {
      vocabPerDay: Infinity,
      aiChatTurns: 4000,
      mockExamsAllowed: true,
      fullGrammarBankAllowed: true,
      srsFlashcardsAllowed: true,
      certificateAllowed: true,
    },
  },
};

export interface ActivateSubscriptionParams {
  userId: string;
  userEmail?: string;
  tier: SubscriptionTier;
  trxID: string;
  amount: number;
  paymentID?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
}

export class SubscriptionService {
  private static instance: SubscriptionService;

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Retrieves tier configuration
   */
  public getTierConfig(tier: SubscriptionTier): TierConfig {
    return SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;
  }

  /**
   * Returns all available production plans
   */
  public getCatalog(): TierConfig[] {
    return Object.values(SUBSCRIPTION_TIERS);
  }

  /**
   * Resolves the user's current effective subscription tier and limits.
   * Performs automatic expiration evaluation.
   */
  public async getUserSubscription(userIdOrEmail: string): Promise<{
    tier: SubscriptionTier;
    status: 'active' | 'inactive' | 'expired';
    expiresAt: Date | null;
    isLifetime: boolean;
    limits: TierConfig['limits'];
  }> {
    // 1. Check if user is founder/admin in memory db
    const memUser = db.findUserById(userIdOrEmail) || db.findUserByEmail(userIdOrEmail);
    if (
      (memUser?.role as string) === 'founder' ||
      memUser?.role === 'admin' ||
      memUser?.email === 'mdtanvirkabirbiplob@gmail.com'
    ) {
      return {
        tier: 'n5_lifetime',
        status: 'active',
        expiresAt: null,
        isLifetime: true,
        limits: SUBSCRIPTION_TIERS.n5_lifetime.limits,
      };
    }

    // 2. Try querying PostgreSQL via Prisma if configured
    if (isDatabaseConfigured()) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [{ id: userIdOrEmail }, { email: userIdOrEmail }],
          },
          select: {
            id: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            subscriptionExpiresAt: true,
          },
        });

        if (dbUser && dbUser.subscriptionTier) {
          const tier = (dbUser.subscriptionTier as SubscriptionTier) || 'free';
          const expiresAt = dbUser.subscriptionExpiresAt;
          const now = new Date();

          // Check expiration
          if (expiresAt && expiresAt < now && tier !== 'free') {
            // Tier has expired
            return {
              tier: 'free',
              status: 'expired',
              expiresAt,
              isLifetime: false,
              limits: SUBSCRIPTION_TIERS.free.limits,
            };
          }

          const isLifetime = tier === 'n5_lifetime' || !expiresAt;
          const config = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;

          return {
            tier,
            status: (dbUser.subscriptionStatus as any) || 'active',
            expiresAt,
            isLifetime,
            limits: config.limits,
          };
        }
      } catch (err) {
        console.warn('[SubscriptionService] Prisma query fallback to memory db:', (err as any)?.message);
      }
    }

    // 3. Fallback to memory db
    if (memUser) {
      const memSub = db.getUserActiveSubscription(memUser.id);
      if (memSub && memSub.status === 'active') {
        const tier: SubscriptionTier = (memSub.planId as string) === 'n5_lifetime' ? 'n5_lifetime' : 'n5_pro';
        const expiresAt = memSub.currentPeriodEnd ? new Date(memSub.currentPeriodEnd) : null;
        const isLifetime = tier === 'n5_lifetime';
        const config = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.free;
        return {
          tier,
          status: 'active',
          expiresAt,
          isLifetime,
          limits: config.limits,
        };
      }
    }

    return {
      tier: 'free',
      status: 'inactive',
      expiresAt: null,
      isLifetime: false,
      limits: SUBSCRIPTION_TIERS.free.limits,
    };
  }

  /**
   * Activates a subscription atomically upon verified bKash payment.
   * Enforces idempotency via trxID uniqueness check to prevent duplicate activations or replay attacks.
   */
  public async activateSubscription(params: ActivateSubscriptionParams): Promise<{
    success: boolean;
    tier: SubscriptionTier;
    expiresAt: Date | null;
    trxID: string;
    invoiceNumber: string;
    message: string;
  }> {
    const { userId, tier, trxID, amount, paymentID } = params;
    const invoiceNumber = params.invoiceNumber || `INV_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    console.log(`[SubscriptionService] Activating tier '${tier}' for user ${userId} with trxID ${trxID}`);

    // 1. Calculate subscription expiration
    let expiresAt: Date | null = null;
    if (tier === 'n5_pro') {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    } else if (tier === 'n5_lifetime') {
      expiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 years perpetual
    }

    // 2. Persist in PostgreSQL via Prisma if configured (with duplicate transaction idempotency protection)
    if (isDatabaseConfigured()) {
      try {
        // Find or resolve user in Prisma
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ id: userId }, { email: params.userEmail || userId }],
          },
        });

        if (!user && params.userEmail) {
          user = await prisma.user.create({
            data: {
              email: params.userEmail,
              name: params.userEmail.split('@')[0],
              subscriptionTier: tier,
              subscriptionStatus: 'active',
              subscriptionExpiresAt: expiresAt,
            },
          });
        }

        if (user) {
          // Idempotency: Check if trxID already recorded
          const existingPayment = await prisma.payment.findUnique({
            where: { providerTransactionId: trxID },
          });

          if (existingPayment && existingPayment.status === 'paid') {
            console.warn(`[SubscriptionService] Idempotency notice: TrxID ${trxID} already processed.`);
            return {
              success: true,
              tier,
              expiresAt: user.subscriptionExpiresAt,
              trxID,
              invoiceNumber: existingPayment.invoiceNumber || invoiceNumber,
              message: 'Subscription already active for this transaction.',
            };
          }

          // Atomically update user tier
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionTier: tier,
              subscriptionStatus: 'active',
              subscriptionExpiresAt: expiresAt,
            },
          });

          // Create immutable payment audit record
          await prisma.payment.upsert({
            where: { providerTransactionId: trxID },
            update: {
              status: 'paid',
              paidAt: new Date(),
              amount,
              paymentID: paymentID || null,
              invoiceNumber,
            },
            create: {
              userId: user.id,
              paymentProvider: 'bkash',
              providerTransactionId: trxID,
              paymentID: paymentID || null,
              invoiceNumber,
              amount,
              currency: 'BDT',
              status: 'paid',
              paymentMethod: params.paymentMethod || 'bKash MFS',
              paidAt: new Date(),
              metadata: {
                tier,
                paymentID,
                invoiceNumber,
                activatedAt: new Date().toISOString(),
              },
            },
          });

          console.log(`[SubscriptionService] PostgreSQL update succeeded for user ${user.id}`);
        }
      } catch (err: any) {
        console.error('[SubscriptionService] Prisma persistence warning:', err?.message);
      }
    }

    // 3. Atomically sync with memory db
    try {
      const targetUserId = userId;
      let memUser = db.findUserById(targetUserId) || db.findUserByEmail(params.userEmail || targetUserId);

      if (memUser) {
        (memUser as any).planId = tier;
        (memUser as any).subscriptionTier = tier;
        (memUser as any).subscriptionStatus = 'active';
        (memUser as any).subscriptionExpiresAt = expiresAt?.toISOString();
        memUser.updatedAt = new Date().toISOString();
      }

      // Record in memory subscriptions
      let existingSub = db.getUserActiveSubscription(targetUserId);
      if (existingSub) {
        db.cancelSubscription(existingSub.id, true);
      }

      db.createSubscription({
        userId: targetUserId,
        planId: tier as any,
        billingInterval: tier === 'n5_lifetime' ? ('yearly' as any) : ('monthly' as any),
        status: 'active',
        paymentMethod: 'bKash Tokenized Gateway',
        lastPaymentId: paymentID || trxID,
      });

      // Record in memory payments
      const memPayment = db.createPayment({
        userId: targetUserId,
        planId: tier as any,
        planName: SUBSCRIPTION_TIERS[tier].name,
        billingInterval: tier === 'n5_lifetime' ? ('yearly' as any) : ('monthly' as any),
        amount,
        originalAmount: amount,
        discountAmount: 0,
        provider: 'bkash',
      });

      db.updatePayment(memPayment.id, {
        status: 'paid',
        providerTransactionId: trxID,
        paidAt: new Date().toISOString(),
        paymentMethodDetails: {
          type: 'bKash Tokenized Checkout',
          gatewayName: 'bKash PGW v1.2.0',
        },
      });

      // Credit monthly included coins & AI credits
      const bonusCoins = SUBSCRIPTION_COIN_ALLOWANCES[tier] || (tier === 'n5_lifetime' ? 4000 : 1500);
      const bonusAi = bonusCoins * 2;
      db.creditUserCoinsAndAI(targetUserId, bonusCoins, bonusAi, `Subscription Unlock: ${SUBSCRIPTION_TIERS[tier]?.name || tier}`);

      // Authoritative PostgreSQL grant & ledger entry
      await coinWalletService.grantCoins({
        userId: targetUserId,
        amount: bonusCoins,
        source: 'SUBSCRIPTION',
        referenceId: trxID,
        description: `Monthly subscription allowance: ${SUBSCRIPTION_TIERS[tier]?.name || tier}`
      }).catch(err => console.warn('[SubscriptionService] grantCoins error:', err?.message));

      db.save();
      console.log(`[SubscriptionService] In-memory DB synced successfully for user ${targetUserId}`);
    } catch (err: any) {
      console.error('[SubscriptionService] In-memory DB sync error:', err?.message);
    }

    return {
      success: true,
      tier,
      expiresAt,
      trxID,
      invoiceNumber,
      message: `🎉 অভিনন্দন! আপনার ${SUBSCRIPTION_TIERS[tier].nameBn} সফলভাবে অ্যাক্টিভ হয়েছে।`,
    };
  }

  /**
   * Checks if a user has sufficient tier privileges to access a resource.
   */
  public async canAccess(
    userIdOrEmail: string,
    requiredTier: 'n5_pro' | 'n5_lifetime'
  ): Promise<{ allowed: boolean; currentTier: SubscriptionTier; reason?: string }> {
    const sub = await this.getUserSubscription(userIdOrEmail);

    if (sub.tier === 'n5_lifetime') {
      return { allowed: true, currentTier: 'n5_lifetime' };
    }

    if (requiredTier === 'n5_pro' && sub.tier === 'n5_pro') {
      return { allowed: true, currentTier: 'n5_pro' };
    }

    return {
      allowed: false,
      currentTier: sub.tier,
      reason: `এই ফিচারটি আনলক করতে ${SUBSCRIPTION_TIERS[requiredTier].nameBn} সাবস্ক্রিপশন প্রয়োজন।`,
    };
  }

  /**
   * Evaluates AI Sensei daily conversation quota and coin availability:
   * - Free Users: 10 daily free turns / day after Google Login.
   * - If daily free turns exhausted: checks persistent Nihomi Coin wallet (1 Coin = 1 Turn).
   * - Paid Users: uses included monthly coins + purchased/reward coins.
   */
  public async checkDailyAiChatQuota(userIdOrEmail: string): Promise<{
    allowed: boolean;
    useCoin: boolean;
    remainingTurns: number;
    currentTurnsToday: number;
    maxDailyTurns: number;
    tier: SubscriptionTier;
    remainingCoins?: number;
    autoTopupTriggered?: boolean;
  }> {
    const sub = await this.getUserSubscription(userIdOrEmail);
    const wallet = await coinWalletService.getWallet(userIdOrEmail);

    const isPaid = sub.tier !== 'free';

    if (isPaid) {
      if (wallet.coinBalance >= 1) {
        return {
          allowed: true,
          useCoin: true,
          remainingTurns: wallet.coinBalance,
          currentTurnsToday: 0,
          maxDailyTurns: Infinity,
          tier: sub.tier,
          remainingCoins: wallet.coinBalance,
        };
      }

      if (wallet.autoTopupEnabled) {
        return {
          allowed: true,
          useCoin: true,
          autoTopupTriggered: true,
          remainingTurns: 500,
          currentTurnsToday: 0,
          maxDailyTurns: Infinity,
          tier: sub.tier,
          remainingCoins: wallet.coinBalance,
        };
      }

      return {
        allowed: false,
        useCoin: true,
        remainingTurns: 0,
        currentTurnsToday: 0,
        maxDailyTurns: Infinity,
        tier: sub.tier,
        remainingCoins: 0,
      };
    }

    // Free tier - check 10 daily free turns
    const todayKey = new Date().toISOString().split('T')[0];
    if (!(db.data as any).dailyAiChatUsage) {
      (db.data as any).dailyAiChatUsage = {};
    }
    const userDailyKey = `${userIdOrEmail}_${todayKey}`;
    const currentTurns = (db.data as any).dailyAiChatUsage[userDailyKey] || 0;
    const maxDailyTurns = 10;

    if (currentTurns < maxDailyTurns) {
      return {
        allowed: true,
        useCoin: false,
        remainingTurns: maxDailyTurns - currentTurns,
        currentTurnsToday: currentTurns,
        maxDailyTurns,
        tier: 'free',
        remainingCoins: wallet.coinBalance,
      };
    }

    // Free turns exhausted: fallback to Nihomi Coins (1 Coin = 1 Sensei Turn)!
    if (wallet.coinBalance >= 1) {
      return {
        allowed: true,
        useCoin: true,
        remainingTurns: wallet.coinBalance,
        currentTurnsToday: currentTurns,
        maxDailyTurns,
        tier: 'free',
        remainingCoins: wallet.coinBalance,
      };
    }

    if (wallet.autoTopupEnabled) {
      return {
        allowed: true,
        useCoin: true,
        autoTopupTriggered: true,
        remainingTurns: 500,
        currentTurnsToday: currentTurns,
        maxDailyTurns,
        tier: 'free',
        remainingCoins: wallet.coinBalance,
      };
    }

    return {
      allowed: false,
      useCoin: false,
      remainingTurns: 0,
      currentTurnsToday: currentTurns,
      maxDailyTurns,
      tier: 'free',
      remainingCoins: 0,
    };
  }

  /**
   * Atomically records a consumed AI Sensei turn for daily quota tracking.
   */
  public recordDailyAiChatTurn(userIdOrEmail: string): number {
    const todayKey = new Date().toISOString().split('T')[0];
    if (!(db.data as any).dailyAiChatUsage) {
      (db.data as any).dailyAiChatUsage = {};
    }
    const userDailyKey = `${userIdOrEmail}_${todayKey}`;
    const currentTurns = ((db.data as any).dailyAiChatUsage[userDailyKey] || 0) + 1;
    (db.data as any).dailyAiChatUsage[userDailyKey] = currentTurns;
    db.save();
    return currentTurns;
  }

  /**
   * Submits a manual bKash / Nagad Send Money payment for admin 1-click verification.
   * Performs fraud check, duplicate trxID detection, and saves transaction in pending state.
   */
  public async submitManualPayment(params: {
    senderPhone: string;
    trxID: string;
    selectedPlan: 'n5_pro' | 'n5_lifetime';
    paymentMethod?: 'bkash' | 'nagad' | string;
    userId?: string;
    userEmail?: string;
    studentName?: string;
    note?: string;
  }): Promise<{
    success: boolean;
    duplicate?: boolean;
    error?: string;
    status?: 'PENDING_VERIFICATION';
    transaction?: {
      id: string;
      trxID: string;
      senderPhone: string;
      amount: number;
      selectedPlan: 'n5_pro' | 'n5_lifetime';
      planName: string;
      paymentMethod: string;
      submittedAt: string;
      helplinePhone: string;
    };
  }> {
    const { senderPhone, trxID, selectedPlan, paymentMethod = 'bkash' } = params;

    // 1. Validation
    if (!trxID || typeof trxID !== 'string') {
      return { success: false, error: 'ট্রানজেকশন আইডি (TrxID) আবশ্যক।' };
    }
    const cleanTrx = trxID.trim().toUpperCase();
    if (cleanTrx.length < 8 || cleanTrx.length > 14) {
      return { success: false, error: 'অনুগ্রহ করে সঠিক ৮-১৪ অক্ষরের bKash বা Nagad TrxID প্রদান করুন।' };
    }

    if (!senderPhone || typeof senderPhone !== 'string') {
      return { success: false, error: 'প্রেরক মোবাইল নম্বর (Sender Phone) আবশ্যক।' };
    }
    const cleanPhone = senderPhone.replace(/[\s-]/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return { success: false, error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর প্রদান করুন (যেমন: 01712345678)।' };
    }

    if (selectedPlan !== 'n5_pro' && selectedPlan !== 'n5_lifetime') {
      return { success: false, error: 'সঠিক সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন (n5_pro বা n5_lifetime)।' };
    }

    // 2. Anti-fraud: Duplicate TrxID check
    if (isDatabaseConfigured()) {
      try {
        const existingPrismaPayment = await prisma.payment.findFirst({
          where: { providerTransactionId: cleanTrx },
        });
        if (existingPrismaPayment) {
          return {
            success: false,
            duplicate: true,
            error: `TrxID ${cleanTrx} ইতোমধ্যেই সাবমিট করা হয়েছে। ভেরিফিকেশনের জন্য অনুগ্রহ করে অপেক্ষা করুন বা হেল্পলাইনে যোগাযোগ করুন।`,
          };
        }
      } catch (err: any) {
        console.warn('[SubscriptionService] Prisma check warning:', err?.message);
      }
    }

    // In-memory duplicate check
    if (!(db.data as any).manualTrxSubmissions) {
      (db.data as any).manualTrxSubmissions = [];
    }
    const memSubmissions: any[] = (db.data as any).manualTrxSubmissions;
    const isMemDuplicate = memSubmissions.some((s) => s.trxId?.toUpperCase() === cleanTrx);
    if (isMemDuplicate) {
      return {
        success: false,
        duplicate: true,
        error: `TrxID ${cleanTrx} ইতোমধ্যেই সাবমিট করা হয়েছে। ভেরিফিকেশনের জন্য অপেক্ষা করুন।`,
      };
    }

    const planConfig = SUBSCRIPTION_TIERS[selectedPlan];
    const amount = planConfig.priceBdt;
    const targetUserId = params.userId || (params.userEmail ? `usr_${params.userEmail.replace(/[@.]/g, '_')}` : `usr_guest_${Date.now()}`);
    const targetEmail = params.userEmail || `${cleanPhone}@nihomi.student`;
    const targetName = params.studentName || targetEmail.split('@')[0] || 'Nihomi Student';
    const submissionId = `subm_${Date.now()}_${cleanTrx}`;
    const submittedAt = new Date().toISOString();

    // 3. Record in Prisma if configured
    if (isDatabaseConfigured()) {
      try {
        let user = await prisma.user.findFirst({
          where: { OR: [{ id: targetUserId }, { email: targetEmail }] },
        });
        if (!user && targetEmail) {
          user = await prisma.user.create({
            data: {
              id: targetUserId.startsWith('usr_') ? targetUserId : undefined,
              email: targetEmail,
              name: targetName,
              subscriptionTier: 'free',
              subscriptionStatus: 'pending',
            },
          });
        }

        if (user) {
          await prisma.payment.create({
            data: {
              userId: user.id,
              paymentProvider: paymentMethod === 'nagad' ? 'nagad_manual' : 'bkash_manual',
              providerTransactionId: cleanTrx,
              amount,
              currency: 'BDT',
              status: 'pending',
              paymentMethod: `${paymentMethod.toUpperCase()} Send Money (Manual Submission)`,
              metadata: {
                senderPhone: cleanPhone,
                selectedPlan,
                planNameBn: planConfig.nameBn,
                studentName: targetName,
                note: params.note || null,
                submittedAt,
                verificationStatus: 'PENDING_VERIFICATION',
              },
            },
          });
        }
      } catch (err: any) {
        console.warn('[SubscriptionService] Prisma manual payment insert warning:', err?.message);
      }
    }

    // 4. Record in in-memory DB
    const memPayment = db.createPayment({
      userId: targetUserId,
      planId: selectedPlan as any,
      planName: planConfig.name,
      billingInterval: selectedPlan === 'n5_lifetime' ? ('yearly' as any) : ('monthly' as any),
      amount,
      originalAmount: amount,
      discountAmount: 0,
      provider: paymentMethod === 'nagad' ? 'nagad' : 'bkash',
    });

    db.updatePayment(memPayment.id, {
      status: 'pending',
      providerTransactionId: cleanTrx,
      paymentMethodDetails: {
        type: `${paymentMethod.toUpperCase()} Send Money (Manual)`,
        accountNumberMasked: cleanPhone.slice(-4).padStart(11, '•'),
        senderPhone: cleanPhone,
        verificationStatus: 'PENDING_VERIFICATION',
      },
    });

    // Save in manualTrxSubmissions for admin dashboard
    const submissionRecord = {
      id: submissionId,
      userId: targetUserId,
      studentName: targetName,
      studentEmail: targetEmail,
      studentPhone: cleanPhone,
      trxId: cleanTrx,
      planId: selectedPlan,
      planName: planConfig.nameBn,
      billingInterval: selectedPlan === 'n5_lifetime' ? 'yearly' : 'monthly',
      amount,
      paymentMethod,
      submittedAt,
      status: 'pending',
      paymentId: memPayment.id,
      note: params.note || '',
    };
    (db.data as any).manualTrxSubmissions.unshift(submissionRecord);
    db.save();

    console.log(`[SubscriptionService] Manual payment recorded: ${cleanTrx}, Phone: ${cleanPhone}, Plan: ${selectedPlan}`);

    return {
      success: true,
      status: 'PENDING_VERIFICATION',
      transaction: {
        id: submissionId,
        trxID: cleanTrx,
        senderPhone: cleanPhone,
        amount,
        selectedPlan,
        planName: planConfig.nameBn,
        paymentMethod: paymentMethod.toUpperCase(),
        submittedAt,
        helplinePhone: '01834348966',
      },
    };
  }

  /**
   * ADMIN BOOTSTRAP & RBAC SEEDING:
   * Asserts and persists user with email `mdtanvirkabirbiplob@gmail.com` as 'admin'
   * both in the native database and directly in Supabase PostgreSQL (users & profiles).
   */
  public async bootstrapAdminUser(email: string = 'mdtanvirkabirbiplob@gmail.com') {
    const targetEmail = email.trim().toLowerCase();
    let user = db.findUserByEmail(targetEmail);

    if (!user) {
      const created = db.createUser({
        email: targetEmail,
        password: 'AdminPassword#2026',
        displayName: 'Tanvir Kabir (Founder)',
        role: 'admin',
        targetLevel: 'N5',
        nativeLanguage: 'Bengali',
      });
      user = created.user;
    } else if (user.role !== 'admin') {
      user.role = 'admin';
      db.save();
    }

    // Persist and verify in Supabase PostgreSQL
    try {
      const { getSupabase } = await import('../supabase.js');
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          name: 'Tanvir Kabir (Founder)',
          full_name: 'Tanvir Kabir (Founder)',
          role: 'ADMIN',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: 'Tanvir Kabir (Founder)',
          target_jlpt_level: 'N5',
          preferred_language: 'bn',
          country: 'Bangladesh',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      }
    } catch (err: any) {
      console.warn('[SubscriptionService] Supabase admin sync note:', err.message);
    }

    console.log(`[SubscriptionService] Verified admin RBAC for: ${targetEmail}`);
    return user;
  }

  /**
   * Retrieves pending manual submission for a student
   */
  public getPendingManualSubmission(userIdOrEmail: string) {
    const submissions: any[] = (db.data as any).manualTrxSubmissions || [];
    const clean = userIdOrEmail.trim().toLowerCase();
    return submissions.find(
      (s: any) =>
        s.status === 'pending' &&
        (s.userId === userIdOrEmail || s.studentEmail?.toLowerCase() === clean)
    ) || null;
  }
}

export const subscriptionService = SubscriptionService.getInstance();
