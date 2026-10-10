import React from 'react';
import { Check, ArrowRight, Sparkles, Cloud, Bot, Smartphone, Compass } from 'lucide-react';
import { PlanId } from '../../types';

interface PricingSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onSelectPlan?: (planId: PlanId) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate, onSelectPlan }) => {
  const checklist = [
    { label: 'Nihomi Cloud', icon: Cloud },
    { label: 'AI Sensei', icon: Bot },
    { label: 'ব্যক্তিগত শেখার পথ', icon: Compass },
    { label: 'মোবাইল ও ওয়েব অ্যাক্সেস', icon: Smartphone }
  ];

  const plans = [
    {
      id: 'free' as PlanId,
      name: 'Free',
      price: '৳0',
      period: '',
      isPopular: false,
      features: [
        'প্রতিদিন ৩টি AI টার্ন',
        'বেসিক লেসন',
        '1 GB Nihomi Cloud'
      ],
      ctaText: 'এখনই শুরু করুন',
      ctaStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs'
    },
    {
      id: 'starter' as PlanId,
      name: 'Starter',
      price: '৳299',
      period: '/মাস',
      isPopular: false,
      features: [
        '500 AI টার্ন / মাস',
        'পূর্ণ লেসন অ্যাক্সেস',
        '10 GB Nihomi Cloud'
      ],
      ctaText: 'এই প্ল্যান নিন',
      ctaStyle: 'bg-[#5120B8] hover:bg-[#43149E] text-white shadow-md shadow-purple-900/15'
    },
    {
      id: 'pro' as PlanId,
      name: 'Pro',
      price: '৳599',
      period: '/মাস',
      isPopular: true,
      popularBadge: 'সবচেয়ে জনপ্রিয়',
      features: [
        '1,500 AI টার্ন / মাস',
        'অতিরিক্ত ফিচার',
        '50 GB Nihomi Cloud'
      ],
      ctaText: 'এই প্ল্যান নিন',
      ctaStyle: 'bg-[#6D25EA] hover:bg-[#5818D1] text-white shadow-lg shadow-purple-600/30'
    },
    {
      id: 'japan_ready' as PlanId,
      name: 'Japan Ready',
      price: '৳999',
      period: '/মাস',
      isPopular: false,
      features: [
        '4,000 AI টার্ন / মাস',
        'N3-N1 + জাপান প্রস্তুতি',
        '200 GB Nihomi Cloud'
      ],
      ctaText: 'এই প্ল্যান নিন',
      ctaStyle: 'bg-[#5120B8] hover:bg-[#43149E] text-white shadow-md shadow-purple-900/15'
    }
  ];

  const handlePlanAction = (planId: PlanId) => {
    if (planId === 'free') {
      onNavigate('journey');
    } else if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      onNavigate('pricing');
    }
  };

  return (
    <section id="pricing-section" className="py-2.5 lg:py-3 bg-white border-t border-slate-100">
      <div className="max-w-[1000px] xl:max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-center">
          
          {/* ========================================================
              LEFT COLUMN: EDITORIAL KICKER & BENEFITS LIST (4 cols)
              ======================================================== */}
          <div className="lg:col-span-4 space-y-1.5 lg:space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="text-[9.5px] font-extrabold tracking-widest uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                SIMPLE PRICING
              </span>
            </div>

            <h2 className="text-xl lg:text-[23px] font-black text-[#101A59] tracking-tight leading-[1.15]">
              আপনার গতিতে <br />
              <span className="text-[#6D25EA]">শেখা শুরু করুন</span>
            </h2>

            <p className="text-slate-600 text-[10.5px] leading-snug font-normal">
              ফ্রি প্ল্যান দিয়ে শুরু করুন। চাইলে পরবর্তীতে আপনার লক্ষ্য অনুযায়ী প্ল্যান আপগ্রেড করতে পারবেন।
            </p>

            {/* Checklist items */}
            <div className="space-y-1 pt-1">
              {checklist.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#6D25EA] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: 4 PRICING CARDS (8 cols, single row on lg)
              ======================================================== */}
          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 items-stretch">
            {plans.map((plan) => {
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-[#F8F5FF] border-2 border-[#6D25EA] shadow-md shadow-purple-900/10'
                      : 'bg-white border border-slate-200/80 shadow-2xs hover:shadow-sm'
                  }`}
                >
                  {/* Top Popular Badge */}
                  {plan.isPopular && plan.popularBadge && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#6D25EA] text-white text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap">
                      {plan.popularBadge}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {/* Plan Header */}
                    <div className="border-b border-slate-100 pb-1">
                      <h3 className="text-xs font-black text-[#101A59]">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-0.5 mt-0.5">
                        <span className="text-xl lg:text-2xl font-black text-[#101A59] tracking-tight">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-1 pt-0.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[9.5px] text-slate-700">
                          <Check className="w-3 h-3 text-[#6D25EA] shrink-0 mt-0.5" />
                          <span className="leading-tight font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handlePlanAction(plan.id)}
                      className={`w-full py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${plan.ctaStyle}`}
                    >
                      {plan.ctaText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
