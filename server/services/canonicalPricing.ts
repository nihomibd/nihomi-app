/**
 * NIHOMI.COM — SERVER CANONICAL SUBSCRIPTION PRICING MATRIX
 * Single Source of Truth for all 12 Approved Subscription Price Combinations.
 *
 * Hard Business Invariant:
 * Starter:     1M: ৳990   | 3M: ৳2,820  | 6M: ৳5,350  | 12M: ৳10,100
 * Pro:         1M: ৳1,990 | 3M: ৳5,670  | 6M: ৳10,750 | 12M: ৳20,300
 * Japan Ready: 1M: ৳3,990 | 3M: ৳11,370 | 6M: ৳21,550 | 12M: ৳40,700
 */

export type SubscriptionPlanId = 'starter' | 'pro' | 'japan_ready';
export type BillingTermInterval = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

export interface PlanTermPricing {
  amountBdt: number;
  durationMonths: number;
  monthlyEquivalentBdt: number;
  savingsBdt: number;
  savingsPercent: number;
}

export interface CanonicalPlanDefinition {
  id: SubscriptionPlanId;
  name: string;
  nameBn: string;
  taglineBn: string;
  monthlyCoins: number;
  terms: Record<BillingTermInterval, PlanTermPricing>;
}

export const CANONICAL_SUBSCRIPTION_MATRIX: Record<SubscriptionPlanId, CanonicalPlanDefinition> = {
  starter: {
    id: 'starter',
    name: 'Nihomi Starter',
    nameBn: 'নিহোমি স্টারটার',
    taglineBn: 'নিয়মিত শিক্ষার্থীদের জন্য ৫০০ নিহোমি কয়েন ও পূর্ণ সিলেবাস',
    monthlyCoins: 500,
    terms: {
      monthly: {
        amountBdt: 990,
        durationMonths: 1,
        monthlyEquivalentBdt: 990,
        savingsBdt: 0,
        savingsPercent: 0,
      },
      quarterly: {
        amountBdt: 2820,
        durationMonths: 3,
        monthlyEquivalentBdt: 940,
        savingsBdt: 150,
        savingsPercent: 5,
      },
      half_yearly: {
        amountBdt: 5350,
        durationMonths: 6,
        monthlyEquivalentBdt: 892,
        savingsBdt: 590,
        savingsPercent: 10,
      },
      yearly: {
        amountBdt: 10100,
        durationMonths: 12,
        monthlyEquivalentBdt: 842,
        savingsBdt: 1780,
        savingsPercent: 15,
      },
    },
  },
  pro: {
    id: 'pro',
    name: 'Nihomi Pro',
    nameBn: 'নিহোমি প্রো',
    taglineBn: 'সিরিয়াস শিক্ষার্থীদের জন্য ১,৫০০ নিহোমি কয়েন ও ফুল JLPT প্রিপারেশন',
    monthlyCoins: 1500,
    terms: {
      monthly: {
        amountBdt: 1990,
        durationMonths: 1,
        monthlyEquivalentBdt: 1990,
        savingsBdt: 0,
        savingsPercent: 0,
      },
      quarterly: {
        amountBdt: 5670,
        durationMonths: 3,
        monthlyEquivalentBdt: 1890,
        savingsBdt: 300,
        savingsPercent: 5,
      },
      half_yearly: {
        amountBdt: 10750,
        durationMonths: 6,
        monthlyEquivalentBdt: 1792,
        savingsBdt: 1190,
        savingsPercent: 10,
      },
      yearly: {
        amountBdt: 20300,
        durationMonths: 12,
        monthlyEquivalentBdt: 1692,
        savingsBdt: 3580,
        savingsPercent: 15,
      },
    },
  },
  japan_ready: {
    id: 'japan_ready',
    name: 'Nihomi Japan Ready',
    nameBn: 'নিহোমি জাপান রেডি',
    taglineBn: 'জাপানে চাকরি ও অভিবাসনের জন্য ৪,০০০ কয়েন ও কর্মক্ষেত্র সিমুলেশন',
    monthlyCoins: 4000,
    terms: {
      monthly: {
        amountBdt: 3990,
        durationMonths: 1,
        monthlyEquivalentBdt: 3990,
        savingsBdt: 0,
        savingsPercent: 0,
      },
      quarterly: {
        amountBdt: 11370,
        durationMonths: 3,
        monthlyEquivalentBdt: 3790,
        savingsBdt: 600,
        savingsPercent: 5,
      },
      half_yearly: {
        amountBdt: 21550,
        durationMonths: 6,
        monthlyEquivalentBdt: 3592,
        savingsBdt: 2390,
        savingsPercent: 10,
      },
      yearly: {
        amountBdt: 40700,
        durationMonths: 12,
        monthlyEquivalentBdt: 3392,
        savingsBdt: 7180,
        savingsPercent: 15,
      },
    },
  },
};

/**
 * Returns exact canonical subscription price in BDT.
 * Throws if plan or interval is invalid.
 */
export function getCanonicalPrice(planId: string, interval: string = 'monthly'): number {
  const normPlan = (planId === 'n5_pro' ? 'pro' : planId) as SubscriptionPlanId;
  const normInterval = (interval === '1m' ? 'monthly' :
                        interval === '3m' ? 'quarterly' :
                        interval === '6m' ? 'half_yearly' :
                        interval === '12m' ? 'yearly' : interval) as BillingTermInterval;

  const plan = CANONICAL_SUBSCRIPTION_MATRIX[normPlan];
  if (!plan) {
    throw new Error(`[CanonicalPricing] Invalid plan ID: "${planId}". Expected one of: starter, pro, japan_ready.`);
  }

  const term = plan.terms[normInterval];
  if (!term) {
    throw new Error(`[CanonicalPricing] Invalid interval: "${interval}" for plan "${planId}". Expected: monthly, quarterly, half_yearly, yearly.`);
  }

  return term.amountBdt;
}

/**
 * Verifies if a given amount matches the canonical catalog for the plan and interval.
 */
export function validatePurchaseAmount(planId: string, interval: string, amount: number): boolean {
  try {
    const canonicalPrice = getCanonicalPrice(planId, interval);
    return Math.abs(canonicalPrice - amount) === 0;
  } catch {
    return false;
  }
}
