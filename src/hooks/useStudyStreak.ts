import { useState, useEffect, useCallback } from 'react';

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  todayCompleted: boolean;
  totalActiveDays: number;
  history: string[]; // List of completed 'YYYY-MM-DD'
}

const STORAGE_KEY = 'nihomi_study_streak_state_v1';
const STREAK_EVENT = 'nihomi_streak_updated';

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const loadStreakState = (): StreakState => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Default initial state with a healthy 18-day baseline for student immersion
      const initialHistory = Array.from({ length: 18 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (18 - i));
        return d.toISOString().split('T')[0];
      });

      const defaultState: StreakState = {
        currentStreak: 18,
        longestStreak: 24,
        lastActiveDate: yesterday, // Not completed today yet by default
        todayCompleted: false,
        totalActiveDays: 68,
        history: initialHistory
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
      return defaultState;
    }

    const parsed: StreakState = JSON.parse(raw);
    const isToday = parsed.lastActiveDate === today;
    const isYesterday = parsed.lastActiveDate === yesterday;

    // If last active was before yesterday, streak is broken unless completed today
    let currentStreak = parsed.currentStreak;
    if (!isToday && !isYesterday && parsed.lastActiveDate) {
      currentStreak = 0;
    }

    return {
      ...parsed,
      currentStreak,
      todayCompleted: isToday
    };
  } catch {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
      todayCompleted: true,
      totalActiveDays: 1,
      history: [today]
    };
  }
};

export const useStudyStreak = () => {
  const [streakState, setStreakState] = useState<StreakState>(loadStreakState);

  const refreshState = useCallback(() => {
    setStreakState(loadStreakState());
  }, []);

  useEffect(() => {
    const handleCustomEvent = () => refreshState();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refreshState();
    };

    window.addEventListener(STREAK_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(STREAK_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshState]);

  const recordActivity = useCallback((type: 'lesson' | 'quiz' | 'srs' | 'general' = 'general') => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const currentState = loadStreakState();

    let newCurrentStreak = currentState.currentStreak;
    let newLongestStreak = currentState.longestStreak;
    let newTotalActiveDays = currentState.totalActiveDays;
    const history = [...currentState.history];

    if (!history.includes(today)) {
      history.push(today);
      newTotalActiveDays += 1;
    }

    if (currentState.lastActiveDate === today) {
      // Already completed today, do not increment streak again
      newCurrentStreak = currentState.currentStreak;
    } else if (currentState.lastActiveDate === yesterday) {
      // Consecutive day continuation!
      newCurrentStreak = currentState.currentStreak + 1;
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    } else {
      // Starting new streak
      newCurrentStreak = 1;
    }

    const updated: StreakState = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
      todayCompleted: true,
      totalActiveDays: newTotalActiveDays,
      history
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setStreakState(updated);
      window.dispatchEvent(new CustomEvent(STREAK_EVENT, { detail: { type, updated } }));
    } catch (e) {
      console.error('Failed to save study streak:', e);
    }

    return updated;
  }, []);

  return {
    ...streakState,
    recordActivity,
    refreshState
  };
};
