import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { LandingView } from './views/LandingView';
import { AuthModal } from './components/auth/AuthModal';

// Code-split / Lazy-loaded views to optimize bundle sizes
const StudentPortalView = lazy(() => import('./views/StudentPortalView').then(m => ({ default: m.StudentPortalView })));
const DocumentsView = lazy(() => import('./views/DocumentsView').then(m => ({ default: m.DocumentsView })));
const EmailSignatureView = lazy(() => import('./views/EmailSignatureView').then(m => ({ default: m.EmailSignatureView })));
const CoordinationHubView = lazy(() => import('./views/CoordinationHubView').then(m => ({ default: m.CoordinationHubView })));
const AICreditsView = lazy(() => import('./views/AICreditsView').then(m => ({ default: m.AICreditsView })));
const CoursesView = lazy(() => import('./views/CoursesView').then(m => ({ default: m.CoursesView })));
const LessonView = lazy(() => import('./views/LessonView').then(m => ({ default: m.LessonView })));
const QuizzesView = lazy(() => import('./views/QuizzesView').then(m => ({ default: m.QuizzesView })));
const QuizRunnerView = lazy(() => import('./views/QuizRunnerView').then(m => ({ default: m.QuizRunnerView })));
const SubscriptionManagementView = lazy(() => import('./views/SubscriptionManagementView').then(m => ({ default: m.SubscriptionManagementView })));
const PricingView = lazy(() => import('./views/PricingView').then(m => ({ default: m.PricingView })));
const PassportVerificationView = lazy(() => import('./views/PassportVerificationView').then(m => ({ default: m.PassportVerificationView })));
const FounderCommandCenterView = lazy(() => import('./views/FounderCommandCenterView').then(m => ({ default: m.FounderCommandCenterView })));
const ContentStudioView = lazy(() => import('./views/ContentStudioView').then(m => ({ default: m.ContentStudioView })));
const InstitutionPortalView = lazy(() => import('./views/InstitutionPortalView').then(m => ({ default: m.InstitutionPortalView })));
const CurriculumExplorerView = lazy(() => import('./views/CurriculumExplorerView').then(m => ({ default: m.CurriculumExplorerView })));
const CommunityLeaderboardView = lazy(() => import('./views/CommunityLeaderboardView').then(m => ({ default: m.CommunityLeaderboardView })));
const GhostModeView = lazy(() => import('./views/GhostModeView').then(m => ({ default: m.GhostModeView })));
const MockExamsView = lazy(() => import('./views/MockExamsView').then(m => ({ default: m.MockExamsView })));
const MockExamRunnerView = lazy(() => import('./views/MockExamRunnerView').then(m => ({ default: m.MockExamRunnerView })));
const StudyPlanRoadmapView = lazy(() => import('./views/StudyPlanRoadmapView').then(m => ({ default: m.StudyPlanRoadmapView })));
const BaitoOsView = lazy(() => import('./views/BaitoOsView').then(m => ({ default: m.BaitoOsView })));
const CertificateVerificationPage = lazy(() => import('./pages/CertificateVerificationPage').then(m => ({ default: m.CertificateVerificationPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdCampaignView = lazy(() => import('./views/AdCampaignView').then(m => ({ default: m.AdCampaignView })));
const AdminGrowthView = lazy(() => import('./views/AdminGrowthView').then(m => ({ default: m.AdminGrowthView })));
const PaymentCallbackView = lazy(() => import('./views/PaymentCallbackView').then(m => ({ default: m.PaymentCallbackView })));
const LoginView = lazy(() => import('./views/LoginView').then(m => ({ default: m.LoginView })));
const ResetPasswordView = lazy(() => import('./views/ResetPasswordView').then(m => ({ default: m.ResetPasswordView })));
const AuthView = lazy(() => import('./views/AuthView').then(m => ({ default: m.AuthView })));
const KanaView = lazy(() => import('./views/KanaView').then(m => ({ default: m.KanaView })));
const KanjiView = lazy(() => import('./views/KanjiView').then(m => ({ default: m.KanjiView })));

const ViewLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center" id="view-loading-spinner">
    <div className="w-9 h-9 border-3 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-3" />
    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
      লোড হচ্ছে... (Loading Nihomi)
    </span>
  </div>
);

import { OfflineNotificationBanner } from './components/common/OfflineNotificationBanner';
import { InstallPWA } from './components/common/InstallPWA';
import { useFocusMode } from './context/FocusModeContext';
import { QuickDictionaryOverlay } from './components/QuickDictionaryOverlay';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { FocusPomodoroBar } from './components/focus/FocusPomodoroBar';
import { captureReferralFromUrl } from './utils/referral';
import { captureUtmFromUrl } from './utils/utm';
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
    try {
      const targetPath = view === 'landing' ? '/' : `/${view}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    } catch {}
  };

  // URL Deep Link / Verification & Legal Route Listener
  useEffect(() => {
    try {
      captureReferralFromUrl();
      captureUtmFromUrl();
      const path = window.location.pathname.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const queryCert = search.get('certId') || search.get('id');

      if (path === '/start' || path === '/campaign' || path === '/ad') {
        setCurrentView('start');
      } else if (path === '/courses' || path === '/curriculum' || path === '/pathways') {
        setCurrentView('courses');
      } else if (path === '/portal' || path === '/dashboard') {
        setCurrentView('portal');
      } else if (path === '/baito' || path === '/baito-os' || path === '/simulation') {
        setCurrentView('baito');
      } else if (path === '/pricing' || path === '/plans') {
        setCurrentView('pricing');
      } else if (path === '/coordination') {
        setCurrentView('coordination');
      } else if (path === '/documents') {
        setCurrentView('documents');
      } else if (path === '/credits') {
        setCurrentView('credits');
      } else if (path === '/admin/growth' || path === '/growth' || path === '/founder/growth') {
        setCurrentView('growth');
      } else if (path === '/terms' || path === '/terms-of-service') {
        setCurrentView('terms');
      } else if (path === '/privacy' || path === '/privacy-policy') {
        setCurrentView('privacy');
      } else if (path === '/refund-policy' || path === '/refund' || path === '/refunds') {
        setCurrentView('refund-policy');
      } else if (path === '/contact' || path === '/support') {
        setCurrentView('contact');
      } else if (path === '/payment/callback' || path === '/billing/callback') {
        setCurrentView('payment-callback');
      } else if (path === '/login' || path === '/signin') {
        setCurrentView('login');
      } else if (path === '/auth' || path === '/signup' || path === '/register') {
        setCurrentView('auth');
      } else if (path === '/reset-password' || path === '/auth/reset-password') {
        setCurrentView('reset-password');
      } else if (path.startsWith('/verify') || queryCert) {
        const certFromPath = path.replace(/^\/verify(\/cert)?\/?/, '');
        const targetCert = certFromPath || queryCert;
        setCurrentView('verify-cert');
        if (targetCert) {
          setViewParams({ certId: decodeURIComponent(targetCert) });
        }
      }
    } catch (e) {}

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/start' || path === '/campaign') setCurrentView('start');
      else if (path === '/courses' || path === '/curriculum' || path === '/pathways') setCurrentView('courses');
      else if (path === '/portal' || path === '/dashboard') setCurrentView('portal');
      else if (path === '/baito' || path === '/baito-os') setCurrentView('baito');
      else if (path === '/pricing' || path === '/plans') setCurrentView('pricing');
      else if (path === '/coordination') setCurrentView('coordination');
      else if (path === '/documents') setCurrentView('documents');
      else if (path === '/credits') setCurrentView('credits');
      else if (path === '/admin/growth' || path === '/growth') setCurrentView('growth');
      else if (path === '/terms') setCurrentView('terms');
      else if (path === '/privacy') setCurrentView('privacy');
      else if (path === '/refund-policy') setCurrentView('refund-policy');
      else if (path === '/contact') setCurrentView('contact');
      else if (path === '/payment/callback' || path === '/billing/callback') setCurrentView('payment-callback');
      else if (path === '/login' || path === '/signin') setCurrentView('login');
      else if (path === '/auth' || path === '/signup') setCurrentView('auth');
      else if (path === '/reset-password') setCurrentView('reset-password');
      else if (path === '/' || path === '') setCurrentView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  const isAdLanding = currentView === 'start' || currentView === 'ad-campaign' || currentView === 'campaign';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] font-sans antialiased text-slate-900 dark:text-stone-100 sepia:text-[#433422] transition-colors overflow-x-hidden max-w-full">
      {/* Offline Feedback & Service Worker Resilience Banner */}
      {!isFocusMode && !isAdLanding && <OfflineNotificationBanner />}

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
          onFocusBlockComplete={() => window.dispatchEvent(new CustomEvent('nihomi-focus-complete'))}
        />
      )}

      {/* Global Export Download Path Toast Notification */}
      <ExportToastNotification />

      {/* Main Header */}
      {!isFocusMode && !isAdLanding && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      )}
      
      <main className={`flex-grow w-full max-w-full overflow-x-hidden ${isFocusMode ? 'pt-8' : ''} ${isAdLanding ? 'p-0' : 'pb-16 md:pb-0'}`}>
        <Suspense fallback={<ViewLoadingFallback />}>
          {(currentView === 'start' || currentView === 'ad-campaign' || currentView === 'campaign') && (
          <AdCampaignView onNavigate={handleNavigate} />
        )}
        {(currentView === 'growth' || currentView === 'admin-growth' || currentView === 'founder/growth') && (
          <AdminGrowthView onNavigate={handleNavigate} />
        )}
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
        {currentView === 'terms' && (
          <TermsPage onNavigate={handleNavigate} />
        )}
        {currentView === 'privacy' && (
          <PrivacyPage onNavigate={handleNavigate} />
        )}
        {currentView === 'refund-policy' && (
          <RefundPolicyPage onNavigate={handleNavigate} />
        )}
        {currentView === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}
        {(currentView === 'signature' || currentView === 'email-signature') && (
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
        {currentView === 'payment-callback' && (
          <PaymentCallbackView onNavigate={handleNavigate} />
        )}
        {currentView === 'login' && (
          <LoginView onNavigate={handleNavigate} initialLevel={viewParams.level || 'N5'} />
        )}
        {currentView === 'auth' && (
          <AuthView onNavigate={handleNavigate} initialMode={viewParams.mode || 'login'} initialLevel={viewParams.level || 'N5'} />
        )}
        {currentView === 'reset-password' && (
          <ResetPasswordView onNavigate={handleNavigate} />
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
        {(currentView === 'ghost-mode' || currentView === 'ghost') && (
          <GhostModeView onNavigate={handleNavigate} />
        )}
        {(currentView === 'mock-exams' || currentView === 'mock-exam-hub' || currentView === 'mock-tests') && (
          <MockExamsView onNavigate={handleNavigate} />
        )}
        {(currentView === 'mock-exam-runner' || currentView === 'mock-exam') && (
          <MockExamRunnerView
            examId={viewParams.examId || 'mock-n5-01'}
            onNavigate={handleNavigate}
          />
        )}
        {(currentView === 'study-plan' || currentView === 'roadmap' || currentView === 'study-planner') && (
          <StudyPlanRoadmapView
            openDailyMission={viewParams.openDailyMission}
            onNavigate={handleNavigate}
          />
        )}
        {(currentView === 'baito' || currentView === 'baito-os' || currentView === 'simulation' || currentView === 'relocation') && (
          <BaitoOsView onNavigate={handleNavigate} />
        )}
        {(currentView === 'interview' || currentView === 'interview-lab' || currentView === 'visa-defense') && (
          <BaitoOsView onNavigate={handleNavigate} />
        )}
        {(currentView === 'verify-cert' || currentView === 'verify' || currentView === 'certificate-verification') && (
          <CertificateVerificationPage
            initialCertId={viewParams.certId}
            onNavigate={handleNavigate}
          />
        )}
        {(currentView === 'kana' || currentView === 'hiragana' || currentView === 'katakana' || currentView === 'kana-lab') && (
          <KanaView />
        )}
        {(currentView === 'kanji' || currentView === 'kanji-lab' || currentView === 'kanji-100' || currentView === 'n5-kanji') && (
          <KanjiView />
        )}
        </Suspense>
      </main>

      {!isFocusMode && !isAdLanding && <Footer onNavigate={handleNavigate} />}

      {/* Mobile Bottom Bar for PWA Touch Experience */}
      {!isFocusMode && !isAdLanding && <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />}

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
