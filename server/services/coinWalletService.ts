import crypto from 'crypto';
import pg from 'pg';
import { db } from '../db.js';

const { Pool } = pg;

export type CoinTransactionType =
  | 'GRANT'
  | 'PURCHASE'
  | 'REWARD'
  | 'USAGE'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT'
  | 'EXPIRATION';

export type CoinSource =
  | 'SUBSCRIPTION'
  | 'PURCHASE'
  | 'REWARD'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT';

export interface CoinWallet {
  userId: string;
  coinBalance: number;
  monthlyRewardCoins: number;
  rewardPeriodMonth: string;
  autoTopupEnabled: boolean;
  autoTopupThreshold: number;
  autoTopupPack: string;
  monthlySpendingCap: number;
  currentMonthSpent: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoinTransaction {
  transactionId: string;
  userId: string;
  type: CoinTransactionType;
  amount: number;
  source: CoinSource;
  referenceId: string | null;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export const REWARD_CONFIG = {
  values: {
    daily_goal: 1,
    lesson_complete: 2,
    mission_complete: 3,
    mastery_check: 5,
    streak_7d: 5,
    speaking_practice: 2,
    weekly_goal: 5,
  } as Record<string, number>,
  monthlyCaps: {
    free: 100,
    starter: 150,
    pro: 300,
    japan_ready: 600,
  } as Record<string, number>,
};

export const COIN_TOPUP_PACKS = [
  { id: 'coins_100', coins: 100, priceBdt: 199, name: '100 Nihomi Coins' },
  { id: 'coins_500', coins: 500, priceBdt: 899, name: '500 Nihomi Coins', popular: true },
  { id: 'coins_1000', coins: 1000, priceBdt: 1599, name: '1,000 Nihomi Coins' },
  { id: 'coins_2000', coins: 2000, priceBdt: 2999, name: '2,000 Nihomi Coins' },
];

export const SUBSCRIPTION_COIN_ALLOWANCES = {
  free: 0,
  starter: 500,
  pro: 1500,
  japan_ready: 4000,
} as Record<string, number>;

let poolInstance: pg.Pool | null = null;

function getPool(): pg.Pool | null {
  if (poolInstance) return poolInstance;
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl) return null;
  try {
    poolInstance = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    return poolInstance;
  } catch (err) {
    console.warn('[CoinWalletService] PostgreSQL pool creation warning:', err);
    return null;
  }
}

export class CoinWalletService {
  private static instance: CoinWalletService;

  public static getInstance(): CoinWalletService {
    if (!CoinWalletService.instance) {
      CoinWalletService.instance = new CoinWalletService();
    }
    return CoinWalletService.instance;
  }

