// Spaced Repetition System (SRS) Vocabulary Service for Nihomi Student Portal
// Implements SuperMemo SM-2 & 5-Box Leitner interval algorithms with Supabase sync
import { supabase, isSupabaseConfigured } from './supabase';
import { calculateRetentionLevel, SrsItemState, SrsRating } from './srs';

export interface LessonVocabItem {
  id: string;
  word: string;
  reading: string;
  romaji?: string;
  meaningEn: string;
  meaningBn: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  lessonId: string;
  lessonTitle?: string;
  partOfSpeech?: string;
  exampleSentenceJa?: string;
  exampleSentenceBn?: string;
}

export interface VocabSrsRecord extends SrsItemState {
  vocabId: string;
  word: string;
  reading: string;
  meaningEn: string;
  meaningBn: string;
  jlptLevel: string;
  lessonId: string;
  leitnerBox: 1 | 2 | 3 | 4 | 5;
  retentionRatePercent: number; // 0 - 100
  totalReviews: number;
  consecutiveCorrect: number;
  history: {
    reviewedAt: string;
    rating: SrsRating;
    intervalDays: number;
  }[];
}

const LESSON_VOCAB_STORAGE_KEY = 'nihomi_lesson_vocab_srs_records_v1';
const PENDING_SYNC_QUEUE_KEY = 'nihomi_srs_sync_queue_v1';
const LAST_SYNC_TIMESTAMP_KEY = 'nihomi_last_db_sync_time_v1';

// Pre-seeded core lesson vocabulary for active review
export const FOUNDATIONAL_LESSON_VOCAB: LessonVocabItem[] = [
  {
    id: 'voc-n5-01',
    word: 'わたし',
    reading: 'わたし (watashi)',
    romaji: 'watashi',
    meaningEn: 'I, Me, Myself',
    meaningBn: 'আমি / নিজে',
    jlptLevel: 'N5',
    lessonId: 'n5-l01',
    lessonTitle: 'Lesson 1: Self Introductions & は Particle',
    partOfSpeech: 'Pronoun',
    exampleSentenceJa: 'わたしは がくせいです。',
    exampleSentenceBn: 'আমি একজন ছাত্র।'
  },
  {
    id: 'voc-n5-02',
    word: 'がくせい',
    reading: 'がくせい (gakusei)',
    romaji: 'gakusei',
    meaningEn: 'Student',
    meaningBn: 'ছাত্র / শিক্ষার্থী',
    jlptLevel: 'N5',
    lessonId: 'n5-l01',
    lessonTitle: 'Lesson 1: Self Introductions & は Particle',
    partOfSpeech: 'Noun',
    exampleSentenceJa: 'たなかさんは がくせいですか。',
    exampleSentenceBn: 'তানাকা সান কি একজন ছাত্র?'
  },
  {
    id: 'voc-n5-03',
    word: 'せんせい',
    reading: 'せんせい (sensei)',
    romaji: 'sensei',
    meaningEn: 'Teacher / Instructor',
    meaningBn: 'শিক্ষক / ওস্তাদ',
    jlptLevel: 'N5',
    lessonId: 'n5-l01',
    lessonTitle: 'Lesson 1: Self Introductions & は Particle',
    partOfSpeech: 'Noun',
    exampleSentenceJa: 'ラザク先生は 日本語の先生です。',
    exampleSentenceBn: 'রাজ্জাক স্যার জাপানি ভাষার শিক্ষক।'
  },
  {
    id: 'voc-n5-04',
    word: 'これ',
    reading: 'これ (kore)',
    romaji: 'kore',
    meaningEn: 'This (near speaker)',
    meaningBn: 'এই / এটি (বক্তার কাছে)',
    jlptLevel: 'N5',
    lessonId: 'n5-l02',
    lessonTitle: 'Lesson 2: Demonstratives これ・それ・あれ',
    partOfSpeech: 'Demonstrative',
    exampleSentenceJa: 'これは わたしの 本です。',
    exampleSentenceBn: 'এটি আমার বই।'
  },
  {
    id: 'voc-n5-05',
    word: 'ほん',
    reading: 'ほん (hon)',
    romaji: 'hon',
    meaningEn: 'Book',
    meaningBn: 'বই / পুস্তক',
    jlptLevel: 'N5',
    lessonId: 'n5-l02',
    lessonTitle: 'Lesson 2: Demonstratives これ・それ・あれ',
    partOfSpeech: 'Noun',
    exampleSentenceJa: '日本語の 本を 読みます。',
    exampleSentenceBn: 'জাপানি ভাষার বই পড়ি।'
  },
  {
    id: 'voc-n5-06',
    word: 'いきます',
    reading: 'いきます (ikimasu)',
    romaji: 'ikimasu',
    meaningEn: 'To go / Proceed',
    meaningBn: 'যাওয়া / গমন করা',
    jlptLevel: 'N5',
    lessonId: 'n5-l03',
    lessonTitle: 'Lesson 3: Movement & Places (へ / に)',
    partOfSpeech: 'Verb',
    exampleSentenceJa: 'とうきょうへ いきます。',
    exampleSentenceBn: 'টোকিও যাব।'
  },
  {
    id: 'voc-n5-07',
    word: 'たべます',
    reading: 'たべます (tabemasu)',
    romaji: 'tabemasu',
    meaningEn: 'To eat / Consume food',
    meaningBn: 'খাওয়া / আহার করা',
    jlptLevel: 'N5',
    lessonId: 'n5-l04',
    lessonTitle: 'Lesson 4: Daily Actions & を Particle',
    partOfSpeech: 'Verb',
    exampleSentenceJa: 'あさごはんを たべます。',
    exampleSentenceBn: 'সকালের নাস্তা খাই।'
  },
  {
    id: 'voc-n5-08',
    word: 'べんきょう',
    reading: 'べんきょう (benkyou)',
    romaji: 'benkyou',
    meaningEn: 'Study / Diligence',
    meaningBn: 'পড়াশোনা / অধ্যয়ন',
    jlptLevel: 'N5',
    lessonId: 'n5-l05',
    lessonTitle: 'Lesson 5: Time Expressions & Study Habits',
    partOfSpeech: 'Noun',
    exampleSentenceJa: 'まいばん 日本語を べんきょうします。',
    exampleSentenceBn: 'প্রতি রাতে জাপানি ভাষা পড়াশোনা করি।'
  }
];

