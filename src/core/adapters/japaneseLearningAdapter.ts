// src/core/adapters/japaneseLearningAdapter.ts
// NIHOMI Domain Adapter — Japanese Language Learning & Strict Cumulative Lattice
// Governed by .agents/rules/nihomi-pedagogy.md and docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md

import {
  DomainAdapter,
  PrerequisiteValidationResult,
  ActivityAttemptResult,
  StateUpdateDerivation,
  RecommendedAction
} from './types';
import {
  LearnerKnowledgeState,
  MistakeRecord
} from '../curriculum/learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible } from '../curriculum/journeyEngine';

export interface JapaneseActivity {
  id: string;
  type: 'kana' | 'word_unlock' | 'vowel_gate' | 'grammar';
  targetChar?: string;
  targetWord?: string;
  targetLessonId?: string;
  titleBn: string;
  requiredPrerequisites: string[];
}

export interface JapaneseAttempt {
  characterOrItemId: string;
  strokeScore?: number;
  mcqCorrect?: boolean;
  timeSpentSeconds: number;
  detectedMistakeType?: 'visual_confusion' | 'phonetic_confusion' | 'meaning_confusion' | null;
  mistakeDetailsBn?: string;
}

export interface JapaneseEvaluation {
  accuracy: number;
  passed: boolean;
  diagnosticsBn: string;
  mistakeRecorded: boolean;
}

export interface JapaneseEvidence {
  itemType: 'kana' | 'vocab' | 'grammar' | 'gate';
  itemId: string;
  passed: boolean;
  score: number;
  mistake?: MistakeRecord | null;
}

const VOWEL_SEQUENCE = ['あ', 'い', 'う', 'え', 'お'];

export const japaneseLearningAdapter: DomainAdapter<
  JapaneseActivity,
  JapaneseAttempt,
  JapaneseEvaluation,
  JapaneseEvidence
