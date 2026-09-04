import React, { useState, useEffect } from 'react';
import { DashboardApiResponse, DashboardViewState } from './types';
import { mockDashboardData, mockEmptyDashboardData } from './mockData';
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
  initialData?: DashboardApiResponse;
  onNavigateTab?: (tab: NavTab) => void;
  onResumeLesson?: (lessonId: string) => void;
  onStartChallenge?: (challengeId: string) => void;
  onOpenMistakeBook?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  initialData,
  onNavigateTab,
  onResumeLesson,
  onStartChallenge,
  onOpenMistakeBook,
}) => {
  const [data, setData] = useState<DashboardApiResponse | null>(initialData || null);
  const [viewState, setViewState] = useState<DashboardViewState>(initialData ? 'idle' : 'loading');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  useEffect(() => {
    if (!initialData) {
      const timer = setTimeout(() => {
        setData(mockDashboardData);
        setViewState('idle');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    onNavigateTab?.(tab);
    if (tab !== 'home') {
      showToast(`Navigated to ${tab.toUpperCase()} module`);
    }
  };

  const handleResume = (lessonId: string) => {
    onResumeLesson?.(lessonId);
    showToast(`Resuming lesson: ${lessonId}`);
  };

  const handleStartChallenge = (challengeId: string) => {
    onStartChallenge?.(challengeId);
    showToast(`Launching Daily Challenge: ${challengeId}`);
  };

  const handleOpenMistakeBook = () => {
    onOpenMistakeBook?.();
    showToast('Connecting to NIHOMI MemoryOS Mistake Book...');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-24">
      <main className="max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 pt-3 space-y-4">
        
        {/* State Toggle for Testing & Dev Verification */}
        <aside 
          aria-label="Demo Prototype Controls"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-200/70 text-[11px] text-stone-600 font-medium"
        >
          <span className="font-semibold text-stone-700">NIHOMI View:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setViewState('idle'); setData(mockDashboardData); }}
              className={`px-2 py-0.5 rounded ${viewState === 'idle' && data?.continueLesson ? 'bg-white text-stone-900 shadow-sm font-bold' : 'hover:text-stone-900'}`}
            >
              Active
            </button>
            <button
              onClick={() => { setViewState('loading'); setTimeout(() => setViewState('idle'), 800); }}
              className={`px-2 py-0.5 rounded ${viewState === 'loading' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'hover:text-stone-900'}`}
            >
              Loading
            </button>
            <button
              onClick={() => { setViewState('idle'); setData(mockEmptyDashboardData); }}
              className={`px-2 py-0.5 rounded ${data?.continueLesson === null ? 'bg-white text-stone-900 shadow-sm font-bold' : 'hover:text-stone-900'}`}
            >
              Empty
            </button>
            <button
              onClick={() => setViewState('error')}
              className={`px-2 py-0.5 rounded ${viewState === 'error' ? 'bg-white text-rose-700 shadow-sm font-bold' : 'hover:text-stone-900'}`}
            >
              Error
            </button>
          </div>
        </aside>

        {viewState === 'loading' && <DashboardLoadingSkeleton />}

        {viewState === 'error' && (
          <DashboardErrorView 
            onRetry={() => {
              setViewState('loading');
              setTimeout(() => {
                setData(mockDashboardData);
                setViewState('idle');
              }, 400);
            }} 
          />
        )}

        {viewState === 'idle' && data && (
          <>
            <StudentHeader 
              student={data.student} 
              accountUsage={data.accountUsage} 
            />

            <ContinueLearningCard
              lesson={data.continueLesson}
              onResumeLesson={handleResume}
            />

            <DailyPlan
              planItems={data.dailyPlan}
              onSelectTask={(id) => showToast(`Selected task: ${id}`)}
            />

            <DailyChallengeCard
              challenge={data.dailyChallenge}
              onStartChallenge={handleStartChallenge}
            />

            <VocabKanjiProgress
              vocabulary={data.vocabularyProgress}
              kanji={data.kanjiProgress}
            />

            <JLPTProgress progress={data.jlptProgress} />

            <StreakCard streak={data.streak} />

            <RecentMistakes
              mistakes={data.recentMistakes}
              onOpenMistakeBook={handleOpenMistakeBook}
            />
          </>
        )}

        {feedbackToast && (
          <div 
            role="status"
            aria-live="polite"
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-stone-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-white/10"
          >
            {feedbackToast}
          </div>
        )}
      </main>

      <MobileBottomNavigation
        currentTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default DashboardPage;