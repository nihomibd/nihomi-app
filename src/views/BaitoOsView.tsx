// src/views/BaitoOsView.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Download,
  Sparkles,
  Volume2,
  Store,
  RotateCcw,
  ArrowRight,
  Mic,
  Award,
  AlertCircle,
  Activity,
  Compass,
  Building,
  GraduationCap,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  TrendingUp,
  Layers,
  Landmark,
  Trash2,
  CreditCard,
  Check,
  Play
} from 'lucide-react';
import { BaitoScenarioItem } from '../types';
import { ConbiniPosCashierSimulator } from '../components/simulation/ConbiniPosCashierSimulator';
import { InterviewVoiceTwinLab } from '../components/simulation/InterviewVoiceTwinLab';
import { JisRirekishoStudio } from '../components/simulation/JisRirekishoStudio';
import { ShokumuKeirekishoStudio } from '../components/simulation/ShokumuKeirekishoStudio';
import { VoiceTwinPitchLab } from '../components/simulation/VoiceTwinPitchLab';
import { speakJapanese } from '../lib/tts';
import { soundEffects } from '../lib/soundEffects';

// Default Tokyo Scenarios
export const DEFAULT_BAITO_SCENARIOS: BaitoScenarioItem[] = [
  {
    id: 'sc-school-principal',
    type: 'school_principal',
    title: 'Japanese Language School Admission Defense',
    titleJa: '日本語学校・校長面接（入学・奨学金選抜）',
    titleBn: 'জাপানিজ ল্যাঙ্গুয়েজ স্কুল অধ্যক্ষের ইন্টারভিউ',
    subtitle: 'Simulate high-stakes admissions and scholarship interviews with Tokyo School Principals.',
    difficulty: 'N5',
    location: 'Tokyo International Academy (Shinjuku)',
    interlocutorName: 'Yamada Principal (山田校長)',
    interlocutorRole: 'Principal of Tokyo Japanese Language Institute',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'それでは面接を始めます。まず、あなたのお名前と、日本に留学したい理由を教えていただけますか？',
      romaji: 'Soredewa mensetsu o hajimemasu. Mazu, anata no onamae to, Nihon ni ryuugaku shitai riyuu o oshiete itadakemasu ka?',
      bn: 'তাহলে ইন্টারভিউ শুরু করা যাক। প্রথমে আপনার নাম এবং জাপানে পড়াশোনা করতে আসার কারণ বলুন।',
      en: 'Let us begin the interview. First, could you tell me your name and your reason for wanting to study in Japan?'
    },
    objectives: [
      'Self-introduction using Sonkeigo/Kenjougo basics (〜と申します)',
      'Articulate concrete career plans in Tokyo (IT, engineering, or higher education)',
      'Explain financial stability and sponsorship respectfully',
      'Demonstrate motivation to achieve JLPT N2 within 18 months'
    ],
    contextDescription: 'Language school principal interview is the primary gatekeeper for receiving your Certificate of Eligibility (COE). Calm Keigo delivery makes a decisive impression.',
    keyVocabulary: [
      { ja: '志望動機', kana: 'しぼうどうき', meaningBn: 'আবেদন করার উদ্দেশ্য', meaningEn: 'Motive for applying' },
      { ja: '将来の目標', kana: 'しょうらいのもくひょう', meaningBn: 'ভবিষ্যতের লক্ষ্য', meaningEn: 'Future goal' },
      { ja: '学費の支払い', kana: 'がくひのしはらい', meaningBn: 'টিউশন ফি পরিশোধ', meaningEn: 'Tuition payment' },
      { ja: 'よろしくお願いいたします', kana: 'よろしくおねがいいたします', meaningBn: 'আপনার সদয় দৃষ্টি কামনা করছি', meaningEn: 'Please treat me favorably' }
    ]
  },
  {
    id: 'sc-conbini-pos',
    type: 'conbini_pos',
    title: '7-Eleven & Lawson POS Cashier Roleplay',
    titleJa: 'コンビニPOSレジ接客・スキャンと袋詰め演習',
    titleBn: 'কনবিনি ক্যাশ রেজিস্টার ও কাস্টমার সার্ভিস সিমুলেশন',
    subtitle: 'Master fast-paced conbini Keigo, bento heating, point cards, and payment processing.',
    difficulty: 'N5',
    location: '7-Eleven Shinjuku Takadanobaba Ekimae Store',
    interlocutorName: 'Yamamoto-san (Store Manager / Customer)',
    interlocutorRole: 'Tokyo Store Manager & Regular Customers',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'いらっしゃいませ！温かいお弁当と緑茶をお願いします。あとレジ袋も1枚いただけますか？',
      romaji: 'Irasshaimase! Atatakai obentou to ryokucha o onegai shimasu. Ato rejibukuro mo ichimai itadakemasu ka?',
      bn: 'স্বাগতম! একটি ওবেন্তো (গরম করে দেবেন) ও গ্রিন টি দিন। সাথে একটা শপিং ব্যাগও দিন।',
      en: 'Welcome! Please heat up this bento and I will take this green tea. Also one plastic bag please.'
    },
    objectives: [
      'Scan barcodes & greet with Irasshaimase (いらっしゃいませ)',
      'Confirm bento heating (お弁当温めますか？)',
      'Ask for Point Card (ポイントカードはお持ちですか？)',
      'Confirm plastic bag & chopsticks (お袋とお箸はお付けしますか？)',
      'Process exact payment & receipt handover (お釣り500円とレシートでございます)'
    ],
    contextDescription: 'Conbini shifts are the #1 entry-level student job in Tokyo (28 hrs/week). Accuracy and swift polite Japanese are essential.',
    keyVocabulary: [
      { ja: 'いらっしゃいませ', kana: 'いらっしゃいませ', meaningBn: 'স্বাগতম', meaningEn: 'Welcome' },
      { ja: '温める', kana: 'あたためる', meaningBn: 'গরম করা', meaningEn: 'To heat up' },
      { ja: 'ポイントカード', kana: 'ぽいんとかーど', meaningBn: 'পয়েন্ট কার্ড', meaningEn: 'Point Card' },
      { ja: '袋', kana: 'ふくろ', meaningBn: 'প্লাস্টিক ব্যাগ', meaningEn: 'Plastic Bag' }
    ]
  }
];

