import confetti from 'canvas-confetti';
import { ALL_BADGES, MilestoneBadge } from './badgesData.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

export interface UserGamificationProfile {
  totalXp: number;
  level: number;
  currentStreakDays: number;
  bestStreakDays: number;
  lessonsCompletedCount: number;
  quizzesAcedCount: number;
  kanjiMasteredCount: number;
  speakingScoreMax: number;
  lastStudyDate: string; // YYYY-MM-DD
  badges: MilestoneBadge[];
  recentUnlocks: MilestoneBadge[];
}

const GAMIFICATION_STORAGE_KEY = 'nihomi_gamification_profile_v2';

const DEFAULT_PROFILE: UserGamificationProfile = {
  totalXp: 1450,
  level: 4,
  currentStreakDays: 8,
  bestStreakDays: 14,
  lessonsCompletedCount: 19,
  quizzesAcedCount: 14,
  kanjiMasteredCount: 78,
  speakingScoreMax: 96,
  lastStudyDate: new Date().toISOString().split('T')[0],
  badges: [...ALL_BADGES],
  recentUnlocks: []
};

export function calculateLevelFromXp(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPct: number } {
  // Level threshold: Level 1 = 0, Level 2 = 300, Level 3 = 800, Level 4 = 1500, Level 5 = 2500...
  const thresholds = [0, 300, 800, 1500, 2500, 4000, 6000, 9000, 13000, 20000];
  let level = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const base = thresholds[level - 1] || 0;
  const target = thresholds[level] || base + 2000;
  const currentLevelXp = xp - base;
  const nextLevelXp = target - base;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentLevelXp / nextLevelXp) * 100)));

  return { level, currentLevelXp, nextLevelXp, progressPct };
}

function loadProfile(): UserGamificationProfile {
  if (typeof window === 'undefined') return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      badges: mergeBadges(parsed.badges || ALL_BADGES)
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function mergeBadges(savedBadges: MilestoneBadge[]): MilestoneBadge[] {
  const map = new Map(savedBadges.map((b) => [b.id, b]));
  return ALL_BADGES.map((b) => {
    const saved = map.get(b.id);
    if (saved) {
      return {
        ...b,
        isUnlocked: saved.isUnlocked ?? b.isUnlocked,
        unlockedAt: saved.unlockedAt || b.unlockedAt,
        currentValue: saved.currentValue ?? b.currentValue
      };
    }
    return b;
  });
}

function persistProfile(profile: UserGamificationProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('[GamificationService] Failed to save profile to localStorage:', err);
  }

  // Cloud sync
  if (isSupabaseConfigured()) {
    try {
      Promise.resolve(
        supabase.from('student_gamification_profiles').upsert({
          total_xp: profile.totalXp,
          level: profile.level,
          current_streak: profile.currentStreakDays,
          best_streak: profile.bestStreakDays,
          lessons_completed: profile.lessonsCompletedCount,
          quizzes_aced: profile.quizzesAcedCount,
          last_study_date: profile.lastStudyDate,
          updated_at: new Date().toISOString()
        })
      ).catch(() => {});
    } catch {}
  }
}

export function triggerCelebrationConfetti() {
  try {
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#ec4899']
      });
    }
  } catch {}
}

