// src/core/curriculum/journeyEngine.ts
// Canonical Journey Engine — "Next Best Mission" Determinator

import { LearnerKnowledgeState } from './learnerKnowledgeState';

export interface NextBestMission {
  id: string;
  type: 'kana' | 'word_unlock' | 'milestone_quiz' | 'reading_drill' | 'konbini_simulation' | 'lesson_module' | 'mistake_repair';
  titleBn: string;
  subTitleBn: string;
  actionLabelBn: string;
  whyItMattersBn: string;
  japanConnectionBn: string;
  targetChar?: string;
  targetWord?: string;
  targetLessonId?: string;
  viewRoute: string;
  viewParams?: Record<string, any>;
  xpReward: number;
}

const HIRAGANA_CANONICAL_ORDER = [
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

/**
 * Computes the single most pedagogically useful next action for the learner.
 * Never makes the learner guess what to do next.
 */
export function getNextBestMission(state: LearnerKnowledgeState): NextBestMission {
  // 1. Priority 0: Unresolved repeated mistakes trigger supportive repair drill
  const unresolvedMistakes = state.recentMistakes.filter(m => !m.resolved);
  if (unresolvedMistakes.length >= 2) {
    const recent = unresolvedMistakes[0];
    return {
      id: `repair-${recent.item}`,
      type: 'mistake_repair',
      titleBn: `'${recent.item}' বিশেষ রিভিশন ও প্র্যাকটিস`,
      subTitleBn: 'একটু থেমে বিভ্রান্তি দূর করে আবার ঝালিয়ে নিই',
      actionLabelBn: 'রিভিশন শুরু করি →',
      whyItMattersBn: 'ভুল হওয়া শেখার সবচেয়ে স্বাভাবিক ও জরুরি অংশ। একবার স্পষ্ট করে নিলেই আত্মবিশ্বাস ফিরে আসবে।',
      japanConnectionBn: 'সঠিক বর্ণ চেনা টোকিওর সাবওয়ে ও দোকানের সাইনবোর্ড পড়ার আসল চাবিকাঠি।',
      targetChar: recent.item,
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 15
    };
  }

  // 2. Vowel Foundation Ladder
  const known = new Set(state.knownHiragana);

  if (!known.has('あ')) {
    return {
      id: 'mission-001-a',
      type: 'kana',
      titleBn: "ভিত্তি স্বরবর্ণ 'あ' (আ) জয় করা",
      subTitleBn: 'জাপানি ভাষার প্রথম ও প্রধান ধ্বনি',
      actionLabelBn: "'あ' শেখা শুরু করি →",
      whyItMattersBn: "সমস্ত জাপানি শব্দের ভিত্তিমূল হলো 'あ'। কোনো জটিলতা ছাড়াই ৩টি সহজ টানে লেখা সম্ভব।",
      japanConnectionBn: "টোকিও পৌঁছালে 'ありがとう' (ধন্যবাদ)-এর প্রথম ধ্বনিতেই এটি শুনতে পাবে।",
      targetChar: 'あ',
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 20
    };
  }

  if (!known.has('い')) {
    return {
      id: 'mission-002-i',
      type: 'word_unlock',
      titleBn: "দ্বিতীয় স্বরবর্ণ 'い' ও প্রথম শব্দ 'あい' (ভালোবাসা) আনলক",
      subTitleBn: 'দুটি বর্ণ যুক্ত করে জীবনের প্রথম আসল জাপানি শব্দ গঠন',
      actionLabelBn: 'প্রথম শব্দ আনলক করি →',
      whyItMattersBn: "আগে শেখা 'あ' আর নতুন 'い' মিলে তৈরি হবে তোমার প্রথম জাপানি শব্দ!",
      japanConnectionBn: "জাপানি ভাষায় খাঁটি স্বরবর্ণ দিয়ে শত শত দৈনন্দিন শব্দ তৈরি হয়।",
      targetChar: 'い',
      targetWord: 'あい',
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 25
    };
  }

  if (!known.has('う')) {
    return {
      id: 'mission-003-u',
      type: 'kana',
      titleBn: "তৃতীয় স্বরবর্ণ 'う' ও 'いう' (বলা) শব্দ আনলক",
      subTitleBn: 'বামে ঝুঁকে পড়া সুন্দর ২-টানের বর্ণ',
      actionLabelBn: "'う' শেখা শুরু করি →",
      whyItMattersBn: "'い' আর 'う' মিলে তৈরি হয় দৈনন্দিন ক্রিয়াপদ 'いう' (বলা / Say)।",
      japanConnectionBn: "টোকিওর রেস্তোরাঁয় বা বন্ধুদের সাথে কথা বলতে 'いう' প্রতিনিয়ত কাজে লাগে।",
      targetChar: 'う',
      targetWord: 'いう',
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 20
    };
  }

  if (!known.has('え')) {
    return {
      id: 'mission-004-e',
      type: 'kana',
      titleBn: "চতুর্থ স্বরবর্ণ 'え' ও 'いえ' (বাড়ি) / 'うえ' (উপরে) আনলক",
      subTitleBn: 'জেড (Z) আকৃতির ছন্দময় জাপানি বর্ণ',
      actionLabelBn: "'え' শেখা শুরু করি →",
      whyItMattersBn: "'いえ' (Ie - বাড়ি) এবং 'うえ' (Ue - উপরে) দুটি অতিপ্রয়োজনীয় শব্দ আনলক হবে।",
      japanConnectionBn: "জাপানে বাসা খোঁজা বা দিকনির্দেশনা বোঝার মূল শব্দ 'いえ'।",
      targetChar: 'え',
      targetWord: 'いえ',
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 20
    };
  }

  if (!known.has('お')) {
    return {
      id: 'mission-005-o',
      type: 'kana',
      titleBn: "পঞ্চম স্বরবর্ণ 'お' ও 'あお' (নীল) / 'おおい' (অনেক) আনলক",
      subTitleBn: 'লুপ ও ফোঁটাযুক্ত বৃত্তাকার বর্ণ',
      actionLabelBn: "'お' শেখা শুরু করি →",
      whyItMattersBn: "৫টি স্বরবর্ণ পূর্ণ হবে এবং 'あお' (Ao - নীল) শব্দটি আয়ত্তে আসবে।",
      japanConnectionBn: "টোকিওর আকাশ ও নীল সাইনবোর্ডে 'あお' সর্বত্র দৃশ্যমান।",
      targetChar: 'お',
      targetWord: 'あお',
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 25
    };
  }

  // 3. 5-Vowels mastered -> Check Milestone Quiz completion
  const hasPassedVowelGate = state.masteredSkills.includes('5_vowels_gate') || 
    (typeof window !== 'undefined' && localStorage.getItem('nihomi_foundation_completed') === 'true');

  if (!hasPassedVowelGate) {
    return {
      id: 'mission-006-vowel-gate',
      type: 'milestone_quiz',
      titleBn: '৫-স্বরবর্ণ মাস্টার রিভিউ কুইজ',
      subTitleBn: 'あ, い, う, え, お এবং তাদের সমন্বয়ে গঠিত শব্দের চূড়ান্ত যাচাই',
      actionLabelBn: 'রিভিউ কুইজ দিই →',
      whyItMattersBn: 'মৌলিক স্বরবর্ণ মজবুত থাকলে পরবর্তী সব ব্যঞ্জনবর্ণ খুব দ্রুত মুখস্থ হয়ে যায়।',
      japanConnectionBn: 'জাপানি উচ্চারণের শুদ্ধতা এই ৫টি স্বরবর্ণের ওপরই নির্ভরশীল।',
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1' },
      xpReward: 50
    };
  }

  // 4. Tokyo Konbini Scenario & Real-Life Practice
  const hasDoneKonbini = state.masteredSkills.includes('konbini_mission_1');
  if (!hasDoneKonbini) {
    return {
      id: 'mission-007-konbini',
      type: 'konbini_simulation',
      titleBn: 'টোকিও সেভেন-ইলেভেন কনবিনি মিশন',
      subTitleBn: 'ক্যাশিয়ার কেনজি-সান থেকে ওনিগিরি কেনার বাস্তব সংলাপ',
      actionLabelBn: 'কনবিনি মিশনে প্রবেশ করি →',
      whyItMattersBn: 'শেখা জাপানি শব্দ বাস্তবে কেনাকাটায় কাজে লাগিয়ে আত্মবিশ্বাস বাড়ানো।',
      japanConnectionBn: 'টোকিওতে যেকোনো কনবিনিতে কেনাকাটার জীবন্ত পরিস্থিতি।',
      viewRoute: 'journey',
      xpReward: 60
    };
  }

  // 5. Next Kana Series: 'か' (Ka) Family
  const kaFamily = ['か', 'き', 'く', 'け', 'こ'];
  const nextKa = kaFamily.find(k => !known.has(k));
  if (nextKa) {
    return {
      id: `mission-ka-${nextKa}`,
      type: 'kana',
      titleBn: `'か' সিরিজ: নতুন বর্ণ '${nextKa}' আয়ত্ত করা`,
      subTitleBn: 'ক-বর্গের প্রথম ব্যঞ্জনবর্ণের যাত্রা',
      actionLabelBn: `'${nextKa}' শিখি →`,
      whyItMattersBn: "'か' যোগ হলেই 'あかい' (লাল), 'かお' (মুখ) সহ ডজনখানেক নতুন শব্দ আনলক হবে!",
      japanConnectionBn: "জাপানের সাইনবোর্ড ও ট্রেনের স্টেশনে সবচেয়ে বেশি ব্যবহৃত বর্ণমালা।",
      targetChar: nextKa,
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l2' },
      xpReward: 25
    };
  }

  // 6. Default to Lesson 2 Curriculum
  return {
    id: 'mission-lesson-02',
    type: 'lesson_module',
    titleBn: 'লেসন ০২: প্রাথমিক কথোপকথন ও বস্তু পরিচিতি',
    subTitleBn: 'Minna no Nihongo Lesson 2 (これ、それ、あれ)',
    actionLabelBn: 'লেসন ০২ শুরু করি →',
    whyItMattersBn: 'কোনো জিনিসের নাম জানতে জাপানিরা কীভাবে প্রশ্ন করে তা শিখবে।',
    japanConnectionBn: 'টোকিওর দোকানে যেকোনো পণ্য নির্দেশ করতে এই প্যাটার্ন অপরিহার্য।',
    targetLessonId: 'n5-l2',
    viewRoute: 'lesson',
    viewParams: { lessonId: 'n5-l2' },
    xpReward: 80
  };
}
