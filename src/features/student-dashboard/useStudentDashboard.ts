import { useState, useEffect, useCallback } from 'react';
import { DashboardApiResponse, DashboardViewState, TaskStatus } from './types';
import { studentService } from './studentService';
import { MockExamAttempt } from '../../types';
import { StorePackage } from './components/NihomiStoreModal';

export const useStudentDashboard = () => {
  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [viewState, setViewState] = useState<DashboardViewState>('loading');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = useCallback(async () => {
    setViewState('loading');
    try {
      const res = await studentService.getDashboardData();
      setData(res);
      setViewState('idle');
    } catch {
      setViewState('error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleDailyTask = (taskId: string) => {
    if (!data) return;
    const updatedPlan = data.dailyPlan.map((t) => {
      if (t.id === taskId) {
        const nextStatus: TaskStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    setData({ ...data, dailyPlan: updatedPlan });
    showToast('লক্ষ্যের অগ্রগতি আপডেট হয়েছে!');
  };

  const handleStartChallenge = async () => {
    if (!data || !data.dailyChallenge) return;
    const { xpReward, coinReward } = data.dailyChallenge;
    const result = await studentService.completeDailyChallenge(xpReward, coinReward);
    
    setData({
      ...data,
      dailyChallenge: { ...data.dailyChallenge, isCompleted: true, status: 'completed' },
      accountUsage: { ...data.accountUsage, nihomiCoins: result.updatedCoins },
    });

    showToast(`অভিনন্দন! +${xpReward} XP এবং +${coinReward} Nihomi Coins যোগ হয়েছে! 🪙`);
  };

  const handleUseAiCredit = async (): Promise<boolean> => {
    if (!data || data.accountUsage.aiCreditsRemaining <= 0) return false;
    const aiCreditsRemaining = await studentService.deductAiCredit();
    setData({
      ...data,
      accountUsage: { ...data.accountUsage, aiCreditsRemaining },
    });
    return true;
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!data || !data.continueLesson) return;
    const result = await studentService.completeLesson(lessonId);
    setData({
      ...data,
      continueLesson: { ...data.continueLesson, progressPercent: 100, estimatedMinutesLeft: 0 },
      dailyPlan: data.dailyPlan.map((item) => item.title.includes('Particle') ? { ...item, status: 'completed', detail: 'Lesson completed • +50 XP' } : item),
      jlptProgress: {
        ...data.jlptProgress,
        modules: { ...data.jlptProgress.modules, grammar: Math.min(100, data.jlptProgress.modules.grammar + 5) },
      },
      accountUsage: { ...data.accountUsage, nihomiCoins: result.updatedCoins },
    });
    showToast('অভিনন্দন! Lesson 12 সম্পন্ন। +50 XP এবং +10 Nihomi Coins যোগ হয়েছে!');
  };

  const handleMockExamCompleted = async (attempt: MockExamAttempt, reviewSections: any[]) => {
    const result = await studentService.recordMockExamResult(attempt, reviewSections);
    if (data && attempt.isPassed) {
      setData({ ...data, accountUsage: { ...data.accountUsage, nihomiCoins: result.updatedCoins } });
      showToast('অভিনন্দন! Mock Exam পাস। +100 XP এবং +25 Nihomi Coins যোগ হয়েছে!');
    }
  };

  const handleKanjiPracticeComplete = async () => {
    if (!data) return;
    await studentService.completeKanjiPractice();
    setData({
      ...data,
      kanjiProgress: { ...data.kanjiProgress, completed: Math.min(data.kanjiProgress.total, data.kanjiProgress.completed + 1) },
    });
    showToast('অসাধারণ! Kanji trace সম্পন্ন। +10 XP যোগ হয়েছে!');
  };

  const handleListeningComplete = async () => {
    if (!data) return;
    const result = await studentService.completeListeningPractice();
    setData({
      ...data,
      dailyPlan: data.dailyPlan.map((item) => item.type === 'listening' ? { ...item, status: 'completed', detail: 'Dialogue completed • +30 XP' } : item),
      jlptProgress: { ...data.jlptProgress, modules: { ...data.jlptProgress.modules, listening: Math.min(100, data.jlptProgress.modules.listening + 5) } },
      accountUsage: { ...data.accountUsage, nihomiCoins: result.updatedCoins },
    });
    showToast('অসাধারণ! Listening task সম্পন্ন। +30 XP এবং +5 Coins যোগ হয়েছে!');
  };

  const handleVocabularyComplete = async (reviewed: number) => {
    if (!data) return;
    await studentService.completeVocabularyPractice(reviewed);
    setData({
      ...data,
      dailyPlan: data.dailyPlan.map((item) => item.type === 'vocabulary' ? { ...item, status: 'completed', detail: '10 flashcards reviewed • +20 XP' } : item),
      vocabularyProgress: { ...data.vocabularyProgress, completed: Math.min(data.vocabularyProgress.total, data.vocabularyProgress.completed + reviewed) },
    });
    showToast('ভালো কাজ! Vocabulary SRS সম্পন্ন। +20 XP যোগ হয়েছে!');
  };

  const handleStorePurchase = async (pack: StorePackage) => {
    if (!data) return;
    const result = await studentService.purchaseStorePackage(pack);
    setData({ ...data, accountUsage: { ...data.accountUsage, nihomiCoins: result.updatedCoins, aiCreditsRemaining: result.updatedCredits } });
    showToast(`bKash top-up সফল! +${pack.coins} Coins এবং +${pack.credits} AI Credits যোগ হয়েছে।`);
  };

  const handleFocusSessionComplete = async () => {
    if (!data) return;
    await studentService.completeFocusSession();
    showToast('Zen Focus block সম্পন্ন! +30 XP যোগ হয়েছে।');
  };

  return {
    data,
    viewState,
    toastMessage,
    refresh: loadData,
    toggleDailyTask,
    handleStartChallenge,
    handleUseAiCredit,
    handleCompleteLesson,
    handleMockExamCompleted,
    handleKanjiPracticeComplete,
    handleListeningComplete,
    handleVocabularyComplete,
    handleStorePurchase,
    handleFocusSessionComplete,
    showToast,
  };
};