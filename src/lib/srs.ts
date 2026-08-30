// Spaced Repetition System (SRS) SM-2 / Leitner Algorithm Engine for Nihomi
import { supabase, isSupabaseConfigured } from './supabase.js';

export interface SrsItemState {
  id: string; // e.g. kanji character or vocab id
  itemType?: 'kanji' | 'vocabulary' | 'grammar';
  intervalDays: number;
  repetition: number;
  easeFactor: number;
  stabilityDays?: number;
  retentionScore?: number; // 0 - 100 %
  lapses?: number;
  lastReviewedAt: string; // ISO date string
  nextReviewAt: string; // ISO date string
  stage: 'apprentice' | 'guru' | 'master' | 'enlightened' | 'burned';
}

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

const SRS_STORAGE_KEY = 'nihomi_srs_state_v2';

/**
 * Calculates current retention percentage based on Ebbinghaus forgetting curve model
 * R(t) = exp(-t / S) * 100%
 */
export function calculateRetentionLevel(lastReviewedAt: string, stabilityDays: number = 1): number {
  if (!lastReviewedAt) return 100;
  const now = new Date().getTime();
  const last = new Date(lastReviewedAt).getTime();
  const elapsedDays = Math.max(0, (now - last) / (1000 * 60 * 60 * 24));
  const stability = Math.max(0.5, stabilityDays);
  const retention = Math.exp(-elapsedDays / stability) * 100;
  return Math.min(100, Math.max(5, Math.round(retention)));
}

export function getSrsState(): Record<string, SrsItemState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY) || localStorage.getItem('nihomi_srs_state_v1');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Enrich with dynamic retention scores
    Object.values(parsed as Record<string, SrsItemState>).forEach((item) => {
      item.retentionScore = calculateRetentionLevel(item.lastReviewedAt, item.stabilityDays || item.intervalDays || 1);
    });
    return parsed;
  } catch {
    return {};
  }
}

export function saveSrsItemReview(
  id: string,
  rating: SrsRating,
  currentState?: SrsItemState,
  itemType: 'kanji' | 'vocabulary' | 'grammar' = 'kanji'
): SrsItemState {
  const allStates = getSrsState();
  const prev = currentState || allStates[id] || {
    id,
    itemType,
    intervalDays: 0,
    repetition: 0,
    easeFactor: 2.5,
    stabilityDays: 1,
    retentionScore: 100,
    lapses: 0,
    lastReviewedAt: new Date().toISOString(),
    nextReviewAt: new Date().toISOString(),
    stage: 'apprentice'
  };

  let { intervalDays, repetition, easeFactor, lapses = 0 } = prev;
  const now = new Date();

  if (rating === 'again') {
    repetition = 0;
    intervalDays = 1; // 1 day
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    lapses += 1;
  } else if (rating === 'hard') {
    repetition = Math.max(1, repetition);
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (rating === 'good') {
    if (repetition === 0) {
      intervalDays = 1;
    } else if (repetition === 1) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetition += 1;
  } else if (rating === 'easy') {
    if (repetition === 0) {
      intervalDays = 3;
    } else if (repetition === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor * 1.3);
    }
    repetition += 1;
    easeFactor += 0.15;
  }

  // Stability corresponds to the interval where retention is ~90%
  const stabilityDays = Math.max(1, intervalDays * (easeFactor / 2.5));

  // Calculate Next Review Date
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + intervalDays);

  // Map to stage
  let stage: SrsItemState['stage'] = 'apprentice';
  if (intervalDays >= 30 || repetition >= 7) {
    stage = 'burned';
  } else if (intervalDays >= 14 || repetition >= 5) {
    stage = 'enlightened';
  } else if (intervalDays >= 7 || repetition >= 3) {
    stage = 'master';
  } else if (intervalDays >= 3 || repetition >= 2) {
    stage = 'guru';
  }

  const updatedItem: SrsItemState = {
    id,
    itemType: prev.itemType || itemType,
    intervalDays,
    repetition,
    easeFactor,
    stabilityDays,
    retentionScore: 100, // Just reviewed, 100% immediate recall
    lapses,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextDate.toISOString(),
    stage
  };

  allStates[id] = updatedItem;
  try {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(allStates));
  } catch {}

  // Sync asynchronously to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      Promise.resolve(
        supabase.from('student_srs_reviews').upsert({
          item_id: id,
          item_type: itemType,
          interval_days: intervalDays,
          repetition,
          ease_factor: easeFactor,
          stability_days: stabilityDays,
          stage,
          last_reviewed_at: now.toISOString(),
          next_review_at: nextDate.toISOString()
        })
      ).catch(() => {});
    } catch {}
  }

  return updatedItem;
}

