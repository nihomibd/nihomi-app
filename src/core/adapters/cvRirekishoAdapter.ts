// src/core/adapters/cvRirekishoAdapter.ts
// NIHOMI Domain Adapter — JIS Standard Rirekisho & Tokyo Work OS CV Builder
// Governed by docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md and the N.I.H.O.M.I Shared Loop Contract

import {
  DomainAdapter,
  PrerequisiteValidationResult,
  ActivityAttemptResult,
  StateUpdateDerivation,
  RecommendedAction
} from './types';
import { LearnerKnowledgeState } from '../curriculum/learnerKnowledgeState';
import { JisRirekishoData } from '../../types';

export interface CvRirekishoActivity {
  id: string;
  templateType: 'jis_standard_rirekisho' | 'shokumu_keirekisho';
  titleBn: string;
  descriptionBn: string;
  requiredFields: string[];
}

export interface CvDraftAttempt {
  documentId: string;
  templateType: 'jis_standard_rirekisho' | 'shokumu_keirekisho';
  data: Partial<JisRirekishoData>;
  userConfirmedTruthful: boolean; // Inviolable Rule: Human must confirm factual claims
  timeSpentSeconds: number;
}

export interface CvEvaluation {
  completenessScore: number; // 0 - 100%
  passed: boolean;
  missingRequiredFields: string[];
  formatValid: boolean;
  truthConfirmed: boolean;
  diagnosticsBn: string;
}

export interface CvEvidence {
  documentId: string;
  templateType: string;
  completenessScore: number;
  passed: boolean;
  awardedSkill: string; // 'jis_rirekisho_ready'
  completedAt: string;
}

const JIS_REQUIRED_FIELDS: Array<keyof JisRirekishoData> = [
  'fullName',
  'fullNameKana',
  'birthDate',
  'phone',
  'email',
  'currentAddress',
  'currentAddressKana',
  'visaStatus',
  'educationHistory',
  'motivationStatement'
];

export const cvRirekishoAdapter: DomainAdapter<
  CvRirekishoActivity,
  CvDraftAttempt,
  CvEvaluation,
  CvEvidence
