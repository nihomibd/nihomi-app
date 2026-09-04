/**
 * NIHOMI.COM — Student Learning Dashboard Types
 */

export type JLPTLevel = 'N5' | 'N4' | 'N3';
export type TaskStatus = 'completed' | 'in_progress' | 'pending';

export interface StudentProfile {
  id: string;
  name: string;
  jlptLevel: JLPTLevel;
  journeyDay: number;
  learningStatusMessage: string;
  learningStatusMessageBn?: string;
}

export interface ContinueLesson {
  lessonId: string;
  lessonNumber: number;
  title: string;
  topic: string;
  topicJapanese?: string;
  jlptLevel: JLPTLevel;
  progressPercent: number;
  estimatedMinutesLeft: number;
}

export interface DailyPlanItem {
  id: string;
  title: string;
  titleBangla?: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'challenge' | 'reading';
  status: TaskStatus;
  detail: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  titleJapanese?: string;
  questionCount: number;
  xpReward: number;
  coinReward: number;
  currentStreak: number;
  isCompleted: boolean;
  status: 'available' | 'completed' | 'locked';
}

export interface JLPTModuleProgress {
  vocabulary: number;
  grammar: number;
  kanji: number;
  listening: number;
  reading: number;
}

export interface JLPTProgressData {
  level: JLPTLevel;
  overallPercent: number;
  modules: JLPTModuleProgress;
}

export interface DayActivity {
  dayName: string;
  dayNameBn: string;
  dateStr: string;
  completed: boolean;
  isToday: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  weeklyActivity: DayActivity[];
}

export interface ReviewMistake {
  id: string;
  pattern: string;
  patternJapanese?: string;
  category: 'particle' | 'verb' | 'politeness' | 'vocabulary';
  missedCount: number;
  lastMissed: string;
  hintBn: string;
}

export interface MasteryStat {
  completed: number;
  total: number;
}

export interface AccountUsage {
  aiCreditsRemaining: number;
  aiCreditsMax: number;
  nihomiCoins: number;
}

export interface DashboardApiResponse {
  student: StudentProfile;
  continueLesson: ContinueLesson | null;
  dailyPlan: DailyPlanItem[];
  dailyChallenge: DailyChallenge | null;
  jlptProgress: JLPTProgressData;
  streak: StreakInfo;
  recentMistakes: ReviewMistake[];
  vocabularyProgress: MasteryStat;
  kanjiProgress: MasteryStat;
  accountUsage: AccountUsage;
}

export type DashboardViewState = 'idle' | 'loading' | 'error' | 'empty';