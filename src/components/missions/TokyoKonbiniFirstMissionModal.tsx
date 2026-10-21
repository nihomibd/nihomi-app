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
import { JAPAN_REAL_LIFE_SCENARIOS } from '../../data/japanRealLifeScenarios';
import { loadLearnerKnowledgeState, saveLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';

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

export const LEGACY_MISSION_ID_MAP: Record<string, string> = {
  tokyo_konbini_01: 'scenario_03_tokyo_konbini',
  train_station_02: 'scenario_02_train_station',
  restaurant_03: 'scenario_04_restaurant_cafe',
  self_intro_04: 'scenario_08_school_workplace',
  daily_life_05: 'scenario_07_shopping_payment'
};

export const REAL_LIFE_MISSIONS: MissionScenario[] = JAPAN_REAL_LIFE_SCENARIOS.map((pkg) => {
  const primaryDialogue = pkg.dialogue[0];
  const primaryExercise = pkg.exercises[0];
  // Extract a concise Bengali tag for navigation pill
  const tagBnShort = pkg.category === 'immigration' ? 'এয়ারপোর্ট'
    : pkg.category === 'transport' ? 'স্টেশন'
    : pkg.category === 'konbini' ? 'কনবিনি'
    : pkg.category === 'dining' ? 'রেস্তোরাঁ'
    : pkg.category === 'hotel' ? 'হোটেল'
    : pkg.category === 'navigation' ? 'দিকনির্দেশনা'
    : pkg.category === 'shopping' ? 'শপিং'
    : pkg.category === 'workplace' ? 'কর্মক্ষেত্র'
    : pkg.category === 'medical' ? 'ফার্মেসি'
    : 'সিটি হল';

  return {
    id: pkg.id,
    num: pkg.scenarioNumber,
    tagJa: pkg.titleJa.length > 8 ? pkg.titleJa.slice(0, 8) : pkg.titleJa,
    tagBn: tagBnShort,
    badgeColor: pkg.badgeColor,
    titleBn: `Mission ${pkg.scenarioNumber}: ${pkg.titleBn}`,
    titleJa: pkg.titleJa,
    location: `${pkg.roles.locationName} (${pkg.roles.setting})`,
    speaker: pkg.roles.counterpartRole,
    dialogueJa: primaryDialogue.dialogueJa,
    dialogueRomaji: primaryDialogue.dialogueRomaji,
    dialogueBn: primaryDialogue.dialogueBn,
    questionPrompt: primaryExercise.questionPromptBn,
    senseiTipBn: primaryExercise.remediationTipBn,
    options: primaryExercise.options.map((opt) => ({
      id: opt.id,
      textJa: opt.textJa,
      romaji: opt.romaji,
      textBn: opt.textBn,
      isCorrect: opt.isCorrect,
      explanationBn: opt.explanationBn
    }))
  };
});

export interface KonbiniCashierStep {
  stepNumber: number;
  stepTitleBn: string;
  stepTitleJa: string;
  customerSpeechJa: string;
  customerSpeechRomaji: string;
  customerSpeechBn: string;
  questionPromptBn: string;
  options: {
    id: string;
    textJa: string;
    romaji: string;
    textBn: string;
    isCorrect: boolean;
    explanationBn: string;
  }[];
  senseiTipBn: string;
}

export const TOKYO_KONBINI_7_STEPS: KonbiniCashierStep[] = [
  {
    stepNumber: 1,
    stepTitleBn: 'ধাপ ১: কাউন্টারে আগমন ও ক্যাশিয়ার অভিবাদন',
    stepTitleJa: 'ステップ 1: お客様のご来店・レジへのご案内',
    customerSpeechJa: '「お願いします。」',
    customerSpeechRomaji: 'Onegai shimasu.',
    customerSpeechBn: 'গ্রাহক ওবেন্তো ও গ্রিন টি কাউন্টারে রেখে বললেন: "অনুগ্রহ করে দেখে দিন।"',
    questionPromptBn: 'ক্যাশিয়ার হিসেবে প্রথম সম্মানজনক অভিবাদন কোনটি দেবেন?',
    options: [
      {
        id: 'kstep1_opt1',
        textJa: 'いらっしゃいませ！',
        romaji: 'Irasshaimase!',
        textBn: 'স্বাগতম! (Welcome!)',
        isCorrect: true,
        explanationBn: 'জাপানের প্রতিটি দোকানে গ্রাহক কাউন্টারে আসা মাত্রই ক্যাশিয়ারের প্রথম বাক্য সর্বদা আন্তরিক "いらっしゃいませ！"।'
      },
      {
        id: 'kstep1_opt2',
        textJa: 'こんにちは、元気ですか？',
        romaji: 'Konnichiwa, genki desu ka?',
        textBn: 'হ্যালো, কেমন আছেন?',
        isCorrect: false,
        explanationBn: 'দোকানের ক্যাশিয়ার হিসেবে সাধারণ বন্ধুসুলভ অভিবাদন নয়, বরং সম্মানজনক "いらっしゃいませ！" বলতে হয়।'
      },
      {
        id: 'kstep1_opt3',
        textJa: 'どうぞ、座ってください。',
        romaji: 'Douzo, suwatte kudasai.',
        textBn: 'আসুন, বসুন।',
        isCorrect: false,
        explanationBn: 'কনবিনি কাউন্টারে গ্রাহককে বসতে বলা অপ্রাসঙ্গিক।'
      }
    ],
    senseiTipBn: 'জাপানের যেকোনো দোকানে গ্রাহক কাউন্টারে এলে প্রথম বাক্য সর্বদা স্পষ্ট ও আন্তরিক "いらっしゃいませ！"।'
  },
  {
    stepNumber: 2,
    stepTitleBn: 'ধাপ ২: পয়েন্ট কার্ড অনুসন্ধান (Point Card)',
    stepTitleJa: 'ステップ 2: ポイントカードのご確認',
    customerSpeechJa: '「いいえ、持っていません。」',
    customerSpeechRomaji: 'Iie, motte imasen.',
    customerSpeechBn: 'গ্রাহক উত্তর দিলেন: "না, আমার পয়েন্ট কার্ড নেই।"',
    questionPromptBn: 'গ্রাহকের পয়েন্ট কার্ড আছে কি না তা ভদ্রভাবে কীভাবে জানতে চাইবেন?',
    options: [
      {
        id: 'kstep2_opt1',
        textJa: 'ポイントカードはお持ちですか？',
        romaji: 'Pointo kaado wa o-mochi desu ka?',
        textBn: 'আপনার কি পয়েন্ট কার্ড আছে?',
        isCorrect: true,
        explanationBn: '持つ (রাখা/থাকা) এর অতি-ভদ্র সোনকেইগো (Sonkeigo) রূপ হলো "お持ちですか"।'
      },
      {
        id: 'kstep2_opt2',
        textJa: 'ポイントカードをください。',
        romaji: 'Pointo kaado o kudasai.',
        textBn: 'পয়েন্ট কার্ড দিন।',
        isCorrect: false,
        explanationBn: 'গ্রাহক থেকে জোর করে কার্ড চাওয়া যায় না, আছে কি না তা "お持ちですか" বলে বিনম্রভাবে জানতে হয়।'
      },
      {
        id: 'kstep2_opt3',
        textJa: 'カードにお金が入っていますか？',
        romaji: 'Kaado ni okane ga haitte imasu ka?',
        textBn: 'কার্ডে কি টাকা আছে?',
        isCorrect: false,
        explanationBn: 'এটি অপ্রাসঙ্গিক ও অমার্জিত ভাষা।'
      }
    ],
    senseiTipBn: 'গ্রাহক "持っていません" বললে ক্যাশিয়ার হাসিমুখে "かしこまりました" (বুঝেছি) বলে স্ক্যান চালিয়ে যাবেন।'
  },
  {
    stepNumber: 3,
    stepTitleBn: 'ধাপ ৩: ওবেন্তো গরম করার প্রস্তাব (Food Heating)',
    stepTitleJa: 'ステップ 3: お弁当の温め確認',
    customerSpeechJa: '「はい、温めてください。」',
    customerSpeechRomaji: 'Hai, atatamete kudasai.',
    customerSpeechBn: 'গ্রাহক উত্তর দিলেন: "হ্যাঁ, দয়া করে একটু গরম করে দিন।"',
    questionPromptBn: 'গ্রাহকের বেন্টোটি মাইক্রোওয়েভে গরম করে দিতে ভদ্রভাবে কী বলবেন?',
    options: [
      {
        id: 'kstep3_opt1',
        textJa: 'お弁当、温めますか？',
        romaji: 'Obentou, atatamemasu ka?',
        textBn: 'বেন্টো কি গরম করে দেব?',
        isCorrect: true,
        explanationBn: '温める (atatameru) মানে গরম করা। গ্রাহকের খাবারের সম্মানে "お" যোগ করে "お弁当" বলা হয়।'
      },
      {
        id: 'kstep3_opt2',
        textJa: 'お弁当は熱いですか？',
        romaji: 'Obentou wa atsui desu ka?',
        textBn: 'বেন্টোটি কি গরম?',
        isCorrect: false,
        explanationBn: 'এর অর্থ "বেন্টোটি কি গরম?", গরম করে দেবেন কি না তা বোঝায় না।'
      },
      {
        id: 'kstep3_opt3',
        textJa: '自分で温めてください。',
        romaji: 'Jibun de atatamete kudasai.',
        textBn: 'নিজে গরম করে নিন।',
        isCorrect: false,
        explanationBn: 'গ্রাহককে নিজে গরম করতে বলা জাপানি কনবিনিতে চরম অভদ্রতা।'
      }
    ],
    senseiTipBn: 'গ্রাহক সম্মতি দিলে ক্যাশিয়ার বলবেন: "かしこまりました。少々お待ちください" এবং ওভেন চালু করবেন।'
  },
  {
    stepNumber: 4,
    stepTitleBn: 'ধাপ ৪: প্লাস্টিক ব্যাগের প্রয়োজনীয়তা যাচাই (Shopping Bag)',
    stepTitleJa: 'ステップ 4: レジ袋のご利用確認',
    customerSpeechJa: '「はい、1枚お願いします。」',
    customerSpeechRomaji: 'Hai, ichimai onegai shimasu.',
    customerSpeechBn: 'গ্রাহক উত্তর দিলেন: "হ্যাঁ, ১টি ব্যাগ দিন।" (ব্যাগ ফি ৩ ইয়েন)',
    questionPromptBn: 'শপিং ব্যাগ লাগবে কি না তা গ্রাহককে কীভাবে ভদ্রভাবে জিজ্ঞাসা করবেন?',
    options: [
      {
        id: 'kstep4_opt1',
        textJa: 'レジ袋はご利用になりますか？',
        romaji: 'Rejibukuro wa go-riyou ni narimasu ka?',
        textBn: 'শপিং ব্যাগ কি প্রয়োজন হবে?',
        isCorrect: true,
        explanationBn: '利用する (ব্যবহার করা) এর সোনকেইগো রূপ হলো "ご利用になりますか"।'
      },
      {
        id: 'kstep4_opt2',
        textJa: '袋を買わないとダメです。',
        romaji: 'Fukuro o kawanai to dame desu.',
        textBn: 'ব্যাগ না কিনলে চলবে না।',
        isCorrect: false,
        explanationBn: 'কাউকে জোর করা জাপানি কেইগোর পরিপন্থী।'
      },
      {
        id: 'kstep4_opt3',
        textJa: 'カバンを持っていますか？',
        romaji: 'Kaban o motte imasu ka?',
        textBn: 'আপনার কি নিজস্ব ব্যাগ আছে?',
        isCorrect: false,
        explanationBn: 'গ্রাহকের ব্যক্তিগত ব্যাগ নিয়ে জিজ্ঞাসা করা সঠিক সৌজন্য নয়।'
      }
    ],
    senseiTipBn: 'জাপানে ২০২০ সাল থেকে প্লাস্টিক ব্যাগের জন্য ফি (সাধারণত ৩-৫ ইয়েন) প্রযোজ্য।'
  },
  {
    stepNumber: 5,
    stepTitleBn: 'ধাপ ৫: মোট বিল ও পেমেন্ট গ্রহণ (Payment Tender)',
    stepTitleJa: 'ステップ 5: お会計・お預かり',
    customerSpeechJa: '「1,000円からでお願いします。」',
    customerSpeechRomaji: 'Sen-en kara de onegai shimasu.',
    customerSpeechBn: 'মোট বিল ৬৫৩円। গ্রাহক ১,০০০ ইয়েনের একটি নোট দিয়ে বললেন: "১০০০ ইয়েন থেকে নিন।"',
    questionPromptBn: 'গ্রাহক থেকে ১,০০০ ইয়েন গ্রহণ করার সময় ক্যাশিয়ারের সঠিক জাপানি বাক্য কোনটি?',
    options: [
      {
        id: 'kstep5_opt1',
        textJa: '1,000円お預かりいたします。',
        romaji: 'Sen-en o-azukari itashimasu.',
        textBn: '১,০০০ ইয়েন (হিফাজতে/ভাংতি ফেরত দেওয়ার জন্য) গ্রহণ করলাম।',
        isCorrect: true,
        explanationBn: 'জাপানে ভাংতি ফেরত দেওয়ার সুযোগ থাকলে সবসময় "お預かりいたします" বলতে হয়!'
      },
      {
        id: 'kstep5_opt2',
        textJa: '1,000円いただきます。',
        romaji: 'Sen-en itadakimasu.',
        textBn: '১,০০০ ইয়েন পুরোপুরি গ্রহণ করলাম।',
        isCorrect: false,
        explanationBn: 'ভাংতি ফেরত দিতে হলে "いただきます" বলা ভুল! বলতে হবে "お預かりいたします"।'
      },
      {
        id: 'kstep5_opt3',
        textJa: '1,000円をもらいました。',
        romaji: 'Sen-en o moraimashita.',
        textBn: '১,০০০ ইয়েন পেলাম।',
        isCorrect: false,
        explanationBn: 'সাধারণ ইনফরমাল ভাষা, দোকানের কাস্টমার সার্ভিসে সম্পূর্ণ নিষিদ্ধ।'
      }
    ],
    senseiTipBn: 'জাপানি কাস্টমার সার্ভিসের মৌলিক আইন: ক্যাশিয়ার সবসময় "お預かりいたします" বলবেন।'
  },
  {
    stepNumber: 6,
    stepTitleBn: 'ধাপ ৬: ভাংতি টাকা ও রসিদ ফেরত (Change & Receipt)',
    stepTitleJa: 'ステップ 6: お釣りとレシートのお返し',
    customerSpeechJa: '「どうも、ありがとう。」',
    customerSpeechRomaji: 'Doumo, arigatou.',
    customerSpeechBn: 'হিসাব: ১,০০০円 - ৬৫৩円 = ৩৪৭円 ভাংতি। গ্রাহক অপেক্ষা করছেন।',
    questionPromptBn: 'গ্রাহককে ৩৪৭ ইয়েন ভাংতি ও রসিদ ফেরত দেওয়ার সময় কী বলবেন?',
    options: [
      {
        id: 'kstep6_opt1',
        textJa: '347円のお釣りと、レシートのお返しです。',
        romaji: 'Sanbyaku yonjuunana-en no otsuri to, reshiito no okaeshi desu.',
        textBn: '৩৪৭ ইয়েন ভাংতি এবং রসিদ ফেরত দেওয়া হলো।',
        isCorrect: true,
        explanationBn: 'ভাংতি টাকাকে "お釣り (otsuri)" এবং রসিদকে "レシート (reshiito)" বলা হয়।'
      },
      {
        id: 'kstep6_opt2',
        textJa: 'お金が余ったので持って帰ってください。',
        romaji: 'Okane ga amatta node motte kaette kudasai.',
        textBn: 'টাকা বেশি ছিল তাই নিয়ে যান।',
        isCorrect: false,
        explanationBn: 'অশোভন ও অমার্জিত ভাষা।'
      },
      {
        id: 'kstep6_opt3',
        textJa: 'お釣りはありません。',
        romaji: 'Otsuri wa arimasen.',
        textBn: 'কোনো ভাংতি নেই।',
        isCorrect: false,
        explanationBn: 'ভাংতি টাকা অবশ্যই সঠিক অঙ্কে গণনা করে বুঝিয়ে দিতে হবে।'
      }
    ],
    senseiTipBn: 'টাকা ফেরত দেওয়ার সময় কয়েনগুলো ট্রেতে বা গ্রাহকের হাতের তালুর নিচে দুই হাত দিয়ে সম্মান প্রদর্শন করে দেওয়া হয়।'
  },
  {
    stepNumber: 7,
    stepTitleBn: 'ধাপ ৭: বিদায় সম্ভাষণ ও ধন্যবাদ (Customer Farewell)',
    stepTitleJa: 'ステップ 7: お見送り・感謝の挨拶',
    customerSpeechJa: '（商品を受け取って会釈して帰られます）',
    customerSpeechRomaji: '(Shouhin o uketotte eshaku shite kaeraremasu)',
    customerSpeechBn: 'গ্রাহক পণ্য ও ভাংতি গ্রহণ করে মাথা সামান্য ঝুঁকিয়ে চলে যাচ্ছেন।',
    questionPromptBn: 'গ্রাহক চলে যাওয়ার সময় ক্যাশিয়ারের বিদায় অভিবাদন বাক্য কোনটি?',
    options: [
      {
        id: 'kstep7_opt1',
        textJa: 'ありがとうございました！またお越しくださいませ。',
        romaji: 'Arigatou gozaimashita! Mata okoshi kudasaimase.',
        textBn: 'অনেক ধন্যবাদ! আবার আসবেন।',
        isCorrect: true,
        explanationBn: 'জাপানি কাস্টমার সার্ভিসের ক্লাসিক সমাপ্তি হলো আন্তরিক অতীতকালের ধন্যবাদ ও পুনরায় আগমনের সাদর আমন্ত্রণ।'
      },
      {
        id: 'kstep7_opt2',
        textJa: 'さようなら、バイバイ！',
        romaji: 'Sayounara, baibai!',
        textBn: 'বিদায়, বাই বাই!',
        isCorrect: false,
        explanationBn: 'ক্যাশিয়ার কখনো গ্রাহককে "সায়োনরা" বা "বাই বাই" বলেন না।'
      },
      {
        id: 'kstep7_opt3',
        textJa: '気をつけて帰ってください。',
        romaji: 'Ki o tsukete kaette kudasai.',
        textBn: 'সাবধানে বাড়ি ফিরুন।',
        isCorrect: false,
        explanationBn: 'এটি বন্ধুদের ক্ষেত্রে প্রযোজ্য, দোকানে কাস্টমার সার্ভিসের স্ট্যান্ডার্ড অভিবাদন নয়।'
      }
    ],
    senseiTipBn: 'পূর্ণ লেনদেন সমাপ্ত হলে নম্রভাবে ৩০ ডিগ্রি মাথা ঝুঁকিয়ে "ありがとうございました！またお越しくださいませ" বলতে হয়।'
  }
];

export interface TokyoKonbiniFirstMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  initialMissionId?: string;
}

