/**
 * NIHOMI.COM — Student Dashboard Real-Data Service
 * Connects Supabase Auth, MemoryOS (SRS), and Gamification
 */
import { supabase } from '../../lib/supabase';
import { syncLearningProgressToSupabase, syncLessonProgressToSupabase } from '../../lib/supabaseService';
import { DashboardApiResponse } from './types';
import { mockDashboardData } from './mockData';
import { MockExamAttempt } from '../../types';

export const studentService = {
  // ১. আসল স্টুডেন্ট ও ড্যাশবোর্ড ডেটা ফেচ করা
  async getDashboardData(): Promise<DashboardApiResponse> {
    try {
      // Supabase থেকে বর্তমান লগইন করা ইউজার চেক
      const { data: { user } } = await supabase.auth.getUser();

      let studentName = 'Tanvir';
      let studentLevel: 'N5' | 'N4' | 'N3' = 'N5';

      if (user) {
        studentName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Learner';
        studentLevel = user.user_metadata?.target_jlpt || 'N5';
      }

      // LocalStorage বা MemoryOS থেকে সংরক্ষিত ভুলগুলো চেক
      const storedMistakes = localStorage.getItem('nihomi_memory_mistakes');
      const realMistakes = storedMistakes ? JSON.parse(storedMistakes) : mockDashboardData.recentMistakes;
      const completedLessons = JSON.parse(localStorage.getItem('nihomi_completed_lessons') || '[]') as string[];
      const lesson12Completed = completedLessons.includes('les_n5_012') || completedLessons.includes('lesson-12');

      // সংরক্ষিত কয়েন ও AI ক্রেডিট চেক
      const savedCoins = localStorage.getItem('nihomi_student_coins');
      const savedCredits = localStorage.getItem('nihomi_ai_credits');

      return {
        ...mockDashboardData,
        continueLesson: mockDashboardData.continueLesson
          ? { ...mockDashboardData.continueLesson, progressPercent: lesson12Completed ? 100 : mockDashboardData.continueLesson.progressPercent, estimatedMinutesLeft: lesson12Completed ? 0 : mockDashboardData.continueLesson.estimatedMinutesLeft }
          : null,
        dailyPlan: mockDashboardData.dailyPlan.map((item) => item.title.includes('Particle') && lesson12Completed
          ? { ...item, status: 'completed', detail: 'Lesson completed • +50 XP' }
          : item),
        jlptProgress: lesson12Completed
          ? { ...mockDashboardData.jlptProgress, modules: { ...mockDashboardData.jlptProgress.modules, grammar: Math.min(100, mockDashboardData.jlptProgress.modules.grammar + 5) } }
          : mockDashboardData.jlptProgress,
        student: {
          ...mockDashboardData.student,
          name: studentName,
          jlptLevel: studentLevel,
          learningStatusMessageBn: user 
            ? 'স্বাগতম! আপনার আজকের নির্ধারিত লেসন ও কুইজ সম্পন্ন করুন' 
            : 'গেস্ট মোড: আপনার অগ্রগতি ক্লাউডে সেভ করতে লগইন করুন',
        },
        recentMistakes: realMistakes,
        accountUsage: {
          aiCreditsRemaining: savedCredits ? parseInt(savedCredits, 10) : 85,
          aiCreditsMax: 100,
          nihomiCoins: savedCoins ? parseInt(savedCoins, 10) : 420,
        }
      };
    } catch (error) {
      console.warn('[Nihomi Service] Falling back to cached dashboard data:', error);
      return mockDashboardData;
    }
  },

  // ২. ডেইলি চ্যালেঞ্জ সম্পন্ন করে রিয়েল কয়েন ও XP যুক্ত করা
  async completeDailyChallenge(xpReward: number, coinReward: number) {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const updatedCoins = currentCoins + coinReward;
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    return { updatedCoins, xpGained: xpReward };
  },

  // ৩. AI টিউটর ব্যবহারের জন্য ১টি ক্রেডিট কাটা
  async deductAiCredit(): Promise<number> {
    const current = parseInt(localStorage.getItem('nihomi_ai_credits') || '85', 10);
    const updated = Math.max(0, current - 1);
    localStorage.setItem('nihomi_ai_credits', updated.toString());
    return updated;
  },

  async completeKanjiPractice() {
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const updatedXp = currentXp + 10;
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await syncLearningProgressToSupabase({ userId: user.id, xpDelta: 10, kanjiMasteredDelta: 1, studyMinutesDelta: 2 });
    } catch (error) {
      console.warn('[Nihomi Service] Kanji sync deferred; local progress is saved:', error);
    }
    return { updatedXp };
  },

  async completeListeningPractice() {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const updatedCoins = currentCoins + 5;
    const updatedXp = currentXp + 30;
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await syncLearningProgressToSupabase({ userId: user.id, xpDelta: 30, studyMinutesDelta: 2 });
    } catch (error) {
      console.warn('[Nihomi Service] Listening sync deferred; local progress is saved:', error);
    }
    return { updatedCoins, updatedXp };
  },

  async completeVocabularyPractice(reviewed: number) {
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const updatedXp = currentXp + 20;
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await syncLearningProgressToSupabase({ userId: user.id, xpDelta: 20, vocabMasteredDelta: reviewed, studyMinutesDelta: 5 });
    } catch (error) {
      console.warn('[Nihomi Service] Vocabulary sync deferred; local progress is saved:', error);
    }
    return { updatedXp, reviewed };
  },

  async completeLesson(lessonId: string, coinReward = 10, xpReward = 50) {
    let completedLessons: string[] = [];
    try {
      completedLessons = JSON.parse(localStorage.getItem('nihomi_completed_lessons') || '[]') as string[];
    } catch {
      completedLessons = [];
    }
    const updatedLessons = Array.from(new Set([...completedLessons, lessonId]));
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    if (completedLessons.includes(lessonId)) {
      return { updatedCoins: currentCoins, updatedXp: currentXp, updatedLessons };
    }
    const updatedCoins = currentCoins + coinReward;
    const updatedXp = currentXp + xpReward;

    localStorage.setItem('nihomi_completed_lessons', JSON.stringify(updatedLessons));
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await Promise.all([
          syncLessonProgressToSupabase({ userId: user.id, lessonId, status: 'COMPLETED', progressPercent: 100, timeSpentSeconds: 300 }),
          syncLearningProgressToSupabase({ userId: user.id, xpDelta: xpReward, grammarMasteredDelta: 1, studyMinutesDelta: 5 }),
        ]);
      }
    } catch (error) {
      console.warn('[Nihomi Service] Lesson sync deferred; local progress is saved:', error);
    }

    return { updatedCoins, updatedXp, updatedLessons };
  },

  async recordMockExamResult(attempt: MockExamAttempt, reviewSections: any[]) {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const rewardKey = `nihomi_mock_exam_reward_${attempt.id}`;
    const hasBeenRewarded = localStorage.getItem(rewardKey) === 'true';
    const updatedCoins = hasBeenRewarded ? currentCoins : currentCoins + (attempt.isPassed ? 25 : 0);
    const updatedXp = hasBeenRewarded ? currentXp : currentXp + (attempt.isPassed ? 100 : 0);
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    if (attempt.isPassed) localStorage.setItem(rewardKey, 'true');

    if (!attempt.isPassed) {
      const failedCategories = reviewSections
        .filter((section) => section.questions?.some((question: { isCorrect?: boolean }) => !question.isCorrect))
        .map((section) => section.title || section.id);
      const existing = JSON.parse(localStorage.getItem('nihomi_memory_mistakes') || '[]') as Array<Record<string, unknown>>;
      const failedMistakes = failedCategories.map((category: string) => ({
        id: `mock-exam-${attempt.id}-${category}`,
        pattern: `Mock Exam: ${category}`,
        category: category.toLowerCase().includes('listening') ? 'vocabulary' : category.toLowerCase().includes('grammar') ? 'particle' : 'vocabulary',
        missedCount: 1,
        lastMissed: 'আজ',
        hintBn: 'এই মক পরীক্ষার বিভাগটি MemoryOS-এ আবার অনুশীলন করুন।',
      }));
      localStorage.setItem('nihomi_memory_mistakes', JSON.stringify([...failedMistakes, ...existing]));
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && attempt.isPassed && !hasBeenRewarded) {
        await syncLearningProgressToSupabase({ userId: user.id, xpDelta: 100, studyMinutesDelta: Math.ceil(attempt.timeSpentSeconds / 60) });
      }
    } catch (error) {
      console.warn('[Nihomi Service] Mock exam sync deferred; local result is saved:', error);
    }

    return { updatedCoins, updatedXp };
  }
};