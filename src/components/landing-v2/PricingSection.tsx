import React from 'react';
import { Check } from 'lucide-react';
import { PlanId } from '../../types';

interface PricingSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onSelectPlan: (planId: PlanId) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate, onSelectPlan }) => {
  const checklist = [
    { label: 'Nihomi Cloud' },
    { label: 'AI Sensei' },
    { label: 'ব্যক্তিগত শেখার পথ' },
    { label: 'মোবাইল ও ওয়েবে অ্যাক্সেস' }
  ];

  const plans = [
    {
      id: 'free' as PlanId,
      name: 'Free',
      price: '৳0',
      period: '',
      features: [
        'প্রতিদিন ৩টি AI টার্ন',
        'বেসিক লেসন',
        '1 GB Nihomi Cloud'
      ],
      isPopular: false,
      ctaText: 'এখনই শুরু করুন',
      ctaVariant: 'outline'
    },
    {
      id: 'starter' as PlanId,
      name: 'Starter',
      price: '৳299',
      period: '/ মাস',
      features: [
        '500 AI টার্ন / মাস',
        'পূর্ণ লেসন অ্যাক্সেস',
        '10 GB Nihomi Cloud'
      ],
      isPopular: false,
      ctaText: 'এই প্ল্যান নিন',
      ctaVariant: 'filled'
    },
    {
      id: 'pro' as PlanId,
      name: 'Pro',
      price: '৳599',
      period: '/ মাস',
      popularBadge: 'সবচেয়ে জনপ্রিয়',
      features: [
        '1,500 AI টার্ন / মাস',
        'অতিরিক্ত ফিচার',
        '50 GB Nihomi Cloud'
      ],
      isPopular: true,
      ctaText: 'এই প্ল্যান নিন',
      ctaVariant: 'primary'
    },
    {
      id: 'japan_ready' as PlanId,
      name: 'Japan Ready',
      price: '৳999',
      period: '/ মাস',
      features: [
        '4,000 AI টার্ন / মাস',
        'N3-N1 + জাপান প্রস্তুতি',
        '200 GB Nihomi Cloud'
      ],
      isPopular: false,
      ctaText: 'এই প্ল্যান নিন',
      ctaVariant: 'filled'
    }
  ];

  const handleCtaClick = (planId: PlanId) => {
    if (planId === 'free') {
      onNavigate('journey');
    } else {
      onSelectPlan(planId);
    }
  };

  return (
    <section
      id="pricing-section"
      className="w-full h-auto lg:h-[165px] lg:max-h-[165px] flex items-center bg-white border-t border-slate-100 py-3 lg:py-0 overflow-hidden"
    >
      <div className="w-full max-w-[1024px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* ========================================================
              LEFT COLUMN: EDITORIAL KICKER & BENEFITS LIST (4 cols)
              Sub-split: Left text + Right checklist side-by-side
              ======================================================== */}
          <div className="lg:col-span-4 flex items-center justify-between gap-2 shrink-0">
            <div className="space-y-1 max-w-[190px]">
              <div>
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-500 select-none">
                  SIMPLE PRICING
                </span>
              </div>

              <h2 className="text-lg lg:text-[19px] font-black text-[#101A59] tracking-tight leading-[1.12]">
                আপনার গতিতে <br />
                <span className="text-[#6D25EA]">শেখা শুরু করুন</span>
              </h2>

              <p className="text-slate-600 text-[9px] leading-snug font-normal">
                ফ্রি প্ল্যান দিয়ে শুরু করুন। চাইলে পরবর্তীতে আপনার লক্ষ্য অনুযায়ী প্ল্যান আপগ্রেড করতে পারবেন।
              </p>
            </div>

            {/* Checklist items in adjacent sub-column */}
            <div className="space-y-1 shrink-0 pl-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-100 text-[#6D25EA] flex items-center justify-center shrink-0">
                    <Check className="w-2 h-2 stroke-[3]" />
                  </div>
                  <span className="text-[9px] font-semibold text-slate-700 leading-none whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: 4 PRICING CARDS IN A SINGLE ROW (8 cols)
              ======================================================== */}
          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-1.5 items-stretch h-auto lg:h-[148px]">
            {plans.map((plan) => {
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-2 flex flex-col justify-between transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF]/20 to-white border-2 border-[#8B5CF6] shadow-xs'
                      : 'bg-white border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  {/* Top Popular Badge */}
                  {plan.isPopular && plan.popularBadge && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#6D25EA] text-white text-[7.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs whitespace-nowrap">
                      {plan.popularBadge}
                    </div>
                  )}

                  <div className="space-y-0.5">
                    {/* Plan Header */}
                    <div>
                      <h3 className="text-[10px] font-bold text-[#101A59] leading-tight">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-0.5 mt-0.5">
                        <span className="text-base font-black text-[#101A59] tracking-tight leading-none">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-[8.5px] font-medium text-slate-500 leading-none">
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-0.5 my-1 pt-0.5 border-t border-slate-100">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1 text-[8.5px] text-slate-700 leading-tight">
                          <Check className="w-2.5 h-2.5 text-[#6D25EA] shrink-0 mt-0.5" />
                          <span className="font-medium truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div>
                    {plan.ctaVariant === 'outline' ? (
                      <button
                        type="button"
                        onClick={() => handleCtaClick(plan.id)}
                        className="w-full py-1 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-[9.5px] font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        {plan.ctaText}
                      </button>
                    ) : plan.ctaVariant === 'primary' ? (
                      <button
                        type="button"
                        onClick={() => handleCtaClick(plan.id)}
                        className="w-full py-1 rounded-lg bg-gradient-to-r from-[#6D25EA] to-[#8B5CF6] hover:opacity-95 text-white text-[9.5px] font-bold shadow-xs transition-all cursor-pointer"
                      >
                        {plan.ctaText}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCtaClick(plan.id)}
                        className="w-full py-1 rounded-lg bg-[#2E1065] hover:bg-[#1E0B40] text-white text-[9.5px] font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        {plan.ctaText}
                      </button>
                    )}
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
