// src/core/onboarding/onboardingTypes.ts
/**
 * NIHOMI V2 ONBOARDING & JAPAN READINESS™ DOMAIN MODEL
 */

export type JapanGoalReason =
  | 'study'          // উচ্চশিক্ষা (Higher Studies)
  | 'work'           // চাকরি / SSW (Job / Specified Skilled Worker)
  | 'language_school'// ল্যাঙ্গুয়েজ স্কুল (Language School)
  | 'travel'         // ভ্রমণ (Travel)
  | 'long_term';     // স্থায়ী বসবাস (Long-term Life / Relocation)

export type CurrentJapaneseLevel =
  | 'absolute_beginner' // একদম নতুন
  | 'know_kana'         // Hiragana/Katakana জানি
  | 'know_some_words'   // কিছু শব্দ পারি
  | 'jlpt_n5'           // JLPT N5
  | 'jlpt_n4_plus';      // N4+

export type JapanTimeline =
  | '3_to_6_months'   // ৩–৬ মাস
  | '6_to_12_months'  // ৬–১২ মাস
  | '1_to_2_years'    // ১–২ বছর
  | 'exploring';      // এখনও ভাবছি

export type PrioritySituation =
  | 'speaking'       // Speaking (সাবলীল কথা বলা)
  | 'konbini'        // Konbini (কনবিনি কেনাকাটা)
  | 'train_travel'   // Train/Travel (ট্রেন ও দিকনির্দেশনা)
  | 'restaurant'     // Restaurant (রেস্তোরাঁয় অর্ডার)
  | 'job_interview'; // Job Interview (বাইতো/জব ইন্টারভিউ)

export type DailyTimeCommitment = 10 | 20 | 30 | 45;

export interface OnboardingAnswers {
  reason: JapanGoalReason;
  currentLevel: CurrentJapaneseLevel;
  timeline: JapanTimeline;
  prioritySituation: PrioritySituation;
  dailyMinutes: DailyTimeCommitment;
  completedAt?: string;
}

export interface JapanReadinessBreakdown {
  overallScore: number; // 0 - 100
  foundationScore: number; // 0 - 100
  speakingScore: number; // 0 - 100
  dailyLifeScore: number; // 0 - 100
  survivalScore: number; // 0 - 100
  targetMilestone: string;
  recommendedDailyMinutes: number;
}
