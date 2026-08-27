import { JLPTLevel, ContentDomain } from '../../types/nihomi';

export type ContentStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'AI_GENERATED'
  | 'AI_QA_COMPLETE'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'REJECTED';

export type QAResultStatus = 'PASS' | 'WARNING' | 'FAIL';
export type SupportedSourceFileType = 'PDF' | 'PNG' | 'JPG' | 'JPEG' | 'WEBP' | 'TXT' | 'MARKDOWN' | 'JSON';

export interface LessonSourceFile {
  sourceId: string;
  filename: string;
  fileType: SupportedSourceFileType;
  fileSizeBytes: number;
  storagePath: string;
  uploadedBy: string;
  uploadedAt: string;
  courseId: string;
  level: JLPTLevel;
  lessonId: string;
  checksumSha256: string;
  processingStatus: 'UPLOADED' | 'EXTRACTING' | 'EXTRACTED' | 'FAILED';
  copyrightStatus: 'PUBLIC_DOMAIN' | 'ACADEMIC_FAIR_USE' | 'ORIGINAL_PROPRIETARY' | 'SOURCE_REVIEW_REQUIRED';
  extractedRawText?: string;
  extractedMetadata?: Record<string, any>;
}

export interface CurriculumMapObjective {
  id: string;
  canDoStatementBn: string;
  canDoStatementEn: string;
  canDoStatementJa: string;
}

export interface CurriculumMapConceptRef {
  id: string;
  type: 'GRAMMAR' | 'VOCABULARY' | 'KANJI' | 'EXPRESSION' | 'PATTERN';
  title: string;
  titleJa: string;
  domain: ContentDomain;
  prerequisites: string[];
}

export interface LessonCurriculumMap {
  lessonId: string;
  courseId: string;
  level: JLPTLevel;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  titleJa: string;
  titleBn: string;
  theme: string;
  communicationSituation: string;
  targetSkills: string[];
  objectives: CurriculumMapObjective[];
  grammarPoints: CurriculumMapConceptRef[];
  vocabularyItems: CurriculumMapConceptRef[];
  kanjiItems: CurriculumMapConceptRef[];
  expressions: CurriculumMapConceptRef[];
  generatedAt: string;
  status: 'EXTRACTED' | 'CONFIRMED' | 'REVISED';
}

// 14-Section Content Types
export interface LessonIntroduction {
  overviewEn: string;
  overviewBn: string;
  overviewJa: string;
  canDoObjectives: string[];
  prerequisites: string[];
  culturalNoteBn: string;
}

export interface StudioVocabItem {
  id: string;
  japanese: string;
  furigana: string;
  romaji: string;
  english: string;
  bengali: string;
  partOfSpeech: string;
  audioUrl?: string;
  exampleSentenceJa: string;
  exampleSentenceEn: string;
  exampleSentenceBn: string;
  memoryHookBn?: string;
}

export interface StudioGrammarPoint {
  id: string;
  pattern: string;
  structureFormula: string;
  meaningEn: string;
  meaningBn: string;
  detailedExplanationBn: string;
  formationRules: string[];
  commonMistakesBn: string[];
  nihomiSenseiTipsBn: string;
  examples: Array<{
    japanese: string;
    english: string;
    bengali: string;
    nuanceNote?: string;
  }>;
}

export interface StudioKanjiItem {
  id: string;
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
  radical: string;
  meaningEn: string;
  meaningBn: string;
  strokeOrderSvgPaths?: string[];
  mnemonicBn: string;
  compounds: Array<{
    word: string;
    reading: string;
    meaningBn: string;
  }>;
}

export interface StudioExpressionItem {
  id: string;
  phrase: string;
  reading: string;
  meaningEn: string;
  meaningBn: string;
  contextSituation: string;
  politenessLevel: 'INFORMAL' | 'POLITE' | 'KEIGO' | 'SONKEIGO' | 'KENJOUGO';
  nuanceExplanationBn: string;
}

export interface StudioSentencePattern {
  id: string;
  step: 'UNDERSTAND' | 'RECOGNIZE' | 'COMPLETE' | 'BUILD' | 'USE';
  titleBn: string;
  promptJa: string;
  targetSlot?: string;
  correctAnswer: string;
  explanationBn: string;
}

export interface StudioDialogue {
  scenarioTitleBn: string;
  location: string;
  participants: string[];
  lines: Array<{
    speaker: string;
    speakerRole: string;
    japanese: string;
    romaji: string;
    english: string;
    bengali: string;
    audioCue?: string;
  }>;
  comprehensionQuestions: Array<{
    questionBn: string;
    options: string[];
    correctIndex: number;
    explanationBn: string;
  }>;
}

