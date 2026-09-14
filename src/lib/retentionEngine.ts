/**
 * NIHOMI.COM — Student Retention & Daily Streak Engine
 * Tracks daily streak consistency, XP, Levels, Freeze protection, and milestone rewards.
 */

export type RetentionActivityType =
  | 'KANA'
  | 'LISTENING'
  | 'QUIZ'
  | 'AI_CHAT'
  | 'MOCK_EXAM';

export interface StudentRetentionState {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  currentLevelXp: number;
  freezeCount: number;
  isProFreezeShieldActive: boolean;
  todayCompletedActivities: RetentionActivityType[];
  lastActiveDate: string;
  weeklyHistory: { date: string; dayLabel: string; isCompleted: boolean; isToday: boolean }[];
  recentNotice: string | null;
}

const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, title: 'N5 Beginner (শুরু)' },
  { level: 2, minXp: 100, title: 'Hiragana Explorer (হিরাগানা অনুসন্ধান)' },
  { level: 3, minXp: 300, title: 'Katakana Navigator (কাতাকানা নেভিগেটর)' },
  { level: 4, minXp: 650, title: 'Kanji Rookie (কাঞ্জি শিক্ষার্থী)' },
  { level: 5, minXp: 1100, title: 'Sentence Crafter (বাক্য নির্মাতা)' },
  { level: 6, minXp: 1700, title: 'Listening Champ (লিসেনিং চ্যাম্প)' },
  { level: 7, minXp: 2500, title: 'Kaiwa Conversationalist (কথোপকথনকারী)' },
  { level: 8, minXp: 3500, title: 'Choukai Master (চৌকাই মাস্টার)' },
  { level: 9, minXp: 4800, title: 'JLPT N5 Ready (এন৫ পরীক্ষার প্রস্তুত)' },
  { level: 10, minXp: 6500, title: 'Tokyo Bound (টোকিও গমনে প্রস্তুত)' },
];

export function calculateLevelFromXp(xp: number) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || { level: 10, minXp: 10000, title: 'Grandmaster' };
      break;
    }
  }

  return {
    level: current.level,
    title: current.title,
    currentLevelMinXp: current.minXp,
    nextLevelMinXp: next.minXp,
  };
}

const STORAGE_KEYS = {
  STREAK_DAYS: 'nihomi_current_streak_days_v1',
  LONGEST_STREAK: 'nihomi_longest_streak_days_v1',
  LAST_ACTIVE_DATE: 'nihomi_last_active_date_v1',
  STUDENT_XP: 'nihomi_student_xp',
  FREEZE_COUNT: 'nihomi_streak_freeze_count',
  TODAY_ACTIVITIES: 'nihomi_today_activities_v1',
  TODAY_DATE_STAMP: 'nihomi_today_date_stamp_v1',
  FROZEN_DATES: 'nihomi_frozen_dates_v1',
};

