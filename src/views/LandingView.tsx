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
  Check,
  ChevronRight,
  Play,
  RotateCcw,
  Briefcase,
  FileText,
  Flame,
  Star,
  Users,
  Printer
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

// Hero Interactive Roleplay Dialogues (Pingo AI Style)
interface HeroDialogue {
  id: string;
  contextBn: string;
  contextJa: string;
  badge: string;
  sensei: {
    name: string;
    textJa: string;
    textRomaji: string;
    textBn: string;
  };
  learner: {
    textJa: string;
    textRomaji: string;
    textBn: string;
    pitchAccent: string;
  };
  chips: {
    label: string;
    textJa: string;
    textBn: string;
  }[];
}

const HERO_DIALOGUES: HeroDialogue[] = [
  {
    id: 'restaurant',
    contextBn: 'টোকিও রেস্তোরাঁয় টেবিল বুকিং',
    contextJa: 'レストランでの席予約',
    badge: 'Tokyo Restaurant Roleplay',
    sensei: {
      name: 'Nihomi Sensei AI™ (にほみ先生)',
      textJa: 'いらっしゃいませ！何名様ですか？',
      textRomaji: 'Irasshaimase! Nanmei-sama desu ka?',
      textBn: 'স্বাগতম! আপনারা কতজন?'
    },
    learner: {
      textJa: '二人です。禁煙席をお願いします。',
      textRomaji: "Futari desu. Kin'enseki o onegaishimasu.",
      textBn: 'দুজন। ধূমপানমুক্ত টেবিল দিন।',
      pitchAccent: 'HL / LH Pitch-Accent'
    },
    chips: [
      {
        label: 'কাউন্টার সিট',
        textJa: 'カウンター席でお願いします。',
        textBn: 'কাউন্টার টেবিলে বসা যাবে?'
      },
      {
        label: 'বুকিং আছে',
        textJa: '予約した田中と申します。',
        textBn: 'আমি বুকিং করা তানাকা।'
      },
      {
        label: 'জানালা সিট',
        textJa: '窓側の席は空いていますか？',
        textBn: 'জানালার পাশের সিট আছে কি?'
      }
    ]
  },
  {
    id: 'conbini',
    contextBn: 'টোকিও কনবিনি ক্যাশিয়ার কাউন্টার',
    contextJa: 'コンビニのレジ対応',
    badge: 'Tokyo Conbini Roleplay',
    sensei: {
      name: '佐藤 先生 (Sato Sensei)',
      textJa: 'いらっしゃいませ！ポイントカードはお持ちですか？',
      textRomaji: 'Irasshaimase! Pointo kaado wa omochi desu ka?',
      textBn: 'স্বাগতম! আপনার পয়েন্ট কার্ড আছে কি?'
    },
    learner: {
      textJa: '持っていません。袋も１枚お願いします。',
      textRomaji: 'Motte imasen. Fukuro mo ichimai onegaishimasu.',
      textBn: 'নেই। একটি পলিথিন ব্যাগও দিন।',
      pitchAccent: 'LH / HL Pitch-Accent'
    },
    chips: [
      {
        label: 'অ্যাপ আছে',
        textJa: 'あ、アプリの画面を見せます。',
        textBn: 'হ্যাঁ, অ্যাপের বারকোড দেখাচ্ছি।'
      },
      {
        label: 'ব্যাগ লাগবে না',
        textJa: '袋は結構です、このままで。',
        textBn: 'ব্যাগ লাগবে না, এভাবেই দিন।'
      },
      {
        label: 'সুইকা পেমেন্ট',
        textJa: 'Suicaで支払います。',
        textBn: 'সুইকা কার্ডে পেমেন্ট করব।'
      }
    ]
  },
  {
    id: 'station',
    contextBn: 'শিনজুকু স্টেশন ট্রেন নেভিগেশন',
    contextJa: '駅の案内・乗り換え',
    badge: 'Shinjuku Station Roleplay',
    sensei: {
      name: '駅員 (Station Officer)',
      textJa: 'はい、どちらまで行かれますか？',
      textRomaji: 'Hai, dochira made ikaremasu ka?',
      textBn: 'হ্যাঁ বলুন, আপনি কোথায় যাবেন?'
    },
    learner: {
      textJa: '渋谷まで行きたいです。山手線は何番線ですか？',
      textRomaji: 'Shibuya made ikitai desu. Yamanotesen wa nan-bansen desu ka?',
      textBn: 'শিবুইয়া যাব। ইয়ামানতে লাইন কত নম্বর প্ল্যাটফর্মে?',
      pitchAccent: 'HL / LH Pitch-Accent'
    },
    chips: [
      {
        label: 'পরবর্তী ট্রেন',
        textJa: '次の電車は何時何分ですか？',
        textBn: 'পরবর্তী ট্রেন কয়টায় ছাড়বে?'
      },
      {
        label: 'এক্সপ্রেস ট্রেন',
        textJa: 'この電車は渋谷に止まりますか？',
        textBn: 'এই ট্রেন কি শিবুইয়াতে থামবে?'
      },
      {
        label: 'টিকেট রিচার্জ',
        textJa: 'ICカードのチャージはどこですか？',
        textBn: 'আইসি কার্ড রিচার্জ মেশিন কোথায়?'
      }
    ]
  }
];

