// src/core/curriculum/curriculumGraph.ts
// Canonical NIHOMI Curriculum Graph — 14-Phase Autonomous Mastery Lattice
// Single Source of Truth for all Curriculum Progression & Prerequisites

export type CurriculumPhase =
  | 'phase_0_zero_entry'
  | 'phase_1_hiragana_foundation'
  | 'phase_2_hiragana_core'
  | 'phase_3_hiragana_mechanics'
  | 'phase_4_hiragana_reading_mastery'
  | 'phase_5_katakana_foundation'
  | 'phase_6_katakana_mastery'
  | 'phase_7_reading_foundation'
  | 'phase_8_vocabulary_os'
  | 'phase_9_kanji_vocabulary'
  | 'phase_10_grammar'
  | 'phase_11_sentence_building'
  | 'phase_12_listening_speaking'
  | 'phase_13_real_life_missions'
  | 'phase_14_japan_readiness';

export type CurriculumNodeType =
  | 'kana'
  | 'word_unlock'
  | 'milestone_quiz'
  | 'reading_drill'
  | 'katakana'
  | 'vocabulary'
  | 'kanji'
  | 'grammar'
  | 'sentence'
  | 'listening_speaking'
  | 'real_life'
  | 'mistake_repair';

export interface CurriculumNode {
  id: string;
  phase: CurriculumPhase;
  type: CurriculumNodeType;
  titleBn: string;
  subTitleBn: string;
  actionLabelBn: string;
  whyItMattersBn: string;
  japanConnectionBn: string;
  targetChar?: string;
  targetWord?: string;
  targetLessonId?: string;
  prerequisites: string[]; // IDs of preceding nodes that must be mastered
  requiredKana?: string[];
  requiredVocabulary?: string[];
  requiredSkills?: string[];
  unlocks: string[];
  viewRoute: string;
  viewParams?: Record<string, any>;
  xpReward: number;
}

/**
 * 14 Canonical Curriculum Phases metadata for roadmap & progress tracking
 */
export const CURRICULUM_PHASES_META: Record<
  CurriculumPhase,
  {
    phaseNumber: number;
    titleBn: string;
    titleJa: string;
    descriptionBn: string;
    isFoundation: boolean;
  }
