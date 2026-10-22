// src/core/adapters/examOsAdapter.ts
// NIHOMI Domain Adapter — JLPT Exam OS (Timed Mock Exams & Diagnostic Scoring)
// Governed by docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md and the N.I.H.O.M.I Shared Loop Contract

import {
  DomainAdapter,
  PrerequisiteValidationResult,
  ActivityAttemptResult,
  StateUpdateDerivation,
  RecommendedAction
} from './types';
import {
  LearnerKnowledgeState,
  ReviewQueueItem
} from '../curriculum/learnerKnowledgeState';
import { JLPTLevel, MockExamSectionType } from '../../types';

export interface ExamActivity {
  id: string;
  examCode: string;
  level: JLPTLevel;
  titleBn: string;
  totalTimeMinutes: number;
  totalPossibleScore: number; // typically 180 for JLPT
  overallPassingScore: number; // e.g. 90/180 for N5
  sections: Array<{
    sectionType: MockExamSectionType;
    title: string;
    maxScaledScore: number;
    passingThreshold: number;
  }>;
  requiredPrerequisites: string[];
}

export interface QuestionAnswerRecord {
  questionId: string;
  sectionType: MockExamSectionType;
  conceptCode?: string;
  questionTextBn?: string;
  isCorrect: boolean;
  chosenIndex: number;
  correctIndex: number;
  explanationBn: string;
}

export interface ExamAttempt {
  examId: string;
  examCode: string;
  level: JLPTLevel;
  timeSpentSeconds: number;
  sectionScores: Record<
    string,
    {
      rawScore: number;
      maxRawScore: number;
      scaledScore: number;
      maxScaledScore: number;
      passed: boolean;
    }
  >;
  totalScaledScore: number;
  answers: QuestionAnswerRecord[];
}

export interface ExamEvaluation {
  totalScaledScore: number;
  overallPassingScore: number;
  passed: boolean;
  percentage: number;
  sectionPassFail: Record<string, boolean>;
  weakSections: string[];
  weakConcepts: string[];
  diagnosticsBn: string;
}

export interface ExamEvidence {
  examCode: string;
  level: JLPTLevel;
  passed: boolean;
  totalScore: number;
  percentage: number;
  weakConcepts: string[];
  newReviewItems: ReviewQueueItem[];
  completedAt: string;
}

export const examOsAdapter: DomainAdapter<
  ExamActivity,
  ExamAttempt,
  ExamEvaluation,
  ExamEvidence
