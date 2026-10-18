// src/views/LandingView.tsx
import React, { useState, useEffect } from 'react';
import { LandingHeader } from '../components/landing-v2/LandingHeader';
import { HeroSection } from '../components/landing-v2/HeroSection';
import { ExplainerVideoSection } from '../components/landing-v2/ExplainerVideoSection';
import { LearningJourneySection } from '../components/landing-v2/LearningJourneySection';
import { BengaliSenseiSection } from '../components/landing-v2/BengaliSenseiSection';
import { WorkOsSimulationSection } from '../components/landing-v2/WorkOsSimulationSection';
import { JlptMockPracticeSection } from '../components/landing-v2/JlptMockPracticeSection';
import { PricingSection } from '../components/landing-v2/PricingSection';
import { FaqAndFinalCtaSection } from '../components/landing-v2/FaqAndFinalCtaSection';
import { LandingFooter } from '../components/landing-v2/LandingFooter';
import { CheckoutModal } from '../components/CheckoutModal';
import { BengaliQuickCalibrationModal } from '../components/learning/BengaliQuickCalibrationModal';
import { useAuth } from '../context/AuthContext';
import { updatePageMetaTags } from '../lib/seo';
import { trackNihomiEvent } from '../utils/analytics';
import { captureReferralFromUrl } from '../utils/referral';
import { Plan, PlanId } from '../types';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

// Reconciled Canonical Plans (Synchronized with Approved 12-Price Matrix)
const STARTER_PLAN: Plan = {
  id: 'starter',
  name: 'Nihomi Starter',
  displayNameJa: 'スタータープラン',
  tagline: 'Master JLPT N5 & N4 foundations',
  description: 'Full access to JLPT N5 and N4 curriculums, complete vocabulary sets, and Nomi Sensei learning companion.',
  monthlyPrice: 990,
  quarterlyPrice: 2820,
  halfYearlyPrice: 5350,
  yearlyPrice: 10100,
  currency: 'BDT',
  badge: 'বেসিক প্ল্যান',
  order: 2,
  features: [
    'JLPT N5 ও N4 কারিকুলাম',
    'পূর্ণাঙ্গ লেসন অ্যাক্সেস',
    'Nomi Sensei লার্নিং মেন্টর'
  ],
  aiMonthlyLimit: 500,
  entitlements: ['n5', 'quizzes', 'ai_coach'],
  isPublished: true
};

const PRO_PLAN: Plan = {
  id: 'pro',
  name: 'Nihomi Pro',
  displayNameJa: 'プロプラン',
  tagline: 'The complete JLPT N5-N3 mastery & conversation system',
  description: 'Comprehensive curriculum including JLPT N3 intermediate Japanese, Business Keigo, and WorkOS simulations.',
  monthlyPrice: 1990,
  quarterlyPrice: 5670,
  halfYearlyPrice: 10750,
  yearlyPrice: 20300,
  currency: 'BDT',
  badge: 'সবচেয়ে জনপ্রিয়',
  isRecommended: true,
  order: 3,
  features: [
    'N5-N3 পূর্ণাঙ্গ প্রস্তুতি',
    'ফুল JLPT মক-টেস্ট ইঞ্জিন',
    'WorkOS™ কনবিনি বাইতো সিমুলেশন'
  ],
  aiMonthlyLimit: 1500,
  entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro'],
  isPublished: true
};

const JAPAN_READY_PLAN: Plan = {
  id: 'japan_ready',
  name: 'Nihomi Japan Ready',
  displayNameJa: '日本就労・移住特化プラン',
  tagline: 'Everything you need for job interviews, visa, and life in Japan',
  description: 'Career-focused Japanese training, WorkOS workplace simulations, JIS resume builder, and comprehensive JLPT N5-N1 practice.',
  monthlyPrice: 3990,
  quarterlyPrice: 11370,
  halfYearlyPrice: 21550,
  yearlyPrice: 40700,
  currency: 'BDT',
  badge: 'জাপান ক্যারিয়ার',
  order: 4,
  features: [
    'N5-N1 অ্যাডভান্সড কারিকুলাম',
    'JIS রিলোকেশন রিজিউমে বিল্ডার',
    'রিয়েল জাপান ইন্টারভিউ সিমুলেশন'
  ],
  aiMonthlyLimit: 4000,
  entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'japan_ready'],
  isPublished: true
};

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { openAuthModal } = useAuth();
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  useEffect(() => {
    captureReferralFromUrl();
    trackNihomiEvent('landing_page_view', { pagePath: '/' });

    updatePageMetaTags({
      title: 'Nihomi.com (にほみ) — শূন্য থেকে জাপান-রেডি | প্রিমিয়াম জাপানি লার্নিং প্ল্যাটফর্ম',
      description: 'Nihomi Learning Companion ও WorkOS™-এর সাথে ধাপে ধাপে শিখুন, অনুশীলন করুন এবং জাপান জীবনের জন্য প্রস্তুত হন।',
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
    <div className="w-full min-h-screen bg-[#141726] text-[#F6F0E6] selection:bg-[#E45147]/30 selection:text-white overflow-x-hidden font-sans">
      {/* 1. TOP NAVIGATION HEADER */}
      <LandingHeader
        onNavigate={onNavigate}
        onOpenAuth={(mode) => openAuthModal(mode || 'login')}
      />

      {/* 2. HERO SECTION WITH VALUE PROPOSITION & ZEN CANVAS PREVIEW */}
      <HeroSection
        onNavigate={onNavigate}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
      />

      {/* 3. 60-SECOND MOTION-GRAPHICS EXPLAINER VIDEO SECTION */}
      <ExplainerVideoSection onNavigate={onNavigate} />

      {/* 4. CONTINUOUS LEARNING JOURNEY (WASHI CREAM PAPER GROUND) */}
      <LearningJourneySection onNavigate={onNavigate} />

      {/* 5. NOMI COMPANION SHOWCASE (CANONICAL ARTWORK & INTERACTIVE STATES) */}
      <BengaliSenseiSection onNavigate={onNavigate} />

      {/* 7. NIHOMI WORKOS™ WORKPLACE SIMULATIONS (KONBINI, AIRPORT, RESUME) */}
      <WorkOsSimulationSection onNavigate={onNavigate} />

      {/* 8. JLPT N5-N1 MOCK EXAM ENGINE */}
      <JlptMockPracticeSection onNavigate={onNavigate} />

      {/* 9. CANONICAL 12-PRICE MATRIX & BILLING SWITCHER */}
      <PricingSection
        onNavigate={onNavigate}
        onSelectPlan={handleSelectPlan}
      />

      {/* 10. FAQS & FINAL CONVERSION CTA */}
      <FaqAndFinalCtaSection onNavigate={onNavigate} />

      {/* 11. CANONICAL LANDING FOOTER & GOVERNANCE */}
      <LandingFooter onNavigate={onNavigate} />

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

      {/* 5-Track Bengali Quick Calibration Modal */}
      {isCalibrationOpen && (
        <BengaliQuickCalibrationModal
          isOpen={isCalibrationOpen}
          onClose={() => setIsCalibrationOpen(false)}
          onPlacementApplied={(nodeId, viewRoute, viewParams) => {
            setIsCalibrationOpen(false);
            onNavigate(viewRoute, viewParams);
          }}
          onExploreCourses={() => {
            setIsCalibrationOpen(false);
            onNavigate('courses');
          }}
        />
      )}
    </div>
  );
};
