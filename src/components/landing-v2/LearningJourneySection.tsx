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
    <section id="why-nihomi" className="py-14 sm:py-20 bg-[#F8FAFF] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                YOUR JAPANESE JOURNEY
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#101A59] tracking-tight leading-[1.2]">
              আপনার ব্যক্তিগত শেখার পথ
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              আপনার বর্তমান অবস্থান থেকে জাপানের লক্ষ্য পর্যন্ত — একটি কাঠামোগত, ধাপে ধাপে শেখার যাত্রা।
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5120B8] hover:bg-[#43149E] text-white font-bold text-sm shadow-md shadow-purple-900/20 hover:shadow-purple-900/35 transition-all cursor-pointer"
            >
              <span>আপনার শেখার পথ দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 6 Step Cards Connected in Progression */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.num} className="relative group">
                <div
                  onClick={() => onNavigate('journey')}
                  className={`h-full bg-white rounded-3xl p-4 sm:p-5 border ${step.borderColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer hover:-translate-y-1`}
                >
                  {/* Top Icon & Number */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl ${step.bgColor} ${step.iconColor} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {step.num}
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <div>
                    <h3 className="text-sm font-black text-[#101A59] leading-snug group-hover:text-[#6D25EA] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Bottom Tag / Badge */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.badgeColor}`}>
                      {step.tag}
                    </span>
                  </div>
                </div>

                {/* Arrow indicator between cards on desktop */}
                {!isLast && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200/80 shadow-2xs items-center justify-center text-slate-400 pointer-events-none">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
