import { useState, useEffect, useCallback } from 'react';
import { DashboardApiResponse, DashboardViewState } from './types';
import { studentService } from './studentService';

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
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
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

  return {
    data,
    viewState,
    toastMessage,
    refresh: loadData,
    toggleDailyTask,
    handleStartChallenge,
    showToast,
  };