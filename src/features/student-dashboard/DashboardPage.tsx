import React, { useState } from 'react';
import { useStudentDashboard } from './useStudentDashboard';
import { StudentHeader } from './components/StudentHeader';
import { ContinueLearningCard } from './components/ContinueLearningCard';
import { DailyPlan } from './components/DailyPlan';
import { DailyChallengeCard } from './components/DailyChallengeCard';
import { JLPTProgress } from './components/JLPTProgress';
import { StreakCard } from './components/StreakCard';
import { RecentMistakes } from './components/RecentMistakes';
import { VocabKanjiProgress } from './components/VocabKanjiProgress';
import { MobileBottomNavigation, NavTab } from './components/MobileBottomNavigation';
import { DashboardLoadingSkeleton, DashboardErrorView } from './components/UIStateViews';
import { AiSenseiDrawer } from './components/AiSenseiDrawer';
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
import { InstallPWA } from '../../components/common/InstallPWA';
import { OfflineNotificationBanner } from '../../components/common/OfflineNotificationBanner';

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

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
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
    return <div className="min-h-screen bg-stone-50 pb-20"><div className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur"><button type="button" onClick={() => setActiveTab('home')} className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-rose-500">← Home</button><span className="text-xs font-bold text-stone-500">Nihomi 学ぶ</span></div>{renderEmbeddedTab()}<MobileBottomNavigation currentTab={activeTab} onTabChange={handleTabChange} /></div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-24 selection:bg-rose-100 selection:text-rose-900">
      <OfflineNotificationBanner />
      <InstallPWA />
      <main className="max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 pt-3 space-y-4">
        
        {viewState === 'loading' && <DashboardLoadingSkeleton />}

        {viewState === 'error' && (
          <DashboardErrorView onRetry={refresh} />
        )}

        {viewState === 'idle' && data && (
          <>
            {/* ১. স্টুডেন্ট ওয়েলকাম ও আসল কয়েন/ক্রেডিট */}
            <StudentHeader 
              student={data.student} 
              accountUsage={data.accountUsage} 
              onOpenAiTutor={() => setIsAiTutorOpen(true)}
              onOpenStore={() => setIsStoreOpen(true)}
              activeStreak={data.streak.currentStreak}
            />

            {/* ২. হিরো লেসন - শেখা চালিয়ে যান */}
            <ContinueLearningCard
              lesson={data.continueLesson}
              onResumeLesson={handleResume}
            />

            {/* ৩. ইন্টারঅ্যাকটিভ আজকের লক্ষ্য (ক্লিক করলেই প্রগ্রেস বাড়ে) */}
            <DailyPlan
              planItems={data.dailyPlan}
              onSelectTask={(id) => toggleDailyTask(id)}
              onOpenVocabulary={() => setIsVocabularyOpen(true)}
              onOpenListening={() => setIsListeningOpen(true)}
            />

            {/* ৪. রিয়েল ডেইলি চ্যালেঞ্জ ও কয়েন পুরষ্কার */}
            <DailyChallengeCard
              challenge={data.dailyChallenge}
              onCompleteChallenge={() => handleStartChallenge()}
            />

            {/* ৫. শব্দ ও কাঞ্জি অগ্রগতি */}
            <VocabKanjiProgress
              vocabulary={data.vocabularyProgress}
              kanji={data.kanjiProgress}
              onPracticeKanji={() => setIsKanjiPracticeOpen(true)}
              onPracticeVocabulary={() => setIsVocabularyOpen(true)}
              onPracticeWriting={() => setIsWritingOpen(true)}
            />

            {/* ৬. JLPT প্রস্তুতি রেডিনেস */}
            <JLPTProgress progress={data.jlptProgress} onTakeMockExam={() => setIsMockExamOpen(true)} />

            <BaitoReadinessCard onLaunch={() => setIsConbiniOpen(true)} onLaunchConbini={() => setIsConbiniOpen(true)} readinessScore={baitoReadinessScore} />

            {/* ৭. ধারাবাহিকতা / স্ট্রাইক */}
            <StreakCard streak={data.streak} onOpenLeaderboard={() => setIsLeaderboardOpen(true)} />

            {/* ৮. ভুলের খাতা (MemoryOS) */}
            <RecentMistakes
              mistakes={data.recentMistakes}
              onOpenMistakeBook={handleOpenMistakeBookClick}
            />
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

      {/* মোবাইল বটম বার */}
      <MobileBottomNavigation
        currentTab={activeTab}
        onTabChange={handleTabChange}
      />
      {data && (
        <AiSenseiDrawer
          isOpen={isAiTutorOpen}
          creditsRemaining={data.accountUsage.aiCreditsRemaining}
          onUseCredit={handleUseAiCredit}
          onClose={() => setIsAiTutorOpen(false)}
        />
      )}
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
      {isLeaderboardOpen && <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 p-2 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsLeaderboardOpen(false); }}><section className="relative mx-auto max-w-5xl rounded-3xl bg-[#FAF9F6]" role="dialog" aria-modal="true" aria-labelledby="dashboard-leaderboard-title"><button type="button" aria-label="Leaderboard বন্ধ করুন" onClick={() => setIsLeaderboardOpen(false)} className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500">×</button><h2 id="dashboard-leaderboard-title" className="sr-only">Community Leaderboard</h2><CommunityLeaderboardView onNavigate={() => setIsLeaderboardOpen(false)} /></section></div>}
    </div>
  );
};

export default DashboardPage;