import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';
import { JLPTLevel, ParticleConfusionType } from '../types.js';

export const ghostModeRouter = Router();

/**
 * 1. Get Active Ghost Weaknesses for Student (with SRS review filter)
 */
ghostModeRouter.get('/active-ghosts', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { level, confusionType, resolved, dueOnly } = req.query;

    const filter: {
      level?: JLPTLevel;
      confusionType?: ParticleConfusionType;
      resolved?: boolean;
      dueOnly?: boolean;
    } = {};

    if (level) filter.level = level as JLPTLevel;
    if (confusionType) filter.confusionType = confusionType as ParticleConfusionType;
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    if (dueOnly !== undefined) filter.dueOnly = dueOnly === 'true';

    const activeGhosts = db.getGhostWeaknesses(userId, filter);
    const stats = db.getGhostMasteryStats(userId);

    return res.json({
      success: true,
      activeGhosts,
      stats,
      count: activeGhosts.length
    });
  } catch (error: any) {
    console.error('[Ghost Mode] Error fetching active ghosts:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch ghost weaknesses' });
  }
});

/**
 * 2. Get Student Ghost Mastery Stats & Particle Confusion Breakdown
 */
ghostModeRouter.get('/stats', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const stats = db.getGhostMasteryStats(userId);
    return res.json({ success: true, stats });
  } catch (error: any) {
    console.error('[Ghost Mode] Error fetching stats:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch stats' });
  }
});

/**
 * 3. Resolve / Attempt a Ghost Challenge (SM-2 SRS persistence)
 */
ghostModeRouter.post('/resolve-ghost', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { ghostId, selectedAnswerIndex, isCorrect: directIsCorrect } = req.body;

    if (!ghostId) {
      return res.status(400).json({ success: false, error: 'ghostId is required' });
    }

    const ghost = db.getGhostWeaknessById(ghostId);
    if (!ghost) {
      return res.status(404).json({ success: false, error: 'Ghost weakness item not found' });
    }

    // Determine correctness either by index or direct boolean
    let isCorrect = directIsCorrect;
    if (isCorrect === undefined && selectedAnswerIndex !== undefined) {
      const selectedOption = ghost.options[Number(selectedAnswerIndex)];
      isCorrect = selectedOption ? selectedOption.isCorrect : false;
    }

    if (isCorrect === undefined) {
      isCorrect = false;
    }

    const result = db.recordGhostAttempt(userId, ghostId, Boolean(isCorrect));

    return res.json({
      success: true,
      ghostId,
      isCorrect: Boolean(isCorrect),
      ghost: result.ghost,
      progress: result.progress,
      status: result.ghost.isResolved ? 'resolved' : 'reviewed',
      message: result.message
    });
  } catch (error: any) {
    console.error('[Ghost Mode] Error resolving ghost:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to record ghost attempt' });
  }
});

/**
 * 4. Explicitly Log a Student Error into MemoryOS™
 */
ghostModeRouter.post('/log-error', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { questionId, quizId, lessonId, conceptCode, userSelected, correctAnswer, category, details } = req.body;

    if (!conceptCode || !userSelected || !correctAnswer) {
      return res.status(400).json({
        success: false,
        error: 'conceptCode, userSelected, and correctAnswer are required.'
      });
    }

    const log = db.logStudentError({
      userId,
      questionId,
      quizId,
      lessonId,
      conceptCode,
      userSelected,
      correctAnswer,
      category: category || 'particle',
      details: details || 'Recorded client-side student error'
    });

    return res.json({ success: true, log });
  } catch (error: any) {
    console.error('[Ghost Mode] Error logging student error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to log student error' });
  }
});

/**
 * 5. Create a new custom Ghost item (for Teachers / Sensei / AI generation)
 */
ghostModeRouter.post('/create-ghost', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      topic,
      conceptCode,
      confusionType,
      level,
      targetJapanese,
      romaji,
      bangla,
      scenarioPrompt,
      options,
      lastFailedContext,
      newContextChallenge
    } = req.body;

    if (!topic || !targetJapanese || !scenarioPrompt || !options || !Array.isArray(options)) {
      return res.status(400).json({
        success: false,
        error: 'topic, targetJapanese, scenarioPrompt, and options array are required.'
      });
    }

    const now = new Date().toISOString();
    const created = db.createGhostWeakness({
      userId,
      topic,
      conceptCode: conceptCode || 'custom-grammar-weakness',
      confusionType: confusionType || 'general_grammar',
      level: level || 'N5',
      targetJapanese,
      romaji: romaji || '',
      bangla: bangla || '',
      failureCount: 1,
      successStreak: 0,
      masteryPercentage: 20,
      firstSeenAt: now,
      lastFailedAt: now,
      nextReviewAt: now,
      srsStage: 'apprentice',
      intervalDays: 1,
      easeFactor: 2.5,
      lastFailedContext: lastFailedContext || 'Interactive Lesson Practice',
      newContextChallenge: newContextChallenge || 'Real-World Workplace Scenario',
      scenarioPrompt,
      options,
      isResolved: false
    });

    return res.status(201).json({ success: true, ghost: created });
  } catch (error: any) {
    console.error('[Ghost Mode] Error creating ghost weakness:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create ghost weakness' });
  }
});
