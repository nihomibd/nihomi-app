// src/views/LandingView.tsx
import React, { useState, useEffect } from 'react';
import { LandingHeader } from '../components/landing-v2/LandingHeader';
import { HeroSection } from '../components/landing-v2/HeroSection';
import { TryLessonSection } from '../components/landing-v2/TryLessonSection';
import { LearningJourneySection } from '../components/landing-v2/LearningJourneySection';
import { JapanReadinessSection } from '../components/landing-v2/JapanReadinessSection';
import { StudentStoriesSection } from '../components/landing-v2/StudentStoriesSection';
import { PricingSection } from '../components/landing-v2/PricingSection';
import { FinalJapanCTA } from '../components/landing-v2/FinalJapanCTA';
import { CheckoutModal } from '../components/CheckoutModal';
import { useAuth } from '../context/AuthContext';
import { updatePageMetaTags } from '../lib/seo';
import { trackNihomiEvent } from '../utils/analytics';
import { captureReferralFromUrl } from '../utils/referral';
import { Plan, PlanId } from '../types';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

// Reconciled Canonical Plans (Synchronized with Founder Reference Poster & Live Offer)
const STARTER_PLAN: Plan = {
  id: 'starter',
  name: 'Starter Learner',
  displayNameJa: 'スタータープラン',
  tagline: 'Master JLPT N5 & N4 foundations',
  description: 'Full access to JLPT N5 and N4 curriculums, complete vocabulary sets, and 500 Nihomi Coins/month.',
  monthlyPrice: 299,
  yearlyPrice: 2990,
  currency: 'BDT',
  badge: 'বেসিক প্ল্যান',
  order: 2,
  features: [
    '500 AI টার্ন / মাস',
    'পূর্ণ লেসন অ্যাক্সেস',
    '10 GB Nihomi Cloud'
  ],
  aiMonthlyLimit: 500,
  entitlements: ['n5', 'quizzes', 'ai_coach'],
  isPublished: true
};

const PRO_PLAN: Plan = {
  id: 'pro',
  name: 'Pro Learning',
  displayNameJa: 'プロプラン',
  tagline: 'The complete JLPT N5-N3 mastery & conversation system',
  description: 'Comprehensive curriculum including JLPT N3 intermediate Japanese, Business Keigo, and 1,500 Nihomi Coins/month.',
  monthlyPrice: 599,
  yearlyPrice: 5990,
  currency: 'BDT',
  badge: 'সবচেয়ে জনপ্রিয়',
  isRecommended: true,
  order: 3,
  features: [
    '1,500 AI টার্ন / মাস',
    'অতিরিক্ত ফিচার',
    '50 GB Nihomi Cloud'
  ],
  aiMonthlyLimit: 1500,
  entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro'],
  isPublished: true
};

const JAPAN_READY_PLAN: Plan = {
  id: 'japan_ready',
  name: 'Japan Ready Track',
  displayNameJa: '日本就労・移住特化プラン',
  tagline: 'Everything you need for job interviews, visa, and life in Japan',
  description: 'Career-focused Japanese training, workplace simulation, visa guidance, priority AI tutoring, and 4,000 Nihomi Coins/month.',
  monthlyPrice: 999,
  yearlyPrice: 9990,
  currency: 'BDT',
  badge: 'জাপান ক্যারিয়ার',
  order: 4,
  features: [
    '4,000 AI টার্ন / মাস',
    'N3-N1 + জাপান প্রস্তুতি',
    '200 GB Nihomi Cloud'
  ],
  aiMonthlyLimit: 4000,
  entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'japan_ready'],
  isPublished: true
};

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { openAuthModal } = useAuth();
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    captureReferralFromUrl();
    trackNihomiEvent('landing_page_view', { pagePath: '/' });

    updatePageMetaTags({
      title: 'Nihomi AI™ — শূন্য থেকে JLPT N5, N4, N3 জাপানিজ লার্নিং প্ল্যাটফর্ম',
      description: 'Nihomi Learning Companion-এর সাথে ধাপে ধাপে শিখুন, অনুশীলন করুন এবং জাপান জীবনের জন্য প্রস্তুত হন।',
      canonicalUrl: 'https://nihomi.com/'
    });
  }, []);

  const handleSelectPlan = (planId: PlanId) => {
    let targetPlan: Plan = PRO_PLAN;
    if (planId === 'starter') targetPlan = STARTER_PLAN;
    else if (planId === 'japan_ready') targetPlan = JAPAN_READY_PLAN;
    else targetPlan = PRO_PLAN;

    setSelectedPlanForCheckout(targetPlan);
    setIsCheckoutOpen(true);
    trackNihomiEvent('plan_selected', { planId, priceBDT: targetPlan.monthlyPrice });
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden font-sans">
      {/* SECTION A: TOP NAVIGATION HEADER */}
      <LandingHeader
        onNavigate={onNavigate}
        onOpenAuth={(mode) => openAuthModal(mode || 'login')}
      />

      {/* SECTION B: HERO SECTION (Three-part composition: Copy, Anime Sensei, Shortcut Card) */}
      <HeroSection onNavigate={onNavigate} />

      {/* SECTION C: TRY A REAL LESSON (Interactive tabs, Kana 'あ', audio playback, Sensei preview) */}
      <TryLessonSection onNavigate={onNavigate} />

      {/* SECTION D: PERSONALIZED LEARNING JOURNEY (6 macro cards from 01 Quick Test to 06 Japan Ready) */}
      <LearningJourneySection onNavigate={onNavigate} />

      {/* SECTION E: MORE THAN LANGUAGE (Study, Work, Travel, Culture cards) */}
      <JapanReadinessSection onNavigate={onNavigate} />

      {/* SECTION F: STUDENT STORIES (3 authentic student testimonials with ratings) */}
      <StudentStoriesSection onNavigate={onNavigate} />

      {/* SECTION G: SIMPLE PRICING (Free ৳0, Starter ৳299, Pro ৳599, Japan Ready ৳999) */}
      <PricingSection
        onNavigate={onNavigate}
        onSelectPlan={handleSelectPlan}
      />

      {/* SECTION H: FULL-WIDTH FINAL JAPAN CTA (Sunset panorama with Tokyo skyline & Mt. Fuji) */}
      <FinalJapanCTA onNavigate={onNavigate} />

      {/* Embedded Checkout Modal for Real Subscription Payments */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          plan={selectedPlanForCheckout}
          initialInterval="monthly"
          onSuccess={() => {
            setIsCheckoutOpen(false);
            onNavigate('dashboard');
          }}
        />
      )}
    </div>
  );
};