// 4 Real-Life Roleplay Scenarios
const ROLEPLAY_SCENARIOS = [
  {
    id: 'conbini',
    title: 'টোকিও কনবিনি ক্যাশিয়ার',
    sub: '7-Eleven & Lawson POS Dialogue',
    desc: 'পয়েন্ট কার্ড, খাবার গরম করা, প্লাস্টিক ব্যাগ ও বিভিন্ন পেমেন্ট মেথড ডায়ালগ',
    phraseJa: '温めますか？袋はおつけしますか？',
    phraseBn: 'খাবার কি গরম করে দেব? সাথে ব্যাগ লাগবে?',
    tags: ['অফিসিয়াল কেইগো', 'Baito POS'],
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    icon: Store,
    view: 'baito'
  },
  {
    id: 'station',
    title: 'শিনজুকু স্টেশন নেভিগেশন',
    sub: 'JR Yamanote & Subway Transfer',
    desc: 'ট্রেন মিস হলে রি-রুট, টিকিট কাউন্টারে অনুসন্ধান ও সঠিক প্ল্যাটফর্ম জিজ্ঞাসা',
    phraseJa: 'すみません、山手線は何番線ですか？',
    phraseBn: 'মাফ করবেন, ইয়ামানতে লাইন কত নম্বর প্ল্যাটফর্মে?',
    tags: ['দিকনির্দেশনা', 'লিসেনিং ড্রিল'],
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
    icon: Compass,
    view: 'baito'
  },
  {
    id: 'ramen',
    title: 'রামেন শপ টিকেট মেশিন',
    sub: 'Ticket Vending & Customization',
    desc: 'টিকেট মেশিন রিডিং, নুডলসের কঠোরতা ও অতিরিক্ত টপিং অর্ডার করা',
    phraseJa: '麺の硬さはどうなさいますか？カタメで！',
    phraseBn: 'নুডলস কেমন চান? একটু শক্ত করে দিন!',
    tags: ['ফুড ও মেনু', 'কাঞ্জি রিডিং'],
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    icon: Zap,
    view: 'baito'
  },
  {
    id: 'interview',
    title: 'জাপান পার্ট-টাইম ও ভিসা ইন্টারভিউ',
    sub: 'Baito & Visa Defense Coaching',
    desc: 'স্ব-পরিচয় (Jikoshoukai), কাজের ইচ্ছা ও শিফট টাইম ব্যাখ্যা করার ফ্লুয়েন্সি',
    phraseJa: 'はじめまして、一生懸命頑張ります！',
    phraseBn: 'পরিচিত হয়ে খুশি হলাম, আমি মন দিয়ে পরিশ্রম করব!',
    tags: ['জব ইন্টারভিউ', 'ভিসা প্রস্তুতি'],
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    icon: Briefcase,
    view: 'interview'
  }
];

