// src/v2/pages/V2PricingPage.tsx
// NIHOMI V2 — 12-PRICE MATRIX & CANONICAL CHECKOUT STUDIO
import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  CreditCard,
  Building2,
  Clock,
  ArrowRight,
  HelpCircle,
  Award,
  Crown
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { Plan, PlanId } from '../../types';
import { JourneyInterval, calculateDailyCost, getPlanPriceForInterval } from '../../core/billing/priceCalculator';
import { CheckoutModal } from '../../components/CheckoutModal';

interface V2PricingPageProps {
  initialPlan?: PlanId | string;
  initialInterval?: JourneyInterval | string;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

const ALL_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Nihomi Free',
    displayNameJa: '無料プラン',
    tagline: 'Start learning Japanese foundations',
    description: 'হিরাগানা, কাতাকানা এবং N5 প্রথম ৫টি বেসিক লেসনে আজীবন ফ্রি অ্যাক্সেস।',
    monthlyPrice: 0,
    quarterlyPrice: 0,
    halfYearlyPrice: 0,
    yearlyPrice: 0,
    currency: 'BDT',
    badge: 'ফ্রি স্টার্টার',
    order: 1,
    features: [
      'হিরাগানা ও কাতাকানা ক্যালিগ্রাফি স্টুডিও',
      'JLPT N5 প্রথম ৫টি প্রামাণ্য লেসন',
      'মৌলিক কুইজ ও ফ্ল্যাশকার্ড প্র্যাকটিস',
      'কমিউনিটি ডিসকর্ড ও সাপোর্ট'
    ],
    aiMonthlyLimit: 50,
    entitlements: ['n5'],
    isPublished: true
  },
  {
    id: 'starter',
    name: 'Nihomi Starter',
    displayNameJa: 'スタータープラン',
    tagline: 'Master JLPT N5 & N4 foundations',
    description: 'JLPT N5 এবং N4 এর পূর্ণাঙ্গ ৫০টি লেসন ও Nomi Sensei লার্নিং মেন্টর।',
    monthlyPrice: 990,
    quarterlyPrice: 2820,
    halfYearlyPrice: 5350,
    yearlyPrice: 10100,
    currency: 'BDT',
    badge: 'বেসিক প্ল্যান',
    order: 2,
    features: [
      'JLPT N5 ও N4 এর সম্পূর্ণ কারিকুলাম',
      'Nomi Sensei সার্বক্ষণিক AI লার্নিং টিউটর',
      'মাসিক ৫০০টি ভয়েস ও প্রোনাউনসিয়েশন ফিডব্যাক',
      'চ্যাপ্টারভিত্তিক রিভিশন টেস্ট ও নোটস'
    ],
    aiMonthlyLimit: 500,
    entitlements: ['n5', 'quizzes', 'ai_coach'],
    isPublished: true
  },
  {
    id: 'pro',
    name: 'Nihomi Pro',
    displayNameJa: 'プロプラン',
    tagline: 'Complete JLPT N5-N3 mastery & conversation',
    description: 'N5 থেকে N3 ফুল প্রস্তুতি, WorkOS™ কনবিনি বাইতো ড্রিল ও ফুল মক-টেস্ট।',
    monthlyPrice: 1990,
    quarterlyPrice: 5670,
    halfYearlyPrice: 10750,
    yearlyPrice: 20300,
    currency: 'BDT',
    badge: 'সবচেয়ে জনপ্রিয়',
    isRecommended: true,
    order: 3,
    features: [
      'JLPT N5, N4 ও N3 এর পূর্ণাঙ্গ প্রস্তুতি',
      'টোকিও কনবিনি WorkOS™ ক্যাশিয়ার সিমুলেটর',
      'ফুল লেন্থ JLPT মক টেস্ট ইঞ্জিন (রিয়েল স্কোরিং)',
      'মাসিক ১,৫০০টি এআই লার্নিং ইন্টারঅ্যাকশন',
      'অগ্রাধিকারমূলক হোয়াটসঅ্যাপ হেল্পলাইন'
    ],
    aiMonthlyLimit: 1500,
    entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro'],
    isPublished: true
  },
  {
    id: 'japan_ready',
    name: 'Nihomi Japan Ready',
    displayNameJa: '日本就労・移住特化プラン',
    tagline: 'Everything you need for job interviews, visa, and life in Japan',
    description: 'জাপান ক্যারিয়ার ও রিলোকেশন প্যাক: JIS CV স্টুডিও ও ১০টি লাইফ সিনারিও।',
    monthlyPrice: 3990,
    quarterlyPrice: 11370,
    halfYearlyPrice: 21550,
    yearlyPrice: 40700,
    currency: 'BDT',
    badge: 'জাপান ক্যারিয়ার',
    order: 4,
    features: [
      'N5 থেকে N1 সম্পূর্ণ অ্যাডভান্সড কারিকুলাম',
      'JIS স্ট্যান্ডার্ড A4 রিলোকেশন CV ও PDF এক্সপোর্ট',
      'জাপানিজ ল্যাঙ্গুয়েজ স্কুল প্রিন্সিপাল ইন্টারভিউ ড্রিল',
      'ওয়ার্ড অফিস, ব্যাংক ও ইমিগ্রেশন লাইফ সিনারিও',
      'মাসিক ৪,০০০টি এআই ভয়েস ইন্টারঅ্যাকশন',
      'ভিআইপি ১-অন-১ কনসালটেশন সাপোর্ট'
    ],
    aiMonthlyLimit: 4000,
    entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'japan_ready'],
    isPublished: true
  }
];

