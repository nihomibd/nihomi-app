// src/components/landing/ValueRevealCarousel.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Zap,
  Store,
  Compass,
  BookOpen,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  CheckCircle2,
  Volume2,
  FileCheck2,
  Calendar,
  Flame,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export interface ValueRevealCarouselProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenSenseiVoice?: () => void;
  onOpenWritingCanvas?: () => void;
}

interface ValueCard {
  id: string;
  step: string;
  categoryJa: string;
  categoryBn: string;
  titleEn: string;
  titleJa: string;
  titleBn: string;
  taglineBn: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  accentGradient: string;
  icon: React.ElementType;
  viewTarget: string;
  viewParams?: Record<string, any>;
  ctaText: string;
  features: string[];
  previewType: 'sensei' | 'memory' | 'conbini' | 'mission' | 'curriculum' | 'career';
}

const VALUE_CARDS: ValueCard[] = [
  {
    id: 'sensei',
    step: '01',
    categoryJa: 'AI専属教師',
    categoryBn: '২৪/৭ এআই টিউটর',
    titleEn: 'Personal AI Sensei',
    titleJa: '24時間専属 AI先生 (Tanaka Sensei)',
    titleBn: '২৪/৭ নিবেদিত জাপানিজ সেনসেই',
    taglineBn: 'যেকোনো মুহূর্তে সঠিক ব্যাকরণ সংশোধন, বাস্তব কেইগো বিশ্লেষণ এবং লাইভ স্পিচ ফিডব্যাক।',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/30',
    accentGlow: 'shadow-rose-500/15',
    accentGradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    icon: Sparkles,
    viewTarget: 'journey',
    ctaText: 'সেনসেইয়ের সাথে কথা বলুন',
    features: [
      'বাংলায় সহজ ব্যাকরণ নিয়ম ও কণা (Particle) এর সূক্ষ্ম বিশ্লেষণ',
      'ভয়েস স্পিচ রেকগনিশনে রিয়েলটাইম উচ্চারণ ও অ্যাকসেন্ট সংশোধন',
      'টোকিও কনভারসেশন প্রম্পট হাব ও রেডি-মেড রিয়েল সিনারিও'
    ],
    previewType: 'sensei'
  },
  {
    id: 'memory',
    step: '02',
    categoryJa: '科学的記憶エンジン',
    categoryBn: 'স্পেসড রিপিটিশন',
    titleEn: 'MemoryOS™ Adaptive SRS',
    titleJa: '忘却曲線を克服する MemoryOS™',
    titleBn: 'স্মৃতি ও অ্যাডাপ্টিভ এসআরএস ইঞ্জিন',
    taglineBn: 'হার্মান এবিংহাসের বৈজ্ঞানিক ফরগেটিং কার্ভ অ্যালগরিদমে তৈরি করুন দীর্ঘস্থায়ী স্মৃতি।',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    accentGlow: 'shadow-amber-500/15',
    accentGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    icon: Zap,
    viewTarget: 'kana',
    ctaText: 'MemoryOS এক্সপ্লোর করুন',
    features: [
      '৪-স্টেপ অপ্টিমাইজড ইন্টারভাল (Again 1d, Hard 3d, Good 7d, Easy 14d)',
      'ভুল হওয়া শব্দ ও দুর্বল কাঞ্জি স্বয়ংক্রিয়ভাবে অ্যালগরিদমে রি-শিডিউল',
      'হিরাগানা, কাতাকানা ও কাঞ্জির ইন্টারেক্টিভ স্ট্রোক অর্ডার মেমরি ক্যানভাস'
    ],
    previewType: 'memory'
  },
  {
    id: 'conbini',
    step: '03',
    categoryJa: '渡航前実践',
    categoryBn: 'টোকিও জব সিমুলেশন',
    titleEn: 'Practice Japan Before Japan',
    titleJa: '渡航前リアルシミュレーション (WorkOS™)',
    titleBn: 'বাস্তব জাপান ইমার্শন সিমুলেটর',
    taglineBn: 'টোকিও বিমানবন্দরে নামার আগেই কনবিনি ক্যাশিয়ার, স্টেশন ও পার্ট-টাইম জবে দক্ষ হন।',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    accentGlow: 'shadow-emerald-500/15',
    accentGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    icon: Store,
    viewTarget: 'baito',
    ctaText: 'কনবিনি সিমুলেশন শুরু করুন',
    features: [
      'টোকিও ৭-ইলেভেন ও লসন টাচ স্ক্রিন ক্যাশিয়ার পিওএস (POS) সিমুলেটর',
      'বাইতো (Part-Time Job) ইন্টারভিউ ভয়েস ও টেক্সট ড্রিল উইথ স্কোরিং',
      'জাপানিজ কাস্টমার সার্ভিস সম্মানসূচক কেইগো (いらっしゃいませ)'
    ],
    previewType: 'conbini'
  },
  {
    id: 'mission',
    step: '04',
    categoryJa: '日次最適化',
    categoryBn: 'একক ডেইলি লক্ষ্য',
    titleEn: 'Next Best Mission',
    titleJa: '今日の最適ミッション (MissionOS)',
    titleBn: 'প্রতিদিনের সুনির্দিষ্ট ১টি একক লক্ষ্য',
    taglineBn: 'হাজারো তথ্যের মাঝে হারিয়ে না গিয়ে প্রতিদিন অর্জন করুন মাত্র ১টি স্পষ্ট অগ্রগতি।',
    accentColor: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    accentGlow: 'shadow-cyan-500/15',
    accentGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    icon: Compass,
    viewTarget: 'journey',
    ctaText: 'আজকের মিশন দেখুন',
    features: [
      'শিক্ষার্থীর দুর্বলতা ও অগ্রগতি ট্র্যাক করে একক ডেইলি মিশন নির্ধারণ',
      'মাত্র ১৫-২০ মিনিটে সম্পন্নযোগ্য হাই-ইমপ্যাক্ট লার্নিং ও স্পিকিং ড্রিল',
      'স্ট্রিক প্রটেকশন ও মিশন সম্পন্ন করলেই ফ্রি নিহোমি কয়েন রিওয়ার্ড'
    ],
    previewType: 'mission'
  },
  {
    id: 'curriculum',
    step: '05',
    categoryJa: 'N5→N1 完全体系',
    categoryBn: 'পূর্ণাঙ্গ কারিকুলাম',
    titleEn: 'Zero to N1 Masterclass',
    titleJa: 'ゼロからN1までの完全ロードマップ',
    titleBn: 'সম্পূর্ণ বর্ণমালা থেকে এন১ ক্যারিয়ার',
    taglineBn: 'শূন্য হিরাগানা থেকে শুরু করে টোকিও করপোরেট ক্যারিয়ার পর্যন্ত ধাপে ধাপে যাচাইকৃত পথ।',
    accentColor: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/30',
    accentGlow: 'shadow-indigo-500/15',
    accentGradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    icon: BookOpen,
    viewTarget: 'curriculum',
    ctaText: 'কারিকুলাম ব্রাউজ করুন',
    features: [
      'মিন্না নো নিহোঙ্গো ১–৫০ ও এন৫ থেকে এন১ এর ২১০+ পূর্ণাঙ্গ ডিজিটাল লেসন',
      'বাংলায় সহজ ব্যাকরণ নোটস, ৯৫৭+ শব্দভাণ্ডার ও কালচারাল টিপস',
      '১৮০ মার্কসের ফুল অফিশিয়াল মক টেস্ট, নেটিভ লিসেনিং ও ভেরিফাইড সনদ'
    ],
    previewType: 'curriculum'
  },
  {
    id: 'career',
    step: '06',
    categoryJa: '就職・移住伴走',
    categoryBn: 'ক্যারিয়ার ও ভিসা',
    titleEn: 'Continuous Career Companion',
    titleJa: 'JIS規格 履歴書・職務経歴書スタジオ',
    titleBn: 'জাপান স্ট্যান্ডার্ড JIS সিভি ও জব স্টুডিও',
    taglineBn: 'জাপানিজ স্ট্যান্ডার্ড রিজিউম তৈরি, AI কেইগো পলিশার ও অফিশিয়াল A4 PDF এক্সপোর্ট।',
    accentColor: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-500/10',
    accentBorder: 'border-fuchsia-500/30',
    accentGlow: 'shadow-fuchsia-500/15',
    accentGradient: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
    icon: Briefcase,
    viewTarget: 'baito',
    viewParams: { tab: 'rirekisho' },
    ctaText: 'JIS ক্যারিয়ার স্টুডিও খুলুন',
    features: [
      'অফিশিয়াল JIS 履歴書 (Rirekisho) ও 職務経歴書 (Shokumu Keirekisho) বিল্ডার',
      'AI Keigo Polisher দিয়ে সেলফ-প্রমোশন বাক্য স্বয়ংক্রিয় প্রফেশনাল রূপান্তর',
      'জাপানিজ নিয়োগকারী ও ভিসা উপযোগী অফিশিয়াল A4 প্রিন্ট ও PDF ডাউনলোড'
    ],
    previewType: 'career'
  }
];

