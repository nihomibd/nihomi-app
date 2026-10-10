import React from 'react';
import {
  BarChart3,
  Target,
  BookOpen,
  Headphones,
  MessageSquare,
  Plane,
  ArrowRight,
  ChevronRight
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
      tag: '৫ মিনিট',
      icon: BarChart3,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
      badgeColor: 'bg-sky-100/70 text-sky-700'
    },
    {
      num: '02',
      title: 'আপনার স্তর নির্ধারণ',
      subtitle: '(N5 - N1)',
      tag: 'AI নির্ভর',
      icon: Target,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      badgeColor: 'bg-rose-100/70 text-rose-700'
    },
    {
      num: '03',
      title: 'আজকের মিশন',
      subtitle: '(আপনার জন্য ব্যক্তিগত)',
      tag: 'প্রতিদিন',
      icon: BookOpen,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      badgeColor: 'bg-emerald-100/70 text-emerald-700'
    },
    {
      num: '04',
      title: 'শিখুন',
      subtitle: '(ভিডিও + অনুশীলন)',
      tag: 'ধাপে ধাপে',
      icon: Headphones,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      badgeColor: 'bg-purple-100/70 text-purple-700'
    },
    {
      num: '05',
      title: 'ব্যবহার করুন',
      subtitle: '(বাস্তব জাপানিজ)',
      tag: 'কথা বলুন',
      icon: MessageSquare,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      badgeColor: 'bg-indigo-100/70 text-indigo-700'
    },
    {
      num: '06',
      title: 'জাপান প্রস্তুতি',
      subtitle: '(পড়াশোনা, কাজ, ভ্রমণ, জীবন)',
      tag: 'আপনার ভবিষ্যৎ',
      icon: Plane,
      iconColor: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      borderColor: 'border-fuchsia-100',
      badgeColor: 'bg-fuchsia-100/70 text-fuchsia-700'
    }
  ];

  return (
    <section id="why-nihomi" className="py-2.5 lg:py-3 bg-[#F8FAFF] border-t border-slate-100">
      <div className="max-w-[1000px] xl:max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* 2-Column Macro Layout matching Reference Slice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-center">
          
          {/* LEFT COLUMN: Editorial Intro & CTA (3 cols) */}
          <div className="lg:col-span-3 space-y-2 lg:space-y-2.5">
            <div className="inline-flex items-center gap-2">
              <span className="text-[9.5px] font-extrabold tracking-widest uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                YOUR JAPANESE JOURNEY
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-[25px] font-black text-[#101A59] tracking-tight leading-[1.15]">
              আপনার ব্যক্তিগত <br />
              শেখার পথ
            </h2>
            
            <p className="text-slate-600 text-[11px] leading-snug font-normal">
              আপনার বর্তমান অবস্থান থেকে জাপানের লক্ষ্য পর্যন্ত — একটি কাঠামোগত, ধাপে ধাপে শেখার যাত্রা।
            </p>

            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] text-white font-extrabold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>আপনার শেখার পথ দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* RIGHT COLUMN: 6 Step Cards in a single row (9 cols) */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.num} className="relative group">
                  <div
                    onClick={() => onNavigate('journey')}
                    className={`h-full bg-white rounded-2xl p-2.5 border ${step.borderColor} shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between items-center text-center space-y-1.5 cursor-pointer hover:-translate-y-0.5`}
                  >
                    {/* Top Icon & Number */}
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-xl ${step.bgColor} ${step.iconColor} flex items-center justify-center shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono text-xs font-black text-slate-800 tracking-tight">
                        {step.num}
                      </span>
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="min-h-[38px] flex flex-col justify-center">
                      <h3 className="text-[11px] font-black text-[#101A59] leading-tight group-hover:text-[#6D25EA] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    {/* Bottom Tag / Badge */}
                    <div className="pt-1 border-t border-slate-100 w-full flex justify-center">
                      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full ${step.badgeColor} leading-none`}>
                        {step.tag}
                      </span>
                    </div>
                  </div>

                  {/* Arrow indicator between cards on desktop */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-slate-200/90 shadow-2xs items-center justify-center text-slate-400 pointer-events-none">
                      <ChevronRight className="w-2.5 h-2.5" />
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
