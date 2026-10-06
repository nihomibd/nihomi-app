// src/core/learning/learningConstitution.ts
// NIHOMI CANONICAL LEARNING CONSTITUTION & STATE MACHINE
// "You learn Japanese. Nihomi coordinates everything else."
// Core Law: Japanese is learned THROUGH meaningful use with strict prerequisite lattice.

/**
 * 14-Step Canonical Mission Execution Framework
 */
export type MissionStep =
  | 'HOOK'
  | 'CONTEXT'
  | 'OBJECTIVE'
  | 'MICRO_TEACH'
  | 'HEAR_SEE'
  | 'RECALL'
  | 'GUIDED_PRACTICE'
  | 'CONTROLLED_PRACTICE'
  | 'REALISTIC_USE'
  | 'SPEAK_PRODUCE'
  | 'MASTERY_CHECK'
  | 'FEEDBACK'
  | 'REVIEW_LATER'
  | 'NEXT_BEST_MISSION';

export const MISSION_STEPS_ORDER: MissionStep[] = [
  'HOOK',
  'CONTEXT',
  'OBJECTIVE',
  'MICRO_TEACH',
  'HEAR_SEE',
  'RECALL',
  'GUIDED_PRACTICE',
  'CONTROLLED_PRACTICE',
  'REALISTIC_USE',
  'SPEAK_PRODUCE',
  'MASTERY_CHECK',
  'FEEDBACK',
  'REVIEW_LATER',
  'NEXT_BEST_MISSION'
];

export interface MissionStepMeta {
  step: MissionStep;
  index: number;
  labelBn: string;
  labelJa: string;
  descriptionBn: string;
}

export const MISSION_STEPS_META: Record<MissionStep, MissionStepMeta> = {
  HOOK: {
    step: 'HOOK',
    index: 1,
    labelBn: 'আকর্ষণ ও মোটিভেশন',
    labelJa: '動機付け (Hook)',
    descriptionBn: 'বাস্তব জাপানের পরিস্থিতি কেন গুরুত্বপূর্ণ তা অনুধাবন করা।'
  },
  CONTEXT: {
    step: 'CONTEXT',
    index: 2,
    labelBn: 'পরিস্থিতির পটভূমি',
    labelJa: '場面設定 (Context)',
    descriptionBn: 'টোকিওর বাস্তব পরিবেশ (কনবিনি, স্টেশন, ক্যাফে)।'
  },
  OBJECTIVE: {
    step: 'OBJECTIVE',
    index: 3,
    labelBn: 'সুনির্দিষ্ট লক্ষ্য',
    labelJa: '達成目標 (Objective)',
    descriptionBn: 'এই মিশনে শিক্ষার্থী ঠিক কী অর্জন করতে পারবে।'
  },
  MICRO_TEACH: {
    step: 'MICRO_TEACH',
    index: 4,
    labelBn: 'সহজ ও সংক্ষিপ্ত পাঠ',
    labelJa: 'マイクロ解説 (Micro-teach)',
    descriptionBn: 'অপ্রয়োজনীয় জটিল ব্যাকরণ ছাড়া একবারে একটি পরিষ্কার ধারণা।'
  },
  HEAR_SEE: {
    step: 'HEAR_SEE',
    index: 5,
    labelBn: 'শোনা ও দেখা',
    labelJa: '視聴確認 (Hear / See)',
    descriptionBn: 'নেটিভ সাউন্ড ও জাপানি লেখার গভীর সংযোগ।'
  },
  RECALL: {
    step: 'RECALL',
    index: 6,
    labelBn: 'স্মৃতি থেকে স্মরণ',
    labelJa: '想起ドリル (Recall)',
    descriptionBn: 'সরাসরি দেখে নয়, মন থেকে স্মরণ করার প্রথম পদক্ষেপ।'
  },
  GUIDED_PRACTICE: {
    step: 'GUIDED_PRACTICE',
    index: 7,
    labelBn: 'সহায়তাসহ অনুশীলন',
    labelJa: '誘導練習 (Guided Practice)',
    descriptionBn: 'ইঙ্গিত বা ক্লু সহকারে সঠিক উত্তরের দিকে এগিয়ে যাওয়া।'
  },
  CONTROLLED_PRACTICE: {
    step: 'CONTROLLED_PRACTICE',
    index: 8,
    labelBn: 'স্বাধীন অনুশীলন',
    labelJa: '自立練習 (Controlled Practice)',
    descriptionBn: 'ক্লু ছাড়া নির্ভুলভাবে প্রয়োগ করার মহড়া।'
  },
  REALISTIC_USE: {
    step: 'REALISTIC_USE',
    index: 9,
    labelBn: 'বাস্তব জীবনের প্রয়োগ',
    labelJa: '実践応用 (Realistic Use)',
    descriptionBn: 'টোকিওর বাস্তব পরিস্থিতিতে কথোপকথন সম্পন্ন করা।'
  },
  SPEAK_PRODUCE: {
    step: 'SPEAK_PRODUCE',
    index: 10,
    labelBn: 'উচ্চারণ ও প্রকাশ',
    labelJa: '発話・産出 (Speak / Produce)',
    descriptionBn: 'মুখে বলে বা লিখে সক্রিয়ভাবে ভাষার প্রকাশ ঘটানো।'
  },
  MASTERY_CHECK: {
    step: 'MASTERY_CHECK',
    index: 11,
    labelBn: 'দক্ষতা যাচাই',
    labelJa: '習得判定 (Mastery Check)',
    descriptionBn: 'বহুমাত্রিক প্রমাণের ভিত্তিতে দক্ষতা মূল্যায়ন।'
  },
  FEEDBACK: {
    step: 'FEEDBACK',
    index: 12,
    labelBn: 'সহানুভূতিশীল ফিডব্যাক',
    labelJa: '温かい評価 (Feedback)',
    descriptionBn: 'ভুলের ক্ষেত্রে সান্ত্বনা ও উৎসাহ, অর্জনের ক্ষেত্রে স্বীকৃতি।'
  },
  REVIEW_LATER: {
    step: 'REVIEW_LATER',
    index: 13,
    labelBn: 'পরবর্তী রিভিশন শিডিউল',
    labelJa: '復習登録 (Review Later)',
    descriptionBn: 'স্পেসড রিপিটেশন (SRS) মেমরিতে স্বয়ংক্রিয় অন্তর্ভুক্তি।'
  },
  NEXT_BEST_MISSION: {
    step: 'NEXT_BEST_MISSION',
    index: 14,
    labelBn: 'পরবর্তী সেরা মিশন',
    labelJa: '次の一歩 (Next Best Mission)',
    descriptionBn: 'অবিরাম ও জীবন্ত শিক্ষা লুপে পরবর্তী লক্ষ্য নির্ধারণ।'
  }
};

