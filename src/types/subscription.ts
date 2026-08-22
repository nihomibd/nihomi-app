// src/types/subscription.ts
// Nihomi (にほみ) — Strongly Typed Subscription & Access Control Interfaces

export type PlanId = 'free' | 'starter' | 'pro' | 'japan_ready';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancelled'
  | 'expired';

export type BillingInterval = 'monthly' | 'yearly';

export type PaymentStatus =
  | 'initiated'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type FeatureKey =
  | 'n5_basic'
  | 'n5_full'
  | 'n4_full'
  | 'n3_full'
  | 'grammar_bank'
  | 'kanji_master'
  | 'keigo_mastery'
  | 'business_japanese'
  | 'jlpt_mock_exams'
  | 'japan_readiness'
  | 'interview_prep'
  | 'living_in_japan'
  | 'certificates'
  | 'ai_coach';

export interface PlanPricing {
  monthly: {
    price: number; // in BDT ৳
    priceFormatted: string;
    planPriceId: string;
  };
  yearly: {
    price: number; // in BDT ৳
    priceFormatted: string;
    planPriceId: string;
    monthlyEquivalent: number;
    savingsPercentage: number;
    savingsFormatted: string;
  };
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  japaneseTitle: string; // e.g. 'スターター', 'プロ'
  tagline: string;
  badge?: string;
  isRecommended?: boolean;
  pricing: PlanPricing;
  aiCoachLimitMonthly: number; // Monthly quota
  features: {
    text: string;
    included: boolean;
    highlight?: boolean;
  }[];
}

export interface UserSubscriptionContext {
  id: string;
  userId: string;
  planId: PlanId;
  planPriceId: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date | null;
  gracePeriodEnd?: Date | null;
}

export interface AccessDecision {
  allowed: boolean;
  reason?: 'TIER_RESTRICTED' | 'QUOTA_EXCEEDED' | 'SUBSCRIPTION_EXPIRED' | 'PAST_DUE_RESTRICTED';
  requiredTier?: PlanId;
  currentUsage?: number;
  usageLimit?: number;
  message?: string;
}
