// src/components/canvas3d/learning/ObservationalLearningEngine.ts
// NIHOMI WORLD™ — 7-STAGE OBSERVATIONAL LEARNING ENGINE
// Loop: OBSERVE → NOTICE → UNDERSTAND → LEARN → PRACTICE → APPLY → REMEMBER

import { memoryOS, MemoryLogItem } from '../engine/MemoryOSEngine';

export type CognitiveStage =
  | 'OBSERVE'
  | 'NOTICE'
  | 'UNDERSTAND'
  | 'LEARN'
  | 'PRACTICE'
  | 'APPLY'
  | 'REMEMBER';

export interface ObservationalLearningUnit {
  id: string;
  poiId: string;
  titleJa: string;
  titleEn: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  culturalContextJa: string;
  culturalContextEn: string;
  culturalContextBn: string;
  targetPhraseJa: string;
  targetPhraseRomaji: string;
  targetPhraseEn: string;
  grammarPattern: string;
  keigoCategory: 'Sonkeigo (尊敬語)' | 'Kenjougo (謙譲語)' | 'Teineigo (丁寧語)' | 'Baito Keigo (バイト敬語)';
  commonMistakes: Array<{
    incorrectPhraseJa: string;
    reasonJa: string;
    reasonEn: string;
  }>;
}

export interface LearningEvaluationResult {
  isCorrect: boolean;
  scoreGrade: 0 | 1 | 2 | 3 | 4 | 5; // SuperMemo-2 rating
  feedbackJa: string;
  feedbackEn: string;
  coinsAwarded: number;
  xpAwarded: number;
  nextReviewDate: Date;
  scheduledIntervalDays: number;
}

export class ObservationalLearningEngine {
  private static instance: ObservationalLearningEngine;
  private currentStage: CognitiveStage = 'OBSERVE';
  private activeUnit: ObservationalLearningUnit | null = null;

  public static getInstance(): ObservationalLearningEngine {
    if (!ObservationalLearningEngine.instance) {
      ObservationalLearningEngine.instance = new ObservationalLearningEngine();
    }
    return ObservationalLearningEngine.instance;
  }

  public getStage(): CognitiveStage {
    return this.currentStage;
  }

  public setStage(stage: CognitiveStage): void {
    this.currentStage = stage;
  }

  public getActiveUnit(): ObservationalLearningUnit | null {
    return this.activeUnit;
  }

  public setActiveUnit(unit: ObservationalLearningUnit): void {
    this.activeUnit = unit;
    this.currentStage = 'OBSERVE';
  }

  /**
   * Evaluates student's Japanese practice response, applies SM-2 SRS math,
   * logs failure/success to MemoryOS, and computes coins/XP rewards.
   */
  public evaluateResponse(
    unit: ObservationalLearningUnit,
    studentInputJa: string,
    isMasterKeigo: boolean
  ): LearningEvaluationResult {
    let scoreGrade: 0 | 1 | 2 | 3 | 4 | 5 = 5;
    let isCorrect = true;
    let feedbackJa = '素晴らしいです！完璧な敬語表現です。';
    let feedbackEn = 'Splendid! Flawless honorific Japanese structure.';
    let coinsAwarded = 25;
    let xpAwarded = 50;

    if (isMasterKeigo) {
      scoreGrade = 5;
      coinsAwarded = 25;
      xpAwarded = 50;
    } else if (studentInputJa.includes('です') || studentInputJa.includes('ます')) {
      scoreGrade = 3;
      isCorrect = true;
      feedbackJa = '意味は通じますが、ビジネスや接客ではより丁寧な表現を使いましょう。';
      feedbackEn = 'Understood, but use more polished Keigo in business and official interactions.';
      coinsAwarded = 15;
      xpAwarded = 30;
    } else {
      scoreGrade = 1;
      isCorrect = false;
      feedbackJa = '砕けすぎた表現です。相手に失礼になる可能性があります。';
      feedbackEn = 'Too casual/abrupt. This can come across as impolite in Japan.';
      coinsAwarded = 5;
      xpAwarded = 10;
    }

    // Persist meaningful failure / success directly into MemoryOS SuperMemo-2 Spaced Repetition
    const srsItem: MemoryLogItem = memoryOS.recordAttempt({
      phraseJa: unit.targetPhraseJa,
      meaningEn: unit.targetPhraseEn,
      jlptLevel: unit.jlptLevel,
      qualityScore: scoreGrade,
      studentInput: studentInputJa
    });

    this.currentStage = 'REMEMBER';

    return {
      isCorrect,
      scoreGrade,
      feedbackJa,
      feedbackEn,
      coinsAwarded,
      xpAwarded,
      nextReviewDate: new Date(srsItem.nextReviewTimestamp),
      scheduledIntervalDays: srsItem.intervalDays
    };
  }
}

export const observationalLearningEngine = ObservationalLearningEngine.getInstance();