export class SrsVocabularyService {
  /**
   * Retrieves all vocabulary SRS records from local storage, initialized with defaults if empty.
   */
  static getAllVocabRecords(): Record<string, VocabSrsRecord> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(LESSON_VOCAB_STORAGE_KEY);
      let records: Record<string, VocabSrsRecord> = raw ? JSON.parse(raw) : {};

      // Auto seed if empty
      if (Object.keys(records).length === 0) {
        records = {};
        const now = new Date().toISOString();
        FOUNDATIONAL_LESSON_VOCAB.forEach((item, idx) => {
          // Stagger initial review intervals for realistic learning curve
          const box = (idx % 3 + 1) as 1 | 2 | 3;
          const intervalDays = box === 1 ? 1 : box === 2 ? 3 : 7;
          const reviewDate = new Date();
          if (idx === 0 || idx === 1) {
            reviewDate.setHours(reviewDate.getHours() - 2); // Due now
          } else {
            reviewDate.setDate(reviewDate.getDate() + intervalDays);
          }

          records[item.id] = {
            id: item.id,
            vocabId: item.id,
            itemType: 'vocabulary',
            word: item.word,
            reading: item.reading,
            meaningEn: item.meaningEn,
            meaningBn: item.meaningBn,
            jlptLevel: item.jlptLevel,
            lessonId: item.lessonId,
            intervalDays,
            repetition: box,
            easeFactor: 2.5,
            stabilityDays: intervalDays,
            retentionRatePercent: 92,
            lapses: 0,
            totalReviews: box,
            consecutiveCorrect: box,
            leitnerBox: box,
            lastReviewedAt: now,
            nextReviewAt: reviewDate.toISOString(),
            stage: box === 1 ? 'apprentice' : box === 2 ? 'guru' : 'master',
            history: [
              {
                reviewedAt: now,
                rating: 'good',
                intervalDays
              }
            ]
          };
        });
        localStorage.setItem(LESSON_VOCAB_STORAGE_KEY, JSON.stringify(records));
      }

