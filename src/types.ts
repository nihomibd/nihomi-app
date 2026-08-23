export type UserRole = 'user' | 'admin' | 'instructor';

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  nihomiAccountId?: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  nativeLanguage: string;
  targetLevel: JLPTLevel;
  dailyGoalMinutes: number;
  bio?: string;
  avatarSeed?: string;
  avatar?: string;
  nihomiAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  currentLevel: JLPTLevel;
  currentCourseId?: string;
  currentModuleId?: string;
  currentLessonId?: string;
  completedLessonIds: string[];
  totalStudyMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  experiencePoints: number;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  level: JLPTLevel;
  order: number;
  isPublished: boolean;
  estimatedHours: number;
  moduleCount?: number;
  lessonCount?: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  titleJa?: string;
  description: string;
  order: number;
  level: JLPTLevel;
  isPublished: boolean;
  lessons?: LessonSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonSummary {
  id: string;
  moduleId: string;
  courseId: string;
  level: JLPTLevel;
  lessonNumber: number;
  title: string;
  titleJa: string;
  summary: string;
  estimatedMinutes: number;
  vocabCount: number;
  grammarCount: number;
  kanjiCount: number;
  hasQuiz: boolean;
}

export interface VocabularyItem {
  id: string;
  japanese: string;
  furigana?: string;
  romaji: string;
  english: string;
  banglaMeaning?: string;
  partOfSpeech: string;
  level: JLPTLevel;
  exampleSentenceJa: string;
  exampleSentenceEn: string;
  exampleFurigana?: string;
  audioText?: string;
  notes?: string;
  sourceDerived?: boolean;
  sourcePage?: number;
}

export interface GrammarItem {
  id: string;
  title: string;
  titleJa: string;
  structure: string;
  meaning: string;
  explanation: string;
  level: JLPTLevel;
  examples: {
    japanese: string;
    english: string;
    furigana?: string;
    breakdown?: string;
  }[];
  cautionNotes?: string;
}

export interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  radicals: string;
  level: JLPTLevel;
  examples: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

export interface LessonDialogue {
  speaker: string;
  speakerRole?: string;
  japanese: string;
  furigana?: string;
  english: string;
}

export interface LessonPracticeExercise {
  id: string;
  instruction: string;
  questionJa: string;
  hint?: string;
  type: 'fill_blank' | 'order_words' | 'translate' | 'multiple_choice';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  level: JLPTLevel;
  lessonNumber: number;
  title: string;
  titleJa: string;
  summary: string;
  explanation: string;
  isPublished: boolean;
  estimatedMinutes: number;
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
  kanji: KanjiItem[];
  dialogue?: LessonDialogue[];
  practiceExercises: LessonPracticeExercise[];
  quizId?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'ja_to_en'
  | 'en_to_ja'
  | 'vocab_recognition'
  | 'grammar_selection'
  | 'kanji_reading'
  | 'listening_selection';

export interface QuizQuestion {
  id: string;
  question: string;
  questionJa?: string;
  furigana?: string;
  audioText?: string;
  type: QuestionType;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  lessonId?: string;
  courseId?: string;
  level: JLPTLevel;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
  isPublished?: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quizTitle?: string;
  lessonId?: string;
  level: JLPTLevel;
  score: number;
  totalQuestions: number;
  correctCount: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
  passed: boolean;
  createdAt: string;
}

export interface WorkJapaneseItem {
  id: string;
  category: string;
  title: string;
  titleJa: string;
  scenario: string;
  level: 'N5' | 'N4' | 'N3' | 'All';
  description: string;
  keyPhrases: {
    japanese: string;
    furigana?: string;
    politeLevel: 'Sonkeigo' | 'Kenjougo' | 'Teineigo' | 'Standard';
    english: string;
    usageContext: string;
  }[];
  dialogue: {
    speaker: string;
    role: string;
    japanese: string;
    furigana?: string;
    english: string;
    notes?: string;
  }[];
  culturalTips: string[];
  exercises: LessonPracticeExercise[];
  isPublished?: boolean;
}

export interface AISessionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: 'conversation' | 'grammar_explanation' | 'vocabulary_explanation' | 'correction' | 'translation';
  correctionData?: {
    userSentence: string;
    correctSentence: string;
    whyIncorrect: string;
    naturalAlternative: string;
  };
  timestamp: string;
}

