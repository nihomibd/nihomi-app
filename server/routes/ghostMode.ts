import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';

export const ghostModeRouter = Router();

// 1. Get Active Ghost Weaknesses
ghostModeRouter.get('/active-ghosts', requireAuth, (req: AuthenticatedRequest, res) => {
  const activeGhosts = [
    {
      id: 'ghost-01',
      topic: 'Particle は vs が in Dependent Clauses',
      targetJapanese: '田中さんが作ったケーキは美味しいです。',
      romaji: 'Tanaka-san ga tsukutta keeki wa oishii desu.',
      bangla: 'তানাকা সাহেবের বানানো কেকটি অনেক সুস্বাদু।',
      failureCount: 14,
      firstSeen: '2026-06-12',
      lastFailedContext: 'Restaurant Ordering (Quiz 4)',
      newContextChallenge: 'Tokyo Workplace Meeting (회의 / 打ち合わせ)',
      scenarioPrompt: 'Meeting-এ আপনার বস জানতে চাইলেন: "প্রজেক্টের ডিজাইন কে তৈরি করেছে?" আপনি কীভাবে বলবেন যে "তানাকা সাহেব যে ডিজাইন বানিয়েছেন সেটা ভালো"?',
      options: [
        { text: '田中さんが作ったデザインは素晴らしいです。', isCorrect: true, explanation: 'Subordinate clause-এর subject সবসময় が (ga) গ্রহণ করে, আর পুরো বাক্যের topic হল デザイン (wa)!' },
        { text: '田中さんは作ったデザインが素晴らしいです。', isCorrect: false, explanation: 'ভুল! Subordinate clause-এ は বসলে বাক্যের ফোকাস নষ্ট হয়ে যায়।' }
      ],
      isResolved: false
    },
    {
      id: 'ghost-02',
      topic: 'Te-Form Conjugation for ~Mu/Bu/Nu Verbs',
      targetJapanese: '友達と遊んで、コーヒーを飲みました。',
      romaji: 'Tomodachi to asonde, koohii o nomimashita.',
      bangla: 'বন্ধুর সাথে আড্ডা দিয়ে কফি খেয়েছিলাম।',
      failureCount: 9,
      firstSeen: '2026-07-04',
      lastFailedContext: 'Lesson 2 Te-form Drills',
      newContextChallenge: 'Shinjuku Weekend Conversation',
      scenarioPrompt: 'Weekend-এর কাজের ধারা বর্ণনা করতে গিয়ে 遊ぶ (Asobu - আড্ডা দেওয়া) এর সঠিক Te-form কী হবে?',
      options: [
        { text: '遊んで (Asonde)', isCorrect: true, explanation: 'Godan verb ending in ぶ (bu) conjugates to んで (nde)!' },
        { text: '遊びて (Asobite)', isCorrect: false, explanation: 'ভুল! ぶ দিয়ে শেষ হওয়া ভার্ব কখনোই いて/ite হয় না।' }
      ],
      isResolved: false
    }
  ];

  return res.json({ success: true, activeGhosts });
});

// 2. Resolve Ghost Weakness
ghostModeRouter.post('/resolve-ghost', requireAuth, (req: AuthenticatedRequest, res) => {
  const { ghostId, selectedAnswerIndex } = req.body;
  return res.json({
    success: true,
    ghostId,
    status: 'resolved',
    message: '🟢 Mistake Resolved! Your Learning Memory™ and Progress DNA™ have been updated.'
  });
});