export function getCardRetentionLevel(id: string): {
  score: number;
  stage: SrsItemState['stage'];
  isDue: boolean;
  statusLabel: string;
} {
  const allStates = getSrsState();
  const item = allStates[id];
  if (!item) {
    return {
      score: 100,
      stage: 'apprentice',
      isDue: true,
      statusLabel: 'New'
    };
  }
  const score = calculateRetentionLevel(item.lastReviewedAt, item.stabilityDays || item.intervalDays || 1);
  const due = isItemDue(item);
  let statusLabel = 'Optimal Recall';
  if (score < 60) statusLabel = 'Fading Fast';
  else if (score < 80) statusLabel = 'Review Recommended';

  return {
    score,
    stage: item.stage,
    isDue: due,
    statusLabel
  };
}

export function formatNextReviewBadge(itemState?: SrsItemState): {
  label: string;
  isDue: boolean;
  colorClass: string;
} {
  if (!itemState || !itemState.nextReviewAt) {
    return {
      label: 'নতুন (New Item)',
      isDue: true,
      colorClass: 'bg-stone-100 text-stone-700 border-stone-300'
    };
  }

  const now = new Date();
  const nextDate = new Date(itemState.nextReviewAt);
  const diffHours = (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours <= 0) {
    return {
      label: '⚠️ এখনই রিভিশন দিন (Due Now)',
      isDue: true,
      colorClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
    };
  }

  const diffDays = Math.ceil(diffHours / 24);
  if (diffDays === 1) {
    return {
      label: 'পরবর্তী রিভিশন: আগামীকাল (1d)',
      isDue: false,
      colorClass: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  }

  if (itemState.stage === 'burned' || itemState.stage === 'enlightened') {
    return {
      label: `মাস্টারড 🌟 (${diffDays} দিনে রিভিশন)`,
      isDue: false,
      colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    };
  }

  return {
    label: `পরবর্তী রিভিশন: ${diffDays} দিন পর`,
    isDue: false,
    colorClass: 'bg-blue-50 text-blue-800 border-blue-200'
  };
}

export function isItemDue(itemState?: SrsItemState): boolean {
  if (!itemState || !itemState.nextReviewAt) return true;
  const now = new Date();
  const nextDate = new Date(itemState.nextReviewAt);
  return nextDate.getTime() <= now.getTime();
}

export function getDueSrsItems(allCardIds?: string[]): {
  dueIds: string[];
  totalDueCount: number;
  stages: Record<'apprentice' | 'guru' | 'master' | 'enlightened' | 'burned', number>;
} {
  const allStates = getSrsState();
  const stages: Record<'apprentice' | 'guru' | 'master' | 'enlightened' | 'burned', number> = {
    apprentice: 0,
    guru: 0,
    master: 0,
    enlightened: 0,
    burned: 0
  };

  const dueIds: string[] = [];

  if (allCardIds && allCardIds.length > 0) {
    allCardIds.forEach((id) => {
      const state = allStates[id];
      if (isItemDue(state)) {
        dueIds.push(id);
      }
      if (state) {
        stages[state.stage] = (stages[state.stage] || 0) + 1;
      }
    });
  } else {
    Object.values(allStates).forEach((item) => {
      stages[item.stage] = (stages[item.stage] || 0) + 1;
      if (isItemDue(item)) {
        dueIds.push(item.id);
      }
    });
  }

  return {
    dueIds,
    totalDueCount: dueIds.length,
    stages
  };
}

export function getSrsSummaryStats(): {
  totalTracked: number;
  dueTodayCount: number;
  masteredCount: number;
  apprenticeCount: number;
  guruCount: number;
  masterCount: number;
  enlightenedCount: number;
  burnedCount: number;
} {
  const allStates = getSrsState();
  const values = Object.values(allStates);
  let dueToday = 0;
  let apprentice = 0;
  let guru = 0;
  let master = 0;
  let enlightened = 0;
  let burned = 0;

  values.forEach((st) => {
    if (isItemDue(st)) dueToday++;
    if (st.stage === 'apprentice') apprentice++;
    else if (st.stage === 'guru') guru++;
    else if (st.stage === 'master') master++;
    else if (st.stage === 'enlightened') enlightened++;
    else if (st.stage === 'burned') burned++;
  });

  return {
    totalTracked: values.length,
    dueTodayCount: dueToday,
    masteredCount: master + enlightened + burned,
    apprenticeCount: apprentice,
    guruCount: guru,
    masterCount: master,
    enlightenedCount: enlightened,
    burnedCount: burned
  };
}

export function getStageInfo(stage: SrsItemState['stage'] = 'apprentice'): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  switch (stage) {
    case 'burned':
      return {
        label: 'Burned',
        bgColor: 'bg-stone-900',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-400/40'
      };
    case 'enlightened':
      return {
        label: 'Enlightened',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-300'
      };
    case 'master':
      return {
        label: 'Master',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300'
      };
    case 'guru':
      return {
        label: 'Guru',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-300'
      };
    case 'apprentice':
    default:
      return {
        label: 'Apprentice',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-300'
      };
  }
}

