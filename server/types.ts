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
  periodYearMonth: string; // e.g. "2026-08"
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
}

