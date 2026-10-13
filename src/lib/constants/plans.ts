// src/lib/constants/plans.ts
// Nihomi (にほみ • Learn & Work) — Official Subscription Plans Configuration

import { PlanDefinition } from '@/types/subscription';

export const NIHOMI_BRAND = {
  name: 'Nihomi',
  japaneseName: 'にほみ',
  tagline: 'Learn & Work',
  fullTitle: 'Nihomi (にほみ) — Japanese Language & Career SaaS',
  currencySymbol: '৳',
  currencyCode: 'BDT',
};

export const PLANS: Record<string, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    japaneseTitle: '無料プラン',
    tagline: 'Get started with basic Japanese foundations',
    pricing: {
      monthly: {
        price: 0,
        priceFormatted: '৳0',
        planPriceId: 'price_free_monthly',
      },
      yearly: {
        price: 0,
        priceFormatted: '৳0',
        planPriceId: 'price_free_yearly',
        monthlyEquivalent: 0,
        savingsPercentage: 0,
        savingsFormatted: '৳0',
      },
    },
    aiCoachLimitMonthly: 10,
    features: [
      { text: 'Limited JLPT N5 Lessons', included: true },
      { text: 'Basic Vocabulary & Hiragana/Katakana', included: true },
      { text: 'Limited Practice Quizzes', included: true },
      { text: '10 AI Sensei Coach interactions/month', included: true },
      { text: 'Full N4 & N3 Modules', included: false },
      { text: 'Business Japanese & Keigo', included: false },
      { text: 'Japan Readiness & Work Culture', included: false },
      { text: 'Certificates of Completion', included: false },
    ],
  },

  starter: {
    id: 'starter',
    name: 'Starter',
    japaneseTitle: 'スターター',
    tagline: 'Complete beginner mastery for N5 & N4 learners',
    pricing: {
      monthly: {
        price: 990,
        priceFormatted: '৳990',
        planPriceId: 'price_starter_monthly',
      },
      yearly: {
        price: 10100,
        priceFormatted: '৳10,100',
        planPriceId: 'price_starter_yearly',
        monthlyEquivalent: 842,
        savingsPercentage: 15,
        savingsFormatted: 'Save ৳1,780/year (15%)',
      },
    },
    aiCoachLimitMonthly: 500,
    features: [
      { text: 'Full JLPT N5 Complete Course', included: true },
      { text: 'Full JLPT N4 Complete Course', included: true },
      { text: 'Full Grammar Bank & Kanji Mastery', included: true },
      { text: 'Unlimited Practice Quizzes & Flashcards', included: true },
      { text: '500 AI Sensei Coach interactions/month', included: true },
      { text: 'Full N3 Modules & Business Japanese', included: false },
      { text: 'Japan Readiness & Interview Prep', included: false },
      { text: 'Certificates of Completion', included: false },
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    japaneseTitle: 'プロ (おすすめ)',
    tagline: 'The ultimate path to JLPT N3 and conversational fluency',
    badge: 'Recommended',
    isRecommended: true,
    pricing: {
      monthly: {
        price: 1990,
        priceFormatted: '৳1,990',
        planPriceId: 'price_pro_monthly',
      },
      yearly: {
        price: 20300,
        priceFormatted: '৳20,300',
        planPriceId: 'price_pro_yearly',
        monthlyEquivalent: 1692,
        savingsPercentage: 15,
        savingsFormatted: 'Save ৳3,580/year (15%)',
      },
    },
    aiCoachLimitMonthly: 1500,
    features: [
      { text: 'Everything in Starter (N5 + N4 Full)', included: true },
      { text: 'Full JLPT N3 Advanced Modules', included: true, highlight: true },
      { text: 'Business Japanese & Keigo (敬語) Mastery', included: true, highlight: true },
      { text: 'Interactive Real-Life Conversation Practice', included: true },
      { text: 'JLPT Mock Exams with Score Analytics', included: true },
      { text: 'Fair-Use AI Coach (1,500 interactions/mo)', included: true, highlight: true },
      { text: 'Japan Readiness & Workplace Etiquette', included: false },
      { text: 'Verified Certificates of Completion', included: false },
    ],
  },

  japan_ready: {
    id: 'japan_ready',
    name: 'Japan Ready',
    japaneseTitle: '日本就労・留学準備',
    tagline: 'Comprehensive career preparation for working and living in Japan',
    badge: 'Best for Careers',
    pricing: {
      monthly: {
        price: 3990,
        priceFormatted: '৳3,990',
        planPriceId: 'price_japan_ready_monthly',
      },
      yearly: {
        price: 40700,
        priceFormatted: '৳40,700',
        planPriceId: 'price_japan_ready_yearly',
        monthlyEquivalent: 3392,
        savingsPercentage: 15,
        savingsFormatted: 'Save ৳7,180/year (15%)',
      },
    },
    aiCoachLimitMonthly: 2500,
    features: [
      { text: 'Everything in Pro (N5, N4, N3, Business, Keigo)', included: true },
      { text: 'Japan Work Readiness & Interview Japanese', included: true, highlight: true },
      { text: 'Workplace Japanese & Corporate Culture Training', included: true, highlight: true },
      { text: 'Japan Daily Living & Relocation Japanese Modules', included: true },
      { text: 'Official Nihomi Certificate of Completion', included: true, highlight: true },
      { text: 'Priority AI Processing & Resume/CV Review Assistance', included: true, highlight: true },
      { text: '2,500 AI Sensei Coach interactions/month', included: true },
    ],
  },
};
