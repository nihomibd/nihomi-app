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
  TrendingUp
} from 'lucide-react';
import { BaitoScenarioItem, BaitoScenarioType } from '../types';
import { ConbiniPosCashierSimulator } from '../components/simulation/ConbiniPosCashierSimulator';
import { InterviewVoiceTwinLab } from '../components/simulation/InterviewVoiceTwinLab';
import { JisRirekishoStudio } from '../components/simulation/JisRirekishoStudio';
import { VoiceTwinPitchLab } from '../components/simulation/VoiceTwinPitchLab';
import { soundEffects } from '../lib/soundEffects';

// Built-in Tokyo Relocation Simulation Scenarios (Zero-lag Hydration & Edge Compatible)
export const DEFAULT_BAITO_SCENARIOS: BaitoScenarioItem[] = [
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
    contextDescription: 'Conbini shifts are the #1 entry-level student job in Tokyo (28 hrs/week). Accuracy and swift polite Japanese are essential to keep customer lines moving.',
    keyVocabulary: [
      { ja: 'いらっしゃいませ', kana: 'いらっしゃいませ', meaningBn: 'স্বাগতম', meaningEn: 'Welcome' },
      { ja: '温める', kana: 'あたためる', meaningBn: 'গরম করা (মাইক্রোওয়েভ)', meaningEn: 'To heat up' },
      { ja: 'ポイントカード', kana: 'ぽいんとかーど', meaningBn: 'পয়েন্ট কার্ড', meaningEn: 'Point Card' },
      { ja: '袋', kana: 'ふくろ', meaningBn: 'প্লাস্টিক ব্যাগ', meaningEn: 'Plastic Bag' },
      { ja: 'お箸', kana: 'おはし', meaningBn: 'চপস্টিকস', meaningEn: 'Chopsticks' },
      { ja: '少々お待ちください', kana: 'しょうしょうおまちください', meaningBn: 'একটু অপেক্ষা করুন', meaningEn: 'Please wait a moment' },
      { ja: 'お預かりいたします', kana: 'おあずかりいたします', meaningBn: 'টাকা গ্রহণ করছি', meaningEn: 'I receive (money)' },
      { ja: 'ありがとうございました', kana: 'ありがとうございました', meaningBn: 'ধন্যবাদ (বিদায়)', meaningEn: 'Thank you very much' }
    ]
  },
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
    contextDescription: 'Language school admission panels look for sincere motivation, discipline, clear financial guarantees, and polite posture.',
    keyVocabulary: [
      { ja: '志望動機', kana: 'しぼうどうき', meaningBn: 'আবেদনের কারণ/উদ্দেশ্য', meaningEn: 'Motivation for applying' },
      { ja: '専門分野', kana: 'せんもんぶんや', meaningBn: 'বিশেষায়িত ক্ষেত্র', meaningEn: 'Specialized field' },
      { ja: '将来の夢', kana: 'しょうらいのゆめ', meaningBn: 'ভবিষ্যতের স্বপ্ন', meaningEn: 'Future dream' },
      { ja: '学費', kana: 'がくひ', meaningBn: 'পড়াশোনার খরচ', meaningEn: 'Tuition fees' }
    ]
  },
  {
    id: 'sc-restaurant-izakaya',
    type: 'restaurant_izakaya',
    title: 'Izakaya & Ramen Shop Hall Staff',
    titleJa: '居酒屋・ラーメン店ホール接客・オーダー取り',
    titleBn: 'ইজাকায়া ও রেস্তোরাঁ হল স্টাফ সার্ভিস',
    subtitle: 'Master loud, energetic Japanese greetings, beer serving, and special dietary requests.',
    difficulty: 'N4',
    location: 'Torikizoku Shibuya Hachiko-mae Store',
    interlocutorName: 'Sato Store Leader (佐藤店長)',
    interlocutorRole: 'Izakaya Shift Leader & Regular Patrons',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'すみません！生ビール2つと焼き鳥盛り合わせ、あと枝豆をお願いします！',
      romaji: 'Sumimasen! Namabiiru futatsu to yakitori moriawase, ato edamame o onegai shimasu!',
      bn: 'এক্সকিউজ মি! দুটি ড্রাফট বেভারেজ, ইয়াকিতোরি প্ল্যাটার এবং এদামামে দিন!',
      en: 'Excuse me! Two draft beers, an assortment of yakitori skewers, and edamame please!'
    },
    objectives: [
      'Respond instantly with Yorokonde! (喜んで！)',
      'Repeat table orders accurately (ご注文を繰り返します)',
      'Deliver dishes safely with Keigo (お待たせいたしました)',
      'Handle bill splitting (お会計は別々になさいますか？)'
    ],
    contextDescription: 'Izakaya dining is fast and lively. Staff must speak with brisk clarity, smile, and handle rapid drink orders.',
    keyVocabulary: [
      { ja: '喜んで', kana: 'よろこんで', meaningBn: 'আনন্দের সাথে (অবশ্যই)', meaningEn: 'With pleasure / Right away!' },
      { ja: 'ご注文', kana: 'ごちゅうもん', meaningBn: 'অর্ডার', meaningEn: 'Your order' },
      { ja: 'お待たせいたしました', kana: 'おまたせいたしました', meaningBn: 'অপেক্ষা করানোর জন্য দুঃখিত', meaningEn: 'Sorry to keep you waiting' },
      { ja: 'お会計', kana: 'おかいけい', meaningBn: 'বিল/হিসাব', meaningEn: 'Bill / Check' }
    ]
  }
];

