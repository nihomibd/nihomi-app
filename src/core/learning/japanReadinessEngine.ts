// src/core/learning/japanReadinessEngine.ts
// NIHOMI JAPAN READINESS™ ENGINE
// Core Law: Japan Readiness is broader than JLPT. Grounded in actual learner evidence.
// Evolving continuous score (0 - 100): "You are becoming more ready."

import { LearnerKnowledgeState } from '../curriculum/learnerKnowledgeState';

export interface JapanReadinessDimensions {
  japaneseFoundation: number;    // 0-100: Hiragana, Katakana, basic sound awareness
  listening: number;             // 0-100: Audio recognition, fast cashier/announcement comprehension
  reading: number;               // 0-100: Signboards, menus, furigana reading reflex
  speaking: number;              // 0-100: Pronunciation, self-intro, polite replies
  dailyLife: number;             // 0-100: Konbini checkout, trash sorting, train navigation
  japanSurvival: number;         // 0-100: Emergencies, lost items, asking directions
  studyReadiness: number;        // 0-100: Classroom etiquette, textbook understanding
  workReadiness: number;         // 0-100: Baito POS register, greeting senpai/boss, Keigo basics
  communicationConfidence: number; // 0-100: Hesitation reduction, streak stability
}

export interface JapanReadinessReport {
  overallScore: number; // 0-100
  levelTitleBn: string;
  levelTitleJa: string;
  dimensions: JapanReadinessDimensions;
  strongestDimensionBn: string;
  focusAreaBn: string;
  nextReadinessMilestoneBn: string;
  readinessBadge: string;
}

export const READINESS_DIMENSIONS_META: Record<
  keyof JapanReadinessDimensions,
  { labelBn: string; labelJa: string; icon: string; descriptionBn: string }
> = {
  japaneseFoundation: {
    labelBn: 'জাপানি ভিত্তি (বর্ণ ও ধ্বনি)',
    labelJa: '日本語基礎',
    icon: 'BookOpen',
    descriptionBn: 'হিরাগানা, কাতাকানা ও সঠিক জাপানি উচ্চারণ।'
  },
  listening: {
    labelBn: 'শ্রবণ দক্ষতা (লিসেনিং)',
    labelJa: 'リスニング反射',
    icon: 'Headphones',
    descriptionBn: 'ট্রেন স্টেশন ও নেটিভ জাপানির স্বাভাবিক গতির কথা বোঝা।'
  },
  reading: {
    labelBn: 'পড়ার গতি (রিডিং)',
    labelJa: '読解スピード',
    icon: 'Eye',
    descriptionBn: 'রাস্তার সাইনবোর্ড, কনবিনি পণ্য ও রেস্তোরাঁর মেনু পড়া।'
  },
  speaking: {
    labelBn: 'কথোপকথন (স্পিকিং)',
    labelJa: '日常会話・発話',
    icon: 'MessageSquare',
    descriptionBn: 'ভয় ছাড়া নিজের পরিচয় দেওয়া ও প্রশ্নের উত্তর দেওয়া।'
  },
  dailyLife: {
    labelBn: 'দৈনন্দিন জীবন (লাইফস্টাইল)',
    labelJa: '日本生活適応',
    icon: 'ShoppingBag',
    descriptionBn: 'কনবিনিতে কেনাকাটা, সুপারমার্কেট ও ট্রেন চলাচল।'
  },
  japanSurvival: {
    labelBn: 'সারভাইভাল ও জরুরি জাপানি',
    labelJa: 'サバイバル日本語',
    icon: 'Shield',
    descriptionBn: 'রাস্তা হারানো, সাহায্য চাওয়া ও অসুস্থতার কথা বলা।'
  },
  studyReadiness: {
    labelBn: 'পড়াশোনার প্রস্তুতি (স্টাডি)',
    labelJa: '留学・進学準備',
    icon: 'GraduationCap',
    descriptionBn: 'ল্যাঙ্গুয়েজ স্কুল ও ক্লাসরুমের আদব-কায়দা।'
  },
  workReadiness: {
    labelBn: 'কাজের প্রস্তুতি (বাইতো/জব)',
    labelJa: '就労・バイト適応',
    icon: 'Briefcase',
    descriptionBn: 'বাইতো কাস্টমার সার্ভিস, কেইগো ও কর্মক্ষেত্রের নিয়ম।'
  },
  communicationConfidence: {
    labelBn: 'যোগাযোগের আত্মবিশ্বাস',
    labelJa: 'コミュニケーション自信',
    icon: 'Sparkles',
    descriptionBn: 'জড়তা কাটিয়ে জাপানিদের সাথে হাসিমুখে কথা বলার সাহস।'
  }
};

/**
 * Calculates evidence-grounded Japan Readiness score from actual learner state.
 */
