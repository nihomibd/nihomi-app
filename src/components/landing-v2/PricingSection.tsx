import React, { useState } from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PlanId } from '../../types';

interface PricingSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onSelectPlan: (planId: PlanId) => void;
}

type BillingInterval = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate, onSelectPlan }) => {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  // Exact canonical prices per the 12-price matrix
  const pricingData = {
    starter: {
      monthly: 990,
      quarterly: 2820,
      half_yearly: 5350,
      yearly: 10100
    },
    pro: {
      monthly: 1990,
      quarterly: 5670,
      half_yearly: 10750,
      yearly: 20300
    },
    japan_ready: {
      monthly: 3990,
      quarterly: 11370,
      half_yearly: 21550,
      yearly: 40700
    }
  };

  const formatPrice = (amount: number) => {
    return '৳' + amount.toLocaleString('en-IN');
  };

  const getIntervalLabel = () => {
    switch (interval) {
      case 'monthly': return '/ মাস';
      case 'quarterly': return '/ ৩ মাস';
      case 'half_yearly': return '/ ৬ মাস';
      case 'yearly': return '/ বছর';
    }
  };

  const plans = [
    {
      id: 'free' as PlanId,
      name: 'Nihomi Free',
      titleBn: 'ফ্রি ট্রায়াল',
      price: '৳০',
      period: 'আজীবন',
      desc: 'প্ল্যাটফর্মের কার্যকারিতা ও নমি সেন্সেইর শিক্ষাপদ্ধতি যাচাই করার জন্য।',
      features: [
        'হিরাগানা ৫টি মৌলিক স্বরবর্ণ লেসন',
        'প্রতিদিন ৩টি নমি সেন্সেই কথোপকথন',
        'বেসিক লার্নিং ক্যানভাস অ্যাক্সেস'
      ],
      isPopular: false,
      ctaText: 'বিনামূল্যে শুরু করুন',
      variant: 'free'
    },
    {
      id: 'starter' as PlanId,
      name: 'Nihomi Starter',
      titleBn: 'ফাউন্ডেশন প্ল্যান',
      price: formatPrice(pricingData.starter[interval]),
      period: getIntervalLabel(),
      desc: 'JLPT N5 ও N4 পরীক্ষার সম্পূর্ণ প্রস্তুতি ও ধারাবাহিক রিভিশন।',
      features: [
        'JLPT N5 ও N4 সম্পূর্ণ কারিকুলাম',
        'নমি সেন্সেই পার্সোনাল কোচিং',
        'দৈনিক মেমরিওএস ফ্ল্যাশকার্ড ও কুইজ',
        'ফুল অডিও প্রোনাউন্সিয়েশন লাইব্রেরি'
      ],
      isPopular: false,
      ctaText: 'Starter বেছে নিন',
      variant: 'standard'
    },
    {
      id: 'pro' as PlanId,
      name: 'Nihomi Pro',
      titleBn: 'সবচেয়ে জনপ্রিয়',
      price: formatPrice(pricingData.pro[interval]),
      period: getIntervalLabel(),
      desc: 'N5 থেকে N3 সম্পূর্ণ প্রস্তুতি, মক টেস্ট ও কনবিনি সিমুলেটর।',
      features: [
        'N5, N4 ও N3 সম্পূর্ণ কারিকুলাম',
        '৫টি অফিসিয়াল JLPT মক-টেস্ট ইঞ্জিন',
        'WorkOS™ কনবিনি বাইতো ক্যাশিয়ার সিমুলেশন',
        'আনলিমিটেড নমি সেন্সেই ব্যাকরণ বিশ্লেষণ',
        'প্রায়োরিটি সাপোর্ট ও উইক-স্পট ডিলিং'
      ],
      isPopular: true,
      popularBadge: 'সবচেয়ে জনপ্রিয়',
      ctaText: 'Pro প্ল্যান নিন',
      variant: 'pro'
    },
    {
      id: 'japan_ready' as PlanId,
      name: 'Nihomi Japan Ready',
      titleBn: 'ক্যারিয়ার ও ইমিগ্রেশন',
      price: formatPrice(pricingData.japan_ready[interval]),
      period: getIntervalLabel(),
      desc: 'জাপানে চাকরি, পড়াশোনা ও ভিসা ইন্টারভিউয়ের জন্য অল-ইন-ওয়ান প্যাকেজ।',
      features: [
        'N5 থেকে N1 সম্পূর্ণ অ্যাডভান্সড কারিকুলাম',
        'JIS স্ট্যান্ডার্ড রিজিউমে বিল্ডার ও কভার লেটার',
        'নারিতা এয়ারপোর্ট ও বিজনেস কেইগো সিমুলেশন',
        'রিয়েল-টাইম ইন্টারভিউ মক সেশন',
        'সব ফিচার ও সম্পূর্ণ প্ল্যাটফর্ম অ্যাক্সেস'
      ],
      isPopular: false,
      ctaText: 'Japan Ready নিন',
      variant: 'premium'
    }
  ];

  return (
    <section id="pricing-section" className="py-20 md:py-28 bg-[#141726] text-[#F6F0E6] relative border-b border-[#F6F0E6]/10">
      <LandingPageContainer>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E45147]" />
            স্বচ্ছ ও অনুমোদিত ১২-মূল্য তালিকা • Approved Pricing Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            কোনো গোপন চার্জ নেই — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-200">
              আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            সরাসরি বিকাশ (bKash) ও লোকাল বাংলাদেশি পেমেন্টে মুহূর্তেই অ্যাক্টিভেশন।
          </p>
        </div>

        {/* Billing Interval Toggle Pill */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                interval === 'monthly'
                  ? 'bg-[#E45147] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              মাসিক
            </button>
            <button
              onClick={() => setInterval('quarterly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                interval === 'quarterly'
                  ? 'bg-[#E45147] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ৩ মাস (ত্রৈমাসিক)
            </button>
            <button
              onClick={() => setInterval('half_yearly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                interval === 'half_yearly'
                  ? 'bg-[#E45147] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ৬ মাস (অর্ধ-বার্ষিক)
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                interval === 'yearly'
                  ? 'bg-[#E45147] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ১ বছর (বার্ষিক)
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {plans.map((plan) => {
            const isPro = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:-translate-y-1 ${
                  isPro
                    ? 'bg-gradient-to-b from-[#1B1E30] to-[#141726] border-2 border-[#E45147] shadow-2xl scale-[1.02]'
                    : 'bg-[#1B1E30] border border-[#F6F0E6]/10 shadow-lg'
                }`}
              >
                {/* Popular badge */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E45147] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap">
                    {plan.popularBadge}
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-slate-400">
                      {plan.titleBn}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {plan.period}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 pb-6 border-b border-white/10">
                    {plan.desc}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-[#6D7C55] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (plan.id === 'free') {
                        onNavigate('lesson', { id: 'n5-l1' });
                      } else {
                        onSelectPlan(plan.id);
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
                      isPro
                        ? 'bg-[#E45147] hover:bg-[#d44339] text-white'
                        : plan.id === 'free'
                        ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                        : 'bg-white/15 hover:bg-[#E45147] text-white'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Trust Guarantee */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#6D7C55] shrink-0" />
            <span>বিকাশ ও ডিজিটাল পেমেন্ট গেটওয়ে • ৭ দিনের রিফান্ড পলিসি নীতিমালা সাপেক্ষে • স্বচ্ছ ভ্যাট ব্রেকডাউন</span>
          </div>
          <button
            onClick={() => onNavigate('pricing')}
            className="text-[#E45147] hover:underline font-semibold shrink-0"
          >
            ট্যাক্স ও চালান বিস্তারিত →
          </button>
        </div>
      </LandingPageContainer>
    </section>
  );
};