> = {
  domain: 'exam-os',
  version: '1.0.0',

  selectActivity(state: LearnerKnowledgeState, context?: Record<string, any>): ExamActivity {
    const level: JLPTLevel = context?.level || state.currentLevel || 'N5';
    const examCode = context?.examCode || `JLPT-${level}-STANDARD-MOCK`;

    // Standard JLPT N5 Blueprint
    return {
      id: `exam-${level.toLowerCase()}-standard`,
      examCode,
      level,
      titleBn: `JLPT ${level} অফিসিয়াল টাইমড মক এক্সাম ওএস`,
      totalTimeMinutes: level === 'N5' ? 90 : 105,
      totalPossibleScore: 180,
      overallPassingScore: level === 'N5' ? 90 : 95,
      sections: [
        {
          sectionType: 'vocabulary',
          title: 'ভাষা জ্ঞান ও শব্দভাণ্ডার (Language Knowledge)',
          maxScaledScore: 60,
          passingThreshold: 19
        },
        {
          sectionType: 'grammar_reading',
          title: 'ব্যাকরণ ও রিডিং কম্প্রিহেনশন (Grammar & Reading)',
          maxScaledScore: 60,
          passingThreshold: 19
        },
        {
          sectionType: 'listening',
          title: 'শ্রবণ দক্ষতা (Listening Comprehension)',
          maxScaledScore: 60,
          passingThreshold: 19
        }
      ],
      requiredPrerequisites: level === 'N5' ? ['hiragana_foundation_basic'] : [`jlpt_${level.toLowerCase()}_prep`]
    };
  },

  validatePrerequisites(
    activity: ExamActivity,
    state: LearnerKnowledgeState
  ): PrerequisiteValidationResult {
    // JLPT Mock Exam requires fundamental reading capability
    if (activity.level === 'N5') {
      const knownCount = state.knownHiragana?.length || 0;
      const hasVowelGate = state.masteredSkills?.includes('vowels_5_mastered');

      if (knownCount < 5 && !hasVowelGate) {
        return {
          eligible: false,
          unmetPrerequisites: ['মৌলিক হিরাগানা স্বরবর্ণ (あ, い, う, え, お)'],
          reasonBn: 'মক এক্সামে অংশ নেওয়ার পূর্বে মৌলিক হিরাগানা রিডিং সম্পূর্ণ করা আবশ্যক।',
          recommendedUnlock: 'あ'
        };
      }

      return {
        eligible: true,
        unmetPrerequisites: [],
        reasonBn: 'JLPT N5 মক এক্সামের প্রস্তুতি সন্তোষজনক।'
      };
    }

    // For N4-N1, require prior level mastery or explicit readiness
    return {
      eligible: true,
      unmetPrerequisites: [],
      reasonBn: `JLPT ${activity.level} মক এক্সাম উন্মুক্ত।`
    };
  },

  evaluateAttempt(
    activity: ExamActivity,
    attempt: ExamAttempt,
    rubricVersion = '1.0.0'
  ): ActivityAttemptResult<ExamEvaluation, ExamEvidence> {
    const totalScore = attempt.totalScaledScore;
    const overallPassingScore = activity.overallPassingScore;

    // Check individual section passing thresholds
    const sectionPassFail: Record<string, boolean> = {};
    const weakSections: string[] = [];

    activity.sections.forEach((sec) => {
      const secAttempt = attempt.sectionScores[sec.sectionType];
      const scaled = secAttempt?.scaledScore || 0;
      const isSecPassed = scaled >= sec.passingThreshold;
      sectionPassFail[sec.sectionType] = isSecPassed;
      if (!isSecPassed) {
        weakSections.push(sec.title);
      }
    });

    // Both overall score AND all section thresholds must pass
    const allSectionsPassed = weakSections.length === 0;
    const passed = totalScore >= overallPassingScore && allSectionsPassed;

    // Identify weak concepts from incorrect answers
    const weakConcepts: string[] = [];
    const newReviewItems: ReviewQueueItem[] = [];

    (attempt.answers || []).forEach((ans) => {
      if (!ans.isCorrect) {
        if (ans.conceptCode && !weakConcepts.includes(ans.conceptCode)) {
          weakConcepts.push(ans.conceptCode);
        }
        newReviewItems.push({
          itemId: ans.questionId,
          itemType: ans.sectionType === 'listening' ? 'kana' : 'grammar',
          prompt: ans.questionTextBn || `ভুল প্রশ্ন আইডি: ${ans.questionId}`,
          nextReviewDue: new Date(Date.now() + 86400000).toISOString(), // 1 day
          intervalDays: 1,
          repetitionCount: 0
        });
      }
    });

    const percentage = Math.round((totalScore / activity.totalPossibleScore) * 100);

    let diagnosticsBn = '';
    if (passed) {
      diagnosticsBn = `✔ অভিনন্দন! আপনি JLPT ${activity.level} মক পরীক্ষায় উত্তীর্ণ হয়েছেন। মোট স্কোর: ${totalScore}/${activity.totalPossibleScore} (${percentage}%)।`;
    } else {
      diagnosticsBn = `❌ পরীক্ষায় উত্তীর্ণ হওয়ার ন্যূনতম মান অর্জিত হয়নি। মোট স্কোর: ${totalScore}/${activity.totalPossibleScore}। দুর্বল সেকশন: ${
        weakSections.length > 0 ? weakSections.join(', ') : 'ওভারঅল পাসিং স্কোর কম'
      }।`;
    }

    const evaluation: ExamEvaluation = {
      totalScaledScore: totalScore,
      overallPassingScore,
      passed,
      percentage,
      sectionPassFail,
      weakSections,
      weakConcepts,
      diagnosticsBn
    };

    const evidence: ExamEvidence = {
      examCode: activity.examCode,
      level: activity.level,
      passed,
      totalScore,
      percentage,
      weakConcepts,
      newReviewItems,
      completedAt: new Date().toISOString()
    };

    const xpEarned = passed ? 100 : 30;

    return {
      score: percentage,
      passed,
      rubricVersion,
      evaluation,
      evidence,
      feedbackBn: diagnosticsBn,
      xpEarned
    };
  },

  deriveEvidence(evaluation: ExamEvaluation, attempt: ExamAttempt): ExamEvidence {
    const weakConcepts: string[] = [];
    const newReviewItems: ReviewQueueItem[] = [];

    (attempt.answers || []).forEach((ans) => {
      if (!ans.isCorrect) {
        if (ans.conceptCode && !weakConcepts.includes(ans.conceptCode)) {
          weakConcepts.push(ans.conceptCode);
        }
        newReviewItems.push({
          itemId: ans.questionId,
          itemType: ans.sectionType === 'listening' ? 'kana' : 'grammar',
          prompt: ans.questionTextBn || `ভুল প্রশ্ন: ${ans.questionId}`,
          nextReviewDue: new Date(Date.now() + 86400000).toISOString(),
          intervalDays: 1,
          repetitionCount: 0
        });
      }
    });

    return {
      examCode: attempt.examCode,
      level: attempt.level,
      passed: evaluation.passed,
      totalScore: evaluation.totalScaledScore,
      percentage: evaluation.percentage,
      weakConcepts,
      newReviewItems,
      completedAt: new Date().toISOString()
    };
  },

  deriveStateUpdate(
    priorState: LearnerKnowledgeState,
    evidence: ExamEvidence
  ): StateUpdateDerivation {
    const updatedState: LearnerKnowledgeState = {
      ...priorState,
      masteredSkills: [...(priorState.masteredSkills || [])],
      reviewQueue: [...(priorState.reviewQueue || [])],
      totalXp: (priorState.totalXp || 0) + (evidence.passed ? 100 : 30)
    };

    const unlockedSkills: string[] = [];
    const unlockedItems: string[] = [];
    let stateChanged = false;

    // Enqueue weak questions for spaced review
    if (evidence.newReviewItems.length > 0) {
      const existingIds = new Set(updatedState.reviewQueue.map((item) => item.itemId));
      evidence.newReviewItems.forEach((rev) => {
        if (!existingIds.has(rev.itemId)) {
          updatedState.reviewQueue.push(rev);
          stateChanged = true;
        }
      });
    }

    if (evidence.passed) {
      const passSkill = `jlpt_${evidence.level.toLowerCase()}_mock_passed`;
      if (!updatedState.masteredSkills.includes(passSkill)) {
        updatedState.masteredSkills.push(passSkill);
        unlockedSkills.push(passSkill);
        stateChanged = true;
      }
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
    context?: Record<string, any>
  ): RecommendedAction {
    const hasUnreviewedItems = (updatedState.reviewQueue?.length || 0) > 0;

    if (hasUnreviewedItems || context?.focusWeakAreas) {
      return {
        actionType: 'review',
        targetId: 'exam_weak_remediation',
        titleBn: 'পরীক্ষার দুর্বল বিষয়ের রিভিও ও রিকভারি',
        explanationBn: 'মক পরীক্ষায় যেসব প্রশ্নে ভুল হয়েছে সেগুলো সংশোধন করুন।',
        route: 'exams',
        params: { tab: 'review' }
      };
    }

    return {
      actionType: 'advance',
      targetId: 'exam_next_level',
      titleBn: 'পরবর্তী অফিসিয়াল মক টেস্ট বা লেভেল আপ',
      explanationBn: 'আপনার প্রস্তুতি চমৎকার। পরবর্তী মক টেস্টে অংশগ্রহণ করতে পারেন।',
      route: 'exams',
      params: { tab: 'all' }
    };
  }
};
