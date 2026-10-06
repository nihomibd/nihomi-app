import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';
import { isFounderEmail } from '../env.js';
import { db } from '../db.js';
import { getUserActivePlanId } from '../services/entitlements.js';

export const dashboardRouter = Router();

/**
 * Helper to construct the unified student dashboard response from database state.
 */
function buildStudentDashboardData(userId: string) {
  const user = db.findUserById(userId);
  const profile = db.getProfileByUserId(userId);
  const progress = db.getProgressByUserId(userId);
  const wallet = db.getUserWallet(userId);
  const planId = getUserActivePlanId(userId);

  const completedLessonCount = progress?.completedLessonIds?.length || 0;
  const currentStreak = progress?.currentStreak || 0;
  const longestStreak = progress?.longestStreak || 0;
  const totalStudyMinutes = progress?.totalStudyMinutes || 0;
  const experiencePoints = progress?.experiencePoints || 0;
  const coinBalance = wallet?.coinBalance || 0;
  const currentLevel = progress?.currentLevel || profile?.targetLevel || 'N5';

  // Determine explainable Next Best Mission based on real progress
  let nextBestMission = {
    missionId: 'mission-001-vowels',
    title: 'Hiragana Five Vowels (あ・い・う・え・お)',
    titleBn: 'হিরাগানা ৫টি মৌলিক স্বরবর্ণ (あ・い・う・え・お)',
    level: 'N5',
    whyThisMission: 'জাপানি ভাষার ভিত্তি শুরু হয় ৫টি স্বরবর্ণ দিয়ে। এটি নিখুঁতভাবে শিখলে পরবর্তী শব্দগুলো সহজে পড়তে পারবেন।',
    actionLabel: 'মিশন শুরু করুন →'
  };

  if (completedLessonCount >= 5) {
    nextBestMission = {
      missionId: 'mission-002-tokyo-konbini',
      title: 'Tokyo Konbini Checkout Defense (7-Eleven / Lawson)',
      titleBn: 'টোকিও কনবিনি কেনাকাটা মিশন',
      level: 'N5',
      whyThisMission: 'আপনি ৫টি প্রাথমিক পাঠ সম্পন্ন করেছেন! এখন বাস্তব জাপানি কনবিনিতে কেনাকাটার অনুশীলন আপনার আত্মবিশ্বাস বাড়াবে।',
      actionLabel: 'কনবিনি মিশন শুরু করুন →'
    };
  }

  return {
    user: user ? {
      id: user.id,
      email: user.email,
      name: profile?.displayName || user.email.split('@')[0],
      role: user.role,
      planId,
      studentId: 'NHO-' + user.id.slice(0, 6).toUpperCase(),
      avatarUrl: profile?.avatarSeed || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } : null,
    profile: {
      displayName: profile?.displayName || 'Japanese Learner',
      targetLevel: profile?.targetLevel || 'N5',
      dailyGoalMinutes: profile?.dailyGoalMinutes || 20,
      nativeLanguage: profile?.nativeLanguage || 'English',
      bio: profile?.bio || '',
      japanReadinessScore: profile?.japanReadinessScore || 0,
      onboardingData: profile?.onboardingData || null
    },
    progress: {
      currentLevel,
      currentStreak,
      longestStreak,
      completedLessonIds: progress?.completedLessonIds || [],
      completedLessonCount,
      totalStudyMinutes,
      experiencePoints,
      lastActiveDate: progress?.lastActiveDate || new Date().toISOString().split('T')[0]
    },
    wallet: {
      coinBalance,
      aiCredits: wallet?.aiCredits || 0
    },
    learningStats: {
      completedLessonsCount: completedLessonCount,
      currentStreak,
      coins: coinBalance,
      xp: experiencePoints,
      readinessScore: profile?.japanReadinessScore || 0
    },
    nextBestMission,
    serverTimestamp: new Date().toISOString()
  };
}

/**
 * GET /api/dashboard/me (and GET /api/dashboard)
 * Strictly scoped to authenticated user derived from verified Bearer token.
 */
dashboardRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const data = buildStudentDashboardData(user.id);
  return res.json({
    success: true,
    data,
    ...data
  });
});

dashboardRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const data = buildStudentDashboardData(user.id);
  return res.json({
    success: true,
    data,
    ...data
  });
});

/**
 * GET /api/dashboard/student/:userId
 * Tenant-isolated student progress endpoint with strict ownership check.
 * Student A CANNOT view Student B (403 Forbidden).
 * Founder or Admin CAN view authorized student dashboard state.
 */
dashboardRouter.get('/student/:userId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const requestingUser = req.user!;
  const targetUserId = req.params.userId;
  const isFounder = requestingUser.role === 'founder' || isFounderEmail(requestingUser.email);
  const isAdmin = requestingUser.role === 'admin';

  if (requestingUser.id !== targetUserId && !isFounder && !isAdmin) {
    console.warn(`[Security] IDOR attempt blocked: User ${requestingUser.email} (ID: ${requestingUser.id}) attempted to access dashboard for student ID: ${targetUserId}`);
    return res.status(403).json({
      success: false,
      error: 'Forbidden. You do not have permission to access another student\'s dashboard.',
      code: 'FORBIDDEN_STUDENT_ISOLATION'
    });
  }

  const targetUser = db.findUserById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      error: 'Student record not found.',
      code: 'STUDENT_NOT_FOUND'
    });
  }

  const data = buildStudentDashboardData(targetUserId);
  return res.json({
    success: true,
    data,
    authorizedBy: {
      requestingUserId: requestingUser.id,
      role: requestingUser.role
    }
  });
});
