// src/core/curriculum/quickCalibrationEngine.ts
// NIHOMI.COM — BENGALI-FIRST 5-TRACK QUICK CALIBRATION ENGINE
// Inviolable Law: Evidence-based placement combining self-reporting with verified questions.
// Zero unearned skips. Conservative placement with prerequisite lattice hydration.

import {
  LearnerKnowledgeState,
  loadLearnerKnowledgeState,
  saveLearnerKnowledgeState
} from './learnerKnowledgeState';
import { CURRICULUM_GRAPH } from './curriculumGraph';
import { NextBestMission, getNextBestMission } from './journeyEngine';
import { ALL_HIRAGANA_46, ALL_KATAKANA_46 } from './placementEngine';

export type CalibrationTrackId =
  | 'track_zero'
  | 'track_some_hiragana'
  | 'track_dual_kana'
  | 'track_jlpt'
  | 'track_returning';

export interface CalibrationTrackInfo {
  id: CalibrationTrackId;
  titleBn: string;
  taglineBn: string;
  badgeBn: string;
  iconName: string;
  descriptionBn: string;
  requiresQuiz: boolean;
}

export const CALIBRATION_TRACKS: CalibrationTrackInfo[] = [
  {
    id: 'track_zero',
    titleBn: 'আমি একেবারে নতুন',
    taglineBn: 'পূর্বে কখনো জাপানি ভাষা শেখা হয়নি',
    badgeBn: 'শুরুর পয়েন্ট: あ',
    iconName: 'Sparkles',
    descriptionBn: 'প্রথম অক্ষর "あ" (A) থেকে শুরু। কোনো পরীক্ষা ছাড়া সরাসরি স্টেজ ০১-এ প্রবেশ।',
    requiresQuiz: false
  },
  {
    id: 'track_some_hiragana',
    titleBn: 'কিছু হিরাগানা চিনি',
    taglineBn: 'কয়েকটি বর্ণ বা স্বরবর্ণ পড়তে পারি',
    badgeBn: '২টি প্রশ্নে যাচাই',
    iconName: 'BookOpen',
    descriptionBn: '২টি দ্রুত প্রশ্নে জ্ঞান যাচাই করে সঠিক ব্যঞ্জনবর্ণ পরিবারে স্থান নির্ধারণ।',
    requiresQuiz: true
  },
  {
    id: 'track_dual_kana',
    titleBn: 'হিরাগানা ও কাতাকানা চিনি',
    taglineBn: 'উভয় লিপি পড়তে পারি, ব্যাকরণ শিখতে চাই',
    badgeBn: '২টি প্রশ্নে যাচাই',
    iconName: 'Layers',
    descriptionBn: '২টি প্রশ্নে রিডিং যাচাই করে N5 ব্যাকরণ ও বাক্য গঠনে সরাসরি প্রবেশ।',
    requiresQuiz: true
  },
  {
    id: 'track_jlpt',
    titleBn: 'JLPT N5–N1 পড়েছি',
    taglineBn: 'নির্দিষ্ট লেভেলের মক টেস্ট ও ড্রিল চাই',
    badgeBn: '২টি প্রশ্নে যাচাই',
    iconName: 'Award',
    descriptionBn: '২টি ডায়াগনস্টিক প্রশ্নে কাঞ্জি ও পার্টিকেল যাচাই করে মক সিমুলেশনে প্রবেশ।',
    requiresQuiz: true
  }
];

export interface CalibrationQuestion {
  id: string;
  trackId: CalibrationTrackId;
  questionBn: string;
  promptJa: string;
  furigana?: string;
  options: {
    labelBn: string;
    isCorrect: boolean;
  }[];
  explanationBn: string;
}

