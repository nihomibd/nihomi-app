// src/components/canvas3d/engine/MemoryOSEngine.ts
// NIHOMI REAL JAPAN CANVAS™ — MEMORY-OS LEARNING ENGINE INTEGRATION
// Records meaningful student conversational attempts, polite Keigo slips, hesitation, and cultural friction.
// Feeds recorded events into SuperMemo-2 Spaced Repetition (SRS) queues, personalized coaching, and difficulty selection.

export interface MemoryOSInteractionLog {
  id: string;
  timestamp: string;
  locationId: string;
  locationName: string;
  targetRole: string;          // e.g. 'Store Manager (店長)'
  studentUtterance: string;    // e.g. 'バイトありますか？'
  isCorrectKeigo: boolean;
  keigoCategory: 'teineigo' | 'kenjougo' | 'sonkeigo' | 'casual';
  feedbackGiven: string;
  correctionPhrase: string;    // e.g. '「アルバイトの募集はありますか？」'
  recommendedSrsCardId?: string;
}

export class MemoryOSEngine {
  private static STORAGE_KEY = 'nihomi_memory_os_logs';

  /**
   * Records a learning interaction event and updates student friction metrics
   */
  public static logInteraction(log: Omit<MemoryOSInteractionLog, 'id' | 'timestamp'>): MemoryOSInteractionLog {
    const entry: MemoryOSInteractionLog = {
      ...log,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const updated = [entry, ...existing].slice(0, 50); // Keep last 50 logs
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('[MemoryOS] Error saving log to storage:', err);
      }
    }

    return entry;
  }

  /**
   * Retrieves recent conversational failure logs for active SRS review
   */
  public static getRecentFailureReviews(): MemoryOSInteractionLog[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const logs: MemoryOSInteractionLog[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return logs.filter((l) => !l.isCorrectKeigo);
    } catch {
      return [];
    }
  }

  /**
   * Computes student's Keigo proficiency index across recent in-world attempts
   */
  public static getKeigoProficiencyScore(): { scorePercent: number; totalAttempts: number } {
    if (typeof localStorage === 'undefined') return { scorePercent: 100, totalAttempts: 0 };
    try {
      const logs: MemoryOSInteractionLog[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      if (logs.length === 0) return { scorePercent: 100, totalAttempts: 0 };

      const passed = logs.filter((l) => l.isCorrectKeigo).length;
      return {
        scorePercent: Math.round((passed / logs.length) * 100),
        totalAttempts: logs.length
      };
    } catch {
      return { scorePercent: 100, totalAttempts: 0 };
    }
  }

  /**
   * SuperMemo-2 (SM-2) Spaced Repetition scheduling for phrase attempts
   */
  public recordAttempt(params: {
    phraseJa: string;
    meaningEn: string;
    jlptLevel: string;
    qualityScore: 0 | 1 | 2 | 3 | 4 | 5;
    studentInput: string;
  }): MemoryLogItem {
    const isSuccess = params.qualityScore >= 3;
    let intervalDays = 1;
    let easeFactor = 2.5;

    // SuperMemo-2 ease factor formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const q = params.qualityScore;
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

    if (q >= 4) {
      intervalDays = 6;
    } else if (q === 3) {
      intervalDays = 3;
    } else {
      intervalDays = 1;
    }

    const nextReviewTimestamp = Date.now() + intervalDays * 24 * 60 * 60 * 1000;

    const logItem: MemoryLogItem = {
      id: `srs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      phraseJa: params.phraseJa,
      meaningEn: params.meaningEn,
      jlptLevel: params.jlptLevel,
      qualityScore: params.qualityScore,
      easeFactor,
      intervalDays,
      nextReviewTimestamp,
      lastReviewedTimestamp: Date.now()
    };

    MemoryOSEngine.logInteraction({
      locationId: 'spatial_world',
      locationName: 'Shibuya Crossing',
      targetRole: 'Japanese Conversational Partner',
      studentUtterance: params.studentInput,
      isCorrectKeigo: isSuccess,
      keigoCategory: isSuccess ? 'teineigo' : 'casual',
      feedbackGiven: isSuccess ? 'Polite Japanese mastered' : 'Needs Keigo refinement',
      correctionPhrase: params.phraseJa
    });

    return logItem;
  }
}

export interface MemoryLogItem {
  id: string;
  phraseJa: string;
  meaningEn: string;
  jlptLevel: string;
  qualityScore: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewTimestamp: number;
  lastReviewedTimestamp: number;
}

export const memoryOS = new MemoryOSEngine();

