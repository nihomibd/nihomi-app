import { KnowledgeObject } from './types';
import { ContentIngestionService } from './contentIngestionService';

export interface ContentQualitySignal {
  id: string;
  conceptCode: string;
  conceptTitle: string;
  level: string;
  failureRatePercent: number;
  totalAttemptsAnalyzed: number;
  rootCause: 'AMBIGUOUS_QUESTION' | 'INADEQUATE_EXPLANATION' | 'MISSING_PREREQUISITE' | 'MISALIGNED_DIFFICULTY';
  detectedPattern: string;
  suggestedPedagogicalFixBn: string;
  urgency: 'CRITICAL' | 'WARNING' | 'INFO';
  createdAt: string;
}

export class LearningFeedbackLoopService {
  private static signals: ContentQualitySignal[] = [
    {
      id: 'sig-001',
      conceptCode: 'NHM-N5-GR-004',
      conceptTitle: '〜てください vs 〜てくださいませんか (Polite Requests)',
      level: 'N5',
      failureRatePercent: 41.8,
      totalAttemptsAnalyzed: 1420,
      rootCause: 'INADEQUATE_EXPLANATION',
      detectedPattern: 'Students frequently confuse level of politeness when addressing senior colleagues.',
      suggestedPedagogicalFixBn: 'বাংলা ব্যাখ্যায় সিনিয়র ও জুনিয়রদের সাথে কথা বলার সময় কোন রূপটি ব্যবহার করতে হবে তা ছক আকারে তুলে ধরুন।',
      urgency: 'WARNING',
      createdAt: '2026-08-26T00:00:00Z',
    },
    {
      id: 'sig-002',
      conceptCode: 'NHM-N5-KJ-012',
      conceptTitle: 'Kanji: 行 (Go / Act / Line)',
      level: 'N5',
      failureRatePercent: 38.5,
      totalAttemptsAnalyzed: 980,
      rootCause: 'AMBIGUOUS_QUESTION',
      detectedPattern: 'Confusion between Onyomi (コウ / ギョウ) and Kunyomi (い・く / おこな・う) readings in sentence context.',
      suggestedPedagogicalFixBn: 'বাক্যের মধ্যে কোন রিডিংটি কখন বসে তার বাস্তব উদাহরণ যোগ করুন (যেমন: 銀行 vs 行きます)।',
      urgency: 'WARNING',
      createdAt: '2026-08-26T00:00:00Z',
    },
  ];

  static getSignals(): ContentQualitySignal[] {
    return this.signals;
  }

  static getSignalForConcept(conceptCodeOrText: string): ContentQualitySignal | undefined {
    return this.signals.find(
      (s) =>
        s.conceptCode.toLowerCase() === conceptCodeOrText.toLowerCase() ||
        conceptCodeOrText.toLowerCase().includes(s.conceptCode.toLowerCase()) ||
        s.conceptTitle.toLowerCase().includes(conceptCodeOrText.toLowerCase())
    );
  }

  static scheduleAdaptiveReviewQuiz(
    conceptCode: string,
    failureRate: number = 40
  ): {
    id: string;
    reviewQuizTitle: string;
    conceptCode: string;
    intervalDays: number;
    nextReviewDate: string;
    scheduledIn: string;
    pedagogicalFixBn: string;
    urgency: 'CRITICAL' | 'WARNING' | 'INFO';
  } {
    const signal = this.getSignalForConcept(conceptCode);
    const intervalDays = failureRate > 50 ? 1 : failureRate > 30 ? 2 : 4;
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + intervalDays);

    return {
      id: `rev-${Date.now()}-${conceptCode.slice(-4)}`,
      reviewQuizTitle: signal ? `Adaptive Mastery Review: ${signal.conceptTitle}` : `Targeted Recovery Quiz (${conceptCode})`,
      conceptCode,
      intervalDays,
      nextReviewDate: reviewDate.toISOString(),
      scheduledIn: intervalDays === 1 ? 'Tomorrow (in 24 hours)' : `In ${intervalDays} days`,
      pedagogicalFixBn: signal?.suggestedPedagogicalFixBn || 'কনসেপ্টটি রিভিশন দিন এবং পার্টিকেলের প্রয়োগ লক্ষ্য করুন।',
      urgency: signal?.urgency || (failureRate > 40 ? 'WARNING' : 'INFO'),
    };
  }

  static resolveSignal(signalId: string, resolutionNote?: string): boolean {
    this.signals = this.signals.filter((s) => s.id !== signalId);
    return true;
  }
}
