import {
  SrsCardRecord,
  SrsCardStage,
  SrsItemType,
  SrsRatingGrade,
  SrsAlgorithmMode,
  SrsReviewSubmission,
  SrsReviewLog,
  SrsRetentionCurveReport,
  SrsRetentionCurvePoint,
  SrsTelemetryStats,
  JLPTLevel
} from '../types.js';

export class AdaptiveSrsService {
  /**
   * Evaluates current retention percentage based on Ebbinghaus / FSRS forgetting model:
   * R(t) = exp(-t * ln(10/9) / S) * 100%
   * Where S is stability in days (time until retention reaches 90%).
   */
  public static calculateRetrievability(elapsedDays: number, stabilityDays: number): number {
    const s = Math.max(0.2, stabilityDays);
    const t = Math.max(0, elapsedDays);
    const lnFactor = Math.log(10 / 9); // approx 0.10536
    const r = Math.exp((-t * lnFactor) / s);
    return Math.min(1.0, Math.max(0.01, r));
  }

  /**
   * Calculates retention score (0 - 100%) for a card at the current timestamp
   */
  public static getCardCurrentRetention(card: SrsCardRecord, now: Date = new Date()): number {
    if (!card.lastReviewedAt) {
      return 100; // Unreviewed new card
    }
    const last = new Date(card.lastReviewedAt).getTime();
    const elapsedDays = Math.max(0, (now.getTime() - last) / (1000 * 60 * 60 * 24));
    const r = this.calculateRetrievability(elapsedDays, card.stabilityDays || card.intervalDays || 1);
    return Math.round(r * 100);
  }

  /**
   * Check if a card is currently due for review
   */
  public static isCardDue(card: SrsCardRecord, now: Date = new Date()): boolean {
    if (card.suspended) return false;
    if (!card.nextReviewAt) return true;
    return new Date(card.nextReviewAt).getTime() <= now.getTime();
  }

  /**
   * Map interval and repetition to standard 5-stage spaced repetition mastery:
   * Apprentice -> Guru -> Master -> Enlightened -> Burned
   */
  public static calculateStage(intervalDays: number, repetition: number): SrsCardStage {
    if (intervalDays >= 30 || repetition >= 7) {
      return 'burned';
    }
    if (intervalDays >= 14 || repetition >= 5) {
      return 'enlightened';
    }
    if (intervalDays >= 7 || repetition >= 3) {
      return 'master';
    }
    if (intervalDays >= 3 || repetition >= 2) {
      return 'guru';
    }
    return 'apprentice';
  }

