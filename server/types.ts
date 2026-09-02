export type UserRole = 'user' | 'admin' | 'instructor';

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  resetToken?: string;
  resetTokenExpiry?: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  nativeLanguage: string;
  targetLevel: JLPTLevel;
  dailyGoalMinutes: number;
  bio?: string;
  avatarSeed?: string;
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
  lastActiveDate: string; // YYYY-MM-DD
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
  createdAt: string;
  updatedAt: string;
}

export type LessonItemType = 'vocabulary' | 'grammar' | 'kanji' | 'reading' | 'listening' | 'conversation';

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
  
  // Rich embedded learning contents
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
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId?: string;
  courseId?: string;
  level: JLPTLevel;
  title: string;
  description: string;
  passingScore: number; // percentage e.g. 70
  questions: QuizQuestion[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  lessonId?: string;
  level: JLPTLevel;
  score: number; // percentage 0 - 100
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

export type WorkJapaneseCategory =
  | 'Keigo'
  | 'Business Conversation'
  | 'Email Japanese'
  | 'Telephone Japanese'
  | 'Customer Service'
  | 'Hotel Japanese'
  | 'Workplace Communication';

export interface WorkJapaneseItem {
  id: string;
  category: WorkJapaneseCategory;
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
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
  amount: number; // In BDT ৳
  currency: 'BDT';
  savingsPercent?: number; // e.g. 30%
  savingsAmount?: number; // e.g. 2198 ৳
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  displayNameJa?: string;
  tagline: string;
  description: string;
  badge?: string; // 'Recommended' | 'Best Value' | 'Most Popular'
  isRecommended?: boolean;
  order: number;
  monthlyPrice: number; // 0, 299, 599, 999
  yearlyPrice: number; // 0, 2490, 4990, 8490
  currency: 'BDT';
  aiMonthlyLimit: number; // Free: 10, Starter: 100, Pro: 1000 (fair use), Japan Ready: 3000
  features: string[];
  entitlements: EntitlementFeature[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string; // sub-...
  userId: string;
  planId: PlanId;
  billingInterval: BillingInterval;
  status: SubscriptionStatus;
  currentPeriodStart: string; // ISO
  currentPeriodEnd: string; // ISO
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  pausedAt?: string;
  expiredAt?: string;
  paymentMethod?: string; // 'bKash' | 'SSLCommerz' | 'Card' | 'Manual'
  lastPaymentId?: string;
  gracePeriodEnd?: string; // for past_due dunning
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionItem {
  id: string;
  subscriptionId: string;
  planId: PlanId;
  quantity: number;
  priceId: string;
  createdAt: string;
}

export interface Payment {
  id: string; // pay-...
  userId: string;
  subscriptionId?: string;
  invoiceId?: string;
  planId: PlanId;
  planName: string;
  billingInterval: BillingInterval;
  amount: number; // Final charged BDT
  originalAmount: number; // Before discount
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
  id: string; // pm_...
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

export interface PaymentAttempt {
  id: string;
  paymentId: string;
  userId: string;
  provider: string;
  attemptNumber: number;
  requestPayload?: any;
  responsePayload?: any;
  status: string;
  errorMessage?: string;
  createdAt: string;
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
  id: string; // inv-...
  userId: string;
  subscriptionId: string;
  planId: PlanId;
  planName: string;
  invoiceType?: 'subscription' | 'top_up';
  amount: number;
  currency: 'BDT';
  billingPeriod: string; // "August 17, 2026 - September 17, 2026"
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

export interface Entitlement {
  id: string;
  planId: PlanId;
  featureKey: EntitlementFeature;
  accessLevel: 'full' | 'limited' | 'none';
  limits?: Record<string, any>;
}

export interface UsageRecord {
  id: string;
  userId: string;
  periodYearMonth: string; // e.g. "2026-09"
  periodStart: string;
  periodEnd: string;
  aiCoachInteractions: number;
  tokensUsed?: number;
  featureKey?: string;
  activeLockId?: string;
  activeLockUntil?: string;
  rateMinuteWindow?: number;
  rateMinuteCount?: number;
  lastInteractionAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number; // e.g. 20 for 20% or 100 for 100 BDT
  applicablePlans?: PlanId[];
  applicableIntervals?: BillingInterval[];
  maxRedemptions: number;
  currentRedemptions: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Discount {
  id: string;
  couponId: string;
  couponCode: string;
  userId: string;
  paymentId: string;
  amountSaved: number;
  appliedAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  invoiceId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'succeeded' | 'failed';
  processedBy: string;
  createdAt: string;
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
  provider: string; // 'bkash' | 'sslcommerz' | 'shurjopay' | 'stripe'
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

export type SubscriptionEventType =
  | 'signup'
  | 'trial_started'
  | 'trial_converted'
  | 'subscription_started'
  | 'subscription_renewed'
  | 'upgrade'
  | 'downgrade'
  | 'cancellation_scheduled'
  | 'cancellation_immediate'
  | 'payment_failed'
  | 'payment_recovered'
  | 'subscription_expired';

export interface SubscriptionEvent {
  id: string;
  userId: string;
  subscriptionId?: string;
  eventType: SubscriptionEventType;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  adminEmail: string;
  action: string;
  targetUserId?: string;
  targetResource: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Run Rate
  totalRevenue: number;
  activeSubscribers: number;
  newSubscribersThisMonth: number;
  cancelledSubscribers: number;
  churnRate: number; // percentage
  trialConversionRate: number; // percentage
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
  failedPaymentsCount: number;
  pastDueAccountsCount: number;
  upcomingRenewalsCount: number;
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
  providerBreakdown: Array<{
    provider: string;
    volume: number;
    revenue: number;
    percentage: number;
  }>;
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
  storageUrl?: string;
  cloudStorageKey?: string;
  storageBucket?: string;
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

export interface ContentVersionMetadata {
  title?: string;
  titleJa?: string;
  summary?: string;
  explanation?: string;
  level?: JLPTLevel;
  courseId?: string;
  moduleId?: string;
}

export interface ContentVersion {
  id: string;
  draftId: string;
  sourceId: string;
  versionNumber: number;
  contentJson: StructuredEducationalContent;
  metadataJson?: ContentVersionMetadata;
  targetLessonId?: string;
  targetCourseId?: string;
  changelogSummary?: string;
  checksumSha256?: string;
  rollbackFromVersion?: number;
  approvedBy: string;
  publishedBy: string;
  approvedAt: string;
  publishedAt: string;
  createdAt: string;
}

export interface ContentDiffFieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface ContentDiffItem<T = any> {
  id: string;
  title?: string;
  changeType: 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';
  fieldChanges?: ContentDiffFieldChange[];
  oldItem?: T;
  newItem?: T;
}

export interface ContentDifferentialDiff {
  entityId: string;
  baseVersion: string | number;
  targetVersion: string | number;
  timestamp: string;
  stats: {
    totalChanges: number;
    vocabularyChanges: { added: number; removed: number; modified: number };
    grammarChanges: { added: number; removed: number; modified: number };
    kanjiChanges: { added: number; removed: number; modified: number };
    dialogueChanges: { added: number; removed: number; modified: number };
    exerciseChanges: { added: number; removed: number; modified: number };
    quizChanges: { added: number; removed: number; modified: number };
    metadataChanges: number;
  };
  metadataDiff: ContentDiffFieldChange[];
  vocabularyDiff: ContentDiffItem<VocabularyItem>[];
  grammarDiff: ContentDiffItem<GrammarItem>[];
  kanjiDiff: ContentDiffItem<KanjiItem>[];
  dialogueDiff: ContentDiffItem<LessonDialogue>[];
  exerciseDiff: ContentDiffItem<LessonPracticeExercise>[];
  quizQuestionDiff: ContentDiffItem<QuizQuestion>[];
}

export interface DatabaseSchema {
  users: User[];
  profiles: UserProfile[];
  progress: UserProgress[];
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  workJapanese: WorkJapaneseItem[];
  aiSessions: AISession[];

  // Subscription & Billing Tables
  plans: Plan[];
  planPrices: PlanPrice[];
  subscriptions: Subscription[];
  subscriptionItems: SubscriptionItem[];
  payments: Payment[];
  paymentAttempts: PaymentAttempt[];
  invoices: Invoice[];
  invoiceItems: InvoiceItem[];
  entitlements: Entitlement[];
  usageRecords: UsageRecord[];
  coupons: Coupon[];
  discounts: Discount[];
  refunds: Refund[];
  webhookEvents: WebhookEvent[];
  subscriptionEvents: SubscriptionEvent[];
  adminAuditLogs: AdminAuditLog[];
  savedPaymentMethods?: SavedPaymentMethod[];

  // Content Engine Tables
  contentSources: ContentSource[];
  contentDrafts: ContentDraft[];
  contentVersions: ContentVersion[];
  backgroundJobs?: BackgroundJob[];

  // MemoryOS™ & Ghost Mode SRS Tables
  ghostWeaknesses?: GhostWeaknessItem[];
  studentErrorLogs?: StudentErrorLog[];

  // JLPT Mock Exam Engine Tables
  mockExams?: MockExam[];
  mockExamAttempts?: MockExamAttempt[];

  // Personalized Study Plan & Daily SRS Quota Tables
  studyPlans?: JLPTStudyPlan[];
  dailyStudySessions?: DailyStudySessionRecord[];

  // Task 8: BaitoOS™ 2.0 & Tokyo Relocation Simulation Hub Tables
  baitoScenarios?: BaitoScenarioItem[];
  conbiniProducts?: ConbiniPosProduct[];
  conbiniOrders?: ConbiniCustomerOrder[];
  rirekishoProfiles?: JisRirekishoData[];
}

export type MockExamSectionType = 'vocabulary' | 'grammar_reading' | 'listening';

export type MockExamQuestionType =
  | 'kanji_reading'
  | 'orthography'
  | 'contextual_usage'
  | 'paraphrase'
  | 'sentence_grammar'
  | 'sentence_composition'
  | 'text_grammar'
  | 'short_reading'
  | 'mid_reading'
  | 'information_retrieval'
  | 'task_listening'
  | 'point_listening'
  | 'quick_response'
  | 'utterance_expression';

export interface MockExamQuestion {
  id: string;
  sectionType: MockExamSectionType;
  questionNumber: number;
  type: MockExamQuestionType;
  questionText: string;
  questionTextJa?: string;
  furigana?: string;
  readingPassage?: {
    id: string;
    title?: string;
    passageJa: string;
    passageFurigana?: string;
    contextNote?: string;
  };
  audioScript?: {
    narratorText: string;
    dialogue: {
      speaker: string;
      textJa: string;
      romaji?: string;
      bangla?: string;
    }[];
    audioPrompt: string;
    questionAudioPromptJa: string;
  };
  scrambledParts?: string[]; // 4 items: [1], [2], [3], [4] for ★ questions
  starPositionIndex?: number; // 0, 1, 2, or 3
  options: string[];
  correctOptionIndex: number;
  explanationJa?: string;
  explanationBn: string;
  explanationEn?: string;
  pointValue: number;
  conceptCode?: string;
}

export interface MockExamSection {
  id: string;
  sectionType: MockExamSectionType;
  title: string;
  titleJa: string;
  timeLimitMinutes: number;
  maxScaledScore: number; // 60
  passingThreshold: number; // 19
  questions: MockExamQuestion[];
}

export interface MockExam {
  id: string;
  examCode: string;
  title: string;
  titleJa: string;
  level: JLPTLevel;
  description: string;
  descriptionBn: string;
  totalTimeMinutes: number;
  totalPossibleScore: number; // 180
  overallPassingScore: number; // 80 for N5, 90 for N4, 95 for N3
  sections: MockExamSection[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionScoreResult {
  sectionType: MockExamSectionType;
  sectionTitle: string;
  totalQuestions: number;
  correctQuestions: number;
  rawScorePercent: number;
  scaledScore: number;
  maxScaledScore: number;
  passingThreshold: number;
  isSectionPassed: boolean;
}

export interface MockExamAttempt {
  id: string;
  userId: string;
  mockExamId: string;
  examCode: string;
  level: JLPTLevel;
  startedAt: string;
  submittedAt: string;
  timeSpentSeconds: number;
  sectionTimesSpentSeconds: Record<MockExamSectionType, number>;
  sectionScores: Record<MockExamSectionType, SectionScoreResult>;
  totalScaledScore: number; // 0 - 180
  overallPassingScore: number;
  isPassed: boolean;
  failReason?: string;
  percentileRank?: number;
  letterGrade: 'A' | 'B' | 'C' | 'F';
  certificateId: string;
  userAnswers: {
    questionId: string;
    sectionType: MockExamSectionType;
    selectedOptionIndex: number;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }[];
  strengthSummaryBn: string;
  weaknessSummaryBn: string;
  actionableStudyPlanBn: string[];
}

export type ParticleConfusionType =
  | 'wa_vs_ga'
  | 'ni_vs_de'
  | 'o_vs_ga'
  | 'ni_vs_e'
  | 'kara_vs_made'
  | 'to_vs_ya'
  | 'te_form'
  | 'transitive_intransitive'
  | 'honorific_humble'
  | 'general_grammar';

export interface GhostWeaknessItem {
  id: string;
  userId: string;
  topic: string;
  conceptCode: string;
  confusionType: ParticleConfusionType;
  level: JLPTLevel;
  targetJapanese: string;
  romaji: string;
  bangla: string;
  failureCount: number;
  successStreak: number;
  masteryPercentage: number; // 0 - 100%
  firstSeenAt: string;
  lastFailedAt: string;
  lastReviewedAt?: string;
  nextReviewAt: string; // ISO date
  srsStage: 'apprentice' | 'guru' | 'master' | 'enlightened' | 'burned';
  intervalDays: number;
  easeFactor: number;
  lastFailedContext: string;
  newContextChallenge: string;
  scenarioPrompt: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentErrorLog {
  id: string;
  userId: string;
  questionId?: string;
  quizId?: string;
  lessonId?: string;
  conceptCode: string;
  userSelected: string;
  correctAnswer: string;
  category: 'particle' | 'conjugation' | 'kanji' | 'vocabulary' | 'keigo' | 'grammar';
  details: string;
  timestamp: string;
}

export type LearningPace = 'relaxed' | 'moderate' | 'intensive' | 'turbo';

export interface StudyPlanSprintPhase {
  phaseNumber: number;
  totalPhases: number;
  name: string;
  nameJa: string;
  goalDescription: string;
  goalDescriptionBn: string;
  startDate: string;
  endDate: string;
  progressPercent: number;
  status: 'completed' | 'active' | 'upcoming';
  keyMilestones: string[];
}

export interface DailySrsQuota {
  newVocabTarget: number;
  vocabSrsReviewTarget: number;
  kanjiStrokeTarget: number;
  grammarPatternsTarget: number;
  particleWeakSpotsTarget: number;
  listeningMinutesTarget: number;
  totalDailyMinutes: number;
}

export interface WeeklyMilestoneItem {
  weekNumber: number;
  weekRange: string;
  milestoneTitle: string;
  milestoneTitleBn: string;
  targetLessons: string;
  targetKanjiCount: number;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface DailyRoadmapTask {
  id: string;
  taskType: 'vocab_srs' | 'kanji_drill' | 'grammar_lesson' | 'ghost_recovery' | 'listening_drill' | 'mock_exam';
  title: string;
  titleJa: string;
  titleBn: string;
  targetCount: number;
  completedCount: number;
  estimatedMinutes: number;
  isCompleted: boolean;
  xpReward: number;
  linkView: string;
  linkParams?: Record<string, any>;
}

export interface DailyStudySessionRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completedItems: {
    vocabSrsDone: number;
    kanjiDone: number;
    grammarDone: number;
    ghostsResolved: number;
    listeningMinutesDone: number;
    quizzesDone: number;
  };
  totalMinutesSpent: number;
  dailyQuotaMet: boolean;
  earnedXp: number;
  checklist: DailyRoadmapTask[];
  updatedAt: string;
}

export interface JLPTStudyPlan {
  id: string;
  userId: string;
  targetLevel: JLPTLevel;
  targetExamDate: string; // ISO string e.g. 2026-12-06
  examSessionName: string;
  targetScore: number; // out of 180
  dailyTimeMinutes: number;
  learningPace: LearningPace;
  focusAreas: string[];
  daysRemaining: number;
  weeksRemaining: number;
  currentSprintPhase: StudyPlanSprintPhase;
  sprintPhases: StudyPlanSprintPhase[];
  dailyQuota: DailySrsQuota;
  weeklySchedule: WeeklyMilestoneItem[];
  readinessScore: number; // 0 - 100%
  projectedScore: number; // e.g. 142 / 180
  passProbability: number; // e.g. 88%
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// Task 8: BaitoOS™ 2.0 & Tokyo Relocation Simulation Hub Types
// ==============================================================================

export type BaitoScenarioType =
  | 'conbini_pos'
  | 'school_principal'
  | 'embassy_visa'
  | 'restaurant_izakaya'
  | 'train_metro'
  | 'ward_office';

export interface BaitoScenarioItem {
  id: string;
  type: BaitoScenarioType;
  title: string;
  titleJa: string;
  titleBn: string;
  subtitle: string;
  difficulty: 'N5' | 'N4' | 'N3';
  location: string;
  interlocutorName: string;
  interlocutorRole: string;
  interlocutorAvatar: string;
  initialDialogue: {
    ja: string;
    romaji: string;
    bn: string;
    en: string;
  };
  objectives: string[];
  contextDescription: string;
  keyVocabulary: Array<{
    ja: string;
    kana: string;
    meaningBn: string;
    meaningEn: string;
  }>;
}

export interface BaitoInterviewMessage {
  id: string;
  sender: 'interviewer' | 'student' | 'system';
  textJa: string;
  textRomaji?: string;
  textBn?: string;
  textEn?: string;
  audioText?: string;
  timestamp: string;
  evaluation?: {
    keigoAccuracy: number; // 0-100
    grammarScore: number; // 0-100
    fluencyScore: number; // 0-100
    feedbackJa: string;
    feedbackBn: string;
    betterAlternativeJa?: string;
    betterAlternativeRomaji?: string;
  };
}

export interface BaitoEvaluationResponse {
  success: boolean;
  messageId: string;
  userText: string;
  nextInterviewerDialogue: {
    ja: string;
    romaji: string;
    bn: string;
    en: string;
  };
  evaluation: {
    overallScore: number;
    keigoLevel: 'Teineigo (Polite)' | 'Kenjougo (Humble)' | 'Sonkeigo (Honorific)' | 'Informal (Needs Fix)';
    keigoAccuracy: number;
    grammarScore: number;
    fluencyScore: number;
    feedbackJa: string;
    feedbackBn: string;
    detectedMistakes: string[];
    polishedAlternativeJa: string;
    polishedAlternativeRomaji: string;
  };
  isFinished?: boolean;
  finalReadinessScore?: number;
}

export interface JisRirekishoData {
  id: string;
  userId: string;
  fullName: string;
  fullNameKana: string;
  fullNameRomaji: string;
  gender: 'male' | 'female' | 'other' | 'unspecified';
  birthDate: string; // YYYY-MM-DD
  japaneseEraBirth: string; // e.g. 平成12年10月1日
  age: number;
  phone: string;
  email: string;
  postalCode: string;
  currentAddress: string;
  currentAddressKana: string;
  photoUrl: string;
  visaStatus: string;
  visaExpiry: string;
  allowedHoursPerWeek: number; // e.g. 28
  educationHistory: Array<{
    year: number;
    month: number;
    schoolName: string;
    faculty: string;
    status: 'enrolled' | 'graduated' | 'expected_graduation';
  }>;
  workHistory: Array<{
    year: number;
    month: number;
    companyName: string;
    role: string;
    status: 'joined' | 'resigned' | 'current';
  }>;
  licensesCertifications: Array<{
    year: number;
    month: number;
    title: string;
  }>;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Studying N5' | 'Studying N4';
  motivationStatement: string; // 志望の動機
  motivationStatementPolished?: string;
  selfPr: string; // 自己PR
  selfPrPolished?: string;
  commuteTimeMinutes: number;
  dependentsCount: number;
  hasSpouse: boolean;
  hankoStampUrl?: string;
  updatedAt: string;
}

export interface ConbiniPosProduct {
  id: string;
  barcode: string;
  nameJa: string;
  nameRomaji: string;
  nameBn: string;
  priceYen: number;
  category: 'bento' | 'drink' | 'onigiri' | 'dessert' | 'alcohol_tobacco' | 'hot_snack';
  needsHeating?: boolean;
  needsAgeVerification?: boolean;
  imageIcon: string;
}

export interface ConbiniCustomerOrder {
  id: string;
  customerName: string;
  customerType: 'salaryman' | 'student' | 'grandma' | 'foreigner';
  customerSpeechJa: string;
  customerSpeechRomaji: string;
  customerSpeechBn: string;
  items: ConbiniPosProduct[];
  hasPointCard: boolean;
  pointCardName?: 'Ponta' | 'd-Point' | 'Rakuten' | 'None';
  needsBag: boolean;
  needsChopsticks: boolean;
  wantsBentoHeated: boolean;
  paymentMethod: 'cash' | 'suica' | 'paypay' | 'credit';
  tenderedCashAmount?: number;
}

export type BackgroundJobType =
  | 'pdf_extraction'
  | 'scanned_pdf_ocr'
  | 'curriculum_structuring'
  | 'audio_generation'
  | 'batch_media_sync'
  | 'database_backup_daily'
  | 'database_backup_weekly';
export type BackgroundJobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'retrying';

export interface BackgroundJob {
  id: string;
  type: BackgroundJobType;
  targetId: string; // sourceId or draftId
  status: BackgroundJobStatus;
  progress: number; // 0 - 100
  currentStage: string;
  totalPages?: number;
  processedPages?: number;
  result?: any;
  error?: string;
  retryCount: number;
  maxRetries: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  event: string;
  message: string;
  traceId?: string;
  userId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  metadata?: Record<string, any>;
}

export interface SystemAuditMetrics {
  totalJobsProcessed: number;
  activeJobsCount: number;
  completedJobsCount: number;
  failedJobsCount: number;
  averageJobDurationMs: number;
  totalPdfPagesProcessed: number;
  ocrExtractionCount: number;
  aiTokensBudgetUsed: number;
  queueDepth: number;
  uptimeSeconds: number;
  lastUpdated: string;
}
