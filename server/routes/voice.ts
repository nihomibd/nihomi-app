import crypto from 'crypto';
import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { aiCostGuard, recordAiCostUsage } from '../middleware/aiCostGuard.js';
import {
  TokyoPitchAccentService,
  TOKYO_PITCH_PRESETS
} from '../services/pitchAccentService.js';
import {
  DrillSeedGeneratorService
} from '../services/drillSeedGeneratorService.js';
import { AdaptiveDrillService } from '../services/adaptiveDrillService.js';
import {
  PitchAccentPattern,
  DynamicDrillGenerationInput,
  TokyoPitchDrill,
  AccentMasterySession,
  AccentMasteryStep
} from '../types.js';

export const voiceRouter = Router();

// Shared pitch evaluation handler supporting both /evaluate-pitch and /evaluate-pitch-accent
async function handlePitchAccentEvaluation(req: AuthenticatedRequest, res: any) {
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
      intensityPoints,
      audioDurationMs
    } = req.body;

    if (!targetPhrase || typeof targetPhrase !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'targetPhrase string is required for pitch evaluation.'
      });
    }

    // Perform Tokyo pitch accent evaluation with Bengali acoustic rule engine
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
      intensityPoints: Array.isArray(intensityPoints) ? intensityPoints : undefined,
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
      bengaliAcousticAnalysis: assessment.bengaliAcousticAnalysis,
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

/**
 * POST /api/voice/evaluate-pitch
 * Evaluates learner speech against Tokyo pitch-accent models (Odaka, Atamadaka, Nakadaka, Heiban).
 */
voiceRouter.post(
  '/evaluate-pitch',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 800 }),
  handlePitchAccentEvaluation
);

/**
 * POST /api/voice/evaluate-pitch-accent
 * Dedicated endpoint for acoustic evaluation with Bengali-specific phonetic error feedback.
 */
voiceRouter.post(
  '/evaluate-pitch-accent',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 800 }),
  handlePitchAccentEvaluation
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
 * GET /api/voice/drills
 * Query seeded and dynamically generated pitch drills from database.
 */
voiceRouter.get('/drills', optionalAuth, (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const jlptLevel = req.query.jlptLevel as string | undefined;
    const contrastGroup = req.query.contrastGroup as string | undefined;
    const pattern = req.query.pattern as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    let drills = db.getPitchDrills({ category, jlptLevel, contrastGroup, pattern, search, limit });

    // Auto-seed if database is currently empty
    if (drills.length === 0 && !search && !category && !jlptLevel) {
      DrillSeedGeneratorService.seedDefaultDrills();
      drills = db.getPitchDrills({ limit });
    }

    return res.json({
      success: true,
      totalCount: drills.length,
      drills
    });
  } catch (error: any) {
    console.error('[Voice Router] Error fetching pitch drills:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch pitch drills.'
    });
  }
});

/**
 * POST /api/voice/drills/generate
 * Dynamic Drill Generator: Accepts raw vocabulary (or JLPT lists) and outputs full accent metadata.
 */
voiceRouter.post('/drills/generate', optionalAuth, (req, res) => {
  try {
    const { vocabulary, persist = false } = req.body;

    if (!vocabulary || !Array.isArray(vocabulary) || vocabulary.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'vocabulary array of words is required for dynamic drill generation.'
      });
    }

    const inputs: DynamicDrillGenerationInput[] = vocabulary.map((item: any) => {
      if (typeof item === 'string') {
        return { word: item };
      }
      return {
        word: item.word || item.kanji || item.readingKana,
        readingKana: item.readingKana,
        meaningEn: item.meaningEn,
        meaningBn: item.meaningBn,
        category: item.category,
        jlptLevel: item.jlptLevel,
        overridePattern: item.overridePattern,
        overrideDownstepMora: item.overrideDownstepMora,
        contrastGroup: item.contrastGroup,
        contextNote: item.contextNote
      };
    });

    const result = DrillSeedGeneratorService.generateDrills(inputs);

    if (persist) {
      db.bulkUpsertPitchDrills(result.drills);
    }

    return res.json({
      success: true,
      totalProcessed: result.totalProcessed,
      drills: result.drills,
      persisted: !!persist
    });
  } catch (error: any) {
    console.error('[Voice Router] Error generating dynamic pitch drills:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate dynamic pitch drills.'
    });
  }
});

/**
 * POST /api/voice/drills/seed
 * Bulk-populate or refresh database accent drills from the canonical dictionary.
 */
