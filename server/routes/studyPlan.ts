import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { JLPTLevel, LearningPace } from '../types.js';

export const studyPlanRouter = Router();

/**
 * 1. Get User's Active Study Plan & Dynamic Roadmap
 */
studyPlanRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'usr-student-01';
    const studyPlan = db.getStudyPlan(userId);
    const dailySession = db.getDailyStudySession(userId);
    const ghostStats = db.getGhostMasteryStats(userId);
    const userProgress = db.getProgressByUserId(userId);

    return res.json({
      success: true,
      studyPlan,
      dailySession,
      ghostStats,
      userProgress
    });
  } catch (error: any) {
    console.error('[Study Plan] Error fetching study plan:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch study plan' });
  }
});

/**
 * 2. Save / Customize Target Date, Level & Daily Study Quota
 */
studyPlanRouter.post('/save', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      targetLevel,
      targetExamDate,
      examSessionName,
      targetScore,
      dailyTimeMinutes,
      learningPace,
      focusAreas
    } = req.body;

    if (!targetLevel) {
      return res.status(400).json({ success: false, error: 'targetLevel is required' });
    }

    const updatedPlan = db.saveStudyPlan(userId, {
      targetLevel: targetLevel as JLPTLevel,
      targetExamDate: targetExamDate || '2026-12-06',
      examSessionName,
      targetScore: targetScore ? Number(targetScore) : undefined,
      dailyTimeMinutes: dailyTimeMinutes ? Number(dailyTimeMinutes) : undefined,
      learningPace: learningPace as LearningPace,
      focusAreas
    });

    const refreshedSession = db.getDailyStudySession(userId);

    return res.json({
      success: true,
      message: `🎉 JLPT ${targetLevel} অধ্যয়ন পরিকল্পনা ও দৈনিক কোটা সফলভাবে আপডেট হয়েছে!`,
      studyPlan: updatedPlan,
      dailySession: refreshedSession
    });
  } catch (error: any) {
    console.error('[Study Plan] Error saving study plan:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to save study plan' });
  }
});

/**
 * 3. Get Today's Daily Mission Session & Interactive Checklist
 */
studyPlanRouter.get('/daily-session', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'usr-student-01';
    const date = req.query.date as string | undefined;
    const session = db.getDailyStudySession(userId, date);
    return res.json({ success: true, session });
  } catch (error: any) {
    console.error('[Study Plan] Error fetching daily session:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch daily session' });
  }
});

/**
 * 4. Update / Complete a Daily Task in Checklist
 */
studyPlanRouter.post('/complete-task', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { taskId, completedIncrement } = req.body;

    if (!taskId) {
      return res.status(400).json({ success: false, error: 'taskId is required' });
    }

    const result = db.updateDailyTaskCompletion(
      userId,
      taskId,
      completedIncrement !== undefined ? Number(completedIncrement) : 1
    );

    return res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('[Study Plan] Error updating task completion:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to complete task' });
  }
});

/**
 * 5. Aggregated Daily SRS Review Queue (Vocab + Kanji + Ghost Particles)
 */
studyPlanRouter.get('/srs-queue', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const srsData = db.getSrsReviewQueue(userId);
    return res.json(srsData);
  } catch (error: any) {
    console.error('[Study Plan] Error fetching SRS review queue:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch SRS queue' });
  }
});

/**
 * 6. Quick Reset / Recalculate Roadmap (if fallen behind or want turbo pace)
 */
studyPlanRouter.post('/recalculate', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { pace } = req.body;
    const currentPlan = db.getStudyPlan(userId);
    
    const recalculated = db.saveStudyPlan(userId, {
      targetLevel: currentPlan.targetLevel,
      targetExamDate: currentPlan.targetExamDate,
      examSessionName: currentPlan.examSessionName,
      targetScore: currentPlan.targetScore,
      dailyTimeMinutes: pace === 'turbo' ? 60 : pace === 'intensive' ? 45 : 30,
      learningPace: pace || currentPlan.learningPace,
      focusAreas: currentPlan.focusAreas
    });

    return res.json({
      success: true,
      message: 'রোডম্যাপ ও দৈনিক স্প্রিন্ট কোটা সফলভাবে পুনঃগণনা করা হয়েছে।',
      studyPlan: recalculated
    });
  } catch (error: any) {
    console.error('[Study Plan] Error recalculating roadmap:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to recalculate roadmap' });
  }
});
