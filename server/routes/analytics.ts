import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { LearnerAnalyticsService } from '../services/learnerAnalyticsService.js';

export const analyticsRouter = Router();

/**
 * GET /api/analytics/overview
 * Returns complete materialized learner analytics summary for current authenticated user.
 */
analyticsRouter.get('/overview', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const forceRefresh = req.query.refresh === 'true';
    const summary = db.getLearnerAnalyticsSummary(userId, forceRefresh);

    return res.json({
      success: true,
      analytics: summary
    });
  } catch (error: any) {
    console.error('[Analytics] Error retrieving overview:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve analytics overview'
    });
  }
});

/**
 * GET /api/analytics/retention-trend
 * Returns daily SRS retention curve, accuracy, and stage breakdown.
 */
analyticsRouter.get('/retention-trend', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const summary = db.getLearnerAnalyticsSummary(userId);

    return res.json({
      success: true,
      srsMetrics: summary.srsMetrics,
      dailyRetentionTrend: summary.srsMetrics.dailyRetentionTrend
    });
  } catch (error: any) {
    console.error('[Analytics] Error retrieving retention trend:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve retention trend'
    });
  }
});

/**
 * GET /api/analytics/mock-exams
 * Returns JLPT mock exam completion rates, section breakdown, and readiness score.
 */
analyticsRouter.get('/mock-exams', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const summary = db.getLearnerAnalyticsSummary(userId);

    return res.json({
      success: true,
      mockExamMetrics: summary.mockExamMetrics
    });
  } catch (error: any) {
    console.error('[Analytics] Error retrieving mock exam metrics:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve mock exam metrics'
    });
  }
});

/**
 * GET /api/analytics/study-pulse
 * Returns study streaks, consistency score, and recent daily activity telemetry.
 */
analyticsRouter.get('/study-pulse', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const summary = db.getLearnerAnalyticsSummary(userId);

    return res.json({
      success: true,
      streakMetrics: summary.streakMetrics
    });
  } catch (error: any) {
    console.error('[Analytics] Error retrieving study pulse:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve study pulse'
    });
  }
});

/**
 * GET /api/analytics/leaderboard
 * Returns XP leaderboard for requested timeframe ('today' | 'week' | 'allTime')
 * along with the authenticated user's current rank position.
 */
analyticsRouter.get('/leaderboard', optionalAuth, (req: AuthenticatedRequest, res) => {
  try {
    const timeframeParam = req.query.timeframe as string;
    const timeframe = (['today', 'week', 'allTime'].includes(timeframeParam) ? timeframeParam : 'allTime') as 'today' | 'week' | 'allTime';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const currentUserId = req.user?.id;

    const result = db.getLeaderboard(timeframe, currentUserId, limit);

    return res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('[Analytics] Error retrieving leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve leaderboard'
    });
  }
});

/**
 * POST /api/analytics/refresh
 * Forces instant re-computation and PostgreSQL persistence of the materialized summary.
 */
analyticsRouter.post('/refresh', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const summary = LearnerAnalyticsService.computeLearnerAnalytics(userId);

    return res.json({
      success: true,
      refreshed: true,
      refreshedAt: summary.computedAt,
      analytics: summary
    });
  } catch (error: any) {
    console.error('[Analytics] Error refreshing materialized summary:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to refresh analytics'
    });
  }
});

/**
 * GET /api/analytics/cohort
 * Returns aggregate platform cohort statistics.
 */
analyticsRouter.get('/cohort', optionalAuth, (_req: AuthenticatedRequest, res) => {
  try {
    const cohort = db.getCohortAnalytics();
    return res.json({
      success: true,
      cohort
    });
  } catch (error: any) {
    console.error('[Analytics] Error retrieving cohort analytics:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve cohort analytics'
    });
  }
});
