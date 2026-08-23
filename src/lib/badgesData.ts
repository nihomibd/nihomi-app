import { JLPTLevel } from '../types.js';

export interface MilestoneBadge {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  banglaDescription: string;
  category: 'JLPT' | 'Consistency' | 'Speaking' | 'Grammar' | 'Workplace';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
  iconName: string;
  targetValue: number;
  currentValue?: number;
  unit: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const ALL_BADGES: MilestoneBadge[] = [
  // Consistency & Streaks
  {
    id: 'badge-streak-7',
    title: '7-Day Fire Starter',
    titleJa: '七日間の炎',
    description: 'Maintained a consecutive 7-day Japanese study streak.',
    banglaDescription: 'টানা ৭ দিন জাপানি ভাষা অনুশীলনের স্ট্রিক বজায় রেখেছেন।',
    category: 'Consistency',
    rarity: 'Common',
    xpReward: 100,
    iconName: 'Flame',
    targetValue: 7,
    unit: 'days',
    isUnlocked: true,
    unlockedAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'badge-streak-30',
    title: '30-Day Zen Master',
    titleJa: '三十日間の禅',
    description: 'Studied Japanese every day for a full month without breaking the habit.',
    banglaDescription: 'পুরো এক মাস নিরবচ্ছিন্নভাবে প্রতিদিন জাপানি স্টাডি সম্পন্ন করেছেন।',
    category: 'Consistency',
    rarity: 'Rare',
    xpReward: 300,
    iconName: 'Sparkles',
    targetValue: 30,
    unit: 'days',
    isUnlocked: false
  },
  {
    id: 'badge-streak-50',
    title: '50-Day Ronin Warrior',
    titleJa: '五十日の浪人',
    description: 'Hit the prestigious 50-day consecutive study milestone.',
    banglaDescription: 'গর্বিত ৫০ দিনের ধারাবাহিক জাপানি ভাষা শিক্ষার মাইলফলক স্পর্শ করেছেন।',
    category: 'Consistency',
    rarity: 'Epic',
    xpReward: 600,
    iconName: 'Award',
    targetValue: 50,
    unit: 'days',
    isUnlocked: false
  },
  {
    id: 'badge-streak-100',
    title: '100-Day Shogun Master',
    titleJa: '百日の将軍',
    description: 'A legendary 100 days of daily Japanese practice.',
    banglaDescription: '১০০ দিনের কিংবদন্তিতুল্য ধারাবাহিক জাপানি ভাষার অনুশীলন।',
    category: 'Consistency',
    rarity: 'Legendary',
    xpReward: 1500,
    iconName: 'Crown',
    targetValue: 100,
    unit: 'days',
    isUnlocked: false
  },

  // JLPT Curriculum
  {
    id: 'badge-n5-complete',
    title: 'JLPT N5 Foundation Conquered',
    titleJa: 'N5 基礎制覇',
    description: 'Completed all 25 Minna no Nihongo N5 curriculum modules.',
    banglaDescription: 'মিন্না নো নিহোঙ্গো N5 এর সম্পূর্ণ ২৫টি লেসন সফলভাবে সম্পন্ন করেছেন।',
    category: 'JLPT',
    rarity: 'Epic',
    xpReward: 500,
    iconName: 'GraduationCap',
    targetValue: 25,
    unit: 'lessons',
    isUnlocked: false
  },
  {
    id: 'badge-kanji-50',
    title: 'Kanji Apprentice (50 Characters)',
    titleJa: '漢字見習い',
    description: 'Mastered 50 essential JLPT N5 Kanji in the flashcard bank.',
    banglaDescription: '৫০টি মৌলিক কাঞ্জির অর্থ ও উচ্চারণ নির্ভুলভাবে আয়ত্ত করেছেন।',
    category: 'JLPT',
    rarity: 'Common',
    xpReward: 150,
    iconName: 'Layers',
    targetValue: 50,
    unit: 'kanji',
    isUnlocked: true,
    unlockedAt: '2026-08-18T14:30:00.000Z'
  },
  {
    id: 'badge-kanji-120',
    title: 'Kanji Centurion (120 Characters)',
    titleJa: '漢字百二十制覇',
    description: 'Mastered all 120 essential JLPT N5 Kanji characters.',
    banglaDescription: 'JLPT N5 এর সম্পূর্ণ ১২০টি কাঞ্জি কার্ডে পূর্ণ দক্ষতা অর্জন করেছেন।',
    category: 'JLPT',
    rarity: 'Rare',
    xpReward: 400,
    iconName: 'CheckCircle2',
    targetValue: 120,
    unit: 'kanji',
    isUnlocked: false
  },
  {
    id: 'badge-n4-stepping-stone',
    title: 'JLPT N4 Intermediate Pioneer',
    titleJa: 'N4 中級先駆者',
    description: 'Completed 10 core modules of JLPT N4 grammar and vocabulary.',
    banglaDescription: 'JLPT N4 ইন্টারমিডিয়েট সিলেবাসের ১০টি গুরুত্বপূর্ণ লেসন শেষ করেছেন।',
    category: 'JLPT',
    rarity: 'Epic',
    xpReward: 700,
    iconName: 'Compass',
    targetValue: 10,
    unit: 'lessons',
    isUnlocked: false
  },

  // Speaking & Pronunciation
  {
    id: 'badge-tokyo-accent-ace',
    title: 'Tokyo Accent Ace (95%+)',
    titleJa: '東京アクセント名人',
    description: 'Achieved a 95%+ native pitch accent score in the Pronunciation Lab.',
    banglaDescription: 'প্রোনানসিয়েশন ল্যাবে ৯৫%+ টোকিও নেটিভ উচ্চারণ এক্যুরেসি অর্জন করেছেন।',
    category: 'Speaking',
    rarity: 'Rare',
    xpReward: 250,
    iconName: 'Mic',
    targetValue: 95,
    unit: '%',
    isUnlocked: true,
    unlockedAt: '2026-08-20T09:15:00.000Z'
  },
  {
    id: 'badge-voice-sensei-regular',
    title: 'Voice Sensei Conversationalist',
    titleJa: '音声対話マスター',
    description: 'Spoke 20 Japanese voice queries with AI Sensei.',
    banglaDescription: 'এআই সেনসেইয়ের সাথে ২০ বার ভয়েসে কথা বলে পরামর্শ নিয়েছেন।',
    category: 'Speaking',
    rarity: 'Common',
    xpReward: 150,
    iconName: 'Volume2',
    targetValue: 20,
    unit: 'queries',
    isUnlocked: false
  },

  // Grammar & Particle Precision
  {
    id: 'badge-particle-virtuoso',
    title: 'Particle Virtuoso (は vs が)',
    titleJa: '助詞の達人',
    description: 'Achieved 100% accuracy on tricky particle assessments in MemoryOS.',
    banglaDescription: 'MemoryOS-এ は, が, に, で পার্টিকেল কুইজে শতভাগ সঠিক উত্তর দিয়েছেন।',
    category: 'Grammar',
    rarity: 'Rare',
    xpReward: 300,
    iconName: 'Zap',
    targetValue: 100,
    unit: '%',
    isUnlocked: true,
    unlockedAt: '2026-08-21T18:40:00.000Z'
  },
  {
    id: 'badge-keigo-polite',
    title: 'Keigo Business Politeness',
    titleJa: '敬語ビジネス達人',
    description: 'Mastered Sonkeigo and Kenjougo workplace honorific rules.',
    banglaDescription: 'জাপানি কর্মক্ষেত্রের সম্মানসূচক কেইগো (সোনকেইগো ও কেনজোগো) আয়ত্ত করেছেন।',
    category: 'Workplace',
    rarity: 'Epic',
    xpReward: 500,
    iconName: 'Briefcase',
    targetValue: 10,
    unit: 'scenarios',
    isUnlocked: false
  },
  {
    id: 'badge-baito-7eleven',
    title: '7-Eleven Convenience Baito Hero',
    titleJa: 'コンビニバイトの星',
    description: 'Completed the real-time konbini register customer service simulation.',
    banglaDescription: 'জাপানের কনবিনি কাউন্টারে কাস্টমার সার্ভিসের সিমুলেশন সফলভাবে সম্পন্ন করেছেন।',
    category: 'Workplace',
    rarity: 'Common',
    xpReward: 200,
    iconName: 'ShoppingBag',
    targetValue: 1,
    unit: 'simulation',
    isUnlocked: true,
    unlockedAt: '2026-08-22T08:00:00.000Z'
  }
];

const BADGES_STORAGE_KEY = 'nihomi_user_badges_v1';

export function getUserBadges(currentStreak = 1, completedLessons = 0, learnedKanjiCount = 0): MilestoneBadge[] {
  let savedStatus: Record<string, { isUnlocked: boolean; unlockedAt?: string }> = {};
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(BADGES_STORAGE_KEY);
      if (raw) savedStatus = JSON.parse(raw);
    } catch {}
  }

  return ALL_BADGES.map((b) => {
    let isUnlocked = b.isUnlocked;
    let unlockedAt = b.unlockedAt;
    let currentValue = 0;

    if (b.id === 'badge-streak-7') {
      currentValue = currentStreak;
      if (currentStreak >= 7) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-streak-30') {
      currentValue = currentStreak;
      if (currentStreak >= 30) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-streak-50') {
      currentValue = currentStreak;
      if (currentStreak >= 50) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-streak-100') {
      currentValue = currentStreak;
      if (currentStreak >= 100) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-n5-complete') {
      currentValue = completedLessons;
      if (completedLessons >= 25) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-kanji-50') {
      currentValue = Math.max(50, learnedKanjiCount);
      if (learnedKanjiCount >= 50) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-kanji-120') {
      currentValue = learnedKanjiCount;
      if (learnedKanjiCount >= 120) {
        isUnlocked = true;
        unlockedAt = unlockedAt || new Date().toISOString();
      }
    } else if (b.id === 'badge-tokyo-accent-ace') {
      currentValue = 96;
    } else if (b.id === 'badge-particle-virtuoso') {
      currentValue = 100;
    } else if (b.id === 'badge-baito-7eleven') {
      currentValue = 1;
    }

    if (savedStatus[b.id]) {
      isUnlocked = savedStatus[b.id].isUnlocked;
      unlockedAt = savedStatus[b.id].unlockedAt || unlockedAt;
    }

    return {
      ...b,
      currentValue,
      isUnlocked,
      unlockedAt
    };
  });
}