export const GamificationService = {
  getProfile(): UserGamificationProfile {
    return loadProfile();
  },

  checkAndAwardBadges(profile: UserGamificationProfile): { newUnlocks: MilestoneBadge[]; updatedProfile: UserGamificationProfile } {
    const newUnlocks: MilestoneBadge[] = [];
    const updatedBadges = profile.badges.map((badge) => {
      if (badge.isUnlocked) return badge;

      let shouldUnlock = false;
      let currentVal = 0;

      switch (badge.id) {
        case 'badge-streak-7':
          currentVal = profile.currentStreakDays;
          shouldUnlock = profile.currentStreakDays >= 7;
          break;
        case 'badge-streak-30':
          currentVal = profile.currentStreakDays;
          shouldUnlock = profile.currentStreakDays >= 30;
          break;
        case 'badge-streak-50':
          currentVal = profile.currentStreakDays;
          shouldUnlock = profile.currentStreakDays >= 50;
          break;
        case 'badge-streak-100':
          currentVal = profile.currentStreakDays;
          shouldUnlock = profile.currentStreakDays >= 100;
          break;
        case 'badge-n5-complete':
          currentVal = profile.lessonsCompletedCount;
          shouldUnlock = profile.lessonsCompletedCount >= 25;
          break;
        case 'badge-kanji-50':
          currentVal = profile.kanjiMasteredCount;
          shouldUnlock = profile.kanjiMasteredCount >= 50;
          break;
        case 'badge-kanji-120':
          currentVal = profile.kanjiMasteredCount;
          shouldUnlock = profile.kanjiMasteredCount >= 120;
          break;
        case 'badge-tokyo-accent-ace':
          currentVal = profile.speakingScoreMax;
          shouldUnlock = profile.speakingScoreMax >= 95;
          break;
        default:
          break;
      }

      if (shouldUnlock && !badge.isUnlocked) {
        const unlockedBadge: MilestoneBadge = {
          ...badge,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
          currentValue: currentVal
        };
        newUnlocks.push(unlockedBadge);
        return unlockedBadge;
      }

      return { ...badge, currentValue: currentVal };
    });

    if (newUnlocks.length > 0) {
      triggerCelebrationConfetti();
      const addedXp = newUnlocks.reduce((sum, b) => sum + (b.xpReward || 0), 0);
      const newTotalXp = profile.totalXp + addedXp;
      const { level } = calculateLevelFromXp(newTotalXp);

      const updated: UserGamificationProfile = {
        ...profile,
        totalXp: newTotalXp,
        level,
        badges: updatedBadges,
        recentUnlocks: [...newUnlocks, ...(profile.recentUnlocks || [])].slice(0, 5)
      };
      persistProfile(updated);
      return { newUnlocks, updatedProfile: updated };
    }

    const updated: UserGamificationProfile = {
      ...profile,
      badges: updatedBadges
    };
    persistProfile(updated);
    return { newUnlocks: [], updatedProfile: updated };
  },

  recordLessonCompletion(lessonId: string, score: number = 100): { xpEarned: number; streakBonus: boolean; newUnlocks: MilestoneBadge[] } {
    const profile = loadProfile();
    const today = new Date().toISOString().split('T')[0];
    
    let streakDays = profile.currentStreakDays;
    let streakBonus = false;

    if (profile.lastStudyDate !== today) {
      const lastDate = new Date(profile.lastStudyDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streakDays += 1;
      } else if (diffDays > 1) {
        streakDays = 1; // Reset streak
      }
    }

    if (streakDays >= 7) streakBonus = true;

    const baseLessonXp = 50;
    const scoreBonus = score >= 90 ? 25 : 10;
    const streakMultiplier = streakBonus ? 1.25 : 1.0;
    const xpEarned = Math.round((baseLessonXp + scoreBonus) * streakMultiplier);

    const newTotalXp = profile.totalXp + xpEarned;
    const { level } = calculateLevelFromXp(newTotalXp);

    const updatedProfile: UserGamificationProfile = {
      ...profile,
      totalXp: newTotalXp,
      level,
      currentStreakDays: streakDays,
      bestStreakDays: Math.max(profile.bestStreakDays, streakDays),
      lessonsCompletedCount: profile.lessonsCompletedCount + 1,
      lastStudyDate: today
    };

    const { newUnlocks, updatedProfile: finalProfile } = this.checkAndAwardBadges(updatedProfile);
    persistProfile(finalProfile);

    return {
      xpEarned,
      streakBonus,
      newUnlocks
    };
  },

  recordSpeakingScore(score: number): { newUnlocks: MilestoneBadge[] } {
    const profile = loadProfile();
    profile.speakingScoreMax = Math.max(profile.speakingScoreMax, score);
    const { newUnlocks, updatedProfile } = this.checkAndAwardBadges(profile);
    persistProfile(updatedProfile);
    return { newUnlocks };
  },

  recordDailyStreak(): { streakDays: number; streakBonus: boolean; newUnlocks: MilestoneBadge[] } {
    const profile = loadProfile();
    const today = new Date().toISOString().split('T')[0];
    let streakDays = profile.currentStreakDays;

    if (profile.lastStudyDate !== today) {
      streakDays += 1;
      profile.currentStreakDays = streakDays;
      profile.bestStreakDays = Math.max(profile.bestStreakDays, streakDays);
      profile.lastStudyDate = today;
      profile.totalXp += 20; // Daily checkin bonus
    }

    const { newUnlocks, updatedProfile } = this.checkAndAwardBadges(profile);
    persistProfile(updatedProfile);

    return {
      streakDays: updatedProfile.currentStreakDays,
      streakBonus: updatedProfile.currentStreakDays >= 7,
      newUnlocks
    };
  }
};