export const retentionEngine = {
  /**
   * Get current student retention status with weekly breakdown and streak checks.
   */
  getRetentionState(): StudentRetentionState {
    if (typeof window === 'undefined') {
      return this.getFallbackState();
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let currentStreak = parseInt(localStorage.getItem(STORAGE_KEYS.STREAK_DAYS) || '3', 10);
    let longestStreak = parseInt(localStorage.getItem(STORAGE_KEYS.LONGEST_STREAK) || '7', 10);
    let totalXp = parseInt(localStorage.getItem(STORAGE_KEYS.STUDENT_XP) || '450', 10);
    let freezeCount = parseInt(localStorage.getItem(STORAGE_KEYS.FREEZE_COUNT) || '1', 10);
    const lastActiveDate = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE) || todayStr;

    // Reset daily activities if date changed
    const storedDateStamp = localStorage.getItem(STORAGE_KEYS.TODAY_DATE_STAMP);
    let todayActivities: RetentionActivityType[] = [];

    if (storedDateStamp === todayStr) {
      try {
        todayActivities = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.TODAY_ACTIVITIES) || '[]'
        );
      } catch {
        todayActivities = [];
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.TODAY_DATE_STAMP, todayStr);
      localStorage.setItem(STORAGE_KEYS.TODAY_ACTIVITIES, JSON.stringify([]));
    }

    // Streak continuity & freeze logic
    let recentNotice: string | null = null;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if user missed yesterday
    if (lastActiveDate !== todayStr && lastActiveDate !== yesterdayStr) {
      const lastDate = new Date(lastActiveDate);
      const diffMs = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 2 && freezeCount > 0) {
        // Armed shield consumed
        freezeCount -= 1;
        const frozenDates = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.FROZEN_DATES) || '[]'
        ) as string[];
        frozenDates.push(yesterdayStr);

        localStorage.setItem(STORAGE_KEYS.FREEZE_COUNT, freezeCount.toString());
        localStorage.setItem(STORAGE_KEYS.FROZEN_DATES, JSON.stringify(frozenDates));
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, yesterdayStr);

        recentNotice = `🛡️ স্ট্রিক ফ্রিজ সক্রিয়! ${yesterdayStr} তারিখে আপনার ${currentStreak} দিনের স্ট্রিক রক্ষা করা হয়েছে।`;
      } else if (diffDays > 1) {
        // Reset streak if gap was unshielded
        currentStreak = 1;
        localStorage.setItem(STORAGE_KEYS.STREAK_DAYS, '1');
      }
    }

    const { level, title, currentLevelMinXp, nextLevelMinXp } = calculateLevelFromXp(totalXp);

    // Build last 7 days visual chart
    const weeklyHistory = [];
    const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const isToday = dStr === todayStr;
      const isCompleted = isToday
        ? todayActivities.length > 0
        : i <= currentStreak; // Completed within current streak window
      weeklyHistory.push({
        date: dStr,
        dayLabel: dayNamesBn[d.getDay()],
        isCompleted,
        isToday,
      });
    }

    return {
      currentStreak,
      longestStreak,
      totalXp,
      level,
      levelTitle: title,
      currentLevelXp: currentLevelMinXp,
      nextLevelXp: nextLevelMinXp,
      freezeCount,
      isProFreezeShieldActive: freezeCount > 0,
      todayCompletedActivities: todayActivities,
      lastActiveDate,
      weeklyHistory,
      recentNotice,
    };
  },

  /**
   * Record learning action (Kana, Listening, Quiz, Chat, etc.) and reward student
   */
  async recordActivity(activity: RetentionActivityType): Promise<{
    xpGained: number;
    newTotalXp: number;
    currentStreak: number;
    leveledUp: boolean;
    notice: string;
  }> {
    const todayStr = new Date().toISOString().split('T')[0];
    const previousState = this.getRetentionState();
    const todayDateStamp = localStorage.getItem(STORAGE_KEYS.TODAY_DATE_STAMP);

    let todayActivities: RetentionActivityType[] = [];
    if (todayDateStamp === todayStr) {
      try {
        todayActivities = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.TODAY_ACTIVITIES) || '[]'
        );
      } catch {
        todayActivities = [];
      }
    }

    // Determine XP reward
    const xpMap: Record<RetentionActivityType, number> = {
      KANA: 10,
      LISTENING: 15,
      QUIZ: 25,
      AI_CHAT: 15,
      MOCK_EXAM: 50,
    };
    const xpGained = xpMap[activity] || 10;
    const newTotalXp = previousState.totalXp + xpGained;
    localStorage.setItem(STORAGE_KEYS.STUDENT_XP, newTotalXp.toString());

    // Update streak if today wasn't active yet
    let newStreak = previousState.currentStreak;
    let newLongest = previousState.longestStreak;
    const wasAlreadyActiveToday = todayActivities.length > 0;

    if (!wasAlreadyActiveToday) {
      const yesterday = new Date();
      yesterday.setDate(new Date().getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (previousState.lastActiveDate === yesterdayStr) {
        newStreak += 1;
      } else if (previousState.lastActiveDate !== todayStr) {
        newStreak = 1;
      }

      if (newStreak > newLongest) {
        newLongest = newStreak;
        localStorage.setItem(STORAGE_KEYS.LONGEST_STREAK, newLongest.toString());
      }

      localStorage.setItem(STORAGE_KEYS.STREAK_DAYS, newStreak.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, todayStr);
    }

    // Add activity to today list
    if (!todayActivities.includes(activity)) {
      todayActivities.push(activity);
      localStorage.setItem(STORAGE_KEYS.TODAY_ACTIVITIES, JSON.stringify(todayActivities));
      localStorage.setItem(STORAGE_KEYS.TODAY_DATE_STAMP, todayStr);
    }

    // Check level up
    const prevLevel = calculateLevelFromXp(previousState.totalXp).level;
    const nextLevel = calculateLevelFromXp(newTotalXp).level;
    const leveledUp = nextLevel > prevLevel;

    // Asynchronously notify server for persistent DB sync
    try {
      fetch('/api/progress/record-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, xpGained }),
      }).catch(() => {});
    } catch {}

    const notice = leveledUp
      ? `🎉 স্তর বৃদ্ধি! আপনি এখন লেভেল ${nextLevel}-এ উন্নীত হয়েছেন (+${xpGained} XP)!`
      : `🔥 স্ট্রিক সচল রয়েছে! +${xpGained} XP অর্জিত হয়েছে।`;

    return {
      xpGained,
      newTotalXp,
      currentStreak: newStreak,
      leveledUp,
      notice,
    };
  },

  getFallbackState(): StudentRetentionState {
    return {
      currentStreak: 1,
      longestStreak: 1,
      totalXp: 50,
      level: 1,
      levelTitle: 'N5 Beginner',
      currentLevelXp: 0,
      nextLevelXp: 100,
      freezeCount: 1,
      isProFreezeShieldActive: true,
      todayCompletedActivities: [],
      lastActiveDate: new Date().toISOString().split('T')[0],
      weeklyHistory: [],
      recentNotice: null,
    };
  },
};
