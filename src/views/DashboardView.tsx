import React, { useState } from 'react';
import { DashboardPage } from '../features/student-dashboard';
import { NavTab } from '../features/student-dashboard/components/MobileBottomNavigation';

// নিহোমির আসল এক্সিস্টিং কম্পোনেন্টগুলো ইমপোর্ট
import { LessonPlayerModal } from '../components/learning/LessonPlayerModal';
import { FloatingAiSenseiWidget } from '../components/ai/FloatingAiSenseiWidget';
import { MemoryOsView } from './MemoryOsView';

export const DashboardView: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isAiSenseiOpen, setIsAiSenseiOpen] = useState<boolean>(false);
  const [showMemoryOs, setShowMemoryOs] = useState<boolean>(false);

  // ১. Continue Learning বাটনে ক্লিক করলে আসল লেসন প্লেয়ার ওপেন হবে
  const handleResumeLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  // ২. AI বাটন বা ন্যাভিগেশন ক্লিক করলে AI Sensei ওপেন হবে
  const handleNavigateTab = (tab: NavTab) => {
    if (tab === 'ai') {
      setIsAiSenseiOpen(true);
    }
  };

  // ৩. Review Mistakes বাটনে ক্লিক করলে MemoryOS ওপেন হবে
  const handleOpenMistakeBook = () => {
    setShowMemoryOs(true);
  };

  // যদি শিক্ষার্থী ভুলের খাতা (MemoryOS) ওপেন করে
  if (showMemoryOs) {
    return (
      <div className="relative min-h-screen bg-stone-50">
        <div className="p-4 max-w-4xl mx-auto">
          <button
            onClick={() => setShowMemoryOs(false)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            ← ড্যাশবোর্ডে ফিরে যান
          </button>
          <MemoryOsView />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* মূল স্টুডেন্ট ড্যাশবোর্ড */}
      <DashboardPage
        onResumeLesson={handleResumeLesson}
        onNavigateTab={handleNavigateTab}
        onOpenMistakeBook={handleOpenMistakeBook}
      />

      {/* আসল লেসন প্লেয়ার মডাল */}
      {activeLessonId && (
        <LessonPlayerModal
          lessonId={activeLessonId}
          isOpen={true}
          onClose={() => setActiveLessonId(null)}
        />
      )}

      {/* আসল AI Sensei টিউটর উইজেট */}
      <FloatingAiSenseiWidget
        isOpen={isAiSenseiOpen}
        onToggle={() => setIsAiSenseiOpen(!isAiSenseiOpen)}
      />
    </>
  );
};

export default DashboardView;