export interface AISession {
  id: string;
  userId: string;
  mode: string;
  title: string;
  messages: AISessionMessage[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// RECURRING REVENUE & SUBSCRIPTION ENGINE
// ==========================================

export type PlanId = 'free' | 'starter' | 'pro' | 'japan_ready';

export type BillingInterval = 'monthly' | 'yearly';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancelled'
  | 'expired';

export type PaymentStatus =
  | 'initiated'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentProviderType = 'bkash' | 'sslcommerz' | 'shurjopay' | 'stripe' | 'apple_pay' | 'google_pay' | 'manual';

export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible';

export type EntitlementFeature =
  | 'n5'
  | 'n4'
  | 'n3'
  | 'ai_coach'
  | 'business_japanese'
  | 'jlpt_pro'
  | 'japan_ready'
  | 'quizzes'
  | 'certificates'
  | 'priority_ai';

export interface PlanPrice {
  id: string;
  planId: PlanId;
  billingInterval: BillingInterval;
  amount: number; // in BDT ৳
  currency: 'BDT';
  savingsPercent?: number;
  savingsAmount?: number;
  isActive: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  displayNameJa?: string;
  tagline: string;
  description: string;
  badge?: string;
  isRecommended?: boolean;
  isPopular?: boolean;
  order: number;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: 'BDT';
  aiMonthlyLimit: number;
  features: string[];
  entitlements: EntitlementFeature[];
  isPublished?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanId;
  billingInterval: BillingInterval;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  pausedAt?: string;
  expiredAt?: string;
  paymentMethod?: string;
  lastPaymentId?: string;
  gracePeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  invoiceId?: string;
  planId: PlanId;
  planName: string;
  billingInterval: BillingInterval;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  couponCode?: string;
  currency: 'BDT';
  provider: PaymentProviderType;
  providerTransactionId?: string;
  providerReference?: string;
  status: PaymentStatus;
  paymentMethodDetails?: {
    type: string;
    accountNumberMasked?: string;
    cardBrand?: string;
    bankName?: string;
    gatewayName?: string;
  };
  paidAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: 'bkash' | 'card' | 'nagad' | 'rocket';
  isDefault: boolean;
  bKashNumberMasked?: string;
  bKashAgreementId?: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  cardHolderName?: string;
  tokenStatus?: 'active' | 'refreshing' | 'expired';
  tokenExpiresAt?: string;
  lastRefreshedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodDetails {
  type: string;
  accountNumberMasked?: string;
  cardBrand?: string;
  bankName?: string;
  gatewayName?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  amount: number;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  planId: PlanId;
  planName: string;
  invoiceType?: 'subscription' | 'top_up';
  amount: number;
  currency: 'BDT';
  billingPeriod: string;
  paymentId: string;
  status: InvoiceStatus;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  discount: number;
  tax: number;
  items: InvoiceItem[];
  paymentMethodName: string;
  issuedAt: string;
  paidAt?: string;
  createdAt: string;
  transactionId?: string;
  billingAddress?: string;
  gatewayResponse?: string;
}

export interface UsageRecord {
  id: string;
  userId: string;
  periodYearMonth: string;
  periodStart: string;
  periodEnd: string;
  aiCoachInteractions: number;
  lastInteractionAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  applicablePlans?: PlanId[];
  applicableIntervals?: BillingInterval[];
  maxRedemptions: number;
  currentRedemptions: number;
  redemptionCount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  totalRevenue: number;
  totalRevenueCollected?: number;
  activeSubscribers: number;
  trialingUsers?: number;
  newSubscribersThisMonth: number;
  cancelledSubscribers: number;
  churnRate: number;
  churnRatePercent?: number;
  trialConversionRate: number;
  trialConversionRatePercent?: number;
  upcomingRenewalsNext7Days?: number;
  revenueByPlan: {
    free: number;
    starter: number;
    pro: number;
    japan_ready: number;
  };
  subscribersByPlan: {
    free: number;
    starter: number;
    pro: number;
    japan_ready: number;
  };
  monthlyVsAnnualRevenue: {
    monthly: number;
    yearly: number;
  };
  subscribersByInterval?: {
    monthly: number;
    yearly: number;
  };
  byPlan?: {
    free: { count: number; revenue: number };
    starter: { count: number; revenue: number };
    pro: { count: number; revenue: number };
    japan_ready: { count: number; revenue: number };
  };
  byInterval?: {
    monthly: { count: number; revenue: number };
    yearly: { count: number; revenue: number };
  };
  failedPaymentsCount: number;
  pastDueAccountsCount: number;
  upcomingRenewalsCount: number;
}

export interface UserSubscriptionDetails {
  subscription: Subscription;
  plan: Plan;
  entitlements: EntitlementFeature[];
  usage: {
    aiCoachInteractions: number;
    aiMonthlyLimit: number;
    remainingQuota: number;
    periodYearMonth: string;
  };
  invoices: Invoice[];
  canCancelAtPeriodEnd: boolean;
  daysRemainingInPeriod: number;
  isTrialActive: boolean;
}

export type FeatureKey =
  | 'n5_basic'
  | 'n5_full'
  | 'n4_full'
  | 'grammar_bank'
  | 'kanji_master'
  | 'n3_full'
  | 'jlpt_mock_exams'
  | 'keigo_mastery'
  | 'business_japanese'
  | 'japan_readiness'
  | 'interview_prep'
  | 'living_in_japan'
  | 'certificates'
  | 'ai_coach'
  | 'priority_ai'
  | 'n5'
  | 'n4'
  | 'n3'
  | 'jlpt_pro'
  | 'japan_ready'
  | 'quizzes';

export type AccessDecisionReason =
  | 'TIER_RESTRICTED'
  | 'QUOTA_EXCEEDED'
  | 'SUBSCRIPTION_EXPIRED'
  | 'PAST_DUE_RESTRICTED';

export type RequiredTier = 'STARTER' | 'PRO' | 'JAPAN_READY';

export interface AccessDecision {
  allowed: boolean;
  reason?: AccessDecisionReason;
  requiredTier?: RequiredTier;
  currentUsage?: number;
  usageLimit?: number;
}

export type WebhookStatus = 'success' | 'failed' | 'ignored' | 'pending' | 'retry';

export interface WebhookEvent {
  id: string;
  eventId: string;
  provider: string;
  eventType: string;
  transactionId?: string;
  signature?: string;
  signatureVerified?: boolean;
  rawHeaders?: Record<string, string>;
  rawPayload?: any;
  status: WebhookStatus;
  errorMessage?: string;
  ipAddress?: string;
  payloadReference?: string;
  deliveryAttempts?: number;
  processed: boolean;
  processedAt?: string;
  createdAt: string;
}

export interface MRRTrendPoint {
  month: string;
  mrr: number;
  arr: number;
  subscribers: number;
  newRevenue: number;
  churnedRevenue: number;
}

export interface ConversionTrendPoint {
  month: string;
  trialsStarted: number;
  trialsConverted: number;
  trialsDropped: number;
  conversionRate: number;
}

export interface RevenueTrends {
  mrrTrends: MRRTrendPoint[];
  conversionTrends: ConversionTrendPoint[];
  providerBreakdown: {
    provider: string;
    volume: number;
    revenue: number;
    percentage: number;
  }[];
}

export interface SentenceDnaResponse {
  japanese: string;
  furigana: string;
  banglaPronunciation: string;
  englishPronunciation: string;
  banglaMeaning: string;
  englishMeaning: string;
  jlptLevel: string;
  formality: string;
  particlesUsed: {
    particle: string;
    role: string;
    explanation: string;
  }[];
  vocabularyBreakdown: {
    word: string;
    reading: string;
    meaningBangla: string;
    meaningEnglish: string;
    partOfSpeech: string;
  }[];
  grammarFormula: string;
  casualVersion: string;
  politeVersion: string;
  realLifeContext: string;
}

// Content Engine V1.0 Types
export type ContentSourceProcessingStatus =
  | 'UPLOADED'
  | 'EXTRACTING'
  | 'AI_PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SCANNED_PDF_OCR_REQUIRED';

export type ContentDraftStatus =
  | 'AI_GENERATED'
  | 'UNDER_REVIEW'
  | 'REVISION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED';

export type ContentEngineType =
  | 'lesson'
  | 'vocabulary'
  | 'grammar'
  | 'kanji'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'exercises'
  | 'quiz';

export interface ContentSource {
  id: string;
  title: string;
  originalFilename: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  sourceLanguage: string;
  targetJlptLevel: JLPTLevel;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  processingStatus: ContentSourceProcessingStatus;
  processingError?: string;
  pageCount?: number;
  extractedText?: string;
  contentHash?: string;
  uploadedBy: string;
  uploadedByEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingPassageItem {
  id?: string;
  title: string;
  passage: string;
  furigana?: string;
  translationEn: string;
  translationBn: string;
  questions: Array<{
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }>;
  sourcePage?: number;
}

export interface ListeningScriptItem {
  id?: string;
  title: string;
  situation: string;
  dialogue: LessonDialogue[];
  comprehensionQuestions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
  sourcePage?: number;
}

export interface SpeakingScenarioItem {
  id?: string;
  situation: string;
  roles: string[];
  targetExpressions: string[];
  pronunciationNotes: string;
  rolePlayInstructions: string;
  sourcePage?: number;
}

export interface StructuredEducationalContent {
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
  kanji: KanjiItem[];
  dialogue?: LessonDialogue[];
  practiceExercises: LessonPracticeExercise[];
  readingPassages?: ReadingPassageItem[];
  listeningScripts?: ListeningScriptItem[];
  speakingScenarios?: SpeakingScenarioItem[];
  quiz?: {
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
}

export interface ContentDraftGenerationMetadata {
  modelUsed: string;
  sourceDerived: boolean;
  aiEnriched: boolean;
  generatedAt: string;
  tokenEstimate?: number;
  sourcePageReferences?: number[];
  confidenceScore?: number;
  disclaimer: string;
}

export interface ContentDraft {
  id: string;
  sourceId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  contentType: ContentEngineType;
  title: string;
  titleJa: string;
  summary: string;
  explanation: string;
  level: JLPTLevel;
  structuredContent: StructuredEducationalContent;
  status: ContentDraftStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  generationMetadata: ContentDraftGenerationMetadata;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentVersion {
  id: string;
  draftId: string;
  sourceId: string;
  versionNumber: number;
  contentJson: StructuredEducationalContent;
  targetLessonId?: string;
  targetCourseId?: string;
  approvedBy: string;
  publishedBy: string;
  approvedAt: string;
  publishedAt: string;
  createdAt: string;
}




