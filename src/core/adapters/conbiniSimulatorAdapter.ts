// src/core/adapters/conbiniSimulatorAdapter.ts
// NIHOMI Domain Adapter — 7-Eleven / Conbini POS Workplace Simulation
// Governed by docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md and the N.I.H.O.M.I Shared Loop Contract

import {
  DomainAdapter,
  PrerequisiteValidationResult,
  ActivityAttemptResult,
  StateUpdateDerivation,
  RecommendedAction
} from './types';
import { LearnerKnowledgeState } from '../curriculum/learnerKnowledgeState';

export type ConbiniBrandId = '7eleven' | 'lawson' | 'familymart';

export interface ConbiniActivity {
  id: string;
  brandId: ConbiniBrandId;
  scenarioId: string;
  customerName: string;
  totalSteps: number; // strictly 5 steps
  titleBn: string;
  descriptionBn: string;
  items: Array<{
    nameJa: string;
    nameBn: string;
    priceYen: number;
    barcode: string;
    requiresMicrowave?: boolean;
    requiresTongs?: boolean;
  }>;
}

export interface ConbiniShiftAttempt {
  scenarioId: string;
  stepsCompleted: number; // 0 to 5
  step1GreetingCorrect: boolean;
  step2ItemsScanned: boolean;
  step3ServiceHandled: boolean; // point card, microwave, bag
  step4PaymentCalculated: boolean;
  step5ClosingPolite: boolean;
  timeSpentSeconds: number;
}

export interface ConbiniEvaluation {
  shiftScore: number; // 0 - 100%
  passed: boolean;
  stepsPassed: number;
  weakStep?: number;
  customerSatisfaction: 'excellent' | 'good' | 'needs_practice';
  diagnosticsBn: string;
}

export interface ConbiniEvidence {
  scenarioId: string;
  shiftScore: number;
  passed: boolean;
  awardedSkill: string; // 'baito_conbini_cashier'
  completedAt: string;
}

export const conbiniSimulatorAdapter: DomainAdapter<
  ConbiniActivity,
  ConbiniShiftAttempt,
  ConbiniEvaluation,
  ConbiniEvidence
