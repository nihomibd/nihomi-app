import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { aiCostGuard, recordAiCostUsage } from '../middleware/aiCostGuard.js';
import {
  TokyoPitchAccentService,
  TOKYO_PITCH_PRESETS
} from '../services/pitchAccentService.js';
import { PitchAccentPattern } from '../types.js';

export const voiceRouter = Router();

/**
 * POST /api/voice/evaluate-pitch
 * Evaluates learner speech against Tokyo pitch-accent models (Odaka, Atamadaka, Nakadaka, Heiban).
 * Captures audio scoring metrics directly into the learner's analytics profile.
 */
voiceRouter.post(
  '/evaluate-pitch',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 800 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const {
        targetPhrase,
        targetRomaji,
        targetMeaning,
        targetPattern,
        targetDownstepMora,
        audioBase64,
        audioMimeType,
        spokenTranscript,
        pitchF0Points,
        audioDurationMs
      } = req.body;

      if (!targetPhrase || typeof targetPhrase !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'targetPhrase string is required for pitch evaluation.'
        });
      }

      // Perform Tokyo pitch accent evaluation
      const assessment = await TokyoPitchAccentService.evaluatePitchAccent({
        userId,
        targetPhrase: targetPhrase.trim(),
        targetRomaji: typeof targetRomaji === 'string' ? targetRomaji.trim() : undefined,
        targetMeaning: typeof targetMeaning === 'string' ? targetMeaning.trim() : undefined,
        targetPattern: targetPattern as PitchAccentPattern,
        targetDownstepMora: typeof targetDownstepMora === 'number' ? targetDownstepMora : undefined,
        audioBase64: typeof audioBase64 === 'string' ? audioBase64 : undefined,
        audioMimeType: typeof audioMimeType === 'string' ? audioMimeType : undefined,
        spokenTranscript: typeof spokenTranscript === 'string' ? spokenTranscript.trim() : undefined,
        pitchF0Points: Array.isArray(pitchF0Points) ? pitchF0Points : undefined,
        audioDurationMs: typeof audioDurationMs === 'number' ? audioDurationMs : undefined
      });

      // Persist assessment to database
      db.createVoiceAssessment(assessment);

      // Calculate XP bonus (+25 XP standard practice, +25 XP bonus for pitch match & high accuracy)
      let xpAwarded = 25;
      if (assessment.patternMatch && assessment.pitchAccuracyScore >= 85) {
        xpAwarded += 25;
      }
      db.addStudyTime(userId, 2, xpAwarded);

      // Force-refresh learner materialized analytics summary with latest voice telemetry
      const updatedSummary = db.getLearnerAnalyticsSummary(userId, true);

      // Record AI quota usage
      recordAiCostUsage(userId, 600, 'pronunciation');

      return res.json({
        success: true,
        assessment,
        xpAwarded,
        voiceTelemetry: updatedSummary.voiceTelemetry,
        tokyoAccentReadinessRate: updatedSummary.voiceTelemetry.tokyoAccentReadinessRate
      });
    } catch (error: any) {
      console.error('[Voice Router] Error evaluating pitch accent:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to evaluate Tokyo pitch accent.'
      });
    }
  }
);

/**
 * GET /api/voice/presets
 * Returns curated Tokyo pitch-accent models (Minimal Pairs, N5 Essentials, N4 Conversations, Keigo).
 */
voiceRouter.get('/presets', optionalAuth, (_req, res) => {
  try {
    return res.json({
      success: true,
      totalPresets: TOKYO_PITCH_PRESETS.length,
      presets: TOKYO_PITCH_PRESETS
    });
  } catch (error: any) {
    console.error('[Voice Router] Error fetching presets:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch pitch presets.'
    });
  }
});

/**
 * GET /api/voice/history
 * Returns user's recent voice & pitch evaluations.
 */
voiceRouter.get('/history', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;
    const assessments = db.getVoiceAssessments(userId, limit);

    return res.json({
      success: true,
      totalCount: assessments.length,
      history: assessments
    });
  } catch (error: any) {
    console.error('[Voice Router] Error fetching voice history:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch voice history.'
    });
  }
});

/**
 * GET /api/voice/telemetry
 * Returns aggregated voice pronunciation telemetry for current user.
 */
voiceRouter.get('/telemetry', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const summary = db.getLearnerAnalyticsSummary(userId);

    return res.json({
      success: true,
      voiceTelemetry: summary.voiceTelemetry
    });
  } catch (error: any) {
    console.error('[Voice Router] Error fetching voice telemetry:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch voice telemetry.'
    });
  }
});