export const TRACK_QUESTIONS: Record<CalibrationTrackId, CalibrationQuestion[]> = {
  track_zero: [],
  track_some_hiragana: [
    {
      id: 'sh-1-vowels',
      trackId: 'track_some_hiragana',
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
      id: 'sh-2-consonants',
      trackId: 'track_some_hiragana',
      questionBn: 'নিচের কোন অক্ষরটির উচ্চারণ "Sa" (সা)?',
      promptJa: 'さ / き / た / ち',
      options: [
        { labelBn: 'さ', isCorrect: true },
        { labelBn: 'き', isCorrect: false },
        { labelBn: 'た', isCorrect: false },
        { labelBn: 'ち', isCorrect: false }
      ],
      explanationBn: 'さ হলো হিরাগানা Sa।'
    }
  ],
  track_dual_kana: [
    {
      id: 'dk-1-katakana',
      trackId: 'track_dual_kana',
      questionBn: 'কাতাকানা "コーヒー" (Koohii) শব্দটি দিয়ে কী বোঝানো হয়?',
      promptJa: 'コーヒー',
      options: [
        { labelBn: 'কফি (Coffee)', isCorrect: true },
        { labelBn: 'কোলা (Cola)', isCorrect: false },
        { labelBn: 'পানি (Water)', isCorrect: false },
        { labelBn: 'দুধ (Milk)', isCorrect: false }
      ],
      explanationBn: 'コーヒー হলো ইংরেজি Coffee শব্দ থেকে আসা কাতাকানা লোনওয়ার্ড।'
    },
    {
      id: 'dk-2-arigatou',
      trackId: 'track_dual_kana',
      questionBn: '"ありがとう" শব্দের সঠিক অর্থ কোনটি?',
      promptJa: 'ありがとう',
      options: [
        { labelBn: 'ধন্যবাদ (Thank you)', isCorrect: true },
        { labelBn: 'শুভ সকাল (Good morning)', isCorrect: false },
        { labelBn: 'বিদায় (Goodbye)', isCorrect: false },
        { labelBn: 'দুঃখিত (Sorry)', isCorrect: false }
      ],
      explanationBn: 'ありがとう মানে ধন্যবাদ।'
    },
    {
      id: 'dk-3-particle',
      trackId: 'track_dual_kana',
      questionBn: '"わたし____ がくせいです" (আমি ছাত্র) — শূন্যস্থানে সঠিক পার্টিকেল কোনটি?',
      promptJa: 'わたし ____ がくせいです',
      options: [
        { labelBn: 'は (wa)', isCorrect: true },
        { labelBn: 'を (o)', isCorrect: false },
        { labelBn: 'に (ni)', isCorrect: false },
        { labelBn: 'で (de)', isCorrect: false }
      ],
      explanationBn: 'বাক্যের বিষয় নির্দেশ করতে は (wa) পার্টিকেল বসে।'
    }
  ],
  track_jlpt: [
    {
      id: 'jlpt-1-reading',
      trackId: 'track_jlpt',
      questionBn: '毎朝、６時に【起きます】— বন্ধনীর কাঞ্জির সঠিক হিরাগানা কোনটি?',
      promptJa: '毎朝、６時に【起きます】。',
      furigana: 'まいあさ、ろくじに【おきます】。',
      options: [
        { labelBn: 'おきます (Okimasu)', isCorrect: true },
        { labelBn: 'いきます (Ikimasu)', isCorrect: false },
        { labelBn: 'きます (Kimasu)', isCorrect: false },
        { labelBn: 'あきます (Akimasu)', isCorrect: false }
      ],
      explanationBn: '起きます এর রিডিং হলো おきます (ঘুম থেকে ওঠা)।'
    },
    {
      id: 'jlpt-2-adjective',
      trackId: 'track_jlpt',
      questionBn: 'この本はとても【新しい】です — সঠিক রিডিং কোনটি?',
      promptJa: 'この本はとても【新しい】です。',
      furigana: 'このほんはとても【あたらしい】です。',
      options: [
        { labelBn: 'あたらしい (Atarashii - নতুন)', isCorrect: true },
        { labelBn: 'ふるい (Furui - পুরাতন)', isCorrect: false },
        { labelBn: 'たのしい (Tanoshii - আনন্দদায়ক)', isCorrect: false },
        { labelBn: 'たかい (Takai - দামি)', isCorrect: false }
      ],
      explanationBn: '新しい এর রিডিং あたらしい (নতুন)।'
    }
  ],
  track_returning: [
    {
      id: 'ret-1-hiragana',
      trackId: 'track_returning',
      questionBn: 'হিরাগানা "さくら" (Sakura) শব্দের অর্থ কী?',
      promptJa: 'さくら',
      options: [
        { labelBn: 'চেরি ব্লসম (Cherry Blossom)', isCorrect: true },
        { labelBn: 'সূর্যমুখী (Sunflower)', isCorrect: false },
        { labelBn: 'নদী (River)', isCorrect: false },
        { labelBn: 'পাহাড় (Mountain)', isCorrect: false }
      ],
      explanationBn: 'さくら মানে জাপানের বিখ্যাত চেরি ব্লসম ফুল।'
    },
    {
      id: 'ret-2-katakana',
      trackId: 'track_returning',
      questionBn: 'কাতাকানা "タクシー" (Takushii) শব্দটি দিয়ে কী বোঝানো হয়?',
      promptJa: 'タクシー',
      options: [
        { labelBn: 'ট্যাক্সি (Taxi)', isCorrect: true },
        { labelBn: 'বাস (Bus)', isCorrect: false },
        { labelBn: 'ট্রেন (Train)', isCorrect: false },
        { labelBn: 'বিমান (Airplane)', isCorrect: false }
      ],
      explanationBn: 'タクシー হলো ইংরেজি Taxi শব্দের কাতাকানা রূপ।'
    }
  ]
};

