import React from 'react';
import {
  BarChart2,
  Target,
  BookOpen,
  Headphones,
  MessageSquare,
  Plane,
  ArrowRight
} from 'lucide-react';

interface LearningJourneySectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LearningJourneySection: React.FC<LearningJourneySectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'শুরুতে জানুন',
      subtitle: '(Quick Test)',
      meta: '৫ মিনিট',
      icon: BarChart2,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-50'
    },
    {
      num: '02',
      title: 'আপনার স্তর নির্ধারণ',
      subtitle: '(N5 - N1)',
      meta: 'AI নির্ভর',
      icon: Target,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50'
    },
    {
      num: '03',
      title: 'আজকের মিশন',
      subtitle: '(আপনার জন্য ব্যক্তিগত)',
      meta: 'প্রতিদিন',
      icon: BookOpen,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      num: '04',
      title: 'শিখুন',
      subtitle: '(ভিডিও + অনুশীলন)',
      meta: 'ধাপে ধাপে',
      icon: Headphones,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      num: '05',
      title: 'ব্যবহার করুন',
      subtitle: '(বাস্তব জাপানিজ)',
      meta: 'কথা বলুন',
      icon: MessageSquare,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      num: '06',
      title: 'জাপান প্রস্তুতি',
      subtitle: '(পড়াশোনা, কাজ, জীবন)',
      meta: 'আপনার ভবিষ্যৎ',
      icon: Plane,
      iconColor: 'text-fuchsia-500',
      bgColor: 'bg-fuchsia-50'
    }
  ];

  return (
    <section
      id="why-nihomi"
      className="w-full h-auto lg:h-[215px] lg:max-h-[215px] flex items-center bg-[#F8FAFF] border-t border-slate-100 py-4 lg:py-0"
    >
      <div className="w-full max-w-[1024px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* ========================================================
              LEFT COLUMN: EDITORIAL INTRO & CTA (3 cols)
              ======================================================== */}
          <div className="lg:col-span-3 space-y-1.5 shrink-0">
            <div>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-500 select-none">
                YOUR JAPANESE JOURNEY
              </span>
            </div>
            
            <h2 className="text-xl lg:text-[22px] font-black text-[#101A59] tracking-tight leading-[1.14]">
              আপনার ব্যক্তিগত <br />
              শেখার পথ
            </h2>
            
            <p className="text-slate-600 text-[10px] leading-snug font-normal max-w-xs">
              আপনার বর্তমান অবস্থান থেকে জাপানের লক্ষ্য পর্যন্ত — একটি কাঠামোগত, ধাপে ধাপে শেখার যাত্রা।
            </p>

            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3B1C84] hover:bg-[#2E126E] text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <span>আপনার শেখার পথ দেখুন</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: 6 STEP CARDS IN A SINGLE ROW (9 cols)
              ======================================================== */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 items-stretch h-auto lg:h-[185px]">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.num} className="relative flex items-center">
                  <div
                    onClick={() => onNavigate('journey')}
                    className="w-full h-full bg-white rounded-xl p-2 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between items-center text-center cursor-pointer hover:border-purple-200"
                  >
                    {/* Top Icon & Number */}
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <div className={`w-6 h-6 rounded-lg ${step.bgColor} ${step.iconColor} flex items-center justify-center shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono text-[11px] font-black text-[#101A59] tracking-tight leading-none">
                        {step.num}
                      </span>
                    </div>

                    {/* Middle Titles */}
                    <div className="space-y-0.5 my-1">
                      <h3 className="text-[10px] font-black text-slate-800 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-[8.5px] text-slate-500 font-medium leading-tight">
                        {step.subtitle}
                      </p>
                    </div>

                    {/* Bottom Meta Text */}
                    <div className="pb-0.5">
                      <span className="text-[8px] font-medium text-slate-400 leading-none">
                        {step.meta}
                      </span>
                    </div>
                  </div>

                  {/* Connecting Arrow between cards */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none text-[9px] font-bold">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
