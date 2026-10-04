// src/core/curriculum/mistakeRecoveryEngine.ts
// Canonical Mistake Recovery Engine — Error as Diagnostic Learning Event

export interface MistakeDiagnostic {
  category: 'visual_confusion' | 'phonetic_confusion' | 'meaning_confusion' | 'recall_delay';
  diagnosisBn: string;
  recoveryPromptBn: string;
  audioReplayChar?: string;
  recommendedNextStep: string;
}

export function diagnoseMistake(
  targetItem: string,
  chosenItem: string,
  _context: 'kana' | 'vocab' | 'quiz' = 'kana'
): MistakeDiagnostic {
  // Visual pair: あ vs お
  if ((targetItem === 'あ' && chosenItem === 'お') || (targetItem === 'お' && chosenItem === 'あ')) {
    return {
      category: 'visual_confusion',
      diagnosisBn: "একটু থামি 😊 'あ' এবং 'お' দেখতে অনেকটাই কাছাকাছি, তাই প্রথম প্রথম একটু গুলিয়ে যাওয়া খুব স্বাভাবিক!",
      recoveryPromptBn: "সহজ ক্লু: 'あ'-এর পেটের ভেতর পুরো গোল লুপ ঘুরে নিচে নামে। আর 'お'-এর উপরে ডানে একটা ছোট্ট আলাদা ফোঁটা থাকে।",
      audioReplayChar: targetItem,
      recommendedNextStep: `চল আরেকবার কান দিয়ে স্পষ্ট করে শুনি: '${targetItem}'!`
    };
  }

  // Visual pair: い vs り
  if ((targetItem === 'い' && chosenItem === 'り') || (targetItem === 'り' && chosenItem === 'い')) {
    return {
      category: 'visual_confusion',
      diagnosisBn: "খুব কাছাকাছি চেষ্টা! 'い' এবং 'り' দুটিই পাশাপাশি দুটি দাগ দিয়ে লেখা হয়।",
      recoveryPromptBn: "পার্থক্যটা মনে রাখো: 'い'-এর বামের দাগে ছোট্ট একটা হুক থাকে এবং ডানের দাগটা ছোট। আর 'り'-এর ডানের দাগ অনেক লম্বা হয়।",
      audioReplayChar: targetItem,
      recommendedNextStep: `'${targetItem}' এর উচ্চারণ ও আকার আরেকবার দেখে নিই।`
    };
  }

  // Visual pair: う vs つ
  if ((targetItem === 'う' && chosenItem === 'つ') || (targetItem === 'つ' && chosenItem === 'う')) {
    return {
      category: 'visual_confusion',
      diagnosisBn: "দারুণ চেষ্টা! তবে 'う'-এর মাথায় ছোট্ট একটা আলাদা তীর্যক ফোঁটা থাকে।",
      recoveryPromptBn: "মাথার ফোঁটা দেখলেই বুঝবে এটা 'う' (u)। আর ফোঁটা ছাড়া এক টানে বাঁকা দাগ হলে তা 'つ' (tsu)।",
      audioReplayChar: targetItem,
      recommendedNextStep: `আরেকবার শুনে নাও: '${targetItem}'!`
    };
  }

  // Visual pair: え vs ん
  if ((targetItem === 'え' && chosenItem === 'ん') || (targetItem === 'ん' && chosenItem === 'え')) {
    return {
      category: 'visual_confusion',
      diagnosisBn: "একটু মনোযোগ দিই! 'え'-এর শুরুটা ইংরেজি 'Z' অক্ষরের মতো কোণাকুণি হয়।",
      recoveryPromptBn: "উপরে ছোট টান, তারপর 'Z' এর মতো এঁকে নিচে ঢেউ খেলানো মানেই 'え' (e)।",
      audioReplayChar: targetItem,
      recommendedNextStep: `চল '${targetItem}' আবার শুনে লিখি।`
    };
  }

  // Word meaning confusion (e.g. あい vs いえ vs あお)
  if (targetItem === 'あい' && chosenItem !== 'あい') {
    return {
      category: 'meaning_confusion',
      diagnosisBn: "'あい' (Ai) মানে 'ভালোবাসা' (Love)। দুটি খাঁটি স্বরবর্ণ 'あ' এবং 'い' যুক্ত হয়ে এই শব্দ গঠিত হয়।",
      recoveryPromptBn: "'あ' (আ) + 'い' (ই) = 'あい' (Ai • ভালোবাসা)।",
      audioReplayChar: 'あい',
      recommendedNextStep: "আরেকবার শব্দটির উচ্চারণ শুনে নাও!"
    };
  }

  if (targetItem === 'いえ' && chosenItem !== 'いえ') {
    return {
      category: 'meaning_confusion',
      diagnosisBn: "'いえ' (Ie) মানে 'বাড়ি' বা ঘর (House)।",
      recoveryPromptBn: "'い' (ই) + 'え' (এ) = 'いえ' (Ie • বাড়ি)।",
      audioReplayChar: 'いえ',
      recommendedNextStep: "শব্দটি মনে রাখার জন্য একবার মুখে বলে দেখ।"
    };
  }

  if (targetItem === 'あお' && chosenItem !== 'あお') {
    return {
      category: 'meaning_confusion',
      diagnosisBn: "'あお' (Ao) মানে 'নীল' রঙ (Blue)।",
      recoveryPromptBn: "'あ' (আ) + 'お' (ও) = 'あお' (Ao • নীল)।",
      audioReplayChar: 'あお',
      recommendedNextStep: "টোকিওর নীল আকাশ বা সাইনবোর্ডের কথা মনে কর।"
    };
  }

  if (targetItem === 'うえ' && chosenItem !== 'うえ') {
    return {
      category: 'meaning_confusion',
      diagnosisBn: "'うえ' (Ue) মানে 'উপরে' বা শীর্ষ (Up / Above)।",
      recoveryPromptBn: "'う' (উ) + 'え' (এ) = 'うえ' (Ue • উপরে)।",
      audioReplayChar: 'うえ',
      recommendedNextStep: "উপরে তাকানোর কথা কল্পনা করে একবার উচ্চারণ কর।"
    };
  }

  // General fallback supportive diagnostic
  return {
    category: 'recall_delay',
    diagnosisBn: `ভুল হওয়া একদম স্বাভাবিক! কোনো তাড়া নেই, আমরা আরামসে শিখছি।`,
    recoveryPromptBn: `সঠিক উত্তর হলো: '${targetItem}'। মনোযোগ দিয়ে আরেকবার দেখে নাও।`,
    audioReplayChar: targetItem,
    recommendedNextStep: `আরেকবার চেষ্টা কর, এবার নিশ্চিত পারবে!`
  };
}