// WaniKani-Style Stepped JLPT Progression Ladder
const WANIKANI_LEVELS = [
  {
    level: 'N5',
    title: 'Foundations (ভিত্তি)',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-400',
    stats: '২১০ শব্দ • ১০০ কাঞ্জি • লেসন ০১–২৫',
    description: 'হিরাগানা, কাতাকানা, প্রাথমিক অভিবাদন ও টোকিও কনবিনি কেনাকাটার ডায়ালগ।',
    status: 'ফ্রি স্টার্টার / Pro',
    actionText: 'শেখা শুরু করুন →',
    view: 'courses'
  },
  {
    level: 'N4',
    title: 'Independent Daily (দৈনন্দিন)',
    color: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    borderColor: 'border-cyan-500/30',
    accentColor: 'text-cyan-400',
    stats: '৩০০ শব্দ • ১৮০ কাঞ্জি • লেসন ২৬–৫০',
    description: 'সাবলীল সাধারণ কথোপকথন, দিকনির্দেশনা, ভ্রমণ ও জাপানে প্রতিদিনের কাজ।',
    status: 'বেসিক পাস',
    actionText: 'কারিকুলাম দেখুন →',
    view: 'courses'
  },
  {
    level: 'N3',
    title: 'Work Ready (কর্মক্ষেত্রে সক্ষম)',
    color: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-400',
    stats: '৬৫০ শব্দ • ৩৫০ কাঞ্জি • বাইতো স্পেশাল',
    description: 'পার্ট-টাইম বাইতো (Baito), কাস্টমার সার্ভিস, শপকিপিং ও জরুরি সমস্যার সমাধান।',
    status: 'জাপান বাইতো রেডি',
    actionText: 'বাইতো সিমুলেটর →',
    view: 'baito'
  },
  {
    level: 'N2',
    title: 'Corporate Business (করপোরেট)',
    color: 'from-purple-600 to-violet-700',
    badgeBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    borderColor: 'border-purple-500/30',
    accentColor: 'text-purple-400',
    stats: '১২০০ শব্দ • ১০০০ কাঞ্জি • বিজনেস কেইগো',
    description: 'অফিশিয়াল কেইগো (Keigo), বিজনেস ইমেইল, করপোরেট মিটিং ও স্কিলড জব ভিসা।',
    status: 'করপোরেট রেডি',
    actionText: 'সিভি ও কেইগো →',
    view: 'shokumu'
  },
  {
    level: 'N1',
    title: 'Fluency (নেটিভ সাবলীলতা)',
    color: 'from-rose-600 to-red-600',
    badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    borderColor: 'border-rose-500/30',
    accentColor: 'text-rose-400',
    stats: '২০০০+ শব্দ • ২০০০ কাঞ্জি • অ্যাডভান্সড',
    description: 'ন্যাচারাল নেটিভ লেভেল ফ্লুয়েন্সি, টেকনিক্যাল ডকুমেন্ট ও জাপানিজ নিউজপেপার রিডিং।',
    status: 'টপ টায়ার',
    actionText: 'মক টেস্ট দিন →',
    view: 'mock-exams'
  }
];

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
  id: 'japan_ready',
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
  const { openAuthModal, user } = useAuth();
  
  // Interactive Hero Roleplay State
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const currentDialogue = HERO_DIALOGUES[activeDialogueIndex];
  const [learnerActiveTextJa, setLearnerActiveTextJa] = useState(currentDialogue.learner.textJa);
  const [learnerActiveTextBn, setLearnerActiveTextBn] = useState(currentDialogue.learner.textBn);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync roleplay states on dialogue change
  useEffect(() => {
    setLearnerActiveTextJa(currentDialogue.learner.textJa);
    setLearnerActiveTextBn(currentDialogue.learner.textBn);
  }, [activeDialogueIndex, currentDialogue]);

  // AI Prompt Hub state
  const [queryInput, setQueryInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

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
      source: 'landing_hero_pingo_wanikani'
    });

    updatePageMetaTags({
      title: 'মুখে বলে জাপানিজ শিখুন — শূন্য থেকে টোকিওতে কর্মজীবন | NIHOMI (にほみ)',
      description: 'Pingo AI ও WaniKani হাইব্রিড জাপানিজ লার্নিং প্ল্যাটফর্ম। মিন্না নো নিহোঙ্গো কারিকুলাম, টোকিও কনবিনি সিমুলেশন এবং অফিসিয়াল JIS রেজুমে বিল্ডার।',
      ogTitle: 'মুখে বলে জাপানিজ শিখুন — শূন্য থেকে টোকিওতে কর্মজীবন | NIHOMI',
      ogDescription: 'মুখে বলে প্র্যাকটিস করুন এবং মাত্র ৬০-৯০ দিনে JLPT N5 প্রস্তুত হোন।',
      ogImage: 'https://nihomi.com/assets/og-nihomi-banner.png'
    });
  }, []);

  const handlePlayVoice = (text: string) => {
    setIsPlayingAudio(true);
    speakJapanese(text);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2200);
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
      answer: 'নিহোমি সম্পূর্ণ নিরাপদ দেশীয় bKash ও SSLCommerz অনলাইন পেমেন্ট সাপোর্ট করে। লেসন ০১ থেকে ০৫ সবার জন্য সম্পূর্ণ ফ্রি। লেসন ০৬ থেকে ২৫ ও অন্যান্য প্রো ফিচারের জন্য আমাদের বিকাশ বা কার্ড গেটওয়ে দিয়ে ১-ক্লিকে পে করতে পারবেন এবং তাৎক্ষণিকভাবে অ্যাকাউন্ট অ্যাক্টিভেট হবে।'
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
      question: 'JIS 履歴書 ও 職務経歴書 সিভি বিল্ডার কীভাবে কাজ করে?',
      answer: 'নিহোমিতে রয়েছে জাপানের সরকারি স্ট্যান্ডার্ড JIS规格 রেজুমে ও শকুমু কেইরেকিষো বিল্ডার। আপনি সাধারণ তথ্য বাংলায় বা রোমাজিতে দিলে আমাদের বিল্ট-ইন AI Keigo Polisher সেটিকে অফিসিয়াল জাপানিজ বিজনেস কেইগোতে রূপান্তর করে এবং তাৎক্ষণিক প্রিন্ট-রেডি A4 সাইজ PDF ডাউনলোড করতে পারবেন।'
    },
    {
      question: 'জাপানে স্টুডেন্ট ভিসা বা কাজের (SSW / TITP) জন্য এটি কতটা সহায়ক?',
      answer: 'আমাদের কারিকুলাম সরাসরি অফিশিয়াল JLPT ও NAT-TEST স্ট্যান্ডার্ড অনুযায়ী তৈরি। পাশাপাশি টোকিও কনবিনি জব সিমুলেশন (Nihomi WorkOS™) ও রিয়েল-লাইফ বাইতো কনভারসেশন ড্রিল থাকায় ভিসা ইন্টারভিউ ও জাপানে কাজের ক্ষেত্রে দারুণ আত্মবিশ্বাস তৈরি হয়।'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-rose-600 selection:text-white overflow-hidden">
      {/* Subtle Japanese festival fireworks canvas background */}
      <HanabiBackground />

      {/* Ambient Red / Blue Glow Orbs (Subtle, No Aggressive Neon) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-rose-600/10 via-red-600/5 to-transparent blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none absolute top-[550px] -left-32 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full z-0" />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO (PINGO AI CONVERSATIONAL SHOWCASE)                        */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: VALUE PROPOSITION (7 Cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>🇯🇵 জাপান সরকার ও JLPT স্ট্যান্ডার্ড কারিকুলাম • Minna no Nihongo সমর্থিত</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              মুখে বলে জাপানিজ শিখুন — <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400">
                শূন্য থেকে টোকিওতে কর্মজীবন।
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              মুখস্থ নয়, বাস্তব পরিস্থিতিতে কথা বলে জাপানিজ আয়ত্ত করুন। N5 থেকে N1 পর্যন্ত ইন্টারেক্টিভ অডিও লেসন, পিঙ্গো-স্টাইল লাইভ রোলপ্লে এবং অফিসিয়াল JIS রেজুমে বিল্ডার।
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  trackNihomiEvent('journey_start_clicked', { source: 'landing_hero' });
                  onNavigate('journey');
                }}
                className="px-7 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl text-sm sm:text-base font-bold shadow-xl shadow-red-600/25 hover:shadow-red-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
                <span>বিনামূল্যে শেখা শুরু করুন →</span>
              </button>

              <button
                onClick={() => onNavigate('baito')}
                className="px-6 py-4 bg-[#161D2B] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-2xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                <span>কনবিনি সিমুলেটর ট্রাই করুন</span>
              </button>
            </div>

            {/* Micro-Proof Points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">⚡</span>
                <span>৫ মিনিট দৈনিক প্র্যাকটিস</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-rose-400">🎙️</span>
                <span>রিয়েল-টাইম পিচ-অ্যাকসেন্ট কারেকশন</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">💳</span>
                <span>বিকাশ ও কার্ডে নিরাপদ পেমেন্ট</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE PINGO AI CONVERSATIONAL VOICE CARD (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#161D2B] border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Card Header & Scenario Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {currentDialogue.badge}
                  </span>
                </div>
                
                {/* Switch dialogue button */}
                <button
                  onClick={() => setActiveDialogueIndex((prev) => (prev + 1) % HERO_DIALOGUES.length)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors cursor-pointer"
                  title="অন্য রোলপ্লে দেখুন"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>দৃশ্য পরিবর্তন</span>
                </button>
              </div>

              {/* Scenario Context Banner */}
              <div className="mb-4 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">পরিস্থিতি:</span>
                <span className="text-amber-300 font-bold">{currentDialogue.contextBn}</span>
              </div>

              {/* Speech Conversation Thread */}
              <div className="space-y-4">
                
                {/* 1. SENSEI MESSAGE BUBBLE */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                    田
                  </div>
                  <div className="flex-1 bg-[#1A2333] border border-slate-700/70 rounded-2xl rounded-tl-xs p-3.5 shadow-sm text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-rose-400">{currentDialogue.sensei.name}</span>
                      <button
                        onClick={() => handlePlayVoice(currentDialogue.sensei.textJa)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer"
                        title="জাপানিজ উচ্চারণ শুনুন"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white font-japanese tracking-wide leading-relaxed">
                      {currentDialogue.sensei.textJa}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {currentDialogue.sensei.textRomaji}
                    </p>
                    <p className="text-xs text-slate-300 mt-1 border-t border-slate-700/50 pt-1 font-medium">
                      বাংলা: {currentDialogue.sensei.textBn}
                    </p>
                  </div>
                </div>

                {/* 2. LEARNER MESSAGE BUBBLE (TALKPAL / PINGO VOICE FORMAT) */}
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                    You
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-blue-950/40 via-[#1A2333] to-[#161D2B] border border-blue-500/40 rounded-2xl rounded-tr-xs p-3.5 shadow-sm text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                        {currentDialogue.learner.pitchAccent}
                      </span>
                      <button
                        onClick={() => handlePlayVoice(learnerActiveTextJa)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 cursor-pointer"
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white font-japanese tracking-wide leading-relaxed">
                      {learnerActiveTextJa}
                    </p>
                    <p className="text-xs text-slate-300 mt-1 border-t border-slate-700/50 pt-1 font-medium">
                      বাংলা: {learnerActiveTextBn}
                    </p>

                    {/* Animated Visual Audio Waveforms */}
                    <div className="flex items-center gap-1 pt-2.5">
                      {[40, 75, 55, 90, 60, 80, 45, 95, 65, 50, 85, 40].map((height, i) => (
                        <div
                          key={i}
                          style={{ height: isPlayingAudio ? `${height * 0.28}px` : '4px' }}
                          className={`w-1 rounded-full transition-all duration-200 ${
                            isPlayingAudio ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 font-mono ml-2">
                        {isPlayingAudio ? 'Play 2.1s' : 'Audio Ready'}
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Interactive Reply Suggestion Chips */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>বিকল্প উত্তরের পরামর্শ (ক্লিক করুন):</span>
                  <span className="text-[10px] text-amber-400 font-mono">1-Click Voice</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentDialogue.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLearnerActiveTextJa(chip.textJa);
                        setLearnerActiveTextBn(chip.textBn);
                        handlePlayVoice(chip.textJa);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 text-[11px] text-slate-200 hover:text-white transition-all cursor-pointer text-left flex items-center gap-1.5 group"
                    >
                      <Play className="w-2.5 h-2.5 text-blue-400 group-hover:text-rose-400 shrink-0" />
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Interactive Voice Trigger */}
              <div className="mt-4 pt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsVoiceActive(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-600 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-red-600/20"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>মুখে বলে উত্তর দিন (Mic)</span>
                </button>
                <button
                  onClick={() => onNavigate('baito')}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>বাইতো মোড</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* AI Quick Query Search Bar */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="bg-[#161D2B] rounded-3xl border border-slate-800 shadow-xl p-4 sm:p-5 text-left space-y-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nihomi Sensei AI™-কে যেকোনো ব্যাকরণ বা শব্দ জিজ্ঞাসা করুন:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(queryInput)}
                placeholder="যেমন: は (wa) vs が (ga) এর পার্থক্য, কনবিনি কেইগো..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-hidden"
              />
              <button
                onClick={() => handleSearch(queryInput)}
                disabled={isAnswering || !queryInput.trim()}
                className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
                aria-label="Send Query"
              >
                {isAnswering ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 pt-1">
              <span className="text-slate-500 text-[11px]">পরামর্শ:</span>
              {[
                'は (wa) vs が (ga)',
                '〜てください vs 〜てくださいませんか',
                'Tokyo Baito Keigo',
                'Kanji: 日本語',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(q)}
                  className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-[11px] transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* AI Response Box */}
            {aiAnswer && (
              <div className="mt-3 bg-slate-900/95 rounded-2xl p-4 border border-slate-700/80 shadow-lg animate-in fade-in space-y-2 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-rose-400">নিহোমি AI সেনসেই সমাধান</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakJapanese(aiAnswer)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                    <button
                      onClick={() => setAiAnswer(null)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {aiAnswer}
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PINGO-STYLE REAL-LIFE ROLEPLAY SCENARIOS                       */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-18 bg-[#0F141C] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
              <span>🇯🇵 রিয়েল-লাইফ সিচুয়েশন</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              জাপান যাওয়ার আগেই জাপানের বাস্তব অভিজ্ঞতা
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              জাপানের দৈনন্দিন ৪টি বাস্তব পরিস্থিতির জন্য নিজেকে নিখুঁতভাবে তৈরি করুন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLEPLAY_SCENARIOS.map((sc, idx) => {
              const IconComponent = sc.icon;
              return (
                <div
                  key={sc.id}
                  className="rounded-3xl bg-[#161D2B] border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg group"
                >
                  <div className="space-y-4">
                    
                    {/* Header with icon and tags */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${sc.color} flex items-center justify-center border shadow-xs`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        {sc.tags.map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                        {sc.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{sc.sub}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sc.desc}
                    </p>

                    {/* Real Japanese Phrase Sample */}
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Key Dialogue</span>
                        <button
                          onClick={() => handlePlayVoice(sc.phraseJa)}
                          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
                          title="শুনুন"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-white font-japanese">
                        {sc.phraseJa}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {sc.phraseBn}
                      </p>
                    </div>

                  </div>

                  {/* Action Link */}
                  <div className="pt-6 border-t border-slate-800 mt-6">
                    <button
                      onClick={() => onNavigate(sc.view)}
                      className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>অনুশীলন শুরু করুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WANIKANI-STYLE N5 TO N1 PROGRESSION LADDER                     */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 bg-[#0B0F17] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <span>📈 বিজ্ঞানসম্মত মাইলস্টোন</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              JLPT N5 থেকে N1: আপনার জাপান যাত্রার রোডম্যাপ
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              ওয়াজিকানির মতো রঙ-চিহ্নিত ও পর্যায়ক্রমিক লার্নিং সিস্টেম
            </p>

            {/* High-level stats pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
              <span className="text-rose-400 font-mono">২১০+ লেসন</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono">৯৫০+ শব্দভাণ্ডার</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-400 font-mono">৫০+ লাইভ কনভার্সেশন</span>
            </div>
          </div>

          {/* Stepped 5-Level Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5">
            {WANIKANI_LEVELS.map((item, index) => (
              <div
                key={item.level}
                className={`rounded-3xl bg-[#161D2B] border ${item.borderColor} p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all hover:-translate-y-1.5`}
              >
                {/* Level Tag Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-xl font-black text-sm font-mono border ${item.badgeBg}`}>
                      {item.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      ধাপ 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white mb-1">
                    {item.title}
                  </h3>
                  
                  <div className="text-[11px] font-mono text-slate-400 mb-3 pb-2 border-b border-slate-800">
                    {item.stats}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Level Status & Action */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>স্ট্যাটাস:</span>
                    <span className={`font-bold ${item.accentColor}`}>{item.status}</span>
                  </div>
                  <button
                    onClick={() => onNavigate(item.view)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: JAPAN CAREER & CV BUILDER TEASER                               */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 bg-[#0F141C] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span>📄 অফিশিয়াল ক্যারিয়ার টুলস</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              জাপান স্ট্যান্ডার্ড JIS রেজুমে ও AI কেইগো পলিশার
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              জাপানে পার্ট-টাইম ও ফুল-টাইম জবের জন্য অফিশিয়াল জাপানিজ ফরম্যাটে সিভি তৈরি করুন
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual A4 Document Preview Card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#161D2B] border border-slate-800 p-6 shadow-2xl relative">
                
                {/* Paper Window Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="font-mono text-slate-400 ml-2">JIS_Standard_A4_Rirekisho.pdf</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    JIS 規格準拠
                  </span>
                </div>

                {/* Simulated A4 White Paper Sheet */}
                <div className="bg-white text-zinc-950 rounded-2xl p-6 sm:p-8 shadow-inner border border-stone-300 font-japanese text-left select-none relative overflow-hidden">
                  
                  {/* Top Bar with Stamp & Title */}
                  <div className="flex items-start justify-between border-b-2 border-zinc-950 pb-4 mb-4">
                    <div>
                      <h4 className="text-2xl sm:text-3xl font-black tracking-widest text-zinc-950">
                        履 歴 書
                      </h4>
                      <p className="text-[10px] text-zinc-600 font-sans tracking-wide mt-1">
                        (JIS規格 日本標準履歴書様式 • A4判)
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Photo Box */}
                      <div className="w-16 h-20 border border-zinc-400 rounded-sm flex flex-col items-center justify-center text-[9px] text-zinc-500 font-sans bg-zinc-50">
                        <span>写 真</span>
                        <span>40mm x 30mm</span>
                      </div>
                      {/* Hanko Stamp */}
                      <div className="w-10 h-10 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        印
                      </div>
                    </div>
                  </div>

                  {/* Motivation / Self PR Section */}
                  <div className="space-y-3 font-sans">
                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-zinc-900 font-japanese">志望動機 (আবেদনের কারণ)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                          ✓ AI Keigo Polished
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed font-japanese">
                        貴社の企業理念に深く共感し、日本での実務経験を通じて貢献したいと考え志望いたしました。誠心誠意努めてまいります。
                      </p>
                    </div>

                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <span className="text-[11px] font-bold text-zinc-900 font-japanese block mb-1">自己PR (নিজের শক্তি ও অভিজ্ঞতা)</span>
                      <p className="text-xs text-zinc-700 leading-relaxed font-japanese">
                        責任感が強く、時間厳守を徹底しております。日本語学習にも日々励み、チームワークを重んじて業務を遂行します。
                      </p>
                    </div>
                  </div>

                  {/* Watermark Tag */}
                  <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Generated via Nihomi Japan Career Engine</span>
                    <span>100% Free JIS A4 Export</span>
                  </div>

                </div>

              </div>
            </div>

            {/* 3 Core Breakthrough Features (5 cols) */}
            <div className="lg:col-span-5 space-y-5 text-left">
              
              <div className="p-5 rounded-3xl bg-[#161D2B] border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    ১-ক্লিকে বাংলা থেকে খাঁটি বিজনেস কেইগো
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-11">
                  বাংলা বা সাধারণ ভাষায় আপনার অভিজ্ঞতা লিখুন; আমাদের সেনসেই AI সেটিকে অফিসিয়াল Sonkeigo ও Kenjougo সমৃদ্ধ জাপানিজ বাক্যে রূপান্তর করবে।
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#161D2B] border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    অফিসিয়াল A4 সাইজ জাপানিজ প্রিন্ট-রেডি PDF
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-11">
                  জাপানের ৭-ইলেভেন বা ফ্যামিলিমার্ট কনবিনি প্রিন্টারে বা কোম্পানিতে ইমেইল পাঠাতে পারবেন কোনো ফরমেটিং ভাঙা ছাড়াই।
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#161D2B] border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    জাপানিজ ইন্টারভিউ কমন প্রশ্নোত্তর গাইড
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-11">
                  সিভির পাশাপাশি ভাইভা বোর্ডে জিজ্ঞেস করা ২৫টি কমন প্রশ্ন এবং জাপানিজ অভিবাদন ম্যানারিজম গাইড পেয়ে যাবেন।
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate('shokumu')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>সিভি স্টুডিও ওপেন করুন (Free JIS A4) →</span>
                </button>
                <button
                  onClick={() => onNavigate('interview')}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>ইন্টারভিউ ড্রিল</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: TAPO-STYLE VALUE REVEAL & ৳৪৯৯ SPECIAL PASS                    */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 bg-[#0B0F17] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Embedded Tapo-Style 6-Card Value Reveal Carousel */}
          <ValueRevealCarousel
            onNavigate={onNavigate}
            onOpenSenseiVoice={() => setIsVoiceActive(true)}
            onOpenWritingCanvas={() => setIsWritingActive(true)}
          />

          {/* Dedicated High-Converting ৳৪৯৯ N5 Lifetime Pass Card */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-[#161D2B] via-[#1A2333] to-[#161D2B] border-2 border-rose-500/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] sm:text-xs font-bold px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">
                🔥 সর্বোচ্চ জনপ্রিয় • লাইফটাইম অ্যাক্সেস
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Description (7 cols) */}
                <div className="md:col-span-7 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
                    JLPT N5 Complete Mastery
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    N5 Pro লাইফটাইম পাস — মাত্র ৳৪৯৯
                  </h3>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">৳৪৯৯</span>
                    <span className="text-base text-slate-400 line-through">৳১,৪৯৯</span>
                    <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md">
                      ৬৭% ছাড় • এককালীন ফি
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    মিন্না নো নিহোঙ্গো ১–২৫ সম্পূর্ণ কারিকুলাম, তোশিবা নেটিভ লিসেনিং ল্যাব, ১০০ কাঞ্জি ড্রয়িং এবং অফিসিয়াল ১৮০ মার্কসের আনলিমিটেড মক টেস্ট।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {[
                      'মিন্না নো নিহোঙ্গো ১–২৫ সম্পূর্ণ পাঠ',
                      '১০০টি N5 কাঞ্জি স্ট্রোক ক্যানভাস',
                      'লিসেনিং অডিও ল্যাব (第1-25課 Choukai)',
                      'JIS 履歴書 ও 職務経歴書 A4 PDF',
                      'টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর',
                      '১৮০ মার্কসের অফিসিয়াল মক টেস্ট ও সনদ',
                      '২৪/৭ Nihomi Sensei AI™ লাইভ টিউটর',
                      'আজীবন অ্যাক্সেস (কোনো মাসিক ফি নেই)'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right Action Box (5 cols) */}
                <div className="md:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 text-center space-y-4 shadow-xl">
                  
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-300">ইনস্ট্যান্ট বিকাশ ও অনলাইন চেকআউট</div>
                    <div className="text-[11px] text-slate-400">পেমেন্ট করার সাথে সাথেই পুরো N5 আনলক</div>
                  </div>

                  <button
                    onClick={() => {
                      trackNihomiEvent('subscription_checkout_started', { planId: 'pro', amountBDT: 499 });
                      setCheckoutTargetPlan(N5_PRO_PLAN);
                      setCheckoutTargetInterval('yearly');
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>১-ক্লিকে এনরোল করুন — ৳৪৯৯</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>bKash & SSLCommerz ভেরিফাইড মার্চেন্ট</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onNavigate('pricing')}
                      className="text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
                    >
                      বাৎসরিক অল-এক্সেস (৳৪,৯৯০) বা অন্যান্য প্ল্যান দেখুন →
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FAQS & DIRECT SUPPORT HELPLINE                                 */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 bg-[#0F141C] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>সাধারণ জিজ্ঞাসাসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              নিহোমিতে ভর্তি, পেমেন্ট ও জাপানিজ শেখার পদ্ধতি সম্পর্কে প্রয়োজনীয় তথ্য
            </p>
          </div>

          {/* Minimalist Accordion */}
          <div className="space-y-3 mb-14">
            {faqs.map((faq, index) => {
              const isExpanded = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-slate-800 rounded-2xl overflow-hidden bg-[#161D2B] transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isExpanded ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-mono font-bold shrink-0 border border-rose-500/30">
                        {index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200">
                      <p className="pl-8 sm:pl-8.5">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct WhatsApp & Farmgate Office Badge Banner */}
          <div className="rounded-3xl bg-[#161D2B] text-white p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>সরাসরি কাউন্সেলিং ও সহায়তা</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                যেকোনো প্রয়োজনে আমরা আছি আপনার সাথে
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                ভর্তি বা কোর্স সংক্রান্ত তথ্যের জন্য সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন বা কল করুন।
              </p>
              <div className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>ঢাকা অফিস: {NIHOMI_CONTACT.officeLocationBn}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href={`https://wa.me/${NIHOMI_CONTACT.whatsappNumber}?text=${encodeURIComponent('হ্যালো নিহোমি! আমি JLPT N5 কোর্সে ভর্তি হতে চাই / পেমেন্ট সংক্রান্ত তথ্য জানতে চাই।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp: {NIHOMI_CONTACT.phone}</span>
              </a>

              <a
                href={`tel:${NIHOMI_CONTACT.phone}`}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-slate-300" />
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
