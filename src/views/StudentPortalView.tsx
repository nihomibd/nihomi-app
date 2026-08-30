import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Award,
  BarChart3,
  LogOut,
  Flame,
  Mic,
  PenTool,
  ArrowRight,
  User as UserIcon,
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  Trophy,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DigitalStudentIdCard } from '../components/student/DigitalStudentIdCard';
import { LearningAnalyticsDashboard } from '../components/student/LearningAnalyticsDashboard';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal';
import { LessonPlayerModal } from '../components/learning/LessonPlayerModal';
import { VoiceSenseiPractice } from "../components/practice/VoiceSenseiPractice";
import { SRSFlashcardSession } from '../components/practice/SRSFlashcardSession';
import { BadgeSystem } from '../components/BadgeSystem';
import { Course, StudentProfile, NextBestAction } from '../types/nihomi';
import { useAuth } from '../context/AuthContext';

interface StudentPortalViewProps {
  initialTab?: 'learn' | 'practice' | 'assess' | 'progress' | 'profile' | 'badges' | 'dashboard' | 'settings' | 'subscription';
  onNavigate?: (view: string) => void;
}

const KANJI_CARDS = [
  { kanji: '日', reading: 'にち・ひ', meaning: 'Sun, Day, Japan', level: 'N5' },
  { kanji: '本', reading: 'ほん・もと', meaning: 'Book, Origin', level: 'N5' },
  { kanji: '語', reading: 'ご・かたる', meaning: 'Language, Word', level: 'N5' },
  { kanji: '学', reading: 'がく・まなぶ', meaning: 'Study, Learn', level: 'N5' },
  { kanji: '生', reading: 'せい・いきる', meaning: 'Life, Student', level: 'N5' },
  { kanji: '先', reading: 'せん・さき', meaning: 'Ahead, Previous', level: 'N5' },
];