> = {
  domain: 'japanese-learning',
  version: '1.0.0',

  selectActivity(state: LearnerKnowledgeState, context?: Record<string, any>): JapaneseActivity {
    // If specific target provided in context
    if (context?.char) {
      const char = context.char.trim();
      let reqs: string[] = [];
      const vIdx = VOWEL_SEQUENCE.indexOf(char);
      if (vIdx > 0) {
        reqs = VOWEL_SEQUENCE.slice(0, vIdx);
      }
      return {
        id: `kana-${char}`,
        type: 'kana',
        targetChar: char,
        titleBn: `হিরাগানা '${char}' ক্যালিগ্রাফি ও পরিচিতি`,
        requiredPrerequisites: reqs
      };
    }

    if (context?.lessonId) {
      return {
        id: `lesson-${context.lessonId}`,
        type: 'grammar',
        targetLessonId: context.lessonId,
        titleBn: `মিন্না নো নিহোঙ্গো লেসন: ${context.lessonId.toUpperCase()}`,
        requiredPrerequisites: ['あ', 'い', 'う', 'え', 'お', 'vowel_mastery_gate']
      };
    }

    // Default: evaluate state via canonical journeyEngine
    const nextMission = getNextBestMission(state);
    if (nextMission.type === 'grammar') {
      return {
        id: `grammar-${nextMission.targetLessonId || 'n5-l01'}`,
        type: 'grammar',
        targetLessonId: nextMission.targetLessonId || 'n5-l01',
        titleBn: nextMission.titleBn,
        requiredPrerequisites: ['あ', 'い', 'う', 'え', 'お', 'vowel_mastery_gate']
      };
    }

    if (nextMission.type === 'word_unlock') {
      return {
        id: `word-${nextMission.targetChar || 'あい'}`,
        type: 'word_unlock',
        targetWord: nextMission.targetChar || 'あい',
        titleBn: nextMission.titleBn,
        requiredPrerequisites: ['あ', 'い']
      };
    }

    const targetChar = nextMission.targetChar || 'あ';
    const vIdx = VOWEL_SEQUENCE.indexOf(targetChar);
    const reqs = vIdx > 0 ? VOWEL_SEQUENCE.slice(0, vIdx) : [];

    return {
      id: `kana-${targetChar}`,
      type: 'kana',
      targetChar,
      titleBn: nextMission.titleBn,
      requiredPrerequisites: reqs
    };
  },

  validatePrerequisites(
    activity: JapaneseActivity,
    state: LearnerKnowledgeState
  ): PrerequisiteValidationResult {
    // 1. Stage 1 (あ) has zero prerequisites
    if (activity.targetChar === 'あ') {
      return {
        eligible: true,
        unmetPrerequisites: [],
        reasonBn: 'মৌলিক প্রথম স্বরবর্ণ あ অনুশীলনের জন্য সম্পূর্ণ উন্মুক্ত।'
      };
    }

    // 2. Grammar check strictly enforces Dual Reading & Foundation
    if (activity.type === 'grammar') {
      const eligibility = isGrammarEligible(state);
      if (!eligibility.eligible) {
        return {
          eligible: false,
          unmetPrerequisites: eligibility.missingPrerequisites,
          reasonBn: eligibility.unmetReasonBn,
          recommendedUnlock: eligibility.missingPrerequisites[0] || 'あ'
        };
      }
      return {
        eligible: true,
        unmetPrerequisites: [],
        reasonBn: 'অভিনন্দন! আপনার ব্যাকরণ লেসন শুরু করার পূর্বশর্ত পূরণ হয়েছে।'
      };
    }

    // 3. Word unlock check
    if (activity.type === 'word_unlock') {
      const word = activity.targetWord || 'あい';
      const missingChars = Array.from(word).filter(
        (c) => !state.knownHiragana.includes(c)
      );
      if (missingChars.length > 0) {
        return {
          eligible: false,
          unmetPrerequisites: missingChars,
          reasonBn: `শব্দ '${word}' আনলক করার পূর্বে এর বর্ণগুলি (${missingChars.join(', ')}) আয়ত্ত করতে হবে।`,
          recommendedUnlock: missingChars[0]
        };
      }
      return {
        eligible: true,
        unmetPrerequisites: [],
        reasonBn: `শব্দ '${word}' আনলকের জন্য প্রস্তুত।`
      };
    }

    // 4. Sequential Vowels check
    const unmet = activity.requiredPrerequisites.filter(
      (prereq) => !state.knownHiragana.includes(prereq)
    );

    if (unmet.length > 0) {
      return {
        eligible: false,
        unmetPrerequisites: unmet,
        reasonBn: `কঠোর পেডাগোজিক্যাল নিয়ম: '${activity.targetChar}' শেখার পূর্বে '${unmet.join(', ')}' আয়ত্ত করতে হবে।`,
        recommendedUnlock: unmet[0]
      };
    }

    return {
      eligible: true,
      unmetPrerequisites: [],
      reasonBn: 'কার্যক্রমটির পূর্বশর্ত সন্তোষজনক।'
    };
  },

  evaluateAttempt(
    activity: JapaneseActivity,
    attempt: JapaneseAttempt,
    rubricVersion = '1.0.0'
  ): ActivityAttemptResult<JapaneseEvaluation, JapaneseEvidence> {
    const score = attempt.strokeScore !== undefined
      ? attempt.strokeScore
      : attempt.mcqCorrect
      ? 100
      : 30;

    const passed = score >= 75;
    let diagnosticsBn = passed
      ? '✔ চমৎকার! স্ট্রোক ক্রম ও জ্যামিতিক বিন্যাস সঠিক হয়েছে।'
      : '❌ স্ট্রোক দিক বা দৈর্ঘ্য সঠিক হয়নি। লাল গাইড মার্কার অনুসরণ করে পুনরায় চেষ্টা করুন।';

    let mistakeRecord: MistakeRecord | null = null;
    if (!passed && attempt.detectedMistakeType) {
      mistakeRecord = {
        item: attempt.characterOrItemId,
        mistakeType: attempt.detectedMistakeType,
        detailsBn: attempt.mistakeDetailsBn || diagnosticsBn,
        timestamp: new Date().toISOString(),
        resolved: false
      };
    }

    const evaluation: JapaneseEvaluation = {
      accuracy: score,
      passed,
      diagnosticsBn,
      mistakeRecorded: Boolean(mistakeRecord)
    };

    const evidence: JapaneseEvidence = {
      itemType: activity.type === 'grammar' ? 'grammar' : activity.type === 'word_unlock' ? 'vocab' : 'kana',
      itemId: attempt.characterOrItemId,
      passed,
      score,
      mistake: mistakeRecord
    };

    const xpEarned = passed ? (activity.type === 'grammar' ? 50 : 20) : 5;

    return {
      score,
      passed,
      rubricVersion,
      evaluation,
      evidence,
      feedbackBn: diagnosticsBn,
      xpEarned
    };
  },

  deriveEvidence(evaluation: JapaneseEvaluation, attempt: JapaneseAttempt): JapaneseEvidence {
    return {
      itemType: 'kana',
      itemId: attempt.characterOrItemId,
      passed: evaluation.passed,
      score: evaluation.accuracy,
      mistake: evaluation.mistakeRecorded
        ? {
            item: attempt.characterOrItemId,
            mistakeType: attempt.detectedMistakeType || 'visual_confusion',
            detailsBn: attempt.mistakeDetailsBn || evaluation.diagnosticsBn,
            timestamp: new Date().toISOString(),
            resolved: false
          }
        : null
    };
  },

  deriveStateUpdate(
    priorState: LearnerKnowledgeState,
    evidence: JapaneseEvidence
  ): StateUpdateDerivation {
    const updatedState: LearnerKnowledgeState = {
      ...priorState,
      knownHiragana: [...priorState.knownHiragana],
      knownVocabulary: [...priorState.knownVocabulary],
      knownGrammar: [...priorState.knownGrammar],
      recentMistakes: [...(priorState.recentMistakes || [])],
      totalXp: (priorState.totalXp || 0) + (evidence.passed ? 20 : 5)
    };

    const unlockedSkills: string[] = [];
    const unlockedItems: string[] = [];
    let stateChanged = false;

    if (evidence.passed) {
      if (evidence.itemType === 'kana') {
        if (!updatedState.knownHiragana.includes(evidence.itemId)) {
          updatedState.knownHiragana.push(evidence.itemId);
          unlockedItems.push(evidence.itemId);
          stateChanged = true;
        }

        // Automatic Word Unlocks based on cumulative inventory
        if (
          updatedState.knownHiragana.includes('あ') &&
          updatedState.knownHiragana.includes('い') &&
          !updatedState.knownVocabulary.includes('あい')
        ) {
          updatedState.knownVocabulary.push('あい');
          unlockedItems.push('あい');
          unlockedSkills.push('word_unlock_ai');
          stateChanged = true;
        }
      } else if (evidence.itemType === 'vocab') {
        if (!updatedState.knownVocabulary.includes(evidence.itemId)) {
          updatedState.knownVocabulary.push(evidence.itemId);
          unlockedItems.push(evidence.itemId);
          stateChanged = true;
        }
      } else if (evidence.itemType === 'grammar') {
        if (!updatedState.knownGrammar.includes(evidence.itemId)) {
          updatedState.knownGrammar.push(evidence.itemId);
          unlockedItems.push(evidence.itemId);
          stateChanged = true;
        }
      }

      // Mark matching mistake as resolved
      updatedState.recentMistakes = updatedState.recentMistakes.map((m) =>
        m.item === evidence.itemId ? { ...m, resolved: true } : m
      );
    } else if (evidence.mistake) {
      updatedState.recentMistakes.push(evidence.mistake);
      stateChanged = true;
    }

    return {
      updatedState,
      stateChanged,
      unlockedSkills,
      unlockedItems
    };
  },

  recommendNextAction(
    updatedState: LearnerKnowledgeState,
    _context?: Record<string, any>
  ): RecommendedAction {
    const next = getNextBestMission(updatedState);

    let route = 'journey';
    let params: Record<string, any> = {};

    if (next.type === 'kana' || next.type === 'word_unlock') {
      route = 'kana';
      params = { char: next.targetChar || 'あ' };
    } else if (next.type === 'grammar') {
      route = 'lesson';
      params = { lessonId: next.targetLessonId || 'n5-l01' };
    }

    return {
      actionType: next.type === 'mistake_repair' ? 'retry' : 'advance',
      targetId: next.id,
      titleBn: next.titleBn,
      explanationBn: next.subTitleBn,
      route,
      params
    };
  }
};