export interface StudioReadingPassage {
  titleJa: string;
  titleBn: string;
  passageTextJa: string;
  passageTextBn: string;
  glossary: Array<{ word: string; reading: string; meaningBn: string }>;
  questions: Array<{
    questionJa: string;
    questionBn: string;
    options: string[];
    correctIndex: number;
    explanationBn: string;
  }>;
}

export interface StudioListeningActivity {
  audioScenarioBn: string;
  transcriptJa: string;
  transcriptBn: string;
  ttsVoiceType: 'MALE_TOKYO' | 'FEMALE_TOKYO' | 'NATURAL_CONVERSATION';
  audioDurationSeconds: number;
  questions: Array<{
    questionBn: string;
    options: string[];
    correctIndex: number;
  }>;
}

export interface StudioSpeakingActivity {
  targetPhraseJa: string;
  romaji: string;
  meaningBn: string;
  pitchAccentPattern: string;
  clarityTargetScore: number;
  drills: Array<{
    promptBn: string;
    expectedResponseJa: string;
    hintBn: string;
  }>;
}

export interface StudioWritingActivity {
  promptBn: string;
  taskType: 'SENTENCE_COMPLETION' | 'FREE_PARAGRAPH' | 'ESSAY_SHORT';
  rubricCriteriaBn: string[];
  modelAnswerJa: string;
  modelAnswerBn: string;
}

export interface StudioExerciseItem {
  id: string;
  exerciseType: 'MCQ' | 'FILL_IN_BLANK' | 'SENTENCE_SCRAMBLE' | 'ERROR_CORRECTION';
  questionJa: string;
  questionBn: string;
  options?: string[];
  scrambledWords?: string[];
  correctAnswer: string;
  explanationBn: string;
}

export interface StudioQuizQuestion {
  id: string;
  questionJa: string;
  questionBn: string;
  type: 'SINGLE_CHOICE' | 'PARTICLE_SELECT' | 'KANJI_READING' | 'AUDIO_MATCH';
  options: string[];
  correctIndex: number;
  explanationBn: string;
  points: number;
}

export interface StudioAssessment {
  passingScorePercent: number;
  totalTimeMinutes: number;
  retakeCooldownHours: number;
  revisionRulesBn: string[];
  masteryFeedbackBn: {
    passed: string;
    failed: string;
  };
}

export interface StudioAITutorContext {
  allowedGrammarScope: string[];
  restrictedPatterns: string[];
  pedagogicalPersonaPrompt: string;
  commonStudentStrugglesBn: string[];
  suggestedPromptsBn: string[];
}

export interface StudioQACheckItem {
  checkId: string;
  name: string;
  category: 'SCHEMA' | 'JAPANESE_LINGUISTIC' | 'BANGLA_PEDAGOGY' | 'ASSESSMENT' | 'COPYRIGHT';
  status: QAResultStatus;
  message: string;
  details?: string;
}

export interface StudioQAReport {
  score: number;
  status: QAResultStatus;
  passedCount: number;
  warningCount: number;
  failureCount: number;
  canPublish: boolean;
  checks: StudioQACheckItem[];
  evaluatedAt: string;
}

export interface StudioLesson {
  id: string;
  courseId: string;
  level: JLPTLevel;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  titleJa: string;
  titleBn: string;
  theme: string;
  version: string;
  status: ContentStatus;
  sources: LessonSourceFile[];
  curriculumMap?: LessonCurriculumMap;

  // 14-Section Content
  introduction?: LessonIntroduction;
  vocabulary: StudioVocabItem[];
  grammar: StudioGrammarPoint[];
  kanji: StudioKanjiItem[];
  expressions: StudioExpressionItem[];
  sentencePatterns: StudioSentencePattern[];
  dialogue?: StudioDialogue;
  reading?: StudioReadingPassage;
  listening?: StudioListeningActivity;
  speaking?: StudioSpeakingActivity;
  writing?: StudioWritingActivity;
  exercises: StudioExerciseItem[];
  quiz: StudioQuizQuestion[];
  assessment?: StudioAssessment;
  aiTutorContext?: StudioAITutorContext;

  qaReport?: StudioQAReport;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentStudioStats {
  totalCourses: number;
  totalLevels: number;
  totalLessons: number;
  publishedLessonsCount: number;
  draftLessonsCount: number;
  needsReviewCount: number;
  qaFailuresCount: number;
  activeProcessingJobsCount: number;
  totalVocabularyCount: number;
  totalGrammarCount: number;
  totalKanjiCount: number;
  totalExerciseCount: number;
  totalQuizQuestionCount: number;
  overallHealthScorePercent: number;
  levelBreakdown: {
    level: JLPTLevel;
    publishedCount: number;
    totalTargetLessons: number;
    vocabularyCount: number;
    grammarCount: number;
    kanjiCount: number;
    readinessScore: number;
  }[];
}