> = {
  domain: 'pos-simulation',
  version: '1.0.0',

  selectActivity(_state: LearnerKnowledgeState, context?: Record<string, any>): ConbiniActivity {
    const brandId: ConbiniBrandId = context?.brandId || '7eleven';
    const scenarioId = context?.scenarioId || 'conbini_shift_standard_01';

    return {
      id: `pos-${brandId}-${scenarioId}`,
      brandId,
      scenarioId,
      customerName: '田中様 (Tanaka-sama)',
      totalSteps: 5,
      titleBn: '৭-ইলেভেন কনবিনি ক্যাশিয়ার কাউন্টার ড্রিল',
      descriptionBn: 'টোকিও ৭-ইলেভেন ক্যাশিয়ার কাউন্টারে গ্রাহকের আগমন থেকে শুরু করে বিদায় পর্যন্ত ৫টি প্রামাণ্য ধাপ।',
      items: [
        {
          nameJa: '特製 幕の内弁当',
          nameBn: 'স্পেশাল মাকুনোউচি বেন্তো (খাবার গরম করতে হবে)',
          priceYen: 580,
          barcode: '4901234567890',
          requiresMicrowave: true
        },
        {
          nameJa: 'ななチキ (ホットスナック)',
          nameBn: 'নানাচিকি ক্রিস্পি ফ্রাইড চিকেন (টং দিয়ে দিতে হবে)',
          priceYen: 240,
          barcode: '4901234567891',
          requiresTongs: true
        },
        {
          nameJa: '緑茶 500ml',
          nameBn: 'গ্রিন টি ৫০০ মি.লি.',
          priceYen: 160,
          barcode: '4901234567892'
        }
      ]
    };
  },

  validatePrerequisites(
    _activity: ConbiniActivity,
    _state: LearnerKnowledgeState
  ): PrerequisiteValidationResult {
    // WorkOS / POS simulation is an educational workplace simulator accessible to all learners
    return {
      eligible: true,
      unmetPrerequisites: [],
      reasonBn: 'কনবিনি ক্যাশিয়ার সিমুলেশন উন্মুক্ত। জাপানে পার্ট-টাইম কাজের বাস্তব অনুশীলন শুরু করতে পারেন।'
    };
  },

  evaluateAttempt(
    activity: ConbiniActivity,
    attempt: ConbiniShiftAttempt,
    rubricVersion = '1.0.0'
  ): ActivityAttemptResult<ConbiniEvaluation, ConbiniEvidence> {
    let points = 0;
    let weakStep: number | undefined;

    if (attempt.step1GreetingCorrect) points += 20;
    else if (!weakStep) weakStep = 1;

    if (attempt.step2ItemsScanned) points += 20;
    else if (!weakStep) weakStep = 2;

    if (attempt.step3ServiceHandled) points += 20;
    else if (!weakStep) weakStep = 3;

    if (attempt.step4PaymentCalculated) points += 20;
    else if (!weakStep) weakStep = 4;

    if (attempt.step5ClosingPolite) points += 20;
    else if (!weakStep) weakStep = 5;

    const shiftScore = Math.min(100, Math.max(0, points));
    const passed = shiftScore >= 80;

    let customerSatisfaction: 'excellent' | 'good' | 'needs_practice' = 'needs_practice';
    if (shiftScore >= 100) customerSatisfaction = 'excellent';
    else if (shiftScore >= 80) customerSatisfaction = 'good';

    let diagnosticsBn = '';
    if (passed) {
      diagnosticsBn = `✔ চমৎকার শিফট! গ্রাহক ১০০% সন্তুষ্ট। আপনার স্কোর: ${shiftScore}%।`;
    } else {
      diagnosticsBn = `❌ শিফটের ধাপ ${weakStep || 1} এ অসতর্কতা হয়েছে। জাপানিজ কেসার্ভিস এটিকেট পুনরায় লক্ষ্য করুন।`;
    }

    const evaluation: ConbiniEvaluation = {
      shiftScore,
      passed,
      stepsPassed: Math.floor(shiftScore / 20),
      weakStep,
      customerSatisfaction,
      diagnosticsBn
    };

    const evidence: ConbiniEvidence = {
      scenarioId: activity.scenarioId,
      shiftScore,
      passed,
      awardedSkill: 'baito_conbini_cashier',
      completedAt: new Date().toISOString()
    };

    const xpEarned = passed ? 50 : 15;

    return {
      score: shiftScore,
      passed,
      rubricVersion,
      evaluation,
      evidence,
      feedbackBn: diagnosticsBn,
      xpEarned
    };
  },

  deriveEvidence(evaluation: ConbiniEvaluation, attempt: ConbiniShiftAttempt): ConbiniEvidence {
    return {
      scenarioId: attempt.scenarioId,
      shiftScore: evaluation.shiftScore,
      passed: evaluation.passed,
      awardedSkill: 'baito_conbini_cashier',
      completedAt: new Date().toISOString()
    };
  },

  deriveStateUpdate(
    priorState: LearnerKnowledgeState,
    evidence: ConbiniEvidence
  ): StateUpdateDerivation {
    const updatedState: LearnerKnowledgeState = {
      ...priorState,
      masteredSkills: [...(priorState.masteredSkills || [])],
      totalXp: (priorState.totalXp || 0) + (evidence.passed ? 50 : 15)
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
    context?: Record<string, any>
  ): RecommendedAction {
    const hasCashierSkill = updatedState.masteredSkills?.includes('baito_conbini_cashier');

    if (!hasCashierSkill || context?.retryWeakStep) {
      return {
        actionType: 'practice',
        targetId: 'conbini_shift_standard_01',
        titleBn: '৭-ইলেভেন ক্যাশিয়ার কাউন্টার ড্রিল',
        explanationBn: 'গ্রাহকের আগমন ও শুভেচ্ছা থেকে শুরু করে পেমেন্ট ও রসিদ প্রদান পর্যন্ত ৫টি ধাপ নিখুঁত করুন।',
        route: 'workos',
        params: { brandId: '7eleven' }
      };
    }

    return {
      actionType: 'advance',
      targetId: 'tokyo_career_izakaya',
      titleBn: 'পরবর্তী ক্যারিয়ার ড্রিল: ইজাকায়া ও হোটেল কাস্টমার সার্ভিস',
      explanationBn: 'কনবিনি ক্যাশিয়ারিতে দক্ষ হওয়ার পর রেস্তোরাঁ ও হোটেল সার্ভিসের জাপানিজ ম্যানার শিখুন।',
      route: 'workos',
      params: { tab: 'scenarios' }
    };
  }
};