> = {
  domain: 'cv-rirekisho',
  version: '1.0.0',

  selectActivity(_state: LearnerKnowledgeState, context?: Record<string, any>): CvRirekishoActivity {
    const templateType = context?.templateType || 'jis_standard_rirekisho';

    return {
      id: `cv-template-${templateType}`,
      templateType,
      titleBn: 'প্রামাণ্য জাপানিজ জেআইএস (JIS) রিরেকিশো স্টুডিও',
      descriptionBn: 'জাপানে বাইতো (পার্ট-টাইম) বা ফুল-টাইম চাকুরির আবেদনের জন্য নির্ধারিত স্ট্যান্ডার্ড জাপানিজ ফরম্যাটে সিভি তৈরি।',
      requiredFields: JIS_REQUIRED_FIELDS as string[]
    };
  },

  validatePrerequisites(
    _activity: CvRirekishoActivity,
    _state: LearnerKnowledgeState
  ): PrerequisiteValidationResult {
    // CV Builder is accessible to all learners preparing for Japan relocation
    return {
      eligible: true,
      unmetPrerequisites: [],
      reasonBn: 'জেআইএস রিরেকিশো স্টুডিও সম্পূর্ণ উন্মুক্ত। আপনার প্রোফাইল তথ্য প্রদান করে শুরু করতে পারেন।'
    };
  },

  evaluateAttempt(
    activity: CvRirekishoActivity,
    attempt: CvDraftAttempt,
    rubricVersion = '1.0.0'
  ): ActivityAttemptResult<CvEvaluation, CvEvidence> {
    const missingFields: string[] = [];
    const draft = attempt.data || {};

    // 1. Check each required field
    JIS_REQUIRED_FIELDS.forEach((f) => {
      const val = draft[f];
      if (val === undefined || val === null || val === '') {
        missingFields.push(String(f));
      } else if (Array.isArray(val) && val.length === 0) {
        missingFields.push(String(f));
      }
    });

    const totalFields = JIS_REQUIRED_FIELDS.length;
    const filledFields = totalFields - missingFields.length;
    const completenessScore = Math.round((filledFields / totalFields) * 100);

    // 2. Strict Zero Hallucination Law: Learner MUST confirm truthfulness of facts
    const truthConfirmed = Boolean(attempt.userConfirmedTruthful);
    const formatValid = completenessScore >= 80;
    const passed = formatValid && truthConfirmed;

    let diagnosticsBn = '';
    if (passed) {
      diagnosticsBn = `✔ জেআইএস রিরেকিশো প্রস্তুত! কমপ্লিটনেস স্কোর: ${completenessScore}%। জাপানিজ স্ট্যান্ডার্ড নিয়মাবলী ও সত্যতা নিশ্চিত হয়েছে।`;
    } else if (!truthConfirmed) {
      diagnosticsBn = '❌ সতর্কবার্তা: জীবনবৃত্তান্তের তথ্যের সত্যতা নিশ্চিতকরণ আবশ্যক। মনগড়া বা কাল্পনিক কোনো তথ্য যোগ করা সম্পূর্ণ নিষিদ্ধ।';
    } else {
      diagnosticsBn = `❌ রিরেকিশোর বাধ্যতামূলক তথ্য অপূর্ণ রয়েছে। অনুপস্থিত ফিল্ড: ${missingFields.join(', ')}।`;
    }

    const evaluation: CvEvaluation = {
      completenessScore,
      passed,
      missingRequiredFields: missingFields,
      formatValid,
      truthConfirmed,
      diagnosticsBn
    };

    const evidence: CvEvidence = {
      documentId: attempt.documentId,
      templateType: attempt.templateType,
      completenessScore,
      passed,
      awardedSkill: 'jis_rirekisho_ready',
      completedAt: new Date().toISOString()
    };

    const xpEarned = passed ? 60 : 15;

    return {
      score: completenessScore,
      passed,
      rubricVersion,
      evaluation,
      evidence,
      feedbackBn: diagnosticsBn,
      xpEarned
    };
  },

  deriveEvidence(evaluation: CvEvaluation, attempt: CvDraftAttempt): CvEvidence {
    return {
      documentId: attempt.documentId,
      templateType: attempt.templateType,
      completenessScore: evaluation.completenessScore,
      passed: evaluation.passed,
      awardedSkill: 'jis_rirekisho_ready',
      completedAt: new Date().toISOString()
    };
  },

  deriveStateUpdate(
    priorState: LearnerKnowledgeState,
    evidence: CvEvidence
  ): StateUpdateDerivation {
    const updatedState: LearnerKnowledgeState = {
      ...priorState,
      masteredSkills: [...(priorState.masteredSkills || [])],
      totalXp: (priorState.totalXp || 0) + (evidence.passed ? 60 : 15)
    };

    const unlockedSkills: string[] = [];
    const unlockedItems: string[] = [];
    let stateChanged = false;

    if (evidence.passed) {
      if (!updatedState.masteredSkills.includes(evidence.awardedSkill)) {
        updatedState.masteredSkills.push(evidence.awardedSkill);
        unlockedSkills.push(evidence.awardedSkill);
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
    _context?: Record<string, any>
  ): RecommendedAction {
    const hasCvSkill = updatedState.masteredSkills?.includes('jis_rirekisho_ready');

    if (!hasCvSkill) {
      return {
        actionType: 'practice',
        targetId: 'jis_rirekisho_studio',
        titleBn: 'জেআইএস রিরেকিশো তথ্য সম্পূর্ণ করুন',
        explanationBn: 'জাপানে চাকরির জন্য আপনার শিক্ষাগত যোগ্যতা ও কাজের ইতিহাস জাপানিজ ফরম্যাটে যুক্ত করুন।',
        route: 'rirekisho',
        params: { tab: 'editor' }
      };
    }

    return {
      actionType: 'advance',
      targetId: 'tokyo_baito_interview_drill',
      titleBn: 'পরবর্তী ধাপ: রিরেকিশো পিডিএফ ডাউনলোড ও ইন্টারভিউ প্রস্তুতি',
      explanationBn: 'আপনার রিরেকিশো প্রস্তুত! এখন স্টুডিও থেকে অফিসিয়াল সাইজ A4/B4 পিডিএফ এক্সপোর্ট করুন।',
      route: 'rirekisho',
      params: { tab: 'export' }
    };
  }
};
