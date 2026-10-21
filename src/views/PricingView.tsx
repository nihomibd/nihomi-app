import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Brain,
  Store,
  FileText,
  Target,
  Compass,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Award,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Gift,
  BadgeCheck,
  Smartphone,
  CreditCard,
  Building2,
  Clock
} from 'lucide-react';
import { Plan, BillingInterval, PlanId } from '../types';
import { calculateDailyCost, getPlanPriceForInterval, JourneyInterval } from '../core/billing/priceCalculator';
import { billingApi } from '../lib/billingApi';
import { useAuth } from '../context/AuthContext';
import { CheckoutModal } from '../components/CheckoutModal';
import { trackNihomiEvent } from '../utils/analytics';
import { getSavedOnboardingAnswers } from '../core/onboarding/onboardingStorage';

interface PricingViewProps {
  onSelectPlan?: (planId: PlanId) => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  initialPlan?: PlanId | string;
  initialInterval?: BillingInterval | string;
}

// Canonical 6-Core Value Pillars (Embedded Educational Slideshow)
const NIHOMI_6_VALUES = [
  {
    id: 'sensei',
    badge: 'PERSONAL SENSEI',
    title: '২৪/৭ সার্বক্ষণিক পার্সোনাল শিক্ষক',
    titleJa: 'AI 専属講師',
    description: 'বাংলা ভাষায় জটিল জাপানি ব্যাকরণ বিশ্লেষণ ও যেকোনো সময় নির্ভুল কেইগো ও উচ্চারণ সহায়তা।',
    icon: Bot,
    accentGradient: 'from-red-600/20 via-[#1a1228] to-[#0d0918]',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    highlightText: '১০০% বাংলায় প্রাঞ্জল ব্যাকরণ ব্যাখ্যা'
  },
  {
    id: 'memoryos',
    badge: 'MEMORYOS™ SRS',
    title: 'স্পেসড রিপিটেশন স্মৃতি ইঞ্জিন',
    titleJa: '記憶定着エンジン',
    description: 'বৈজ্ঞানিক ইন্টারভালে আপনার ভুল হওয়া শব্দ ও ব্যাকরণ রিভিশন করিয়ে আজীবন মনে রাখা নিশ্চিত করে।',
    icon: Brain,
    accentGradient: 'from-amber-600/20 via-[#1a1528] to-[#0d0918]',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    highlightText: '৯৫%+ দীর্ঘমেয়াদী মনে রাখার হার'
  },
  {
    id: 'conbini',
    badge: 'CONBINI SHIFT POS',
    title: 'জাপানে যাওয়ার আগেই কাজের মহড়া',
    titleJa: '現場レジ訓練',
    description: 'টোকিও সেভেন-ইলেভেন ক্যাশিয়ার, বারকোড স্ক্যানার, সেমি-সেলফ রেজিস্টার ও কাস্টমার কেইগো সিমুলেশন।',
    icon: Store,
    accentGradient: 'from-emerald-600/20 via-[#121c22] to-[#0d0918]',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    highlightText: 'বাস্তব টোকিও স্টোর অডিও ও রিয়েল শিফট'
  },
  {
    id: 'jis_cv',
    badge: 'JIS CV STUDIO',
    title: 'জাপান স্ট্যান্ডার্ড JIS সিভি এক্সপোর্ট',
    titleJa: '履歴書・職務経歴書',
    description: 'জাপানি কোম্পানি ও ভিসা অনুমোদিত স্ট্যান্ডার্ড JIS 履歴書 এবং 職務経歴書 সরাসরি A4 PDF এক্সপোর্ট।',
    icon: FileText,
    accentGradient: 'from-blue-600/20 via-[#12162a] to-[#0d0918]',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    highlightText: 'A4 প্রিন্ট পারফেক্ট জাপানি ফরম্যাট'
  },
  {
    id: 'zero_n1',
    badge: 'ZERO TO N1 ROADMAP',
    title: 'সম্পূর্ণ ভাষা ও ক্যারিয়ার রোডম্যাপ',
    titleJa: 'N5からN1完全制覇',
    description: 'শূন্য থেকে শুরু করে JLPT N1 পর্যন্ত বাস্তব সিলেবাস, ৫০+ মক টেস্ট ও মিনিমাম টাইমে সর্বোচ্চ প্রোগ্রেস।',
    icon: Target,
    accentGradient: 'from-purple-600/20 via-[#1a122e] to-[#0d0918]',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    highlightText: '১,০০০+ বাস্তব অডিও ডায়ালগ ও কুইজ'
  },
  {
    id: 'japan_readiness',
    badge: 'JAPAN LIFE READINESS',
    title: 'জাপান লিভিং সারভাইভাল গাইড',
    titleJa: '日本生活完全ガイド',
    description: 'সিটি হল রেজিস্ট্রেশন, ব্যাংক অ্যাকাউন্ট খোলা, ময়লা ফেলার নিয়ম ও জাপানে বসবাসের সব বাস্তব কলাকৌশল।',
    icon: Compass,
    accentGradient: 'from-amber-600/20 via-[#1d1520] to-[#0d0918]',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    highlightText: 'বাস্তব জীবনযাপনে শতভাগ প্রস্তুতি'
  }
];

