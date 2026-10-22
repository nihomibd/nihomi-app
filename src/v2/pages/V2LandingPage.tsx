// src/v2/pages/V2LandingPage.tsx
import React, { useState } from 'react';
import { HeroSection } from '../../components/landing-v2/HeroSection';
import { ExplainerVideoSection } from '../../components/landing-v2/ExplainerVideoSection';
import { LearningJourneySection } from '../../components/landing-v2/LearningJourneySection';
import { BengaliSenseiSection } from '../../components/landing-v2/BengaliSenseiSection';
import { WorkOsSimulationSection } from '../../components/landing-v2/WorkOsSimulationSection';
import { JlptMockPracticeSection } from '../../components/landing-v2/JlptMockPracticeSection';
import { PricingSection } from '../../components/landing-v2/PricingSection';
import { FaqAndFinalCtaSection } from '../../components/landing-v2/FaqAndFinalCtaSection';
import { CheckoutModal } from '../../components/CheckoutModal';
import { BengaliQuickCalibrationModal } from '../../components/learning/BengaliQuickCalibrationModal';
import { V2Route, V2NavigationParams } from '../types';
import { Plan, PlanId } from '../../types';

interface V2LandingPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

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
  features: ['JLPT N5 ও N4 কারিকুলাম', 'পূর্ণাঙ্গ লেসন অ্যাক্সেস', 'Nomi Sensei লার্নিং মেন্টর'],
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
  features: ['N5-N3 পূর্ণাঙ্গ প্রস্তুতি', 'ফুল JLPT মক-টেস্ট ইঞ্জিন', 'WorkOS™ কনবিনি বাইতো সিমুলেশন'],
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
  features: ['N5-N1 অ্যাডভান্সড কারিকুলাম', 'JIS রিলোকেশন রিজিউমে বিল্ডার', 'রিয়েল জাপান ইন্টারভিউ সিমুলেশন'],
  aiMonthlyLimit: 4000,
  entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'japan_ready'],
  isPublished: true
};

export const V2LandingPage: React.FC<V2LandingPageProps> = ({ onNavigate }) => {
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  const handleSelectPlan = (planId: PlanId) => {
    let targetPlan: Plan = PRO_PLAN;
    if (planId === 'starter') targetPlan = STARTER_PLAN;
    else if (planId === 'japan_ready') targetPlan = JAPAN_READY_PLAN;
    setSelectedPlanForCheckout(targetPlan);
    setIsCheckoutOpen(true);
  };

  const handleAdapterNavigate = (view: string, params?: Record<string, any>) => {
    let targetRoute: V2Route = 'landing';
    if (view === 'journey' || view === 'start-journey' || view === 'mission') targetRoute = 'journey';
    else if (view === 'dashboard' || view === 'student-dashboard') targetRoute = 'dashboard';
    else if (view === 'courses' || view === 'curriculum') targetRoute = 'curriculum';
    else if (view === 'lesson') targetRoute = 'lesson';
    else if (view === 'kana' || view === 'hiragana' || view === 'katakana') targetRoute = 'kana';
    else if (view === 'baito' || view === 'workos' || view === 'simulation') targetRoute = 'workos';
    else if (view === 'rirekisho' || view === 'cv-builder' || view === 'jis-rirekisho') targetRoute = 'rirekisho';
    else if (view === 'pricing' || view === 'plans') targetRoute = 'pricing';
    else if (view === 'founder' || view === 'admin') targetRoute = 'founder';
    onNavigate(targetRoute, params);
  };

  return (
    <div className="w-full min-h-screen bg-[#141726] text-[#F6F0E6] overflow-x-hidden font-sans">
      {/* 1. Hero Section with Value-first 'あ' preview */}
      <HeroSection
        onNavigate={handleAdapterNavigate}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
      />

      {/* 2. 60-second Explainer Video */}
      <ExplainerVideoSection onNavigate={handleAdapterNavigate} />

      {/* 3. Canonical Learning Journey Preview */}
      <LearningJourneySection onNavigate={handleAdapterNavigate} />

      {/* 4. Nomi Companion Showcase */}
      <BengaliSenseiSection onNavigate={handleAdapterNavigate} />

      {/* 5. WorkOS Workplace Simulation Showcase */}
      <WorkOsSimulationSection onNavigate={handleAdapterNavigate} />

      {/* 6. JLPT Mock Practice Preview */}
      <JlptMockPracticeSection onNavigate={handleAdapterNavigate} />

      {/* 7. Canonical 12-Price Matrix */}
      <PricingSection
        onNavigate={handleAdapterNavigate}
        onSelectPlan={handleSelectPlan}
      />

      {/* 8. FAQs & Final CTA */}
      <FaqAndFinalCtaSection onNavigate={handleAdapterNavigate} />

      {/* Checkout Modal */}
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

      {/* Quick Calibration Modal */}
      {isCalibrationOpen && (
        <BengaliQuickCalibrationModal
          isOpen={isCalibrationOpen}
          onClose={() => setIsCalibrationOpen(false)}
          onPlacementApplied={(nodeId, viewRoute, viewParams) => {
            setIsCalibrationOpen(false);
            handleAdapterNavigate(viewRoute, viewParams);
          }}
          onExploreCourses={() => {
            setIsCalibrationOpen(false);
            onNavigate('curriculum');
          }}
        />
      )}
    </div>
  );
};