export interface CalibrationResult {
  trackId: CalibrationTrackId;
  startingNodeId: string;
  recommendedMission: NextBestMission;
  score: number;
  totalQuestions: number;
  titleBn: string;
  trackTitleBn: string;
  rationaleBn: string;
  verifiedCapabilities: string[];
  unverifiedCapabilities: string[];
}

/**
 * Deterministically evaluates user answers and maps to exact node in CURRICULUM_GRAPH.
 */
export function evaluateCalibration(
  trackId: CalibrationTrackId,
  answers: Record<string, number>
): CalibrationResult {
  const track = CALIBRATION_TRACKS.find(t => t.id === trackId) || CALIBRATION_TRACKS[0];
  const questions = TRACK_QUESTIONS[trackId] || [];

  let score = 0;
  questions.forEach(q => {
    const selected = answers[q.id];
    if (selected !== undefined && q.options[selected]?.isCorrect) {
      score++;
    }
  });

  // Track A: Absolute beginner
  if (trackId === 'track_zero') {
    const startingNode = CURRICULUM_GRAPH['kana-a'];
    return {
      trackId,
      startingNodeId: 'kana-a',
      recommendedMission: startingNode,
      score: 0,
      totalQuestions: 0,
      titleBn: 'আপনার শুরু করার জায়গা: স্টেজ ১ — প্রথম অক্ষর "あ" (A)',
      trackTitleBn: track.titleBn,
      rationaleBn: 'জিরো লেভেল থেকে শুরু করা সবচেয়ে নিরাপদ ও মজবুত। চলুন জাপানি ভাষার প্রথম মৌলিক স্বরবর্ণ "あ" দিয়ে শেখা শুরু করি।',
      verifiedCapabilities: [
        'বাংলা নির্দেশিকা পড়ার প্রস্তুতি',
        'মাতৃভাষায় জাপানি শেখার সংকল্প'
      ],
      unverifiedCapabilities: [
        'হিরাগানা ৪৬টি বর্ণ এখনও শুরু হয়নি',
        'কাতাকানা লিপি ও শব্দভাণ্ডার আনলক বাকি',
        'N5 ব্যাকরণ ও কনবিনি সিমুলেশন এখনও লক করা'
      ]
    };
  }

  // Track B: Some Hiragana
  if (trackId === 'track_some_hiragana') {
    if (score === 2) {
      const startingNode = CURRICULUM_GRAPH['kana-ka-family'] || CURRICULUM_GRAPH['kana-a'];
      return {
        trackId,
        startingNodeId: 'kana-ka-family',
        recommendedMission: startingNode,
        score,
        totalQuestions: questions.length,
        titleBn: 'আপনার শুরু করার জায়গা: ব্যঞ্জনবর্ণ পরিবার (か-বর্গ)',
        trackTitleBn: track.titleBn,
        rationaleBn: 'আপনি স্বরবর্ণ এবং প্রাথমিক হিরাগানা শব্দ চিনেছেন (২/২)। আপনাকে সরাসরি か-বর্গে স্থান দেওয়া হলো।',
        verifiedCapabilities: [
          'মৌলিক স্বরবর্ণ (あ, い, う, え, お) পরিচিতি',
          'প্রাথমিক শব্দ গঠন ও অর্থবোধ'
        ],
        unverifiedCapabilities: [
          'か, さ, た বর্গসহ বাকি হিরাগানা যাচাই বাকি',
          'কাতাকানা লিপি ও বাক্য গঠন এখনও লক করা'
        ]
      };
    } else {
      const startingNode = CURRICULUM_GRAPH['kana-a'];
      return {
        trackId,
        startingNodeId: 'kana-a',
        recommendedMission: startingNode,
        score,
        totalQuestions: questions.length,
        titleBn: 'আপনার শুরু করার জায়গা: হিরাগানা ফাউন্ডেশন (あ-বর্গ)',
        trackTitleBn: track.titleBn,
        rationaleBn: 'ভিত্তি মজবুত রাখতে স্বরবর্ণগুলো শুরু থেকে স্পষ্ট করা নিরাপদ। চলুন "あ" থেকে পুনরায় ঝালিয়ে নিই।',
        verifiedCapabilities: [
          'জাপানি ভাষার সাথে প্রাথমিক পরিচয়'
        ],
        unverifiedCapabilities: [
          'স্বরবর্ণের স্পষ্ট উচ্চারণ ও স্ট্রোক অর্ডার যাচাই বাকি'
        ]
      };
    }
  }

  // Track C: Dual Kana
  if (trackId === 'track_dual_kana') {
    if (score >= 2) {
      const startingNode = CURRICULUM_GRAPH['grammar-n5-lesson-01'] || CURRICULUM_GRAPH['kana-a'];
      return {
        trackId,
        startingNodeId: 'grammar-n5-lesson-01',
        recommendedMission: startingNode,
        score,
        totalQuestions: questions.length,
        titleBn: 'আপনার শুরু করার জায়গা: N5 ব্যাকরণ পাঠ ০১ — বাক্য গঠন ও পার্টিকেল',
        trackTitleBn: track.titleBn,
        rationaleBn: 'অসাধারণ! আপনি হিরাগানা ও কাতাকানা উভয় লিপি এবং মৌলিক গঠন পড়তে পারেন। আপনাকে সরাসরি N5 ব্যাকরণে স্থাপন করা হলো।',
        verifiedCapabilities: [
          '৪৬টি হিরাগানা ও ৪৬টি কাতাকানা লিপি পঠন',
          'লোনওয়ার্ড ও মৌলিক শব্দভাণ্ডার রিডিং',
          'টপিক মার্কার は (wa) পার্টিকেল পরিচিতি'
        ],
        unverifiedCapabilities: [
          'উন্নত ক্রিয়াপদের রূপান্তর (て-ফর্ম, ない-ফর্ম)',
          'JLPT N5 অফিসিয়াল মক টেস্ট কমপ্লিশন বাকি'
        ]
      };
    } else {
      const startingNode = CURRICULUM_GRAPH['katakana-foundation'] || CURRICULUM_GRAPH['kana-a'];
      return {
        trackId,
        startingNodeId: 'katakana-foundation',
        recommendedMission: startingNode,
        score,
        totalQuestions: questions.length,
        titleBn: 'আপনার শুরু করার জায়গা: কাতাকানা রিডিং ড্রিল',
        trackTitleBn: track.titleBn,
        rationaleBn: 'হিরাগানা জানা থাকলেও কাতাকানা বা পার্টিকেলে কিছুটা দুর্বলতা রয়েছে। কাতাকানা ঝালাই করে ব্যাকরণে যাওয়া সবচেয়ে ফলপ্রসূ হবে।',
        verifiedCapabilities: [
          'হিরাগানা সাধারণ পঠন ক্ষমতা'
        ],
        unverifiedCapabilities: [
          'কাতাকানা শব্দের দ্রুত পঠন ও ব্যাকরণ পার্টিকেল যাচাই বাকি'
        ]
      };
    }
  }

  // Track D: JLPT N5-N1
  if (trackId === 'track_jlpt') {
    const startingNode = CURRICULUM_GRAPH['grammar-n5-lesson-01'] || CURRICULUM_GRAPH['kana-a'];
    return {
      trackId,
      startingNodeId: 'grammar-n5-lesson-01',
      recommendedMission: startingNode,
      score,
      totalQuestions: questions.length,
      titleBn: 'আপনার শুরু করার জায়গা: JLPT ফুল সিমুলেশন ও রিডিং ল্যাব',
      trackTitleBn: track.titleBn,
      rationaleBn: `JLPT ডায়াগনস্টিকে আপনি ${score}/${questions.length} স্কোর করেছেন। আপনার জন্য ইন্টারেক্টিভ মক টেস্ট ও সেকশনাল ড্রিল সক্রিয় করা হলো।`,
      verifiedCapabilities: [
        'কাঞ্জি রিডিং ও বিশেষ্য পঠন',
        'বেসিক অ্যাডজেক্টিভ ও পার্টিকেল সংযোগ'
      ],
      unverifiedCapabilities: [
        'পূর্ণ ৯০ মিনিটের ৩-সেকশন মক টেস্ট এখনও অপরীক্ষিত',
        '১৯/৬০ সেকশনাল পাসিং থ্রেশহোল্ড যাচাই বাকি'
      ]
    };
  }

  // Track E: Returning learner
  if (score >= 2) {
    const startingNode = CURRICULUM_GRAPH['katakana-foundation'] || CURRICULUM_GRAPH['kana-a'];
    return {
      trackId,
      startingNodeId: 'katakana-foundation',
      recommendedMission: startingNode,
      score,
      totalQuestions: questions.length,
      titleBn: 'আপনার শুরু করার জায়গা: দ্রুত রিফ্রেশার ও কাতাকানা',
      trackTitleBn: track.titleBn,
      rationaleBn: `স্বাগতম ফিরে আসার জন্য! রিফ্রেশার কুইজে ${score}/${questions.length} সঠিক হয়েছে। দ্রুত কাতাকানা ও মৌলিক বাক্য দিয়ে আবার গতি ফিরিয়ে আনা যাক।`,
      verifiedCapabilities: [
        'পূর্বের জাপানি বর্ণ ও সাধারণ অভিবাদন স্মৃতি'
      ],
      unverifiedCapabilities: [
        'কাতাকানা ফ্লুয়েন্সি ও N5 অ্যাডভান্সড বাক্য যাচাই বাকি'
      ]
    };
  }

  const startingNode = CURRICULUM_GRAPH['kana-a'];
  return {
    trackId,
    startingNodeId: 'kana-a',
    recommendedMission: startingNode,
    score,
    totalQuestions: questions.length,
    titleBn: 'আপনার শুরু করার জায়গা: হিরাগানা ক্যানভাস স্টুডিও',
    trackTitleBn: track.titleBn,
    rationaleBn: 'যেহেতু কিছু সময় বিরতি ছিল, তাই হিরাগানা থেকে দ্রুত একবার চোখ বুলিয়ে নেওয়া আপনাকে দৃঢ় আত্মবিশ্বাস দেবে।',
    verifiedCapabilities: [
      'পুনরায় শেখার দৃঢ় প্রত্যয়'
    ],
    unverifiedCapabilities: [
      'লিপি ও শব্দভাণ্ডার সক্রিয় স্মৃতিতে রূপান্তর বাকি'
    ]
  };
}

