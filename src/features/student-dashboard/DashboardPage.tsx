import React, { useState } from 'react';
import { useStudentDashboard } from './useStudentDashboard';
import { ContinueLearningCard } from './components/ContinueLearningCard';
import { DailyPlan } from './components/DailyPlan';
import { DailyChallengeCard } from './components/DailyChallengeCard';
import { JLPTProgress } from './components/JLPTProgress';
import { StreakCard } from './components/StreakCard';
import { RecentMistakes } from './components/RecentMistakes';
import { VocabKanjiProgress } from './components/VocabKanjiProgress';
import { MobileBottomNavigation, NavTab } from './components/MobileBottomNavigation';
import { DashboardLoadingSkeleton, DashboardErrorView } from './components/UIStateViews';
import { AiSenseiModal } from './components/AiSenseiModal';
import { Lesson12PlayerModal } from './components/Lesson12PlayerModal';
import { MockExamRunnerView } from '../../views/MockExamRunnerView';
import { BaitoReadinessCard } from './components/BaitoReadinessCard';
import { KanjiPracticeModal } from './components/KanjiPracticeModal';
import { TokyoListeningModal } from './components/TokyoListeningModal';
import { VocabFlashcardModal } from './components/VocabFlashcardModal';
import { NihomiStoreModal, StorePackage } from './components/NihomiStoreModal';
import { CommunityLeaderboardView } from '../../views/CommunityLeaderboardView';
import { CoursesView } from '../../views/CoursesView';
import { VocabularyView } from '../../views/VocabularyView';
import { ProfileView } from '../../views/ProfileView';
import { ConbiniSimulatorModal } from './components/ConbiniSimulatorModal';
import { WritingPracticeModal } from './components/WritingPracticeModal';
import { InviteFriendsCard } from './components/InviteFriendsCard';
import { InstallPWA } from '../../components/common/InstallPWA';
import { OfflineNotificationBanner } from '../../components/common/OfflineNotificationBanner';
import { Mic, Camera, PenTool, Sparkles, ArrowRight, Loader2, Crown, Clock, CheckCircle2, Home, BookOpen, User, Compass, Flame, Coins, X } from 'lucide-react';
import { VisionSenseiModal } from '../../components/VisionSenseiModal';
import { VoiceSenseiPractice } from '../../components/practice/VoiceSenseiPractice';
import { ProUpgradeModal } from '../../components/billing/ProUpgradeModal';
import { useAuth } from '../../context/AuthContext';
import { TodaysMissionCard } from './components/TodaysMissionCard';
import { GoldenLearningLoopModal, NextExperienceData } from '../../components/learning/GoldenLearningLoopModal';
import { DigitalStudentIdCard } from '../../components/student/DigitalStudentIdCard';
import { AIUsageSummary } from './components/AIUsageSummary';
import { StudentProfile as DigitalStudentProfile } from '../../types/nihomi';

