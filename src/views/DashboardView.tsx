import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { DashboardPage } from '../features/student-dashboard';
import { NavTab } from '../features/student-dashboard/components/MobileBottomNavigation';
import { MemoryOsView } from './MemoryOsView';
import { BookOpen, Sparkles, ArrowRight, RotateCcw, Compass, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onNavigate?: (view: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class DashboardErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[DashboardErrorBoundary] Caught dashboard render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const handleNav = (v: string) => this.props.onNavigate?.(v);
      return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased pb-24 pt-6 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-5">
            {/* Greeting & Header */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nihomi Learning Dashboard</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                স্বাগতম, নিহোমিয়ান! (Welcome Learner)
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                আপনার ধারাবাহিক জাপানি ভাষা শিক্ষার মিশন শুরু করুন। নিচের যে-কোনো মডিউল নির্বাচন করে সরাসরি পড়াশোনা শুরু করতে পারেন।
              </p>
            </div>

            {/* Next Best Action Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-rose-950 p-6 text-white shadow-xl">
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">
                  ⚡ Next Best Action • পরবর্তী করণীয়
                </span>
                <h3 className="text-lg font-bold">
                  Minna no Nihongo: Lesson 01
                </h3>
                <p className="text-xs text-stone-300">
                  পরিচয় ও অভিবাদন (Meeting People & Self-Introductions) — সম্পূর্ণ ফ্রি ও অডিওসহ।
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleNav('lesson/n5-l1')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow-lg shadow-rose-600/30 cursor-pointer"
                  >
                    <span>লেসন ০১ শুরু করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('kana')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs hover:bg-stone-700 transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Kana Lab (হিরাগানা/কাতাকানা)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Overview Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div
                onClick={() => handleNav('kana')}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm cursor-pointer hover:border-rose-300 transition"
              >
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Kana Foundations</span>
                <span className="text-lg font-black text-stone-900">46 / 46</span>
                <span className="text-xs text-stone-500 block mt-1">হিরাগানা ও কাতাকানা</span>
              </div>
              <div
                onClick={() => handleNav('kanji')}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm cursor-pointer hover:border-rose-300 transition"
              >
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Kanji N5 Lab</span>
                <span className="text-lg font-black text-stone-900">100 Kanji</span>
                <span className="text-xs text-stone-500 block mt-1">স্ট্রোক ও অর্থসহ ড্রিল</span>
              </div>
            </div>

            {/* Recovery / Retry Bar */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ড পুনরায় লোড করুন (Retry)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
    <DashboardErrorBoundary onNavigate={onNavigate}>
      <DashboardPage
        onResumeLesson={handleResumeLesson}
        onNavigateTab={handleNavigateTab}
        onNavigate={onNavigate}
        onOpenMistakeBook={handleOpenMistakeBook}
      />
    </DashboardErrorBoundary>
  );
};

export default DashboardView;