voiceRouter.post('/drills/seed', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    if (user.role !== 'admin' && user.role !== 'instructor') {
      // Allow student users for preview/development convenience, but log notice
      console.log(`[Voice Router] Non-admin user ${user.id} requested drill seeding.`);
    }

    const result = DrillSeedGeneratorService.seedDefaultDrills();

    return res.json({
      success: true,
      message: 'Tokyo pitch-accent drill database successfully seeded.',
      stats: result
    });
  } catch (error: any) {
    console.error('[Voice Router] Error seeding pitch drills:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to seed pitch drills.'
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

/**
 * GET /api/voice/drills/adaptive
 * Dynamic Weakness-Adaptive Drill Engine:
 * Analyzes student's recent Bengali acoustic telemetry errors and dynamically synthesizes
 * 3 targeted remediation drill pairs tailored to their exact acoustic failure mode.
 */
voiceRouter.get(
  '/drills/adaptive',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 300 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const recommendation = await AdaptiveDrillService.getAdaptiveRecommendations(userId);
      return res.json({
        success: true,
        recommendation
      });
    } catch (error: any) {
      console.error('[Voice Router] Error fetching adaptive drills:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate adaptive drills.'
      });
    }
  }
);

/**
 * POST /api/voice/session/start
 * Initializes a multi-turn Accent Mastery Session.
 */
voiceRouter.post(
  '/session/start',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 200 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const { title, drillIds, category, jlptLevel, adaptive } = req.body;

      let targetDrills: TokyoPitchDrill[] = [];

      if (adaptive) {
        const adaptiveRec = await AdaptiveDrillService.getAdaptiveRecommendations(userId);
        // Flatten the recommended pairs into a sequence of drills
        targetDrills = adaptiveRec.recommendedPairs.flatMap((p) => p.drills);
      } else if (Array.isArray(drillIds) && drillIds.length > 0) {
        for (const dId of drillIds) {
          const d = db.getPitchDrillById(dId);
          if (d) targetDrills.push(d);
        }
      }

      // If still empty, pull from category or jlptLevel or default
      if (targetDrills.length === 0) {
        targetDrills = db.getPitchDrills({
          category,
          jlptLevel,
          limit: 6
        });
      }

      // Fallback if still empty: seed default drills
      if (targetDrills.length === 0) {
        DrillSeedGeneratorService.seedDefaultDrills();
        targetDrills = db.getPitchDrills({ limit: 6 });
      }

      // Limit session steps to at most 6 drills for optimal focus
      targetDrills = targetDrills.slice(0, 6);

      const sessionId = `session-accent-${crypto.randomUUID().slice(0, 8)}`;
      const now = new Date().toISOString();

      const steps: AccentMasteryStep[] = targetDrills.map((drill, idx) => ({
        stepIndex: idx,
        drillId: drill.id,
        kanji: drill.kanji,
        readingKana: drill.readingKana,
        pattern: drill.pattern,
        targetPitches: drill.targetPitches
      }));

      const session: AccentMasterySession = {
        id: sessionId,
        userId,
        title: title || `Tokyo Accent Mastery (${targetDrills[0]?.patternNameJa || 'Adaptive'})`,
        status: 'in_progress',
        currentStepIndex: 0,
        totalSteps: steps.length,
        targetDrillIds: targetDrills.map((d) => d.id),
        steps,
        masteryIndex: 0,
        bengaliAcousticFlagsDetected: [],
        startedAt: now,
        lastActivityAt: now
      };

      db.createAccentMasterySession(session);

      return res.json({
        success: true,
        session,
        currentStep: steps[0],
        currentDrill: targetDrills[0]
      });
    } catch (error: any) {
      console.error('[Voice Router] Error starting accent session:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to start accent mastery session.'
      });
    }
  }
);

/**
 * POST /api/voice/session/submit-step
 * Submits audio/F0 attempt for current step in multi-turn Accent Mastery Session.
 */