      // Update dynamic retention rates based on Ebbinghaus decay
      Object.values(records).forEach((r) => {
        r.retentionRatePercent = calculateRetentionLevel(r.lastReviewedAt, r.stabilityDays || r.intervalDays || 1);
      });

      return records;
    } catch {
      return {};
    }
  }

  /**
   * Alias for getAllVocabRecords for unified SRS query access.
   */
  static getAllSrsRecords(): Record<string, VocabSrsRecord> {
    return this.getAllVocabRecords();
  }

  /**
   * Registers new vocabulary words learned in a lesson into the SRS queue.
   */
  static registerLessonVocab(vocabItems: LessonVocabItem[], userId?: string): void {
    const existing = this.getAllVocabRecords();
    const now = new Date();

    vocabItems.forEach((v) => {
      if (!existing[v.id]) {
        const nextDue = new Date(now);
        // Due for initial 24h reinforcement
        nextDue.setDate(now.getDate() + 1);

        existing[v.id] = {
          id: v.id,
          vocabId: v.id,
          itemType: 'vocabulary',
          word: v.word,
          reading: v.reading,
          meaningEn: v.meaningEn,
          meaningBn: v.meaningBn,
          jlptLevel: v.jlptLevel,
          lessonId: v.lessonId,
          intervalDays: 1,
          repetition: 0,
          easeFactor: 2.5,
          stabilityDays: 1,
          retentionRatePercent: 100,
          lapses: 0,
          totalReviews: 0,
          consecutiveCorrect: 0,
          leitnerBox: 1,
          lastReviewedAt: now.toISOString(),
          nextReviewAt: nextDue.toISOString(),
          stage: 'apprentice',
          history: []
        };
      }
    });

    try {
      localStorage.setItem(LESSON_VOCAB_STORAGE_KEY, JSON.stringify(existing));
    } catch {}

    if (userId) {
      this.syncPendingRecordsToSupabase(userId).catch(() => {});
    }
  }

  /**
   * Calculates new review intervals using SuperMemo SM-2 & Leitner Box algorithm.
   */
  static reviewVocabulary(
    vocabId: string,
    rating: SrsRating,
    userId?: string
  ): VocabSrsRecord {
    const all = this.getAllVocabRecords();
    const current = all[vocabId] || {
      id: vocabId,
      vocabId,
      itemType: 'vocabulary' as const,
      word: '言葉',
      reading: 'ことば',
      meaningEn: 'Word',
      meaningBn: 'শব্দ',
      jlptLevel: 'N5',
      lessonId: 'general',
      intervalDays: 0,
      repetition: 0,
      easeFactor: 2.5,
      stabilityDays: 1,
      retentionRatePercent: 100,
      lapses: 0,
      totalReviews: 0,
      consecutiveCorrect: 0,
      leitnerBox: 1 as const,
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: new Date().toISOString(),
      stage: 'apprentice' as const,
      history: []
    };

    let {
      intervalDays,
      repetition,
      easeFactor,
      lapses = 0,
      consecutiveCorrect = 0,
      totalReviews = 0,
      leitnerBox = 1
    } = current;

    totalReviews += 1;
    const now = new Date();

    if (rating === 'again') {
      // Lapse: drop back to Box 1 and interval 1 day
      repetition = 0;
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      lapses += 1;
      consecutiveCorrect = 0;
      leitnerBox = 1;
    } else if (rating === 'hard') {
      repetition = Math.max(1, repetition);
      intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      consecutiveCorrect += 1;
      leitnerBox = Math.min(5, Math.max(1, leitnerBox)) as any;
    } else if (rating === 'good') {
      if (repetition === 0) {
        intervalDays = 1;
      } else if (repetition === 1) {
        intervalDays = 3;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      repetition += 1;
      consecutiveCorrect += 1;
      leitnerBox = Math.min(5, (leitnerBox + 1)) as any;
    } else if (rating === 'easy') {
      if (repetition === 0) {
        intervalDays = 3;
      } else if (repetition === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor * 1.35);
      }
      repetition += 1;
      consecutiveCorrect += 1;
      easeFactor += 0.15;
      leitnerBox = Math.min(5, (leitnerBox + 1)) as any;
    }

    const stabilityDays = Math.max(1, intervalDays * (easeFactor / 2.5));
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + intervalDays);

    let stage: VocabSrsRecord['stage'] = 'apprentice';
    if (intervalDays >= 30 || leitnerBox === 5) {
      stage = 'burned';
    } else if (intervalDays >= 14 || leitnerBox === 4) {
      stage = 'enlightened';
    } else if (intervalDays >= 7 || leitnerBox === 3) {
      stage = 'master';
    } else if (intervalDays >= 3 || leitnerBox === 2) {
      stage = 'guru';
    }

    const updated: VocabSrsRecord = {
      ...current,
      intervalDays,
      repetition,
      easeFactor,
      stabilityDays,
      retentionRatePercent: 100,
      lapses,
      totalReviews,
      consecutiveCorrect,
      leitnerBox: leitnerBox as 1 | 2 | 3 | 4 | 5,
      stage,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextDate.toISOString(),
      history: [
        ...(current.history || []).slice(-9),
        {
          reviewedAt: now.toISOString(),
          rating,
          intervalDays
        }
      ]
    };

    all[vocabId] = updated;
    try {
      localStorage.setItem(LESSON_VOCAB_STORAGE_KEY, JSON.stringify(all));
      this.enqueuePendingSync(updated);
    } catch {}

    // Synchronize to Supabase
    if (userId) {
      this.syncRecordToSupabase(updated, userId).catch(() => {});
    }

    return updated;
  }

  /**
   * Retrieves vocabulary due for review right now.
   */
  static getDueVocabItems(): VocabSrsRecord[] {
    const all = Object.values(this.getAllVocabRecords());
    const now = new Date().getTime();
    return all.filter((item) => {
      if (!item.nextReviewAt) return true;
      return new Date(item.nextReviewAt).getTime() <= now;
    });
  }

  /**
   * Returns SRS retention stats for the Learning Analytics dashboard.
   */
  static getRetentionAnalytics(): {
    overallRetentionPercent: number;
    totalVocabTracked: number;
    dueCount: number;
    masteredCount: number;
    apprenticeCount: number;
    retentionDecayCurve: { day: number; retention: number; idealRetention: number }[];
    boxDistribution: { box: string; count: number; name: string }[];
  } {
    const all = Object.values(this.getAllVocabRecords());
    const total = all.length || 1;

    let totalRetention = 0;
    let due = 0;
    let mastered = 0;
    let apprentice = 0;
    const boxCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    all.forEach((item) => {
      const ret = item.retentionRatePercent || calculateRetentionLevel(item.lastReviewedAt, item.stabilityDays || 1);
      totalRetention += ret;
      if (new Date(item.nextReviewAt).getTime() <= Date.now()) due += 1;
      if (item.leitnerBox >= 4) mastered += 1;
      if (item.leitnerBox === 1) apprentice += 1;
      boxCounts[item.leitnerBox] = (boxCounts[item.leitnerBox] || 0) + 1;
    });

    const averageRetention = Math.round(totalRetention / total);

    // Theoretical vs actual Ebbinghaus forgetting curve across 14 days
    const decayCurve = Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const decay = Math.round(Math.exp(-day / 5.2) * 100);
      const idealWithSRS = Math.min(98, Math.max(72, Math.round(98 - (day * 1.5))));
      return {
        day: `Day ${day}`,
        retention: decay,
        idealRetention: idealWithSRS
      } as any;
    });

    const boxDistribution = [
      { box: 'Box 1', name: 'Daily (1d)', count: boxCounts[1] || 0 },
      { box: 'Box 2', name: '3 Days', count: boxCounts[2] || 0 },
      { box: 'Box 3', name: 'Weekly (7d)', count: boxCounts[3] || 0 },
      { box: 'Box 4', name: 'Bi-Weekly (14d)', count: boxCounts[4] || 0 },
      { box: 'Box 5', name: 'Mastered (30d+)', count: boxCounts[5] || 0 },
    ];

    return {
      overallRetentionPercent: averageRetention,
      totalVocabTracked: all.length,
      dueCount: due,
      masteredCount: mastered,
      apprenticeCount: apprentice,
      retentionDecayCurve: decayCurve,
      boxDistribution
    };
  }

  // --- Offline Sync Queue and Supabase Persistence ---

  private static enqueuePendingSync(record: VocabSrsRecord): void {
    try {
      const raw = localStorage.getItem(PENDING_SYNC_QUEUE_KEY);
      const queue: Record<string, VocabSrsRecord> = raw ? JSON.parse(raw) : {};
      queue[record.vocabId] = record;
      localStorage.setItem(PENDING_SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch {}
  }

  static async syncRecordToSupabase(record: VocabSrsRecord, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    try {
      const { error } = await supabase
        .from('student_srs_reviews')
        .upsert({
          user_id: userId,
          item_id: record.vocabId,
          item_type: 'vocabulary',
          interval_days: record.intervalDays,
          repetition: record.repetition,
          ease_factor: record.easeFactor,
          stability_days: record.stabilityDays,
          stage: record.stage,
          last_reviewed_at: record.lastReviewedAt,
          next_review_at: record.nextReviewAt,
          metadata: {
            word: record.word,
            reading: record.reading,
            meaningEn: record.meaningEn,
            meaningBn: record.meaningBn,
            leitnerBox: record.leitnerBox,
            jlptLevel: record.jlptLevel
          }
        }, { onConflict: 'user_id,item_id' });

      if (!error) {
        localStorage.setItem(LAST_SYNC_TIMESTAMP_KEY, new Date().toISOString());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static async syncPendingRecordsToSupabase(userId: string): Promise<{ success: boolean; syncedCount: number }> {
    if (!isSupabaseConfigured()) return { success: false, syncedCount: 0 };
    try {
      const raw = localStorage.getItem(PENDING_SYNC_QUEUE_KEY);
      if (!raw) return { success: true, syncedCount: 0 };
      const queue: Record<string, VocabSrsRecord> = JSON.parse(raw);
      const records = Object.values(queue);
      if (records.length === 0) return { success: true, syncedCount: 0 };

      const payload = records.map((r) => ({
        user_id: userId,
        item_id: r.vocabId,
        item_type: 'vocabulary',
        interval_days: r.intervalDays,
        repetition: r.repetition,
        ease_factor: r.easeFactor,
        stability_days: r.stabilityDays,
        stage: r.stage,
        last_reviewed_at: r.lastReviewedAt,
        next_review_at: r.nextReviewAt,
        metadata: {
          word: r.word,
          reading: r.reading,
          meaningEn: r.meaningEn,
          meaningBn: r.meaningBn,
          leitnerBox: r.leitnerBox,
          jlptLevel: r.jlptLevel
        }
      }));

      const { error } = await supabase
        .from('student_srs_reviews')
        .upsert(payload, { onConflict: 'user_id,item_id' });

      if (!error) {
        localStorage.removeItem(PENDING_SYNC_QUEUE_KEY);
        localStorage.setItem(LAST_SYNC_TIMESTAMP_KEY, new Date().toISOString());
        return { success: true, syncedCount: records.length };
      }
      return { success: false, syncedCount: 0 };
    } catch {
      return { success: false, syncedCount: 0 };
    }
  }

  static getLastSyncTimestamp(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LAST_SYNC_TIMESTAMP_KEY) || null;
  }

  static getPendingSyncCount(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(PENDING_SYNC_QUEUE_KEY);
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length;
    } catch {
      return 0;
    }
  }
}
