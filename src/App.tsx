import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { LandingView } from './views/LandingView';
import { StudentPortalView } from './views/StudentPortalView';
import { DocumentsView } from './views/DocumentsView';
import { EmailSignatureView } from './views/EmailSignatureView';
import { CoordinationHubView } from './views/CoordinationHubView';
import { AICreditsView } from './views/AICreditsView';
import { AuthModal } from './components/auth/AuthModal';
import { CoursesView } from './views/CoursesView';
import { LessonView } from './views/LessonView';
import { QuizzesView } from './views/QuizzesView';
import { QuizRunnerView } from './views/QuizRunnerView';
import { SubscriptionManagementView } from './views/SubscriptionManagementView';
import { PricingView } from './views/PricingView';
import { PassportVerificationView } from './views/PassportVerificationView';
import { FounderCommandCenterView } from './views/FounderCommandCenterView';
import { ContentStudioView } from './views/ContentStudioView';
import { InstitutionPortalView } from './views/InstitutionPortalView';
import { CurriculumExplorerView } from './views/CurriculumExplorerView';
import { CommunityLeaderboardView } from './views/CommunityLeaderboardView';
import { OfflineNotificationBanner } from './components/common/OfflineNotificationBanner';
import { InstallPWA } from './components/common/InstallPWA';
import { useFocusMode } from './context/FocusModeContext';
import { QuickDictionaryOverlay } from './components/QuickDictionaryOverlay';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { FocusPomodoroBar } from './components/focus/FocusPomodoroBar';
import { FocusSakuraBackground } from './components/focus/FocusSakuraBackground';
import { ExportToastNotification } from './components/common/ExportToastNotification';
import { FloatingAiSenseiWidget } from './components/ai/FloatingAiSenseiWidget';
import {
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Music,
  ChevronDown
} from 'lucide-react';
import { ZenSoundscapeType } from './lib/zenAudio';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSoundscapeMenuOpen, setIsSoundscapeMenuOpen] = useState(false);

  const {
    isFocusMode,
    toggleFocusMode,
    zenSoundActive,
    toggleZenSound,
    soundscapeMode,
    setSoundscapeMode,
    soundscapes
  } = useFocusMode();

  const handleNavigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard Shortcut Listener (Cmd+K, ?, Escape, and Ctrl/Cmd helper)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Cmd+K or Ctrl+K -> Global Nihomi Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Cmd+J or Ctrl+J -> Quick Dictionary Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsDictionaryOpen((prev) => !prev);
        return;
      }

      // If typing in input, ignore single key navigation shortcuts
      if (isInput) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'd' && !e.metaKey && !e.ctrlKey) {
        handleNavigate('portal');
      } else if (e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey) {
        handleNavigate('courses');
      } else if (e.key.toLowerCase() === 'q' && !e.metaKey && !e.ctrlKey) {
        handleNavigate('quizzes');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSoundscape = soundscapes.find((s) => s.id === soundscapeMode) || soundscapes[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] font-sans antialiased text-slate-900 dark:text-stone-100 sepia:text-[#433422] transition-colors overflow-x-hidden max-w-full">
      {/* Offline Feedback & Service Worker Resilience Banner */}
      {!isFocusMode && <OfflineNotificationBanner />}

      {/* Focus Mode Sakura Ambient Canvas Background */}
      <FocusSakuraBackground
        isActive={isFocusMode}
        soundscapeMode={soundscapeMode}
        soundActive={zenSoundActive}
      />

      {/* Focus Mode Pomodoro Bar (25m / 50m / 5m Break Intervals + Zen Soundscape Player) */}
      {isFocusMode && (
        <FocusPomodoroBar
          zenSoundActive={zenSoundActive}
          toggleZenSound={toggleZenSound}
          soundscapeMode={soundscapeMode}
          setSoundscapeMode={setSoundscapeMode}
          soundscapes={soundscapes}
          onExitFocus={() => toggleFocusMode(false)}
        />
      )}

      {/* Global Export Download Path Toast Notification */}
      <ExportToastNotification />

      {/* Main Header */}
      {!isFocusMode && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      )}
      
      <main className={`flex-grow w-full max-w-full overflow-x-hidden ${isFocusMode ? 'pt-8' : ''} pb-16 md:pb-0`}>
        {(currentView === 'landing' || currentView === 'home') && (
          <LandingView onNavigate={handleNavigate} />
        )}
        {currentView === 'courses' && (
          <CoursesView onNavigate={handleNavigate} />
        )}
        {currentView === 'lesson' && (
          <LessonView lessonId={viewParams.lessonId || 'n5-l1'} onNavigate={handleNavigate} />
        )}
        {currentView === 'portal' && (
          <StudentPortalView initialTab="dashboard" onNavigate={handleNavigate} />
        )}
        {currentView === 'portal-settings' && (
          <StudentPortalView initialTab="settings" onNavigate={handleNavigate} />
        )}
        {currentView === 'portal-subscription' && (
          <StudentPortalView initialTab="subscription" onNavigate={handleNavigate} />
        )}
        {currentView === 'credits' && (
          <AICreditsView onNavigate={handleNavigate} />
        )}
        {currentView === 'coordination' && (
          <CoordinationHubView onNavigate={handleNavigate} />
        )}
        {currentView === 'documents' && (
          <DocumentsView />
        )}
        {(currentView === 'contact' || currentView === 'signature' || currentView === 'email-signature') && (
          <EmailSignatureView />
        )}
        {currentView === 'quizzes' && (
          <QuizzesView onNavigate={handleNavigate} />
        )}
        {currentView === 'quiz-runner' && (
          <QuizRunnerView quizId={viewParams.quizId || 'quiz-n5-01'} onNavigate={handleNavigate} />
        )}
        {currentView === 'pricing' && (
          <PricingView onNavigate={handleNavigate} />
        )}
        {currentView === 'subscription' && (
          <SubscriptionManagementView onNavigate={handleNavigate} />
        )}
        {currentView === 'passport' && (
          <PassportVerificationView onNavigate={handleNavigate} />
        )}
        {(currentView === 'institution' || currentView === 'academy' || currentView === 'dils') && (
          <InstitutionPortalView onNavigate={handleNavigate} />
        )}
        {(currentView === 'founder' || currentView === 'admin' || currentView === 'command-center') && (
          <FounderCommandCenterView onNavigate={handleNavigate} />
        )}
        {currentView === 'content-studio' && (
          <ContentStudioView onNavigate={handleNavigate} />
        )}
        {(currentView === 'curriculum' || currentView === 'curriculum-explorer' || currentView === 'n5-curriculum' || currentView === 'minna') && (
          <CurriculumExplorerView onNavigate={handleNavigate} />
        )}
        {(currentView === 'leaderboard' || currentView === 'community' || currentView === 'community-leaderboard' || currentView === 'rankings') && (
          <CommunityLeaderboardView onNavigate={handleNavigate} />
        )}
      </main>

      {!isFocusMode && <Footer onNavigate={handleNavigate} />}

      {/* Mobile Bottom Bar for PWA Touch Experience */}
      {!isFocusMode && <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />}

      {/* Global Command Palette (Triggered from Header search bar or ⌘K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Quick Dictionary Search Overlay (Triggered from Header or ⌘J) */}
      <QuickDictionaryOverlay
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        onNavigateToFlashcards={() => handleNavigate('portal')}
      />

      {/* Global Keyboard Shortcut Helper Overlay (Triggered from Header or '?' key) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Google Sign-in & Authentication Modal */}
      <AuthModal />

      {/* Persistent AI Sensei Instant Grammar Floating Coach */}
      <FloatingAiSenseiWidget currentContext={{ viewName: currentView }} />

      {/* PWA Home Screen Installation Prompt Banner */}
      {!isFocusMode && <InstallPWA />}
    </div>
  );
};

export default App;
