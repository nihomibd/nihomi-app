import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';
import {
  processAICoachRequest,
  processVisionSenseiRequest,
  processSentenceDnaRequest,
  processExampleSentenceRequest,
  processExplainMistakeRequest
} from '../gemini.js';
import { getUserActivePlanId, PLAN_LIMITS } from '../services/entitlements.js';
import crypto from 'crypto';

export const aiRouter = Router();

// 1. Text & Voice Chat
aiRouter.post('/coach', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, mode, scenario, sessionId, history, audioBase64, audioMimeType } = req.body;
    const userId = req.user!.id;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const planId = getUserActivePlanId(userId);
    const plan = db.getPlanById(planId) || db.getPlanById('free')!;
    const monthlyLimit = plan.aiMonthlyLimit || PLAN_LIMITS[planId]?.aiMonthlyQuota || 10;
    const usage = db.getAIUsageForCurrentMonth(userId);

    if (usage.aiCoachInteractions >= monthlyLimit) {
      return res.status(403).json({
        error: `Monthly AI Sensei interaction limit reached (${monthlyLimit} messages). Top up AI credits or upgrade plan!`,
        quotaExceeded: true,
        currentUsage: usage.aiCoachInteractions,
        monthlyLimit
      });
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

    const updatedUsage = db.incrementAIUsage(userId);

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

    return res.json({
      reply: aiResult.reply,
      romaji: aiResult.romaji,
      bengaliTranslation: aiResult.bengaliTranslation,
      correctionData: aiResult.correctionData,
      sessionId: session.id,
      messages: session.messages,
      usage: {
        aiCoachInteractions: updatedUsage.aiCoachInteractions,
        aiMonthlyLimit: monthlyLimit,
        remainingQuota: Math.max(0, monthlyLimit - updatedUsage.aiCoachInteractions)
      }
    });
  } catch (error: any) {
    console.error('AI Coach error:', error);
    return res.status(500).json({ error: 'AI Coach failed to respond. Please try again.' });
  }
});

// 2. Vision Sensei: Camera Snapshot & Photo OCR
aiRouter.post('/vision-sensei', requireAuth, async (req: AuthenticatedRequest, res) => {
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

    db.incrementAIUsage(userId);

    return res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Vision Sensei error:', error);
    return res.status(500).json({ error: 'Vision Sensei failed to analyze image. Please try another photo.' });
  }
});

// 3. Sentence DNA Endpoint
aiRouter.post('/sentence-dna', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Japanese sentence string is required.' });
    }

    const profile = db.getProfileByUserId(req.user!.id);
    const dna = await processSentenceDnaRequest(sentence.trim(), profile?.targetLevel || 'N5');

    return res.json({ success: true, sentenceDna: dna });
  } catch (err: any) {
    console.error('Sentence DNA error:', err);
    return res.status(500).json({ error: 'Failed to analyze Sentence DNA.' });
  }
});

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

// 6. Infinite AI Content Engine Micro-Drills
aiRouter.post('/endless-drills', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { targetLevel } = req.body;
    const { InfiniteAiContentEngine } = await import('../services/infiniteAi.js');
    const drills = await InfiniteAiContentEngine.generateEndlessDrills(req.user!.id, targetLevel || 'N5');
    return res.json({ success: true, drills });
  } catch (err: any) {
    console.error('Endless drills error:', err);
    return res.status(500).json({ error: 'Failed to generate endless drills' });
  }
});

// 7. Contextual JLPT Example Sentence Generator
aiRouter.post('/example-sentence', async (req, res) => {
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

    return res.json({ success: true, example: result });
  } catch (err: any) {
    console.error('Example sentence generator error:', err);
    return res.status(500).json({ error: 'Failed to generate example sentence.' });
  }
});

// 8. AI-Powered Quiz Mistake & Grammar Rule Explainer
aiRouter.post('/explain-mistake', async (req, res) => {
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

    return res.json({ success: true, explanation });
  } catch (err: any) {
    console.error('Explain mistake error:', err);
    return res.status(500).json({ error: 'Failed to explain mistake.' });
  }
});

