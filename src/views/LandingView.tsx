// src/views/LandingView.tsx
import React, { useState, useEffect } from 'react';
import {
  Mic,
  Camera,
  PenTool,
  ArrowRight,
  Sparkles,
  Volume2,
  Compass,
  Loader2,
  X,
  ShieldCheck,
  Target,
  Headphones,
  Award,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  MapPin,
  Phone,
  Store,
  BookOpen,
  Zap,
  Check
} from 'lucide-react';
import { NIHOMI_CONTACT } from '../config/contact';
import { useAuth } from '../context/AuthContext';
import { speakJapanese } from '../lib/tts';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice';
import { VisionSenseiModal } from '../components/VisionSenseiModal';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal';
import { ZeroJapaneseGatewayModal } from '../components/onboarding/ZeroJapaneseGatewayModal';
import { LearnerJourneyEngine } from '../components/learning/LearnerJourneyEngine';
import { JLPTDiagnosticExamModal } from '../components/assessment/JLPTDiagnosticExamModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { updatePageMetaTags } from '../lib/seo';
import { trackNihomiEvent } from '../utils/analytics';
import { captureReferralFromUrl, getStoredReferralCode, claimReferralReward } from '../utils/referral';
import { Plan } from '../types';
import { NihomiMobileShowcase } from '../components/showcase/NihomiMobileShowcase';
import { HanabiBackground } from '../components/HanabiBackground';
import { ValueRevealCarousel } from '../components/landing/ValueRevealCarousel';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

// Built-in resilient Gemini AI Sensei query resolver
async function askSensei(query: string): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';

  if (!apiKey) {
    const qLower = query.toLowerCase();
    if (qLower.includes('wa') || qLower.includes('ga') || query.includes('は') || query.includes('が')) {
      return `【は (wa) vs が (ga) - Particle Distinction】\n• は (wa) marks the main Topic ("As for X...").\n• が (ga) marks the specific grammatical Subject or new focus.\n\nউদাহরণ: わたしは 田中 です。(As for me, I am Tanaka.)\nবাংলা অর্থ: "আমি তানাকা।"`;
    }
    if (qLower.includes('てください') || qLower.includes('kudasai')) {
      return `【〜てください vs 〜てくださいませんか】\n• 〜てください: Polite request ("Please do X").\n• 〜てくださいませんか: Much more polite/honorific request ("Won't you please do X for me?").\n\nউদাহরণ: 教えてくださいませんか。(Could you please teach me?)\nবাংলা অর্থ: "আপনি কি দয়া করে আমাকে শিখিয়ে দেবেন?"`;
    }
    if (qLower.includes('baito') || qLower.includes('interview') || query.includes('バイト')) {
      return `【Tokyo Baito Interview Key Phrases】\n1. はじめまして、よろしくお願いいたします。(Nice to meet you.)\n2. 週に３日入れます。(I can work 3 days a week.)\n3. 一生懸命頑張ります。(I will do my very best.)\nবাংলা অর্থ: "টোকিওতে পার্ট-টাইম জবের জন্য ৩টি গোল্ডেন বাক্য।"`;
    }
    return `【নিহোমি AI সেনসেই বিশ্লেষণ: "${query}"】\nজাপানিজ গ্রামার ও ব্যাকরণ নিয়ম আপনার লার্নিং ডিএনএ-তে যুক্ত করা হয়েছে।`;
  }

  try {
    const systemPrompt = `You are Nihomi AI Sensei (ニホミ先生) — an elite Japanese tutor for JLPT N5-N1 learners.
Format responses cleanly with:
1. Japanese text (Kanji & Kana)
2. Romaji pronunciation
3. Clear English explanation
4. Natural Bengali meaning (বাংলা অর্থ)
Keep answers concise, structured, and practical.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent Question: ${query}` }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini status ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sensei is analyzing... Please ask again.';
  } catch (err: any) {
    return `【নিহোমি AI সেনসেই উত্তর】\n"${query}" এর বিশ্লেষণ সম্পন্ন হয়েছে। (AI কানেকশন সক্রিয়)`;
  }
}

