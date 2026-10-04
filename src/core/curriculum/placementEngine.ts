// src/core/curriculum/placementEngine.ts
// Canonical Placement Engine for Experienced Japanese Learners
// Inviolable Law: Experienced learners are placed at their exact knowledge node
// with retroactive prerequisite hydration so no unearned skips or redundant kana tracing occur.

import {
  LearnerKnowledgeState,
  saveLearnerKnowledgeState
} from './learnerKnowledgeState';
import { getNextBestMission, NextBestMission } from './journeyEngine';
import { CURRICULUM_GRAPH } from './curriculumGraph';

export const ALL_HIRAGANA_46 = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん'
];

export const ALL_KATAKANA_46 = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ワ', 'ヲ', 'ン'
];

export type PlacementTier =
  | 'zero_beginner'
  | 'vowels_known'
  | 'hiragana_mastered'
  | 'dual_kana_mastered';

export interface PlacementQuestion {
  id: string;
  tier: PlacementTier;
  questionBn: string;
  promptJa: string;
  options: {
    labelBn: string;
    isCorrect: boolean;
  }[];
  explanationBn: string;
}

export const PLACEMENT_DIAGNOSTIC_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq-1-vowels',
    tier: 'vowels_known',
    questionBn: 'জাপানি ভাষায় "あい" (Ai) শব্দের অর্থ কী?',
    promptJa: 'あい',
    options: [
      { labelBn: 'ভালোবাসা (Love)', isCorrect: true },
      { labelBn: 'নীল রঙ (Blue)', isCorrect: false },
      { labelBn: 'বাড়ি (House)', isCorrect: false },
      { labelBn: 'উপরে (Above)', isCorrect: false }
    ],
    explanationBn: 'あ (A) + い (I) মিলে তৈরি হয় "あい", যার অর্থ ভালোবাসা।'
  },
  {
    id: 'pq-2-consonants',
    tier: 'vowels_known',
    questionBn: 'নিচের কোন অক্ষরটির উচ্চারণ "Sa" (সা)?',
    promptJa: 'さ / き / た / ち',
    options: [
      { labelBn: 'さ', isCorrect: true },
      { labelBn: 'き', isCorrect: false },
      { labelBn: 'た', isCorrect: false },
      { labelBn: 'ち', isCorrect: false }
    ],
    explanationBn: 'さ হলো হিরাগানা Sa।'
  },
  {
    id: 'pq-3-hiragana-reading',
    tier: 'hiragana_mastered',
    questionBn: '"ありがとう" শব্দের সঠিক উচ্চারণ ও অর্থ কোনটি?',
    promptJa: 'ありがとう',
    options: [
      { labelBn: 'Arigatou (ধন্যবাদ)', isCorrect: true },
      { labelBn: 'Konnichiwa (শুভ অপরাহ্ন)', isCorrect: false },
      { labelBn: 'Sayounara (বিদায়)', isCorrect: false },
      { labelBn: 'Ohayou (শুভ সকাল)', isCorrect: false }
    ],
    explanationBn: 'ありがとう হলো জাপানি ভাষায় আন্তরিক ধন্যবাদ জানানোর শব্দ।'
  },
  {
    id: 'pq-4-katakana',
    tier: 'dual_kana_mastered',
    questionBn: 'কাতাকানা "コーヒー" শব্দটি দিয়ে কী বোঝানো হয়?',
    promptJa: 'コーヒー',
    options: [
      { labelBn: 'কফি (Coffee)', isCorrect: true },
      { labelBn: 'কোলা (Cola)', isCorrect: false },
      { labelBn: 'পানি (Water)', isCorrect: false },
      { labelBn: 'চা (Tea)', isCorrect: false }
    ],
    explanationBn: 'コーヒー হলো ইংরেজি Coffee শব্দ থেকে আসা কাতাকানা লোনওয়ার্ড।'
  },
  {
    id: 'pq-5-grammar-foundation',
    tier: 'dual_kana_mastered',
    questionBn: '"わたし____ がくせいです" (আমি একজন ছাত্র) — শূন্যস্থানে সঠিক পার্টিকেল কোনটি?',
    promptJa: 'わたし ____ がくせいです',
    options: [
      { labelBn: 'は (wa)', isCorrect: true },
      { labelBn: 'を (o)', isCorrect: false },
      { labelBn: 'に (ni)', isCorrect: false },
      { labelBn: 'で (de)', isCorrect: false }
    ],
    explanationBn: 'বাক্যের বিষয়াংশ বা টপিক নির্দেশ করতে は (উচ্চারণ: wa) পার্টিকেল ব্যবহৃত হয়।'
  }
];

export interface PlacementAssessmentResult {
  tier: PlacementTier;
  recommendedStartingNodeId: string;
  recommendedStartingMission: NextBestMission;
  score: number;
  totalQuestions: number;
  messageBn: string;
}

/**
 * Evaluates placement answers and determines the exact node in CURRICULUM_GRAPH.
 */
