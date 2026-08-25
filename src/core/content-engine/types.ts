import { JLPTLevel, ContentDomain } from '../../types/nihomi';

export type ContentLifecycleStage =
  | 'UPLOADED'
  | 'INGESTING'
  | 'EXTRACTING'
  | 'CLASSIFYING'
  | 'NORMALIZING'
  | 'STRUCTURING'
  | 'AI_GENERATED'
  | 'AI_VALIDATED'
  | 'NIHOMI_STANDARD_CHECK'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'VERSIONED'
  | 'ANALYZED'
  | 'IMPROVED';

export type PublicationStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'REJECTED'
  | 'SUPERSEDED';

export type KnowledgeObjectType =
  | 'VOCABULARY'
  | 'KANJI'
  | 'GRAMMAR'
  | 'SENTENCE'
  | 'DIALOGUE'
  | 'READING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'QUIZ'
  | 'EXERCISE'
  | 'SCENARIO'
  | 'LESSON'
  | 'SKILL';

export interface SourceTraceability {
  sourceDocumentId: string;
  sourceDocumentTitle: string;
  sourceAuthor?: string;
  sourcePublisher?: string;
  sourceEdition?: string;
  sourcePage: number;
  sourceSection?: string;
  sourceTextSnippet: string;
  sourceHash: string;
  extractionTimestamp: string;
  processingVersion: string;
  copyrightLicense: 'PUBLIC_DOMAIN' | 'ORIGINAL_PROPRIETARY' | 'ACADEMIC_FAIR_USE' | 'RIGHTS_REVIEW_REQUIRED';
}

export interface NihomiStandardEvaluation {
  evaluatedAt: string;
  overallScore: number;
  passed: boolean;
  requiresHumanReview: boolean;
  dimensions: {
    accuracy: number;
    sourceTraceability: number;
    japaneseLinguisticCorrectness: number;
    jlptRelevance: number;
    vocabularyCorrectness: number;
    kanjiCorrectness: number;
    grammarCorrectness: number;
    furiganaCorrectness: number;
    pronunciationCorrectness: number;
    banglaTranslationQuality: number;
    englishTranslationQuality: number;
    japaneseExplanationQuality: number;
    contextualAccuracy: number;
    difficultyLevelCalibration: number;
    duplicateDetection: number;
    contentCompleteness: number;
    learningUsefulness: number;
    pedagogicalQuality: number;
    formattingQuality: number;
    brandingConsistency: number;
    safetyContentCheck: number;
    versionIntegrity: number;
    humanReviewState: number;
  };
  violations: {
    ruleId: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    suggestedFix?: string;
  }[];
  reviewNotes?: string;
}

export interface TrilingualContent {
  ja: {
    text: string;
    furigana: string;
    romaji: string;
    explanationJa?: string;
  };
  en: {
    meaning: string;
    explanationEn: string;
    nuanceNotes?: string;
  };
  bn: {
    meaning: string;
    explanationBn: string;
    culturalContextBn?: string;
  };
}

export interface BaseKnowledgeObject {
  id: string;
  code: string;
  type: KnowledgeObjectType;
  level: JLPTLevel;
  domain: ContentDomain;
  lifecycleStage: ContentLifecycleStage;
  status: PublicationStatus;
  version: number;
  previousVersionId?: string;
  sourceTraceability: SourceTraceability;
  qualityEvaluation: NihomiStandardEvaluation;
  prerequisites: string[];
  tags: string[];
  tenantId?: string;
  createdBy: string;
  updatedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface GrammarObject extends BaseKnowledgeObject {
  type: 'GRAMMAR';
  pattern: string;
  formula: string;
  trilingual: TrilingualContent;
  exampleSentences: {
    ja: string;
    furigana: string;
    romaji: string;
    en: string;
    bn: string;
  }[];
  commonMistakes: {
    incorrect: string;
    correct: string;
    reasonBn: string;
  }[];
}

export interface VocabularyObject extends BaseKnowledgeObject {
  type: 'VOCABULARY';
  word: string;
  kanji?: string;
  reading: string;
  partOfSpeech: string;
  trilingual: TrilingualContent;
  exampleSentences: {
    ja: string;
    furigana: string;
    romaji: string;
    en: string;
    bn: string;
  }[];
  synonyms: string[];
  antonyms: string[];
  commonMistakes: string[];
}

export interface KanjiObject extends BaseKnowledgeObject {
  type: 'KANJI';
  kanji: string;
  strokes: number;
  radical: string;
  radicalMeaning: string;
  onyomi: string[];
  kunyomi: string[];
  trilingual: TrilingualContent;
  compounds: {
    word: string;
    reading: string;
    meaningEn: string;
    meaningBn: string;
  }[];
}

export type KnowledgeObject =
  | VocabularyObject
  | KanjiObject
  | GrammarObject;

export interface LevelCompletenessMetrics {
  level: JLPTLevel;
  totalKnowledgeObjects: number;
  vocabularyCoveragePercent: number;
  kanjiCoveragePercent: number;
  grammarCoveragePercent: number;
  readingCoveragePercent: number;
  listeningCoveragePercent: number;
  speakingCoveragePercent: number;
  assessmentCoveragePercent: number;
  overallCompletenessPercent: number;
  totalPendingReviewCount: number;
}

export interface ContentGapItem {
  id: string;
  level: JLPTLevel;
  domain: ContentDomain;
  missingConcept: string;
  gapType: 'MISSING_EXEMPLARS' | 'MISSING_BANGLA_TRANSLATION' | 'MISSING_PREREQUISITE' | 'MISSING_ASSESSMENT' | 'LOW_QUALITY_SCORE';
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
  recommendedAction: string;
}
