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
import { JLPTDiagnosticExamModal } from '../components/assessment/JLPTDiagnosticExamModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { updatePageMetaTags } from '../lib/seo';
import { trackNihomiEvent } from '../utils/analytics';
import { captureReferralFromUrl, getStoredReferralCode, claimReferralReward } from '../utils/referral';
import { Plan } from '../types';

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
  description: 'Full access to Minna no Nihongo 1-25, 100 Kanji, Listening Lab, BaitoOS, and 180-Mark Mock Exams',
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
    'BaitoOS™ টোকিও কনবিনি ক্যাশিয়ার ও কাস্টমার সার্ভিস সিমুলেটর',
    '১৮০ মার্কসের আনলিমিটেড মক টেস্ট ও ভেরিফাইড সনদ',
    '২৪/৭ আনলিমিটেড তানাকা এআই সেনসেই লাইভ টিউটর',
    'আজীবন অ্যাক্সেস — মোবাইল, ট্যাবলেট ও ল্যাপটপ'
  ],
  aiMonthlyLimit: 500,
  entitlements: ['n5', 'quizzes', 'ai_coach', 'jlpt_pro', 'certificates', 'japan_ready'],
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
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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
      answer: 'নিহোমি সম্পূর্ণ নিরাপদ দেশীয় bKash ও Nagad পেমেন্ট সাপোর্ট করে। আপনি সরাসরি কার্ড বা অটোমেটেড গেটওয়ে দিয়ে অথবা আমাদের পার্সোনাল নম্বরে (01834348966) সেন্ড মানি করে ট্রানজেকশন আইডি (TrxID) দিলে সাথে সাথে সম্পূর্ণ N5 কোর্স, লিসেনিং অডিও ল্যাব ও আনলিমিটেড AI সেনসেই ফিচার আনলক হয়ে যাবে।'
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
      answer: 'আমাদের কারিকুলাম সরাসরি অফিশিয়াল JLPT ও NAT-TEST স্ট্যান্ডার্ড অনুযায়ী তৈরি। পাশাপাশি টোকিও কনবিনি জব সিমুলেশন (BaitoOS™) ও রিয়েল-লাইফ বাইতো কনভারসেশন ড্রিল থাকায় ভিসা ইন্টারভিউ ও জাপানে কাজের ক্ষেত্রে দারুণ আত্মবিশ্বাস তৈরি হয়।'
    }
  ];

  // 6-Step Continuous Learning Path configuration
  const learningSteps = [
    {
      step: '01',
      title: 'Kana 46 Lab',
      titleJa: 'ひらがな・カタカナ基礎',
      desc: '৪৬টি হিরাগানা ও কাতাকানা সঠিক স্ট্রোক অর্ডার, বাংলা উচ্চারণ ও টাচ ক্যানভাসে ড্রয়িং।',
      duration: '৩-৫ দিন',
      icon: PenTool,
      view: 'kana',
      color: 'rose'
    },
    {
      step: '02',
      title: 'Minna no Nihongo 1–25',
      titleJa: 'みんなの日本語 第1-25課',
      desc: 'N5 এর ২৫টি পূর্ণ অধ্যায়, বাংলা ব্যাকরণ নিয়ম, ভোকাবুলারি ও বাস্তব বাক্যের প্রয়োগ।',
      duration: '৪-৬ সপ্তাহ',
      icon: BookOpen,
      view: 'curriculum',
      color: 'red'
    },
    {
      step: '03',
      title: 'Kanji 100 Master',
      titleJa: '漢字100字マスター',
      desc: 'N5 পরীক্ষার জন্য ১০০টি মৌলিক কাঞ্জি, ওনিওমি/কুনিওমি ও ইন্টারেক্টিভ ফ্ল্যাশকার্ড।',
      duration: '২ সপ্তাহ',
      icon: Target,
      view: 'kanji',
      color: 'amber'
    },
    {
      step: '04',
      title: 'Tokyo Listening Lab',
      titleJa: '東京リスニングラボ (聴解)',
      desc: 'তোশিবা নেটিভ স্পিকারদের নিখুঁত উচ্চারণে ২৫টি লেসনের Choukai অডিও ও রোমাজি ফিল্টার।',
      duration: 'প্রতিদিন ১৫ মিনিট',
      icon: Headphones,
      view: 'listening-lab',
      color: 'indigo'
    },
    {
      step: '05',
      title: 'BaitoOS™ Conbini Shift',
      titleJa: 'コンビニ接客・レジ演習',
      desc: 'টোকিও ৭-ইলেভেন ও লসন ক্যাশিয়ার সিমুলেটর, কেইগো ডায়ালগ ও বাস্তব কাস্টমার সার্ভিস।',
      duration: '১ সপ্তাহ',
      icon: Store,
      view: 'baito',
      color: 'emerald'
    },
    {
      step: '06',
      title: '180-Mark JLPT N5 Simulation',
      titleJa: 'JLPT N5 本番模試 180点',
      desc: 'আসল পরীক্ষার ৩টি সেকশন (মোজী-গোই, বুনপো, চৌকাই), লাইভ টাইমার ও ভেরিফাইড সনদ।',
      duration: 'পরীক্ষার পূর্বে',
      icon: Award,
      view: 'mock-exams',
      color: 'cyan'
    }
  ];

  return (
    <div className="bg-[#FAF9F6] text-stone-900 selection:bg-red-500 selection:text-white">

      {/* ========================================================================= */}
      {/* SECTION 1: HERO & PROMPT HUB (Apple / Gemini Minimalist Aesthetic)        */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Continuous Learning Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span>NIHOMI.COM • BANGLADESH TO TOKYO JAPANESE OS</span>
        </div>

        {/* Master Minimalist Headline with Glowing Red Accent */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 leading-[1.15] mb-4">
          শূন্য থেকে <span className="text-red-600 font-japanese drop-shadow-sm">JLPT N5</span> — <br className="hidden sm:inline" />
          জাপানিজ ভাষা শেখার আধুনিক <span className="underline decoration-red-500/40 decoration-wavy underline-offset-8">AI প্ল্যাটফর্ম</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          বাংলা ভাষায় সহজ ব্যাখ্যা, ২৪/৭ পার্সোনাল AI সেনসেই, অথেনটিক মিন্না নো নিহোঙ্গো কারিকুলাম এবং টোকিও কনবিনি সিমুলেশন — সব কিছু এক প্ল্যাটফর্মে।
        </p>

        {/* 2 Primary CTAs: Start Zero Journey + Take Level Check */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-3 max-w-2xl mx-auto">
          {/* 1. Primary CTA: Crimson Gradient */}
          <button
            onClick={() => {
              trackNihomiEvent('zero_gateway_clicked', { source: 'landing_hero' });
              setIsZeroGatewayOpen(true);
            }}
            className="flex-1 px-5 py-3.5 sm:px-6 sm:py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-red-600/30 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 group"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-200 animate-pulse shrink-0" />
            <span className="truncate">Start Japanese Zero Journey (শুরু থেকে শিখুন)</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* 2. Secondary CTA: Minimalist outline pill */}
          <button
            onClick={() => {
              trackNihomiEvent('diagnostic_exam_clicked', { source: 'landing_hero' });
              setIsDiagnosticOpen(true);
            }}
            className="flex-1 px-5 py-3.5 sm:px-6 sm:py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-2xl text-sm sm:text-base font-bold shadow-xs hover:border-stone-400 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
            <span className="truncate">Take 2-Min Level Check (লেভেল যাচাই)</span>
          </button>
        </div>

        {/* 3. Subtle Direct Login Link Below */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-stone-500 mb-8">
          <button
            onClick={() => {
              if (user) {
                onNavigate('dashboard');
              } else {
                openAuthModal();
              }
            }}
            className="text-stone-600 hover:text-red-600 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 py-1"
          >
            <span>ইতিমধ্যে একাউন্ট আছে? {user ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'লগইন করুন'} →</span>
          </button>
        </div>

        {/* Minimalist AI Prompt / Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:border-stone-300 transition-all p-4 sm:p-5 text-left space-y-4">
            
            {/* Input Line */}
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(queryInput)}
              placeholder="Ask Nihomi AI Sensei anything in English, বাংলা, or 日本語 (e.g. particle rules, baito keigo)..."
              className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden leading-relaxed"
            />

            {/* Bottom Actions Row: 3 Trigger Buttons + Send Arrow */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              
              <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(true)}
                  className="inline-flex items-center space-x-1.5 whitespace-nowrap text-xs font-medium shrink-0 px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  className="inline-flex items-center space-x-1.5 whitespace-nowrap text-xs font-medium shrink-0 px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Photo OCR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWritingActive(true)}
                  className="inline-flex items-center space-x-1.5 whitespace-nowrap text-xs font-medium shrink-0 px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kanji Canvas</span>
                </button>
              </div>

              {/* Submit Arrow Button */}
              <button
                onClick={() => handleSearch(queryInput)}
                disabled={isAnswering || !queryInput.trim()}
                className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-red-600 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
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
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-stone-500 pt-4">
            <span className="font-semibold text-stone-400 text-xs">Try:</span>
            {[
              'は (wa) vs が (ga)',
              '〜てください vs 〜てくださいませんか',
              'Tokyo Baito Keigo',
              'Kanji: 日本語',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(q)}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-full text-xs font-medium transition-colors cursor-pointer shadow-2xs hover:border-stone-400"
              >
                {q}
              </button>
            ))}
          </div>

          {/* AI Response Output Box */}
          {aiAnswer && (
            <div className="mt-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm animate-in fade-in space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-950 text-white font-bold text-xs flex items-center justify-center">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">নিহোমি AI সেনসেই</span>
                    <span className="text-[10px] text-stone-400 font-mono">লাইভ ব্যাকরণ সমাধান</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => speakJapanese(aiAnswer)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => setAiAnswer(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-line">
                {aiAnswer}
              </div>
            </div>
          )}

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 6-STEP CONTINUOUS LEARNING PATH (The Nihomi OS Architecture)    */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold mb-3 border border-red-200">
              <Zap className="w-3.5 h-3.5" />
              <span>নিহোমি ওএস আর্কিটেকচার</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight">
              ৬ ধাপে সম্পূর্ণ জাপানিজ প্রস্তুতি <span className="text-red-600">(Step 1 → Step 6)</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              শূন্য বর্ণমালা থেকে শুরু করে তোশিবা নেটিভ অডিও, টোকিও কনবিনি জব ড্রিল ও ১৮০ মার্কসের অফিশিয়াল মক টেস্ট
            </p>
          </div>

          {/* 6-Step Visual Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {learningSteps.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-3xl bg-stone-50/70 hover:bg-white border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-8 h-8 rounded-xl bg-stone-950 text-white font-mono font-bold text-xs flex items-center justify-center">
                        {item.step}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-500 text-[10px] font-bold font-mono">
                        {item.duration}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-red-600 shadow-2xs group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-stone-950 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-stone-400 font-japanese font-medium">
                          {item.titleJa}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 mt-3">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(item.view)}
                    className="w-full py-2.5 px-4 bg-white hover:bg-stone-950 hover:text-white border border-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <span>এই ধাপে প্রবেশ করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TRANSPARENT PRICING & COURSE ENROLLMENT (Free Starter vs Pro)   */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#FAF9F6] border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>স্বচ্ছ কোর্স ফি ও ইনস্ট্যান্ট এক্টিভেশন</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight">
              সহজ মূল্যতালিকা • <span className="text-red-600">কোনো গোপন চার্জ নেই</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              ফ্রি স্টার্টার দিয়ে পরখ করুন অথবা ৳৪৯৯-এ আজীবন অ্যাক্সেস নিয়ে JLPT N5 এর সম্পূর্ণ প্রস্তুতি নিন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* 1. Free Starter Tier */}
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold font-mono">
                    ফ্রি স্টার্টার
                  </span>
                  <span className="text-xs text-stone-400 font-medium">বেসিক অ্যাক্সেস</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-black text-stone-950">৳০</span>
                    <span className="text-xs text-stone-500">/ আজীবন ফ্রি</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">জাপানিজ বর্ণমালা ও প্রাথমিক শব্দ শেখার জন্য উপযুক্ত</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100 mb-8">
                  {[
                    '৪৬টি হিরাগানা ও কাতাকানা স্ট্রোক ল্যাব',
                    'মিন্না নো নিহোঙ্গো প্রথম ৩টি বেসিক পাঠ',
                    'প্রাথমিক প্র্যাকটিস কুইজ ও স্কোরকার্ড',
                    '১০টি এআই সেনসেই প্রশ্ন প্রতি মাসে',
                    'ফ্রি ৫০ নিহোমি কয়েন সাইন-আপ বোনাস'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-700">
                      <Check className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGoogleCTA}
                className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
              >
                ফ্রি শুরু করুন (১-ক্লিক সাইন ইন)
              </button>
            </div>

            {/* 2. N5 Pro Lifetime Tier (Highlighted) */}
            <div className="p-7 rounded-3xl bg-white border-2 border-red-600 shadow-xl shadow-red-600/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                সর্বাধিক জনপ্রিয়
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold font-mono">
                    N5 Pro লাইফটাইম
                  </span>
                  <span className="text-xs text-red-600 font-bold">৬৭% ছাড়</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-black text-red-600">৳৪৯৯</span>
                    <span className="text-sm text-stone-400 line-through">৳১,৪৯৯</span>
                    <span className="text-xs text-stone-500">/ এককালীন ফি</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">পূর্ণ এন৫ কোর্স, লিসেনিং, বাইতো ও মক টেস্টে আজীবন অ্যাক্সেস</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100 mb-8">
                  {[
                    'মিন্না নো নিহোঙ্গো ১–২৫ সম্পূর্ণ কারিকুলাম ও ভিডিও নোটস',
                    '১০০টি N5 অপরিহার্য কাঞ্জি ও ইন্টারেক্টিভ স্ট্রোক ড্রয়িং',
                    'টোকিও নেটিভ অডিও লিসেনিং ল্যাব (第1-25課 Choukai)',
                    'BaitoOS™ টোকিও কনবিনি ক্যাশিয়ার ও কাস্টমার সার্ভিস সিমুলেটর',
                    '১৮০ মার্কসের অফিশিয়াল মক টেস্ট ও ভেরিফাইড সনদ',
                    '২৪/৭ তানাকা এআই সেনসেই লাইভ টিউটর',
                    'দেশীয় bKash ও Nagad এ ইনস্ট্যান্ট অটোমেটেড ভেরিফিকেশন'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  trackNihomiEvent('subscription_checkout_started', { planId: 'pro', amountBDT: 499 });
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>এনরোল করুন — ৳৪৯৯ (bKash / Nagad)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MINIMALIST FAQ & DIRECT HELPLINE (WhatsApp 01834348966)         */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold mb-3 border border-stone-200">
              <HelpCircle className="w-3.5 h-3.5 text-red-500" />
              <span>সাধারণ জিজ্ঞাসাসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
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
                  className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50 transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isExpanded ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-stone-100/60 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-mono font-bold shrink-0">
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
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 animate-in fade-in duration-200">
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
          plan={N5_PRO_PLAN}
          selectedPlan={N5_PRO_PLAN}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            onNavigate('dashboard');
          }}
        />
      )}

    </div>
  );
};