export const V2PricingPage: React.FC<V2PricingPageProps> = ({
  initialPlan,
  initialInterval,
  onNavigate
}) => {
  const [selectedInterval, setSelectedInterval] = useState<JourneyInterval>(
    (initialInterval as JourneyInterval) || 'quarterly'
  );
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleOpenCheckout = (plan: Plan) => {
    if (plan.monthlyPrice === 0) {
      onNavigate('journey');
      return;
    }
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>স্বচ্ছ ও নিরাপদ ইনভেস্টমেন্ট</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          আপনার জাপান স্বপ্নের সঠিক প্ল্যানটি বেছে নিন
        </h1>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          কোনো লুকায়িত চার্জ নেই। বিকাশ, নগদ ও কার্ডে সহজে সাবস্ক্রাইব করুন এবং আজই আপনার জাপানিজ মাস্টারি শুরু করুন।
        </p>

        {/* 2. Billing Interval Selector */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1.5 bg-[#141726] rounded-2xl border border-white/10 gap-1 overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedInterval('monthly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedInterval === 'monthly'
                  ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              মাসিক (১ মাস)
            </button>
            <button
              onClick={() => setSelectedInterval('quarterly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedInterval === 'quarterly'
                  ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>৩ মাস (কোয়ার্টারলি)</span>
              <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black">
                ৫% ছাড়
              </span>
            </button>
            <button
              onClick={() => setSelectedInterval('half_yearly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedInterval === 'half_yearly'
                  ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>৬ মাস (হাফ-ইয়ার্লি)</span>
              <span className="text-[10px] bg-emerald-400 text-black px-1.5 py-0.2 rounded font-black">
                ১০% ছাড়
              </span>
            </button>
            <button
              onClick={() => setSelectedInterval('yearly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedInterval === 'yearly'
                  ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>বাৎসরিক (১ বছর)</span>
              <span className="text-[10px] bg-cyan-400 text-black px-1.5 py-0.2 rounded font-black">
                ১৫% ছাড়
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 4-Column Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {ALL_PLANS.map((plan) => {
          const finalPrice = getPlanPriceForInterval(plan.monthlyPrice, plan.yearlyPrice, selectedInterval);
          const dailyReport = calculateDailyCost(finalPrice, selectedInterval);
          const isPro = plan.isRecommended;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                isPro
                  ? 'bg-gradient-to-b from-[#1F2540] to-[#121524] border-2 border-[#E45147] shadow-2xl shadow-red-600/20 lg:-translate-y-2'
                  : 'bg-[#141726] border border-white/10 hover:border-white/20'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#E45147] to-[#F59E0B] text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <div className="text-xs text-stone-400 font-serif mt-0.5">{plan.displayNameJa}</div>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-4 border-y border-white/10 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ৳{finalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400">
                      / {selectedInterval === 'monthly' ? 'মাস' : selectedInterval === 'quarterly' ? '৩ মাস' : selectedInterval === 'half_yearly' ? '৬ মাস' : 'বছর'}
                    </span>
                  </div>

                  {plan.monthlyPrice > 0 && (
                    <div className="text-[11px] text-amber-400 font-mono">
                      মাত্র {dailyReport.dailyLabelBn}
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-black uppercase text-stone-400 tracking-wider">
                    প্ল্যানের সুবিধাসমূহ:
                  </span>
                  <div className="space-y-2">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-stone-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => handleOpenCheckout(plan)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isPro
                      ? 'bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white shadow-xl shadow-red-600/30'
                      : plan.monthlyPrice === 0
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                      : 'bg-[#1E2338] hover:bg-[#252c48] border border-white/20 text-white'
                  }`}
                >
                  <span>{plan.monthlyPrice === 0 ? 'ফ্রি শুরু করুন' : 'সাবস্ক্রাইব করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Safe Payment Badges */}
      <div className="p-6 rounded-3xl bg-[#141726] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <strong className="text-white">১০০% মানি-ব্যাক গ্যারান্টি:</strong> প্রথম ৭ দিনের মধ্যে সন্তুষ্ট না হলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ রিফান্ড।
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-stone-400">
          <span>bKash</span> • <span>Nagad</span> • <span>Visa</span> • <span>Mastercard</span>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          plan={selectedPlanForCheckout}
          initialInterval={selectedInterval}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            onNavigate('dashboard');
          }}
        />
      )}
    </div>
  );
};