  /**
   * Process a card review using SuperMemo-2 (SM-2) algorithm
   */
  public static processSm2Review(
    card: SrsCardRecord,
    rating: SrsRatingGrade,
    elapsedDays: number = 1
  ): {
    intervalDays: number;
    repetition: number;
    easeFactor: number;
    lapses: number;
  } {
    let easeFactor = card.easeFactor || 2.5;
    let repetition = card.repetition || 0;
    let intervalDays = card.intervalDays || 0;
    let lapses = card.lapses || 0;

    // Quality grades in SM-2 standard 0-5 scale:
    // again = 2, hard = 3, good = 4, easy = 5
    let q = 4;
    if (rating === 'again') q = 2;
    else if (rating === 'hard') q = 3;
    else if (rating === 'good') q = 4;
    else if (rating === 'easy') q = 5;

    // SM-2 Ease Factor calculation
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const deltaEf = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    easeFactor = Math.max(1.3, Number((easeFactor + deltaEf).toFixed(3)));

    if (rating === 'again') {
      repetition = 0;
      intervalDays = 1;
      // Increment lapses if this card had already matured beyond Apprentice stage
      if (card.stage !== 'apprentice') {
        lapses += 1;
      }
    } else if (rating === 'hard') {
      repetition = Math.max(1, repetition);
      intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2));
    } else if (rating === 'good') {
      if (repetition === 0) {
        intervalDays = 1;
      } else if (repetition === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
      }
      repetition += 1;
    } else if (rating === 'easy') {
      if (repetition === 0) {
        intervalDays = 3;
      } else if (repetition === 1) {
        intervalDays = 8;
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * easeFactor * 1.3));
      }
      repetition += 1;
      easeFactor = Math.max(1.3, Number((easeFactor + 0.15).toFixed(3)));
    }

    return {
      intervalDays,
      repetition,
      easeFactor,
      lapses
    };
  }

  /**
   * Process a card review using Free Spaced Repetition Scheduler (FSRS) algorithm
   */
  public static processFsrsReview(
    card: SrsCardRecord,
    rating: SrsRatingGrade,
    elapsedDays: number,
    targetRetention: number = 0.90
  ): {
    stabilityDays: number;
    difficulty: number;
    intervalDays: number;
  } {
    let stability = card.stabilityDays;
    let difficulty = card.difficulty ?? 5.0;

    const isFirstReview = card.totalReviews === 0 || !stability;

    if (isFirstReview) {
      // First review initialization
      switch (rating) {
        case 'again':
          stability = 0.5;
          difficulty = 7.5;
          break;
        case 'hard':
          stability = 1.2;
          difficulty = 6.5;
          break;
        case 'good':
          stability = 3.0;
          difficulty = 5.0;
          break;
        case 'easy':
          stability = 6.0;
          difficulty = 3.5;
          break;
      }
    } else {
      // Prior retrievability at current review
      const currentR = this.calculateRetrievability(elapsedDays, stability);

      // Difficulty update with mean-reversion toward 5.0
      let deltaD = 0;
      switch (rating) {
        case 'again':
          deltaD = 1.6;
          break;
        case 'hard':
          deltaD = 0.8;
          break;
        case 'good':
          deltaD = 0;
          break;
        case 'easy':
          deltaD = -1.2;
          break;
      }
      // D' = clamp(1.0, 10.0, D + deltaD * 0.5 + 0.05 * (5.0 - D))
      difficulty = Math.min(10.0, Math.max(1.0, Number((difficulty + deltaD * 0.5 + 0.05 * (5.0 - difficulty)).toFixed(2))));

      if (rating === 'again') {
        // Forgotten card: post-lapse stability
        stability = Math.max(0.5, Number(Math.min(stability * 0.25, 1.5).toFixed(2)));
      } else {
        // Recall success: stability increases as a function of current stability, difficulty, and overdue factor (1 - R)
        const overdueBonus = Math.max(0, 1.0 - currentR);
        let multiplier = 1.0;
        if (rating === 'hard') {
          multiplier = 1.0 + (11.0 - difficulty) * 0.14 * (1.0 + overdueBonus);
        } else if (rating === 'good') {
          multiplier = 1.0 + (11.0 - difficulty) * 0.28 * (1.0 + overdueBonus);
        } else if (rating === 'easy') {
          multiplier = 1.0 + (11.0 - difficulty) * 0.46 * (1.0 + overdueBonus);
        }
        stability = Math.max(1.0, Number((stability * multiplier).toFixed(2)));
      }
    }

    // Scheduled interval based on desired retention r:
    // I = S * (ln(r) / ln(0.9))
    const rClamped = Math.min(0.97, Math.max(0.70, targetRetention));
    const factor = Math.log(rClamped) / Math.log(0.9);
    const intervalDays = Math.max(1, Math.round(stability * factor));

    return {
      stabilityDays: stability,
      difficulty,
      intervalDays
    };
  }

  /**
   * Unified Adaptive SRS Engine
   * Executes SM-2 & FSRS in synergy, updating both algorithmic states and generating
   * comprehensive learner telemetry.
   */
  public static executeReview(
    card: SrsCardRecord,
    submission: SrsReviewSubmission,
    now: Date = new Date()
  ): {
    updatedCard: SrsCardRecord;
    reviewLog: SrsReviewLog;
  } {
    const lastReviewedAtTime = card.lastReviewedAt ? new Date(card.lastReviewedAt).getTime() : now.getTime() - 24 * 60 * 60 * 1000;
    const elapsedDays = Math.max(0, (now.getTime() - lastReviewedAtTime) / (1000 * 60 * 60 * 24));
    const scheduledDays = card.intervalDays || 1;

    // Snapshot pre-review state
    const stageBefore = card.stage;
    const intervalDaysBefore = card.intervalDays;
    const easeFactorBefore = card.easeFactor;
    const stabilityBefore = card.stabilityDays;
    const difficultyBefore = card.difficulty;
    const retentionBeforeReview = this.getCardCurrentRetention(card, now);

    const mode = submission.algorithmMode || 'adaptive_hybrid';
    const targetRetention = submission.targetRetention || 0.90;

    // 1. Compute SM-2 update
    const sm2Result = this.processSm2Review(card, submission.rating, elapsedDays);

    // 2. Compute FSRS update
    const fsrsResult = this.processFsrsReview(card, submission.rating, elapsedDays, targetRetention);

    // 3. Reconcile final interval and variables based on mode
    let finalIntervalDays: number;
    if (mode === 'sm2') {
      finalIntervalDays = sm2Result.intervalDays;
    } else if (mode === 'fsrs') {
      finalIntervalDays = fsrsResult.intervalDays;
    } else {
      // adaptive_hybrid: FSRS stability-derived interval with SM-2 ease factor modulation
      const hybridInterval = Math.round((fsrsResult.intervalDays * 0.6) + (sm2Result.intervalDays * 0.4));
      finalIntervalDays = Math.max(1, hybridInterval);
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + finalIntervalDays);

    const stageAfter = this.calculateStage(finalIntervalDays, sm2Result.repetition);
    const newTotalReviews = (card.totalReviews || 0) + 1;
    const consecutiveCorrect = submission.rating === 'again' ? 0 : (card.consecutiveCorrect || 0) + 1;

    const updatedCard: SrsCardRecord = {
      ...card,
      repetition: sm2Result.repetition,
      intervalDays: finalIntervalDays,
      easeFactor: sm2Result.easeFactor,
      stabilityDays: fsrsResult.stabilityDays,
      difficulty: fsrsResult.difficulty,
      retrievability: 1.0, // immediately 100% retrievable
      retentionScore: 100,
      lapses: sm2Result.lapses,
      totalReviews: newTotalReviews,
      consecutiveCorrect,
      stage: stageAfter,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextDate.toISOString(),
      updatedAt: now.toISOString()
    };

    const reviewLog: SrsReviewLog = {
      id: `srs-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: card.userId,
      cardId: card.id,
      itemId: card.itemId,
      itemType: card.itemType,
      rating: submission.rating,
      algorithmUsed: mode,
      scheduledDays,
      actualElapsedDays: Number(elapsedDays.toFixed(2)),
      responseTimeMs: submission.responseTimeMs || 0,
      retentionBeforeReview,
      stageBefore,
      stageAfter,
      intervalDaysBefore,
      intervalDaysAfter: finalIntervalDays,
      easeFactorBefore,
      easeFactorAfter: sm2Result.easeFactor,
      stabilityBefore,
      stabilityAfter: fsrsResult.stabilityDays,
      difficultyBefore,
      difficultyAfter: fsrsResult.difficulty,
      reviewedAt: now.toISOString()
    };

    return {
      updatedCard,
      reviewLog
    };
  }

  /**
   * Generates a 60-day theoretical & empirical retention curve for a specific card or overall stability
   */
  public static generateRetentionCurve(
    card?: SrsCardRecord,
    logs: SrsReviewLog[] = [],
    customStability?: number
  ): SrsRetentionCurveReport {
    const stability = customStability || card?.stabilityDays || 3.0;
    const halfLifeDays = Number((stability * (Math.log(0.5) / Math.log(0.9))).toFixed(1)); // ~6.58 * S

    const currentElapsedDays = card?.lastReviewedAt
      ? Number((Math.max(0, (Date.now() - new Date(card.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24))).toFixed(1))
      : 0;

    const currentRetention = Math.round(this.calculateRetrievability(currentElapsedDays, stability) * 100);
    const recommendedReviewDay = Math.max(1, Math.round(stability));

    // Bin empirical logs by actualElapsedDays to plot observed retention
    const empiricalBins: Record<number, { total: number; recalled: number }> = {};
    logs.forEach((log) => {
      const dayBin = Math.round(log.actualElapsedDays);
      if (dayBin >= 0 && dayBin <= 60) {
        if (!empiricalBins[dayBin]) {
          empiricalBins[dayBin] = { total: 0, recalled: 0 };
        }
        empiricalBins[dayBin].total += 1;
        if (log.rating !== 'again') {
          empiricalBins[dayBin].recalled += 1;
        }
      }
    });

    const points: SrsRetentionCurvePoint[] = [];
    const maxDays = Math.max(30, Math.min(60, Math.round(stability * 3)));

    for (let day = 0; day <= maxDays; day++) {
      const theoreticalRetention = Math.round(this.calculateRetrievability(day, stability) * 100);
      const bin = empiricalBins[day];
      const empiricalRetention = bin && bin.total >= 1 ? Math.round((bin.recalled / bin.total) * 100) : undefined;

      points.push({
        day,
        theoreticalRetention,
        empiricalRetention,
        reviewCount: bin?.total
      });
    }

    return {
      cardId: card?.id,
      itemTitle: card?.front,
      stabilityDays: stability,
      halfLifeDays,
      currentElapsedDays,
      currentRetention,
      recommendedReviewDay,
      points
    };
  }

  /**
   * Generates comprehensive learner telemetry statistics and review load forecast
   */
  public static calculateTelemetryStats(
    cards: SrsCardRecord[],
    logs: SrsReviewLog[]
  ): SrsTelemetryStats {
    const now = new Date();

    const stages: Record<SrsCardStage, number> = {
      apprentice: 0,
      guru: 0,
      master: 0,
      enlightened: 0,
      burned: 0
    };

    const types: Record<SrsItemType, number> = {
      vocabulary: 0,
      kanji: 0,
      grammar: 0
    };

    const levels: Record<JLPTLevel, number> = {
      N5: 0,
      N4: 0,
      N3: 0,
      N2: 0,
      N1: 0
    };

    let dueCards = 0;
    let totalEase = 0;
    let totalStability = 0;
    let totalDifficulty = 0;
    let totalLapses = 0;

    cards.forEach((card) => {
      stages[card.stage] = (stages[card.stage] || 0) + 1;
      types[card.itemType] = (types[card.itemType] || 0) + 1;
      levels[card.level] = (levels[card.level] || 0) + 1;

      if (this.isCardDue(card, now)) {
        dueCards++;
      }

      totalEase += card.easeFactor || 2.5;
      totalStability += card.stabilityDays || 1;
      totalDifficulty += card.difficulty || 5;
      totalLapses += card.lapses || 0;
    });

    const totalCards = cards.length;
    const averageEaseFactor = totalCards > 0 ? Number((totalEase / totalCards).toFixed(2)) : 2.5;
    const averageStability = totalCards > 0 ? Number((totalStability / totalCards).toFixed(2)) : 1.0;
    const averageDifficulty = totalCards > 0 ? Number((totalDifficulty / totalCards).toFixed(2)) : 5.0;

    // Review logs analysis
    const totalReviewsLifetime = logs.length;
    let totalLatency = 0;
    let correctCount = 0;

    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    let reviews7d = 0;
    let correct7d = 0;
    let reviews30d = 0;
    let correct30d = 0;

    logs.forEach((log) => {
      totalLatency += log.responseTimeMs || 0;
      const isCorrect = log.rating !== 'again';
      if (isCorrect) correctCount++;

      const reviewedTime = new Date(log.reviewedAt).getTime();
      if (reviewedTime >= sevenDaysAgo) {
        reviews7d++;
        if (isCorrect) correct7d++;
      }
      if (reviewedTime >= thirtyDaysAgo) {
        reviews30d++;
        if (isCorrect) correct30d++;
      }
    });

    const averageResponseTimeMs = totalReviewsLifetime > 0 ? Math.round(totalLatency / totalReviewsLifetime) : 0;
    const overallAccuracyRate = totalReviewsLifetime > 0 ? Math.round((correctCount / totalReviewsLifetime) * 100) : 100;
    const retentionRate7d = reviews7d > 0 ? Math.round((correct7d / reviews7d) * 100) : overallAccuracyRate;
    const retentionRate30d = reviews30d > 0 ? Math.round((correct30d / reviews30d) * 100) : overallAccuracyRate;

    // 14-day future review load forecast
    const dueForecast: { date: string; count: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate() + i);
      const dateStr = forecastDate.toISOString().split('T')[0];

      let count = 0;
      cards.forEach((c) => {
        if (!c.suspended && c.nextReviewAt) {
          const cardDueDay = c.nextReviewAt.split('T')[0];
          if (cardDueDay === dateStr) {
            count++;
          }
        }
      });

      dueForecast.push({ date: dateStr, count });
    }

    return {
      totalCards,
      dueCards,
      cardsByStage: stages,
      cardsByType: types,
      cardsByLevel: levels,
      retentionRate7d,
      retentionRate30d,
      overallAccuracyRate,
      averageEaseFactor,
      averageStability,
      averageDifficulty,
      averageResponseTimeMs,
      totalReviewsLifetime,
      lapsesTotal: totalLapses,
      dueForecast
    };
  }
}
