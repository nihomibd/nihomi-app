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

interface DashboardPageProps {
  onNavigateTab?: (tab: NavTab) => void;
  onResumeLesson?: (lessonId: string) => void;
  onOpenMistakeBook?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateTab,
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
    showToast,
  } = useStudentDashboard();

  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    onNavigateTab?.(tab);
    if (tab === 'practice') {
      showToast('Practice মডিউলে স্বাগতম! কাঞ্জি ও ব্যাকরণ ড্রিল শুরু করুন');
    } else if (tab === 'ai') {
      showToast('AI Sensei সক্রিয় হচ্ছে...');
    } else if (tab !== 'home') {
      showToast(`${tab.toUpperCase()} সেকশনে প্রবেশ করেছেন`);
    }
  };

  const handleResume = (lessonId: string) => {
    onResumeLesson?.(lessonId);
    showToast(`লেসন ${lessonId} চালু হচ্ছে...`);
  };

  const handleOpenMistakeBookClick = () => {
    if (onOpenMistakeBook) {
      onOpenMistakeBook();
    } else {
      showToast('NIHOMI MemoryOS: ব্যক্তিগত ভুলের খাতা খোলা হচ্ছে...');
    }
  };

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
              onStartChallenge={handleStartChallenge}
            />

            {/* ৫. শব্দ ও কাঞ্জি অগ্রগতি */}
            <VocabKanjiProgress
              vocabulary={data.vocabularyProgress}
              kanji={data.kanjiProgress}
            />

            {/* ৬. JLPT প্রস্তুতি রেডিনেস */}
            <JLPTProgress progress={data.jlptProgress} />

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
    </div>
  );
};

export default DashboardPage;