  /**
   * Retrieves user's wallet with PostgreSQL authoritative persistence
   */
  public async getWallet(userId: string): Promise<CoinWallet> {
    const pool = getPool();
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    if (pool) {
      try {
        const res = await pool.query(
          `SELECT * FROM public.coin_wallets WHERE user_id = $1`,
          [userId]
        );

        if (res.rows.length > 0) {
          const row = res.rows[0];
          let monthlyRewards = row.monthly_reward_coins || 0;
          let rewardMonth = row.reward_period_month || currentMonth;

          // Reset monthly reward cap counter if month turned over
          if (rewardMonth !== currentMonth) {
            monthlyRewards = 0;
            rewardMonth = currentMonth;
            await pool.query(
              `UPDATE public.coin_wallets SET monthly_reward_coins = 0, reward_period_month = $1 WHERE user_id = $2`,
              [currentMonth, userId]
            );
          }

          return {
            userId: row.user_id,
            coinBalance: Number(row.coin_balance || 0),
            monthlyRewardCoins: Number(monthlyRewards),
            rewardPeriodMonth: rewardMonth,
            autoTopupEnabled: Boolean(row.auto_topup_enabled),
            autoTopupThreshold: Number(row.auto_topup_threshold || 50),
            autoTopupPack: row.auto_topup_pack || 'coins_500',
            monthlySpendingCap: Number(row.monthly_spending_cap || 5000),
            currentMonthSpent: Number(row.current_month_spent || 0),
            lifetimeEarned: Number(row.lifetime_earned || 0),
            lifetimeSpent: Number(row.lifetime_spent || 0),
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
          };
        }

        // Initialize new wallet in PostgreSQL
        const insertRes = await pool.query(
          `INSERT INTO public.coin_wallets (
            user_id, coin_balance, monthly_reward_coins, reward_period_month,
            auto_topup_enabled, auto_topup_threshold, auto_topup_pack,
            monthly_spending_cap, current_month_spent, lifetime_earned, lifetime_spent
          ) VALUES ($1, 0, 0, $2, false, 50, 'coins_500', 5000, 0, 0, 0)
          RETURNING *`,
          [userId, currentMonth]
        );

        const r = insertRes.rows[0];
        return {
          userId: r.user_id,
          coinBalance: Number(r.coin_balance || 0),
          monthlyRewardCoins: Number(r.monthly_reward_coins || 0),
          rewardPeriodMonth: r.reward_period_month,
          autoTopupEnabled: Boolean(r.auto_topup_enabled),
          autoTopupThreshold: Number(r.auto_topup_threshold || 50),
          autoTopupPack: r.auto_topup_pack || 'coins_500',
          monthlySpendingCap: Number(r.monthly_spending_cap || 5000),
          currentMonthSpent: Number(r.current_month_spent || 0),
          lifetimeEarned: Number(r.lifetime_earned || 0),
          lifetimeSpent: Number(r.lifetime_spent || 0),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn('[CoinWalletService] PostgreSQL getWallet fallback:', err);
      }
    }

    // Resilient memory fallback
    const mem = db.getUserWallet(userId);
    return {
      userId,
      coinBalance: mem.coinBalance || 0,
      monthlyRewardCoins: 0,
      rewardPeriodMonth: currentMonth,
      autoTopupEnabled: false,
      autoTopupThreshold: 50,
      autoTopupPack: 'coins_500',
      monthlySpendingCap: 5000,
      currentMonthSpent: 0,
      lifetimeEarned: mem.lifetimeEarned || 0,
      lifetimeSpent: mem.lifetimeSpent || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Authoritatively grants coins with immutable ledger entry
   */
  public async grantCoins(params: {
    userId: string;
    amount: number;
    source: CoinSource;
    referenceId?: string;
    description: string;
  }): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
    const { userId, amount, source, referenceId, description } = params;
    if (amount <= 0) {
      throw new Error('Grant amount must be positive.');
    }

    const pool = getPool();
    const transactionId = `tx_${crypto.randomUUID()}`;
    const txType: CoinTransactionType =
      source === 'REWARD' ? 'REWARD' : source === 'PURCHASE' ? 'PURCHASE' : 'GRANT';

    if (pool) {
      try {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          // Upsert wallet and increment
          const currentMonth = new Date().toISOString().slice(0, 7);
          const walletRes = await client.query(
            `INSERT INTO public.coin_wallets (
              user_id, coin_balance, monthly_reward_coins, reward_period_month,
              auto_topup_enabled, auto_topup_threshold, auto_topup_pack,
              monthly_spending_cap, current_month_spent, lifetime_earned, lifetime_spent
            ) VALUES ($1, $2, 0, $3, false, 50, 'coins_500', 5000, 0, $2, 0)
            ON CONFLICT (user_id) DO UPDATE SET
              coin_balance = public.coin_wallets.coin_balance + $2,
              lifetime_earned = public.coin_wallets.lifetime_earned + $2,
              updated_at = NOW()
            RETURNING coin_balance`,
            [userId, amount, currentMonth]
          );

          const newBalance = Number(walletRes.rows[0].coin_balance);

          // Append immutable ledger entry
          await client.query(
            `INSERT INTO public.coin_transactions (
              transaction_id, user_id, type, amount, source, reference_id, description, balance_after, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
            [transactionId, userId, txType, amount, source, referenceId || null, description, newBalance]
          );

          await client.query('COMMIT');

          // Mirror into in-memory db
          db.creditUserCoinsAndAI(userId, amount, 0, description);

          return { success: true, newBalance, transactionId };
        } catch (txErr) {
          await client.query('ROLLBACK');
          throw txErr;
        } finally {
          client.release();
        }
      } catch (err) {
        console.warn('[CoinWalletService] PostgreSQL grantCoins fallback:', err);
      }
    }

    // Fallback memory update
    const memRes = db.creditUserCoinsAndAI(userId, amount, 0, description);
    return { success: true, newBalance: memRes.coinBalance, transactionId };
  }

  /**
   * Authoritatively deducts exactly 1 Coin for 1 AI Sensei Turn.
   * Atomic check: Fails if coinBalance < 1.
   */
  public async deductCoinForTurn(params: {
    userId: string;
    referenceId?: string;
    description?: string;
  }): Promise<{ success: boolean; newBalance: number; transactionId?: string; error?: string }> {
    const { userId, referenceId, description = '1 AI Sensei Turn consumed' } = params;
    const pool = getPool();
    const transactionId = `tx_${crypto.randomUUID()}`;

    if (pool) {
      try {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          const selectRes = await client.query(
            `SELECT coin_balance FROM public.coin_wallets WHERE user_id = $1 FOR UPDATE`,
            [userId]
          );

          if (selectRes.rows.length === 0 || Number(selectRes.rows[0].coin_balance) < 1) {
            await client.query('ROLLBACK');
            return {
              success: false,
              newBalance: selectRes.rows.length > 0 ? Number(selectRes.rows[0].coin_balance) : 0,
              error: 'Insufficient Nihomi Coins (balance < 1).'
            };
          }

          const updateRes = await client.query(
            `UPDATE public.coin_wallets SET
              coin_balance = coin_balance - 1,
              lifetime_spent = lifetime_spent + 1,
              updated_at = NOW()
            WHERE user_id = $1
            RETURNING coin_balance`,
            [userId]
          );

          const newBalance = Number(updateRes.rows[0].coin_balance);

          // Append immutable ledger record
          await client.query(
            `INSERT INTO public.coin_transactions (
              transaction_id, user_id, type, amount, source, reference_id, description, balance_after, created_at
            ) VALUES ($1, $2, 'USAGE', -1, 'PURCHASE', $3, $4, $5, NOW())`,
            [transactionId, userId, referenceId || null, description, newBalance]
          );

          await client.query('COMMIT');

          // Keep in-memory mirror in sync
          const mem = db.getUserWallet(userId);
          if (mem) {
            mem.coinBalance = newBalance;
          }

          return { success: true, newBalance, transactionId };
        } catch (txErr) {
          await client.query('ROLLBACK');
          throw txErr;
        } finally {
          client.release();
        }
      } catch (err) {
        console.warn('[CoinWalletService] PostgreSQL deductCoinForTurn fallback:', err);
      }
    }

    // Memory fallback
    const mem = db.getUserWallet(userId);
    if ((mem.coinBalance || 0) < 1) {
      return { success: false, newBalance: mem.coinBalance || 0, error: 'Insufficient Nihomi Coins.' };
    }
    mem.coinBalance = Math.max(0, (mem.coinBalance || 0) - 1);
    mem.lifetimeSpent = (mem.lifetimeSpent || 0) + 1;
    db.save();

    return { success: true, newBalance: mem.coinBalance, transactionId };
  }

  /**
   * Claims genuine learning reward with idempotency and monthly cap enforcement.
   */
  public async claimReward(params: {
    userId: string;
    eventType: keyof typeof REWARD_CONFIG['values'];
    idempotencyKey: string;
    tier?: string;
  }): Promise<{
    success: boolean;
    alreadyClaimed?: boolean;
    capReached?: boolean;
    coinsAwarded: number;
    newBalance: number;
    error?: string;
  }> {
    const { userId, eventType, idempotencyKey, tier = 'free' } = params;
    const baseReward = REWARD_CONFIG.values[eventType];

    if (!baseReward) {
      return { success: false, coinsAwarded: 0, newBalance: 0, error: `Invalid reward event type: ${eventType}` };
    }

    const pool = getPool();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const tierKey = tier.toLowerCase();
    const monthlyCap = REWARD_CONFIG.monthlyCaps[tierKey] || REWARD_CONFIG.monthlyCaps.free;

    if (pool) {
      try {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');

          // 1. Idempotency check
          const existingEvent = await client.query(
            `SELECT * FROM public.nihomi_reward_events WHERE idempotency_key = $1`,
            [idempotencyKey]
          );

          if (existingEvent.rows.length > 0) {
            await client.query('ROLLBACK');
            const wallet = await this.getWallet(userId);
            return {
              success: false,
              alreadyClaimed: true,
              coinsAwarded: 0,
              newBalance: wallet.coinBalance,
            };
          }

          // 2. Lock & inspect wallet
          const walletRes = await client.query(
            `SELECT * FROM public.coin_wallets WHERE user_id = $1 FOR UPDATE`,
            [userId]
          );

          let currentRewards = 0;
          let currentBalance = 0;

          if (walletRes.rows.length > 0) {
            const w = walletRes.rows[0];
            if (w.reward_period_month === currentMonth) {
              currentRewards = Number(w.monthly_reward_coins || 0);
            }
            currentBalance = Number(w.coin_balance || 0);
          }

          // Cap enforcement
          const remainingCap = Math.max(0, monthlyCap - currentRewards);
          if (remainingCap <= 0) {
            await client.query('ROLLBACK');
            return {
              success: false,
              capReached: true,
              coinsAwarded: 0,
              newBalance: currentBalance,
            };
          }

          const actualCoins = Math.min(baseReward, remainingCap);

          // Record reward event
          await client.query(
            `INSERT INTO public.nihomi_reward_events (idempotency_key, user_id, event_type, coins_awarded, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [idempotencyKey, userId, eventType, actualCoins]
          );

          // Update wallet
          const updateRes = await client.query(
            `INSERT INTO public.coin_wallets (
              user_id, coin_balance, monthly_reward_coins, reward_period_month,
              auto_topup_enabled, auto_topup_threshold, auto_topup_pack,
              monthly_spending_cap, current_month_spent, lifetime_earned, lifetime_spent
            ) VALUES ($1, $2, $2, $3, false, 50, 'coins_500', 5000, 0, $2, 0)
            ON CONFLICT (user_id) DO UPDATE SET
              coin_balance = public.coin_wallets.coin_balance + $2,
              monthly_reward_coins = CASE
                WHEN public.coin_wallets.reward_period_month = $3 THEN public.coin_wallets.monthly_reward_coins + $2
                ELSE $2
              END,
              reward_period_month = $3,
              lifetime_earned = public.coin_wallets.lifetime_earned + $2,
              updated_at = NOW()
            RETURNING coin_balance`,
            [userId, actualCoins, currentMonth]
          );

          const newBalance = Number(updateRes.rows[0].coin_balance);
          const txId = `tx_${crypto.randomUUID()}`;

          // Append immutable ledger
          await client.query(
            `INSERT INTO public.coin_transactions (
              transaction_id, user_id, type, amount, source, reference_id, description, balance_after, created_at
            ) VALUES ($1, $2, 'REWARD', $3, 'REWARD', $4, $5, $6, NOW())`,
            [txId, userId, actualCoins, idempotencyKey, `Nihomi Reward: ${eventType}`, newBalance]
          );

          await client.query('COMMIT');

          db.creditUserCoinsAndAI(userId, actualCoins, 0, `Nihomi Reward: ${eventType}`);

          return {
            success: true,
            coinsAwarded: actualCoins,
            newBalance,
          };
        } catch (txErr) {
          await client.query('ROLLBACK');
          throw txErr;
        } finally {
          client.release();
        }
      } catch (err) {
        console.warn('[CoinWalletService] PostgreSQL claimReward fallback:', err);
      }
    }

    // Memory fallback
    const memWallet = db.getUserWallet(userId);
    const updated = db.creditUserCoinsAndAI(userId, baseReward, 0, `Nihomi Reward: ${eventType}`);
    return {
      success: true,
      coinsAwarded: baseReward,
      newBalance: updated.coinBalance,
    };
  }

  /**
   * Retrieves transaction ledger for user
   */
  public async getLedger(userId: string, limit = 50): Promise<CoinTransaction[]> {
    const pool = getPool();
    if (pool) {
      try {
        const res = await pool.query(
          `SELECT * FROM public.coin_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
          [userId, limit]
        );
        return res.rows.map((r) => ({
          transactionId: r.transaction_id,
          userId: r.user_id,
          type: r.type as CoinTransactionType,
          amount: Number(r.amount),
          source: r.source as CoinSource,
          referenceId: r.reference_id,
          description: r.description,
          balanceAfter: Number(r.balance_after),
          createdAt: new Date(r.created_at).toISOString(),
        }));
      } catch (err) {
        console.warn('[CoinWalletService] PostgreSQL getLedger fallback:', err);
      }
    }

    return [];
  }

  /**
   * Updates Auto Top-up configuration
   */
  public async setAutoTopup(userId: string, config: {
    enabled: boolean;
    threshold?: number;
    pack?: string;
    spendingCap?: number;
  }): Promise<CoinWallet> {
    const pool = getPool();
    const threshold = config.threshold ?? 50;
    const pack = config.pack ?? 'coins_500';
    const cap = config.spendingCap ?? 5000;

    if (pool) {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        await pool.query(
          `INSERT INTO public.coin_wallets (
            user_id, coin_balance, monthly_reward_coins, reward_period_month,
            auto_topup_enabled, auto_topup_threshold, auto_topup_pack,
            monthly_spending_cap, current_month_spent, lifetime_earned, lifetime_spent
          ) VALUES ($1, 0, 0, $2, $3, $4, $5, $6, 0, 0, 0)
          ON CONFLICT (user_id) DO UPDATE SET
            auto_topup_enabled = $3,
            auto_topup_threshold = $4,
            auto_topup_pack = $5,
            monthly_spending_cap = $6,
            updated_at = NOW()`,
          [userId, currentMonth, config.enabled, threshold, pack, cap]
        );
      } catch (err) {
        console.warn('[CoinWalletService] setAutoTopup postgres fallback:', err);
      }
    }

    return this.getWallet(userId);
  }
}

export const coinWalletService = CoinWalletService.getInstance();
