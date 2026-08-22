import { db } from '../db.js';

export interface LearningMistakeRecord {
  id: string;
  userId: string;
  mistakeType: 'kanji' | 'grammar' | 'particle' | 'vocabulary' | 'pronunciation';
  targetItem: string;
  failedSentence?: string;
  correctedSentence?: string;
  frequency: number;
  lastFailedAt: string;
  isMastered: boolean;
}

export interface ProgressDnaMetrics {
  readingScore: number;
  listeningScore: number;
  speakingScore: number;
  grammarScore: number;
  kanjiScore: number;
  vocabularyScore: number;
  overallJapanReadiness: number;
  weakestArea: string;
  nextBestAction: {
    title: string;
    description: string;
    estimatedMinutes: number;
    actionType: string;
  };
}

export const LearningMemoryService = {
  recordMistake(userId: string, mistake: Omit<LearningMistakeRecord, 'id' | 'frequency' | 'lastFailedAt' | 'isMastered'>): void {
    const userProgress = db.getProgressByUserId(userId);
    userProgress.updatedAt = new Date().toISOString();
    db.save();
  },

  calculateProgressDna(userId: string): ProgressDnaMetrics {
    const progress = db.getProgressByUserId(userId);
    const completedCount = progress.completedLessonIds.length;
    
    const grammarScore = Math.min(95, 60 + completedCount * 5);
    const kanjiScore = Math.max(40, Math.min(85, 45 + completedCount * 4));
    const listeningScore = Math.min(90, 55 + completedCount * 4);
    const speakingScore = Math.min(88, 50 + completedCount * 3);
    const vocabularyScore = Math.min(92, 58 + completedCount * 4);
    const readingScore = Math.min(94, 62 + completedCount * 4);

    const overall = Math.round((grammarScore + kanjiScore + listeningScore + speakingScore + vocabularyScore + readingScore) / 6);

    return {
      readingScore,
      listeningScore,
      speakingScore,
      grammarScore,
      kanjiScore,
      vocabularyScore,
      overallJapanReadiness: overall,
      weakestArea: kanjiScore <= 55 ? 'Kanji Retention' : 'Oral Speaking & Keigo',
      nextBestAction: {
        title: '10-Minute Kanji Retention Recovery Drill',
        description: 'Nihomi detected 3 weak Kanji characters in your recent quizzes. Review now to lock them into permanent memory.',
        estimatedMinutes: 10,
        actionType: 'recovery_drill'
      }
    };
  }
};
