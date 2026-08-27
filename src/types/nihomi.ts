export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends BaseEntity {
  name: string;
  email: string;
  targetLevel: JLPTLevel;
  currentHoursCompleted: number;
}

export type ContentDomain =
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'KANJI'
  | 'CONVERSATION'
  | 'EXPRESSION'
  | 'READING'
  | 'LISTENING'
  | 'BAITO'
  | 'INTERVIEW'
  | 'CULTURE';

export interface StudentProfile {
  id: string;
  nihomiAccountId: string;
  name: string;
  nameJa?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  enrolledDate: string;
  currentLevel: JLPTLevel;
  status: 'ACTIVE' | 'GRADUATED' | 'ON_HOLD' | 'PROBATION';
  streakDays: number;
  totalStudyHours: number;
  assignedTeacher: string;
  targetExam: string;
  targetExamDate: string;
}

export interface Course {
  id: string;
  title: string;
  titleJa: string;
  level: JLPTLevel;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  completedQuizzes?: number;
  totalQuizzes?: number;
  quizAverageScore?: number;
  currentLessonTitle: string;
  category: 'GRAMMAR' | 'KANJI' | 'VOCABULARY' | 'CONVERSATION' | 'CULTURE' | 'READING' | 'INTERVIEW_PREP';
}

export interface AssessmentRecord {
  id: string;
  examName: string;
  date: string;
  score: number;
  maxScore: number;
  passed: boolean;
  breakdown: {
    languageKnowledge: number;
    reading: number;
    listening: number;
  };
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  level: JLPTLevel;
  issueDate: string;
  verificationUrl: string;
  qrCodeUrl?: string;
  authorizedSignatory: string;
}

export interface AuthUser extends StudentProfile {
  studentId?: string;
  role: 'student' | 'teacher' | 'admin';
  phone?: string;
  planId?: string;
  full_name?: string;
  displayName?: string;
  avatar?: string;
  targetLevel?: JLPTLevel;
  dailyGoalMinutes?: number;
  bio?: string;
  nativeLanguage?: string;
}

export interface GoogleUserProfile {
  id: string;
  name: string;
  nameJa?: string;
  email: string;
  avatarUrl?: string;
  currentLevel: string;
  studentId: string;
}

export interface SubscriptionDetails {
  planId: 'free' | 'starter' | 'pro' | 'vip';
  planName: string;
  priceBDT: number;
  status: 'active' | 'expired' | 'trial';
  validUntil: string;
  billingCycle: 'monthly' | 'yearly';
  aiCreditsRemaining: number;
  paymentMethod: 'bkash' | 'sslcommerz' | 'card';
  features: string[];
  subscription?: any;
  usage?: any;
  plan?: any;
}
