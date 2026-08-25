import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
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
import { InstitutionPortalView } from './views/InstitutionPortalView';
import { OfflineNotificationBanner } from './components/common/OfflineNotificationBanner';
import { InstallPWA } from './components/common/InstallPWA';
import { useFocusMode } from './context/FocusModeContext';
import { Eye, EyeOff, Sparkles, Volume2, VolumeX, X } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});
  const { isFocusMode, toggleFocusMode, zenSoundActive, toggleZenSound } = useFocusMode();

  const handleNavigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] font-sans antialiased text-slate-900 dark:text-stone-100 sepia:text-[#433422] transition-colors">
      {/* Offline Feedback & Service Worker Resilience Banner */}
      {!isFocusMode && <OfflineNotificationBanner />}

      {/* Focus Mode Zen Floating Bar */}
      {isFocusMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 dark:bg-stone-950/95 backdrop-blur-md text-white px-4 py-2 rounded-full border border-stone-700 shadow-2xl flex items-center space-x-3 text-xs animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Zen Focus Mode</span>
          </div>
          <span className="text-stone-500">•</span>
          <button
            type="button"
            onClick={toggleZenSound}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              zenSoundActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {zenSoundActive ? <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" /> : <VolumeX className="w-3 h-3" />}
            <span className="text-[11px]">{zenSoundActive ? 'Zen Chimes ON' : 'Zen Audio'}</span>
          </button>
          <span className="text-stone-500">•</span>
          <button
            type="button"
            id="btn-exit-focus-mode"
            onClick={() => toggleFocusMode(false)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <span>Exit Focus (ESC)</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Header */}
      {!isFocusMode && <Header currentView={currentView} onNavigate={handleNavigate} />}
      
      <main className={`flex-grow ${isFocusMode ? 'pt-8' : ''}`}>
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
      </main>

      {!isFocusMode && <Footer onNavigate={handleNavigate} />}

      {/* Google Sign-in & Authentication Modal */}
      <AuthModal />

      {/* PWA Home Screen Installation Prompt Banner */}
      {!isFocusMode && <InstallPWA />}
    </div>
  );
};

export default App;
