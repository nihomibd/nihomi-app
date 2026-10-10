import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  BookOpen,
  Sparkles,
  Compass,
  GraduationCap,
  Briefcase,
  Plane,
  Heart,
  Bot,
  X
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const shortcutItems = [
    {
      icon: GraduationCap,
      label: 'জাপানে পড়াশোনা',
      sublabel: 'Study in Japan',
      color: 'text-sky-600 bg-sky-50 hover:bg-sky-100/80 border-sky-100',
      action: () => onNavigate('courses')
    },
    {
      icon: Briefcase,
      label: 'জাপানে কাজের সুযোগ',
      sublabel: 'Work in Japan',
      color: 'text-violet-600 bg-purple-50 hover:bg-purple-100/80 border-purple-100',
      action: () => onNavigate('baito')
    },
    {
      icon: Plane,
      label: 'জাপান ভ্রমণ ও জীবন',
      sublabel: 'Travel & Life',
      color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100',
      action: () => onNavigate('baito')
    },
    {
      icon: Heart,
      label: 'জাপানি সংস্কৃতি ও বন্ধুত্ব',
      sublabel: 'Culture & Community',
      color: 'text-rose-600 bg-rose-50 hover:bg-rose-100/80 border-rose-100',
      action: () => onNavigate('community')
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F5FF] via-[#FFFFFF] to-[#F8FAFF] py-6 lg:py-0 lg:h-[380px] lg:max-h-[380px] flex items-center">
      {/* Background Japanese soft floral atmosphere and radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1000px] xl:max-w-7xl mx-auto px-4 sm:px-6 w-full h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-3 items-center w-full">
          
          {/* ========================================================
              LEFT COLUMN: HERO COPY & CALLS TO ACTION (5 cols)
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2 lg:space-y-2.5 z-10">
            {/* Small letter-spaced kicker */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[9.5px] font-extrabold tracking-widest uppercase text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                YOUR JAPANESE JOURNEY STARTS HERE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[27px] font-black tracking-tight text-[#101A59] leading-[1.14]">
              জাপানিজ শেখা <br />
              শুরু হোক <br />
              <span className="text-[#6D25EA] inline-block">একদম শূন্য থেকে।</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-slate-600 text-[11.5px] sm:text-xs leading-relaxed max-w-sm font-normal">
              Nihomi Learning Companion-এর সাথে ধাপে ধাপে শিখুন, অনুশীলন করুন এবং জাপান জীবনের জন্য প্রস্তুত হন।
            </p>

            {/* 3 Compact Value Proposition Pills */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 pt-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <div className="w-5 h-5 rounded-lg bg-purple-50 text-[#6D25EA] flex items-center justify-center shrink-0">
                  <BookOpen className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 leading-tight whitespace-nowrap">
                  শূন্য থেকে ধাপে ধাপে
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <div className="w-5 h-5 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 leading-tight whitespace-nowrap">
                  AI Sensei সবসময় পাশে
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <div className="w-5 h-5 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Compass className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 leading-tight whitespace-nowrap">
                  জাপান প্রস্তুতি
                </span>
              </div>
            </div>

            {/* CTA Button Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="group inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] text-white font-extrabold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>বিনামূল্যে শেখা শুরু করুন</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 rounded-full bg-purple-100 text-[#6D25EA] flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Nihomi দেখুন (১ মিনিট)</span>
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="flex items-center gap-2.5 pt-1 border-t border-slate-100">
              <div className="flex -space-x-1.5 overflow-hidden">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="/assets/landing-v2/student-sanjida.png"
                  alt="Learner"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="/assets/landing-v2/student-riad.png"
                  alt="Learner"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  src="/assets/landing-v2/student-tania.png"
                  alt="Learner"
                />
                <div className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-purple-100 text-[9px] font-bold text-[#6D25EA]">
                  +9k
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                  10,000+ শিক্ষার্থী
                </span>
                <span className="text-[9.5px] text-slate-500 font-medium">
                  Nihomi-এর সাথে জাপানিজ শিখছে
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CENTER COLUMN: ANIME SENSEI HERO ILLUSTRATION (4 cols)
              ======================================================== */}
          <div className="lg:col-span-4 relative flex justify-center items-end h-[320px] lg:h-[370px]">
            <img
              src="/assets/landing-v2/hero-learner-sensei.png"
              alt="Nihomi Sensei Japanese Learning Companion"
              className="h-[300px] lg:h-[350px] w-auto object-contain object-bottom drop-shadow-md select-none pointer-events-none"
              loading="eager"
            />
          </div>

          {/* ========================================================
              RIGHT COLUMN: FLOATING JAPAN GOAL SHORTCUT CARD (3 cols)
              ======================================================== */}
          <div className="lg:col-span-3 z-10 flex flex-col justify-center">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-md space-y-2">
              {/* Card Japanese Promise Copy */}
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-[#101A59] leading-snug">
                  日本語で <br />
                  <span className="text-[#6D25EA]">もっと広がる</span> <br />
                  あなたの未来
                </h3>
                <p className="text-[9.5px] text-slate-500 mt-0.5 font-medium">
                  জাপানিজ ভাষায় আপনার ভবিষ্যৎ উন্মোচন করুন
                </p>
              </div>

              {/* 4 Shortcut Action Buttons */}
              <div className="space-y-1.5">
                {shortcutItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-1.5 rounded-xl border transition-all text-left cursor-pointer group ${item.color}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-white/90 shadow-2xs flex items-center justify-center shrink-0">
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-800 group-hover:text-slate-900 leading-tight">
                            {item.label}
                          </span>
                          <span className="text-[9px] text-slate-500 font-medium leading-none">
                            {item.sublabel}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 1-Minute Video / Overview Preview Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Nihomi Japanese Learning Platform
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              বাংলায় সহজ ব্যাখ্যা, ইন্টারেক্টিভ হিরাগানা-কাতাকানা অনুশীলন এবং টোকিও জব সিমুলেশন সহ সম্পূর্ণ জাপানিজ প্ল্যাটফর্ম।
            </p>
            <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
              <img
                src="/assets/landing-v2/hero-scene.png"
                alt="Nihomi Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#6D25EA] text-white flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
                <p className="text-sm font-bold">১ মিনিটে Nihomi-র অভিজ্ঞতা দেখুন</p>
                <p className="text-xs text-purple-200 mt-1">Zero Japanese to JLPT N5 & Beyond</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onNavigate('journey');
                }}
                className="px-5 py-2.5 rounded-full bg-[#6D25EA] text-white text-xs font-bold hover:bg-[#5B21B6] transition-colors"
              >
                শেখা শুরু করুন →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