export const TokyoKonbiniFirstMissionModal: React.FC<TokyoKonbiniFirstMissionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onNavigate,
  initialMissionId = 'scenario_03_tokyo_konbini'
}) => {
  const resolveMissionId = (id: string): string => {
    return LEGACY_MISSION_ID_MAP[id] || id;
  };

  const [activeMissionId, setActiveMissionId] = useState<string>(resolveMissionId(initialMissionId));
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [konbiniStepIndex, setKonbiniStepIndex] = useState<number>(0);

  const isKonbiniMission =
    activeMissionId === 'scenario_03_tokyo_konbini' ||
    activeMissionId === 'tokyo_konbini_01';

  useEffect(() => {
    if (initialMissionId) {
      setActiveMissionId(resolveMissionId(initialMissionId));
      setSelectedOption(null);
      setIsEvaluated(false);
      setIsCompleted(false);
      setKonbiniStepIndex(0);
    }
  }, [initialMissionId, isOpen]);

  if (!isOpen) return null;

  const currentMission =
    REAL_LIFE_MISSIONS.find((m) => m.id === activeMissionId) ||
    REAL_LIFE_MISSIONS.find((m) => m.id === resolveMissionId(activeMissionId)) ||
    REAL_LIFE_MISSIONS[0];

  const currentKonbiniStep = TOKYO_KONBINI_7_STEPS[konbiniStepIndex] || TOKYO_KONBINI_7_STEPS[0];

  const playClerkGreeting = () => {
    soundEffects.playButtonClick();
    if (isKonbiniMission) {
      speakJapanese(currentKonbiniStep.customerSpeechJa);
    } else {
      speakJapanese(currentMission.dialogueJa);
    }
  };

  const handleSelect = (id: string, textJa: string) => {
    if (isCompleted) return;
    setSelectedOption(id);
    setIsEvaluated(true);
    soundEffects.playButtonClick();
    speakJapanese(textJa);

    if (isKonbiniMission) {
      const chosen = currentKonbiniStep.options.find((o) => o.id === id);
      if (chosen?.isCorrect) {
        soundEffects.playCorrect();
        setTimeout(() => {
          if (konbiniStepIndex < TOKYO_KONBINI_7_STEPS.length - 1) {
            setKonbiniStepIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsEvaluated(false);
          } else {
            // Completed all 7 steps!
            setIsCompleted(true);
            triggerCelebrationConfetti();
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(`nihomi_mission_${currentMission.id}_completed`, 'true');
                localStorage.setItem('nihomi_mission_scenario_03_tokyo_konbini_completed', 'true');
                localStorage.setItem('nihomi_mission_konbini_completed', 'true');
                localStorage.setItem('nihomi_mission_tokyo_konbini_01_completed', 'true');
                const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
                localStorage.setItem('nihomi_student_xp', (prevXp + 50).toString());
                const kState = loadLearnerKnowledgeState();
                if (!kState.masteredSkills.includes('konbini_mission_1')) {
                  kState.masteredSkills.push('konbini_mission_1');
                  saveLearnerKnowledgeState(kState);
                }
                window.dispatchEvent(new CustomEvent('nihomi:progress-updated'));
              }
            } catch {}
            trackNihomiEvent('mission_completed', {
              missionId: currentMission.id,
              konbiniStepsCompleted: 7,
              score: 100
            });
          }
        }, 1100);
      } else {
        soundEffects.playWrong();
      }
      return;
    }

    const chosen = currentMission.options.find((o) => o.id === id);

    if (chosen?.isCorrect) {
      soundEffects.playCorrect();
      setTimeout(() => {
        setIsCompleted(true);
        triggerCelebrationConfetti();
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`nihomi_mission_${currentMission.id}_completed`, 'true');
            if (currentMission.id === 'scenario_03_tokyo_konbini' || currentMission.id === 'tokyo_konbini_01') {
              localStorage.setItem('nihomi_mission_konbini_completed', 'true');
              localStorage.setItem('nihomi_mission_tokyo_konbini_01_completed', 'true');
              const kState = loadLearnerKnowledgeState();
              if (!kState.masteredSkills.includes('konbini_mission_1')) {
                kState.masteredSkills.push('konbini_mission_1');
                saveLearnerKnowledgeState(kState);
              }
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
    setActiveMissionId(resolveMissionId(missionId));
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCompleted(false);
    setKonbiniStepIndex(0);
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
    onComplete?.();
    onClose();
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const isMissionDone = (id: string): boolean => {
    if (typeof window === 'undefined') return false;
    const resolvedId = resolveMissionId(id);
    return (
      localStorage.getItem(`nihomi_mission_${id}_completed`) === 'true' ||
      localStorage.getItem(`nihomi_mission_${resolvedId}_completed`) === 'true' ||
      ((id === 'scenario_03_tokyo_konbini' || id === 'tokyo_konbini_01') &&
        localStorage.getItem('nihomi_mission_konbini_completed') === 'true')
    );
  };

  const activeLocation = isKonbiniMission ? 'Tokyo Konbini Counter (新宿駅前店)' : currentMission.location;
  const activeSpeaker = isKonbiniMission ? 'কাস্টমার / কাউন্টার পরিস্থিতি' : currentMission.speaker;
  const activeDialogueJa = isKonbiniMission ? currentKonbiniStep.customerSpeechJa : currentMission.dialogueJa;
  const activeDialogueRomaji = isKonbiniMission ? currentKonbiniStep.customerSpeechRomaji : currentMission.dialogueRomaji;
  const activeDialogueBn = isKonbiniMission ? currentKonbiniStep.customerSpeechBn : currentMission.dialogueBn;
  const activePrompt = isKonbiniMission ? currentKonbiniStep.questionPromptBn : currentMission.questionPrompt;
  const activeOptions = isKonbiniMission ? currentKonbiniStep.options : currentMission.options;
  const activeExplanation = isKonbiniMission
    ? (currentKonbiniStep.options.find(o => o.id === selectedOption)?.explanationBn || currentKonbiniStep.senseiTipBn)
    : (currentMission.options.find(o => o.id === selectedOption)?.explanationBn || currentMission.senseiTipBn);

  return (
    <div id="tokyo-konbini-mission-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d0d1a] border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-8 text-white my-auto max-h-[92vh] overflow-y-auto">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Tabs */}
        <div className="space-y-4 mb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                ১০টি বাস্তব জাপান মিশন • 10 REAL-LIFE SCENARIO SIMULATORS
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
            {/* 7-Step Progress Gauge for Konbini */}
            {isKonbiniMission && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                  <span>🏪 কনবিনি ক্যাশিয়ার সিমুলেশন — {currentKonbiniStep.stepTitleBn}</span>
                  <span>{konbiniStepIndex + 1} / 7</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${((konbiniStepIndex + 1) / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Scene Setting Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#181a2e] to-[#121324] border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>{activeLocation}</span>
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
                  {activeSpeaker} আপনাকে বললেন:
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  「{activeDialogueJa}」
                </div>
                <div className="text-xs text-amber-200/90 font-mono">
                  ({activeDialogueRomaji})
                </div>
                <div className="text-xs text-stone-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  অর্থ: <span className="font-semibold text-white">"{activeDialogueBn}"</span>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                তোমার করণীয়:
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {activePrompt}
              </h3>
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
              {activeOptions.map((opt) => {
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

            {/* Constitutional Patient Failure Recovery */}
            {isEvaluated && selectedOption && !activeOptions.find(o => o.id === selectedOption)?.isCorrect && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2 animate-in fade-in flex items-start gap-3.5">
                <img
                  src="/brand/nomi/nomi-guide.png"
                  alt="Nomi Guide"
                  className="w-10 h-10 rounded-full border border-amber-500/50 object-cover bg-[#F6F0E6] shrink-0 mt-0.5"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>কোনো চিন্তা নেই! ভুল হওয়াই শেখার স্বাভাবিক অংশ 🌸</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    {activeExplanation}
                  </p>
                  <button
                    type="button"
                    id="konbini-retry-btn"
                    onClick={() => {
                      setIsEvaluated(false);
                      setSelectedOption(null);
                    }}
                    className="mt-1 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>আবার সহজ করে চেষ্টা করি (Try Again)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* COMPLETION CELEBRATION SCREEN */
          <div className="space-y-6 text-center relative z-10 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 p-0.5 mx-auto shadow-2xl shadow-emerald-500/30">
                <img
                  src="/brand/nomi/nomi-celebrate.png"
                  alt="Nomi Celebrate"
                  className="w-full h-full object-cover rounded-[22px] bg-[#F6F0E6]"
                />
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
              💡 <strong>নমি সেন্সেই টিপ:</strong> {currentMission.senseiTipBn}
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
