// src/core/curriculum/journeyEngine.ts
// Canonical Journey Engine — Authoritative "Next Best Mission" Determinator
// Single Source of Truth for Global Learner Progression

import { LearnerKnowledgeState } from './learnerKnowledgeState';
import {
  CurriculumNode,
  CurriculumPhase,
  CurriculumNodeType,
  CURRICULUM_GRAPH
} from './curriculumGraph';

export interface NextBestMission extends CurriculumNode {}

export interface LessonGateStatus {
  isLocked: boolean;
  gateType?: 'grammar_prerequisite_unmet' | 'kana_prerequisite_unmet';
  reasonBn: string;
  requiredSkills: string[];
  nextBestMission: NextBestMission;
}

const HIRAGANA_VOWELS = ['あ', 'い', 'う', 'え', 'お'];

/**
 * Evaluates whether the learner satisfies the foundational prerequisites for Grammar.
 * Inviolable Law: Grammar requires 100% mastery of Hiragana vowels, core consonants,
 * and reading foundation before any grammar rules or particles are encountered.
 */
export function isGrammarEligible(state: LearnerKnowledgeState): {
  eligible: boolean;
  unmetReasonBn: string;
  missingPrerequisites: string[];
} {
  const missing: string[] = [];

  // 1. Must have mastered all 5 foundational vowels
  const knownHiragana = new Set(state.knownHiragana);
  const missingVowels = HIRAGANA_VOWELS.filter(v => !knownHiragana.has(v));
  if (missingVowels.length > 0) {
    missing.push(`মৌলিক স্বরবর্ণ [${missingVowels.join(', ')}]`);
  }

  // 2. Must have passed 5-Vowels gate
  const hasVowelGate = state.masteredSkills.includes('vowels_5_mastered') ||
    state.masteredSkills.includes('5_vowels_gate') ||
    (typeof window !== 'undefined' && localStorage.getItem('nihomi_foundation_completed') === 'true');
  if (!hasVowelGate && missingVowels.length === 0) {
    missing.push('৫-স্বরবর্ণ মাস্টার রিভিউ কুইজ');
  }

  // 3. Must have dual reading foundation for grammar
  const hasReadingFoundation = state.masteredSkills.includes('kana_dual_mastered') ||
    state.masteredSkills.includes('reading_foundation_verified') ||
    state.masteredSkills.includes('hiragana_core_mastered');
  if (!hasReadingFoundation) {
    missing.push('হিরাগানা ব্যঞ্জনবর্ণ ও রিডিং প্রস্তুতি');
  }

  const eligible = missing.length === 0;
  let unmetReasonBn = '';
  if (!eligible) {
    unmetReasonBn = `জাপানি ব্যাকরণে (Grammar) প্রবেশ করার আগে আপনার প্রয়োজনীয় ভিত্তি এখনো অসম্পূর্ণ: ${missing.join(', ')}। আগে অক্ষর ও শব্দ চেনা নিশ্চিত করুন, যাতে ব্যাকরণের বাক্য পড়তে কোনো জড়তা না থাকে।`;
  }

  return {
    eligible,
    unmetReasonBn,
    missingPrerequisites: missing
  };
}

/**
 * Computes the single authoritative next best mission for the learner.
 * Follows the strict mastery priority:
 *   1. Critical mistake recovery (supportive repair drill)
 *   2. Required unfinished prerequisite (vowel ladder: あ → い → あい → う → え → お)
 *   3. 5-Vowel Review Milestone Gate
 *   4. Controlled Tokyo Real-world Scenario
 *   5. Hiragana Core Consonants
 *   6. Reading Mechanics & Dual Kana Reading
 *   7. ONLY THEN: Grammar (Phase 10)
 */