const DEFAULT_COURSE: Course = {
  id: 'minna-1',
  title: 'Minna no Nihongo Lesson 1',
  titleJa: 'みんなの日本語 第1課',
  level: 'N5',
  progressPercent: 40,
  totalLessons: 25,
  completedLessons: 1,
  currentLessonTitle: 'N1 は N2 です (Affirmation, Negation, & Questions)',
  category: 'GRAMMAR',
};

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  initialTab = 'learn',
  onNavigate,
}) => {
  const { user, progress, logout } = useAuth();
  const resolveTab = (tab: string): 'learn' | 'practice' | 'assess' | 'progress' | 'badges' | 'profile' => {
    if (tab === 'dashboard') return 'learn';
    if (tab === 'settings' || tab === 'subscription') return 'profile';
    if (['learn', 'practice', 'assess', 'progress', 'badges', 'profile'].includes(tab)) {
      return tab as any;
    }
    return 'learn';
  };
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'assess' | 'progress' | 'badges' | 'profile'>(() => resolveTab(initialTab));

  // Modals state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isSRSFlashcardsActive, setIsSRSFlashcardsActive] = useState(false);
  const [isWritingActive, setIsWritingActive] = useState(false);
  const [activeKanjiToDraw, setActiveKanjiToDraw] = useState<{ kanji: string; hiragana: string; english: string; strokes: number } | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Dynamic metrics from user actions & local storage
  const completedLessonsCount = useMemo(() => {
    try {
      const saved = localStorage.getItem('nihomi_completed_lessons');
      return saved ? JSON.parse(saved).length : 8;
    } catch {
      return 8;
    }
  }, []);

  const masteredKanjiCount = useMemo(() => {
    try {
      const saved = localStorage.getItem('nihomi_mastered_kanji_set');
      return saved ? JSON.parse(saved).length : 52;
    } catch {
      return 52;
    }
  }, []);

  const totalFocusSeconds = useMemo(() => {
    try {
      const saved = localStorage.getItem('nihomi_total_focus_seconds');
      return saved ? parseInt(saved, 10) : 3600 * 14.5;
    } catch {
      return 3600 * 14.5;
    }
  }, []);

  const computedTotalHours = Number((totalFocusSeconds / 3600).toFixed(1));

  const studentProfile: StudentProfile = {
    id: user?.studentId || 'NHO-100294',
    name: user?.name || 'Md. Tanvir Kabir Biplob',
    nameJa: 'タヌビル・カビル',
    email: user?.email || 'student@nihomi.com',
    avatarUrl: user?.avatarUrl || '',
    currentLevel: 'N5',
    targetLevel: 'N4',
    targetExamDate: '2026-07-05',
    enrolledDate: '2026-08-01',
    streakDays: progress?.streakDays ?? 18,
    totalStudyHours: Math.max(computedTotalHours, progress?.totalHours ?? 14.5),
    nihomiAccountId: user?.nihomiAccountId || 'ACC-9821',
    tier: (user?.planId as any) || 'starter',
  };

  const nextAction: NextBestAction = {
    id: 'nba-1',
    type: 'LESSON',
    title: 'Minna no Nihongo Lesson 1 Grammar Master',
    subtitle: 'N1 は N2 です / N1 は N2 じゃありません',
    level: 'N5',
    estimatedMinutes: 12,
    rewardCoins: 25,
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 font-sans pb-24 text-left transition-colors selection:bg-red-500 selection:text-white">
      
      {/* 1. TOP STUDENT STATUS BAR */}
      <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border-b border-stone-200/80 dark:border-stone-800 sepia:border-[#d9cbb2] sticky top-16 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'learn', label: '1. Learn (学習)', icon: BookOpen },
                { id: 'practice', label: '2. Practice (練習)', icon: PenTool },
                { id: 'assess', label: '3. Assess (評価)', icon: Award },
                { id: 'badges', label: '4. Badges (実績)', icon: Trophy },
                { id: 'progress', label: '5. Analytics (分析)', icon: BarChart3 },
                { id: 'profile', label: '6. Student ID (パスポート)', icon: UserIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`student-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Streak, Study Time & Plan Badge */}
            <div className="hidden sm:flex items-center space-x-2.5">
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-full text-xs font-bold text-amber-900 dark:text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{studentProfile.streakDays} Day Streak</span>
              </div>
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 rounded-full text-xs font-bold text-blue-900 dark:text-blue-300">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{studentProfile.totalStudyHours}h Focus</span>
              </div>
              <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold rounded-full">
                {user?.planId?.toUpperCase() || 'PREMIUM'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* 2. TAB 1: LEARN (CURRICULUM & AI SENSEI ACTION) */}
      {activeTab === 'learn' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {/* Next Best Action Card */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RECOMMENDED NEXT LESSON</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white">
                {nextAction.title}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">{nextAction.subtitle}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                id="btn-launch-lesson"
                onClick={() => onNavigate ? onNavigate('curriculum') : setIsLessonModalOpen(true)}
                className="px-6 py-3 bg-stone-950 dark:bg-white text-white dark:text-stone-950 text-xs font-bold rounded-2xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Interactive Lesson (12 min)</span>
              </button>
            </div>
          </div>

          {/* Quick AI Practice Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div
              id="card-srs-deck"
              onClick={() => setIsSRSFlashcardsActive(true)}
              className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border border-stone-200 dark:border-stone-800 rounded-2xl hover:border-stone-400 transition-all cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                SRS
              </div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Spaced Repetition Deck</h4>
              <p className="text-xs text-stone-500">Review your due Kanji & Vocab memory cards</p>
            </div>

            <div
              id="card-voice-practice"
              onClick={() => setIsVoiceActive(true)}
              className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border border-stone-200 dark:border-stone-800 rounded-2xl hover:border-stone-400 transition-all cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                <Mic className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Voice Sensei Practice</h4>
              <p className="text-xs text-stone-500">Real-time Tokyo pronunciation coaching</p>
            </div>

            <div
              id="card-quizzes"
              onClick={() => onNavigate ? onNavigate('quizzes') : setActiveTab('assess')}
              className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border border-stone-200 dark:border-stone-800 rounded-2xl hover:border-stone-400 transition-all cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">JLPT N5 Quizzes & Drills</h4>
              <p className="text-xs text-stone-500">Practice grammar questions & mock tests</p>
            </div>

            <div
              id="card-leaderboard-shortcut"
              onClick={() => onNavigate ? onNavigate('leaderboard') : null}
              className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border border-stone-200 dark:border-stone-800 rounded-2xl hover:border-stone-400 transition-all cursor-pointer space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                <Trophy className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Community Leaderboard</h4>
              <p className="text-xs text-stone-500">Check weekly XP rankings & student honor roll</p>
            </div>
          </div>

        </div>
      )}

      {/* 3. TAB 2: PRACTICE (KANJI & MEMORY) */}
      {activeTab === 'practice' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-stone-950 dark:text-white">Active Practice Matrix</h2>
            <p className="text-xs text-stone-500 font-medium">Click any Kanji card below to practice stroke order on interactive canvas</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {KANJI_CARDS.map((k) => (
              <div
                key={k.kanji}
                id={`kanji-card-${k.kanji}`}
                onClick={() => {
                  setActiveKanjiToDraw({ kanji: k.kanji, hiragana: k.reading, english: k.meaning, strokes: 4 });
                  setIsWritingActive(true);
                }}
                className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-center cursor-pointer transition-all shadow-2xs hover:scale-102 space-y-1"
              >
                <div className="text-3xl font-black text-stone-900 dark:text-white font-japanese">{k.kanji}</div>
                <div className="text-[10px] text-stone-500 font-japanese truncate">{k.reading}</div>
                <div className="text-[10px] font-bold text-stone-800 dark:text-stone-200 truncate">{k.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: ASSESS (EVALUATION & QUIZZES) */}
      {activeTab === 'assess' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-stone-950 dark:text-white">Assessment & JLPT Readiness</h2>
            <p className="text-xs text-stone-500 font-medium">Test your knowledge across Vocabulary, Grammar, Reading, and Listening</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-black">
                  N5
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">JLPT N5 Full Diagnostic</h3>
                  <p className="text-xs text-stone-500">18 questions covering particle mechanics and essential kanji</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grammar Particles (は, が, に, で, を)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Basic Verb Conjugations (ます, ません, ました)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Time, Numbers, and Direction words</span>
                </li>
              </ul>
              <button
                id="btn-start-diagnostic"
                onClick={() => onNavigate ? onNavigate('quizzes') : setActiveTab('learn')}
                className="w-full py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <span>Take Diagnostic Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">JLPT Mock Exam Mode</h3>
                  <p className="text-xs text-stone-500">Timed simulation under authentic JLPT scoring rubrics</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Experience the timed pressure of standard JLPT exam conditions with automatic scoring and error-breakdown recommendations.
              </p>
              <button
                id="btn-start-mock-exam"
                onClick={() => onNavigate ? onNavigate('quizzes') : setActiveTab('learn')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <span>Launch Mock Exam (Timed)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 4: BADGES & ACHIEVEMENTS (GALLERY) */}
      {activeTab === 'badges' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <BadgeSystem
            currentStreak={studentProfile.streakDays}
            completedLessonsCount={completedLessonsCount}
            masteredKanjiCount={masteredKanjiCount}
          />
        </div>
      )}

      {/* 6. TAB 5: PROGRESS & DNA */}
      {activeTab === 'progress' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <LearningAnalyticsDashboard
            studentName={studentProfile.name}
            currentLevel={studentProfile.currentLevel}
            totalStudyHours={studentProfile.totalStudyHours}
            studyStreakDays={studentProfile.streakDays}
            onLaunchSrsReview={() => setIsSRSFlashcardsActive(true)}
          />

          {/* Embedded Badges Preview in Analytics */}
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Unlocked Milestone Badges</span>
              </h3>
              <button
                onClick={() => setActiveTab('badges')}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                View Full Gallery →
              </button>
            </div>
            <BadgeSystem
              currentStreak={studentProfile.streakDays}
              completedLessonsCount={completedLessonsCount}
              masteredKanjiCount={masteredKanjiCount}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* 7. TAB 6: STUDENT PASSPORT / PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 space-y-4">
              <DigitalStudentIdCard student={studentProfile} />
              
              <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-center space-y-3">
                <button
                  id="btn-student-logout"
                  onClick={logout}
                  className="w-full py-2.5 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Nihomi</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Achievement Showcase</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white"
                  >
                    All Badges →
                  </button>
                </div>
                
                <BadgeSystem
                  currentStreak={studentProfile.streakDays}
                  completedLessonsCount={completedLessonsCount}
                  masteredKanjiCount={masteredKanjiCount}
                  compact={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {isLessonModalOpen && (
        <LessonPlayerModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          course={DEFAULT_COURSE}
        />
      )}

      {isSRSFlashcardsActive && (
        <SRSFlashcardSession
          isOpen={isSRSFlashcardsActive}
          onClose={() => setIsSRSFlashcardsActive(false)}
        />
      )}

      {isWritingActive && (
        <KanjiWritingModal
          isOpen={isWritingActive}
          onClose={() => setIsWritingActive(false)}
          targetKanji={activeKanjiToDraw || undefined}
        />
      )}

      {isVoiceActive && (
        <VoiceSenseiPractice
          isOpen={isVoiceActive}
          onClose={() => setIsVoiceActive(false)}
        />
      )}

    </div>
  );
};
