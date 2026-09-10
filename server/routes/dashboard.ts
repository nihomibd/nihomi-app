import { Router, Request, Response } from 'express';
import {
  requireAuth,
  requireRole,
  verifyResourceOwnership
} from '../middleware/supabaseAuth.js';
import { db } from '../db.js';

export const dashboardRouter = Router();

/**
 * GET /api/dashboard/me
 * Retrieves current authenticated user profile, role, and membership metadata
 */
dashboardRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = req.user!;

  // Retrieve user record and progress from persistent database
  const dbUser = db.findUserById(user.id) || db.findUserByEmail(user.email);
  const profile = db.getProfile(user.id);
  const progress = db.getProgress(user.id);
  const subscription = db.getUserActiveSubscription(user.id);

  return res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      studentId: user.studentId || (profile?.displayName ? `NHM-${user.id.slice(0, 6).toUpperCase()}` : undefined),
      profile: profile || {
        displayName: user.metadata?.full_name || user.email.split('@')[0],
        targetLevel: 'N5',
        dailyGoalMinutes: 30
      },
      progress: progress || {
        currentLevel: 'N5',
        totalStudyMinutes: 0,
        currentStreak: 0,
        experiencePoints: 0
      },
      subscription: subscription || {
        plan: 'FREE',
        status: 'ACTIVE'
      },
      metadata: user.metadata
    }
  });
});

/**
 * GET /api/dashboard/student/:userId
 * Tenant-isolated student progress endpoint.
 * Protected by verifyResourceOwnership to eliminate Insecure Direct Object References (IDOR).
 */
dashboardRouter.get(
  '/student/:userId',
  requireAuth,
  verifyResourceOwnership('userId', { allowBypassRoles: ['ADMIN', 'TEACHER'] }),
  (req: Request, res: Response) => {
    const { userId } = req.params;
    const profile = db.getProfile(userId);
    const progress = db.getProgress(userId);

    return res.json({
      success: true,
      data: {
        userId,
        profile,
        progress,
        requestingUser: {
          id: req.user!.id,
          role: req.user!.role
        }
      }
    });
  }
);

/**
 * GET /api/dashboard/admin/stats
 * Administrative metrics endpoint.
 * Strictly restricted to users with ADMIN role via requireRole(['ADMIN']).
 */
dashboardRouter.get(
  '/admin/stats',
  requireAuth,
  requireRole(['ADMIN']),
  (_req: Request, res: Response) => {
    const stats = db.getAdminStats();

    return res.json({
      success: true,
      data: {
        totalUsers: stats.totalUsers,
        totalQuizzes: stats.totalQuizzes,
        totalLessons: stats.totalLessons,
        systemHealth: 'HEALTHY',
        timestamp: new Date().toISOString()
      }
    });
  }
);

/**
 * GET /api/dashboard/teacher/cohorts
 * Teacher portal endpoint.
 * Accessible to TEACHER or ADMIN roles.
 */
dashboardRouter.get(
  '/teacher/cohorts',
  requireAuth,
  requireRole(['ADMIN', 'TEACHER']),
  (req: Request, res: Response) => {
    return res.json({
      success: true,
      data: {
        instructorId: req.user!.id,
        cohorts: [
          { id: 'cohort-tokyo-2026-n5', name: 'Tokyo N5 Spring Batch', studentCount: 24 },
          { id: 'cohort-osaka-2026-n4', name: 'Osaka N4 Accelerated Batch', studentCount: 18 }
        ]
      }
    });
  }
);
