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
    showToast,
  } = useStudentDashboard();

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);
  const [isKanjiPracticeOpen, setIsKanjiPracticeOpen] = useState(false);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'ai') {
      setIsAiTutorOpen(true);
      return;
    }
    onNavigateTab?.(tab);
    if (tab === 'practice') {
      showToast('Practice মডিউলে স্বাগতম! কাঞ্জি ও ব্যাকরণ ড্রিল শুরু করুন');
    } else if (tab !== 'home') {
      showToast(`${tab.toUpperCase()} সেকশনে প্রবেশ করেছেন`);
    }
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-24 selection:bg-rose-100 selection:text-rose-900">
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
            />

            {/* ৬. JLPT প্রস্তুতি রেডিনেস */}
            <JLPTProgress progress={data.jlptProgress} onTakeMockExam={() => setIsMockExamOpen(true)} />

            <BaitoReadinessCard onLaunch={() => onNavigate?.('baito-os')} />

            {/* ৭. ধারাবাহিকতা / স্ট্রাইক */}
            <StreakCard streak={data.streak} />

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
      <KanjiPracticeModal
        isOpen={isKanjiPracticeOpen}
        onClose={() => setIsKanjiPracticeOpen(false)}
        onSuccessfulTrace={handleKanjiPracticeComplete}
      />
    </div>
  );
};

export default DashboardPage;