// Canonical Plan Definitions for PricingView (Single Source of Truth)
const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    displayNameJa: '無料プラン',
    tagline: 'Essential starter kit for Japanese beginners',
    description: 'Perfect for getting started with introductory N5 Japanese grammar, hiragana, and katakana.',
    order: 1,
    monthlyPrice: 0,
    quarterlyPrice: 0,
    halfYearlyPrice: 0,
    yearlyPrice: 0,
    currency: 'BDT',
    aiMonthlyLimit: 10,
    features: [
      'N5 introductory lessons (Lessons 01-05 completely free) & all 46 Kana',
      'Essential vocabulary & grammar previews',
      'Basic practice quizzes',
      '10 AI Coach interactions / month',
      'Community learning support'
    ],
    entitlements: ['n5', 'quizzes', 'ai_coach'],
    isPublished: true
  },
  {
    id: 'starter',
    name: 'Nihomi Starter',
    displayNameJa: 'スタータープラン',
    tagline: 'Master JLPT N5 & N4 foundations with structured drills',
    description: 'Full access to JLPT N5 and N4 curriculums, complete vocabulary sets, and 500 Nihomi Coins/month.',
    order: 2,
    monthlyPrice: 990,
    quarterlyPrice: 2820,
    halfYearlyPrice: 5350,
    yearlyPrice: 10100,
    currency: 'BDT',
    aiMonthlyLimit: 500,
    features: [
      '500 Nihomi Coins included / month (1 Coin = 1 Sensei Turn)',
      'Full JLPT N5 & N4 curriculum unlocked',
      'Complete Vocabulary, Grammar & Kanji decks',
      'Full mastery quizzes with detailed breakdowns',
      'Basic Keigo & polite expressions overview',
      'Offline learning notes export'
    ],
    entitlements: ['n5', 'n4', 'quizzes', 'ai_coach'],
    isPublished: true
  },
  {
    id: 'pro',
    name: 'Nihomi Pro',
    displayNameJa: 'プロプラン',
    tagline: 'The complete JLPT N5-N3 mastery & conversation system',
    description: 'Comprehensive curriculum including JLPT N3 intermediate Japanese, Business Keigo, and 1,500 Nihomi Coins/month.',
    badge: 'Recommended',
    isRecommended: true,
    isPopular: true,
    order: 3,
    monthlyPrice: 1990,
    quarterlyPrice: 5670,
    halfYearlyPrice: 10750,
    yearlyPrice: 20300,
    currency: 'BDT',
    aiMonthlyLimit: 1500,
    features: [
      '1,500 Nihomi Coins included / month (1 Coin = 1 Sensei Turn)',
      'All N5, N4, and intermediate N3 courses',
      'Unlimited interactive practice exercises',
      'Japanese for Work & Business Keigo masterclasses',
      'JLPT simulated mock exams & timer drills',
      'Detailed grammar breakdown & instant sentence correction',
      'Advanced progress analytics & retention tracker'
    ],
    entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro'],
    isPublished: true
  },
  {
    id: 'japan_ready',
    name: 'Nihomi Japan Ready',
    displayNameJa: '日本就労・移住特化プラン',
    tagline: 'Everything you need for job interviews, visa, and life in Japan',
    description: 'Career-focused Japanese training, workplace simulation, visa guidance, priority AI tutoring, and 4,000 Nihomi Coins/month.',
    badge: 'Best Value',
    order: 4,
    monthlyPrice: 3990,
    quarterlyPrice: 11370,
    halfYearlyPrice: 21550,
    yearlyPrice: 40700,
    currency: 'BDT',
    aiMonthlyLimit: 4000,
    features: [
      '4,000 Nihomi Coins included / month (1 Coin = 1 Sensei Turn)',
      'Everything included in Pro',
      'Workplace Japanese, Email & Phone Japanese',
      'Japanese Job Interview Simulation & Cultural Etiquette',
      'Japan Living & Relocation practical Japanese guide',
      'Official Nihomi Course Completion Certificates',
      '1-on-1 curriculum consultation & priority support'
    ],
    entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'japan_ready', 'certificates', 'priority_ai'],
    isPublished: true
  }
];