interface DashboardPageProps {
  onNavigateTab?: (tab: NavTab) => void;
  onNavigate?: (view: string) => void;
  onResumeLesson?: (lessonId: string) => void;
  onOpenMistakeBook?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
  onNavigate,
  onResumeLesson,
  onOpenMistakeBook,
}) => {
  const {
    data,
    viewState,
    toastMessage,
    refresh,
    toggleDailyTask,
    handleStartChallenge,
    handleUseAiCredit,
    handleCompleteLesson,
    handleMockExamCompleted,
    handleKanjiPracticeComplete,
    handleListeningComplete,
    handleVocabularyComplete,
    handleStorePurchase,
    handleFocusSessionComplete,
    handleBaitoTransactionComplete,
    handleWritingPracticeComplete,
    showToast,
  } = useStudentDashboard();
  const { user, refreshSubscription, refreshProgress } = useAuth();

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);

  const desktopTabs: { id: NavTab; label: string; labelJa: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', labelJa: 'ホーム', icon: Home },
    { id: 'learn', label: 'Learn', labelJa: '学ぶ', icon: BookOpen },
    { id: 'practice', label: 'Practice', labelJa: '練習', icon: CheckCircle2 },
    { id: 'ai', label: 'AI Sensei', labelJa: 'AI', icon: Sparkles },
    { id: 'profile', label: 'Profile', labelJa: 'マイページ', icon: User },
  ];

  const isPro =
    user?.role === 'founder' ||
    user?.role === 'admin' ||
    user?.planId === 'pro' ||
    user?.planId === 'japan_ready' ||
    (user as any)?.subscription?.planId === 'pro' ||
    (user as any)?.subscription?.planId === 'japan_ready' ||
    (user as any)?.subscription?.status === 'active';
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);
  const [isKanjiPracticeOpen, setIsKanjiPracticeOpen] = useState(false);
  const [isListeningOpen, setIsListeningOpen] = useState(false);
  const [isVocabularyOpen, setIsVocabularyOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [showDailyGoalCelebration, setShowDailyGoalCelebration] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const [isConbiniOpen, setIsConbiniOpen] = useState(false);
  const [isWritingOpen, setIsWritingOpen] = useState(false);
  const [baitoReadinessScore, setBaitoReadinessScore] = useState(74);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [dashboardQuery, setDashboardQuery] = useState('');
  const [isSearchingSensei, setIsSearchingSensei] = useState(false);
  const [senseiSearchResult, setSenseiSearchResult] = useState<string | null>(null);
  const [pendingTrx, setPendingTrx] = useState<any | null>(null);
  const [isGoldenLoopOpen, setIsGoldenLoopOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<NextExperienceData | null>(null);
  const [isIdOpen, setIsIdOpen] = useState(false);

  // Poll for pending manual bKash/Nagad submission verification
  React.useEffect(() => {
    let isMounted = true;
    const checkPendingSubmission = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (user?.id) queryParams.set('userId', user.id);
        if (user?.email) queryParams.set('email', user.email);

        const res = await fetch(`/api/payment/manual/my-pending?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            if (json.pending) {
              setPendingTrx(json.pending);
            } else {
              setPendingTrx(null);
            }
          }
        }
      } catch {
        // silent
      }
    };

    checkPendingSubmission();
    const interval = setInterval(checkPendingSubmission, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id, user?.email]);

  const handleSenseiSearch = async (q?: string) => {
    const textToSearch = q !== undefined ? q : dashboardQuery;
    if (!textToSearch.trim() || isSearchingSensei) return;

    setIsSearchingSensei(true);
    setSenseiSearchResult(null);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSearch,
          context: 'Student dashboard quick inquiry. Explain concisely in Bengali with Joyo furigana and Japanese examples.'
        })
      });
      if (res.ok) {
        const json = await res.json();
        setSenseiSearchResult(json.reply || json.response || json.text || 'Sensei is ready to guide you!');
      } else {
        setSenseiSearchResult('Sensei answers: ' + textToSearch + ' — Open AI Tutor drawer for personalized drill.');
      }
    } catch {
      setSenseiSearchResult('Sensei answers: ' + textToSearch + ' — Connect with AI Tutor for full discussion.');
    } finally {
      setIsSearchingSensei(false);
    }
  };

  React.useEffect(() => {
    const handleFocusComplete = () => { void handleFocusSessionComplete(); };
    window.addEventListener('nihomi-focus-complete', handleFocusComplete);
    return () => window.removeEventListener('nihomi-focus-complete', handleFocusComplete);
  }, [handleFocusSessionComplete]);

  React.useEffect(() => {
    if (!data || celebrationShown) return;
    const goalTypes = new Set(['vocabulary', 'grammar', 'listening', 'challenge']);
    const isComplete = data.dailyPlan.filter((item) => goalTypes.has(item.type)).every((item) => item.status === 'completed');
    if (isComplete) {
      setShowDailyGoalCelebration(true);
      setCelebrationShown(true);
    }
  }, [data, celebrationShown]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'ai') {
      setIsAiTutorOpen(true);
      return;
    }
    if (tab === 'learn' || tab === 'profile') return;
    if (tab === 'practice') {
      showToast('Practice মডিউলে স্বাগতম! কাঞ্জি ও ব্যাকরণ ড্রিল শুরু করুন');
      return;
    }
    onNavigateTab?.(tab);
  };

  const handleEmbeddedNavigate = (view: string) => {
    if (view === 'dashboard' || view === 'home' || view === 'portal') setActiveTab('home');
    else if (view === 'courses') setActiveTab('learn');
    else if (view === 'profile' || view === 'portal-settings') setActiveTab('profile');
    else if (view === 'practice' || view === 'quizzes') setActiveTab('practice');
    else onNavigate?.(view);
  };

  const renderEmbeddedTab = () => {
    if (activeTab === 'learn') return <CoursesView onNavigate={handleEmbeddedNavigate} />;
    if (activeTab === 'practice') return <VocabularyView onNavigate={handleEmbeddedNavigate} />;
    return <ProfileView onNavigate={handleEmbeddedNavigate} />;
  };

  const handleResume = (lessonId: string) => {
    if (lessonId === 'les_n5_012' || lessonId === 'lesson-12') {
      setIsLessonOpen(true);
    } else {
      onResumeLesson?.(lessonId);
      showToast(`লেসন ${lessonId} চালু হচ্ছে...`);
    }
  };

  const handleOpenMistakeBookClick = () => {
    if (onOpenMistakeBook) {
      onOpenMistakeBook();
    } else {
      showToast('NIHOMI MemoryOS: ব্যক্তিগত ভুলের খাতা খোলা হচ্ছে...');
    }
  };

  if (isMockExamOpen) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-4">
          <button type="button" onClick={() => setIsMockExamOpen(false)} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500">
            ← Dashboard
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">N5 Mock Exam</span>
        </div>
        <MockExamRunnerView
          examId="mock-exam-jlpt-n5-01"
          onNavigate={() => setIsMockExamOpen(false)}
          onAttemptCompleted={handleMockExamCompleted}
        />
      </div>
    );
  }

  if (activeTab !== 'home' && activeTab !== 'ai') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 pb-28 md:pb-12 selection:bg-rose-100 selection:text-rose-900">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200/90 bg-white/95 px-4 sm:px-6 py-3 backdrop-blur-md shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-800 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <span>← Home (ホーム)</span>
            </button>
            <span className="text-xs font-bold text-stone-500 hidden sm:inline">
              Nihomi {activeTab === 'learn' ? '学ぶ (Learn)' : activeTab === 'practice' ? '練習 (Practice)' : 'マイページ (Profile)'}
            </span>
          </div>

          {/* Desktop Sub Navigation */}
          <nav aria-label="Desktop Sub Navigation" className="hidden md:flex items-center gap-1 bg-stone-100/90 dark:bg-stone-800/90 p-1.5 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
            {desktopTabs.map((t) => {
              const isActive = activeTab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  id={`desktop-sub-tab-${t.id}`}
                  type="button"
                  onClick={() => handleTabChange(t.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer select-none ${
                    isActive ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-2xs font-bold' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-stone-400'}`} />
                  <span>{t.label}</span>
                  <span className="text-[10px] text-stone-400 font-normal">({t.labelJa})</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {renderEmbeddedTab()}
        </div>
        <MobileBottomNavigation currentTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  const digitalStudent: DigitalStudentProfile = {
    id: data?.student.id || user?.studentId || user?.id || 'NHO-100001',
    nihomiAccountId: user?.nihomiAccountId || `ACC-${(data?.student.id || user?.id || '1001').slice(-4)}`,
    name: user?.name || data?.student.name || 'Nihomi Student',
    nameJa: user?.nameJa || '日本語学習者',
    email: user?.email || `${data?.student.id || 'std'}@student.nihomi.com`,
    avatarUrl: user?.avatarUrl || '',
    enrolledDate: user?.createdAt ? user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    currentLevel: (user?.currentLevel as any) || (data?.student.jlptLevel as any) || 'N5',
    targetLevel: (user?.targetLevel as any) || 'N4',
    streakDays: data?.streak.currentStreak || user?.streakDays || 1,
    totalStudyHours: 0,
    tier: (user?.planId as any) || (isPro ? 'pro' : 'starter')
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-stone-900 font-sans antialiased pb-24 md:pb-12 selection:bg-rose-100 selection:text-rose-900">
      <OfflineNotificationBanner />

      {/* Unified Apple-Style Sticky Top Navigation Bar */}
      {viewState === 'idle' && data && (
        <header
          id="student-dashboard-unified-nav"
          aria-label="Student Unified Navigation"
          className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800 transition-colors shadow-xs"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            {/* Left: Brand + Student Identity */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-xs font-black text-sm shrink-0 select-none">
                日
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black tracking-tight text-stone-900 dark:text-white truncate">
                    NIHOMI AI™
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 shrink-0">
                    JLPT {data.student.jlptLevel}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium truncate">
                  おはよう, {data.student.name.split(' ')[0]} • Day {data.student.journeyDay}
                </div>
              </div>
            </div>

            {/* Center: Desktop Segmented Pill Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 dark:bg-stone-800/90 p-1 rounded-xl border border-stone-200/60 dark:border-stone-700/60" aria-label="Desktop Tabs">
              {desktopTabs.map((t) => {
                const isActive = activeTab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    id={`desktop-tab-${t.id}`}
                    type="button"
                    onClick={() => handleTabChange(t.id)}
                    className={`btn-haptic inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-stone-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Streak, Currency, ID, Pro, AI Coach */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                title={`${data.streak.currentStreak} Day Streak`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black select-none"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{data.streak.currentStreak}d</span>
              </div>

              <AIUsageSummary
                usage={data.accountUsage}
                onOpenAiTutor={() => setIsAiTutorOpen(true)}
                onOpenStore={() => setIsStoreOpen(true)}
              />

              <button
                type="button"
                onClick={() => setIsIdOpen(true)}
                className="btn-haptic inline-flex items-center gap-1 rounded-lg bg-stone-900 dark:bg-stone-800 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 dark:hover:bg-stone-700 cursor-pointer"
                title="Digital Student ID Card"
              >
                <span>🪪</span>
                <span className="hidden sm:inline">ID</span>
              </button>

              {!isPro ? (
                <button
                  id="btn-header-upgrade-pro"
                  type="button"
                  onClick={() => setIsProModalOpen(true)}
                  className="btn-haptic inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-3 py-1.5 text-xs font-black shadow-xs cursor-pointer"
                  title="Nihomi Pro — Unlock All Lessons"
                >
                  <Crown className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                  <span>PRO</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black select-none">
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>PRO</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsAiTutorOpen(true)}
                className="btn-haptic hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-900/50 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>AI Sensei</span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        
        {viewState === 'loading' && <DashboardLoadingSkeleton />}

        {viewState === 'error' && (
          <DashboardErrorView onRetry={refresh} />
        )}

        {viewState === 'idle' && data && (
          <>
            {/* Top Priority Banners & Focal Hero Action */}
            <div className="space-y-4">
              {/* Manual Payment (bKash/Nagad) Verification in Progress Alert */}
              {pendingTrx && !isPro && (
                <div id="banner-manual-payment-verifying" className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 flex items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                    <span>Payment Verifying • Pro unlocks automatically in 5–15 mins.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-200 text-amber-900 shrink-0">
                    TrxID: {pendingTrx.trxID || pendingTrx.id}
                  </span>
                </div>
              )}

              {/* ★ PRIMARY FOCAL POINT: Nihomi Sensei AI™ Today's Mission (The Reels Principle — one action at a time) */}
              <TodaysMissionCard
                userId={user?.id}
                onStartMission={(exp) => {
                  setSelectedMission(exp || null);
                  setIsGoldenLoopOpen(true);
                }}
              />

              {/* Nihomi Pro™ — Subtle secondary pill (not the hero) */}
              {!isPro && (
                <section
                  id="dashboard-pro-upgrade-card"
                  aria-label="Nihomi Pro Upgrade"
                  className="relative overflow-hidden rounded-2xl bg-white border border-amber-200/80 p-3.5 sm:p-4 shadow-xs"
                >
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-800">Unlock All 25 Lessons + Infinite AI Drills</p>
                        <p className="text-[11px] text-stone-400">JLPT N5 full mastery · Kanji canvas · Baito simulation</p>
                      </div>
                    </div>
                    <button
                      id="btn-dashboard-upgrade-pro"
                      type="button"
                      onClick={() => setIsProModalOpen(true)}
                      className="btn-haptic w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs tracking-wide shadow-sm shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Crown className="w-3 h-3 text-stone-950 fill-stone-950" />
                      <span>PRO → ৳৫৯৯/mo</span>
                    </button>
                  </div>
                </section>
              )}
            </div>

            {/* Responsive Desktop 12-Column Grid (8 cols Main Learning, 4 cols Progress & Stats) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Primary Learning Flow (8 cols on desktop) */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Quick-Access Sensor Actions: Voice, Photo OCR, Kanji Canvas */}
                <section className="bg-white rounded-2xl px-4 py-3 border border-stone-200/90 shadow-xs flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap" aria-label="Nihomi Quick Actions">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 hidden sm:inline">Quick Actions</span>
                    <button
                      id="btn-dashboard-voice"
                      type="button"
                      onClick={() => setIsVoiceOpen(true)}
                      className="btn-haptic inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9FB] hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-red-500" />
                      <span>Voice</span>
                    </button>
                    <button
                      id="btn-dashboard-photo-ocr"
                      type="button"
                      onClick={() => setIsVisionOpen(true)}
                      className="btn-haptic inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9FB] hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-500" />
                      <span>Photo OCR</span>
                    </button>
                    <button
                      id="btn-dashboard-kanji-canvas"
                      type="button"
                      onClick={() => setIsWritingOpen(true)}
                      className="btn-haptic inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9FB] hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kanji Canvas</span>
                    </button>
                  </div>
                  <button
                    id="btn-dashboard-open-ai-tutor"
                    type="button"
                    onClick={() => setIsAiTutorOpen(true)}
                    className="btn-haptic inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm shadow-rose-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Tutor</span>
                  </button>
                </section>

                {/* Sensei Search Result (only shown when a result is available) */}
                {senseiSearchResult && (
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs text-xs text-stone-800 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between font-bold text-[10px] text-stone-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-rose-500" />Nihomi Sensei Advice</span>
                      <button type="button" onClick={() => setSenseiSearchResult(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">×</button>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{senseiSearchResult}</p>
                  </div>
                )}

                {/* ২. হিরো লেসন - শেখা চালিয়ে যান */}
                <ContinueLearningCard
                  lesson={data.continueLesson}
                  onResumeLesson={handleResume}
                />

                {/* ৩. ইন্টারঅ্যাকটিভ আজকের লক্ষ্য (ক্লিক করলেই প্রগ্রেস বাড়ে) */}
                <DailyPlan
                  planItems={data.dailyPlan}
                  onSelectTask={(id) => toggleDailyTask(id)}
                  onOpenVocabulary={() => setIsVocabularyOpen(true)}
                  onOpenListening={() => setIsListeningOpen(true)}
                />

                {/* ৫. শব্দ ও কাঞ্জি অগ্রগতি */}
                <VocabKanjiProgress
                  vocabulary={data.vocabularyProgress}
                  kanji={data.kanjiProgress}
                  onPracticeKanji={() => setIsKanjiPracticeOpen(true)}
                  onPracticeVocabulary={() => setIsVocabularyOpen(true)}
                  onPracticeWriting={() => setIsWritingOpen(true)}
                />

                {/* ৯. ভুলের খাতা (MemoryOS) */}
                <RecentMistakes
                  mistakes={data.recentMistakes}
                  onOpenMistakeBook={handleOpenMistakeBookClick}
                />
              </div>

              {/* Right Column: Gamification, Streaks, Tests & Community (4 cols on desktop) */}
              <div className="lg:col-span-4 space-y-6">
                {/* ১. ডিজিটাল লার্নিং পাসপোর্ট (Digital Student Identity) */}
                <DigitalStudentIdCard student={digitalStudent} />

                {/* ৭. ধারাবাহিকতা / স্ট্রাইক */}
                <StreakCard streak={data.streak} onOpenLeaderboard={() => setIsLeaderboardOpen(true)} />

                {/* ৪. রিয়েল ডেইলি চ্যালেঞ্জ ও কয়েন পুরষ্কার */}
                <DailyChallengeCard
                  challenge={data.dailyChallenge}
                  onCompleteChallenge={() => handleStartChallenge()}
                />

                {/* ৬. JLPT প্রস্তুতি রেডিনেস */}
                <JLPTProgress progress={data.jlptProgress} onTakeMockExam={() => setIsMockExamOpen(true)} />

                {/* NIHOMI WORKOS™ প্রস্তুতি */}
                <BaitoReadinessCard 
                  onLaunch={() => {
                    if (onNavigate) {
                      onNavigate('baito');
                    } else {
                      setIsConbiniOpen(true);
                    }
                  }} 
                  onLaunchConbini={() => setIsConbiniOpen(true)} 
                  readinessScore={baitoReadinessScore} 
                />

                {/* ৮. ভাইরাল রেফারেল ও রিওয়ার্ড লুপ (Invite Friends) */}
                <InviteFriendsCard
                  studentId={data.student?.id}
                  studentName={data.student?.name}
                  nihomiAccountId={data.student?.nihomiAccountId}
                />
              </div>

            </div>
          </>
        )}

        {/* টোস্ট মেসেজ */}
        {toastMessage && (
          <div 
            role="status"
            aria-live="polite"
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-white/10 animate-fade-in"
          >
            {toastMessage}
          </div>
        )}
      </main>

      {/* ✨ FLOATING AI SENSEI PILL (Premium WhatsApp/Apple-style input at bottom) */}
      {viewState === 'idle' && data && (
        <div className="fixed bottom-[72px] md:bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-xl shadow-stone-900/10 rounded-2xl px-3 py-2.5">
            {/* Sensei Avatar Pulse */}
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm leading-none">日</span>
              </div>
              {isSearchingSensei && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
              )}
            </div>
            {/* Input */}
            <div className="relative flex-1">
              <input
                id="input-floating-sensei"
                type="text"
                value={dashboardQuery}
                onChange={(e) => setDashboardQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSenseiSearch(); }}
                placeholder={isSearchingSensei ? 'Sensei is thinking...' : 'Ask Sensei anything...'}
                disabled={isSearchingSensei}
                className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none disabled:opacity-60"
              />
            </div>
            {/* Send button */}
            <button
              type="button"
              onClick={() => handleSenseiSearch()}
              disabled={isSearchingSensei || !dashboardQuery.trim()}
              className="btn-haptic shrink-0 w-8 h-8 rounded-xl bg-stone-900 hover:bg-rose-600 disabled:opacity-30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Ask Sensei"
            >
              {isSearchingSensei
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <ArrowRight className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        </div>
      )}

      {/* মোবাইল বটম বার */}
      <MobileBottomNavigation
        currentTab={activeTab}
        onTabChange={handleTabChange}
      />
      <AiSenseiModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        onNavigateSubscription={() => onNavigate?.('pricing')}
      />
      <GoldenLearningLoopModal
        isOpen={isGoldenLoopOpen}
        onClose={() => setIsGoldenLoopOpen(false)}
        experience={selectedMission}
        onNavigate={onNavigate}
        onSuccessReward={(coins, xp) => {
          showToast(`মিশন সম্পন্ন! +${coins} Coins ও +${xp} XP যুক্ত হয়েছে।`);
          refresh();
        }}
      />
      <Lesson12PlayerModal
        isOpen={isLessonOpen}
        onClose={() => setIsLessonOpen(false)}
        onComplete={async () => {
          await handleCompleteLesson(data?.continueLesson?.lessonId || 'les_n5_012');
          setIsLessonOpen(false);
        }}
      />
      {showDailyGoalCelebration && (
        <div className="fixed inset-x-3 top-4 z-40 mx-auto max-w-md animate-in slide-in-from-top-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 shadow-lg" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-extrabold">Today's Goal 100% Complete!</p><p className="text-xs font-semibold text-emerald-700">Streak +1 Day • আজকের সব লক্ষ্য শেষ</p></div>
            <button type="button" aria-label="Celebration বন্ধ করুন" onClick={() => setShowDailyGoalCelebration(false)} className="rounded-full p-1 text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">×</button>
          </div>
        </div>
      )}
      <KanjiPracticeModal
        isOpen={isKanjiPracticeOpen}
        onClose={() => setIsKanjiPracticeOpen(false)}
        onSuccessfulTrace={handleKanjiPracticeComplete}
      />
      <TokyoListeningModal
        isOpen={isListeningOpen}
        onClose={() => setIsListeningOpen(false)}
        onComplete={handleListeningComplete}
      />
      <VocabFlashcardModal
        isOpen={isVocabularyOpen}
        onClose={() => setIsVocabularyOpen(false)}
        onComplete={handleVocabularyComplete}
      />
      <ConbiniSimulatorModal
        isOpen={isConbiniOpen}
        onClose={() => setIsConbiniOpen(false)}
        onComplete={async (score) => { await handleBaitoTransactionComplete(); setBaitoReadinessScore((current) => Math.min(100, current + (score >= 80 ? 4 : 2))); }}
      />
      <WritingPracticeModal
        isOpen={isWritingOpen}
        onClose={() => setIsWritingOpen(false)}
        onComplete={(character) => { void handleWritingPracticeComplete(character); setIsWritingOpen(false); }}
      />
      <NihomiStoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        onPurchase={async (pack: StorePackage) => { await handleStorePurchase(pack); }}
      />
      {isVisionOpen && (
        <VisionSenseiModal
          isOpen={isVisionOpen}
          onClose={() => setIsVisionOpen(false)}
        />
      )}
      {isVoiceOpen && (
        <VoiceSenseiPractice
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
        />
      )}
      {isLeaderboardOpen && <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 p-2 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsLeaderboardOpen(false); }}><section className="relative mx-auto max-w-5xl rounded-3xl bg-[#FAF9F6]" role="dialog" aria-modal="true" aria-labelledby="dashboard-leaderboard-title"><button type="button" aria-label="Leaderboard বন্ধ করুন" onClick={() => setIsLeaderboardOpen(false)} className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500">×</button><h2 id="dashboard-leaderboard-title" className="sr-only">Community Leaderboard</h2><CommunityLeaderboardView onNavigate={() => setIsLeaderboardOpen(false)} /></section></div>}

      {/* Global Pro Upgrade Modal for Student Dashboard */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        defaultPlanInterval="monthly"
        onSuccess={() => {
          setIsProModalOpen(false);
          refresh();
          refreshProgress();
          refreshSubscription();
        }}
      />

      {/* Autonomous Golden Learning Loop & Mastery Modal */}
      {isGoldenLoopOpen && (
        <GoldenLearningLoopModal
          isOpen={isGoldenLoopOpen}
          onClose={() => setIsGoldenLoopOpen(false)}
          experience={selectedMission}
          onMasteryComplete={() => {
            refresh();
            refreshProgress();
          }}
          onExploreTokyo={() => {
            setIsGoldenLoopOpen(false);
            if (onNavigate) onNavigate('japan-twin');
          }}
        />
      )}

      {/* Digital Student ID Card Modal */}
      {isIdOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsIdOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="student-id-title" className="relative w-full max-w-sm">
            <div className="sr-only" id="student-id-title">Digital Student ID Card</div>
            <button
              type="button"
              aria-label="Close ID card"
              onClick={() => setIsIdOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-hidden cursor-pointer"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <DigitalStudentIdCard student={digitalStudent} />
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;