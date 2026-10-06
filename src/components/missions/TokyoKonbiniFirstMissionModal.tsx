// src/components/missions/TokyoKonbiniFirstMissionModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  X,
  Store,
  ArrowRight,
  Trophy,
  RotateCcw,
  ShoppingBag,
  Train,
  Utensils,
  UserCheck,
  ShoppingCart,
  Check,
  Award,
  Zap,
  Play
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { trackNihomiEvent } from '../../utils/analytics';

export interface MissionScenario {
  id: string;
  num: string;
  tagJa: string;
  tagBn: string;
  badgeColor: string;
  titleBn: string;
  titleJa: string;
  location: string;
  speaker: string;
  dialogueJa: string;
  dialogueRomaji: string;
  dialogueBn: string;
  questionPrompt: string;
  senseiTipBn: string;
  options: {
    id: string;
    textJa: string;
    romaji: string;
    textBn: string;
    isCorrect: boolean;
    explanationBn: string;
  }[];
}

export const REAL_LIFE_MISSIONS: MissionScenario[] = [
  {
    id: 'tokyo_konbini_01',
    num: '০১',
    tagJa: 'リアルコンビニ',
    tagBn: 'কনবিনি ক্যাশিয়ার',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    titleBn: 'Mission 01: Tokyo Konbini (কনবিনি ক্যাশিয়ার ও ব্যাগ চ্যালেঞ্জ)',
    titleJa: 'コンビニ会計・レジ袋対応',
    location: 'Seven-Eleven, Shinjuku 3-Chome, Tokyo',
    speaker: 'কনবিনি ক্যাশিয়ার (レジ店員)',
    dialogueJa: 'いらっしゃいませ！ レジ袋はご利用ですか？',
    dialogueRomaji: 'Irasshaimase! Reji-bukuro wa go-riyō desu ka?',
    dialogueBn: 'স্বাগতম! আপনি কি শপিং ব্যাগ নিতে চান?',
    questionPrompt: 'ক্যাশিয়ারের ব্যাগের প্রশ্নের জবাবে আপনি কী বলবেন?',
    senseiTipBn: "জাপানের কনবিনিতে ব্যাগ না লাগলে স্বাভাবিক ও বিনয়ীভাবে 「大丈夫です (Daijōbu desu)」বা 「袋はいりません」বলুন।",
    options: [
      {
        id: 'opt1',
        textJa: '大丈夫です、袋はいりません。',
        romaji: 'Daijōbu desu, fukuro wa irimasen.',
        textBn: 'ঠিক আছে, ব্যাগ লাগবে না। (প্রাকৃতিক জাপানিজ)',
        isCorrect: true,
        explanationBn: 'খুব সুন্দর ও স্বাভাবিক Tokyo কনবিনি এক্সপ্রেশন!'
      },
      {
        id: 'opt2',
        textJa: 'ありがとう、さようなら。',
        romaji: 'Arigatō, sayōnara.',
        textBn: 'ধন্যবাদ, বিদায়। (পরিস্থিতির সাথে মানানসই নয়)',
        isCorrect: false,
        explanationBn: 'ক্যাশিয়ারের প্রশ্নের উত্তর না দিয়ে বিদায় জানানো অপেশাদার।'
      },
      {
        id: 'opt3',
        textJa: 'はい、一枚お願いします。',
        romaji: 'Hai, ichimai onegaishimasu.',
        textBn: 'হ্যাঁ, একটি ব্যাগ দিন। (সঠিক ও ভদ্র)',
        isCorrect: true,
        explanationBn: 'বিনম্রভাবে ১টি ব্যাগ চাওয়ার সঠিক জাপানি রূপ।'
      }
    ]
  },
  {
    id: 'train_station_02',
    num: '০২',
    tagJa: '駅・改札口',
    tagBn: 'ট্রেন স্টেশন',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    titleBn: 'Mission 02: Train Station (টোকিও ট্রেন স্টেশন ও টিকিট কাউন্টার)',
    titleJa: 'JR駅ホーム・乗り換え確認',
    location: 'JR Shinjuku Station South Exit, Tokyo',
    speaker: 'স্টেশন কর্মকর্তা (駅員)',
    dialogueJa: 'ご案内いたします。どちらまで行かれますか？',
    dialogueRomaji: 'Go-annai itashimasu. Dochira made ikaremasu ka?',
    dialogueBn: 'আপনাকে কীভাবে সাহায্য করতে পারি? আপনি কোথায় যেতে চান?',
    questionPrompt: 'টোকিও স্টেশনের প্ল্যাটফর্ম জানতে বা সুইকা রিচার্জ করতে আপনি কী বলবেন?',
    senseiTipBn: "স্টেশনে ট্রেনের প্ল্যাটফর্ম জানতে সবসময় 「何番ホームですか？ (Nan-ban hoomu desu ka?)」বলুন।",
    options: [
      {
        id: 'opt1',
        textJa: 'すみません、東京駅行きの電車は何番ホームですか？',
        romaji: 'Sumimasen, Tōkyō-eki iki no densha wa nan-ban hōmu desu ka?',
        textBn: 'এক্সকিউজ মি, টোকিও স্টেশনগামী ট্রেন কত নম্বর প্ল্যাটফর্মে? (সেরা মান)',
        isCorrect: true,
        explanationBn: 'চমৎকার! শিষ্ট জাপানিজ দিয়ে যেকোনো প্ল্যাটফর্ম খুঁজে পাওয়ার সঠিক বাক্য।'
      },
      {
        id: 'opt2',
        textJa: '電車、どこですか？',
        romaji: 'Densha, doko desu ka?',
        textBn: 'ট্রেন কোথায়? (খুবই অসম্পূর্ণ ও বিভ্রান্তিকর)',
        isCorrect: false,
        explanationBn: 'নির্দিষ্ট গন্তব্য না বললে স্টেশন মাস্টার বুঝতে পারবেন না।'
      },
      {
        id: 'opt3',
        textJa: 'Suicaのチャージをお願いします。',
        romaji: 'Suica no chāji o onegaishimasu.',
        textBn: 'সুইকা কার্ড রিচার্জ করে দিন। (প্রয়োজনীয় ও সঠিক)',
        isCorrect: true,
        explanationBn: 'টোকিও সাবওয়েতে কার্ড রিচার্জের সবচেয়ে কাজের বাক্য।'
      }
    ]
  },
  {
    id: 'restaurant_03',
    num: '০৩',
    tagJa: 'レストラン・注文',
    tagBn: 'রেস্টুরেন্ট অর্ডার',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    titleBn: 'Mission 03: Restaurant & Dining (রেস্টুরেন্টে অর্ডার ও বিল পেমেন্ট)',
    titleJa: '居酒屋・ラーメン屋の注文',
    location: 'Ichiran Ramen, Shibuya, Tokyo',
    speaker: 'রেস্তোরাঁ ওয়েটার (店員)',
    dialogueJa: 'いらっしゃいませ！ご注文はお決まりですか？',
    dialogueRomaji: 'Irasshaimase! Go-chūmon wa o-kimari desu ka?',
    dialogueBn: 'স্বাগতম! আপনি কি খাবারের অর্ডার ঠিক করেছেন?',
    questionPrompt: 'মেনু দেখে ১টি রামেন অর্ডার দিতে বা খাওয়ার পর বিল পরিশোধ করতে কী বলবেন?',
    senseiTipBn: "খাবারের কাউন্টারে অর্ডার দেওয়ার সময় 「〜を一つお願いします」এবং বিল চাইতে 「お会計をお願いします」ব্যবহার করবেন।",
    options: [
      {
        id: 'opt1',
        textJa: 'はい、ラーメンを一つお願いします。',
        romaji: 'Hai, rāmen o hitotsu onegaishimasu.',
        textBn: 'হ্যাঁ, একটি রামেন দিন। (ভদ্র ও স্বাভাবিক)',
        isCorrect: true,
        explanationBn: 'নিখুঁত অর্ডার দেওয়ার বাক্য!'
      },
      {
        id: 'opt2',
        textJa: '早く持ってきて！',
        romaji: 'Hayaku motte kite!',
        textBn: 'তাড়াতাড়ি নিয়ে আসো! (খুবই অভদ্র ও আগ্রাসী)',
        isCorrect: false,
        explanationBn: 'জাপানি রেস্তোরাঁয় এমন কথা বলা অত্যন্ত অসৌজন্যমূলক।'
      },
      {
        id: 'opt3',
        textJa: 'ごちそうさまでした、お会計をお願いします。',
        romaji: 'Gochisōsama deshita, o-kaikei o onegaishimasu.',
        textBn: 'খাবার দারুণ ছিল, বিলটি তৈরি করে দিন। (আদর্শ জাপানি শিষ্টাচার)',
        isCorrect: true,
        explanationBn: 'খাবার শেষে কৃতজ্ঞতা জানিয়ে বিল পরিশোধের সর্বোত্তম কায়দা।'
      }
    ]
  },
  {
    id: 'self_intro_04',
    num: '০৪',
    tagJa: '自己紹介・面接',
    tagBn: 'আত্মপরিচয় ও জব',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    titleBn: 'Mission 04: Self Introduction (জাপানি কোম্পানিতে আত্মপরিচয় ও জিকোশোওকাই)',
    titleJa: '職場・アルバイト初日自己紹介',
    location: 'Tokyo Workplace / Office Briefing Room',
    speaker: 'স্টোর ম্যানেজার (店長)',
    dialogueJa: '初日ですね！みんなに自己紹介をお願いします。',
    dialogueRomaji: 'Shonichi desu ne! Minna ni jikoshōkai o onegaishimasu.',
    dialogueBn: 'আজ আপনার প্রথম দিন! সবার উদ্দেশ্যে নিজের পরিচয় দিন।',
    questionPrompt: 'জাপানি সহকর্মীদের সামনে বিনয়ী আত্মপরিচয় হিসেবে আপনি কী বলবেন?',
    senseiTipBn: "জাপানিজ জিকোশোওকাই-তে 「はじめまして」দিয়ে শুরু করে নিজের দেশ জানিয়ে শেষে 「どうぞよろしくお願いいたします」বলা আবশ্যক।",
    options: [
      {
        id: 'opt1',
        textJa: 'はじめまして。バングラデシュから参りました。どうぞよろしくお願いいたします！',
        romaji: 'Hajimemashite. Banguradoshu kara mairimashita. Dōzo yoroshiku onegaishimasu!',
        textBn: 'শুভ সূচনা। আমি বাংলাদেশ থেকে এসেছি। সবার সদয় সহযোগিতা কামনা করছি! (গোল্ড স্ট্যান্ডার্ড)',
        isCorrect: true,
        explanationBn: 'অসাধারণ! জাপানি ইন্টারভিউ ও চাকরির ফার্স্ট ডে-র জন্য ১০০% পারফেক্ট।'
      },
      {
        id: 'opt2',
        textJa: '私は外国人です。バイバイ。',
        romaji: 'Watashi wa gaikokujin desu. Bai-bai.',
        textBn: 'আমি বিদেশি। বাই বাই। (অনুপযুক্ত ও অনাকাঙ্ক্ষিত)',
        isCorrect: false,
        explanationBn: 'কর্পোরেট পরিবেশে এটি একেবারেই গ্রহণযোগ্য নয়।'
      },
      {
        id: 'opt3',
        textJa: 'はじめまして。一生懸命頑張りますので、よろしくお願いします！',
        romaji: 'Hajimemashite. Isshōkenmei gambarimasu node, yoroshiku onegaishimasu!',
        textBn: 'শুভ সূচনা। আমি সর্বোচ্চ নিষ্ঠা দিয়ে কাজ করব, সহযোগিতা আশা করছি!',
        isCorrect: true,
        explanationBn: 'কঠোর পরিশ্রমের ইতিবাচক মনোভাব জাপানিদের কাছে দারুণ প্রশংসনীয়।'
      }
    ]
  },
  {
    id: 'daily_life_05',
    num: '০৫',
    tagJa: 'スーパー・生活',
    tagBn: 'সুপারমার্কেট শপিং',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    titleBn: 'Mission 05: Daily Life & Supermarket (সুপারমার্কেট শপিং ও দৈনন্দিন শিফট)',
    titleJa: 'スーパー割引シール・生活レジ',
    location: 'Life Supermarket, Shinjuku, Tokyo',
    speaker: 'সুপারমার্কেট ক্যাশিয়ার (スーパー店員)',
    dialogueJa: 'ポイントカードはお持ちですか？お支払いはどうされますか？',
    dialogueRomaji: 'Pointo kādo wa o-mochi desu ka? O-shiharai wa dō saremasu ka?',
    dialogueBn: 'আপনার কি কোনো পয়েন্ট কার্ড আছে? আপনি কীভাবে বিল পরিশোধ করবেন?',
    questionPrompt: 'সুপারমার্কেট ক্যাশিয়ারের প্রশ্নের জবাবে আপনি কীভাবে সঠিক উত্তর দেবেন?',
    senseiTipBn: "পয়েন্ট কার্ড না থাকলে 「持っていません」বলুন এবং পেমেন্ট করতে 「クレジットカードで」বা 「現金で」ব্যবহার করুন।",
    options: [
      {
        id: 'opt1',
        textJa: '持っていません。クレジットカードで払えますか？',
        romaji: 'Motte imasen. Kurejitto kādo de haraemasu ka?',
        textBn: 'কার্ড নেই। ক্রেডিট কার্ডে কি বিল দেওয়া যাবে? (স্মার্ট উত্তর)',
        isCorrect: true,
        explanationBn: 'একদম পারফেক্ট! পয়েন্ট কার্ড নেই জানিয়ে পেমেন্ট মেথড নিশ্চিত করলেন।'
      },
      {
        id: 'opt2',
        textJa: '何もいらない！',
        romaji: 'Nanimo iranai!',
        textBn: 'কিছু লাগবে না! (অপ্রাসঙ্গিক)',
        isCorrect: false,
        explanationBn: 'ক্যাশিয়ার পেমেন্ট মেথড জানতে চেয়েছেন।'
      },
      {
        id: 'opt3',
        textJa: '大丈夫です、現金でお願いします。',
        romaji: 'Daijōbu desu, genkin de onegaishimasu.',
        textBn: 'কার্ড নেই, ক্যাশ টাকা দিয়ে দিচ্ছি। (ভদ্র ও প্রচলিত)',
        isCorrect: true,
        explanationBn: 'ক্যাশ পেমেন্টের জন্য অত্যন্ত সহজ ও কার্যকর বাক্য।'
      }
    ]
  }
];

export interface TokyoKonbiniFirstMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  initialMissionId?: string;
}

export const TokyoKonbiniFirstMissionModal: React.FC<TokyoKonbiniFirstMissionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onNavigate,
  initialMissionId = 'tokyo_konbini_01'
}) => {
  const [activeMissionId, setActiveMissionId] = useState<string>(initialMissionId);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (initialMissionId) {
      setActiveMissionId(initialMissionId);
      setSelectedOption(null);
      setIsEvaluated(false);
      setIsCompleted(false);
    }
  }, [initialMissionId, isOpen]);

  if (!isOpen) return null;

  const currentMission =
    REAL_LIFE_MISSIONS.find((m) => m.id === activeMissionId) || REAL_LIFE_MISSIONS[0];

  const playClerkGreeting = () => {
    soundEffects.playButtonClick();
    speakJapanese(currentMission.dialogueJa);
  };

  const handleSelect = (id: string, textJa: string) => {
    if (isCompleted) return;
    setSelectedOption(id);
    setIsEvaluated(true);
    soundEffects.playButtonClick();
    speakJapanese(textJa);

    const chosen = currentMission.options.find((o) => o.id === id);

    if (chosen?.isCorrect) {
      soundEffects.playCorrect();
      setTimeout(() => {
        setIsCompleted(true);
        triggerCelebrationConfetti();
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`nihomi_mission_${currentMission.id}_completed`, 'true');
            if (currentMission.id === 'tokyo_konbini_01') {
              localStorage.setItem('nihomi_mission_konbini_completed', 'true');
            }
            const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
            localStorage.setItem('nihomi_student_xp', (prevXp + 50).toString());
            window.dispatchEvent(new CustomEvent('nihomi:progress-updated'));
          }
        } catch {}
        trackNihomiEvent('mission_completed', {
          missionId: currentMission.id,
          choice: id,
          score: 100
        });
      }, 900);
    } else {
      soundEffects.playWrong();
    }
  };

  const handleSwitchMission = (missionId: string) => {
    soundEffects.playButtonClick();
    setActiveMissionId(missionId);
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCompleted(false);
  };

  const handleNextMission = () => {
    const currentIndex = REAL_LIFE_MISSIONS.findIndex((m) => m.id === currentMission.id);
    if (currentIndex < REAL_LIFE_MISSIONS.length - 1) {
      handleSwitchMission(REAL_LIFE_MISSIONS[currentIndex + 1].id);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onComplete();
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const isMissionDone = (id: string): boolean => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem(`nihomi_mission_${id}_completed`) === 'true' ||
      (id === 'tokyo_konbini_01' && localStorage.getItem('nihomi_mission_konbini_completed') === 'true')
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d0d1a] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 text-white my-auto overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Tabs */}
        <div className="space-y-4 mb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                ৫টি বাস্তব জাপান মিশন • REAL-LIFE SCENARIO SIMULATOR
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Mission Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {REAL_LIFE_MISSIONS.map((m) => {
              const active = m.id === currentMission.id;
              const completed = isMissionDone(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSwitchMission(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : completed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-white/5 text-stone-300 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>{m.num}</span>
                  <span className="truncate max-w-[90px] sm:max-w-none">{m.tagBn}</span>
                  {completed && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SCENARIO SCREEN */}
        {!isCompleted ? (
          <div className="space-y-5 relative z-10">
            {/* Scene Setting Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#181a2e] to-[#121324] border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>{currentMission.location}</span>
                </div>
                <button
                  type="button"
                  onClick={playClerkGreeting}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>শুনুন (Audio)</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-stone-400">
                  {currentMission.speaker} আপনাকে বললেন:
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  「{currentMission.dialogueJa}」
                </div>
                <div className="text-xs text-amber-200/90 font-mono">
                  ({currentMission.dialogueRomaji})
                </div>
                <div className="text-xs text-stone-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  অর্থ: <span className="font-semibold text-white">"{currentMission.dialogueBn}"</span>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                তোমার করণীয়:
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {currentMission.questionPrompt}
              </h3>
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
              {currentMission.options.map((opt) => {
                const isThisSelected = selectedOption === opt.id;
                let borderClass = 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]';
                if (isEvaluated && isThisSelected) {
                  borderClass = opt.isCorrect
                    ? 'border-emerald-500 bg-emerald-500/15 text-white'
                    : 'border-red-500 bg-red-500/15 text-white';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id, opt.textJa)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${borderClass}`}
                  >
                    <div>
                      <div className="font-bold text-sm sm:text-base text-white">{opt.textJa}</div>
                      <div className="text-xs text-stone-400 font-mono mt-0.5">{opt.romaji}</div>
                      <div className="text-xs text-stone-300 mt-1">{opt.textBn}</div>
                    </div>
                    {isEvaluated && isThisSelected && (
                      <div>
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bengali Feedback for wrong answer */}
            {isEvaluated && selectedOption && !currentMission.options.find(o => o.id === selectedOption)?.isCorrect && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1 animate-in fade-in">
                <span className="font-bold">পুনরায় চেষ্টা করো:</span>
                <p>
                  {currentMission.options.find(o => o.id === selectedOption)?.explanationBn || currentMission.senseiTipBn}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* COMPLETION CELEBRATION SCREEN */
          <div className="space-y-6 text-center relative z-10 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 p-0.5 mx-auto shadow-2xl shadow-emerald-500/30">
              <div className="w-full h-full bg-[#0d0d1a] rounded-[22px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                MISSION ACCOMPLISHED • {currentMission.tagBn}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Mission Complete! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                তুমি বাস্তব জাপানের একটি পরিস্থিতি সফলভাবে হ্যান্ডেল করেছো।
              </p>
            </div>

            {/* Achievement Perks */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-lg font-black text-amber-300 font-mono">+50 XP</div>
                <div className="text-[11px] text-stone-400 mt-0.5">অভিজ্ঞতা পয়েন্ট</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-lg font-black text-emerald-400 font-mono">+10%</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Japan Readiness™</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left text-xs text-amber-200/90 leading-relaxed max-w-md mx-auto">
              💡 <strong>নিহোমি সেনসেই টিপ:</strong> {currentMission.senseiTipBn}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={handleNextMission}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>পরবর্তী মিশন খেলুন →</span>
                <Play className="w-4 h-4 fill-white" />
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-stone-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>ড্যাশবোর্ডে ফিরে যাই</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokyoKonbiniFirstMissionModal;
