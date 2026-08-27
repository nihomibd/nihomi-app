import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  Download,
  Calendar,
  Settings,
  CreditCard,
  Crown,
  Sparkles,
  LogOut,
  Save,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Phone,
  Mail,
  Flame,
  GraduationCap,
  FileText,
  Mic,
  Volume2,
  Radio
} from 'lucide-react';
import { DigitalStudentIdCard } from '../components/student/DigitalStudentIdCard';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice';
import { InfiniteConceptStudio } from '../components/founder/content-engine/InfiniteConceptStudio';
import { LanguageProgressTracker } from '../components/LanguageProgressTracker';
import { MonthlyCalendarWidget } from '../components/student/MonthlyCalendarWidget';
import { StudyStreakHeatmap } from '../components/student/StudyStreakHeatmap';
import { AchievementBadges } from '../components/student/AchievementBadges';
import { NihomiStandardDashboard } from '../components/student/NihomiStandardDashboard';
import { LearningGapRadar } from '../components/student/LearningGapRadar';
import { DailyStreakCalendarWidget } from '../components/dashboard/DailyStreakCalendarWidget';
import { LeitnerStudyBoxWidget } from '../components/dashboard/LeitnerStudyBoxWidget';
import { JlptRadarMasteryDashboard } from '../components/dashboard/JlptRadarMasteryDashboard';
import { generateStudentSummaryPdf } from '../lib/pdfReportGenerator';
import { ContentExportService } from '../core/content-engine/contentExportService';
import { Course, AssessmentRecord, CertificateRecord } from '../types/nihomi';
import { useAuth, PLAN_CONFIGS } from '../context/AuthContext';
import { useFocusMode } from '../context/FocusModeContext';
import { Eye, EyeOff } from 'lucide-react';

interface StudentPortalViewProps {
  initialTab?: 'dashboard' | 'nihomi_standard' | 'courses' | 'assessments' | 'idcard' | 'certificates' | 'settings' | 'subscription' | 'infinite_concept';
  onNavigate?: (view: string) => void;
}

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Minna no Nihongo I (Grammar & Sentence Mastery)',
    titleJa: 'みんなの日本語 初級I 文法',
    level: 'N5',
    progressPercent: 76,
    totalLessons: 25,
    completedLessons: 19,
    completedQuizzes: 18,
    totalQuizzes: 25,
    quizAverageScore: 92,
    currentLessonTitle: 'Lesson 20: Plain Form Conjugation (普通形)',
    category: 'GRAMMAR',
  },
  {
    id: 'c2',
    title: 'Essential 100 Kanji & Radicals Workshop',
    titleJa: '漢字100字と部首マスター',
    level: 'N5',
    progressPercent: 92,
    totalLessons: 12,
    completedLessons: 11,
    completedQuizzes: 11,
    totalQuizzes: 12,
    quizAverageScore: 95,
    currentLessonTitle: 'Set 12: Directional & Calendar Kanji',
    category: 'KANJI',
  },
  {
    id: 'c3',
    title: 'Shadowing: Real Japanese Workplace Conversations',
    titleJa: 'シャドーイング 日本語会話',
    level: 'N5',
    progressPercent: 60,
    totalLessons: 15,
    completedLessons: 9,
    completedQuizzes: 8,
    totalQuizzes: 15,
    quizAverageScore: 88,
    currentLessonTitle: 'Dialogue 10: Arubaito Greetings & Polite Forms',
    category: 'CONVERSATION',
  },
  {
    id: 'c4',
    title: 'Minna no Nihongo II (JLPT N4 Intermediate Bridge)',
    titleJa: 'みんなの日本語 初級II (N4)',
    level: 'N4',
    progressPercent: 28,
    totalLessons: 25,
    completedLessons: 7,
    completedQuizzes: 6,
    totalQuizzes: 25,
    quizAverageScore: 85,
    currentLessonTitle: 'Lesson 32: 〜ほうがいい / Advise & Suggestions',
    category: 'GRAMMAR',
  },
  {
    id: 'c5',
    title: 'JLPT N5 Official Listening Masterclass',
    titleJa: 'JLPT N5 聴解マスター',
    level: 'N5',
    progressPercent: 45,
    totalLessons: 20,
    completedLessons: 9,
    completedQuizzes: 9,
    totalQuizzes: 20,
    quizAverageScore: 84,
    currentLessonTitle: 'Section 4: Task-Based Listening & Directions',
    category: 'GRAMMAR',
  },
  {
    id: 'c6',
    title: 'JLPT N3 Business Keigo & Career Readiness',
    titleJa: 'JLPT N3 ビジネス敬語・就職準備',
    level: 'N3',
    progressPercent: 15,
    totalLessons: 20,
    completedLessons: 3,
    completedQuizzes: 3,
    totalQuizzes: 20,
    quizAverageScore: 90,
    currentLessonTitle: 'Module 4: Sonkeigo vs Kenjougo Office Emailing',
    category: 'INTERVIEW_PREP',
  }
];

const MOCK_ASSESSMENTS: AssessmentRecord[] = [
  {
    id: 'a1',
    examName: 'JLPT N5 Diagnostic Mock Exam 1',
    date: '2026-07-15',
    score: 154,
    maxScore: 180,
    passed: true,
    breakdown: { languageKnowledge: 52, reading: 54, listening: 48 },
  },
  {
    id: 'a2',
    examName: 'Kanji & Vocabulary Speed Benchmark (N5)',
    date: '2026-08-01',
    score: 95,
    maxScore: 100,
    passed: true,
    breakdown: { languageKnowledge: 95, reading: 0, listening: 0 },
  },
  {
    id: 'a3',
    examName: 'Minna no Nihongo Lesson 1-15 Comprehensive Midterm',
    date: '2026-08-18',
    score: 168,
    maxScore: 180,
    passed: true,
    breakdown: { languageKnowledge: 58, reading: 56, listening: 54 },
  }
];

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  initialTab = 'dashboard',
  onNavigate
}) => {
  const { user, subscriptionDetails, updateProfile, updateSubscription, topUpCredits, logout } = useAuth();
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'nihomi_standard' | 'courses' | 'assessments' | 'idcard' | 'certificates' | 'settings' | 'subscription' | 'infinite_concept'
  >(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Form State for Profile Customization
  const [name, setName] = useState(user?.name || 'Md. Tanvir Kabir Biplob');
  const [nameJa, setNameJa] = useState(user?.nameJa || 'タンビル・カビル・ビプロブ');
  const [email, setEmail] = useState(user?.email || 'mdtanvirkabirbiplob@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+880 17555-34997');
  const [currentLevel, setCurrentLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>(user?.currentLevel || 'N5');
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'JLPT N5 December Session');
  const [targetExamDate, setTargetExamDate] = useState(user?.targetExamDate || '2026-12-06');
  const [assignedTeacher, setAssignedTeacher] = useState(user?.assignedTeacher || 'Sensei Abdur Razzak');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Subscription Selection State
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'starter' | 'pro' | 'vip'>(
    (subscriptionDetails?.planId as any) || 'pro'
  );
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<'bkash' | 'sslcommerz'>('bkash');
  const [subUpdatedMsg, setSubUpdatedMsg] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setNameJa(user.nameJa || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+880 17555-34997');
      setCurrentLevel(user.currentLevel || 'N5');
      setTargetExam(user.targetExam || 'JLPT N5 December Session');
      setTargetExamDate(user.targetExamDate || '2026-12-06');
      setAssignedTeacher(user.assignedTeacher || 'Sensei Abdur Razzak');
    }
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, nameJa, email, phone, currentLevel, targetExam, targetExamDate, assignedTeacher });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3500);
  };

  const handleSubscriptionChange = () => {
    updateSubscription(selectedPlanId, selectedPaymentProvider);
    setSubUpdatedMsg(true);
    setTimeout(() => setSubUpdatedMsg(false), 3500);
  };

  const studentData = user || {
    id: 'DILS-2026-N5042',
    nihomiAccountId: 'NHM-880-9972',
    name: 'Md. Tanvir Kabir Biplob',
    nameJa: 'タンビル・カビル・ビプロブ',
    email: 'mdtanvirkabirbiplob@gmail.com',
    avatarUrl: '',
    enrolledDate: '2026-01-10',
    currentLevel: 'N5' as const,
    status: 'ACTIVE' as const,
    streakDays: 18,
    totalStudyHours: 124,
    assignedTeacher: 'Sensei Abdur Razzak',
    targetExam: 'JLPT N5 December Session',
    targetExamDate: '2026-12-06',
    role: 'student' as const,
    planId: 'pro'
  };

  const MOCK_CERTIFICATES: CertificateRecord[] = [
    {
      id: 'cert-1',
      certificateNumber: 'NHM-DILS-2026-0814',
      studentName: studentData.name,
      studentId: studentData.id,
      courseTitle: `Foundational Japanese Language & Culture (150 Hours)`,
      level: studentData.currentLevel,
      issueDate: '2026-08-15',
      verificationUrl: `https://nihomi.com/verify/NHM-DILS-2026-0814`,
      qrCodeUrl: '',
      authorizedSignatory: 'Dhaka International Language School & Nihomi Academic Council',
    },
    {
      id: 'cert-2',
      certificateNumber: 'NHM-DILS-2026-0702',
      studentName: studentData.name,
      studentId: studentData.id,
      courseTitle: `Hiragana, Katakana & Pronunciation Benchmark`,
      level: 'N5',
      issueDate: '2026-02-28',
      verificationUrl: `https://nihomi.com/verify/NHM-DILS-2026-0702`,
      qrCodeUrl: '',
      authorizedSignatory: 'Sensei Abdur Razzak, DILS Academic Dean',
    }
  ];

  const handleDownloadReport = () => {
    try {
      ContentExportService.exportStudentProficiencyPdf({
        studentName: studentData.name,
        studentNameJa: studentData.nameJa,
        studentId: studentData.id,
        accountId: studentData.nihomiAccountId,
        level: studentData.currentLevel,
        targetExam: studentData.targetExam,
        targetDate: studentData.targetExamDate,
        totalXp: (studentData as any).pointsEarned || 2850,
        studyStreakDays: studentData.streakDays || 18,
        totalStudyHours: studentData.totalStudyHours || 124,
        completedLessons: 19,
        totalLessons: 25,
        quizAverageScore: 94,
        kanjiMastered: 100,
        vocabMastered: 480,
        grammarRulesMastered: 28,
        institutionName: "Dhaka International Language School (DILS)",
        assignedTeacher: studentData.assignedTeacher,
        overallMasteryScore: 96.4,
        masteredConcepts: [
          { code: 'N5-GR-001', title: 'N1 は N2 です (Topic Particle & Affirmative Copula)', category: 'Grammar', score: 98 },
          { code: 'N5-GR-002', title: 'N1 は N2 じゃありません (Negative Copula)', category: 'Grammar', score: 96 },
          { code: 'N5-KJ-001', title: '日 (Sun / Day / Japan)', category: 'Kanji', score: 99 },
          { code: 'N5-VOC-001', title: 'わたし (I / Myself)', category: 'Vocabulary', score: 100 },
          { code: 'N5-VOC-002', title: 'がくせい (Student)', category: 'Vocabulary', score: 98 }
        ]
      });
    } catch {
      generateStudentSummaryPdf({
        studentName: studentData.name,
        studentNameJa: studentData.nameJa,
        studentId: studentData.id,
        accountId: studentData.nihomiAccountId,
        level: studentData.currentLevel,
        targetExam: studentData.targetExam,
        targetDate: studentData.targetExamDate,
        totalXp: (studentData as any).pointsEarned || 2450,
        studyStreakDays: 14,
        totalStudyHours: 42,
        completedLessons: 19,
        totalLessons: 25,
        quizAverageScore: 92,
        kanjiMastered: 100,
        vocabMastered: 480,
        grammarRulesMastered: 28,
        institutionName: "Dhaka International Language School (DILS)",
        assignedTeacher: studentData.assignedTeacher
      });
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Top Banner / Student Identity Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-red-500/60 flex items-center justify-center text-xl font-extrabold text-white shadow-md">
              {studentData.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-lg font-bold tracking-tight text-white">{studentData.name}</h1>
                <span className="text-xs text-slate-400 font-medium">({studentData.nameJa})</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                  {studentData.status}
                </span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-[10px] font-bold rounded uppercase border border-red-500/30">
                  {subscriptionDetails?.planName || 'Nihomi Pro'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Student ID: <span className="font-mono text-slate-200">{studentData.id}</span> • Account ID:{' '}
                <span className="font-mono text-slate-200">{studentData.nihomiAccountId}</span> • Level:{' '}
                <span className="font-bold text-red-400">{studentData.currentLevel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              id="btn-download-academic-pdf"
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
              title="Download official A4 summary report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>রিপোর্ট ডাউনলোড (PDF)</span>
            </button>

            <button
              id="btn-toggle-focus-mode"
              type="button"
              onClick={() => toggleFocusMode(!isFocusMode)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                isFocusMode
                  ? 'bg-amber-500 text-stone-900 border-amber-400 shadow-md font-bold'
                  : 'bg-stone-800/90 hover:bg-stone-700 text-amber-300 border-stone-700 hover:border-amber-400/50'
              }`}
            >
              {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isFocusMode ? 'Exit Focus Mode' : '🧘 Focus Mode'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-slate-900 border-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>প্রোফাইল সেটিংস</span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                activeTab === 'subscription'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-red-950/60 hover:bg-red-900/60 text-red-200 border-red-800/60'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-red-400" />
              <span>সাবস্ক্রিপশন পরিবর্তন</span>
            </button>

            <button
              onClick={() => {
                logout();
                if (onNavigate) onNavigate('landing');
              }}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-800 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগ আউট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto py-3 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Overview & Summary', icon: BarChart3 },
              { id: 'nihomi_standard', label: '🌟 Nihomi Standard™ (23-D)', icon: Award },
              { id: 'courses', label: 'Curriculum & Lessons', icon: BookOpen },
              { id: 'infinite_concept', label: '⚡ Infinite Learning Hub™ (15 Formats)', icon: Sparkles },
              { id: 'assessments', label: 'Exams & Scorecards', icon: Clock },
              { id: 'idcard', label: 'Digital Student ID', icon: ShieldCheck },
              { id: 'certificates', label: 'Certificates & Records', icon: Award },
              { id: 'settings', label: '⚙️ Profile Settings', icon: Settings },
              { id: 'subscription', label: '💳 Subscription & Billing', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`whitespace-nowrap pb-1 transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-slate-900 border-b-2 border-slate-900 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500">Current Target</span>
                  <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded">
                    {studentData.currentLevel}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900">{studentData.targetExam}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exam: {studentData.targetExamDate}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500">Active Subscription</span>
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-base font-bold text-slate-900">{subscriptionDetails?.planName || 'Nihomi Pro'}</div>
                <div className="text-xs text-emerald-600 mt-1 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid until {subscriptionDetails?.validUntil || '2026-12-31'}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500">AI Sensei Credits</span>
                  <Sparkles className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-base font-bold text-slate-900">{subscriptionDetails?.aiCreditsRemaining ?? 150} Queries</div>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className="text-xs text-red-600 hover:text-red-700 font-bold mt-1 text-left block cursor-pointer"
                >
                  + Instant bKash Top-Up
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500">Academic Desk</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-base font-bold text-slate-900">Dhaka Int'l Language School</div>
                <div className="text-xs text-slate-500 mt-1">{studentData.assignedTeacher}</div>
              </div>
            </div>

            {/* Leitner Spaced Repetition (SRS) Daily Study Deck */}
            <LeitnerStudyBoxWidget
              onNavigateStudy={(v) => {
                if (v === 'flashcards') setActiveTab('courses');
                else if (onNavigate) onNavigate(v);
              }}
            />

            {/* Daily Consecutive Study Streak Calendar & Nihomi Gems Reward Widget */}
            <DailyStreakCalendarWidget />

            {/* JLPT N5-N1 Recharts Mastery Radar & Category Evaluation */}
            <JlptRadarMasteryDashboard />

            {/* Language Progress Tracker (Kanji, Vocabulary, and Grammar Progress Rings) */}
            <LanguageProgressTracker
              initialLevel={studentData.currentLevel as any}
              onNavigate={(v) => {
                if (v === 'courses') setActiveTab('courses');
                else if (onNavigate) onNavigate(v);
              }}
            />

            {/* Study Streak & Habit Heatmap Tracker */}
            <StudyStreakHeatmap
              currentStreak={14}
              longestStreak={26}
              totalStudyDays={68}
            />

            {/* Monthly Attendance & Learning Rhythm Calendar Widget */}
            <MonthlyCalendarWidget />

            {/* Academic Achievement & Badge Showcase */}
            <AchievementBadges />

            {/* Learning Gap Diagnostic Radar */}
            <LearningGapRadar studentLevel={studentData.currentLevel} />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active JLPT Course & Quiz Progress</h3>
                  <p className="text-xs text-slate-500">Real-time tracking of lessons completed, quiz mastery, and mock scores</p>
                </div>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>সকল কোর্স ({MOCK_COURSES.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_COURSES.slice(0, 4).map((course) => {
                  const quizPercent = Math.round(((course.completedQuizzes || 0) / (course.totalQuizzes || course.totalLessons)) * 100);
                  return (
                    <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {course.level} • {course.category}
                            </span>
                            {course.quizAverageScore && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                🎯 {course.quizAverageScore}% Quiz Avg
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mt-1.5">{course.title}</h4>
                          <p className="text-xs text-slate-400">{course.titleJa}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-red-600">{course.progressPercent}%</span>
                          <span className="block text-[10px] text-slate-400 font-medium">Overall</span>
                        </div>
                      </div>

                      {/* Dual Progress Bars: Lessons & Quizzes */}
                      <div className="space-y-2 pt-1">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-600 font-medium mb-1">
                            <span>লেসন সম্পন্ন ({course.completedLessons}/{course.totalLessons})</span>
                            <span className="font-bold">{course.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-red-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progressPercent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                            <span>কুইজ অনুশীলন ({course.completedQuizzes || 0}/{course.totalQuizzes || course.totalLessons})</span>
                            <span className="font-bold text-amber-700">{quizPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${quizPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <span className="font-medium text-slate-700 truncate max-w-[220px] text-[11px]">
                          📍 {course.currentLessonTitle}
                        </span>
                        <button
                          onClick={() => onNavigate && onNavigate('courses')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                        >
                          চালিয়ে যান &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Multimodal Speaking & Practice Studio */}
            <div className="bg-linear-to-r from-red-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-red-900/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-white">
                      Nihomi Voice Sensei (ভয়েস অ্যাকসেন্ট প্র্যাকটিস)
                    </h3>
                    <span className="px-2 py-0.5 bg-red-500/30 text-red-200 text-[10px] font-bold rounded-md uppercase border border-red-400/40">
                      Tokyo Pitch AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    প্র্যাকটিস করুন টোকিও সেলফ-ইন্ট্রোডাকশন, ক্যাফে অর্ডার ও শিনজুকুর দিকনির্দেশনা। রিয়েল-টাইম মোরা রিদম স্কোর ও বাংলা কোচিং ফিডব্যাক পান।
                  </p>
                </div>
              </div>

              <button
                id="btn-portal-launch-voice-sensei"
                type="button"
                onClick={() => setIsVoiceActive(true)}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>ভয়েস প্র্যাকটিস শুরু করুন</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Digital ID Card & Institutional Verification</h3>
                <button
                  onClick={() => setActiveTab('idcard')}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>সম্পূর্ণ আইডি কার্ড দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <DigitalStudentIdCard student={studentData} />
            </div>
          </div>
        )}

        {/* NIHOMI STANDARD TAB */}
        {activeTab === 'nihomi_standard' && (
          <NihomiStandardDashboard studentData={studentData} />
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Curriculum & Learning Tracks</h2>
                <p className="text-xs text-slate-500">Dhaka International Language School & Nihomi JLPT Syllabus</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <span className="px-3 py-1 bg-white rounded-lg shadow-xs text-slate-900">All Tracks ({MOCK_COURSES.length})</span>
                <span className="px-3 py-1 text-slate-500">N5 Foundation</span>
                <span className="px-3 py-1 text-slate-500">N4 Bridge</span>
                <span className="px-3 py-1 text-slate-500">N3 Career</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_COURSES.map((course) => {
                const quizPercent = Math.round(((course.completedQuizzes || 0) / (course.totalQuizzes || course.totalLessons)) * 100);
                return (
                  <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                            Level {course.level}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {course.category}
                          </span>
                          {course.quizAverageScore && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ⭐ {course.quizAverageScore}% Mastery
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mt-2">{course.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{course.titleJa}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-red-600">{course.progressPercent}%</span>
                        <span className="block text-[10px] text-slate-400">Complete</span>
                      </div>
                    </div>

                    {/* Multi-Metric Progress Bar: Lessons & Quizzes */}
                    <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <div className="flex justify-between text-xs text-slate-700 font-semibold mb-1">
                          <span>📚 অধ্যায় সম্পন্ন ({course.completedLessons} / {course.totalLessons})</span>
                          <span>{course.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-red-600 h-2 rounded-full transition-all duration-500" style={{ width: `${course.progressPercent}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                          <span>📝 কুইজ ও প্র্যাকটিস টেস্ট ({course.completedQuizzes || 0} / {course.totalQuizzes || course.totalLessons})</span>
                          <span className="font-bold text-amber-700">{quizPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${quizPercent}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Lesson</span>
                        <span className="font-semibold">{course.currentLessonTitle}</span>
                      </div>
                      <button
                        onClick={() => onNavigate && onNavigate('courses')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        চালিয়ে যান
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INFINITE CONCEPT STUDIO TAB (15 Dynamic Automated Formats) */}
        {activeTab === 'infinite_concept' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-400">
                  NIHOMI INFINITE LEARNING MATRIX™
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif">1 Concept → 15 Dynamic Learning Experiences</h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Transform any Japanese grammatical formula, essential kanji, or core vocabulary into micro-lessons, Leitner 3D flashcards, Tokyo part-time (Baito) dialogues, particle discrimination labs, and pitch accent shadowing drills.
              </p>
            </div>

            <InfiniteConceptStudio />
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">JLPT Diagnostic Mock Exams & Scorecards</h2>
              <p className="text-xs text-slate-500">Official scoring breakdown following the Japan Foundation evaluation matrix</p>
            </div>

            <div className="space-y-4">
              {MOCK_ASSESSMENTS.map((exam) => (
                <div key={exam.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded">
                        PASSED
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{exam.examName}</h4>
                    </div>
                    <p className="text-xs text-slate-400">তারিখ: {exam.date}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                      <span>Language Knowledge: <strong>{exam.breakdown.languageKnowledge}/60</strong></span>
                      <span>Reading: <strong>{exam.breakdown.reading}/60</strong></span>
                      <span>Listening: <strong>{exam.breakdown.listening}/60</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">{exam.score}<span className="text-sm font-normal text-slate-400">/{exam.maxScore}</span></div>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">Qualified N5</span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>স্কোরকার্ড</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIGITAL STUDENT ID TAB */}
        {activeTab === 'idcard' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Official Digital Student ID Card</h2>
              <p className="text-xs text-slate-500">
                Institutional ID provided in partnership with Dhaka International Language School. Verifiable by employers and embassy authorities.
              </p>
            </div>
            <DigitalStudentIdCard student={studentData} />
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic Certificates & Official Verification</h2>
              <p className="text-xs text-slate-500">Authorized completion documents from Dhaka International Language School</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_CERTIFICATES.map((cert) => (
                <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {cert.certificateNumber}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-slate-900">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Issued: {cert.issueDate} • Level: {cert.level}</p>
                    <p className="text-xs text-slate-400 mt-1">{cert.authorizedSignatory}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verifiable Online</span>
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>সার্টিফিকেট ডাউনলোড</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">প্রোফাইল ও একাডেমিক তথ্য সম্পাদনা</h2>
              <p className="text-xs text-slate-500">আপনার ডিজিটাল আইডি ও সার্টিফিকেটের তথ্য আপডেট করুন</p>
            </div>

            {profileSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>প্রোফাইল সফলভাবে আপডেট হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম (English)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জাপানিজ নাম (Katakana)</label>
                  <input
                    type="text"
                    value={nameJa}
                    onChange={(e) => setNameJa(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান JLPT লেভেল</label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                  >
                    <option value="N5">JLPT N5</option>
                    <option value="N4">JLPT N4</option>
                    <option value="N3">JLPT N3</option>
                    <option value="N2">JLPT N2</option>
                    <option value="N1">JLPT N1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">টার্গেট পরীক্ষা</label>
                  <input
                    type="text"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার তারিখ</label>
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বরাদ্দকৃত শিক্ষক / সেনসেই</label>
                <input
                  type="text"
                  value={assignedTeacher}
                  onChange={(e) => setAssignedTeacher(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">সাবস্ক্রিপশন ও বিলিং ব্যবস্থাপনা</h2>
              <p className="text-xs text-slate-500">আপনার বর্তমান প্ল্যান পরিবর্তন বা AI ক্রেডিট টপ-আপ করুন</p>
            </div>

            {subUpdatedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>সাবস্ক্রিপশন প্ল্যান সফলভাবে পরিবর্তন করা হয়েছে!</span>
              </div>
            )}

            {/* Plan Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(Object.keys(PLAN_CONFIGS) as Array<'free' | 'starter' | 'pro' | 'vip'>).map((planKey) => {
                const plan = PLAN_CONFIGS[planKey];
                const isSelected = selectedPlanId === planKey;
                const isCurrent = subscriptionDetails?.planId === planKey;

                return (
                  <div
                    key={planKey}
                    onClick={() => setSelectedPlanId(planKey)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                      isSelected
                        ? 'border-red-600 bg-red-50/20 shadow-md ring-1 ring-red-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{plan.planId}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[9px] rounded">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{plan.planName}</h4>
                      <div className="text-lg font-black text-slate-900">
                        ৳{plan.priceBDT} <span className="text-xs font-normal text-slate-400">/মাস</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{plan.aiCreditsRemaining} AI Sensei Queries/মাস</p>
                      
                      <ul className="text-[10px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className={`w-full py-1.5 text-xs font-bold rounded-lg transition ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'নির্বাচিত' : 'বাছাই করুন'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Payment & Confirmation Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">পেমেন্ট মেথড বাছাই করুন</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl border-slate-200 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={selectedPaymentProvider === 'bkash'}
                    onChange={() => setSelectedPaymentProvider('bkash')}
                    className="text-red-600"
                  />
                  <span className="font-bold text-xs text-pink-600">bKash Payment</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl border-slate-200 hover:bg-slate-50">
                  <input
                    type="radio"
                    name="payment"
                    value="sslcommerz"
                    checked={selectedPaymentProvider === 'sslcommerz'}
                    onChange={() => setSelectedPaymentProvider('sslcommerz')}
                    className="text-red-600"
                  />
                  <span className="font-bold text-xs text-blue-600">SSLCommerz / Card</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500">টোটাল প্রতি মাসে:</span>
                  <div className="text-base font-extrabold text-slate-900">
                    ৳{PLAN_CONFIGS[selectedPlanId]?.priceBDT || 599} BDT
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => topUpCredits(50)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    +৫০ AI ক্রেডিট যোগ করুন
                  </button>

                  <button
                    onClick={handleSubscriptionChange}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    সাবস্ক্রিপশন নিশ্চিত করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INFINITE CONCEPT HUB (15 FORMATS) */}
        {activeTab === 'infinite_concept' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-left space-y-2 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-red-500/20 text-red-300 font-mono text-[10px] font-bold rounded-lg border border-red-500/30">
                  STUDENT 15-IN-1 LEARNING MATRIX
                </span>
                <span className="text-xs text-slate-400 font-mono">Dynamic Concept Synthesis</span>
              </div>
              <h2 className="text-xl font-bold text-white">Infinite Concept Studio™</h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Study any JLPT N5/N4/N3 grammar point, kanji character, or vocabulary word across 15 interactive pedagogical formats — from Tokyo baito roleplays and pitch accent shadowing to Leitner flashcards and Ghost Mode particle discrimination.
              </p>
            </div>
            <InfiniteConceptStudio />
          </div>
        )}
      </div>

      {/* Multimodal Voice Sensei Practice Modal */}
      {isVoiceActive && (
        <VoiceSenseiPractice
          isOpen={isVoiceActive}
          onClose={() => setIsVoiceActive(false)}
        />
      )}
    </div>
  );
};