/**
 * Multi-evidence Mastery States (Section 8 of Constitution)
 */
export type SkillMasteryState =
  | 'NOT_STARTED'
  | 'INTRODUCED'
  | 'PRACTICING'
  | 'DEVELOPING'
  | 'FUNCTIONAL'
  | 'MASTERED'
  | 'NEEDS_REVIEW';

export type EvidenceType =
  | 'recognition'
  | 'recall'
  | 'listening'
  | 'reading'
  | 'application'
  | 'production'
  | 'real_life_task';

export interface SkillEvidenceRecord {
  type: EvidenceType;
  success: boolean;
  timestamp: string;
  context: string;
  responseTimeMs?: number;
}

export interface SkillMasteryRecord {
  skillId: string;
  skillNameBn: string;
  state: SkillMasteryState;
  score: number; // 0 to 100
  evidenceCount: number;
  evidences: SkillEvidenceRecord[];
  consecutiveSuccesses: number;
  lastPracticedDate: string;
  nextReviewDate?: string;
}

/**
 * Calculates updated skill mastery state based on multi-evidence criteria.
 */
export function evaluateSkillMastery(
  current: Partial<SkillMasteryRecord>,
  newEvidence: SkillEvidenceRecord
): SkillMasteryRecord {
  const evidences = [...(current.evidences || []), newEvidence];
  const recent = evidences.slice(-6);
  const successCount = recent.filter(e => e.success).length;
  const consecutive = newEvidence.success ? (current.consecutiveSuccesses || 0) + 1 : 0;
  
  // Diversity of evidence types
  const uniqueTypes = new Set(evidences.filter(e => e.success).map(e => e.type));
  const hasRecognition = uniqueTypes.has('recognition');
  const hasRecall = uniqueTypes.has('recall');
  const hasRealLife = uniqueTypes.has('real_life_task') || uniqueTypes.has('application');

  let state: SkillMasteryState = current.state || 'NOT_STARTED';
  let score = 0;

  if (evidences.length === 0) {
    state = 'NOT_STARTED';
    score = 0;
  } else if (evidences.length === 1 && newEvidence.success) {
    state = 'INTRODUCED';
    score = 25;
  } else if (!newEvidence.success && consecutive === 0 && evidences.length >= 3) {
    state = 'NEEDS_REVIEW';
    score = Math.max(20, (current.score || 50) - 20);
  } else if (consecutive >= 4 && uniqueTypes.size >= 3 && hasRealLife) {
    state = 'MASTERED';
    score = 100;
  } else if (consecutive >= 3 && uniqueTypes.size >= 2) {
    state = 'FUNCTIONAL';
    score = 80;
  } else if (successCount >= 3) {
    state = 'DEVELOPING';
    score = 60;
  } else {
    state = 'PRACTICING';
    score = 40;
  }

  // Calculate next review date based on SM-2 interval logic
  const now = new Date();
  let intervalDays = 1;
  if (state === 'MASTERED') intervalDays = 7;
  else if (state === 'FUNCTIONAL') intervalDays = 3;
  else if (state === 'DEVELOPING') intervalDays = 2;
  else intervalDays = 1;

  const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    skillId: current.skillId || 'unknown_skill',
    skillNameBn: current.skillNameBn || 'জাপানি দক্ষতা',
    state,
    score,
    evidenceCount: evidences.length,
    evidences,
    consecutiveSuccesses: consecutive,
    lastPracticedDate: now.toISOString().split('T')[0],
    nextReviewDate: nextReview
  };
}
