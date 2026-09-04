import {
  PitchAccentPattern,
  AccentSrsCard,
  AccentSrsSummary,
  AccentSrsReviewSubmission,
  TokyoPitchDrill,
  TokyoPitchAccentAssessment,
  BengaliAcousticAnalysis
} from '../types.js';
import { db } from '../db.js';
import { TOKYO_PITCH_PRESETS } from './pitchAccentService.js';

export class AccentSRSService {
  private static readonly LN_FACTOR = Math.log(10 / 9); // approx 0.10536

  /**
   * Calculates retention score (0 - 100%) based on Ebbinghaus / FSRS forgetting model:
   * R(t) = exp(-t * ln(10/9) / S) * 100%
   */
  public static calculateRetrievability(elapsedDays: number, stabilityDays: number): number {
    const s = Math.max(0.1, stabilityDays);
    const t = Math.max(0, elapsedDays);
    const r = Math.exp((-t * this.LN_FACTOR) / s);
    return Math.min(100, Math.max(1, Math.round(r * 100)));
  }

  /**
   * Computes SRS mastery stage from stability and repetition count
   */
  public static calculateStage(
    stabilityDays: number,
    reps: number
  ): 'apprentice' | 'guru' | 'master' | 'enlightened' | 'burned' {
    if (stabilityDays >= 60 && reps >= 7) return 'burned';
    if (stabilityDays >= 21 && reps >= 5) return 'enlightened';
    if (stabilityDays >= 8 && reps >= 3) return 'master';
    if (stabilityDays >= 3 && reps >= 2) return 'guru';
    return 'apprentice';
  }

  /**
   * Initializes or creates a new individual Accent SRS Card for a user.
   */
  public static async initializeCard(
    userId: string,
    drillId: string,
    targetPhrase: string,
    readingKana: string,
    pattern: PitchAccentPattern,
    downstepMora: number,
    romaji?: string,
    meaningBn?: string,
    meaningEn?: string,
    category?: string
  ): Promise<AccentSrsCard> {
    const now = new Date().toISOString();
    const card: AccentSrsCard = {
      id: `asrs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      drillId,
      targetPhrase,
      readingKana,
      romaji: romaji || targetPhrase,
      pattern,
      downstepMora,
      meaningBn: meaningBn || '',
      meaningEn: meaningEn || '',
      category: category || 'standard',
      stabilityDays: 1.0,
      difficulty: pattern === 'odaka' ? 0.45 : 0.35,
      repetition: 0,
      lapses: 0,
      intervalHours: 0,
      nextReviewAt: now,
      lastReviewedAt: null,
      retentionRate: 100,
      stage: 'apprentice',
      acousticRiskLevel: 'low',
      chronicDynamicStressCount: 0,
      chronicMoraFlatteningCount: 0,
      chronicChoonShorteningCount: 0,
      lastOverallScore: 0,
      lastPitchAccuracyScore: 0,
      createdAt: now,
      updatedAt: now
    };
    db.saveAccentSrsCard(card);
    return card;
  }

  /**
   * Automatically initializes acoustic SRS cards for a student from existing pitch drills and presets.
   */
  public static ensureCardsInitialized(userId: string): AccentSrsCard[] {
    let cards = db.getAccentSrsCards(userId);
    if (cards.length >= 8) {
      return cards;
    }

    const now = new Date().toISOString();
    const existingDrillIds = new Set(cards.map((c) => c.drillId));

    // 1. Gather all system drills from database
    const dbDrills = db.getPitchDrills();
    const allCandidates: {
      drillId: string;
      targetPhrase: string;
      readingKana: string;
      romaji: string;
      pattern: PitchAccentPattern;
      downstepMora: number;
      meaningBn: string;
      meaningEn: string;
      category: string;
    }[] = [];

    for (const d of dbDrills) {
      if (!existingDrillIds.has(d.id)) {
        allCandidates.push({
          drillId: d.id,
          targetPhrase: d.kanji,
          readingKana: d.readingKana,
          romaji: d.romaji,
          pattern: d.pattern,
          downstepMora: d.downstepMora,
          meaningBn: d.meaningBn,
          meaningEn: d.meaningEn,
          category: d.category
        });
        existingDrillIds.add(d.id);
      }
    }

    // 2. Supplement from presets if needed
    for (const preset of TOKYO_PITCH_PRESETS) {
      if (!existingDrillIds.has(preset.id)) {
        allCandidates.push({
          drillId: preset.id,
          targetPhrase: preset.kanji,
          readingKana: preset.readingKana,
          romaji: preset.romaji,
          pattern: preset.pattern,
          downstepMora: preset.downstepMora,
          meaningBn: preset.meaningBn,
          meaningEn: preset.meaningEn,
          category: preset.category
        });
        existingDrillIds.add(preset.id);
      }
    }

    // Seed up to 24 foundational cards (balanced across all 4 patterns)
    const newCards: AccentSrsCard[] = [];
    for (const candidate of allCandidates.slice(0, 32)) {
      // Odaka cards have higher initial difficulty due to Bengali particle stress transfer
      const initialDifficulty = candidate.pattern === 'odaka' ? 0.55 : 0.35;
      const card: AccentSrsCard = {
        id: `asrs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        drillId: candidate.drillId,
        targetPhrase: candidate.targetPhrase,
        readingKana: candidate.readingKana,
        romaji: candidate.romaji,
        pattern: candidate.pattern,
        downstepMora: candidate.downstepMora,
        meaningBn: candidate.meaningBn,
        meaningEn: candidate.meaningEn,
        category: candidate.category,
        stabilityDays: 0.5,
        difficulty: initialDifficulty,
        repetition: 0,
        lapses: 0,
        intervalHours: 0, // Due immediately for initial baseline
        nextReviewAt: now,
        lastReviewedAt: null,
        retentionRate: 100,
        stage: 'apprentice',
        acousticRiskLevel: candidate.pattern === 'odaka' ? 'medium' : 'low',
        chronicDynamicStressCount: 0,
        chronicMoraFlatteningCount: 0,
        chronicChoonShorteningCount: 0,
        lastOverallScore: 0,
        lastPitchAccuracyScore: 0,
        createdAt: now,
        updatedAt: now
      };
      db.saveAccentSrsCard(card);
      newCards.push(card);
    }

