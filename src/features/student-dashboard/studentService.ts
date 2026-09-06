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

      // চেক করুন কোনো সদ্য পাবলিশ হওয়া লাইভ লেসন আছে কিনা
      let activeContinueLesson = mockDashboardData.continueLesson
        ? {
            ...mockDashboardData.continueLesson,
            progressPercent: lesson12Completed ? 100 : mockDashboardData.continueLesson.progressPercent,
            estimatedMinutesLeft: lesson12Completed ? 0 : mockDashboardData.continueLesson.estimatedMinutesLeft
          }
        : null;

      try {
        const res = await fetch('/api/lessons');
        if (res.ok) {
          const payload = await res.json();
          const lessonList = Array.isArray(payload) ? payload : (payload.lessons || []);
          if (lessonList.length > 0) {
            const latest = lessonList[lessonList.length - 1];
            if (latest) {
              const isCompleted = completedLessons.includes(latest.id);
              activeContinueLesson = {
                lessonId: latest.id,
                lessonNumber: latest.lessonNumber || 1,
                title: latest.title || 'Japanese Lesson',
                topic: latest.summary || latest.title || 'পরিচয় ও অভিবাদন (Greetings & Identity)',
                topicJapanese: latest.titleJa || 'はじめまして・あいさつ',
                jlptLevel: (latest.level as any) || 'N5',
                progressPercent: isCompleted ? 100 : 25,
                estimatedMinutesLeft: isCompleted ? 0 : Math.max(10, latest.estimatedMinutes || 20)
              };
            }
          }
        }
      } catch {
        // quiet fallback
      }

      return {
        ...mockDashboardData,
        continueLesson: activeContinueLesson,
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

  async purchaseStorePackage(pack: { coins: number; credits: number }) {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const currentCredits = parseInt(localStorage.getItem('nihomi_ai_credits') || '85', 10);
    const updatedCoins = currentCoins + pack.coins;
    const updatedCredits = currentCredits + pack.credits;
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    localStorage.setItem('nihomi_ai_credits', updatedCredits.toString());
    return { updatedCoins, updatedCredits };
  },

  async completeFocusSession() {
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const updatedXp = currentXp + 30;
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await syncLearningProgressToSupabase({ userId: user.id, xpDelta: 30, studyMinutesDelta: 25 });
    } catch (error) {
      console.warn('[Nihomi Service] Focus session sync deferred; local progress is saved:', error);
    }
    return { updatedXp };
  },

  async completeBaitoTransaction() {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const updatedCoins = currentCoins + 10;
    const updatedXp = currentXp + 40;
    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await syncLearningProgressToSupabase({ userId: user.id, xpDelta: 40, studyMinutesDelta: 5 });
    } catch (error) {
      console.warn('[Nihomi Service] BaitoOS sync deferred; local progress is saved:', error);
    }
    return { updatedCoins, updatedXp };
  },

  async completeWritingPractice(character: string) {
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    const learned = JSON.parse(localStorage.getItem('nihomi_learned_kanji_v1') || '[]') as string[];
    const updatedLearned = Array.from(new Set([...learned, character]));
    const updatedXp = currentXp + 10;
    localStorage.setItem('nihomi_student_xp', updatedXp.toString());
    localStorage.setItem('nihomi_learned_kanji_v1', JSON.stringify(updatedLearned));
    return { updatedXp, updatedLearned };
  },

  async syncOfflineProgress(userId?: string) {
    if (!userId) return;
    try {
      const saved = localStorage.getItem('nihomi_completed_lessons');
      const completedLessons = saved ? JSON.parse(saved) as string[] : [];
      await Promise.all(completedLessons.map((lessonId) => syncLessonProgressToSupabase({
        userId,
        lessonId,
        status: 'COMPLETED',
        progressPercent: 100,
      })));
    } catch (error) {
      console.warn('[Nihomi Service] Offline progress sync deferred:', error);
    }
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
  },

  getStudentCoins(): number {
    return parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
  },

  getStreakStatus() {
    const todayStr = new Date().toISOString().split('T')[0];
    let currentStreak = parseInt(localStorage.getItem('nihomi_current_streak_days_v1') || '7', 10);
    let longestStreak = parseInt(localStorage.getItem('nihomi_longest_streak_days_v1') || '14', 10);
    let freezeCount = parseInt(localStorage.getItem('nihomi_streak_freeze_count') || '1', 10);
    const claimedMilestones = JSON.parse(localStorage.getItem('nihomi_claimed_streak_milestones_v1') || '[3]') as number[];
    const frozenDates = JSON.parse(localStorage.getItem('nihomi_frozen_dates_v1') || '[]') as string[];
    const lastActiveDate = localStorage.getItem('nihomi_last_active_date_v1') || todayStr;

    let freezeSavedNotice: string | null = null;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActiveDate !== todayStr && lastActiveDate !== yesterdayStr) {
      const daysDiff = Math.floor((today.getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 2 && freezeCount > 0) {
        freezeCount -= 1;
        frozenDates.push(yesterdayStr);
        localStorage.setItem('nihomi_streak_freeze_count', freezeCount.toString());
        localStorage.setItem('nihomi_frozen_dates_v1', JSON.stringify(frozenDates));
        localStorage.setItem('nihomi_last_active_date_v1', yesterdayStr);
        freezeSavedNotice = `🛡️ আপনার স্ট্রিক ফ্রিজ শিল্ড সক্রিয় হয়ে ${yesterdayStr} তারিখের জন্য ${currentStreak} দিনের স্ট্রিক রক্ষা করেছে!`;
      } else if (daysDiff > 2 && freezeCount === 0) {
        currentStreak = 1;
        localStorage.setItem('nihomi_current_streak_days_v1', '1');
      }
    }

    return {
      currentStreak,
      longestStreak,
      freezeCount,
      claimedMilestones,
      frozenDates,
      lastActiveDate,
      freezeSavedNotice
    };
  },

  async purchaseStreakFreeze(costCoins = 50) {
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10);
    if (currentCoins < costCoins) {
      return { success: false, updatedCoins: currentCoins, updatedFreezeCount: 0 };
    }
    const updatedCoins = currentCoins - costCoins;
    const currentFreezes = parseInt(localStorage.getItem('nihomi_streak_freeze_count') || '1', 10);
    const updatedFreezeCount = currentFreezes + 1;

    localStorage.setItem('nihomi_student_coins', updatedCoins.toString());
    localStorage.setItem('nihomi_streak_freeze_count', updatedFreezeCount.toString());

    return { success: true, updatedCoins, updatedFreezeCount };
  },

  async claimStreakMilestone(days: number, rewards: { gems: number; coins: number; xp: number; freezes: number }) {
    const claimed = JSON.parse(localStorage.getItem('nihomi_claimed_streak_milestones_v1') || '[3]') as number[];
    if (claimed.includes(days)) {
      return { success: false };
    }

    const updatedClaimed = [...claimed, days];
    const currentCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '420', 10) + rewards.coins;
    const currentGems = parseInt(localStorage.getItem('nihomi_user_gems_v1') || '320', 10) + rewards.gems;
    const currentXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10) + rewards.xp;
    const currentFreezes = parseInt(localStorage.getItem('nihomi_streak_freeze_count') || '1', 10) + rewards.freezes;

    localStorage.setItem('nihomi_claimed_streak_milestones_v1', JSON.stringify(updatedClaimed));
    localStorage.setItem('nihomi_student_coins', currentCoins.toString());
    localStorage.setItem('nihomi_user_gems_v1', currentGems.toString());
    localStorage.setItem('nihomi_student_xp', currentXp.toString());
    localStorage.setItem('nihomi_streak_freeze_count', currentFreezes.toString());

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await syncLearningProgressToSupabase({ userId: user.id, xpDelta: rewards.xp, studyMinutesDelta: 5 });
      }
    } catch (err) {
      console.warn('[studentService] Milestone sync deferred:', err);
    }

    return { success: true, currentCoins, currentGems, currentXp, currentFreezes };
  }
};