export function getNextBestMission(state: LearnerKnowledgeState): NextBestMission {
  // 1. Priority 0: Unresolved repeated mistakes trigger supportive repair drill
  const unresolvedMistakes = state.recentMistakes.filter(m => !m.resolved);
  if (unresolvedMistakes.length >= 2) {
    const recent = unresolvedMistakes[0];
    return {
      id: `repair-${recent.item}`,
      phase: 'phase_1_hiragana_foundation',
      type: 'mistake_repair',
      titleBn: `'${recent.item}' বিশেষ রিভিশন ও প্র্যাকটিস`,
      subTitleBn: 'একটু থেমে বিভ্রান্তি দূর করে আবার ঝালিয়ে নিই',
      actionLabelBn: 'রিভিশন শুরু করি →',
      whyItMattersBn: 'ভুল হওয়া শেখার সবচেয়ে স্বাভাবিক ও প্রয়োজনীয় অংশ। একবার স্পষ্ট করে নিলেই আত্মবিশ্বাস ফিরে আসবে।',
      japanConnectionBn: 'সঠিক বর্ণ চেনা টোকিওর সাবওয়ে ও দোকানের সাইনবোর্ড পড়ার আসল চাবিকাঠি।',
      targetChar: recent.item,
      prerequisites: [],
      unlocks: [],
      viewRoute: 'lesson',
      viewParams: { lessonId: 'n5-l1', char: recent.item },
      xpReward: 15
    };
  }

  const known = new Set(state.knownHiragana);
  const knownVocab = new Set(state.knownVocabulary);

  // 2. Strict Vowel Foundation Ladder (Phase 1)
  if (!known.has('あ')) {
    return CURRICULUM_GRAPH['kana-a'];
  }

  if (!known.has('い')) {
    return CURRICULUM_GRAPH['kana-i'];
  }

  // After both あ and い are known: First Word Unlock あい
  if (!knownVocab.has('あい')) {
    return CURRICULUM_GRAPH['word-ai'];
  }

  // Next: Third Vowel う
  if (!known.has('う')) {
    return CURRICULUM_GRAPH['kana-u'];
  }

  // Next: Fourth Vowel え
  if (!known.has('え')) {
    return CURRICULUM_GRAPH['kana-e'];
  }

  // Next: Fifth Vowel お
  if (!known.has('お')) {
    return CURRICULUM_GRAPH['kana-o'];
  }

  // 3. 5-Vowels mastered -> Check Milestone Quiz completion
  const hasPassedVowelGate = state.masteredSkills.includes('vowels_5_mastered') ||
    state.masteredSkills.includes('5_vowels_gate') ||
    (typeof window !== 'undefined' && localStorage.getItem('nihomi_foundation_completed') === 'true');

  if (!hasPassedVowelGate) {
    return CURRICULUM_GRAPH['vowel-mastery-gate'];
  }

  // 4. Tokyo Konbini Scenario & Real-Life Practice
  const hasDoneKonbini = state.masteredSkills.includes('konbini_mission_1');
  if (!hasDoneKonbini) {
    return CURRICULUM_GRAPH['konbini-mission-01'];
  }

  // 5. Phase 2: Hiragana Core Consonants (か〜ん)
  const kaFamily = ['か', 'き', 'く', 'け', 'こ'];
  const hasAllKa = kaFamily.every(k => known.has(k));
  if (!hasAllKa) {
    return CURRICULUM_GRAPH['kana-ka-family'];
  }

  const saFamily = ['さ', 'し', 'す', 'せ', 'そ'];
  const hasAllSa = saFamily.every(s => known.has(s));
  if (!hasAllSa) {
    return CURRICULUM_GRAPH['kana-sa-family'];
  }

  const hasCoreComplete = state.masteredSkills.includes('hiragana_core_mastered');
  if (!hasCoreComplete) {
    return CURRICULUM_GRAPH['kana-core-complete'];
  }

  // 6. Phase 3 & 4: Mechanics and Reading Mastery
  const hasMechanics = state.masteredSkills.includes('hiragana_mechanics_mastered');
  if (!hasMechanics) {
    return CURRICULUM_GRAPH['hiragana-mechanics'];
  }

  const hasReadingMastery = state.masteredSkills.includes('hiragana_reading_mastered');
  if (!hasReadingMastery) {
    return CURRICULUM_GRAPH['hiragana-reading-mastery'];
  }

  // 7. Phase 5 & 6: Katakana
  const hasKatakanaFoundation = state.masteredSkills.includes('katakana_foundation_mastered');
  if (!hasKatakanaFoundation) {
    return CURRICULUM_GRAPH['katakana-foundation'];
  }

  const hasKatakanaMastery = state.masteredSkills.includes('katakana_mastered');
  if (!hasKatakanaMastery) {
    return CURRICULUM_GRAPH['katakana-mastery'];
  }

  // 8. Phase 7: Reading Foundation Verification
  const hasReadingFoundationComplete = state.masteredSkills.includes('kana_dual_mastered') ||
    state.masteredSkills.includes('reading_foundation_verified');
  if (!hasReadingFoundationComplete) {
    return CURRICULUM_GRAPH['reading-foundation-complete'];
  }

  // 9. Phase 10: Grammar ONLY after reading foundation is satisfied
  const hasGrammarL1 = state.masteredSkills.includes('grammar_n5_l1_mastered');
  if (!hasGrammarL1) {
    return CURRICULUM_GRAPH['grammar-n5-lesson-01'];
  }

  return CURRICULUM_GRAPH['grammar-n5-lesson-02'];
}

/**
 * Determines whether a requested lesson route or module is locked
 * by prerequisite rules and provides the authoritative next action.
 */
export function getLessonGateStatus(lessonId: string, state: LearnerKnowledgeState): LessonGateStatus {
  const normId = String(lessonId || '').toLowerCase().trim();
  const nextMission = getNextBestMission(state);

  // Lesson 1 is the Kana vowel foundation and is always open to start
  if (normId === 'n5-l1' || normId === '1' || normId === 'lesson-1') {
    return {
      isLocked: false,
      reasonBn: 'মৌলিক স্বরবর্ণ পাঠ উন্মুক্ত।',
      requiredSkills: [],
      nextBestMission: nextMission
    };
  }

  // Any Grammar lessons (n5-l2 through n5-l25 or explicit grammar IDs)
  const isGrammarLesson = /^n5-l([2-9]|1\d|2\d)/i.test(normId) || normId.includes('grammar');

  if (isGrammarLesson) {
    const grammarCheck = isGrammarEligible(state);
    if (!grammarCheck.eligible) {
      return {
        isLocked: true,
        gateType: 'grammar_prerequisite_unmet',
        reasonBn: grammarCheck.unmetReasonBn,
        requiredSkills: grammarCheck.missingPrerequisites,
        nextBestMission: nextMission
      };
    }
  }

  return {
    isLocked: false,
    reasonBn: 'পাঠটি আপনার জন্য উন্মুক্ত।',
    requiredSkills: [],
    nextBestMission: nextMission
  };
}
