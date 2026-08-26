import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  syncLessonProgressToSupabase,
  syncLearningProgressToSupabase,
  recordQuizAttemptToSupabase,
  logStudentMilestoneActivity,
  SyncLessonProgressParams,
  QuizAttemptParams
} from '../lib/supabaseService';

export interface UseProgressSyncReturn {
  isSyncing: boolean;
  syncLessonCompletion: (lessonId: string, progressPercent?: number, timeSpentSeconds?: number, xpEarned?: number) => Promise<void>;
  syncQuizCompletion: (attempt: Omit<QuizAttemptParams, 'userId'>, xpEarned?: number) => Promise<void>;
  syncMilestone: (title: string, eventType?: 'LESSON_COMPLETED' | 'QUIZ_ATTEMPTED' | 'COURSE_COMPLETED' | 'LEVEL_UPGRADED' | 'STREAK_MILESTONE', metadata?: Record<string, any>) => Promise<void>;
}

export function useProgressSync(): UseProgressSyncReturn {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  /**
   * Syncs lesson progress and learning progress to Supabase when a student completes/advances in a lesson.
   */
  const syncLessonCompletion = useCallback(async (
    lessonId: string,
    progressPercent: number = 100,
    timeSpentSeconds: number = 300,
    xpEarned: number = 50
  ) => {
    if (!user?.id) return;
    setIsSyncing(true);

    try {
      // 1. Sync specific lesson record
      await syncLessonProgressToSupabase({
        userId: user.id,
        lessonId,
        status: progressPercent >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        progressPercent,
        timeSpentSeconds,
      });

      // 2. Increment global user learning progress & XP
      await syncLearningProgressToSupabase({
        userId: user.id,
        xpDelta: xpEarned,
        studyMinutesDelta: Math.ceil(timeSpentSeconds / 60),
        streakDays: user.streakDays || 1,
      });

      // 3. Log milestone activity if completed
      if (progressPercent >= 100) {
        await logStudentMilestoneActivity({
          userId: user.id,
          eventType: 'LESSON_COMPLETED',
          title: `Completed Lesson ${lessonId}`,
          description: `Finished with ${progressPercent}% progress and earned +${xpEarned} XP.`,
          metadata: { lessonId, timeSpentSeconds, xpEarned },
        });
      }
    } catch (err) {
      console.error('Failed to sync lesson completion:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id, user?.streakDays]);

  /**
   * Syncs quiz attempt and updates overall score and progress when a quiz is submitted.
   */
  const syncQuizCompletion = useCallback(async (
    attempt: Omit<QuizAttemptParams, 'userId'>,
    xpEarned: number = 100
  ) => {
    if (!user?.id) return;
    setIsSyncing(true);

    try {
      // 1. Record individual attempt in quiz_attempts table
      await recordQuizAttemptToSupabase({
        userId: user.id,
        ...attempt,
      });

      // 2. Increment user XP and study stats
      await syncLearningProgressToSupabase({
        userId: user.id,
        xpDelta: attempt.passed ? xpEarned : Math.floor(xpEarned / 2),
        studyMinutesDelta: Math.ceil(attempt.timeSpentSeconds / 60),
      });

      // 3. Log quiz milestone
      await logStudentMilestoneActivity({
        userId: user.id,
        eventType: 'QUIZ_ATTEMPTED',
        title: `Completed Quiz ${attempt.quizId} - ${attempt.passed ? 'PASSED' : 'PRACTICE'}`,
        description: `Score: ${attempt.score}% (${attempt.correctAnswers}/${attempt.totalQuestions})`,
        metadata: {
          quizId: attempt.quizId,
          score: attempt.score,
          passed: attempt.passed,
          correctAnswers: attempt.correctAnswers,
          totalQuestions: attempt.totalQuestions,
        },
      });
    } catch (err) {
      console.error('Failed to sync quiz completion:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id]);

  /**
   * Logs a generic student milestone
   */
  const syncMilestone = useCallback(async (
    title: string,
    eventType: 'LESSON_COMPLETED' | 'QUIZ_ATTEMPTED' | 'COURSE_COMPLETED' | 'LEVEL_UPGRADED' | 'STREAK_MILESTONE' = 'STREAK_MILESTONE',
    metadata?: Record<string, any>
  ) => {
    if (!user?.id) return;
    await logStudentMilestoneActivity({
      userId: user.id,
      eventType,
      title,
      description: `Student achieved milestone: ${title}`,
      metadata,
    });
  }, [user?.id]);

  return {
    isSyncing,
    syncLessonCompletion,
    syncQuizCompletion,
    syncMilestone,
  };
}
