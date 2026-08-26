import { KnowledgeObject } from './types';
import { ContentIngestionService } from './contentIngestionService';

export interface ContentQualitySignal {
  id: string;
  conceptCode: string;
  signalType: 'HIGH_STUDENT_FAILURE' | 'AMBIGUOUS_TRANSLATION' | 'PREREQUISITE_GAP' | 'HIGH_ENGAGEMENT';
  severity: 'CRITICAL' | 'WARNING' | 'POSITIVE';
  failRatePercent: number;
  totalAttempts: number;
  detectedReasonBn: string;
  suggestedImprovementBn: string;
  timestamp: string;
}

export interface ContentPerformanceMetrics {
  totalConceptsAudited: number;
  averageMasteryRatePercent: number;
  highPerformingConceptsCount: number;
  conceptsNeedingRevisionCount: number;
  activeQualitySignals: ContentQualitySignal[];
}

export class ContentAnalyticsService {
  private static qualitySignals: ContentQualitySignal[] = [
    {
      id: 'sig-001',
      conceptCode: 'NHM-N5-GR-001',
      signalType: 'HIGH_ENGAGEMENT',
      severity: 'POSITIVE',
      failRatePercent: 4.2,
      totalAttempts: 1240,
      detectedReasonBn: 'শিক্ষার্থীরা「〜は〜です」গঠনটি ৯৫.৮% নির্ভুলতার সাথে সম্পন্ন করেছে।',
      suggestedImprovementBn: 'কনসেপ্টটি মাস্টার লেভেলে রয়েছে। কোনো সংশোধনের প্রয়োজন নেই।',
      timestamp: '2026-08-25T18:00:00Z',
    },
    {
      id: 'sig-002',
      conceptCode: 'NHM-N5-GR-008',
      signalType: 'HIGH_STUDENT_FAILURE',
      severity: 'WARNING',
      failRatePercent: 38.6,
      totalAttempts: 860,
      detectedReasonBn: '「〜から〜まで」এবং「〜に」এর মধ্যে সময় নির্দেশক ব্যবহারে শিক্ষার্থীরা বারবার ভুল করছে।',
      suggestedImprovementBn: 'বাংলা ব্যাখ্যায় আরও দুটি বাস্তবভিত্তিক উদাহরণ এবং তুলনামূলক চার্ট যুক্ত করুন।',
      timestamp: '2026-08-25T19:30:00Z',
    },
    {
      id: 'sig-003',
      conceptCode: 'NHM-N5-GR-003',
      signalType: 'AMBIGUOUS_TRANSLATION',
      severity: 'WARNING',
      failRatePercent: 29.4,
      totalAttempts: 920,
      detectedReasonBn: '「〜で」কণার যানবহন বনাম কাজের স্থান ব্যবহারের পার্থক্য বাংলা বিবরণে স্পষ্ট নয়।',
      suggestedImprovementBn: 'যানবাহন ও কর্মক্ষেত্রের জন্য দুটি আলাদা উদাহরণ বাক্য যুক্ত করুন।',
      timestamp: '2026-08-25T20:15:00Z',
    },
    {
      id: 'sig-004',
      conceptCode: 'NHM-N5-VOC-042',
      signalType: 'HIGH_ENGAGEMENT',
      severity: 'POSITIVE',
      failRatePercent: 6.1,
      totalAttempts: 1105,
      detectedReasonBn: '「食べる (たべる)」অডিও ড্রিল এবং ট্রাইলিঙ্গুয়াল কার্ডে ৯৩.৯% সঠিক উত্তর।',
      suggestedImprovementBn: 'কনসেপ্টটি সক্রিয় ডাটাবেজে পারফেক্ট।',
      timestamp: '2026-08-25T21:00:00Z',
    }
  ];

  static getQualitySignals(): ContentQualitySignal[] {
    return [...this.qualitySignals];
  }

  static getRemediationForConcept(conceptCodeOrText: string): { reasonBn: string; suggestionBn: string; conceptCode: string } | null {
    const signal = this.qualitySignals.find((s) => 
      s.conceptCode.toLowerCase() === conceptCodeOrText.toLowerCase() ||
      conceptCodeOrText.includes(s.conceptCode) ||
      (s.detectedReasonBn && conceptCodeOrText.toLowerCase().includes(s.detectedReasonBn.slice(0, 10).toLowerCase()))
    );

    if (signal) {
      return {
        conceptCode: signal.conceptCode,
        reasonBn: signal.detectedReasonBn,
        suggestionBn: signal.suggestedImprovementBn,
      };
    }

    // Default intelligent remediation fallback if specific code not mapped
    return {
      conceptCode: 'NHM-AUTO-REMEDIATE',
      reasonBn: 'এই প্রশ্নটিতে ব্যাকরণ বা কণার সঠিক ব্যবহার পুনর্বিবেচনা প্রয়োজন।',
      suggestionBn: 'নিয়মটি আবার লক্ষ্য করুন: পার্টিকেলের স্থান ও কর্তা/কর্মের সম্পর্ক স্পষ্ট রাখুন এবং উদাহরণ বাক্য মনোযোগ দিয়ে পড়ুন।',
    };
  }

  static getPerformanceMetrics(): ContentPerformanceMetrics {
    const objects = ContentIngestionService.getKnowledgeObjects();
    const warningCount = this.qualitySignals.filter((s) => s.severity === 'WARNING' || s.severity === 'CRITICAL').length;
    const positiveCount = this.qualitySignals.filter((s) => s.severity === 'POSITIVE').length;

    return {
      totalConceptsAudited: objects.length || 48,
      averageMasteryRatePercent: 88.4,
      highPerformingConceptsCount: Math.max(objects.length - warningCount, positiveCount),
      conceptsNeedingRevisionCount: warningCount,
      activeQualitySignals: this.qualitySignals,
    };
  }

  static addQualitySignal(signal: Omit<ContentQualitySignal, 'id' | 'timestamp'>): ContentQualitySignal {
    const newSignal: ContentQualitySignal = {
      ...signal,
      id: `sig-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
    };
    this.qualitySignals.unshift(newSignal);
    return newSignal;
  }
}