export function evaluatePlacementAnswers(answers: Record<string, number>): PlacementAssessmentResult {
  let score = 0;
  PLACEMENT_DIAGNOSTIC_QUESTIONS.forEach(q => {
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.options[selectedIndex]?.isCorrect) {
      score++;
    }
  });

  let tier: PlacementTier = 'zero_beginner';
  let startingNodeId = 'kana-a';
  let messageBn = 'জিরো লেভেল থেকে শুরু করা সবচেয়ে নিরাপদ ও মজবুত। চলুন শুরু থেকেই প্রতিটি অক্ষরের খাঁটি উচ্চারণ শিখে নিই!';

  if (score === 5) {
    // Perfect score -> Dual Kana mastered, ready for reading foundation or grammar
    tier = 'dual_kana_mastered';
    startingNodeId = 'grammar-n5-lesson-01';
    messageBn = 'অসাধারণ! আপনি হিরাগানা ও কাতাকানা উভয় লিপি এবং মৌলিক গঠন পড়তে পারেন। আপনাকে সরাসরি N5 ব্যাকরণ পাঠ ০১-এ স্থাপন করা হলো!';
  } else if (score >= 3) {
    // Hiragana core mastered, needs katakana or reading consolidation
    tier = 'hiragana_mastered';
    startingNodeId = 'katakana-foundation';
    messageBn = 'দারুণ! আপনার হিরাগানা পড়া স্পষ্ট। এবার জাপানের প্রযুক্তি ও বিদেশি শব্দের লিপি "কাতাকানা" আয়ত্ত করে সম্পূর্ণ রিডিং ফাউন্ডেশন তৈরি করি!';
  } else if (score >= 2) {
    // Vowels known
    tier = 'vowels_known';
    startingNodeId = 'kana-ka-family';
    messageBn = 'ভালো প্রস্তুতি! স্বরবর্ণগুলো আপনি চেনেন। এবার ব্যঞ্জনবর্ণ পরিবার (か-বর্গ) থেকে দ্রুত এগিয়ে যাব!';
  }

  const startingNode = CURRICULUM_GRAPH[startingNodeId] || CURRICULUM_GRAPH['kana-a'];

  return {
    tier,
    recommendedStartingNodeId: startingNodeId,
    recommendedStartingMission: startingNode,
    score,
    totalQuestions: PLACEMENT_DIAGNOSTIC_QUESTIONS.length,
    messageBn
  };
}

/**
 * Retroactively hydrates learner state up to the placed tier so that
 * all prerequisite lattice requirements are legitimately satisfied.
 */
export function applyPlacementResult(
  tier: PlacementTier,
  currentState: LearnerKnowledgeState
): LearnerKnowledgeState {
  const updated: LearnerKnowledgeState = {
    ...currentState,
    knownHiragana: [...currentState.knownHiragana],
    knownKatakana: [...currentState.knownKatakana],
    knownVocabulary: [...currentState.knownVocabulary],
    masteredSkills: [...currentState.masteredSkills]
  };

  const addUnique = (arr: string[], items: string[]) => {
    items.forEach(item => {
      if (!arr.includes(item)) arr.push(item);
    });
  };

  if (tier === 'vowels_known') {
    addUnique(updated.knownHiragana, ['あ', 'い', 'う', 'え', 'お']);
    addUnique(updated.knownVocabulary, ['あい', 'あお', 'いえ', 'うえ', 'いい']);
    addUnique(updated.masteredSkills, ['vowels_5_mastered', '5_vowels_gate', 'konbini_mission_1']);
    updated.totalXp = Math.max(updated.totalXp, 150);
  } else if (tier === 'hiragana_mastered') {
    addUnique(updated.knownHiragana, ALL_HIRAGANA_46);
    addUnique(updated.knownVocabulary, ['あい', 'あお', 'いえ', 'うえ', 'いい', 'ありがとう', 'さくら', 'ねこ']);
    addUnique(updated.masteredSkills, [
      'vowels_5_mastered',
      '5_vowels_gate',
      'konbini_mission_1',
      'hiragana_core_mastered',
      'hiragana_mechanics_mastered',
      'hiragana_reading_mastered'
    ]);
    updated.totalXp = Math.max(updated.totalXp, 350);
  } else if (tier === 'dual_kana_mastered') {
    addUnique(updated.knownHiragana, ALL_HIRAGANA_46);
    addUnique(updated.knownKatakana, ALL_KATAKANA_46);
    addUnique(updated.knownVocabulary, [
      'あい', 'あお', 'いえ', 'うえ', 'いい', 'ありがとう', 'さくら', 'ねこ',
      'コーヒー', 'カメラ', 'ホテル', 'タクシー'
    ]);
    addUnique(updated.masteredSkills, [
      'vowels_5_mastered',
      '5_vowels_gate',
      'konbini_mission_1',
      'hiragana_core_mastered',
      'hiragana_mechanics_mastered',
      'hiragana_reading_mastered',
      'katakana_foundation_mastered',
      'katakana_mastered',
      'kana_dual_mastered',
      'reading_foundation_verified'
    ]);
    updated.totalXp = Math.max(updated.totalXp, 600);
  }

  // Authoritatively re-calculate next mission
  const nextMission = getNextBestMission(updated);
  updated.currentMissionId = nextMission.id;

  saveLearnerKnowledgeState(updated);
  return updated;
}
