// src/v2/utils/accessControl.ts
// Single Source of Truth for Role Authorization, Pro Gating & Commercial Access Control
import { User } from '../../context/AuthContext';

export const FOUNDER_EMAIL = 'mdtanvirkabirbiplob@gmail.com';

/**
 * Checks whether the current user is the authoritative NIHOMI Founder.
 */
export const isFounder = (user?: User | null): boolean => {
  if (!user) {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('nihomi_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?.email?.trim().toLowerCase() === FOUNDER_EMAIL || parsed?.role === 'founder';
        }
      }
    } catch {}
    return false;
  }
  return Boolean(
    user.email?.trim().toLowerCase() === FOUNDER_EMAIL ||
    user.role === 'founder'
  );
};

/**
 * Checks whether the current user has an active Pro or Japan Ready subscription,
 * or is the Founder / Admin.
 */
export const isProUser = (user?: User | null): boolean => {
  if (isFounder(user)) return true;
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'instructor') return true;

  const planId = (user.planId || '').toLowerCase();
  return planId === 'pro' || planId === 'japan_ready';
};

/**
 * Checks whether a specific lesson is part of the 100% Free tier (N5 Lessons 1 to 5).
 */
export const isLessonFreeTier = (lessonId?: string): boolean => {
  if (!lessonId) return true;
  const match = lessonId.match(/l0?([0-9]+)/i);
  if (!match) return false;
  const num = parseInt(match[1], 10);
  // Lessons 1 to 5 of N5 are 100% free
  return num <= 5;
};
