import React, { useState } from 'react';
import { DashboardPage } from '../features/student-dashboard';
import { NavTab } from '../features/student-dashboard/components/MobileBottomNavigation';
import { MemoryOsView } from './MemoryOsView';

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [showMemoryOs, setShowMemoryOs] = useState<boolean>(false);

  const handleResumeLesson = (lessonId: string) => {
    if (onNavigate) {
      onNavigate(`lesson/${lessonId}`);
    }
  };

  const handleNavigateTab = (tab: NavTab) => {
    if (tab === 'practice' && onNavigate) {
      onNavigate('practice');
    } else if (tab === 'learn' && onNavigate) {
      onNavigate('courses');
    } else if (tab === 'profile' && onNavigate) {
      onNavigate('profile');
    }
  };

  const handleOpenMistakeBook = () => {
    if (onNavigate) {
      onNavigate('memory-os');
    } else {
      setShowMemoryOs(true);
    }
  };

  const handleMemoryNavigate = (view: string) => {
    if (view === 'dashboard') {
      setShowMemoryOs(false);
    } else {
      onNavigate?.(view);
    }
  };

  if (showMemoryOs) {
    return (
      <div className="relative min-h-screen bg-stone-50 pb-16">
        <div className="p-4 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => setShowMemoryOs(false)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            ← ড্যাশবোর্ডে ফিরে যান
          </button>
          <MemoryOsView onNavigate={handleMemoryNavigate} />
        </div>
      </div>
    );
  }

  return (
    <DashboardPage
      onResumeLesson={handleResumeLesson}
      onNavigateTab={handleNavigateTab}
      onOpenMistakeBook={handleOpenMistakeBook}
    />
  );
};

export default DashboardView;