// Living Survival Modules for Stage 3
interface LivingModule {
  id: string;
  titleJa: string;
  titleBn: string;
  icon: any;
  description: string;
  dialogueJa: string;
  dialogueBn: string;
  checklist: string[];
  tips: string[];
}

const STAGE3_LIVING_MODULES: LivingModule[] = [
  {
    id: 'city_hall',
    titleJa: '市役所・区役所での転入届',
    titleBn: 'সিটি হল এড্রেস রেজিস্ট্রেশন (Juminhyo ও ইনস্যুরেন্স)',
    icon: Landmark,
    description: 'জাপানে পৌঁছানোর ১৪ দিনের মধ্যে আপনার স্থানীয় ওয়ার্ড বা সিটি অফিসে ঠিকানা নথিভুক্ত করা এবং জাতীয় স্বাস্থ্যবীমা (Kokumin Kenko Hoken) কার্ড সংগ্রহ করা বাধ্যতামূলক।',
    dialogueJa: 'すみません、転入届を出したいのですが、どちらの窓口でしょうか？',
    dialogueBn: 'মাফ করবেন, আমি ঠিকানার ট্রান্সফার ফর্ম জমা দিতে চাই, কোন কাউন্টারে যেতে হবে?',
    checklist: [
      '在留カード (Residence Card)',
      'パスポート (Passport)',
      '賃貸契約書 (Apartment lease contract or dorm cert)',
      'マイナンバー通知 (My Number notification)'
    ],
    tips: [
      'কাউন্টারে যাওয়ার সময় "転入届 (てんにゅうとどけ)" বললেই সংশ্লিষ্ট ফর্ম পাওয়া যায়।',
      'শিক্ষার্থীদের জন্য জাতীয় স্বাস্থ্যবীমায় ৭০% ছাত্র রিডাকশন ডিসকাউন্টের জন্য আবেদন করতে ভুলবেন না।'
    ]
  },
  {
    id: 'bank_account',
    titleJa: 'ゆうちょ銀行での口座開設',
    titleBn: 'জাপান পোস্ট ব্যাংক (Yucho Bank) অ্যাকাউন্ট খোলা',
    icon: CreditCard,
    description: 'জাপানে পার্ট-টাইম বেতনের টাকা এবং বাসা ভাড়া পরিশোধের জন্য প্রথম ৬ মাস সবচেয়ে সহজে ব্যাংক অ্যাকাউন্ট খোলা যায় জাপান পোস্ট ব্যাংকে (ゆうちょ銀行)।',
    dialogueJa: '口座を開設したいのですが、留学生です。手続きをお願いします。',
    dialogueBn: 'আমি একটি ব্যাংক অ্যাকাউন্ট খুলতে চাই, আমি একজন বিদেশি শিক্ষার্থী। প্রসিডিউর শুরু করতে সাহায্য করুন।',
    checklist: [
      '在留カード (Residence Card with registered address)',
      '学生証 (Student ID Card)',
      '印鑑 (Personal Seal / Hanko) বা স্বাক্ষর',
      '連絡先電話番号 (Japanese mobile phone number)'
    ],
    tips: [
      'ATM স্ক্রিন শব্দ: お引き出し (টাকা উত্তোলন), お預け入れ (টাকা জমা), お振込み (ট্রান্সফার)।',
      'পাসবুক (通帳 - Tsuucho) এবং ক্যাশ কার্ড ৭-১০ দিনের মধ্যে ডাকে বাসায় পৌঁছাবে।'
    ]
  },
  {
    id: 'garbage_rules',
    titleJa: 'ゴミ分別・回収ルール',
    titleBn: 'জাপান আবর্জনা বাছাই ও সঠিক দিনে ফেলার নিয়ম',
    icon: Trash2,
    description: 'জাপানের সমাজে সবচেয়ে স্পর্শকাতর শিষ্টাচার হলো বর্জ্য নিষ্কাশন। নির্ধারিত রঙ ও ব্যাগে ভাগ না করলে এবং ভুল দিনে আবর্জনা ফেললে বড় ধরনের নোটিশ বা জরিমানা হতে পারে।',
    dialogueJa: 'このアパートのゴミ出しの日は何曜日ですか？',
    dialogueBn: 'এই অ্যাপার্টমেন্টের আবর্জনা ফেলার নির্দিষ্ট দিন কোনগুলো?',
    checklist: [
      '燃えるゴミ (Burnable Waste) - সাধারণত সপ্তাহে ২ দিন (সোম/বৃহঃ)',
      '燃えないゴミ (Non-burnable) - মেটাল, সিরামিক, ছোট ভাঙা কাঁচ',
      'ペットボトル (PET Bottles) - লেবেল ও ক্যাপ খুলে ভেতরের পানি ধুয়ে নির্দিষ্ট নেটে ফেলুন',
      '缶・ビン (Cans & Bottles) - অ্যালুমিনিয়াম ক্যান ও বোতল আলাদা ঝুড়িতে'
    ],
    tips: [
      'সকাল ৮টার আগে নির্ধারিত কালেকশন পয়েন্টে ময়লার ব্যাগ রাখুন, আগের রাতে ময়লা বাইরে ফেলবেন না (কাকের উপদ্রব এড়াতে)।',
      'ফার্নিচার বা ইলেকট্রনিক্স ফেললে "粗大ゴミ (そだいごみ)" ফি স্টিকার কিনে ফেলতে হয়।'
    ]
  }
];