export function getDueItemsCount(items?: { id: string }[]): number {
  const allStates = getSrsState();
  if (!items || items.length === 0) {
    return Object.values(allStates).filter(isItemDue).length;
  }
  return items.filter((item) => isItemDue(allStates[item.id])).length;
}

/**
 * Automatically schedules vocabulary and Kanji reviews based on user performance in lesson quizzes.
 * If user answers incorrectly, marks as 'again' (repetition reset, lapse added, ease factor reduced, scheduled for immediate/next-day review).
 * If user answers correctly, marks as 'good' or 'easy' (increasing interval and ease factor).
 */
export function recordQuizTermPerformance(
  id: string,
  isCorrect: boolean,
  metadata?: {
    word?: string;
    lessonNumber?: number;
    itemType?: 'vocabulary' | 'kanji' | 'grammar';
  }
): SrsItemState {
  const rating: SrsRating = isCorrect ? 'good' : 'again';
  const itemType = metadata?.itemType || 'vocabulary';
  return saveSrsItemReview(id, rating, undefined, itemType);
}

/**
 * Calculates optimal review metrics for a specific lesson based on all its vocabulary and kanji items.
 */
export function getLessonSrsReviewSummary(
  lessonNumber: number,
  vocabList?: { kanji: string; hiragana: string }[],
  kanjiList?: { kanji: string }[]
): {
  isReviewDue: boolean;
  dueItemCount: number;
  totalTracked: number;
  retentionAverage: number;
  nextOptimalReviewDate: Date | null;
  strugglingTerms: string[];
} {
  const allStates = getSrsState();
  const trackedItems: SrsItemState[] = [];
  const strugglingTerms: string[] = [];

  const checkItem = (id: string, label: string) => {
    const state = allStates[id];
    if (state) {
      trackedItems.push(state);
      if ((state.lapses && state.lapses > 0) || (state.retentionScore && state.retentionScore < 75)) {
        strugglingTerms.push(label);
      }
    }
  };

  if (vocabList) {
    vocabList.forEach((v) => {
      checkItem(`voc-n5-l${lessonNumber}-${v.kanji || v.hiragana}`, v.kanji || v.hiragana);
      checkItem(v.kanji || v.hiragana, v.kanji || v.hiragana);
    });
  }

  if (kanjiList) {
    kanjiList.forEach((k) => {
      checkItem(k.kanji, k.kanji);
      checkItem(`kanji-${k.kanji}`, k.kanji);
    });
  }

  if (trackedItems.length === 0) {
    return {
      isReviewDue: false,
      dueItemCount: 0,
      totalTracked: 0,
      retentionAverage: 100,
      nextOptimalReviewDate: null,
      strugglingTerms: []
    };
  }

  let dueCount = 0;
  let totalRetention = 0;
  let earliestDue: Date | null = null;

  trackedItems.forEach((item) => {
    const isDue = isItemDue(item);
    if (isDue) dueCount++;
    const ret = calculateRetentionLevel(item.lastReviewedAt, item.stabilityDays || item.intervalDays || 1);
    totalRetention += ret;

    const nextDate = new Date(item.nextReviewAt);
    if (!earliestDue || nextDate.getTime() < earliestDue.getTime()) {
      earliestDue = nextDate;
    }
  });

  return {
    isReviewDue: dueCount > 0,
    dueItemCount: dueCount,
    totalTracked: trackedItems.length,
    retentionAverage: Math.round(totalRetention / trackedItems.length),
    nextOptimalReviewDate: earliestDue,
    strugglingTerms: Array.from(new Set(strugglingTerms))
  };
}


