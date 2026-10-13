// src/core/billing/priceCalculator.ts
// NIHOMI CONSTITUTIONAL PRICING & DAILY COST ENGINE
// Section 26 & 27: Strict dynamic per-day price computation without hardcoding.
// Truthful micro-copy: Only claim tea/coffee equivalence when mathematically valid (daily <= ৳35).

export type JourneyInterval = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

export interface DailyCostReport {
  totalPrice: number;
  durationDays: number;
  dailyPrice: number;
  dailyLabelBn: string;
  comparisonBadgeBn: string | null;
  savingPercent: number;
}

/**
 * Computes exact daily cost and truthful comparison badge.
 */
export function calculateDailyCost(
  totalPrice: number,
  interval: JourneyInterval
): DailyCostReport {
  let durationDays = 30;
  let savingPercent = 0;

  if (interval === 'quarterly') {
    durationDays = 90;
    savingPercent = 5;
  } else if (interval === 'half_yearly') {
    durationDays = 180;
    savingPercent = 10;
  } else if (interval === 'yearly') {
    durationDays = 365;
    savingPercent = 15;
  }

  if (totalPrice <= 0) {
    return {
      totalPrice: 0,
      durationDays,
      dailyPrice: 0,
      dailyLabelBn: 'সম্পূর্ণ ফ্রি',
      comparisonBadgeBn: null,
      savingPercent: 0
    };
  }

  const dailyPrice = Math.max(1, Math.round(totalPrice / durationDays));

  // Truthful comparison checks
  let comparisonBadgeBn: string | null = null;
  if (dailyPrice <= 15) {
    comparisonBadgeBn = 'এক কাপ চায়ের বাজেটের মতো (৳১০-১৫/দিন)';
  } else if (dailyPrice <= 35) {
    comparisonBadgeBn = 'একটি সাধারণ কফি বা স্ন্যাকসের বাজেটের মতো (৳২৫-৩৫/দিন)';
  }

  return {
    totalPrice,
    durationDays,
    dailyPrice,
    dailyLabelBn: `প্রতিদিন প্রায় ৳${dailyPrice}`,
    comparisonBadgeBn,
    savingPercent
  };
}

/**
 * Computes plan price for given interval.
 */
export function getPlanPriceForInterval(
  monthlyPrice: number,
  yearlyPrice: number,
  interval: JourneyInterval
): number {
  if (monthlyPrice === 0) return 0;
  if (interval === 'monthly') return monthlyPrice;

  // Exact 12-combination pricing matrix matching approved rates
  if (monthlyPrice === 990) {
    if (interval === 'quarterly') return 2820;
    if (interval === 'half_yearly') return 5350;
    if (interval === 'yearly') return 10100;
  }
  if (monthlyPrice === 1990) {
    if (interval === 'quarterly') return 5670;
    if (interval === 'half_yearly') return 10750;
    if (interval === 'yearly') return 20300;
  }
  if (monthlyPrice === 3990) {
    if (interval === 'quarterly') return 11370;
    if (interval === 'half_yearly') return 21550;
    if (interval === 'yearly') return 40700;
  }

  // Fallback calculations for non-standard plans
  if (interval === 'quarterly') return Math.round(monthlyPrice * 3 * 0.95);
  if (interval === 'half_yearly') return Math.round(monthlyPrice * 6 * 0.90);
  return yearlyPrice;
}