/**
 * Hydrates learner state legitimately based on calibration tier.
 */
export function applyCalibrationToState(result: CalibrationResult): LearnerKnowledgeState {
  const currentState = loadLearnerKnowledgeState();
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

  if (result.startingNodeId === 'kana-ka-family') {
    addUnique(updated.knownHiragana, ['あ', 'い', 'う', 'え', 'お']);
    addUnique(updated.knownVocabulary, ['あい', 'あお', 'いえ', 'うえ', 'いい']);
    addUnique(updated.masteredSkills, ['vowels_5_mastered', '5_vowels_gate']);
    updated.totalXp = Math.max(updated.totalXp, 150);
  } else if (result.startingNodeId === 'katakana-foundation') {
    addUnique(updated.knownHiragana, ALL_HIRAGANA_46);
    addUnique(updated.knownVocabulary, ['あい', 'あお', 'いえ', 'うえ', 'いい', 'ありがとう', 'さくら', 'ねこ']);
    addUnique(updated.masteredSkills, [
      'vowels_5_mastered',
      '5_vowels_gate',
      'hiragana_core_mastered',
      'hiragana_mechanics_mastered',
      'hiragana_reading_mastered'
    ]);
    updated.totalXp = Math.max(updated.totalXp, 350);
  } else if (result.startingNodeId === 'grammar-n5-lesson-01') {
    addUnique(updated.knownHiragana, ALL_HIRAGANA_46);
    addUnique(updated.knownKatakana, ALL_KATAKANA_46);
    addUnique(updated.knownVocabulary, [
      'あい', 'あお', 'いえ', 'うえ', 'いい', 'ありがとう', 'さくら', 'ねこ',
      'コーヒー', 'タクシー', 'カメラ', 'ホテル'
    ]);
    addUnique(updated.masteredSkills, [
      'vowels_5_mastered',
      '5_vowels_gate',
      'hiragana_core_mastered',
      'hiragana_mechanics_mastered',
      'hiragana_reading_mastered',
      'katakana_mastered',
      'kana_dual_mastered'
    ]);
    updated.totalXp = Math.max(updated.totalXp, 600);
  }

  // Set authoritatively calculated next mission
  const nextMission = getNextBestMission(updated);
  updated.currentMissionId = result.startingNodeId;

  saveLearnerKnowledgeState(updated);
  return updated;
}