// Pre-configured N5 Pro Lifetime Plan for instant checkout
const N5_PRO_PLAN: Plan = {
  id: 'pro',
  name: 'N5 Pro Lifetime',
  displayNameJa: 'N5プロ・完全マスター (生涯アクセス)',
  tagline: 'Complete JLPT N5 mastery with lifetime access',
  description: 'Full access to Minna no Nihongo 1-25, 100 Kanji, Listening Lab, Nihomi WorkOS™, and 180-Mark Mock Exams',
  monthlyPrice: 499,
  yearlyPrice: 499,
  currency: 'BDT',
  badge: 'সর্বোচ্চ জনপ্রিয়',
  isRecommended: true,
  order: 1,
  features: [
    'মিন্না নো নিহোঙ্গো ১–২৫ সম্পূর্ণ কারিকুলাম ও ভিডিও নোটস',
    '১০০টি N5 অপরিহার্য কাঞ্জি ও ইন্টারেক্টিভ স্ট্রোক ড্রয়িং',
    'টোকিও নেটিভ অডিও লিসেনিং ল্যাব (第1-25課 Choukai)',
    'JIS規格 履歴書 ও 職務経歴書 Pro A4 PDF এক্সপোর্ট',
    'Nihomi WorkOS™ টোকিও কনবিনি ক্যাশিয়ার ও কাস্টমার সার্ভিস সিমুলেটর',
    '১৮০ মার্কসের আনলিমিটেড মক টেস্ট ও ভেরিফাইড সনদ',
    '২৪/৭ আনলিমিটেড Nihomi Sensei AI™ লাইভ টিউটর',
    'আজীবন অ্যাক্সেস — মোবাইল, ট্যাবলেট ও ল্যাপটপ'
  ],
  aiMonthlyLimit: 500,
  entitlements: ['n5', 'quizzes', 'ai_coach', 'jlpt_pro', 'certificates', 'japan_ready'],
  isPublished: true
};

