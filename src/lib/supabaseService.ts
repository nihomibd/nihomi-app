import { supabase } from './supabase';

export interface ProfileData {
  userId: string;
  bio?: string;
  targetJLPTLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  preferredLanguage?: 'bn' | 'en' | 'ja';
  dailyGoalMinutes?: number;
  targetVisaType?: string;
  country?: string;
  city?: string;
  notificationEmail?: boolean;
  notificationPush?: boolean;
}

export interface SyncLessonProgressParams {
  userId: string;
  lessonId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  timeSpentSeconds?: number;
}

export interface SyncLearningProgressParams {
  userId: string;
  currentJLPTLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  xpDelta?: number;
  streakDays?: number;
  studyMinutesDelta?: number;
  vocabMasteredDelta?: number;
  grammarMasteredDelta?: number;
  kanjiMasteredDelta?: number;
  memoryOsHealthScore?: number;
}

export interface QuizAttemptParams {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeSpentSeconds: number;
  answersJson?: Record<string, any>;
}

export interface MilestoneActivityLog {
  userId: string;
  eventType: 'LESSON_COMPLETED' | 'QUIZ_ATTEMPTED' | 'COURSE_COMPLETED' | 'LEVEL_UPGRADED' | 'STREAK_MILESTONE' | 'PROFILE_SYNCED';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * 1. Upsert User and Profile in Supabase
 */
export async function syncUserProfileToSupabase(user: {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  avatarUrl?: string;
  studentId?: string;
  nihomiAccountId?: string;
  targetLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  preferredLanguage?: 'bn' | 'en' | 'ja';
}) {
  try {
    // 1. Upsert user record
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        name: user.name || user.fullName || user.email.split('@')[0],
        full_name: user.fullName || user.name || user.email.split('@')[0],
        avatar_url: user.avatarUrl || '',
        student_id: user.studentId || `DILS-2026-${user.id.slice(-4)}`,
        nihomi_account_id: user.nihomiAccountId || `NHM-${user.id.slice(-6)}`,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (userError) {
      console.warn('Supabase User Upsert Notice:', userError.message);
    }

    // 2. Upsert profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        target_jlpt_level: user.targetLevel || 'N5',
        preferred_language: user.preferredLanguage || 'bn',
        country: 'Bangladesh',
        daily_goal_minutes: 20,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (profileError) {
      console.warn('Supabase Profile Upsert Notice:', profileError.message);
    }

    // 3. Ensure baseline learning progress exists
    const { error: progressError } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: user.id,
        current_jlpt_level: user.targetLevel || 'N5',
        memory_os_health_score: 100,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (progressError) {
      console.warn('Supabase Learning Progress Baseline Notice:', progressError.message);
    }

    return { success: true };
  } catch (err) {
    console.error('Error syncing profile to Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * 2. Sync Lesson Progress
 */
export async function syncLessonProgressToSupabase(params: SyncLessonProgressParams) {
  try {
    const isCompleted = params.status === 'COMPLETED' || params.progressPercent >= 100;
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: params.userId,
        lesson_id: params.lessonId,
        status: isCompleted ? 'COMPLETED' : params.status,
        progress_percent: params.progressPercent,
        time_spent_seconds: params.timeSpentSeconds || 0,
        last_accessed_at: new Date().toISOString(),
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });

    if (error) {
      console.warn('Supabase Lesson Progress Sync Notice:', error.message);
    }

    return { success: !error, data };
  } catch (err) {
    console.error('Error syncing lesson progress:', err);
    return { success: false, error: err };
  }
}

/**
 * 3. Sync & Increment Learning Progress / XP
 */
export async function syncLearningProgressToSupabase(params: SyncLearningProgressParams) {
  try {
    // Fetch existing
    const { data: current } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', params.userId)
      .maybeSingle();

    const totalXP = (current?.total_xp || 0) + (params.xpDelta || 0);
    const totalMinutes = (current?.total_study_minutes || 0) + (params.studyMinutesDelta || 0);
    const vocabCount = (current?.mastered_vocab_count || 0) + (params.vocabMasteredDelta || 0);
    const grammarCount = (current?.mastered_grammar_count || 0) + (params.grammarMasteredDelta || 0);
    const kanjiCount = (current?.mastered_kanji_count || 0) + (params.kanjiMasteredDelta || 0);

    const { error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: params.userId,
        current_jlpt_level: params.currentJLPTLevel || current?.current_jlpt_level || 'N5',
        total_xp: totalXP,
        current_streak_days: params.streakDays !== undefined ? params.streakDays : (current?.current_streak_days || 1),
        longest_streak_days: Math.max(current?.longest_streak_days || 0, params.streakDays || 0),
        last_study_date: new Date().toISOString(),
        mastered_vocab_count: vocabCount,
        mastered_grammar_count: grammarCount,
        mastered_kanji_count: kanjiCount,
        total_study_minutes: totalMinutes,
        memory_os_health_score: params.memoryOsHealthScore ?? (current?.memory_os_health_score || 100),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.warn('Supabase Learning Progress Increment Notice:', error.message);
    }

    return { success: !error, totalXP };
  } catch (err) {
    console.error('Error updating learning progress:', err);
    return { success: false, error: err };
  }
}

/**
 * 4. Record Quiz Attempt
 */
export async function recordQuizAttemptToSupabase(params: QuizAttemptParams) {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: params.userId,
        quiz_id: params.quizId,
        score: params.score,
        total_questions: params.totalQuestions,
        correct_answers: params.correctAnswers,
        passed: params.passed,
        time_spent_seconds: params.timeSpentSeconds,
        answers_json: params.answersJson || {},
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase Quiz Attempt Recording Notice:', error.message);
    }

    return { success: !error, data };
  } catch (err) {
    console.error('Error logging quiz attempt:', err);
    return { success: false, error: err };
  }
}

/**
 * 5. Admin & Milestone Activity Logger Utility
 */
export async function logStudentMilestoneActivity(activity: MilestoneActivityLog) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: activity.userId,
        event_type: activity.eventType,
        title: activity.title,
        description: activity.description || '',
        metadata: activity.metadata || {},
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase Milestone Activity Log Notice:', error.message);
    }

    return { success: !error, data };
  } catch (err) {
    console.error('Error recording milestone log:', err);
    return { success: false, error: err };
  }
}

/**
 * 6. Fetch Learning Progress and History (for calendar and charts)
 */
export async function getLearningProgressHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Notice loading learning progress:', error.message);
    }

    return { success: !error, data };
  } catch (err) {
    console.error('Error fetching learning progress history:', err);
    return { success: false, error: err, data: null };
  }
}

/**
 * 7. Fetch Activity Logs for Streak & Heatmap Calculation
 */
export async function fetchStudentActivityLogs(userId: string, limit: number = 100) {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Notice loading activity logs:', error.message);
    }

    return { success: !error, data: data || [] };
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return { success: false, error: err, data: [] };
  }
}