interface BaitoOsViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  initialStage?: 'stage1_visa' | 'stage2_workplace' | 'stage3_living';
  initialScenarioId?: string;
  initialTab?: string;
}

export const BaitoOsView: React.FC<BaitoOsViewProps> = ({ onNavigate, initialStage, initialScenarioId, initialTab }) => {
  // 3 Guided Journey Stages: Stage 1 Visa, Stage 2 Workplace, Stage 3 Living Survival
  const [currentStage, setCurrentStage] = useState<'stage1_visa' | 'stage2_workplace' | 'stage3_living'>(() => {
    if (initialStage) return initialStage;
    if (initialTab === 'pos_terminal' || initialScenarioId?.includes('conbini')) return 'stage2_workplace';
    if (initialTab === 'living' || initialTab === 'city_hall') return 'stage3_living';
    return 'stage1_visa';
  });
  
  // Stage 1 sub-tools
  const [stage1Tool, setStage1Tool] = useState<'interview' | 'rirekisho' | 'keirekisho'>('interview');
  
  // Stage 2 sub-tools
  const [stage2Tool, setStage2Tool] = useState<'pos_simulator' | 'pitch_lab'>('pos_simulator');
  
  // Stage 3 active module
  const [stage3ModuleId, setStage3ModuleId] = useState<string>('city_hall');

  // Ambient sound state
  const [ambientMode, setAmbientMode] = useState<'off' | 'conbini' | 'cafe' | 'factory'>('off');

  // User Readiness Stats
  const [stats, setStats] = useState({
    stage1Complete: 92,
    stage2Complete: 96,
    stage3Complete: 88
  });

  // Ambient sound lifecycle
  useEffect(() => {
    if (ambientMode === 'off') {
      soundEffects.stopAmbient();
    } else {
      soundEffects.startAmbient(ambientMode);
    }
    return () => {
      soundEffects.stopAmbient();
    };
  }, [ambientMode]);

  const activeStage3Module = STAGE3_LIVING_MODULES.find((m) => m.id === stage3ModuleId) || STAGE3_LIVING_MODULES[0];

  return (
    <div id="baito-os-view" className="min-h-screen bg-[#080711] text-stone-100 pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ========================================================================= */}
        {/* HERO BANNER & JOURNEY ROADMAP INTRO                                       */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#15122b] via-[#120f26] to-[#0a0817] border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIHOMI WORKOS™ • Experience Japan Before You Arrive</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                জাপান কর্মজীবন ও বসবাস প্রস্তুতি <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-rose-400">
                  ৩-ধাপের গাইডেড লার্নিং জার্নি (WorkOS™)
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                ভিসা ইন্টারভিউ থেকে শুরু করে টোকিও কনবিনি ক্যাশিয়ার এবং সিটি হল রেজিস্ট্রেশন — জাপানে সফলভাবে সেটেল হওয়ার প্রতিটি বাস্তব ধাপ এখানে হাতে-কলমে অনুশীলন করুন।
              </p>
            </div>

            {/* 3-Stage Progress Gauge Overview */}
            <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto shrink-0 bg-[#0d0a1c] border border-white/10 p-3.5 rounded-2xl shadow-inner text-center font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-amber-500/20">
                <div className="text-[10px] text-stone-400">ধাপ ১: ভিসা</div>
                <div className="text-base sm:text-lg font-black text-amber-300">{stats.stage1Complete}%</div>
                <div className="text-[9px] text-emerald-400">Ready</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-rose-500/20">
                <div className="text-[10px] text-stone-400">ধাপ ২: কনবিনি</div>
                <div className="text-base sm:text-lg font-black text-rose-300">{stats.stage2Complete}%</div>
                <div className="text-[9px] text-emerald-400">Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-emerald-500/20">
                <div className="text-[10px] text-stone-400">ধাপ ৩: লিভিং</div>
                <div className="text-base sm:text-lg font-black text-emerald-300">{stats.stage3Complete}%</div>
                <div className="text-[9px] text-emerald-400">Ready</div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 3 CLEAR JOURNEY STAGE SELECTOR TABS                                     */}
          {/* ======================================================================= */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* STAGE 1: Visa & Embassy Interview */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setCurrentStage('stage1_visa');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                  currentStage === 'stage1_visa'
                    ? 'bg-gradient-to-br from-amber-500/20 via-[#1f1938] to-[#120f26] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 opacity-75'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  currentStage === 'stage1_visa' ? 'bg-amber-500 text-stone-950 font-black' : 'bg-white/10 text-amber-300'
                }`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      STAGE 1
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">{stats.stage1Complete}%</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-white mt-1">
                    ভিসা ও এম্বাসি ইন্টারভিউ
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    ビザ・面接 • অধ্যক্ষ ও ভিসা ইন্টারভিউ ডিফেন্স
                  </p>
                </div>
              </button>

              {/* STAGE 2: Workplace & Conbini Register Training */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setCurrentStage('stage2_workplace');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                  currentStage === 'stage2_workplace'
                    ? 'bg-gradient-to-br from-rose-500/20 via-[#26172e] to-[#120f26] border-rose-500 shadow-xl ring-1 ring-rose-500/50'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 opacity-75'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  currentStage === 'stage2_workplace' ? 'bg-rose-500 text-white font-black' : 'bg-white/10 text-rose-300'
                }`}>
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                      STAGE 2
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">{stats.stage2Complete}%</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-white mt-1">
                    কর্মক্ষেত্র ও কনবিনি ট্রেনিং
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    職場・実務 • 7-Eleven ক্যাশিয়ার ও কেইগো
                  </p>
                </div>
              </button>

              {/* STAGE 3: Japan Living Survival */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playButtonTap();
                  setCurrentStage('stage3_living');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                  currentStage === 'stage3_living'
                    ? 'bg-gradient-to-br from-emerald-500/20 via-[#132422] to-[#0e171b] border-emerald-500 shadow-xl ring-1 ring-emerald-500/50'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 opacity-75'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  currentStage === 'stage3_living' ? 'bg-emerald-500 text-stone-950 font-black' : 'bg-white/10 text-emerald-300'
                }`}>
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      STAGE 3
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">{stats.stage3Complete}%</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-white mt-1">
                    জাপান লিভিং সারভাইভাল
                  </h3>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    生活・役所 • সিটি হল, ব্যাংক ও আবর্জনা নিয়ম
                  </p>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: VISA & EMBASSY INTERVIEW SIMULATION                             */}
        {/* ========================================================================= */}
        {currentStage === 'stage1_visa' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#110e24] p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-mono">STAGE 1 টুলস:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStage1Tool('interview')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      stage1Tool === 'interview' ? 'bg-amber-500 text-stone-950' : 'bg-white/[0.06] text-stone-300 hover:text-white'
                    }`}
                  >
                    🎙️ ইন্টারভিউ ডিফেন্স ল্যাব
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tool('rirekisho')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      stage1Tool === 'rirekisho' ? 'bg-amber-500 text-stone-950' : 'bg-white/[0.06] text-stone-300 hover:text-white'
                    }`}
                  >
                    📝 JIS日本標準 履歴書
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tool('keirekisho')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      stage1Tool === 'keirekisho' ? 'bg-amber-500 text-stone-950' : 'bg-white/[0.06] text-stone-300 hover:text-white'
                    }`}
                  >
                    💼 職務経歴書 (Shokumu)
                  </button>
                </div>
              </div>

              <span className="text-[11px] text-stone-400 font-mono">
                মডেল: Yamada Principal (Tokyo International Academy)
              </span>
            </div>

            {stage1Tool === 'interview' && (
              <InterviewVoiceTwinLab scenario={DEFAULT_BAITO_SCENARIOS[0]} />
            )}
            {stage1Tool === 'rirekisho' && (
              <JisRirekishoStudio onNavigate={onNavigate} />
            )}
            {stage1Tool === 'keirekisho' && (
              <ShokumuKeirekishoStudio onNavigate={onNavigate} />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: WORKPLACE & CONBINI REGISTER TRAINING                           */}
        {/* ========================================================================= */}
        {currentStage === 'stage2_workplace' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#171026] p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-300 font-mono">STAGE 2 টুলস:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStage2Tool('pos_simulator')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      stage2Tool === 'pos_simulator' ? 'bg-rose-500 text-white' : 'bg-white/[0.06] text-stone-300 hover:text-white'
                    }`}
                  >
                    🏪 7-Eleven POS ক্যাশিয়ার সিমুলেটর
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage2Tool('pitch_lab')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      stage2Tool === 'pitch_lab' ? 'bg-rose-500 text-white' : 'bg-white/[0.06] text-stone-300 hover:text-white'
                    }`}
                  >
                    🌊 কাস্টমার কেইগো পিচ ল্যাব
                  </button>
                </div>
              </div>

              {/* Ambience audio controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>পরিবেশ সাউন্ড:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAmbientMode(ambientMode === 'conbini' ? 'off' : 'conbini')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    ambientMode === 'conbini' ? 'bg-rose-500 text-white' : 'bg-white/10 text-stone-300'
                  }`}
                >
                  🏪 কনবিনি চাইম
                </button>
              </div>
            </div>

            {stage2Tool === 'pos_simulator' && (
              <ConbiniPosCashierSimulator />
            )}
            {stage2Tool === 'pitch_lab' && (
              <VoiceTwinPitchLab />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: JAPAN LIVING SURVIVAL (City Hall, Yucho Bank, Garbage Rules)      */}
        {/* ========================================================================= */}
        {currentStage === 'stage3_living' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stage 3 Navigation Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STAGE3_LIVING_MODULES.map((mod) => {
                const Icon = mod.icon;
                const isSelected = stage3ModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playButtonTap();
                      setStage3ModuleId(mod.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500/20 to-[#122220] border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-stone-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-500 text-stone-950 font-black' : 'bg-white/10 text-emerald-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-japanese text-emerald-400 font-bold truncate">
                        {mod.titleJa}
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {mod.titleBn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stage 3 Active Module Interactive Workspace */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#11191c] via-[#0d1416] to-[#090e10] border border-emerald-500/30 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs text-emerald-400 font-japanese font-bold">
                    {activeStage3Module.titleJa}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {activeStage3Module.titleBn}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    speakJapanese(activeStage3Module.dialogueJa);
                    soundEffects.playButtonTap();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>কাউন্টার ডায়ালগ শুনুন</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                {activeStage3Module.description}
              </p>

              {/* Dialogue Box */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-emerald-500/30 space-y-2">
                <div className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                  বাস্তব কাউন্টার জাপানি বাক্য (Real Life Japanese Sentence):
                </div>
                <div className="text-base sm:text-lg font-bold text-white font-japanese">
                  {activeStage3Module.dialogueJa}
                </div>
                <div className="text-xs text-stone-300">
                  {activeStage3Module.dialogueBn}
                </div>
              </div>

              {/* Checklist & Essential Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>প্রয়োজনীয় কাগজপত্র ও আইটেম চেকলিস্ট</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {activeStage3Module.checklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-rose-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>জরুরি সারভাইভাল টিপস ও সতর্কতা</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {activeStage3Module.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-mono">
                  সারভাইভাল স্ট্যাটাস: <span className="text-emerald-400 font-bold">৮৮% সম্পন্ন</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playLessonCelebration();
                    alert('অভিনন্দন! আপনি এই মডিউলটির মূল বিষয়গুলো সম্পন্ন করেছেন।');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
                >
                  মডিউল সম্পন্ন মার্ক করুন ✓
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const NihomiWorkOsView = BaitoOsView;
export type { BaitoOsViewProps, BaitoOsViewProps as NihomiWorkOsViewProps };
