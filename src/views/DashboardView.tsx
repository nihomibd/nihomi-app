import React, { useState } from 'react';
import { DashboardPage } from '../features/student-dashboard';
import { NavTab } from '../features/student-dashboard/components/MobileBottomNavigation';
import { MemoryOsView } from './MemoryOsView';

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [showMemoryOs, setShowMemoryOs] = useState<boolean>(false);

  // ১. লেসন প্লেয়ারে নিয়ে যাওয়া
  const handleResumeLesson = (lessonId: string) => {
    if (onNavigate) {
      onNavigate(`lesson/${lessonId}`);
    }
  };

  // ২. মোবাইল বটম ট্যাবের মাধ্যমে নিহোমির অন্যান্য পেজে যাওয়া
  const handleNavigateTab = (tab: NavTab) => {
    if (tab === 'practice' && onNavigate) {
      onNavigate('practice');
    } else if (tab === 'learn' && onNavigate) {
      onNavigate('courses');
    } else if (tab === 'profile' && onNavigate) {
      onNavigate('profile');
    }
  };

  // ৩. মেমোরিওএস (ভুলের খাতা) খোলা
  const handleOpenMistakeBook = () => {
    if (onNavigate) {
      onNavigate('memory-os');
    } else {
      setShowMemoryOs(true);
    }
  };

  // যদি ভুলের খাতা খোলা হয়
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
          <MemoryOsView onNavigate={(view) => {
            if (view === 'dashboard') setShowMemoryOs(false);
            else if (onNavigate) onNavigate(view);
          }} />
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