> = {
  phase_0_zero_entry: {
    phaseNumber: 0,
    titleBn: 'জিরো জাপানিজ প্রবেশদ্বার',
    titleJa: 'ゼロからの出発',
    descriptionBn: 'কোনো পূর্ব অভিজ্ঞতা ছাড়াই জাপানি ভাষা শেখার প্রাথমিক পরিচিতি।',
    isFoundation: true,
  },
  phase_1_hiragana_foundation: {
    phaseNumber: 1,
    titleBn: 'হিরাগানা স্বরবর্ণ ভিত্তি (あいうえお)',
    titleJa: '五十音・母音の基礎',
    descriptionBn: '৫টি মৌলিক স্বরবর্ণ, স্ট্রোক অর্ডার এবং স্বরবর্ণ দিয়ে গঠিত প্রথম শব্দসমষ্টি।',
    isFoundation: true,
  },
  phase_2_hiragana_core: {
    phaseNumber: 2,
    titleBn: 'হিরাগানা মূল ব্যঞ্জনবর্ণ (か〜ん)',
    titleJa: '五十音・子音の完成',
    descriptionBn: 'ক-বর্গ থেকে ন পর্যন্ত অবশিষ্ট ব্যঞ্জনবর্ণের ধারাবাহিক ও নিয়ন্ত্রিত পাঠ।',
    isFoundation: true,
  },
  phase_3_hiragana_mechanics: {
    phaseNumber: 3,
    titleBn: 'হিরাগানা ধ্বনিতত্ত্ব ও বিশেষ নিয়ম',
    titleJa: '濁音・半濁音・拗音・促音',
    descriptionBn: 'দাকুতেন, হান্দাকুতেন, ছোট っ (সোকুওন) ও যুক্তধ্বনি (ゃ ゅ ょ)।',
    isFoundation: true,
  },
  phase_4_hiragana_reading_mastery: {
    phaseNumber: 4,
    titleBn: 'হিরাগানা সাবলীল পঠন দক্ষতা',
    titleJa: 'ひらがな読解マスター',
    descriptionBn: 'শব্দজোড়া, ছোট বাক্যাংশ এবং প্রাকৃতিক ছন্দে পড়ার অভ্যাস।',
    isFoundation: true,
  },
  phase_5_katakana_foundation: {
    phaseNumber: 5,
    titleBn: 'কাতাকানা স্বরবর্ণ ও পরিচিতি',
    titleJa: 'カタカナ基礎',
    descriptionBn: 'বিদেশি শব্দ ও ব্র্যান্ডের নাম লেখার জন্য কাতাকানার সূচনা।',
    isFoundation: true,
  },
  phase_6_katakana_mastery: {
    phaseNumber: 6,
    titleBn: 'কাতাকানা সম্পূর্ণ বর্ণমালা ও লোনওয়ার্ড',
    titleJa: 'カタカナ完全習得',
    descriptionBn: 'টোকিওর ক্যাফে, মেনু ও সাইনবোর্ডের ইংরেজি-মূল শব্দ পঠন।',
    isFoundation: true,
  },
  phase_7_reading_foundation: {
    phaseNumber: 7,
    titleBn: 'দ্বৈত কানা রিডিং ও বাক্য বিভাজন',
    titleJa: '総合読解基礎',
    descriptionBn: 'হিরাগানা ও কাতাকানা একসাথে পড়ে বাক্য পৃথকীকরণ ও ছন্দ বোঝা।',
    isFoundation: true,
  },
  phase_8_vocabulary_os: {
    phaseNumber: 8,
    titleBn: 'ভোকাবুলারি ওএস (বাস্তব শব্দভাণ্ডার)',
    titleJa: '基本語彙システム',
    descriptionBn: 'মুখস্থ নয়—প্রাকৃতিক পুনরাবৃত্তি ও ব্যবহারের মাধ্যমে শব্দ আত্মস্থ করা।',
    isFoundation: false,
  },
  phase_9_kanji_vocabulary: {
    phaseNumber: 9,
    titleBn: 'কাঞ্জি ও শব্দার্থ মেলবন্ধন',
    titleJa: '漢字と語彙の統合',
    descriptionBn: 'পরিচিত শব্দের সাথে কাঞ্জির ছবি ও অর্থের স্বাভাবিক সংযোগ।',
    isFoundation: false,
  },
  phase_10_grammar: {
    phaseNumber: 10,
    titleBn: 'জাপানি ব্যাকরণ ও বাক্য কাঠামো',
    titleJa: '文法と文型',
    descriptionBn: 'রিডিং ভিত্তি অর্জনের পরেই ব্যাকরণ প্যাটার্ন ও কণা (Particles) প্রয়োগ।',
    isFoundation: false,
  },
  phase_11_sentence_building: {
    phaseNumber: 11,
    titleBn: 'স্বাধীন বাক্য গঠন ও প্রকাশভঙ্গি',
    titleJa: '短文構成・表現',
    descriptionBn: 'নিজের চিন্তা ও প্রতিদিনের কথা স্বতঃস্ফূর্ত জাপানিজে তৈরি করা।',
    isFoundation: false,
  },
  phase_12_listening_speaking: {
    phaseNumber: 12,
    titleBn: 'লিসেনিং ও স্পিকিং রিফ্লেক্স',
    titleJa: '聴解・会話反射神経',
    descriptionBn: 'দ্রুত জাপানিজ শুনে সঙ্গে সঙ্গে প্রতিক্রিয়া জানানোর ক্ষমতা।',
    isFoundation: false,
  },
  phase_13_real_life_missions: {
    phaseNumber: 13,
    titleBn: 'বাস্তব জাপান লাইফ মিশন',
    titleJa: 'リアルジャパン任務',
    descriptionBn: 'কনবিনি, ট্রেন স্টেশন, রেস্তোরাঁ ও বাইতোর বাস্তব পরিস্থিতি জয়।',
    isFoundation: false,
  },
  phase_14_japan_readiness: {
    phaseNumber: 14,
    titleBn: 'জাপান রেডিনেস (Japan Ready)',
    titleJa: '日本定住・就職即応',
    descriptionBn: 'জাপানে আত্মবিশ্বাসের সাথে বসবাস ও কাজ করার চূড়ান্ত প্রস্তুতি।',
    isFoundation: false,
  },
};