export const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan, onNavigate, initialPlan, initialInterval }) => {
  const { user, activePlanId, refreshSubscription } = useAuth();
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [interval, setInterval] = useState<JourneyInterval>(
    (initialInterval === 'monthly' || initialInterval === 'quarterly' || initialInterval === 'half-yearly' || initialInterval === 'yearly')
      ? (initialInterval as JourneyInterval)
      : 'quarterly'
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialMessage, setTrialMessage] = useState<string | null>(null);
  const [trialError, setTrialError] = useState<string | null>(null);
  const [bkashLoadingPlan, setBkashLoadingPlan] = useState<string | null>(null);
  const [bkashError, setBkashError] = useState<string | null>(null);

  const handleDirectBkashCheckout = async (planId: string) => {
    if (!user) {
      if (onNavigate) onNavigate('auth');
      return;
    }
    setBkashLoadingPlan(planId);
    setBkashError(null);
    try {
      const res = await billingApi.createBkashPayment({
        planId,
        interval
      });
      if (res.success && res.bkashURL) {
        window.location.href = res.bkashURL;
      } else {
        setBkashError(res.error || 'bKash পেমেন্ট ইনিশিয়ালাইজেশন ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setBkashError(err.message || 'সার্ভার যোগাযোগ ব্যর্থ হয়েছে।');
    } finally {
      setBkashLoadingPlan(null);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await billingApi.getPlans();
        if (res.success && res.plans) {
          setPlans(res.plans);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    trackNihomiEvent('checkout_viewed', { source: 'pricing_view' });
    fetchPlans();
  }, []);

  useEffect(() => {
    if (initialInterval && ['monthly', 'quarterly', 'half-yearly', 'yearly'].includes(initialInterval)) {
      setInterval(initialInterval as JourneyInterval);
    }
  }, [initialInterval]);

  useEffect(() => {
    if (initialPlan && initialPlan !== 'free') {
      const target = plans.find(p => p.id === initialPlan);
      if (target) {
        setSelectedPlanForCheckout(target);
        setIsCheckoutOpen(true);
      }
    }
  }, [initialPlan, plans]);


  const handleStartCheckout = (plan: Plan) => {
    if (plan.id === 'free') {
      if (onNavigate) onNavigate('dashboard');
      return;
    }
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleStartTrial = async () => {
    if (!user) {
      if (onNavigate) onNavigate('auth');
      return;
    }
    setTrialLoading(true);
    setTrialError(null);
    setTrialMessage(null);
    try {
      const res = await billingApi.startTrial('pro');
      setTrialMessage(res.message);
      await refreshSubscription();
    } catch (err: any) {
      setTrialError(err.message || 'Free trial could not be started.');
    } finally {
      setTrialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] dark:bg-[#141726] text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8" id="pricing-page">
      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlanForCheckout}
          initialInterval={
            interval === 'yearly'
              ? 'yearly'
              : interval === 'half_yearly'
              ? 'half_yearly'
              : interval === 'quarterly'
              ? 'quarterly'
              : 'monthly'
          }
          onSuccess={() => {
            setIsCheckoutOpen(false);
            if (onNavigate) onNavigate('dashboard');
          }}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>জাপান রেডিনেস অ্যান্ড কেরিয়ার প্রিপারেশন • Nihomi Pro</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            তোমার স্বপ্নটাকে বাস্তবে রূপ দেওয়ার পরবর্তী ধাপ।
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            শুধু সাধারণ বই পড়া নয়—বাস্তব জাপানে পড়ার, থাকার ও কাজ করার জন্য সম্পূর্ণ নির্ভরযোগ্য প্রস্তুতি।
          </p>

          {/* PERSONALIZED ROADMAP VISUALIZER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121124] border border-zinc-200 dark:border-white/10 shadow-lg text-left max-w-3xl mx-auto my-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
              <span className="uppercase tracking-wider">তোমার পার্সোনালাইজড প্রিপারেশন পাথওয়ে:</span>
              <span className="text-emerald-500 font-mono">Structured Pathway • লক্ষ্যভিত্তিক প্রস্তুতি</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <div className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">ধাপ ০১</div>
                <div className="font-bold text-sm mt-0.5">Beginner</div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">শূন্য থেকে শুরু ও হিরাগানা</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                <div className="font-mono text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">ধাপ ০২</div>
                <div className="font-bold text-sm mt-0.5">N5 Foundation</div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">মিন্না নো নিহোঙ্গো ১–২৫ ও কাঞ্জি</div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300">
                <div className="font-mono text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">ধাপ ০৩</div>
                <div className="font-bold text-sm mt-0.5">Konbini & Train</div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">বাস্তব জীবন, কেনাকাটা ও ভ্রমণ</div>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-300">
                <div className="font-mono text-[10px] uppercase font-bold text-red-600 dark:text-red-400">ধাপ ০৪</div>
                <div className="font-bold text-sm mt-0.5">Japan Ready 🇯🇵</div>
                <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">ভিসা, ইন্টারভিউ ও পূর্ণ প্রস্তুতি</div>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* CANONICAL 6-VALUE PILLARS SLIDESHOW CAROUSEL (EMBEDDED)            */}
          {/* =================================================================== */}
          <div className="max-w-3xl mx-auto my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#14102c] via-[#100d24] to-[#0a0817] border border-white/10 shadow-2xl relative overflow-hidden text-left" id="pricing-value-slideshow">
            <div className="pointer-events-none absolute -left-16 -top-16 w-52 h-52 bg-red-600/15 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  日
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    কেন নিহোমি প্রিমিয়াম? (NIHOMI 6-Core Values)
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    জাপানে পদার্পণ ও ক্যারিয়ার গড়ার পূর্ণাঙ্গ ডিজিটাল ইকোসিস্টেম
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev - 1 + NIHOMI_6_VALUES.length) % NIHOMI_6_VALUES.length)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="পূর্ববর্তী ভ্যালু"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % NIHOMI_6_VALUES.length)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="পরবর্তী ভ্যালু"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Slide Display */}
            {(() => {
              const currentSlide = NIHOMI_6_VALUES[activeSlide];
              const SlideIcon = currentSlide.icon;
              return (
                <div className="relative z-10 pt-4 space-y-3">
                  <div className={`p-5 rounded-2xl bg-gradient-to-br ${currentSlide.accentGradient} border border-white/15 shadow-xl space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${currentSlide.badgeColor}`}>
                        {currentSlide.badge}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                        <SlideIcon className="w-4 h-4 text-amber-300" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-japanese text-amber-400 font-bold">
                        {currentSlide.titleJa}
                      </div>
                      <h4 className="text-base font-black text-white leading-snug">
                        {currentSlide.title}
                      </h4>
                      <p className="text-xs text-stone-200 leading-relaxed font-medium">
                        {currentSlide.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-amber-300 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{currentSlide.highlightText}</span>
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {NIHOMI_6_VALUES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx
                            ? 'w-6 bg-gradient-to-r from-red-500 to-amber-500'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Monthly / 3-Month / Annual Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="bg-stone-200 dark:bg-[#1B1E30] p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1 shadow-inner border border-stone-300 dark:border-[#2A2E45]">
              <button
                type="button"
                onClick={() => setInterval('monthly')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  interval === 'monthly'
                    ? 'bg-white dark:bg-[#252A42] text-zinc-900 dark:text-zinc-100 shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                id="pricing-toggle-monthly"
              >
                ১ মাস (Monthly)
              </button>
              <button
                type="button"
                onClick={() => setInterval('quarterly')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  interval === 'quarterly'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                id="pricing-toggle-quarterly"
              >
                <span>৩ মাস (Quarterly)</span>
                <span className="text-[10px] bg-amber-700 text-white px-2 py-0.5 rounded-full font-extrabold">
                  Save ~5%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setInterval('half_yearly')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  interval === 'half_yearly'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                id="pricing-toggle-half-yearly"
              >
                <span>৬ মাস (Semi-Annual)</span>
                <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-extrabold">
                  Save ~10%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setInterval('yearly')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  interval === 'yearly'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
                id="pricing-toggle-yearly"
              >
                <span>১২ মাস (Yearly)</span>
                <span className="text-[10px] bg-red-700 text-white px-2 py-0.5 rounded-full font-extrabold">
                  Save ~15%
                </span>
              </button>
            </div>
          </div>

          {trialMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              {trialMessage}
            </div>
          )}
          {trialError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 font-medium">
              {trialError}
            </div>
          )}
          {bkashError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 font-medium">
              {bkashError}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.isPopular;
            const isCurrent = activePlanId === plan.id;
            const price = getPlanPriceForInterval(plan.monthlyPrice, plan.yearlyPrice, interval);
            const dailyReport = calculateDailyCost(price, interval);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all ${
                  isPopular
                    ? 'bg-white dark:bg-[#1B1E30] border-2 border-[#E45147] dark:border-[#E45147] shadow-xl shadow-[#E45147]/10 ring-4 ring-[#E45147]/15'
                    : 'bg-white dark:bg-[#1B1E30] border border-stone-200 dark:border-[#2A2E45] shadow-md'
                }`}
                id={`plan-card-${plan.id}`}
              >
                {/* Popular / Best Value Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Meta */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {plan.displayNameJa}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 min-h-[36px]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-5 mb-5 space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
                        {plan.id === 'free' ? '৳0' : `৳${price.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">
                        {plan.id === 'free'
                          ? '/আজীবন ফ্রি'
                          : interval === 'yearly'
                          ? '/১২ মাস'
                          : interval === 'half_yearly'
                          ? '/৬ মাস'
                          : interval === 'quarterly'
                          ? '/৩ মাস'
                          : '/মাস'}
                      </span>
                    </div>

                    {plan.id !== 'free' && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left space-y-0.5">
                        <div className="text-xs font-black text-amber-500 dark:text-amber-400">
                          {dailyReport.dailyLabelBn}
                        </div>
                        {dailyReport.comparisonBadgeBn && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ☕ {dailyReport.comparisonBadgeBn}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-zinc-700 dark:text-zinc-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  {/* Official bKash Tokenized Checkout Button */}
                  {plan.id !== 'free' && !isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleDirectBkashCheckout(plan.id)}
                      disabled={bkashLoadingPlan === plan.id}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#e2136e] hover:bg-[#c90f61] text-white text-xs font-bold shadow-md shadow-pink-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      id={`btn-bkash-pgw-${plan.id}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{bkashLoadingPlan === plan.id ? 'bKash গেটওয়ে লোড হচ্ছে...' : 'bKash দিয়ে সরাসরি পে করুন'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { const p = plans.find(x => x.id === 'pro') || plans[0]; handleStartCheckout(p); }}
                    disabled={isCurrent && plan.id !== 'free'}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : isPopular
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                        : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900'
                    }`}
                    id={`btn-choose-plan-${plan.id}`}
                  >
                    <span>{isCurrent ? 'Active Plan' : plan.id === 'free' ? 'Continue Free' : `Upgrade to ${plan.name}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>

                  {/* Direct bKash Send Money & WhatsApp verification button for Pro */}
                  {plan.id === 'pro' && !isCurrent && (
                    <button
                      type="button"
                      onClick={() => { const p = plans.find(x => x.id === 'pro') || plans[0]; handleStartCheckout(p); }}
                      className="w-full py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      id="btn-bkash-direct-pro"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>সরাসরি bKash পেমেন্ট ও WhatsApp ভেরিফিকেশন</span>
                    </button>
                  )}

                  {/* Free Trial Button for Pro */}
                  {plan.id === 'pro' && activePlanId === 'free' && (
                    <button
                      type="button"
                      onClick={handleStartTrial}
                      disabled={trialLoading}
                      className="w-full py-2 px-3 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      id="btn-start-7day-trial"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Start 7-Day Free Trial</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* CONSTITUTIONAL JOURNEY ROADMAP: 12-WEEK N5 PASS VS 12-MONTH JAPAN READY   */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111022] border border-zinc-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>বাস্তব কারিকুলাম ও মাইলস্টোন অঙ্গীকার</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              {interval === 'quarterly'
                ? '৩ মাসের কোয়ার্টারলি N5 রোডম্যাপ (Quarterly Roadmap)'
                : '১২ মাসের সম্পূর্ণ জাপান ক্যারিয়ার ও লাইফ প্রিপারেশন রোডম্যাপ'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-stone-400">
              {interval === 'quarterly'
                ? 'কোনো অতিরঞ্জিত প্রতিশ্রুতি নয়—মিন্না নো নিহোঙ্গো ১–২৫, বাস্তব মিশন এবং ১০০ কাঞ্জির সুনির্দিষ্ট ত্রৈমাসিক অগ্রগতি।'
                : 'হিরাগানা থেকে শুরু করে N5, N4, বাইতো কাস্টমার সার্ভিস, JIS রিজিউমে এবং ভিসা ইন্টারভিউ পর্যন্ত সামগ্রিক প্রস্তুতি।'}
            </p>
          </div>

          {interval === 'quarterly' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-red-500 uppercase">মাস ০১ • ধাপ ০১</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">বর্ণ ও মৌলিক উচ্চারণ</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">৪৬ হিরাগানা, ৪৬ কাতাকানা ও প্রথম ৩০টি প্রাথমিক জাপানি শব্দ।</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-500 uppercase">মাস ০২ • ধাপ ০২</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">N5 প্রাথমিক পাঠ ১–৮</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">নিজের পরিচয়, বস্তু, স্থান, সময়, দৈনন্দিন কাজ ও বিশেষণের ব্যবহার।</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-blue-500 uppercase">মাস ০৩ • ধাপ ০৩</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">টোকিও কনবিনি ও স্টেশন</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">তে-ফর্ম (〜てください), বাস্তব কেনাকাটা, ট্রেনের টিকিট ও লিসেনিং।</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase">কোয়ার্টার সমাপ্তি • ধাপ ০৪</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">N5 পূর্ণাঙ্গ জয় ও মক এক্সাম</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">লেসন ৯–২৫ সমাপ্তি, ১০০ কাঞ্জি, ১৮০ নম্বরের মক টেস্ট ও ভেরিফাইড সনদ।</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-red-500 uppercase">মাস ১–৩ • কোয়ার্টার ০১</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">N5 ভিত্তি ও দৈনন্দিন জাপানিজ</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">মৌলিক ব্যাকরণ, হিরাগানা/কাতাকানা ও প্রথম ৩টি বাস্তব জীবন মিশন।</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-500 uppercase">মাস ৪–৬ • কোয়ার্টার ০২</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">N4 পাথওয়ে ও লিসেনিং ল্যাব</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">শর্তবাচক বাক্য (〜たら), অনুমতি/নিষেধ, ১০০ কাঞ্জি ও সাবলীল শ্রবণ।</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-blue-500 uppercase">মাস ৭–৯ • কোয়ার্টার ০৩</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">Nihomi Baito POS ও JIS CV</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">টোকিও সেভেন-ইলেভেন ক্যাশিয়ার সিমুলেশন ও অফিশিয়াল A4 রিজিউমে এক্সপোর্ট।</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase">মাস ১০–১২ • কোয়ার্টার ০৪</div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">ইন্টারভিউ ও ফুল জাপান রেডি</div>
                <p className="text-xs text-zinc-600 dark:text-stone-400">ভিসা ইন্টারভিউ, কেইগো শিষ্টাচার এবং বিমানে ওঠার শতভাগ প্রস্তুতি 🇯🇵।</p>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges: bKash Only Gateway */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1B1E30] border border-stone-200 dark:border-[#2A2E45] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E2136E]" />
              পেমেন্ট মাধ্যম: শুধুমাত্র বিকাশ (bKash Only)
            </h4>
            <p className="text-xs text-zinc-500">
              কার্ডের প্রয়োজন নেই • bKash দিয়ে সহজে ও নিরাপদে সরাসরি ফি পরিশোধ করুন।
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => { const p = plans.find(x => x.id === 'pro') || plans[0]; handleStartCheckout(p); }}
              className="px-4 py-2 rounded-xl bg-[#E2136E] text-white font-bold text-xs hover:bg-[#c90f61] transition-colors flex items-center gap-1.5 shadow-md shadow-[#E2136E]/20 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              bKash দিয়ে পেমেন্ট করুন
            </button>
            <div className="px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-medium text-xs">
              অনলাইন গেটওয়ে সংযোগ প্রক্রিয়াধীন (Sandbox Testing)
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              256-Bit SSL Encrypted
            </div>
          </div>
        </div>

        {/* Detailed Comparison Matrix */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Detailed Feature Comparison</h2>
            <p className="text-xs text-zinc-500">Compare every feature and entitlement side-by-side</p>
          </div>

          <div className="bg-white dark:bg-[#1B1E30] rounded-2xl border border-stone-200 dark:border-[#2A2E45] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 dark:bg-[#141726] border-b border-stone-200 dark:border-[#2A2E45] text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Feature / Curriculum</th>
                    <th className="py-3 px-3 text-center">Free (৳0)</th>
                    <th className="py-3 px-3 text-center">
                      Starter (
                      {interval === 'monthly' && '৳990/মাস'}
                      {interval === 'quarterly' && '৳2,820 / ৩ মাস'}
                      {interval === 'half_yearly' && '৳5,350 / ৬ মাস'}
                      {interval === 'yearly' && '৳10,100 / ১২ মাস'}
                      )
                    </th>
                    <th className="py-3 px-3 text-center bg-red-500/5 text-red-600">
                      Pro (
                      {interval === 'monthly' && '৳1,990/মাস'}
                      {interval === 'quarterly' && '৳5,670 / ৩ মাস'}
                      {interval === 'half_yearly' && '৳10,750 / ৬ মাস'}
                      {interval === 'yearly' && '৳20,300 / ১২ মাস'}
                      )
                    </th>
                    <th className="py-3 px-3 text-center">
                      Japan Ready (
                      {interval === 'monthly' && '৳3,990/মাস'}
                      {interval === 'quarterly' && '৳11,370 / ৩ মাস'}
                      {interval === 'half_yearly' && '৳21,550 / ৬ মাস'}
                      {interval === 'yearly' && '৳40,700 / ১২ মাস'}
                      )
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      JLPT N5 Curriculum (Foundations)
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Lessons 1–5 Free</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full 25 Lessons</td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Full 25 Lessons</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full 25 Lessons</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      JLPT N4 & N3 Intermediate Levels
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Full Access</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full Access</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Nomi Sensei Coaching Monthly Quota
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-600">10 queries / mo</td>
                    <td className="py-3 px-3 text-center text-zinc-800 dark:text-zinc-200">100 queries / mo</td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-red-600 font-bold">1,000 queries / mo</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Unlimited Fast Quota</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Timed Mock Exams & Score Breakdown
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400">1 practice quiz</td>
                    <td className="py-3 px-3 text-center text-zinc-800 dark:text-zinc-200">Basic Quizzes</td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Full JLPT Pro Exams</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full JLPT Pro Exams</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Business Japanese & Workplace Keigo
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Complete Modules</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Japan Job Interview Simulator (IT / Caregiving / Hospitality)
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Full Simulator</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      Verifiable Course Completion Certificate
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center text-zinc-400"><X className="w-4 h-4 mx-auto" /></td>
                    <td className="py-3 px-3 text-center bg-red-500/5 text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">Included + Verified ID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Frequently Asked Questions</h2>
            <p className="text-xs text-zinc-500">Everything you need to know about billing, payments, and renewals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Can I pay using bKash or Nagad?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Yes! Lessons 1–5 are 100% free. For Pro access, we support bKash and Nagad with rapid manual TrxID verification, allowing you to pay easily in BDT without needing an international credit card.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">How does the 7-day free trial work?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                New students can activate a 7-day free trial of the Pro Plan with one click. You get unrestricted access to N5–N3 lessons and Nomi Sensei.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Can I cancel or switch plans anytime?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Absolutely. You can cancel your subscription with a single click from the Billing area. Your access will remain active until the end of the paid period.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Do I get an official tax invoice?</h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Yes. Every settled payment automatically generates an official invoice with BIN registration details, printable directly for personal or corporate sponsorship records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
