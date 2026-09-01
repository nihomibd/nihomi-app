import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest, optionalAuth } from '../authHelper.js';
import {
  processAICoachRequest,
  processVisionSenseiRequest,
  processSentenceDnaRequest,
  processExampleSentenceRequest,
  processExplainMistakeRequest,
  processPronunciationAssessmentRequest,
  processStudyScheduleRequest
} from '../gemini.js';
import { aiCostGuard, recordAiCostUsage } from '../middleware/aiCostGuard.js';
import crypto from 'crypto';

export const aiRouter = Router();

// 1. Text & Voice AI Coach — Secured with AI Cost Guard
aiRouter.post(
  '/coach',
  requireAuth,
  aiCostGuard({ operationType: 'coach', estimatedTokens: 1000 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { message, mode, scenario, sessionId, history, audioBase64, audioMimeType } = req.body;
      const userId = req.user!.id;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'message is required' });
      }

      const validModes = ['conversation', 'grammar_explanation', 'vocabulary_explanation', 'correction', 'translation', 'voice_chat'];
      const selectedMode = validModes.includes(mode) ? mode : 'conversation';

      const profile = db.getProfileByUserId(userId);
      const progress = db.getProgressByUserId(userId);
      const userLevel = profile?.targetLevel || progress?.currentLevel || 'N5';

      const aiResult = await processAICoachRequest({
        mode: selectedMode as any,
        message,
        userLevel,
        scenario,
        history,
        audioBase64,
        audioMimeType
      });

      // Atomic Token & Query Deduction via Cost Guard
      const updatedUsage = recordAiCostUsage(userId, 850);

      const userMessage = {
        id: `msg-${crypto.randomUUID().slice(0, 8)}`,
        role: 'user' as const,
        content: message,
        mode: selectedMode,
        timestamp: new Date().toISOString()
      };

      const assistantMessage = {
        id: `msg-${crypto.randomUUID().slice(0, 8)}`,
        role: 'assistant' as const,
        content: aiResult.reply,
        mode: selectedMode,
        correctionData: aiResult.correctionData,
        timestamp: new Date().toISOString()
      };

      const session = db.createOrUpdateAISession(
        userId,
        sessionId,
        userMessage,
        assistantMessage,
        selectedMode
      );

      const guardMeta = (req as any).aiCostGuard;

      return res.json({
        reply: aiResult.reply,
        romaji: aiResult.romaji,
        bengaliTranslation: aiResult.bengaliTranslation,
        correctionData: aiResult.correctionData,
        sessionId: session.id,
        messages: session.messages,
        usage: {
          aiCoachInteractions: updatedUsage.aiCoachInteractions,
          aiMonthlyLimit: guardMeta?.monthlyQuota || 100,
          remainingQuota: Math.max(0, (guardMeta?.monthlyQuota || 100) - updatedUsage.aiCoachInteractions)
        }
      });
    } catch (error: any) {
      console.error('AI Coach error:', error);
      return res.status(500).json({ error: 'AI Coach failed to respond. Please try again.' });
    }
  }
);

// 2. Vision Sensei: Camera Snapshot & Photo OCR — Secured with AI Cost Guard
aiRouter.post(
  '/vision-sensei',
  requireAuth,
  aiCostGuard({ operationType: 'vision', estimatedTokens: 1500 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { imageBase64, mimeType, userPrompt } = req.body;
      const userId = req.user!.id;

      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required. Capture or upload a photo.' });
      }

      const cleanMimeType = mimeType || 'image/jpeg';
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const profile = db.getProfileByUserId(userId);
      const progress = db.getProgressByUserId(userId);
      const userLevel = profile?.targetLevel || progress?.currentLevel || 'N5';

      const analysis = await processVisionSenseiRequest({
        imageBase64: cleanBase64,
        mimeType: cleanMimeType,
        userPrompt,
        userLevel
      });

      recordAiCostUsage(userId, 1200);

      return res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Vision Sensei error:', error);
      return res.status(500).json({ error: 'Vision Sensei failed to analyze image. Please try another photo.' });
    }
  }
);

// 3. Sentence DNA Endpoint — Secured with AI Cost Guard
aiRouter.post(
  '/sentence-dna',
  requireAuth,
  aiCostGuard({ operationType: 'dna', estimatedTokens: 600 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { sentence } = req.body;
      if (!sentence || typeof sentence !== 'string') {
        return res.status(400).json({ error: 'Japanese sentence string is required.' });
      }

      const userId = req.user!.id;
      const profile = db.getProfileByUserId(userId);
      const dna = await processSentenceDnaRequest(sentence.trim(), profile?.targetLevel || 'N5');

      recordAiCostUsage(userId, 500);

      return res.json({ success: true, sentenceDna: dna });
    } catch (err: any) {
      console.error('Sentence DNA error:', err);
      return res.status(500).json({ error: 'Failed to analyze Sentence DNA.' });
    }
  }
);

// 4. AI Credit Packs Catalog
aiRouter.get('/credits/packs', (_req, res) => {
  const packs = [
    {
      id: 'pack-ai-500',
      credits: 500,
      title: 'Starter AI Add-On',
      priceBDT: 150,
      description: 'Ideal for sign translations, Furigana checks & voice chats.'
    },
    {
      id: 'pack-ai-1500',
      credits: 1500,
      title: 'Power Learner Pack',
      priceBDT: 350,
      badge: 'Most Popular',
      description: 'Extensive voice notes practice, JLPT question breakdowns & camera scans.'
    },
    {
      id: 'pack-ai-5000',
      credits: 5000,
      title: 'Career & Interview Booster',
      priceBDT: 850,
      badge: 'Best Value',
      description: 'High-volume Japanese job interview prep and live voice conversation.'
    }
  ];
  return res.json({ success: true, packs });
});

