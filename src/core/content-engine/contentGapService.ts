import { JLPTLevel, ContentDomain } from '../../types/nihomi';
import { LevelCompletenessMetrics, ContentGapItem } from './types';

const LEVEL_METRICS: Record<JLPTLevel, LevelCompletenessMetrics> = {
  N5: {
    level: 'N5',
    totalKnowledgeObjects: 342,
    vocabularyCoveragePercent: 96,
    kanjiCoveragePercent: 100,
    grammarCoveragePercent: 98,
    readingCoveragePercent: 92,
    listeningCoveragePercent: 94,
    speakingCoveragePercent: 90,
    assessmentCoveragePercent: 95,
    overallCompletenessPercent: 96,
    totalPendingReviewCount: 3
  },
  N4: {
    level: 'N4',
    totalKnowledgeObjects: 288,
    vocabularyCoveragePercent: 88,
    kanjiCoveragePercent: 92,
    grammarCoveragePercent: 90,
    readingCoveragePercent: 84,
    listeningCoveragePercent: 86,
    speakingCoveragePercent: 82,
    assessmentCoveragePercent: 88,
    overallCompletenessPercent: 87,
    totalPendingReviewCount: 8
  },
  N3: {
    level: 'N3',
    totalKnowledgeObjects: 195,
    vocabularyCoveragePercent: 74,
    kanjiCoveragePercent: 78,
    grammarCoveragePercent: 80,
    readingCoveragePercent: 72,
    listeningCoveragePercent: 75,
    speakingCoveragePercent: 70,
    assessmentCoveragePercent: 76,
    overallCompletenessPercent: 75,
    totalPendingReviewCount: 14
  },
  N2: {
    level: 'N2',
    totalKnowledgeObjects: 110,
    vocabularyCoveragePercent: 55,
    kanjiCoveragePercent: 60,
    grammarCoveragePercent: 62,
    readingCoveragePercent: 50,
    listeningCoveragePercent: 54,
    speakingCoveragePercent: 48,
    assessmentCoveragePercent: 52,
    overallCompletenessPercent: 54,
    totalPendingReviewCount: 22
  },
  N1: {
    level: 'N1',
    totalKnowledgeObjects: 65,
    vocabularyCoveragePercent: 35,
    kanjiCoveragePercent: 40,
    grammarCoveragePercent: 42,
    readingCoveragePercent: 32,
    listeningCoveragePercent: 36,
    speakingCoveragePercent: 30,
    assessmentCoveragePercent: 34,
    overallCompletenessPercent: 35,
    totalPendingReviewCount: 31
  }
};

const DEFAULT_GAPS: ContentGapItem[] = [
  {
    id: 'gap-01',
    level: 'N5',
    domain: 'GRAMMAR',
    missingConcept: 'Particle で (Means / Method & Location of Action)',
    gapType: 'MISSING_EXEMPLARS',
    reason: 'Needs 4 additional Tokyo transport exemplar sentences with Bangla context.',
    priority: 'HIGH',
    detectedAt: '2026-08-24T06:00:00.000Z',
    recommendedAction: 'Extract Minna no Nihongo Lesson 5 Grammar section.'
  },
  {
    id: 'gap-02',
    level: 'N5',
    domain: 'CONVERSATION',
    missingConcept: 'Convenience Store (Conbini) Payment & Point Card Interaction',
    gapType: 'MISSING_BANGLA_TRANSLATION',
    reason: 'Add Bengali culturally calibrated notes regarding 7-Eleven cashless transactions.',
    priority: 'MEDIUM',
    detectedAt: '2026-08-23T14:30:00.000Z',
    recommendedAction: 'Generate Tokyo Life Survival dialogue module.'
  },
  {
    id: 'gap-03',
    level: 'N4',
    domain: 'GRAMMAR',
    missingConcept: 'Causative Form (使役形 〜せる / 〜させる)',
    gapType: 'MISSING_ASSESSMENT',
    reason: 'Diagnostic quiz questions count is below the minimum threshold of 8 items.',
    priority: 'HIGH',
    detectedAt: '2026-08-25T02:15:00.000Z',
    recommendedAction: 'Author 6 Minna no Nihongo Lesson 48 scenario-based quiz questions.'
  },
  {
    id: 'gap-04',
    level: 'N3',
    domain: 'INTERVIEW',
    missingConcept: 'IT Engineer Visa Technical Self-PR (自己PR) in Keigo',
    gapType: 'LOW_QUALITY_SCORE',
    reason: 'Audio pronunciation pitch accent data requires Tokyo native re-calibration.',
    priority: 'HIGH',
    detectedAt: '2026-08-24T18:45:00.000Z',
    recommendedAction: 'Re-synthesize audio with Tokyo standard pitch contour.'
  }
];

export const ContentGapService = {
  getLevelCompleteness(level: JLPTLevel): LevelCompletenessMetrics {
    return LEVEL_METRICS[level] || LEVEL_METRICS.N5;
  },

  getContentGaps(): ContentGapItem[] {
    return [...DEFAULT_GAPS];
  }
};