export function calculateJapanReadinessReport(
  state?: Partial<LearnerKnowledgeState> | null,
  completedMissionsCount = 0
): JapanReadinessReport {
  const hiraganaCount = state?.knownHiragana?.length || 0;
  const katakanaCount = state?.knownKatakana?.length || 0;
  const vocabCount = state?.knownVocabulary?.length || 0;
  const streak = state?.streakDays || 1;
  const totalXp = state?.totalXp || 0;
  const masteredCount = state?.masteredSkills?.length || 0;

  // 1. Japanese Foundation: strictly based on 46 Hiragana + 46 Katakana
  const foundationRatio = (Math.min(46, hiraganaCount) * 1.5 + Math.min(46, katakanaCount) * 0.7) / (46 * 1.5 + 46 * 0.7);
  const foundationScore = Math.min(100, Math.round(foundationRatio * 100));

  // 2. Listening: based on listening drills & mission completions
  const listeningScore = Math.min(100, Math.round(completedMissionsCount * 12 + Math.min(40, vocabCount * 0.8) + (totalXp > 100 ? 15 : 0)));

  // 3. Reading: Kana mastery + vocab recognition
  const readingScore = Math.min(100, Math.round((foundationScore * 0.6) + Math.min(40, vocabCount * 1.2)));

  // 4. Speaking: Mission oral practices
  const speakingScore = Math.min(100, Math.round(completedMissionsCount * 15 + (masteredCount * 3)));

  // 5. Daily Life: Real-life missions completed (Konbini, station, restaurant)
  const dailyLifeScore = Math.min(100, Math.round(completedMissionsCount * 18 + (vocabCount >= 10 ? 10 : 0)));

  // 6. Japan Survival: Essential phrases
  const survivalScore = Math.min(100, Math.round((completedMissionsCount >= 1 ? 25 : 0) + (completedMissionsCount >= 2 ? 25 : 0) + (foundationScore * 0.3)));

  // 7. Study Readiness: Daily discipline + streak
  const studyScore = Math.min(100, Math.round(Math.min(50, streak * 10) + (foundationScore * 0.5)));

  // 8. Work Readiness: Workplace modules & Keigo
  const workScore = Math.min(100, Math.round((completedMissionsCount >= 3 ? 40 : completedMissionsCount * 10) + (vocabCount >= 25 ? 20 : 0)));

  // 9. Communication Confidence: Consistency & completed cycles
  const confidenceScore = Math.min(100, Math.round(Math.min(40, streak * 8) + (completedMissionsCount * 12) + (masteredCount * 2)));

  const dimensions: JapanReadinessDimensions = {
    japaneseFoundation: Math.max(5, foundationScore),
    listening: Math.max(5, listeningScore),
    reading: Math.max(5, readingScore),
    speaking: Math.max(5, speakingScore),
    dailyLife: Math.max(5, dailyLifeScore),
    japanSurvival: Math.max(5, survivalScore),
    studyReadiness: Math.max(5, studyScore),
    workReadiness: Math.max(5, workScore),
    communicationConfidence: Math.max(5, confidenceScore)
  };

  const dimValues = Object.values(dimensions);
  const overallScore = Math.round(dimValues.reduce((a, b) => a + b, 0) / dimValues.length);

  // Dynamic titles and milestone
  let levelTitleBn = 'প্রারম্ভিক অনুসন্ধানকারী (Level 1)';
  let levelTitleJa = '日本準備・入門';
  let readinessBadge = 'Beginner Ready 🇯🇵';

  if (overallScore >= 80) {
    levelTitleBn = 'জাপান রেডি কনফিডেন্ট (Level 5)';
    levelTitleJa = '日本生活即応レベル';
    readinessBadge = 'Tokyo Ready Pro 🇯🇵';
  } else if (overallScore >= 60) {
    levelTitleBn = 'বাস্তব যোগাযোগে সক্ষম (Level 4)';
    levelTitleJa = '実践コミュニケーション';
    readinessBadge = 'Independent 🇯🇵';
  } else if (overallScore >= 40) {
    levelTitleBn = 'দৈনন্দিন সারভাইভাল প্রস্তুত (Level 3)';
    levelTitleJa = '生活サバイバル完了';
    readinessBadge = 'Survival Ready 🇯🇵';
  } else if (overallScore >= 20) {
    levelTitleBn = 'ভিত্তি ও অক্ষর পরিচিত (Level 2)';
    levelTitleJa = '基礎ステップ通過';
    readinessBadge = 'Foundation Builder 🇯🇵';
  }

  // Find strongest and focus area
  const sortedDims = (Object.keys(dimensions) as (keyof JapanReadinessDimensions)[]).sort(
    (a, b) => dimensions[b] - dimensions[a]
  );
  const strongest = sortedDims[0];
  const weakest = sortedDims[sortedDims.length - 1];

  return {
    overallScore,
    levelTitleBn,
    levelTitleJa,
    dimensions,
    strongestDimensionBn: READINESS_DIMENSIONS_META[strongest].labelBn,
    focusAreaBn: READINESS_DIMENSIONS_META[weakest].labelBn,
    nextReadinessMilestoneBn:
      overallScore < 30
        ? 'হিরাগানা ৫টি স্বরবর্ণ ও প্রথম বাস্তব কনবিনি মিশন সম্পন্ন করা'
        : overallScore < 60
        ? 'ট্রেন স্টেশন ও রেস্তোরাঁ সিমুলেশন সম্পূর্ণ করে N5 রিডিং আনলক করা'
        : 'টোকিও বাইতো কাস্টমার সার্ভিস ও ইন্টারভিউ প্রস্তুতি গ্রহণ',
    readinessBadge
  };
}