// 5. Get User's Past AI Sessions
aiRouter.get('/sessions', requireAuth, (req: AuthenticatedRequest, res) => {
  const sessions = db.getAISessions(req.user!.id);
  return res.json(sessions);
});

// 6. Infinite AI Content Engine Micro-Drills — Secured with AI Cost Guard
aiRouter.post(
  '/endless-drills',
  requireAuth,
  aiCostGuard({ operationType: 'drill', estimatedTokens: 1200 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { targetLevel } = req.body;
      const userId = req.user!.id;
      const { InfiniteAiContentEngine } = await import('../services/infiniteAi.js');
      const drills = await InfiniteAiContentEngine.generateEndlessDrills(userId, targetLevel || 'N5');

      recordAiCostUsage(userId, 900);

      return res.json({ success: true, drills });
    } catch (err: any) {
      console.error('Endless drills error:', err);
      return res.status(500).json({ error: 'Failed to generate endless drills' });
    }
  }
);

// 7. Contextual JLPT Example Sentence Generator
aiRouter.post('/example-sentence', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { word, reading, jlptLevel } = req.body;
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'Word string is required.' });
    }

    const result = await processExampleSentenceRequest(
      word.trim(),
      typeof reading === 'string' ? reading.trim() : undefined,
      typeof jlptLevel === 'string' ? jlptLevel.trim() : 'N5'
    );

    if (req.user?.id) {
      recordAiCostUsage(req.user.id, 250);
    }

    return res.json({ success: true, example: result });
  } catch (err: any) {
    console.error('Example sentence generator error:', err);
    return res.status(500).json({ error: 'Failed to generate example sentence.' });
  }
});

// 8. AI-Powered Quiz Mistake & Grammar Rule Explainer
aiRouter.post('/explain-mistake', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { question, questionJa, selectedOption, correctOption, allOptions, userLevel, conceptCode } = req.body;
    if (!question || !selectedOption || !correctOption) {
      return res.status(400).json({ error: 'question, selectedOption, and correctOption are required.' });
    }

    const explanation = await processExplainMistakeRequest({
      question: String(question),
      questionJa: questionJa ? String(questionJa) : undefined,
      selectedOption: String(selectedOption),
      correctOption: String(correctOption),
      allOptions: Array.isArray(allOptions) ? allOptions.map(String) : undefined,
      userLevel: userLevel ? String(userLevel) : 'N5',
      conceptCode: conceptCode ? String(conceptCode) : undefined
    });

    if (req.user?.id) {
      recordAiCostUsage(req.user.id, 400);
    }

    return res.json({ success: true, explanation });
  } catch (err: any) {
    console.error('Explain mistake error:', err);
    return res.status(500).json({ error: 'Failed to explain mistake.' });
  }
});

// 9. AI-Powered Pronunciation Clarity & Pitch Assessment
aiRouter.post(
  '/pronunciation-assessment',
  requireAuth,
  aiCostGuard({ operationType: 'pronunciation', estimatedTokens: 800 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { targetPhrase, targetRomaji, spokenTranscript, audioBase64, audioMimeType, userLevel } = req.body;
      if (!targetPhrase || typeof targetPhrase !== 'string') {
        return res.status(400).json({ error: 'targetPhrase is required.' });
      }

      const userId = req.user!.id;
      const assessment = await processPronunciationAssessmentRequest({
        targetPhrase: targetPhrase.trim(),
        targetRomaji: typeof targetRomaji === 'string' ? targetRomaji.trim() : undefined,
        spokenTranscript: typeof spokenTranscript === 'string' ? spokenTranscript.trim() : undefined,
        audioBase64: typeof audioBase64 === 'string' ? audioBase64 : undefined,
        audioMimeType: typeof audioMimeType === 'string' ? audioMimeType : undefined,
        userLevel: typeof userLevel === 'string' ? userLevel : 'N5'
      });

      recordAiCostUsage(userId, 600);

      return res.json({ success: true, assessment });
    } catch (err: any) {
      console.error('Pronunciation assessment error:', err);
      return res.status(500).json({ error: 'Failed to evaluate pronunciation.' });
    }
  }
);

// 10. AI-Generated Personalized 4-Week Study Schedule
aiRouter.post(
  '/study-schedule',
  requireAuth,
  aiCostGuard({ operationType: 'explainer', estimatedTokens: 1500 }),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { userLevel, quizHistory, weakCategories } = req.body;
      const userId = req.user!.id;

      const schedule = await processStudyScheduleRequest({
        userLevel: typeof userLevel === 'string' ? userLevel : 'N5',
        quizHistory: Array.isArray(quizHistory) ? quizHistory : [],
        weakCategories: Array.isArray(weakCategories) ? weakCategories : []
      });

      recordAiCostUsage(userId, 1000);

      return res.json({ success: true, schedule });
    } catch (err: any) {
      console.error('Study schedule error:', err);
      return res.status(500).json({ error: 'Failed to generate personalized study schedule.' });
    }
  }
);