export const ValueRevealCarousel: React.FC<ValueRevealCarouselProps> = ({
  onNavigate
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const CARD_DURATION_MS = 5000;
  const TICK_MS = 50;

  const currentCard = VALUE_CARDS[activeIndex];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % VALUE_CARDS.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + VALUE_CARDS.length) % VALUE_CARDS.length);
    setProgress(0);
  }, []);

  const handleSelectCard = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  // Timer effect for auto-advancing
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((old) => {
        const next = old + (TICK_MS / CARD_DURATION_MS) * 100;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, handleNext]);

  return (
    <section
      aria-label="Nihomi Core Value Reveal Carousel"
      className="relative z-10 py-16 sm:py-20 bg-[#0f0f1b]/95 border-t border-white/10 px-4 sm:px-6 lg:px-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold mb-3 border border-red-500/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="font-mono tracking-wider">NIHOMI OS • 6-PILLAR VALUE REVEAL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            জাপানিজ লার্নিং ও ক্যারিয়ারের <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">৬টি প্রধান স্তম্ভ</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-3 font-medium max-w-2xl mx-auto">
            ক্লাসরুমের মুখস্থবিদ্যা নয় — ইন্টারেক্টিভ AI সেনসেই, অ্যাডাপ্টিভ মেমরি এবং বাস্তব টোকিও প্র্যাকটিসের সমন্বিত ইকোসিস্টেম।
          </p>
        </div>

        {/* Top 6 Step Pills Navigation Bar */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 pt-1">
          {VALUE_CARDS.map((card, idx) => {
            const isActive = activeIndex === idx;
            const CardIcon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => handleSelectCard(idx)}
                className={`relative flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? `bg-[#181829] text-white ${card.accentBorder} shadow-lg ring-1 ${card.accentBorder}`
                    : 'bg-[#12121e]/80 text-stone-400 border-white/5 hover:border-white/20 hover:text-stone-200'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] font-black ${
                    isActive ? `${card.accentBg} ${card.accentColor}` : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {card.step}
                </span>
                <CardIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? card.accentColor : 'text-stone-400'}`} />
                <span className="hidden md:inline whitespace-nowrap">{card.titleEn}</span>
                <span className="md:hidden whitespace-nowrap">{card.categoryBn}</span>

                {/* Active progress bar underneath tab */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-75"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Featured 6-Card Tapo-Style Card Showcase Container */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#141424] to-[#0c0c16] border border-white/10 p-5 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Ambient Background Gradient for Active Pillar */}
          <div
            className={`pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-40 bg-gradient-to-br ${currentCard.accentGradient}`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Value Copy & Actions (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category & Step Header */}
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${currentCard.accentBg} ${currentCard.accentColor} ${currentCard.accentBorder}`}
                >
                  <span>STEP {currentCard.step}</span>
                  <span>•</span>
                  <span>{currentCard.categoryJa}</span>
                </span>
                <span className="text-xs font-bold text-stone-400 font-japanese">
                  {currentCard.titleJa}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                  <span>{currentCard.titleBn}</span>
                  <span className={`text-sm px-2.5 py-0.5 rounded-lg border font-mono font-bold hidden sm:inline-block ${currentCard.accentBg} ${currentCard.accentColor} ${currentCard.accentBorder}`}>
                    {currentCard.titleEn}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-stone-300 mt-3 font-medium leading-relaxed">
                  {currentCard.taglineBn}
                </p>
              </div>

              {/* 3 High-Impact Value Bullets */}
              <div className="space-y-3 pt-2">
                {currentCard.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-stone-200">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${currentCard.accentColor}`} />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => onNavigate(currentCard.viewTarget, currentCard.viewParams)}
                  className="px-6 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 group"
                >
                  <span>{currentCard.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/10 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>পরবর্তী স্তম্ভ ({((activeIndex + 1) % VALUE_CARDS.length) + 1}/6)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: High-Fidelity Interactive Preview Widget (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#10101c] border border-white/15 p-5 shadow-2xl overflow-hidden backdrop-blur-md">
                
                {/* Window Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[11px] text-stone-400 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span className="ml-2 font-bold text-stone-300">nihomi://{currentCard.id}.applet</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentCard.accentBg} ${currentCard.accentColor}`}>
                    LIVE ENGINE
                  </span>
                </div>

                {/* Conditional Preview Content based on previewType */}
                {currentCard.previewType === 'sensei' && (
                  <div className="space-y-3 font-sans">
                    {/* User Prompt */}
                    <div className="flex items-start space-x-2.5">
                      <div className="w-7 h-7 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold flex items-center justify-center shrink-0">
                        ল
                      </div>
                      <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-xs text-stone-200">
                        <p className="font-semibold text-stone-300">শিক্ষার্থী প্রশ্ন:</p>
                        <p className="mt-1">"は (wa) এবং が (ga) এর মধ্যে আসল পার্থক্য কী?"</p>
                      </div>
                    </div>

                    {/* Tanaka Sensei AI Response */}
                    <div className="flex items-start space-x-2.5">
                      <div className="w-7 h-7 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
                        先
                      </div>
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/40 to-stone-900 border border-red-500/30 text-xs text-stone-100 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-red-400 font-bold">
                          <span>Tanaka Sensei AI™ (田中先生)</span>
                          <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Active
                          </span>
                        </div>
                        <p className="font-japanese text-sm text-amber-200 font-medium">
                          【は (wa) = Topic / が (ga) = Subject】
                        </p>
                        <p className="text-[11px] text-stone-300 leading-relaxed">
                          • <strong>は (wa):</strong> বাক্যের সামগ্রিক বিষয় নির্দেশ করে।<br/>
                          • <strong>が (ga):</strong> নির্দিষ্ট নতুন তথ্য বা কর্তাকে চিহ্নিত করে।
                        </p>
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 font-japanese text-[11px] text-stone-200 flex items-center justify-between">
                          <span>わたしは 田中 です。(আমি তানাকা।)</span>
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'memory' && (
                  <div className="space-y-4 font-sans">
                    {/* SRS Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-stone-900 border border-amber-500/30 text-center space-y-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        KANJI FLASHCARD • N5 #42
                      </span>
                      <div className="text-4xl font-japanese font-bold text-white py-1">
                        勉強
                      </div>
                      <p className="text-xs text-stone-400 font-japanese">べんきょう (benkyou)</p>
                      <p className="text-xs font-bold text-amber-300">Study / পড়াশোনা</p>
                      
                      {/* Retention Gauge */}
                      <div className="pt-2 text-left">
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono mb-1">
                          <span>Retention Probability</span>
                          <span className="text-emerald-400 font-bold">94%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 w-[94%] rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* 4 SRS Feedback Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                      <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-[10px]">
                        <p className="font-bold">Again</p>
                        <p className="text-[9px] text-stone-400">1d</p>
                      </div>
                      <div className="p-2 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-300 text-[10px]">
                        <p className="font-bold">Hard</p>
                        <p className="text-[9px] text-stone-400">3d</p>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px]">
                        <p className="font-bold">Good</p>
                        <p className="text-[9px] text-stone-400">7d</p>
                      </div>
                      <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[10px]">
                        <p className="font-bold">Easy</p>
                        <p className="text-[9px] text-stone-400">14d</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'conbini' && (
                  <div className="space-y-3 font-sans">
                    {/* POS Register Screen */}
                    <div className="p-3.5 rounded-2xl bg-stone-900 border border-emerald-500/30 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-b border-white/10 pb-2">
                        <span className="text-emerald-400 font-bold">7-ELEVEN SHINJUKU #04</span>
                        <span>REG: POS-01</span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-stone-300">
                          <span>🍙 おにぎり (ツナマヨ)</span>
                          <span className="font-mono">¥150</span>
                        </div>
                        <div className="flex justify-between text-stone-300">
                          <span>🍵 綾鷹 緑茶 (525ml)</span>
                          <span className="font-mono">¥160</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                        <span className="text-xs font-bold text-stone-300">合計金額 (Total):</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">¥310</span>
                      </div>
                    </div>

                    {/* Dialogue Prompt */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                      <p className="text-emerald-300 font-bold font-japanese">
                        「お弁当、温めますか？」
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        (লাঞ্চবক্সটি গরম করে দেব কি?)
                      </p>
                      <div className="mt-2 flex gap-1.5">
                        <span className="px-2 py-1 bg-stone-800 rounded text-[10px] text-stone-200">
                          はい、お願いします
                        </span>
                        <span className="px-2 py-1 bg-stone-800 rounded text-[10px] text-stone-300">
                          大丈夫です
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'mission' && (
                  <div className="space-y-3 font-sans">
                    {/* Mission Cockpit */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-stone-900 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                          TODAY'S MISSION #18
                        </span>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>৬ দিনের স্ট্রিক</span>
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Lesson 04: সময় ও স্থান কণা (に・で)
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          প্রতিদিনের ১৫ মিনিটের সুনির্দিষ্ট মাস্টারক্লাস ড্রিল
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                          <span>অগ্রগতি: ৩/৪ টাস্ক সম্পন্ন</span>
                          <span className="text-cyan-400 font-mono font-bold">75%</span>
                        </div>
                        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-3/4 rounded-full"></div>
                        </div>
                      </div>

                      {/* Reward Pill */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10 text-stone-300">
                        <span>পুরস্কার: +৫০ XP ও ১৫ কয়েন</span>
                        <span className="text-cyan-400 font-bold">১০ মিনিট বাকি →</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'curriculum' && (
                  <div className="space-y-2.5 font-sans">
                    {/* Level Track */}
                    <div className="space-y-1.5">
                      {[
                        { lvl: 'N5', title: 'মৌলিক ভিত্তি (Minna 1-25)', pct: '100%', color: 'bg-emerald-500' },
                        { lvl: 'N4', title: 'প্রাথমিক কথোপকথন (Minna 26-50)', pct: '85%', color: 'bg-cyan-500' },
                        { lvl: 'N3', title: 'মিডল লেভেল ও প্র্যাকটিক্যাল কেইগো', pct: 'Active', color: 'bg-indigo-500' },
                        { lvl: 'N2/N1', title: 'টোকিও করপোরেট ক্যারিয়ার', pct: 'Locked', color: 'bg-stone-600' }
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/90 border border-white/10 text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-lg bg-stone-800 font-mono font-bold text-white flex items-center justify-center text-[10px]">
                              {item.lvl}
                            </span>
                            <span className="text-stone-300 text-[11px]">{item.title}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-stone-400">
                            {item.pct}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-center text-[11px] text-indigo-300 font-medium">
                      ২১০+ পূর্ণাঙ্গ লেসন • ৯৫৭+ শব্দ • ৩৫৩+ কুইজ প্রশ্ন
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'career' && (
                  <div className="space-y-3 font-sans">
                    {/* JIS Rirekisho Preview */}
                    <div className="p-3.5 rounded-2xl bg-stone-900 border border-fuchsia-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px] border-b border-white/10 pb-2">
                        <span className="font-japanese font-bold text-white">履 歴 書 (JIS規格・日本標準)</span>
                        <span className="w-5 h-5 rounded-full border border-red-500 text-red-500 text-[9px] flex items-center justify-center font-japanese font-bold">
                          印
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-stone-300">
                        <p className="text-[11px] text-stone-400">氏名: 田中 健太 (Tanaka Kenta)</p>
                        <p className="text-[11px] text-stone-400">資格: JLPT N5 合格 / IT Specialist</p>
                      </div>

                      <div className="p-2 rounded-xl bg-fuchsia-950/30 border border-fuchsia-500/20 text-[11px] space-y-1">
                        <div className="flex items-center space-x-1.5 text-fuchsia-400 font-bold text-[10px]">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Keigo Polished:</span>
                        </div>
                        <p className="font-japanese text-[11px] text-stone-200">
                          「貴社の発展に貢献できるよう、一生懸命努めてまいります。」
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] px-2 text-stone-400 font-mono">
                      <span>A4 Print Ready</span>
                      <span className="text-fuchsia-400 font-bold">1-Click PDF Export</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Bottom Controls Bar: Left/Right Arrows, Dots, Play/Pause */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
            
            {/* Slide Indicator & Play/Pause */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400 fill-current" /> : <Pause className="w-3.5 h-3.5 text-stone-300" />}
              </button>
              <span className="font-mono text-stone-400">
                <strong className="text-white">0{activeIndex + 1}</strong> / 0{VALUE_CARDS.length}
              </span>
            </div>

            {/* Dots */}
            <div className="flex items-center space-x-1.5">
              {VALUE_CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectCard(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === i ? 'w-6 bg-red-500' : 'w-1.5 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Jump to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Previous value pillar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Next value pillar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