interface BaitoOsViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const BaitoOsView: React.FC<BaitoOsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'pos_terminal' | 'interview_lab' | 'rirekisho' | 'pitch_lab'>('pos_terminal');
  const [scenarios, setScenarios] = useState<BaitoScenarioItem[]>(() => DEFAULT_BAITO_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sc-conbini-pos');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userReadinessStats, setUserReadinessStats] = useState({
    conbiniPassed: 12,
    interviewPassed: 4,
    rirekishoScore: 95,
    pitchAccentMastery: 88
  });

  // Fetch scenarios from API with 250ms hard failsafe timer
  useEffect(() => {
    let isMounted = true;
    const failsafeTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 250);

    fetch('/api/baito/scenarios')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
        }
      })
      .catch((err) => console.warn('[BaitoOsView] Using built-in simulation scenarios:', err))
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
          clearTimeout(failsafeTimer);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimer);
    };
  }, []);

  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleSelectScenario = (scenario: BaitoScenarioItem) => {
    soundEffects.playButtonTap();
    setSelectedScenarioId(scenario.id);

    if (scenario.type === 'conbini_pos') {
      setActiveTab('pos_terminal');
    } else {
      setActiveTab('interview_lab');
    }
  };

  return (
    <div id="baito-os-view" className="min-h-screen bg-slate-950 text-slate-100 pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner with Neo-Tokyo Aesthetic */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BaitoOS™ 2.0 & Tokyo Relocation Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
                バイト・面接・東京現地生活 <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-rose-400">
                  超実践型 3Dバーチャルシミュレーター
                </span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                コンビニPOSレジ操作・校長面接・ビザ審査・区役所手続き・JIS規格履歴書作成を本番同様に完全訓練。
                東京現地の即戦力として自信を持って飛び立ちましょう。
              </p>
            </div>

            {/* Quick Readiness Scorecard */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-inner">
              <div className="text-center p-3 rounded-xl bg-slate-900 border border-amber-500/20">
                <div className="text-xs text-slate-400 font-medium">バイト即戦力</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">96%</div>
                <div className="text-[10px] text-emerald-400">Ready for Shift</div>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-900 border border-cyan-500/20">
                <div className="text-xs text-slate-400 font-medium">ビザ・面接突破</div>
                <div className="text-xl font-black text-cyan-400 mt-0.5">92%</div>
                <div className="text-[10px] text-emerald-400">High Approval</div>
              </div>
            </div>
          </div>

          {/* Hub Navigation Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => {
                soundEffects.playButtonTap();
                setActiveTab('pos_terminal');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'pos_terminal'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>🏪 コンビニPOSレジ端末 (Conbini POS)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playButtonTap();
                setActiveTab('interview_lab');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'interview_lab'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>🎙️ 校長・大使館・バイト面接 (Interview Twin)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playButtonTap();
                setActiveTab('rirekisho');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'rirekisho'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📝 JIS日本標準 履歴書 (Rirekisho Studio)</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playButtonTap();
                setActiveTab('pitch_lab');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                activeTab === 'pitch_lab'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>🌊 東京ピッチアクセント波形ラボ (Pitch Lab)</span>
            </button>
          </div>
        </div>

        {/* Tokyo Relocation Scenario Selector Carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              東京現地シミュレーション シナリオ選択 (Select Relocation Scenario)
            </h2>
            <span className="text-xs text-slate-500 font-mono">全6シナリオ収録</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarios.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 group relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-amber-500 shadow-xl ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={sc.interlocutorAvatar}
                    alt={sc.interlocutorName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                        {sc.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400">{sc.location}</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-100 mt-1 truncate group-hover:text-amber-300 transition">
                      {sc.titleJa}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">{sc.titleBn}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Workspace based on Active Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'pos_terminal' && (
            <motion.div
              key="pos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ConbiniPosCashierSimulator />
            </motion.div>
          )}

          {activeTab === 'interview_lab' && currentScenario && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <InterviewVoiceTwinLab scenario={currentScenario} />
            </motion.div>
          )}

          {activeTab === 'rirekisho' && (
            <motion.div
              key="rirekisho"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <JisRirekishoStudio />
            </motion.div>
          )}

          {activeTab === 'pitch_lab' && (
            <motion.div
              key="pitch"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <VoiceTwinPitchLab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
