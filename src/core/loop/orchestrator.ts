// src/core/loop/orchestrator.ts
// NIHOMI Shared Learning Loop Orchestrator — Central Orchestration Engine
// Implements the canonical 11-step shared learning loop across all domains:
// Understand goal/state -> Diagnose -> Select objective -> Teach/brief -> Practice/simulate ->
// Evaluate -> Correct/retry -> Save evidence -> Update memory/state -> Schedule review -> Recommend next action
// Governed by docs/NIHOMI_PRODUCT_DOMAIN_MATRIX.md and .agents/rules/nihomi-constitution.md

import {
  DomainAdapter,
  NihomiDomain,
  PrerequisiteValidationResult,
  ActivityAttemptResult,
  StateUpdateDerivation,
  RecommendedAction
} from '../adapters/types';
import {
  japaneseLearningAdapter,
  conbiniSimulatorAdapter,
  examOsAdapter,
  cvRirekishoAdapter
} from '../adapters';
import {
  LearnerKnowledgeState,
  syncKnowledgeStateToServer
} from '../curriculum/learnerKnowledgeState';

export interface LoopBriefingRequest {
  domain: NihomiDomain;
  learnerState: LearnerKnowledgeState;
  context?: Record<string, any>;
}

export interface LoopBriefingResult<TActivity = any> {
  domain: NihomiDomain;
  activity: TActivity;
  prerequisites: PrerequisiteValidationResult;
  briefingTitleBn: string;
  briefingExplanationBn: string;
  isEligible: boolean;
}

export interface LoopEvaluationRequest<TActivity = any, TAttempt = any> {
  domain: NihomiDomain;
  learnerState: LearnerKnowledgeState;
  activity: TActivity;
  attempt: TAttempt;
  rubricVersion?: string;
}

export interface LoopEvaluationResult<TEvaluation = any, TEvidence = any> {
  domain: NihomiDomain;
  attemptResult: ActivityAttemptResult<TEvaluation, TEvidence>;
  stateDerivation: StateUpdateDerivation;
  diagnosticsBn: string;
  nextAction: RecommendedAction;
  persisted: boolean;
}

export class NihomiLearningLoopOrchestrator {
  private adapters: Map<NihomiDomain, DomainAdapter> = new Map();

  constructor() {
    this.registerAdapter(japaneseLearningAdapter);
    this.registerAdapter(conbiniSimulatorAdapter);
    this.registerAdapter(examOsAdapter);
    this.registerAdapter(cvRirekishoAdapter);
  }

  registerAdapter(adapter: DomainAdapter): void {
    this.adapters.set(adapter.domain, adapter);
  }

  getAdapter(domain: NihomiDomain): DomainAdapter {
    const adapter = this.adapters.get(domain);
    if (!adapter) {
      throw new Error(`[LoopOrchestrator] No domain adapter registered for domain: '${domain}'`);
    }
    return adapter;
  }

  /**
   * Step 1 - 4: Understand goal/state -> Diagnose -> Select objective -> Teach/brief
   */
  startLoopActivity<TActivity = any>(
    request: LoopBriefingRequest
  ): LoopBriefingResult<TActivity> {
    const adapter = this.getAdapter(request.domain);
    const state = request.learnerState;

    // Step 3: Select objective
    const activity = adapter.selectActivity(state, request.context);

    // Step 2 & Prerequisite Validation
    const prereq = adapter.validatePrerequisites(activity, state);

    let briefingTitleBn = activity.titleBn || 'কার্যক্রম ব্রিফিং';
    let briefingExplanationBn = prereq.reasonBn;

    if (!prereq.eligible) {
      briefingExplanationBn = `পূর্বশর্ত অপূর্ণ: ${prereq.reasonBn}`;
    }

    return {
      domain: request.domain,
      activity,
      prerequisites: prereq,
      briefingTitleBn,
      briefingExplanationBn,
      isEligible: prereq.eligible
    };
  }

  /**
   * Step 6 - 11: Evaluate -> Correct/retry -> Save evidence -> Update memory/state -> Schedule review -> Recommend next action
   */
  processAttempt<TActivity = any, TAttempt = any, TEvaluation = any, TEvidence = any>(
    request: LoopEvaluationRequest<TActivity, TAttempt>
  ): LoopEvaluationResult<TEvaluation, TEvidence> {
    const adapter = this.getAdapter(request.domain);
    const state = request.learnerState;

    // Step 6: Evaluate attempt
    const attemptResult = adapter.evaluateAttempt(
      request.activity,
      request.attempt,
      request.rubricVersion
    );

    // Step 8: Save evidence
    const evidence = adapter.deriveEvidence(attemptResult.evaluation, request.attempt);

    // Step 9 & 10: Update memory/state & Schedule review
    const stateDerivation = adapter.deriveStateUpdate(state, evidence);

    // Server state synchronization (stateless persistence)
    let persisted = false;
    if (stateDerivation.stateChanged && typeof window !== 'undefined') {
      try {
        syncKnowledgeStateToServer(stateDerivation.updatedState);
        persisted = true;
      } catch (err) {
        console.warn('[LoopOrchestrator] Knowledge state server sync failed:', err);
      }
    }

    // Step 11: Recommend next action
    const nextAction = adapter.recommendNextAction(
      stateDerivation.updatedState,
      { lastAttemptPassed: attemptResult.passed }
    );

    return {
      domain: request.domain,
      attemptResult,
      stateDerivation,
      diagnosticsBn: attemptResult.feedbackBn,
      nextAction,
      persisted
    };
  }
}

export const loopOrchestrator = new NihomiLearningLoopOrchestrator();
