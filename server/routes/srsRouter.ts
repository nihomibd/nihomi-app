import { Router } from 'express';
import { db } from '../db.js';
import { optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import {
  SrsReviewSubmission,
  SrsRatingGrade,
  SrsItemType,
  JLPTLevel,
  SrsCardStage,
  SrsAlgorithmMode
} from '../types.js';

export const srsRouter = Router();

// Helper to resolve user id with fallback for unauthenticated preview mode
function resolveUserId(req: AuthenticatedRequest): string {
  return req.user?.id || 'usr-student-01';
}

/**
 * 1. GET /api/srs/cards
 * Query all SRS cards for student with optional filtering
 */
srsRouter.get('/cards', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { itemType, level, stage, dueOnly, search, lessonId } = req.query;

    const cards = db.getSrsCards(userId, {
      itemType: itemType as SrsItemType,
      level: level as JLPTLevel,
      stage: stage as SrsCardStage,
      dueOnly: dueOnly === 'true',
      search: typeof search === 'string' ? search : undefined,
      lessonId: typeof lessonId === 'string' ? lessonId : undefined
    });

    return res.json({
      success: true,
      cards,
      total: cards.length
    });
  } catch (error: any) {
    console.error('[SRS API] Error fetching cards:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch SRS cards' });
  }
});

/**
 * 2. GET /api/srs/due
 * Fetch priority queue of due cards sorted by lowest retention (highest forgetting urgency)
 */
srsRouter.get('/due', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { itemType, level, limit } = req.query;

    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
    const dueCards = db.getDueSrsCards(userId, {
      itemType: itemType as SrsItemType,
      level: level as JLPTLevel,
      limit: parsedLimit && !isNaN(parsedLimit) ? parsedLimit : undefined
    });

    return res.json({
      success: true,
      dueCards,
      count: dueCards.length
    });
  } catch (error: any) {
    console.error('[SRS API] Error fetching due cards:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch due cards' });
  }
});

/**
 * 3. POST /api/srs/review
 * Process review submission with SM-2 / FSRS hybrid scheduling
 */
srsRouter.post('/review', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { cardId, rating, responseTimeMs, algorithmMode, targetRetention } = req.body;

    if (!cardId || typeof cardId !== 'string') {
      return res.status(400).json({ success: false, error: 'cardId is required' });
    }

    const validRatings: SrsRatingGrade[] = ['again', 'hard', 'good', 'easy'];
    if (!rating || !validRatings.includes(rating)) {
      return res.status(400).json({
        success: false,
        error: `Invalid rating. Must be one of: ${validRatings.join(', ')}`
      });
    }

    const submission: SrsReviewSubmission = {
      cardId,
      rating,
      responseTimeMs: typeof responseTimeMs === 'number' ? responseTimeMs : undefined,
      algorithmMode: algorithmMode as SrsAlgorithmMode,
      targetRetention: typeof targetRetention === 'number' ? targetRetention : undefined
    };

    const result = db.recordSrsReview(userId, submission);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.json(result);
  } catch (error: any) {
    console.error('[SRS API] Error processing review:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to record SRS review' });
  }
});

/**
 * 4. GET /api/srs/retention-curve
 * Calculates mathematical Ebbinghaus decay curve for telemetry visualization
 */
srsRouter.get('/retention-curve', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { cardId } = req.query;

    const report = db.getSrsRetentionCurve(userId, typeof cardId === 'string' ? cardId : undefined);

    return res.json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error('[SRS API] Error generating retention curve:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate retention curve' });
  }
});

/**
 * 5. GET /api/srs/telemetry
 * Comprehensive learner analytics: mastery breakdown, retention rate, review distribution
 */
srsRouter.get('/telemetry', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const stats = db.getSrsTelemetryStats(userId);

    return res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('[SRS API] Error fetching telemetry stats:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch telemetry stats' });
  }
});

/**
 * 6. POST /api/srs/sync-lesson/:lessonId
 * Interoperability Hook with P1-03 Live Lesson Publishing Queue:
 * Ingests vocabulary and kanji from newly published lessons into learner's SRS deck
 */
srsRouter.post('/sync-lesson/:lessonId', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { lessonId } = req.params;
    const { level } = req.body;

    const syncResult = db.syncLessonToSrsDeck(userId, lessonId, {
      level: level as JLPTLevel
    });

    if (!syncResult.success) {
      return res.status(404).json(syncResult);
    }

    return res.json({
      success: true,
      lessonId,
      ...syncResult,
      message: `Successfully synchronized ${syncResult.totalCardsAdded} items from lesson "${lessonId}" to SRS deck.`
    });
  } catch (error: any) {
    console.error('[SRS API] Error synchronizing lesson to SRS deck:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to sync lesson' });
  }
});

/**
 * 7. POST /api/srs/batch-sync-lessons
 * Synchronize multiple lessons (or an entire level) into the user's active SRS deck
 */
srsRouter.post('/batch-sync-lessons', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { lessonIds, level } = req.body;

    const rawData = db.getRawData();
    let lessonsToSync = rawData.lessons || [];

    if (Array.isArray(lessonIds) && lessonIds.length > 0) {
      lessonsToSync = lessonsToSync.filter((l) => lessonIds.includes(l.id));
    } else if (level) {
      lessonsToSync = lessonsToSync.filter((l) => l.level === level);
    }

    let totalAddedVocab = 0;
    let totalAddedKanji = 0;

    for (const l of lessonsToSync) {
      const res = db.syncLessonToSrsDeck(userId, l.id, { level: l.level });
      if (res.success) {
        totalAddedVocab += res.addedVocabCount;
        totalAddedKanji += res.addedKanjiCount;
      }
    }

    const allCards = db.getSrsCards(userId);

    return res.json({
      success: true,
      syncedLessonsCount: lessonsToSync.length,
      totalAddedVocab,
      totalAddedKanji,
      totalCardsAdded: totalAddedVocab + totalAddedKanji,
      totalDeckCount: allCards.length
    });
  } catch (error: any) {
    console.error('[SRS API] Error batch syncing lessons:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to batch sync' });
  }
});

/**
 * 8. POST /api/srs/seed-defaults
 * Seeds starter deck for user
 */
srsRouter.post('/seed-defaults', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const cards = db.seedInitialSrsCardsForUser(userId);

    return res.json({
      success: true,
      cards,
      count: cards.length,
      message: `Seeded ${cards.length} foundational SRS cards.`
    });
  } catch (error: any) {
    console.error('[SRS API] Error seeding defaults:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to seed deck' });
  }
});

/**
 * 9. POST /api/srs/card/:cardId/reset
 * Resets a single card's repetition history back to Apprentice stage
 */
srsRouter.post('/card/:cardId/reset', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = resolveUserId(req);
    const { cardId } = req.params;

    const card = db.getSrsCardById(userId, cardId);
    if (!card) {
      return res.status(404).json({ success: false, error: `Card with ID "${cardId}" not found.` });
    }

    card.repetition = 0;
    card.intervalDays = 1;
    card.stabilityDays = 1.0;
    card.difficulty = 5.0;
    card.retrievability = 1.0;
    card.retentionScore = 100;
    card.stage = 'apprentice';
    card.consecutiveCorrect = 0;
    card.nextReviewAt = new Date().toISOString();
    card.updatedAt = new Date().toISOString();

    db.saveSrsCard(card);

    return res.json({
      success: true,
      card,
      message: `Card "${card.front}" reset to Apprentice stage.`
    });
  } catch (error: any) {
    console.error('[SRS API] Error resetting card:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to reset card' });
  }
});