/**
 * Authoritative Curriculum Nodes
 * Defines explicit prerequisite chains to guarantee zero premature jumps.
 */
export const CURRICULUM_GRAPH: Record<string, CurriculumNode> = {
  // Phase 0: Zero Entry
  'zero-entry': {
    id: 'zero-entry',
    phase: 'phase_0_zero_entry',
    type: 'real_life',
    titleBn: 'জিরো থেকে জাপানিজ যাত্রা শুরু',
    subTitleBn: 'কোনো ভয় ছাড়াই প্রথম ধাপ',
    actionLabelBn: 'যাত্রা শুরু করি →',
    whyItMattersBn: 'জাপানি ভাষা একদম জিরো থেকে শুরু করা সম্ভব এবং প্রতিটি ধাপ যুক্তিসঙ্গত।',
    japanConnectionBn: 'টোকিওর মাটিতে পা রাখার স্বপ্ন শুরু হয় এই প্রথম পদক্ষেপ দিয়ে।',
    prerequisites: [],
    unlocks: ['kana-a'],
    viewRoute: 'journey',
    xpReward: 10,
  },

  // Phase 1: Hiragana Foundation (5 Vowels)
  'kana-a': {
    id: 'kana-a',
    phase: 'phase_1_hiragana_foundation',
    type: 'kana',
    titleBn: "ভিত্তি স্বরবর্ণ 'あ' (আ) জয় করা",
    subTitleBn: 'জাপানি ভাষার প্রথম ও প্রধান ধ্বনি',
    actionLabelBn: "'あ' শেখা শুরু করি →",
    whyItMattersBn: "সমস্ত জাপানি শব্দের ভিত্তিমূল হলো 'あ'। কোনো জটিলতা ছাড়াই ৩টি সহজ টানে লেখা সম্ভব।",
    japanConnectionBn: "টোকিও পৌঁছালে 'ありがとう' (ধন্যবাদ)-এর প্রথম ধ্বনিতেই এটি শুনতে পাবে।",
    targetChar: 'あ',
    prerequisites: ['zero-entry'],
    requiredKana: [],
    unlocks: ['kana-i'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', char: 'あ' },
    xpReward: 20,
  },

  'kana-i': {
    id: 'kana-i',
    phase: 'phase_1_hiragana_foundation',
    type: 'kana',
    titleBn: "দ্বিতীয় স্বরবর্ণ 'い' (ই) শেখা",
    subTitleBn: 'সমান্তরাল দুটি টান ও ছোট্ট হুক',
    actionLabelBn: "'い' শেখা শুরু করি →",
    whyItMattersBn: "আগে শেখা 'あ' আর নতুন 'い' মিলে তৈরি হবে তোমার জীবনের প্রথম জাপানি শব্দ!",
    japanConnectionBn: "জাপানি ভাষায় খাঁটি স্বরবর্ণ দিয়ে তৈরি শব্দের মধ্যে এটি অন্যতম প্রধান।",
    targetChar: 'い',
    prerequisites: ['kana-a'],
    requiredKana: ['あ'],
    unlocks: ['word-ai'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', char: 'い' },
    xpReward: 20,
  },

  'word-ai': {
    id: 'word-ai',
    phase: 'phase_1_hiragana_foundation',
    type: 'word_unlock',
    titleBn: "প্রথম শব্দ 'あい' (ভালোবাসা) আনলক",
    subTitleBn: 'দুটি জানা বর্ণ দিয়ে গঠিত খাঁটি স্বরবর্ণ শব্দ',
    actionLabelBn: "'あい' শব্দ অনুশীলন করি →",
    whyItMattersBn: "'あ' এবং 'い' যুক্ত হয়ে তৈরি হলো তোমার জীবনের প্রথম আসল জাপানি শব্দ: あい (Ai - ভালোবাসা)।",
    japanConnectionBn: "কোনো অপরিচিত ব্যঞ্জনবর্ণ ছাড়াই দুটি পরিচিত ধ্বনির মিলন।",
    targetWord: 'あい',
    prerequisites: ['kana-a', 'kana-i'],
    requiredKana: ['あ', 'い'],
    requiredVocabulary: ['あい'],
    unlocks: ['kana-u'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', char: 'い', step: 'apply' },
    xpReward: 25,
  },

  'kana-u': {
    id: 'kana-u',
    phase: 'phase_1_hiragana_foundation',
    type: 'kana',
    titleBn: "তৃতীয় স্বরবর্ণ 'う' (উ) ও 'いう' (বলা) শব্দ আনলক",
    subTitleBn: 'বামে ঝুঁকে পড়া সুন্দর ২-টানের বর্ণ',
    actionLabelBn: "'う' শেখা শুরু করি →",
    whyItMattersBn: "'い' আর 'う' মিলে তৈরি হয় দৈনন্দিন ক্রিয়াপদ 'いう' (বলা) এবং 'あう' (দেখা করা)।",
    japanConnectionBn: "টোকিওর রেস্তোরাঁয় বা বন্ধুদের সাথে কথা বলতে 'いう' প্রতিনিয়ত কাজে লাগে।",
    targetChar: 'う',
    targetWord: 'いう',
    prerequisites: ['word-ai'],
    requiredKana: ['あ', 'い'],
    unlocks: ['kana-e'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', char: 'う' },
    xpReward: 20,
  },

  'kana-e': {
    id: 'kana-e',
    phase: 'phase_1_hiragana_foundation',
    type: 'kana',
    titleBn: "চতুর্থ স্বরবর্ণ 'え' (এ) ও 'いえ' (বাড়ি) / 'うえ' (উপরে) আনলক",
    subTitleBn: 'জেড (Z) আকৃতির ছন্দময় জাপানি বর্ণ',
    actionLabelBn: "'え' শেখা শুরু করি →",
    whyItMattersBn: "'いえ' (Ie - বাড়ি) এবং 'うえ' (Ue - উপরে) দুটি অতিপ্রয়োজনীয় শব্দ আনলক হবে।",
    japanConnectionBn: "জাপানে বাসা খোঁজা বা দিকনির্দেশনা বোঝার মূল শব্দ 'いえ'।",
    targetChar: 'え',
    targetWord: 'いえ',
    prerequisites: ['kana-u'],
    requiredKana: ['あ', 'い', 'う'],
    unlocks: ['kana-o'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', char: 'え' },
    xpReward: 20,
  },

  'kana-o': {
    id: 'kana-o',
    phase: 'phase_1_hiragana_foundation',
    type: 'kana',
    titleBn: "পঞ্চম স্বরবর্ণ 'お' (ও) ও 'あお' (নীল) আনলক",
    subTitleBn: 'লুপ ও ফোঁটাযুক্ত বৃত্তাকার বর্ণ',
    actionLabelBn: "'お' শেখা শুরু করি →",
    whyItMattersBn: "৫টি স্বরবর্ণ পূর্ণ হবে এবং 'あお' (Ao - নীল) ও 'おおい' (অনেক) শব্দ আয়ত্তে আসবে।",
    japanConnectionBn: "টোকিওর আকাশ ও নীল সাইনবোর্ডে 'あお' সর্বত্র দৃশ্যমান।",
    targetChar: 'お',
    targetWord: 'あお',
    prerequisites: ['kana-e'],
    requiredKana: ['あ', 'い', 'う', 'え'],
    unlocks: ['vowel-mastery-gate'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', char: 'お' },
    xpReward: 25,
  },

  'vowel-mastery-gate': {
    id: 'vowel-mastery-gate',
    phase: 'phase_1_hiragana_foundation',
    type: 'milestone_quiz',
    titleBn: '৫-স্বরবর্ণ মাস্টার রিভিউ কুইজ',
    subTitleBn: 'あ, い, う, え, お এবং তাদের সমন্বয়ে গঠিত শব্দের চূড়ান্ত যাচাই',
    actionLabelBn: 'রিভিউ কুইজ দিই →',
    whyItMattersBn: 'মৌলিক স্বরবর্ণ মজবুত থাকলে পরবর্তী সব ব্যঞ্জনবর্ণ খুব দ্রুত মুখস্থ হয়ে যায়।',
    japanConnectionBn: 'জাপানি উচ্চারণের শুদ্ধতা এই ৫টি স্বরবর্ণের ওপরই নির্ভরশীল।',
    prerequisites: ['kana-o'],
    requiredKana: ['あ', 'い', 'う', 'え', 'お'],
    requiredSkills: ['vowels_5_mastered'],
    unlocks: ['konbini-mission-01', 'kana-ka-family'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1', quiz: 'vowels' },
    xpReward: 50,
  },

  'konbini-mission-01': {
    id: 'konbini-mission-01',
    phase: 'phase_1_hiragana_foundation',
    type: 'real_life',
    titleBn: 'টোকিও সেভেন-ইলেভেন কনবিনি মিশন',
    subTitleBn: 'ক্যাশিয়ার কেনজি-সান থেকে ওনিগিরি কেনার বাস্তব সংলাপ',
    actionLabelBn: 'কনবিনি মিশনে প্রবেশ করি →',
    whyItMattersBn: 'শেখা জাপানি শব্দ বাস্তবে কেনাকাটায় কাজে লাগিয়ে আত্মবিশ্বাস বাড়ানো।',
    japanConnectionBn: 'টোকিওতে যেকোনো কনবিনিতে কেনাকাটার জীবন্ত পরিস্থিতি।',
    prerequisites: ['vowel-mastery-gate'],
    requiredSkills: ['vowels_5_mastered'],
    unlocks: ['kana-ka-family'],
    viewRoute: 'journey',
    xpReward: 60,
  },

  // Phase 2: Hiragana Core (か〜ん)
  'kana-ka-family': {
    id: 'kana-ka-family',
    phase: 'phase_2_hiragana_core',
    type: 'kana',
    titleBn: "'か' সিরিজ: ক-বর্গের বর্ণমালা (か、き、く、け、こ)",
    subTitleBn: 'ক-বর্গের প্রথম ব্যঞ্জনবর্ণের যাত্রা',
    actionLabelBn: "'か' সিরিজ শুরু করি →",
    whyItMattersBn: "'か' যোগ হলেই 'あかい' (লাল), 'かお' (মুখ) সহ ডজনখানেক নতুন শব্দ আনলক হবে!",
    japanConnectionBn: 'জাপানের সাইনবোর্ড ও ট্রেনের স্টেশনে সবচেয়ে বেশি ব্যবহৃত বর্ণমালা।',
    targetChar: 'か',
    prerequisites: ['vowel-mastery-gate'],
    requiredSkills: ['vowels_5_mastered'],
    unlocks: ['kana-sa-family'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-kana-ka' },
    xpReward: 40,
  },

  'kana-sa-family': {
    id: 'kana-sa-family',
    phase: 'phase_2_hiragana_core',
    type: 'kana',
    titleBn: "'さ' সিরিজ: স-বর্গের বর্ণমালা (さ、し、す、せ、そ)",
    subTitleBn: 'স-বর্গের বর্ণ ও শব্দ গঠন',
    actionLabelBn: "'さ' সিরিজ শিখি →",
    whyItMattersBn: "'あさ' (সকাল), 'すし' (সুশি) এবং 'すき' (পছন্দ) শব্দগুলো এই ধাপে আনলক হবে।",
    japanConnectionBn: 'জাপানি খাবারের নাম পড়তে এই সিরিজ অপরিহার্য।',
    targetChar: 'さ',
    prerequisites: ['kana-ka-family'],
    requiredKana: ['か', 'き', 'く', 'け', 'こ'],
    unlocks: ['kana-core-complete'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-kana-sa' },
    xpReward: 40,
  },

  'kana-core-complete': {
    id: 'kana-core-complete',
    phase: 'phase_2_hiragana_core',
    type: 'milestone_quiz',
    titleBn: 'হিরাগানা ৪৬ বর্ণমালা সম্পূর্ণতা যাচাই',
    subTitleBn: 'সবগুলো মৌলিক বর্ণের সম্মিলিত টেস্ট',
    actionLabelBn: 'সম্পূর্ণ হিরাগানা টেস্ট দিই →',
    whyItMattersBn: '৪৭টি মৌলিক বর্ণ স্পষ্ট চিনতে পারলেই যেকোনো জাপানি শব্দ নির্ভুল পড়া সম্ভব।',
    japanConnectionBn: 'জাপানের যেকোনো প্রাথমিক পাঠ্যবই পড়ার সক্ষমতা।',
    prerequisites: ['kana-sa-family'],
    requiredSkills: ['hiragana_core_mastered'],
    unlocks: ['hiragana-mechanics'],
    viewRoute: 'quizzes',
    xpReward: 75,
  },

  // Phase 3: Mechanics
  'hiragana-mechanics': {
    id: 'hiragana-mechanics',
    phase: 'phase_3_hiragana_mechanics',
    type: 'reading_drill',
    titleBn: 'দাকুতেন ও যুক্তধ্বনি (が・ざ・だ・ば・ぱ & ゃ・ゅ・ょ)',
    subTitleBn: 'ধ্বনি পরিবর্তন ও বিশেষ উচ্চারণের নিয়ম',
    actionLabelBn: 'যুক্তধ্বনি আয়ত্ত করি →',
    whyItMattersBn: 'শব্দে অতিরিক্ত গাম্ভীর্য ও কোমলতা আনতে দাকুতেন ও যুক্তধ্বনি বোঝা জরুরি।',
    japanConnectionBn: 'টোকিও সাবওয়ের স্টেশনগুলোর নাম পড়তে এটি আবশ্যক।',
    prerequisites: ['kana-core-complete'],
    requiredSkills: ['hiragana_core_mastered'],
    unlocks: ['hiragana-reading-mastery'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-kana-mechanics' },
    xpReward: 50,
  },

  // Phase 4: Reading Mastery
  'hiragana-reading-mastery': {
    id: 'hiragana-reading-mastery',
    phase: 'phase_4_hiragana_reading_mastery',
    type: 'reading_drill',
    titleBn: 'সাবলীল হিরাগানা রিডিং প্র্যাকটিস',
    subTitleBn: 'শব্দ ও ছোট ছোট বাক্যের নিরবচ্ছিন্ন পঠন',
    actionLabelBn: 'রিডিং প্র্যাকটিস করি →',
    whyItMattersBn: 'অক্ষর আলাদা আলাদা চেনার বদলে একনজরে সম্পূর্ণ শব্দ পড়ার মানসিক রিফ্লেক্স তৈরি।',
    japanConnectionBn: 'সাইনবোর্ড ও মেনু এক নজরে পড়ার আত্মবিশ্বাস।',
    prerequisites: ['hiragana-mechanics'],
    requiredSkills: ['hiragana_mechanics_mastered'],
    unlocks: ['katakana-foundation'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-kana-reading' },
    xpReward: 60,
  },

  // Phase 5 & 6: Katakana
  'katakana-foundation': {
    id: 'katakana-foundation',
    phase: 'phase_5_katakana_foundation',
    type: 'katakana',
    titleBn: 'কাতাকানা স্বরবর্ণ ও পরিচিতি (アイウエオ)',
    subTitleBn: 'বিদেশি শব্দ লেখার জাপানি লিপি',
    actionLabelBn: 'কাতাকানা শুরু করি →',
    whyItMattersBn: 'টোকিওর ক্যাফেতে কফি, পানি ও মোবাইল কেনার জন্য কাতাকানা অপরিহার্য।',
    japanConnectionBn: 'বিদেশি বংশোদ্ভূতদের নাম ও দেশের নাম কাতাকানায় লেখা হয়।',
    prerequisites: ['hiragana-reading-mastery'],
    requiredSkills: ['hiragana_reading_mastered'],
    unlocks: ['katakana-mastery'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-katakana-vowels' },
    xpReward: 50,
  },

  'katakana-mastery': {
    id: 'katakana-mastery',
    phase: 'phase_6_katakana_mastery',
    type: 'katakana',
    titleBn: 'কাতাকানা পূর্ণাঙ্গ পঠন ও লোনওয়ার্ড',
    subTitleBn: 'দৈনন্দিন কাতাকানা শব্দভাণ্ডার',
    actionLabelBn: 'কাতাকানা সম্পূর্ণ করি →',
    whyItMattersBn: 'কম্পিউটার, ইন্টারনেট, ভিসা ও ব্যাংক ফরম পূরণে কাতাকানা অপরিহার্য।',
    japanConnectionBn: 'জাপানের আধুনিক প্রযুক্তিনির্ভর জীবনের প্রধান লিপি।',
    prerequisites: ['katakana-foundation'],
    requiredSkills: ['katakana_foundation_mastered'],
    unlocks: ['reading-foundation-complete'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-katakana-core' },
    xpReward: 70,
  },

  // Phase 7: Reading Foundation Complete
  'reading-foundation-complete': {
    id: 'reading-foundation-complete',
    phase: 'phase_7_reading_foundation',
    type: 'reading_drill',
    titleBn: 'দ্বৈত কানা সমন্বিত রিডিং টেস্ট',
    subTitleBn: 'হিরাগানা + কাতাকানা সমন্বয়ে গঠিত টেক্সট রিডিং',
    actionLabelBn: 'রিডিং টেস্ট দিই →',
    whyItMattersBn: 'ব্যাকরণে প্রবেশ করার আসল চাবিকাঠি—উভয় বর্ণমালা পড়তে পারার সনদ।',
    japanConnectionBn: 'বাস্তব জাপানি বাক্যের স্বাভাবিক রূপের সাথে পরিচয়।',
    prerequisites: ['katakana-mastery'],
    requiredSkills: ['kana_dual_mastered'],
    unlocks: ['grammar-n5-lesson-01'],
    viewRoute: 'quizzes',
    xpReward: 80,
  },

  // Phase 10: Grammar (Begins ONLY after Reading Foundation is unlocked!)
  'grammar-n5-lesson-01': {
    id: 'grammar-n5-lesson-01',
    phase: 'phase_10_grammar',
    type: 'grammar',
    titleBn: 'ব্যাকরণ পাঠ ০১: আত্মপরিচয় ও কণা は (wa), です (desu)',
    subTitleBn: 'Minna no Nihongo Lesson 1 Grammar',
    actionLabelBn: 'লেসন ০১ ব্যাকরণ শিখি →',
    whyItMattersBn: 'প্রথমবারের মতো সম্পূর্ণ ব্যাকরণ কাঠামো দিয়ে নিজের পরিচয় তৈরি করা।',
    japanConnectionBn: 'জাপানে যে কাউকে প্রথম সম্ভাষণ জানানোর আনুষ্ঠানিক নিয়ম।',
    targetLessonId: 'n5-l1-grammar',
    prerequisites: ['reading-foundation-complete'],
    requiredSkills: ['kana_dual_mastered', 'reading_foundation_verified'],
    unlocks: ['grammar-n5-lesson-02'],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l1-grammar' },
    xpReward: 80,
  },

  'grammar-n5-lesson-02': {
    id: 'grammar-n5-lesson-02',
    phase: 'phase_10_grammar',
    type: 'grammar',
    titleBn: 'ব্যাকরণ পাঠ ০২: বস্তু নির্দেশক (これ、それ、あれ)',
    subTitleBn: 'Minna no Nihongo Lesson 2 Grammar',
    actionLabelBn: 'লেসন ০২ শুরু করি →',
    whyItMattersBn: 'কোনো জিনিসের নাম জানতে ও কেনাকাটায় নির্দেশ করতে এই প্যাটার্ন ব্যবহৃত হয়।',
    japanConnectionBn: 'টোকিওর দোকানে যেকোনো পণ্য হাতে নিয়ে জিজ্ঞাসা করার ভাষা।',
    targetLessonId: 'n5-l2',
    prerequisites: ['grammar-n5-lesson-01'],
    requiredSkills: ['grammar_n5_l1_mastered'],
    unlocks: [],
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l2' },
    xpReward: 90,
  },
};
