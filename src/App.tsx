import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

// Views
import { HomeView } from './views/HomeView.js';
import { AboutView } from './views/AboutView.js';
import { LearningOverviewView } from './views/LearningOverviewView.js';
import { AuthView } from './views/AuthView.js';
import { DashboardView } from './views/DashboardView.js';
import { CoursesView } from './views/CoursesView.js';
import { LessonView } from './views/LessonView.js';
import { WorkJapaneseView } from './views/WorkJapaneseView.js';
import { WorkDetailView } from './views/WorkDetailView.js';
import { AICoachView } from './views/AICoachView.js';
import { QuizzesView } from './views/QuizzesView.js';
import { QuizRunnerView } from './views/QuizRunnerView.js';
import { ProgressView } from './views/ProgressView.js';
import { ProfileView } from './views/ProfileView.js';
import { AdminView } from './views/AdminView.js';
import { PricingView } from './views/PricingView.js';
import { SubscriptionManagementView } from './views/SubscriptionManagementView.js';
import { MemoryOsView } from './views/MemoryOsView.js';
import { InterviewLabView } from './views/InterviewLabView.js';
import { BaitoOsView } from './views/BaitoOsView.js';
import { CoordinationHubView } from './views/CoordinationHubView.js';
import { AICreditsView } from './views/AICreditsView.js';
import { InstructorDashboardView } from './views/InstructorDashboardView.js';
import { PassportVerificationView } from './views/PassportVerificationView.js';
import { JapanTwinView } from './views/JapanTwinView.js';
import { GhostModeView } from './views/GhostModeView.js';
import { Day1BlueprintView } from './views/Day1BlueprintView.js';
import { WhatsAppSenseiView } from './views/WhatsAppSenseiView.js';
import { VocabularyFlashcardsView } from './views/VocabularyFlashcardsView.js';
import { BadgesView } from './views/BadgesView.js';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.js';
import { OfflineNotificationToast } from './components/OfflineNotificationToast.js';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Auto-switch to dashboard on initial load if logged in and at home
  useEffect(() => {
    if (!isLoading && user && currentView === 'home') {
      setCurrentView('dashboard');
    }
  }, [user, isLoading]);

  const handleNavigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard Shortcuts Listener ('K', 'D', 'L', 'Q', 'F', 'M', 'P', 'B', '?')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is actively typing in form inputs, textareas, contenteditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Do not override standard browser modifier shortcuts (Ctrl, Meta, Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const key = e.key.toUpperCase();

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      if (key === 'D') {
        e.preventDefault();
        handleNavigate('dashboard');
      } else if (key === 'L') {
        e.preventDefault();
        handleNavigate('courses');
      } else if (key === 'K') {
        e.preventDefault();
        handleNavigate('ai-coach');
      } else if (key === 'Q') {
        e.preventDefault();
        handleNavigate('quizzes');
      } else if (key === 'F') {
        e.preventDefault();
        handleNavigate('flashcards');
      } else if (key === 'M') {
        e.preventDefault();
        handleNavigate('memory-os');
      } else if (key === 'P') {
        e.preventDefault();
        handleNavigate('progress');
      } else if (key === 'B') {
        e.preventDefault();
        handleNavigate('badges');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center text-stone-700 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-sm animate-pulse">
          日
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-stone-900 font-serif">Nihomi.com</p>
          <p className="text-xs text-stone-500">Initializing Japanese Learning Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#1A1A1A]">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentView === 'about' && <AboutView onNavigate={handleNavigate} />}
        {currentView === 'learning-overview' && <LearningOverviewView onNavigate={handleNavigate} />}
        {currentView === 'auth' && (
          <AuthView
            initialMode={viewParams.mode || 'login'}
            initialLevel={viewParams.level || 'N5'}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
        {currentView === 'courses' && (
          <CoursesView initialCourseId={viewParams.courseId} onNavigate={handleNavigate} />
        )}
        {currentView === 'lesson' && (
          <LessonView lessonId={viewParams.lessonId || 'l-n5-g1'} onNavigate={handleNavigate} />
        )}
        {(currentView === 'flashcards' || currentView === 'vocabulary') && (
          <VocabularyFlashcardsView onNavigate={handleNavigate} />
        )}
        {currentView === 'work-japanese' && <WorkJapaneseView onNavigate={handleNavigate} />}
        {currentView === 'work-detail' && (
          <WorkDetailView id={viewParams.id} itemId={viewParams.itemId || viewParams.id || 'work-keigo-1'} onNavigate={handleNavigate} />
        )}
        {currentView === 'ai-coach' && <AICoachView onNavigate={handleNavigate} />}
        {currentView === 'quizzes' && <QuizzesView onNavigate={handleNavigate} />}
        {currentView === 'quiz-runner' && (
          <QuizRunnerView
            quizId={viewParams.quizId}
            lessonId={viewParams.lessonId}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'progress' && <ProgressView onNavigate={handleNavigate} />}
        {currentView === 'badges' && <BadgesView onNavigate={handleNavigate} />}
        {currentView === 'profile' && <ProfileView onNavigate={handleNavigate} />}
        {currentView === 'admin' && <AdminView onNavigate={handleNavigate} />}
        {currentView === 'pricing' && <PricingView onNavigate={handleNavigate} />}
        {(currentView === 'subscription' || currentView === 'billing') && (
          <SubscriptionManagementView onNavigate={handleNavigate} />
        )}
        {/* Purple Cow Routes */}
        {currentView === 'memory-os' && <MemoryOsView onNavigate={handleNavigate} />}
        {currentView === 'interview-lab' && <InterviewLabView onNavigate={handleNavigate} />}
        {currentView === 'baito-os' && <BaitoOsView onNavigate={handleNavigate} />}
        {currentView === 'coordination-hub' && <CoordinationHubView onNavigate={handleNavigate} />}
        {(currentView === 'ai-credits' || currentView === 'credits') && (
          <AICreditsView onNavigate={handleNavigate} />
        )}
        {(currentView === 'instructor-dashboard' || currentView === 'instructor-portal') && (
          <InstructorDashboardView onNavigate={handleNavigate} />
        )}
        {currentView === 'passport' && <PassportVerificationView onNavigate={handleNavigate} />}
        {(currentView === 'japan-twin' || currentView === 'life-twin') && <JapanTwinView onNavigate={handleNavigate} />}
        {currentView === 'ghost-mode' && <GhostModeView onNavigate={handleNavigate} />}
        {currentView === 'day1-blueprint' && <Day1BlueprintView onNavigate={handleNavigate} />}
        {(currentView === 'whatsapp-sensei' || currentView === 'whatsapp') && (
          <WhatsAppSenseiView onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Global Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Connectivity & Offline Notification Toast */}
      <OfflineNotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
