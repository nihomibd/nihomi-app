// src/core/adapters/types.ts
// NIHOMI Shared Learning Loop — Domain Adapter Contracts
// Defined according to canonical docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md

import { LearnerKnowledgeState } from '../curriculum/learnerKnowledgeState';

export type NihomiDomain =
  | 'japanese-learning'
  | 'pos-simulation'
  | 'exam-os'
  | 'cv-rirekisho'
  | 'platform';

export interface PrerequisiteValidationResult {
  eligible: boolean;
  unmetPrerequisites: string[];
  reasonBn: string;
  recommendedUnlock?: string;
}

export interface ActivityAttemptResult<TEvaluation = any, TEvidence = any> {
  score: number; // 0 - 100
  passed: boolean;
  rubricVersion: string;
  evaluation: TEvaluation;
  evidence: TEvidence;
  feedbackBn: string;
  xpEarned: number;
}

export interface StateUpdateDerivation<TState = LearnerKnowledgeState> {
  updatedState: TState;
  stateChanged: boolean;
  unlockedSkills: string[];
  unlockedItems: string[];
}

export interface RecommendedAction {
  actionType: 'teach' | 'practice' | 'retry' | 'review' | 'advance';
  targetId: string;
  titleBn: string;
  explanationBn: string;
  route: string;
  params?: Record<string, any>;
}

export interface DomainAdapter<TActivity = any, TAttempt = any, TEvaluation = any, TEvidence = any> {
  domain: NihomiDomain;
  version: string;
  selectActivity(state: LearnerKnowledgeState, context?: Record<string, any>): TActivity;
  validatePrerequisites(activity: TActivity, state: LearnerKnowledgeState): PrerequisiteValidationResult;
  evaluateAttempt(activity: TActivity, attempt: TAttempt, rubricVersion?: string): ActivityAttemptResult<TEvaluation, TEvidence>;
  deriveEvidence(evaluation: TEvaluation, attempt: TAttempt): TEvidence;
  deriveStateUpdate(priorState: LearnerKnowledgeState, evidence: TEvidence): StateUpdateDerivation;
  recommendNextAction(updatedState: LearnerKnowledgeState, context?: Record<string, any>): RecommendedAction;
}