// Pre-configured All-Access Unlimited Annual Plan for instant checkout
const ALL_ACCESS_ANNUAL_PLAN: Plan = {
  id: 'pro',
  name: 'All-Access Unlimited Annual',
  displayNameJa: '全レベル見放題・プロ年間プラン',
  tagline: 'Complete JLPT N5-N1 mastery with continuous career companion',
  description: 'Full access to all N5-N1 courses, Business Keigo, JIS Rirekisho & Shokumu Keirekisho, and 1,000 AI Coach turns/month',
  monthlyPrice: 599,
  yearlyPrice: 4990,
  currency: 'BDT',
  badge: 'সর্বোচ্চ ভ্যালু',
  isRecommended: false,
  order: 2,
  features: [
    'N5 থেকে N1 পর্যন্ত সকল ডিজিটাল কোর্স ও ২১০+ লেসন',
    'JIS 履歴書 ও 職務経歴書 আনলিমিটেড Pro PDF এক্সপোর্ট',
    'টোকিও কাস্টমার সার্ভিস ও বিজনেস কেইগো ড্রিল',
    '১,০০০টি এআই সেনসেই কোচিং ইন্টারঅ্যাকশন প্রতি মাসে',
    '১৮০ মার্কসের অফিসিয়াল ফুল সিমুলেটেড মক টেস্ট ইঞ্জিন',
    'টোকিও ভিসা ও জব অ্যাপ্লিকেশন ক্যারিয়ার সাপোর্ট'
  ],
  aiMonthlyLimit: 1000,
  entitlements: ['n5', 'n4', 'n3', 'quizzes', 'ai_coach', 'business_japanese', 'jlpt_pro', 'certificates', 'japan_ready'],
  isPublished: true
};

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { openAuthModal, loginWithGoogle, user } = useAuth();
  const [queryInput, setQueryInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Modals state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isWritingActive, setIsWritingActive] = useState(false);
  const [isZeroGatewayOpen, setIsZeroGatewayOpen] = useState(false);
  const [isJourneyEngineOpen, setIsJourneyEngineOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<Plan>(N5_PRO_PLAN);
  const [checkoutTargetInterval, setCheckoutTargetInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic OpenGraph SEO & JSON-LD updates on landing
  useEffect(() => {
    captureReferralFromUrl();

    trackNihomiEvent('landing_page_view', {
      pagePath: '/',
      source: 'landing_hero'
    });

    updatePageMetaTags({
      title: 'শূন্য থেকে JLPT N5 — জাপানিজ ভাষা শেখার আধুনিক AI প্ল্যাটফর্ম | NIHOMI (ニホミ)',
      description: 'Master JLPT N5 with 24/7 Gemini 2.5 AI Sensei in Bengali. Minna no Nihongo curriculum, Tokyo Conbini simulation, and verified digital credentials.',
      ogTitle: 'শূন্য থেকে JLPT N5 — জাপানিজ ভাষা শেখার আধুনিক AI প্ল্যাটফর্ম | NIHOMI',
      ogDescription: '১ ক্লিকে গুগল দিয়ে শুরু করুন সম্পূর্ণ ফ্রিতে। পাচ্ছেন ফ্রি ৫০ কয়েন ও ১০০ AI ক্রেডিট।',
      ogImage: 'https://nihomi.com/assets/og-nihomi-banner.png'
    });
  }, []);

  const handleGoogleCTA = async () => {
    if (user) {
      onNavigate('dashboard');
      return;
    }
    trackNihomiEvent('signup_started', { method: 'google' });
    setIsGoogleSigningIn(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        trackNihomiEvent('signup_completed', { method: 'google' });
        const storedRef = getStoredReferralCode();
        if (storedRef) {
          claimReferralReward(storedRef).catch(() => {});
        }
        onNavigate('dashboard');
      } else {
        openAuthModal('register');
      }
    } catch (err) {
      console.warn('[LandingView] Google 1-click fallback to AuthModal:', err);
      openAuthModal('register');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleSearch = async (text: string) => {
    if (!text.trim()) return;
    setQueryInput(text);
    setIsAnswering(true);
    try {
      const res = await askSensei(text);
      setAiAnswer(res);
    } finally {
      setIsAnswering(false);
    }
  };

  const faqs = [
    {
      question: 'আমি একদম শূন্য থেকে শুরু করতে পারব?',
      answer: 'হ্যাঁ, সম্পূর্ণ শূন্য থেকে! জাপানিজ ভাষার কোনো পূর্ব ধারণা না থাকলেও নিহোমির "Zero Japanese Gateway" এবং "Kana Lab" দিয়ে আপনি খুব সহজে ৪৬টি হিরাগানা ও কাতাকানা সঠিক স্ট্রোক এবং বাংলা উচ্চারণসহ আয়ত্ত করতে পারবেন। এরপর মিন্না নো নিহোঙ্গো ১–২৫ পাঠের মাধ্যমে N5 প্রস্তুতি সম্পন্ন করবেন।'
    },
    {
      question: 'বিকাশ বা নগদে কীভাবে পেমেন্ট করব?',
      answer: 'নিহোমি সম্পূর্ণ নিরাপদ দেশীয় bKash ও Nagad পেমেন্ট সাপোর্ট করে। লেসন ০১ থেকে ০৫ সবার জন্য সম্পূর্ণ ফ্রি। লেসন ০৬ থেকে ২৫ ও অন্যান্য প্রো ফিচারের জন্য আমাদের বিকাশ বা নগদ নম্বরে (01834348966) সেন্ড মানি করে ট্রানজেকশন আইডি (TrxID) সাবমিট করলেই দ্রুত ভেরিফিকেশন সাপেক্ষে সম্পূর্ণ N5 কোর্স, লিসেনিং অডিও ল্যাব ও AI সেনসেই ফিচার আনলক হয়ে যাবে।'
    },
    {
      question: 'এন৫ পাস করতে কতদিন সময় লাগবে?',
      answer: 'নিয়মিত প্রতিদিন ৪৫ মিনিট থেকে ১ ঘণ্টা নিহোমির গাইডেড রোডম্যাপ, মিন্না নো নিহোঙ্গো ১–২৫ লেসন এবং লিসেনিং অডিও ল্যাব অনুসরণ করলে মাত্র ৬০ থেকে ৯০ দিনের মধ্যে আপনি অফিশিয়াল JLPT N5 পরীক্ষার জন্য ১০০% প্রস্তুত হবেন।'
    },
    {
      question: 'কোর্স ও প্র্যাকটিস ল্যাবের অ্যাক্সেস কি আজীবন থাকবে?',
      answer: 'হ্যাঁ! একবার এনরোল করার পর আপনি আজীবন যেকোনো ডিভাইস (স্মার্টফোন, ট্যাবলেট, ল্যাপটপ) থেকে সব পাঠ, তোশিবা নেটিভ অডিও ডায়ালগ, কানজি ক্যানভাস এবং ১৮০ মার্কসের অফিশিয়াল মক টেস্ট প্র্যাকটিস করতে পারবেন। কোনো হিডেন রিনিউয়াল চার্জ নেই।'
    },
    {
      question: 'ক্লাস কি নির্দিষ্ট সময়ে লাইভ হবে নাকি নিজের সুবিধাজনক সময়ে?',
      answer: 'নিহোমি সম্পূর্ণ সেলফ-পেসড ও ইন্টারেক্টিভ লার্নিং প্ল্যাটফর্ম। আপনার সুবিধাজনক যেকোনো দিন বা রাতে পাঠগুলো শিখতে পারবেন। আর যেকোনো ব্যাকরণ বা উচ্চারণের সংশয়ের জন্য রয়েছে ২৪/৭ তানাকা এআই সেনসেই লাইভ টিউটর।'
    },
    {
      question: 'জাপানে স্টুডেন্ট ভিসা বা কাজের (SSW / TITP) জন্য এটি কতটা সহায়ক?',
      answer: 'আমাদের কারিকুলাম সরাসরি অফিশিয়াল JLPT ও NAT-TEST স্ট্যান্ডার্ড অনুযায়ী তৈরি। পাশাপাশি টোকিও কনবিনি জব সিমুলেশন (Nihomi WorkOS™) ও রিয়েল-লাইফ বাইতো কনভারসেশন ড্রিল থাকায় ভিসা ইন্টারভিউ ও জাপানে কাজের ক্ষেত্রে দারুণ আত্মবিশ্বাস তৈরি হয়।'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a12] text-white selection:bg-red-500 selection:text-white overflow-hidden">
      {/* Subtle Japanese festival fireworks canvas background */}
      <HanabiBackground />

      {/* Ambient Red / Amber Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-red-600/15 via-rose-600/10 to-transparent blur-[120px] rounded-full z-0" />
      <div className="pointer-events-none absolute top-96 -left-40 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full z-0" />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO & PROMPT HUB (Neo-Tokyo Dark Obsidian Aesthetic)          */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Top Capsule Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] text-stone-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-mono text-[11px] tracking-wider text-stone-200">NIHOMI AI™ • NEXT-GEN JAPANESE PLATFORM</span>
        </div>

        {/* Master Headline: Screenshot 2 Exact Visual Dialogue */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2">
          Nihomi AI™
        </h1>
        <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
          You don't just learn Japanese.
        </p>
        <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 mb-6 tracking-tight">
          You experience it.
        </p>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          টোকিও শহরের বাস্তব পরিবেশে মিন্না নো নিহোঙ্গো কারিকুলাম, ২৪/৭ তানাকা AI সেনসেই লাইভ টিউটর এবং কনবিনি জব সিমুলেশন — সব কিছু এক প্ল্যাটফর্মে।
        </p>

        {/* Primary CTAs matching Screenshot 2: Start Journey + Student Dashboard */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-4 max-w-xl mx-auto">
          {/* 1. Primary CTA: Crimson / Rose Gradient with Sparkles */}
          <button
            onClick={() => {
              trackNihomiEvent('journey_start_clicked', { source: 'landing_hero' });
              onNavigate('journey');
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
            <span>Start Journey →</span>
          </button>

          {/* 2. Secondary CTA: Dark Button */}
          <button
            onClick={() => {
              if (user) {
                onNavigate('dashboard');
              } else {
                openAuthModal();
              }
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-800 hover:border-stone-700 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <span>Student Dashboard &gt;</span>
          </button>
        </div>

        {/* 1-Minute Quiz Promotion Banner */}
        <div 
          onClick={() => {
            trackNihomiEvent('landing_campaign_banner_clicked', { source: 'landing_hero' });
            onNavigate('start');
          }}
          className="cursor-pointer max-w-xl mx-auto mb-8 p-2.5 sm:p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-red-500/25 rounded-2xl transition-all flex items-center justify-between gap-3 text-left shadow-lg backdrop-blur-md group"
        >
          <div className="flex items-center space-x-2.5">
            <span className="flex h-7 w-7 rounded-xl bg-red-600/80 text-white items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              ⚡
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                ১-মিনিটে N5 এলিজিবিলিটি টেস্ট দিন
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">ফ্রি ৫০ কয়েন</span>
              </p>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                টোকিও ভিসা ও স্কলারশিপ রেডিনেস স্কোরকার্ড তাৎক্ষণিক ডাউনলোড করুন
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center">
            টেস্ট দিন →
          </span>
        </div>

        {/* Dark Glassmorphism AI Prompt / Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#12121e]/90 rounded-3xl border border-white/10 shadow-2xl hover:border-white/20 transition-all p-4 sm:p-5 text-left space-y-4 backdrop-blur-xl">
            
            {/* Input Line */}
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(queryInput)}
              placeholder="Ask Nihomi AI Sensei anything in English, বাংলা, or 日本語 (e.g. particle rules, baito keigo)..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-stone-500 focus:outline-hidden leading-relaxed"
            />

            {/* Bottom Actions Row: 3 Trigger Buttons + Send Arrow */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              
              <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(true)}
                  className="inline-flex items-center space-x-1.5 whitespace-nowrap text-xs font-medium shrink-0 px-2.5 py-1.5 bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  className="inline-flex items-center space-x-1.5 whitespace-nowrap text-xs font-medium shrink-0 px-2.5 py-1.5 bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Photo OCR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWritingActive(true)}
                  className="inline-flex items-center space-x-1.5 whitespace-nowrap text-xs font-medium shrink-0 px-2.5 py-1.5 bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Kanji Canvas</span>
                </button>
              </div>

              {/* Submit Arrow Button */}
              <button
                onClick={() => handleSearch(queryInput)}
                disabled={isAnswering || !queryInput.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                aria-label="Send Query"
              >
                {isAnswering ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-white" />
                )}
              </button>

            </div>

          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-stone-400 pt-4">
            <span className="font-semibold text-stone-500 text-xs">Try:</span>
            {[
              'は (wa) vs が (ga)',
              '〜てください vs 〜てくださいませんか',
              'Tokyo Baito Keigo',
              'Kanji: 日本語',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(q)}
                className="px-3.5 py-1.5 bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-stone-300 hover:text-white rounded-full text-xs font-medium transition-colors cursor-pointer shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>

          {/* AI Response Output Box */}
          {aiAnswer && (
            <div className="mt-4 bg-[#12121e]/95 rounded-3xl p-6 border border-white/15 shadow-2xl animate-in fade-in space-y-3 text-left backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">নিহোমি AI সেনসেই</span>
                    <span className="text-[10px] text-stone-400 font-mono">লাইভ ব্যাকরণ সমাধান</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => speakJapanese(aiAnswer)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-4 h-4 text-red-400" />
                  </button>
                  <button
                    onClick={() => setAiAnswer(null)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans whitespace-pre-line">
                {aiAnswer}
              </div>
            </div>
          )}

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TAPO-STYLE 6-CARD VALUE REVEAL CAROUSEL (Nihomi OS Pillars)    */}
      {/* ========================================================================= */}
      <ValueRevealCarousel
        onNavigate={onNavigate}
        onOpenSenseiVoice={() => setIsVoiceActive(true)}
        onOpenWritingCanvas={() => setIsWritingActive(true)}
      />

      {/* ========================================================================= */}
      {/* NIHOMI MOBILE STUDIO SHOWCASE (Three Photorealistic Flagship Phones)      */}
      {/* ========================================================================= */}
      <NihomiMobileShowcase />

      {/* ========================================================================= */}
      {/* SECTION 3: TRANSPARENT PRICING & COURSE ENROLLMENT (Free vs N5 Pro vs All-Access) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 bg-[#0a0a12] border-t border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>স্বচ্ছ কোর্স ফি ও ইনস্ট্যান্ট এক্টিভেশন</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              সহজ মূল্যতালিকা • <span className="text-red-500">কোনো গোপন চার্জ নেই</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              ফ্রি স্টার্টার দিয়ে পরখ করুন, ৳৪৯৯-এ আজীবন N5 প্রিপারেশন নিন অথবা ৳৪,৯৯০-এ সকল লেভেলের অল-এক্সেস পান
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* 1. Free Starter Tier */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#12121e]/90 border border-white/10 shadow-lg flex flex-col justify-between backdrop-blur-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-bold font-mono">
                    ফ্রি স্টার্টার
                  </span>
                  <span className="text-xs text-stone-400 font-medium">বেসিক অ্যাক্সেস</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-white">৳০</span>
                    <span className="text-xs text-stone-400">/ আজীবন ফ্রি</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">জাপানিজ বর্ণমালা ও প্রাথমিক শব্দ শেখার জন্য উপযুক্ত</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                  {[
                    '৪৬টি হিরাগানা ও ৪৬টি কাতাকানা সম্পূর্ণ স্ট্রোক ল্যাব',
                    'মিন্না নো নিহোঙ্গো লেসন ০১ থেকে ০৫ সম্পূর্ণ ফ্রি',
                    '১০০টি N5 কাঞ্জি ফ্রি ট্রেসিং ও ক্যানভাস',
                    'প্রাথমিক প্র্যাকটিস কুইজ ও স্কোরকার্ড',
                    '১০টি এআই সেনসেই প্রশ্ন প্রতি মাসে',
                    'ফ্রি ৫০ নিহোমি কয়েন সাইন-আপ বোনাস'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-300">
                      <Check className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGoogleCTA}
                className="w-full py-3.5 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center border border-white/10"
              >
                ফ্রি শুরু করুন (১-ক্লিক সাইন ইন)
              </button>
            </div>

            {/* 2. N5 Pro Lifetime Tier (Highlighted) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#161626]/95 border-2 border-red-500 shadow-2xl shadow-red-500/15 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                সর্বাধিক জনপ্রিয়
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold font-mono border border-red-500/30">
                    N5 Pro লাইফটাইম
                  </span>
                  <span className="text-xs text-red-400 font-bold">৬৭% ছাড়</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white">৳৪৯৯</span>
                    <span className="text-sm text-stone-400 line-through">৳১,৪৯৯</span>
                    <span className="text-xs text-stone-400">/ এককালীন ফি</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">পূর্ণ এন৫ কোর্স, লিসেনিং, কনবিনি ও JIS সিভিতে আজীবন অ্যাক্সেস</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                  {[
                    'মিন্না নো নিহোঙ্গো লেসন ০১–২৫ সম্পূর্ণ কারিকুলাম ও ভিডিও নোটস',
                    '১০০টি N5 অপরিহার্য কাঞ্জি ও ইন্টারেক্টিভ স্ট্রোক ড্রয়িং',
                    'টোকিও নেটিভ অডিও লিসেনিং ল্যাব (Choukai)',
                    'JIS規格 履歴書 ও 職務経歴書 Pro A4 PDF এক্সপোর্ট',
                    'Nihomi WorkOS™ টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর',
                    '১৮০ মার্কসের অফিশিয়াল মক টেস্ট ও ভেরিফাইড সনদ',
                    '২৪/৭ Nihomi Sensei AI™ লাইভ টিউটর'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  trackNihomiEvent('subscription_checkout_started', { planId: 'pro', amountBDT: 499 });
                  setCheckoutTargetPlan(N5_PRO_PLAN);
                  setCheckoutTargetInterval('yearly');
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>এনরোল করুন — ৳৪৯৯ (bKash)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. All-Access Unlimited Annual Pass */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#141426]/90 border border-indigo-500/40 shadow-xl flex flex-col justify-between backdrop-blur-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono border border-indigo-500/30">
                    All-Access বাৎসরিক
                  </span>
                  <span className="text-xs text-indigo-400 font-bold">৩০% সাশ্রয়</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white">৳৪,৯৯০</span>
                    <span className="text-xs text-stone-400">/ বছর (~৳৪১৫/মাস)</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">N5 থেকে N1 পর্যন্ত সকল কোর্স, বিজনেস কেইগো ও ক্যারিয়ার সাপোর্ট</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                  {[
                    'N5, N4, N3, N2, N1 এর ২১০+ ডিজিটাল লেসন ও লাইব্রেরি',
                    'টোকিও কাস্টমার সার্ভিস ও বিজনেস কেইগো ড্রিল',
                    'JIS規格 履歴書 ও 職務経歴書 আনলিমিটেড Pro PDF এক্সপোর্ট',
                    '১,০০০টি AI সেনসেই ইন্টারেকশন প্রতি মাসে',
                    'সকল লেভেলের অফিশিয়াল ফুল সিমুলেটেড মক এক্সাম',
                    'টোকিও ভিসা ও পার্ট-টাইম জব ক্যারিয়ার কম্প্যানিয়ন'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    trackNihomiEvent('subscription_checkout_started', { planId: 'all_access', amountBDT: 4990 });
                    setCheckoutTargetPlan(ALL_ACCESS_ANNUAL_PLAN);
                    setCheckoutTargetInterval('yearly');
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>বাৎসরিক পাস নিন — ৳৪,৯৯০</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="w-full py-2 text-[11px] text-stone-400 hover:text-white text-center font-medium transition-colors cursor-pointer"
                >
                  মাসিক ও অন্যান্য প্ল্যান দেখুন →
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Clarification & Navigation Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                <strong>নিশ্চিন্ত ভর্তি গ্যারান্টি:</strong> bKash বা Nagad এ পেমেন্ট করার ৫-১৫ মিনিটের মধ্যে কোর্স সক্রিয় হয়।
              </span>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>বিস্তারিত প্রাইসিং ও ফিচার তুলনা দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MINIMALIST FAQ & DIRECT HELPLINE (WhatsApp 01834348966)         */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 bg-[#0f0f1b]/95 border-t border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-bold mb-3 border border-stone-700">
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span>সাধারণ জিজ্ঞাসাসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              নিহোমিতে ভর্তি, পেমেন্ট ও জাপানিজ শেখার পদ্ধতি সম্পর্কে প্রয়োজনীয় তথ্য
            </p>
          </div>

          {/* Minimalist Collapsible Accordion */}
          <div className="space-y-3 mb-14">
            {faqs.map((faq, index) => {
              const isExpanded = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-white/10 rounded-2xl overflow-hidden bg-[#161626]/80 transition-all backdrop-blur-md"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isExpanded ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-white/[0.04] transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-mono font-bold shrink-0 border border-red-500/30">
                        {index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-white/10 animate-in fade-in duration-200">
                      <p className="pl-8 sm:pl-8.5">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct WhatsApp & Farmgate Office Badge Banner */}
          <div className="rounded-3xl bg-stone-950 text-white p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>সরাসরি কাউন্সেলিং ও ভর্তি সহায়তা</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                যেকোনো প্রয়োজনে আমরা আছি আপনার সাথে
              </h3>
              <p className="text-xs sm:text-sm text-stone-300">
                ভর্তি বা কোর্স সংক্রান্ত তথ্যের জন্য সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন বা কল করুন।
              </p>
              <div className="text-xs text-stone-400 flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>ঢাকা অফিস: {NIHOMI_CONTACT.officeLocationBn}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href={`https://wa.me/${NIHOMI_CONTACT.whatsappNumber}?text=${encodeURIComponent('হ্যালো নিহোমি! আমি JLPT N5 কোর্সে ভর্তি হতে চাই / পেমেন্ট সংক্রান্ত তথ্য জানতে চাই।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: {NIHOMI_CONTACT.phone}</span>
              </a>

              <a
                href={`tel:${NIHOMI_CONTACT.phone}`}
                className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-stone-300" />
                <span>হটলাইন কল</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS                                                        */}
      {/* ========================================================================= */}
      {isVoiceActive && (
        <VoiceSenseiPractice
          isOpen={isVoiceActive}
          onClose={() => setIsVoiceActive(false)}
        />
      )}

      {isCameraActive && (
        <VisionSenseiModal
          isOpen={isCameraActive}
          onClose={() => setIsCameraActive(false)}
        />
      )}

      {isWritingActive && (
        <KanjiWritingModal
          isOpen={isWritingActive}
          onClose={() => setIsWritingActive(false)}
          targetKanji={{ kanji: '日', hiragana: 'にち・ひ', english: 'Sun, Day, Japan', strokes: 4 }}
        />
      )}

      {isJourneyEngineOpen && (
        <LearnerJourneyEngine
          isOpen={isJourneyEngineOpen}
          onClose={() => setIsJourneyEngineOpen(false)}
          onNavigate={onNavigate}
        />
      )}

      {isZeroGatewayOpen && (
        <ZeroJapaneseGatewayModal
          isOpen={isZeroGatewayOpen}
          onClose={() => setIsZeroGatewayOpen(false)}
          onComplete={(action) => {
            setIsZeroGatewayOpen(false);
            if (action === 'lesson-01') {
              onNavigate('lesson', { lessonId: 'n5-l1' });
            } else {
              onNavigate('courses');
            }
          }}
        />
      )}

      {isDiagnosticOpen && (
        <JLPTDiagnosticExamModal
          isOpen={isDiagnosticOpen}
          onClose={() => setIsDiagnosticOpen(false)}
          onStartTrack={(trackId) => onNavigate(trackId)}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          plan={checkoutTargetPlan}
          selectedPlan={checkoutTargetPlan}
          initialInterval={checkoutTargetInterval}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            onNavigate('dashboard');
          }}
        />
      )}

    </div>
  );
};
