import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  BookOpen,
  Briefcase,
  Plane,
  Heart,
  Bot,
  Target,
  Users,
  X
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const shortcutItems = [
    {
      icon: Plane,
      label: 'জাপানে পড়াশোনা',
      iconColor: 'text-sky-500',
      action: () => onNavigate('courses')
    },
    {
      icon: Briefcase,
      label: 'জাপানে কাজের সুযোগ',
      iconColor: 'text-purple-500',
      action: () => onNavigate('baito')
    },
    {
      icon: Users,
      label: 'জাপান ভ্রমণ ও জীবন',
      iconColor: 'text-emerald-500',
      action: () => onNavigate('baito')
    },
    {
      icon: Heart,
      label: 'জাপানি সংস্কৃতি ও বন্ধুত্ব',
      iconColor: 'text-rose-500',
      action: () => onNavigate('community')
    }
  ];

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden w-full h-auto lg:h-[380px] lg:max-h-[380px] flex items-center justify-center bg-white"
    >
      {/* ========================================================
          PANORAMIC JAPANESE SCENE BACKGROUND (1024x380)
          Seamless Mt. Fuji, Anime Character, Calligraphy & Pagoda
          ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:flex justify-center items-center">
        <img
          src="/assets/landing-v2/hero-full-backdrop.png"
          alt="Nihomi Japanese Learning Journey Atmosphere"
          className="w-[1024px] h-[380px] object-cover shrink-0"
        />
      </div>

      {/* Fallback ambient background for mobile/tablet */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F0F5FF] via-[#FFFFFF] to-[#F8FAFF] lg:hidden" />

      {/* ========================================================
          SEMANTIC CONTENT CONTAINER
          ======================================================== */}
      <div className="relative z-10 w-full max-w-[1024px] h-full mx-auto px-4 py-6 lg:py-0 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0">
        
        {/* ========================================================
            LEFT COLUMN: TYPOGRAPHY, VALUE PROPOSITIONS & CTAs
            ======================================================== */}
        <div className="w-full lg:w-[440px] flex flex-col justify-center space-y-2 shrink-0">
          {/* Plain letter-spaced kicker */}
          <div>
            <span className="text-[9.5px] font-extrabold tracking-widest uppercase text-slate-500 select-none">
              YOUR JAPANESE JOURNEY STARTS HERE
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-[27px] font-black tracking-tight text-[#101A59] leading-[1.12]">
            জাপানিজ শেখা <br />
            শুরু হোক <br />
            <span className="text-[#6D25EA]">একদম শূন্য থেকে।</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed max-w-sm font-normal">
            Nihomi Learning Companion-এর সাথে ধাপে ধাপে শিখুন, অনুশীলন করুন এবং জাপান জীবনের জন্য প্রস্তুত হন।
          </p>

          {/* 3 Authentic Inline Value Props (All in one single line) */}
          <div className="flex items-center gap-2 pt-0.5 text-[9.5px] font-bold text-slate-700 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#6D25EA] shrink-0" />
              <span>শুরু থেকে ধাপে ধাপে</span>
            </div>

            <div className="flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>AI Sensei সবসময় পাশে</span>
            </div>

            <div className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-[#6D25EA] shrink-0" />
              <span>জাপান জীবনের জন্য প্রস্তুতি</span>
            </div>
          </div>

          {/* CTA Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="group inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] text-white font-extrabold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>বিনামূল্যে শেখা শুরু করুন</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200/90 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 rounded-full bg-purple-100 text-[#6D25EA] flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>Nihomi দেখুন (১ মিনিট)</span>
            </button>
          </div>

          {/* Social Proof Row with 5 Student Avatars */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100/80">
            <div className="flex -space-x-1.5 overflow-hidden">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="/assets/landing-v2/student-sanjida.png"
                alt="Learner Sanjida"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="/assets/landing-v2/student-riad.png"
                alt="Learner Riad"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="/assets/landing-v2/student-tania.png"
                alt="Learner Tania"
              />
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-purple-50 text-[9px] font-bold text-[#6D25EA]">
                ★
              </div>
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

        {/* Mobile-only Character image */}
        <div className="lg:hidden flex justify-center py-2">
          <img
            src="/assets/landing-v2/hero-learner-sensei.png"
            alt="Nihomi Sensei Japanese Learning Companion"
            className="h-[220px] w-auto object-contain"
          />
        </div>

        {/* ========================================================
            RIGHT COLUMN: FLOATING JAPAN GOAL SHORTCUT CARD
            ======================================================== */}
        <div className="w-full lg:w-[202px] z-10 flex flex-col justify-center shrink-0">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-slate-200/80 shadow-md space-y-1.5">
            {/* Japanese Promise Header */}
            <div>
              <h3 className="text-xs font-black text-[#101A59] leading-tight tracking-tight">
                日本語で <br />
                もっと広がる <br />
                あなたの未来
              </h3>
              <div className="w-8 h-0.5 bg-[#6D25EA] rounded-full mt-1 mb-1" />
            </div>

            {/* 4 Shortcut Action Pills */}
            <div className="space-y-1">
              {shortcutItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="w-full flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-slate-100 shadow-2xs hover:border-purple-200 hover:shadow-xs transition-all text-left cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className={`w-3 h-3 ${item.iconColor}`} />
                    </div>
                    <span className="text-[9.5px] font-bold text-slate-700 group-hover:text-[#6D25EA] transition-colors leading-tight truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 relative shadow-2xl border border-slate-100 animate-in fade-in-50 zoom-in-95">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-3">
              <h3 className="font-extrabold text-sm text-[#101A59]">Nihomi এক নজরে (1 Minute Tour)</h3>
              <p className="text-[11px] text-slate-500">
                কীভাবে Nihomi আপনাকে শূন্য থেকে জাপানে যাওয়ার প্রস্তুতিতে সাহায্য করে।
              </p>
            </div>
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center relative">
              <img
                src="/assets/shibuya-crossing.jpg"
                alt="Nihomi Preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <Play className="w-12 h-12 text-[#6D25EA] fill-[#6D25EA] mb-2" />
                <p className="font-bold text-xs">ইন্টারঅ্যাক্টিভ প্রিভিউ চালু হচ্ছে...</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsVideoModalOpen(false);
                    onNavigate('courses');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-full bg-[#6D25EA] text-white text-xs font-bold hover:bg-[#5818D1] transition-all cursor-pointer"
                >
                  সরাসরি পাঠ্যক্রমে প্রবেশ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