voiceRouter.post(
  '/session/submit-step',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 600 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const {
        sessionId,
        stepIndex,
        pitchF0Points,
        intensityPoints,
        audioDurationMs,
        audioBase64,
        audioMimeType,
        spokenTranscript
      } = req.body;

      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'sessionId is required.' });
      }

      const session = db.getAccentMasterySession(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Accent mastery session not found.' });
      }

      if (session.userId !== userId) {
        return res.status(403).json({ success: false, error: 'Unauthorized access to session.' });
      }

      if (session.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          error: `Session is already ${session.status}. Please start a new session.`
        });
      }

      const stepIdx = typeof stepIndex === 'number' ? stepIndex : session.currentStepIndex;
      const currentStep = session.steps[stepIdx];
      if (!currentStep) {
        return res.status(400).json({ success: false, error: 'Invalid step index.' });
      }

      const targetDrill = db.getPitchDrillById(currentStep.drillId);
      if (!targetDrill) {
        return res.status(404).json({ success: false, error: 'Target drill not found in database.' });
      }

      // Evaluate user pitch accent attempt with Bengali acoustic analysis
      const assessment = await TokyoPitchAccentService.evaluatePitchAccent({
        userId,
        targetPhrase: targetDrill.kanji,
        targetRomaji: targetDrill.romaji,
        targetMeaning: targetDrill.meaningEn,
        targetPattern: targetDrill.pattern,
        targetDownstepMora: targetDrill.downstepMora,
        audioBase64: typeof audioBase64 === 'string' ? audioBase64 : undefined,
        audioMimeType: typeof audioMimeType === 'string' ? audioMimeType : undefined,
        spokenTranscript: typeof spokenTranscript === 'string' ? spokenTranscript.trim() : undefined,
        pitchF0Points: Array.isArray(pitchF0Points) ? pitchF0Points : undefined,
        intensityPoints: Array.isArray(intensityPoints) ? intensityPoints : undefined,
        audioDurationMs: typeof audioDurationMs === 'number' ? audioDurationMs : undefined
      });

      // Persist individual voice assessment
      db.createVoiceAssessment(assessment);

      // Extract immediate actionable Bengali coaching tip
      const bengaliCoachingTip =
        assessment.bengaliAcousticAnalysis?.overallBengaliCoachingBn ||
        assessment.feedbackBn ||
        'টোকিও অ্যাকসেন্টের উচ্চ-নিচুর সুর ঠিক রেখে সমান ভলিউমে অনুশীলন করুন।';

      // Record any detected Bengali phonetic errors into session
      if (assessment.bengaliAcousticAnalysis?.detectedErrors) {
        for (const err of assessment.bengaliAcousticAnalysis.detectedErrors) {
          if (!session.bengaliAcousticFlagsDetected.includes(err.errorCode)) {
            session.bengaliAcousticFlagsDetected.push(err.errorCode);
          }
        }
      }

      // Update current step
      currentStep.userPitchAssessment = assessment;
      currentStep.stepScore = assessment.overallScore;
      currentStep.passed = assessment.passed;
      currentStep.bengaliCoachingTip = bengaliCoachingTip;
      currentStep.completedAt = new Date().toISOString();

      // Advance step index
      session.currentStepIndex = stepIdx + 1;
      session.lastActivityAt = new Date().toISOString();

      const isCompleted = session.currentStepIndex >= session.totalSteps;
      let nextStep: AccentMasteryStep | null = null;
      let nextDrill: TokyoPitchDrill | null = null;

      if (isCompleted) {
        session.status = 'completed';
        session.completedAt = new Date().toISOString();

        // Calculate aggregate pronunciation mastery index
        const totalScore = session.steps.reduce((sum, s) => sum + (s.stepScore || 0), 0);
        session.masteryIndex = Math.round(totalScore / session.totalSteps);

        // Award bonus study XP based on mastery index
        const xpEarned = session.masteryIndex >= 85 ? 100 : session.masteryIndex >= 70 ? 60 : 35;
        db.addStudyTime(userId, 5, xpEarned);

        // Formulate final bilingual summary
        if (session.masteryIndex >= 80) {
          session.summaryBn = `অভিনন্দন! আপনি ${session.masteryIndex}% নিখুঁত স্কোরে টোকিও পিচ অ্যাকসেন্ট সেশন সম্পন্ন করেছেন। আপনার উচ্চারণে টোকিও স্থানীয় বক্তার মতো স্বাভাবিক ওঠানামা রয়েছে।`;
          session.summaryEn = `Outstanding! Completed session with ${session.masteryIndex}% Tokyo pitch mastery. Native-level melody maintained.`;
        } else {
          session.summaryBn = `সেশন সম্পন্ন হয়েছে (স্কোর: ${session.masteryIndex}%)। শনাক্তকৃত দুর্বলতা: ${session.bengaliAcousticFlagsDetected.join(', ') || 'টোকিও ডাউনস্টেপ'}। পরবর্তী সেশনে সুরের ওঠানামা আরও সতর্কভাবে অনুসরণ করুন।`;
          session.summaryEn = `Session completed with ${session.masteryIndex}% mastery. Focus on detected acoustic flags in upcoming adaptive drills.`;
        }
      } else {
        nextStep = session.steps[session.currentStepIndex];
        nextDrill = db.getPitchDrillById(nextStep.drillId);
      }

      db.updateAccentMasterySession(session);
      recordAiCostUsage(userId, 500, 'pronunciation');

      // Materialize learner analytics
      const updatedSummary = db.getLearnerAnalyticsSummary(userId, true);

      return res.json({
        success: true,
        session,
        stepAssessment: assessment,
        bengaliCoachingTip,
        isCompleted,
        currentStepIndex: session.currentStepIndex,
        nextStep,
        nextDrill,
        masteryIndex: session.masteryIndex,
        voiceTelemetry: updatedSummary.voiceTelemetry
      });
    } catch (error: any) {
      console.error('[Voice Router] Error submitting session step:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to evaluate session step.'
      });
    }
  }
);

/**
 * GET /api/voice/session/:id
 * Retrieve session state.
 */
voiceRouter.get('/session/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const session = db.getAccentMasterySession(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found.' });
    }

    if (session.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized.' });
    }

    const currentStep = session.steps[session.currentStepIndex] || null;
    const currentDrill = currentStep ? db.getPitchDrillById(currentStep.drillId) : null;

    return res.json({
      success: true,
      session,
      currentStep,
      currentDrill
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/voice/sessions
 * Returns user's recent Accent Mastery Sessions.
 */
voiceRouter.get('/sessions', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const sessions = db.getUserAccentMasterySessions(userId, limit);

    return res.json({
      success: true,
      total: sessions.length,
      sessions
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

