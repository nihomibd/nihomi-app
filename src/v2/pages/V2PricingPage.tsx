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
    description: 'হিরাগানা, কাতাকানা, N5 লেসন ০১-০৫ এবং JIS রিলোকেশন CV তৈরিতে আজীবন ফ্রি অ্যাক্সেস।',
    monthlyPrice: 0,
    quarterlyPrice: 0,
    halfYearlyPrice: 0,
    yearlyPrice: 0,
    currency: 'BDT',
    badge: '১০০% ফ্রি',
    order: 1,
    features: [
      'সকল ৪৬টি হিরাগানা ও ৪৬টি কাতাকানা বর্ণমালা মাস্টারি',
      'JLPT N5 এর প্রথম ৫টি প্রামাণ্য লেসন (১০০% ফ্রি)',
      'মৌলিক ১০০ কাঞ্জি প্র্যাকটিস ওয়ার্কবুক ও কুইজ',
      'জাপানিজ JIS Z 8303 স্ট্যান্ডার্ড CV মেকার টুল',
      '১০টি Nomi Sensei ইন্টারেক্টিভ এআই ট্রায়াল কয়েন'
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


      {/* 5. Free vs Pro In-depth Comparison Matrix */}
      <div id="v2-pricing-comparison-matrix" className="mt-16 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span>স্বচ্ছ ফিচার তুলনা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            কোন প্ল্যানে কি থাকছে? বিস্তারিত তুলনা
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            ফ্রি টিয়ার এবং প্রিমিয়াম প্যাকেজের প্রতিটি ফিচার একদম স্বচ্ছভাবে জেনে আপনার উপযোগী প্ল্যান বেছে নিন।
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#141726]/90 shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 sm:p-5 font-black text-white min-w-[200px]">ফিচার ও সুবিধাসমূহ</th>
                <th className="p-4 sm:p-5 font-bold text-emerald-400 text-center min-w-[140px] bg-emerald-500/5">
                  <div className="font-black text-sm sm:text-base text-white">Free</div>
                  <div className="text-xs text-emerald-400">৳০ / আজীবন</div>
                </th>
                <th className="p-4 sm:p-5 font-bold text-stone-200 text-center min-w-[140px]">
                  <div className="font-black text-sm sm:text-base text-white">Starter</div>
                  <div className="text-xs text-stone-400">৳৯৯০ / মাস</div>
                </th>
                <th className="p-4 sm:p-5 font-bold text-amber-300 text-center min-w-[150px] bg-amber-500/10 border-x border-amber-500/20">
                  <div className="flex items-center justify-center gap-1 font-black text-sm sm:text-base text-white">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pro</span>
                  </div>
                  <div className="text-xs text-amber-300 font-semibold">৳১,৯৯০ / মাস (জনপ্রিয়)</div>
                </th>
                <th className="p-4 sm:p-5 font-bold text-cyan-300 text-center min-w-[150px]">
                  <div className="font-black text-sm sm:text-base text-white">Japan Ready</div>
                  <div className="text-xs text-cyan-300">৳৩,৯৯০ / মাস</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Category: কারিকুলাম */}
              <tr className="bg-white/5">
                <td colSpan={5} className="py-2.5 px-4 sm:px-5 text-[11px] font-black uppercase tracking-wider text-stone-400">
                  জাপানিজ লার্নিং ও কারিকুলাম
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  হিরাগানা ও কাতাকানা ক্যালিগ্রাফি স্টুডিও (Kana Studio)
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-emerald-400 font-bold">
                  ✓ সম্পূর্ণ ৯২টি বর্ণ
                </td>
                <td className="p-4 sm:p-5 text-center text-emerald-400 font-bold">✓ আনলিমিটেড</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-emerald-400 font-bold">
                  ✓ আনলিমিটেড
                </td>
                <td className="p-4 sm:p-5 text-center text-emerald-400 font-bold">✓ আনলিমিটেড</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  JLPT N5 কারিকুলাম অ্যাক্সেস
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-emerald-400 font-bold">
                  লেসন ০১ - ০৫ (১০০% ফ্রি)
                </td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ সম্পূর্ণ ২৫টি লেসন</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-stone-200 font-semibold">
                  ✓ সম্পূর্ণ ২৫টি লেসন
                </td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ সম্পূর্ণ ২৫টি লেসন</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  JLPT N4 কারিকুলাম অ্যাক্সেস
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-500 font-mono">— (Pro লক)</td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ সম্পূর্ণ ২৫টি লেসন</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-stone-200 font-semibold">
                  ✓ সম্পূর্ণ ২৫টি লেসন
                </td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ সম্পূর্ণ ২৫টি লেসন</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  JLPT N3 ইন্টারমিডিয়েট কারিকুলাম
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-500 font-mono">— (Pro লক)</td>
                <td className="p-4 sm:p-5 text-center text-stone-500 font-mono">— (Pro লক)</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-emerald-400 font-bold">
                  ✓ সম্পূর্ণ N3 প্রস্তুতি
                </td>
                <td className="p-4 sm:p-5 text-center text-emerald-400 font-bold">✓ সম্পূর্ণ N3 প্রস্তুতি</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  JLPT N2 ও N1 অ্যাডভান্সড কারিকুলাম
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-500 font-mono">—</td>
                <td className="p-4 sm:p-5 text-center text-stone-500 font-mono">—</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-stone-500 font-mono">—</td>
                <td className="p-4 sm:p-5 text-center text-cyan-400 font-bold">✓ N2 & N1 সম্পূর্ণ</td>
              </tr>

              {/* Category: কাঞ্জি ও ওয়ার্কবুক */}
              <tr className="bg-white/5">
                <td colSpan={5} className="py-2.5 px-4 sm:px-5 text-[11px] font-black uppercase tracking-wider text-stone-400">
                  কাঞ্জি ও প্র্যাকটিস টুলস
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  ১০০ কাঞ্জি প্র্যাকটিস ওয়ার্কবুক
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-300">বেসিক ৫০ কাঞ্জি</td>
                <td className="p-4 sm:p-5 text-center text-stone-300">১০০ কাঞ্জি</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-amber-300 font-semibold">
                  ২৫০ কাঞ্জি
                </td>
                <td className="p-4 sm:p-5 text-center text-cyan-300 font-semibold">১,০০০+ কাঞ্জি (N5-N1)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  স্পেসড রিপিটেশন ফ্ল্যাশকার্ড ও রিভিশন
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-300">বেসিক ফ্ল্যাশকার্ড</td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ পূর্ণাঙ্গ মেমরিওএস</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-stone-200 font-semibold">
                  ✓ দুর্বলতা বিশ্লেষণ সহ
                </td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ আনলিমিটেড</td>
              </tr>

              {/* Category: ক্যারিয়ার ও পরীক্ষা */}
              <tr className="bg-white/5">
                <td colSpan={5} className="py-2.5 px-4 sm:px-5 text-[11px] font-black uppercase tracking-wider text-stone-400">
                  জাপান ক্যারিয়ার ও এক্সাম ওএস
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  JIS Z 8303 স্ট্যান্ডার্ড জাপানিজ CV / জীবনবৃত্তান্ত মেকার
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-emerald-400 font-bold">
                  ✓ ফ্রি এডিটর ও প্রিভিউ
                </td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">✓ এডিটর ও ক্লাউড সেভ</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-amber-300 font-bold">
                  ✓ ফুল JIS এক্সপোর্ট ও PDF
                </td>
                <td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">✓ AI কাভার লেটার + PDF</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  টোকিও কনবিনি WorkOS™ ক্যাশিয়ার সিমুলেটর
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-500 font-mono">— (Pro লক)</td>
                <td className="p-4 sm:p-5 text-center text-stone-500 font-mono">— (Pro লক)</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-emerald-400 font-bold">
                  ✓ ফুল শিফট ও POS অডিও
                </td>
                <td className="p-4 sm:p-5 text-center text-emerald-400 font-bold">✓ ফুল শিফট ও সিনিয়র মোড</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  কম্পিউটার-বেসড JLPT মক এক্সাম ও অফিসিয়াল মার্কশিট
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-500 font-mono">— (লক)</td>
                <td className="p-4 sm:p-5 text-center text-stone-300">১টি কুইক মক</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-amber-300 font-bold">
                  ✓ ৫টি ফুল মক + স্কোরিং
                </td>
                <td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">✓ আনলিমিটেড + সার্টিফিকেট</td>
              </tr>

              {/* Category: এআই ও সাপোর্ট */}
              <tr className="bg-white/5">
                <td colSpan={5} className="py-2.5 px-4 sm:px-5 text-[11px] font-black uppercase tracking-wider text-stone-400">
                  Nomi Sensei AI ও সাপোর্ট
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  Nomi Sensei AI ইন্টারেক্টিভ টিউটর
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-300">১০টি ট্রায়াল কয়েন</td>
                <td className="p-4 sm:p-5 text-center text-stone-200 font-semibold">৫০০ কয়েন / মাস</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-amber-300 font-bold">
                  ১,৫০০ কয়েন / মাস
                </td>
                <td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">৪,০০০ কয়েন + প্রায়োরিটি</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition">
                <td className="p-4 sm:p-5 font-medium text-stone-200">
                  সাপোর্ট ও কনসালটেশন
                </td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5 text-stone-400">কমিউনিটি</td>
                <td className="p-4 sm:p-5 text-center text-stone-300">ইমেল সাপোর্ট</td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20 text-amber-300 font-semibold">
                  হোয়াটসঅ্যাপ প্রায়োরিটি
                </td>
                <td className="p-4 sm:p-5 text-center text-cyan-300 font-bold">১-অন-১ ভিসা ও ইন্টারভিউ</td>
              </tr>

              {/* Action Buttons Row */}
              <tr className="bg-white/5 border-t border-white/10">
                <td className="p-4 sm:p-5 font-black text-white">এখনই শুরু করুন</td>
                <td className="p-4 sm:p-5 text-center bg-emerald-500/5">
                  <button
                    onClick={() => onNavigate('journey')}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    ফ্রি শুরু করুন
                  </button>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <button
                    onClick={() => handleOpenCheckout(ALL_PLANS[1])}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#1E2338] hover:bg-[#252c48] border border-white/20 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Starter নিন
                  </button>
                </td>
                <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20">
                  <button
                    onClick={() => handleOpenCheckout(ALL_PLANS[2])}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-red-600/30"
                  >
                    Pro সাবস্ক্রাইব
                  </button>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <button
                    onClick={() => handleOpenCheckout(ALL_PLANS[3])}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    Japan Ready
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