    return db.getAccentSrsCards(userId);
  }

  /**
   * Fetches due review queue and returns statistical summary.
   */
  public static getDueReviews(
    userId: string,
    limit = 20,
    patternFilter?: PitchAccentPattern
  ): {
    dueCards: AccentSrsCard[];
    summary: AccentSrsSummary;
  } {
    const allCards = this.ensureCardsInitialized(userId);
    const now = new Date();
    const nowMs = now.getTime();
    const next24hMs = nowMs + 24 * 60 * 60 * 1000;

    let totalDue = 0;
    let heibanDue = 0;
    let atamadakaDue = 0;
    let nakadakaDue = 0;
    let odakaDue = 0;
    let highAcousticRiskCount = 0;
    let upcomingNext24h = 0;

    const dueList: AccentSrsCard[] = [];

    for (const card of allCards) {
      // Calculate current retention rate
      if (card.lastReviewedAt) {
        const lastMs = new Date(card.lastReviewedAt).getTime();
        const elapsedDays = Math.max(0, (nowMs - lastMs) / (1000 * 60 * 60 * 24));
        card.retentionRate = this.calculateRetrievability(elapsedDays, card.stabilityDays);
      } else {
        card.retentionRate = 100;
      }

      const reviewAtMs = card.nextReviewAt ? new Date(card.nextReviewAt).getTime() : 0;
      const isDue = reviewAtMs <= nowMs;

      if (isDue) {
        totalDue++;
        if (card.pattern === 'heiban') heibanDue++;
        else if (card.pattern === 'atamadaka') atamadakaDue++;
        else if (card.pattern === 'nakadaka') nakadakaDue++;
        else if (card.pattern === 'odaka') odakaDue++;

        if (card.acousticRiskLevel === 'high') {
          highAcousticRiskCount++;
        }

        if (!patternFilter || card.pattern === patternFilter) {
          dueList.push(card);
        }
      } else if (reviewAtMs <= next24hMs) {
        upcomingNext24h++;
      }
    }

    // Sort due cards:
    // 1. High acoustic risk first
    // 2. Overdue duration descending
    // 3. Difficulty descending
    dueList.sort((a, b) => {
      const riskWeight = (risk: string) => (risk === 'high' ? 3 : risk === 'medium' ? 2 : 1);
      const riskDiff = riskWeight(b.acousticRiskLevel) - riskWeight(a.acousticRiskLevel);
      if (riskDiff !== 0) return riskDiff;

      const aDueMs = a.nextReviewAt ? new Date(a.nextReviewAt).getTime() : 0;
      const bDueMs = b.nextReviewAt ? new Date(b.nextReviewAt).getTime() : 0;
      const overdueDiff = aDueMs - bDueMs; // Earliest scheduled date first (most overdue)
      if (overdueDiff !== 0) return overdueDiff;

      return b.difficulty - a.difficulty;
    });

    const summary: AccentSrsSummary = {
      totalDue,
      heibanDue,
      atamadakaDue,
      nakadakaDue,
      odakaDue,
      highAcousticRiskCount,
      upcomingNext24h,
      totalTrackedCards: allCards.length
    };

    return {
      dueCards: dueList.slice(0, limit),
      summary
    };
  }

  /**
   * Processes a review submission for an acoustic accent card.
   * Adjusts stability, interval, difficulty, and penalizes Bengali dynamic stress transfer.
   */
  public static processReview(
    userIdOrSubmission: string | AccentSrsReviewSubmission,
    maybeSubmission?: AccentSrsReviewSubmission
  ): {
    card: AccentSrsCard;
    summary: AccentSrsSummary;
  } {
    let userId: string;
    let submission: AccentSrsReviewSubmission;

    if (typeof userIdOrSubmission === 'string') {
      userId = userIdOrSubmission;
      submission = maybeSubmission!;
    } else {
      submission = userIdOrSubmission;
      userId = submission.assessment?.userId || 'usr-default';
    }

    const allCards = this.ensureCardsInitialized(userId);
    let targetCard: AccentSrsCard | null = null;

    if (submission.cardId) {
      targetCard = allCards.find((c) => c.id === submission.cardId) || null;
    } else if (submission.drillId) {
      targetCard = allCards.find((c) => c.drillId === submission.drillId) || null;
    }

    // If card doesn't exist, create one dynamically
    if (!targetCard) {
      const drill = submission.drillId ? db.getPitchDrillById(submission.drillId) : null;
      targetCard = {
        id: `asrs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId,
        drillId: submission.drillId || 'custom',
        targetPhrase: drill ? drill.kanji : submission.assessment?.targetPhrase || '単語',
        readingKana: drill ? drill.readingKana : submission.assessment?.targetPhrase || '',
        romaji: drill ? drill.romaji : submission.assessment?.targetRomaji || '',
        pattern: drill ? drill.pattern : submission.assessment?.targetPattern || 'heiban',
        downstepMora: drill ? drill.downstepMora : submission.assessment?.targetDownstepMora || 0,
        meaningBn: drill ? drill.meaningBn : submission.assessment?.targetMeaning || '',
        meaningEn: drill ? drill.meaningEn : '',
        category: drill ? drill.category : 'custom_input',
        stabilityDays: 0.5,
        difficulty: 0.4,
        repetition: 0,
        lapses: 0,
        intervalHours: 0,
        nextReviewAt: new Date().toISOString(),
        lastReviewedAt: null,
        retentionRate: 100,
        stage: 'apprentice',
        acousticRiskLevel: 'low',
        chronicDynamicStressCount: 0,
        chronicMoraFlatteningCount: 0,
        chronicChoonShorteningCount: 0,
        lastOverallScore: 0,
        lastPitchAccuracyScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const assessment = submission.assessment;
    const overallScore = assessment?.overallScore ?? 75;
    const pitchScore = assessment?.pitchAccuracyScore ?? overallScore;
    const patternMatch = assessment?.patternMatch ?? (overallScore >= 75);
    const bengaliAnalysis = assessment?.bengaliAcousticAnalysis;

    // Determine review grade: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
    let grade: 1 | 2 | 3 | 4 = submission.userGrade || 3;
    if (!submission.userGrade) {
      if (submission.hasDynamicStressError || (!patternMatch && overallScore < 70)) {
        grade = 1;
      } else if (overallScore >= 90 && patternMatch && !bengaliAnalysis?.hasDynamicStressError) {
        grade = 4;
      } else if (overallScore >= 75 && patternMatch) {
        grade = 3;
      } else if (overallScore >= 60 && patternMatch) {
        grade = 2;
      } else {
        grade = 1;
      }
    }

    const now = new Date();
    targetCard.lastReviewedAt = now.toISOString();
    targetCard.lastOverallScore = overallScore;
    targetCard.lastPitchAccuracyScore = pitchScore;

    // Detect chronic Bengali interference flags
    let hasDynamicStress = false;
    let hasMoraFlattening = false;
    let hasChoonShortening = false;

    if (submission.hasDynamicStressError || bengaliAnalysis?.hasDynamicStressError) {
      hasDynamicStress = true;
      targetCard.chronicDynamicStressCount++;
    }
    if (submission.hasMoraFlatteningError || bengaliAnalysis?.hasMoraFlattening) {
      hasMoraFlattening = true;
      targetCard.chronicMoraFlatteningCount++;
    }
    if (submission.hasChoonShorteningError || bengaliAnalysis?.hasVowelLengthMismatch) {
      hasChoonShortening = true;
      targetCard.chronicChoonShorteningCount++;
    }

    // FSRS / SM-2 Derived Phonemic Interval Progression:
    if (grade === 1) {
      // Lapse: student failed accent contour or yelled with volume spike
      targetCard.lapses++;
      targetCard.repetition = 0;
      targetCard.difficulty = Math.min(1.0, targetCard.difficulty + 0.15);
      targetCard.stabilityDays = Math.max(0.15, targetCard.stabilityDays * 0.4);
      targetCard.intervalHours = 1; // Immediate review within 1 hour
      targetCard.acousticRiskLevel = 'high';

    } else if (grade === 2) {
      // Hard: recognized pattern with hesitation or minor pitch drift
      targetCard.repetition += 1;
      targetCard.difficulty = Math.min(1.0, targetCard.difficulty + 0.05);
      targetCard.stabilityDays = targetCard.stabilityDays * 1.15;
      targetCard.intervalHours = Math.max(6, Math.round(targetCard.stabilityDays * 12));

    } else if (grade === 3) {
      // Good: standard successful Tokyo pitch reproduction
      targetCard.repetition += 1;
      targetCard.difficulty = Math.max(0.1, targetCard.difficulty - 0.04);
      targetCard.stabilityDays = targetCard.stabilityDays * (1 + (1 - targetCard.difficulty) * 1.9);
      targetCard.intervalHours = Math.round(targetCard.stabilityDays * 24);

    } else if (grade === 4) {
      // Easy: pristine pitch contour and high mora rhythm
      targetCard.repetition += 1;
      targetCard.difficulty = Math.max(0.1, targetCard.difficulty - 0.08);
      targetCard.stabilityDays = targetCard.stabilityDays * (1 + (1 - targetCard.difficulty) * 2.9);
      targetCard.intervalHours = Math.round(targetCard.stabilityDays * 24 * 1.35);
    }

    // Apply Bengali Acoustic Penalty (Targeted Neuromuscular Muscle Memory)
    if (hasDynamicStress) {
      // Dynamic stress transfer is an ingrained native habit that decays quickly without intervention
      targetCard.stabilityDays = Math.max(0.2, targetCard.stabilityDays * 0.75);
      targetCard.difficulty = Math.min(1.0, targetCard.difficulty + 0.08);
      targetCard.intervalHours = Math.max(2, Math.round(targetCard.intervalHours * 0.6));
      targetCard.acousticRiskLevel = 'high';
    } else if (hasMoraFlattening) {
      targetCard.intervalHours = Math.max(4, Math.round(targetCard.intervalHours * 0.8));
      if (targetCard.acousticRiskLevel === 'low') {
        targetCard.acousticRiskLevel = 'medium';
      }
    } else if (targetCard.lapses === 0 && targetCard.repetition >= 3) {
      targetCard.acousticRiskLevel = 'low';
    }

    targetCard.stage = this.calculateStage(targetCard.stabilityDays, targetCard.repetition);
    targetCard.nextReviewAt = new Date(now.getTime() + targetCard.intervalHours * 3600 * 1000).toISOString();
    targetCard.retentionRate = 100;
    targetCard.updatedAt = now.toISOString();

    db.saveAccentSrsCard(targetCard);

    // Refresh summary
    const { summary } = this.getDueReviews(userId, 1);

    return {
      card: targetCard,
      summary
    };
  }
}
