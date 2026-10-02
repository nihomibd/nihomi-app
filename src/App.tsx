import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { LandingView } from './views/LandingView';
import { AuthModal } from './components/auth/AuthModal';
import { LearnerJourneyEngine } from './components/learning/LearnerJourneyEngine';
import { NihomiMobileShowcase } from './components/showcase/NihomiMobileShowcase';

// Code-split / Lazy-loaded views to optimize bundle sizes
const StudentPortalView = lazy(() => import('./views/StudentPortalView').then(m => ({ default: m.StudentPortalView })));
const DocumentsView = lazy(() => import('./views/DocumentsView').then(m => ({ default: m.DocumentsView })));
const EmailSignatureView = lazy(() => import('./views/EmailSignatureView').then(m => ({ default: m.EmailSignatureView })));
const CoordinationHubView = lazy(() => import('./views/CoordinationHubView').then(m => ({ default: m.CoordinationHubView })));
const AICreditsView = lazy(() => import('./views/AICreditsView').then(m => ({ default: m.AICreditsView })));
const CoursesView = lazy(() => import('./views/CoursesView').then(m => ({ default: m.default || m.CoursesView })));
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
const ListeningLabView = lazy(() => import('./views/ListeningLabView').then(m => ({ default: m.ListeningLabView })));
const NihomiCloudView = lazy(() => import('./views/NihomiCloudView').then(m => ({ default: m.NihomiCloudView })));
const DashboardView = lazy(() => import('./views/DashboardView').then(m => ({ default: m.DashboardView })));
const RealJapanCanvasView = lazy(() => import('./views/RealJapanCanvasView').then(m => ({ default: m.RealJapanCanvasView })));
const MemoryOsView = lazy(() => import('./views/MemoryOsView').then(m => ({ default: m.MemoryOsView })));
const JapanTwinView = lazy(() => import('./views/JapanTwinView').then(m => ({ default: m.JapanTwinView })));
const ProfileView = lazy(() => import('./views/ProfileView').then(m => ({ default: m.ProfileView })));
const BadgesView = lazy(() => import('./views/BadgesView').then(m => ({ default: m.BadgesView })));
const ProgressView = lazy(() => import('./views/ProgressView').then(m => ({ default: m.ProgressView })));
const VocabularyView = lazy(() => import('./views/VocabularyView').then(m => ({ default: m.VocabularyView })));
const AICoachView = lazy(() => import('./views/AICoachView').then(m => ({ default: m.AICoachView })));
const QuizPerformanceInsightsView = lazy(() => import('./views/QuizPerformanceInsightsView').then(m => ({ default: m.QuizPerformanceInsightsView })));
const LessonPracticeView = lazy(() => import('./views/LessonPracticeView').then(m => ({ default: m.LessonPracticeView })));

const ViewLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center" id="view-loading-spinner">
    <div className="w-9 h-9 border-3 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-3" />
    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
      লোড হচ্ছে... (Loading Nihomi)
    </span>
  </div>
);

const RouteRecoveryView: React.FC<{ currentView: string; onNavigate: (view: string, params?: Record<string, any>) => void }> = ({ currentView, onNavigate }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto" id="route-recovery-view">
    <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-2xl shadow-red-600/30 mb-4 animate-pulse">
      <div className="w-full h-full bg-[#0e0e18] rounded-[22px] flex items-center justify-center">
        <span className="font-mono text-3xl font-black text-white">404</span>
      </div>
    </div>
    <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-mono font-bold mb-3 border border-stone-200 dark:border-stone-700">
      Route: /{currentView}
    </span>
    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
      পৃষ্ঠাটি খুঁজে পাওয়া যায়নি (Page Not Found)
    </h2>
    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-6 leading-relaxed max-w-md">
      আপনি যে পৃষ্ঠাটিতে প্রবেশের চেষ্টা করছেন সেটি স্থানান্তরিত বা প্রস্তুত করা হচ্ছে। নিচের লিংকগুলোর সাহায্যে সরাসরি আপনার ক্লাসরুম বা ড্যাশবোর্ডে ফিরে যান।
    </p>
    <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
      <button
        type="button"
        onClick={() => onNavigate('landing')}
        className="btn-haptic p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 dark:bg-stone-800 dark:hover:bg-stone-700"
      >
        <span>🏠 হোম পেজ</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate('courses')}
        className="btn-haptic p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>📚 পাঠ্যক্রম (Courses)</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="btn-haptic p-3 rounded-2xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs cursor-pointer border border-stone-200 dark:border-stone-800"
      >
        <span>📊 ড্যাশবোর্ড</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate('practice', { lessonId: 'n5-l1' })}
        className="btn-haptic p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs cursor-pointer border border-amber-500/30"
      >
        <span>🎯 কুইজ প্র্যাকটিস</span>
      </button>
    </div>
  </div>
);

const KNOWN_VIEWS = new Set([
  'journey', 'mission',
  'start', 'ad-campaign', 'campaign', 'ad',
  'growth', 'admin-growth', 'founder/growth',
  'landing', 'home', 'world', 'canvas', 'shibuya',
  'classic',
  'dashboard', 'student-dashboard', 'portal-dashboard',
  'courses', 'curriculum', 'pathways',
  'lesson', 'practice', 'lesson-practice',
  'portal', 'portal-settings', 'portal-subscription',
  'credits',
  'coordination',
  'documents',
  'terms', 'terms-of-service',
  'privacy', 'privacy-policy',
  'refund-policy', 'refund', 'refunds',
  'contact', 'support',
  'signature', 'email-signature',
  'quizzes', 'quiz',
  'quiz-runner',
  'pricing', 'plans',
  'payment-callback', 'billing/callback',
  'login', 'signin',
  'auth', 'signup', 'register',
  'reset-password',
  'subscription',
  'passport',
  'institution', 'academy', 'dils',
  'founder', 'admin', 'command-center',
  'content-studio',
  'curriculum-explorer', 'n5-curriculum', 'minna',
  'leaderboard', 'community', 'community-leaderboard', 'rankings',
  'ghost-mode', 'ghost',
  'mock-exams', 'mock-exam-hub', 'mock-tests',
  'mock-exam-runner', 'mock-exam',
  'study-plan', 'roadmap', 'study-planner',
  'baito', 'baito-os', 'simulation', 'relocation', 'workos', 'work-os',
  'interview', 'interview-lab', 'visa-defense',
  'rirekisho', 'cv-builder', 'resume', 'jis-rirekisho',
  'keirekisho', 'shokumu', 'shokumu-keirekisho',
  'verify-cert', 'verify', 'certificate-verification',
  'kana', 'hiragana', 'katakana', 'kana-lab',
  'kanji', 'kanji-lab', 'kanji-100', 'n5-kanji',
  'listening', 'listening-lab', 'kaiwa', 'choukai',
  'cloud', 'nihomi-cloud', 'drive', 'locker',
  'showcase', 'mockups', 'mobile-showcase',
  'memory-os', 'memoryos', 'srs', 'memory',
  'japan-twin', 'japantwin', 'twin',
  'profile', 'account', 'me',
  'badges', 'achievements',
  'progress', 'stats', 'telemetry',
  'vocabulary', 'vocab', 'words',
  'ai-coach', 'coach', 'tutor',
  'quiz-insights', 'insights'
]);

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
import { WhatsAppHelpline } from './components/support/WhatsAppHelpline';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import {
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Music,
  ChevronDown
} from 'lucide-react';
import { ZenSoundscapeType } from './lib/zenAudio';
import { updatePageMetaTags } from './lib/seo';

const resolveViewFromUrl = (pathname: string, searchParams: URLSearchParams): { view: string; params: Record<string, any> } => {
  const path = pathname.toLowerCase();
  const queryCert = searchParams.get('certId') || searchParams.get('id');

  if (path === '/journey' || path === '/start-journey' || path === '/onboarding' || path === '/mission') {
    return { view: 'journey', params: {} };
  }
  if (path === '/start' || path === '/campaign' || path === '/ad') {
    return { view: 'start', params: {} };
  }
  if (path === '/world' || path === '/canvas' || path === '/shibuya') {
    return { view: 'landing', params: {} };
  }
  if (path === '/classic') {
    return { view: 'classic', params: {} };
  }
  if ((path === '/' || path === '') && (searchParams.has('utm_source') || searchParams.has('fbclid') || searchParams.has('gclid') || searchParams.has('utm_campaign'))) {
    return { view: 'start', params: {} };
  }
  if (path === '/courses' || path === '/curriculum' || path === '/pathways') {
    return { view: 'courses', params: {} };
  }
  if (path === '/dashboard' || path === '/student-dashboard') {
    return { view: 'dashboard', params: {} };
  }
  if (path === '/portal') {
    return { view: 'portal', params: {} };
  }
  if (path === '/portal-settings') {
    return { view: 'portal-settings', params: {} };
  }
  if (path === '/portal-subscription') {
    return { view: 'portal-subscription', params: {} };
  }
  if (path.startsWith('/lesson/') || path === '/lesson') {
    const lessonFromPath = path.replace(/^\/lesson\/?/, '');
    const targetLesson = lessonFromPath || searchParams.get('id') || searchParams.get('lessonId') || 'n5-l1';
    return { view: 'lesson', params: { lessonId: targetLesson } };
  }
  if (path.startsWith('/practice/') || path === '/practice' || path === '/lesson-practice') {
    const practiceFromPath = path.replace(/^\/practice\/?/, '').replace(/^\/lesson-practice\/?/, '');
    const targetLesson = practiceFromPath || searchParams.get('id') || searchParams.get('lessonId') || 'n5-l1';
    return { view: 'practice', params: { lessonId: targetLesson } };
  }
  if (path === '/kana' || path === '/hiragana' || path === '/katakana' || path === '/kana-lab') {
    return { view: 'kana', params: {} };
  }
  if (path === '/kanji' || path === '/kanji-lab' || path === '/kanji-100' || path === '/n5-kanji') {
    return { view: 'kanji', params: {} };
  }
  if (path === '/listening' || path === '/listening-lab') {
    return { view: 'listening', params: {} };
  }
  if (path === '/baito' || path === '/baito-os' || path === '/simulation' || path === '/workos' || path === '/work-os') {
    return { view: 'baito', params: {} };
  }
  if (path === '/memory-os' || path === '/memoryos' || path === '/srs' || path === '/memory') {
    return { view: 'memory-os', params: {} };
  }
  if (path === '/japan-twin' || path === '/japantwin' || path === '/twin') {
    return { view: 'japan-twin', params: {} };
  }
  if (path === '/pricing' || path === '/plans') {
    return { view: 'pricing', params: {} };
  }
  if (path === '/profile' || path === '/account' || path === '/me') {
    return { view: 'profile', params: {} };
  }
  if (path === '/badges' || path === '/achievements') {
    return { view: 'badges', params: {} };
  }
  if (path === '/progress' || path === '/stats') {
    return { view: 'progress', params: {} };
  }
  if (path === '/vocabulary' || path === '/vocab') {
    return { view: 'vocabulary', params: {} };
  }
  if (path === '/ai-coach' || path === '/coach') {
    return { view: 'ai-coach', params: {} };
  }
  if (path === '/leaderboard' || path === '/community' || path === '/rankings') {
    return { view: 'leaderboard', params: {} };
  }
  if (path === '/quizzes' || path === '/quiz') {
    return { view: 'quizzes', params: {} };
  }
  if (path.startsWith('/quiz/') || path.startsWith('/quizzes/')) {
    const quizId = path.split('/')[2] || 'quiz-n5-01';
    return { view: 'quiz-runner', params: { quizId } };
  }
  if (path === '/mock-exams' || path === '/mock') {
    return { view: 'mock-exams', params: {} };
  }
  if (path === '/study-plan' || path === '/roadmap') {
    return { view: 'study-plan', params: {} };
  }
  if (path === '/ghost-mode' || path === '/ghost') {
    return { view: 'ghost-mode', params: {} };
  }
  if (path === '/cloud' || path === '/drive') {
    return { view: 'cloud', params: {} };
  }
  if (path === '/coordination') {
    return { view: 'coordination', params: {} };
  }
  if (path === '/documents') {
    return { view: 'documents', params: {} };
  }
  if (path === '/credits') {
    return { view: 'credits', params: {} };
  }
  if (path === '/founder' || path === '/admin/founder' || path === '/command-center') {
    return { view: 'founder', params: {} };
  }
  if (path === '/admin/growth' || path === '/growth' || path === '/founder/growth') {
    return { view: 'growth', params: {} };
  }
  if (path === '/terms' || path === '/terms-of-service') {
    return { view: 'terms', params: {} };
  }
  if (path === '/privacy' || path === '/privacy-policy') {
    return { view: 'privacy', params: {} };
  }
  if (path === '/refund-policy' || path === '/refund' || path === '/refunds') {
    return { view: 'refund-policy', params: {} };
  }
  if (path === '/contact' || path === '/support') {
    return { view: 'contact', params: {} };
  }
  if (path === '/payment/callback' || path === '/billing/callback') {
    return { view: 'payment-callback', params: {} };
  }
  if (path === '/login' || path === '/signin') {
    return { view: 'login', params: {} };
  }
  if (path === '/auth' || path === '/signup' || path === '/register') {
    return { view: 'auth', params: {} };
  }
  if (path === '/reset-password' || path === '/auth/reset-password') {
    return { view: 'reset-password', params: {} };
  }
  if (path.startsWith('/verify') || queryCert) {
    const certFromPath = path.replace(/^\/verify(\/cert)?\/?/, '');
    const targetCert = certFromPath || queryCert;
    return { view: 'verify-cert', params: { certId: targetCert ? decodeURIComponent(targetCert) : '' } };
  }
  if (path === '/' || path === '') {
    return { view: 'landing', params: {} };
  }

  const cleanPath = path.replace(/^\//, '');
  return { view: cleanPath || 'landing', params: {} };
};

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
    soundscapes,
    ambientTheme,
    setAmbientTheme,
  } = useFocusMode();

  const handleNavigate = (view: string, params: Record<string, any> = {}) => {
    let targetView = view;
    let targetParams = { ...params };
    if (view.startsWith('lesson/')) {
      targetView = 'lesson';
      targetParams.lessonId = view.replace('lesson/', '');
    } else if (view.startsWith('practice/')) {
      targetView = 'practice';
      targetParams.lessonId = view.replace('practice/', '');
    } else if (view.startsWith('quiz/') || view.startsWith('quizzes/')) {
      targetView = 'quiz-runner';
      targetParams.quizId = view.split('/')[1];
    }
    setCurrentView(targetView);
    setViewParams(targetParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const targetPath = targetView === 'landing' ? '/' : `/${targetView}`;
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
      const search = new URLSearchParams(window.location.search);
      const { view, params } = resolveViewFromUrl(window.location.pathname, search);
      setCurrentView(view);
      setViewParams(params);
    } catch (e) {}

    const handlePopState = () => {
      try {
        const search = new URLSearchParams(window.location.search);
        const { view, params } = resolveViewFromUrl(window.location.pathname, search);
        setCurrentView(view);
        setViewParams(params);
      } catch (e) {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO & Accessibility Language Engine
  useEffect(() => {
    let title = 'Nihomi AI™ (にほみ) — JLPT N5–N1 জাপানিজ লার্নিং প্ল্যাটফর্ম';
    let description =
      'বাংলায় সহজ ব্যাখ্যা, ২৪/৭ পার্সোনাল AI সেনসেই, অথেনটিক মিন্না নো নিহোঙ্গো ও JLPT N5, N4, N3, N2, N1 সম্পূর্ণ ২১০টি মাস্টার পাঠ্যক্রম ও টোকিও জব সিমুলেশন।';

    if (currentView === 'courses' || currentView === 'curriculum' || currentView === 'pathways') {
      title = 'JLPT N5–N1 Curriculum & Masterclass Roadmap (২১০টি পাঠ) | Nihomi';
      description =
        'JLPT N5, N4, N3, N2 এবং N1 স্তরের ২১টি সম্পূর্ণ মডিউল ও ২১০টি মাস্টার পাঠ। বাস্তবমুখী ব্যাকরণ, কাঞ্জি ও কেইগো ড্রিল।';
    } else if (currentView === 'practice' || currentView === 'lesson-practice') {
      const lessonLabel = (viewParams.lessonId || 'N5-L01').toUpperCase();
      title = `Practice ${lessonLabel} — Interactive MCQ & Typing Drills | Nihomi`;
      description = `${lessonLabel} এর জন্য ইন্টারঅ্যাক্টিভ কুইজ, টাইপিং পরীক্ষা এবং তাত্ক্ষণিক স্কোর পর্যালোচনা।`;
    } else if (currentView === 'lesson') {
      const lessonLabel = (viewParams.lessonId || 'N5-L01').toUpperCase();
      title = `Lesson ${lessonLabel} — Master Japanese Curriculum | Nihomi`;
      description = `${lessonLabel} এর পূর্ণাঙ্গ ব্যাকরণ নোট, নতুন শব্দভান্ডার, কাঞ্জি স্ট্রোক এবং বাস্তব জীবনের কথোপকথন।`;
    } else if (currentView === 'quizzes' || currentView === 'quiz' || currentView === 'quiz-runner') {
      title = 'Interactive Japanese Quizzes & Flash Drills | Nihomi';
      description = 'JLPT পরীক্ষার আদলে তৈরি বিশেষ কুইজ এবং তাত্ক্ষণিক স্কোরিং ব্যবস্থা।';
    } else if (currentView === 'kana' || currentView === 'hiragana' || currentView === 'katakana') {
      title = 'Tactile Kana Lab (হিরাগানা ও কাতাকানা স্ট্রোক ল্যাব) | Nihomi';
      description = 'হাতে-কলমে বর্ণমালা আঁকা, অ্যানিমেটেড স্ট্রোক অর্ডার এবং উচ্চারণ প্র্যাকটিস।';
    } else if (currentView === 'kanji') {
      title = 'Essential Kanji Lab & Radical Breakdown | Nihomi';
      description = 'কাঞ্জি স্ট্রোক অর্ডার অ্যানিমেশন, ওন-ইওমি, কুন-ইওমি ও বাস্তব যৌক্তিক শব্দ।';
    } else if (currentView === 'listening') {
      title = 'Tokyo Listening & Kaiwa Lab | Nihomi';
      description = 'জাপানিদের স্বাভাবিক বাচনভঙ্গি, দ্রুত শ্রবণ পরীক্ষা এবং বাস্তব সংলাপ।';
    } else if (currentView === 'baito' || currentView === 'interview') {
      title = 'Tokyo Baito OS & Workplace Japanese Simulator | Nihomi';
      description = 'কনবিনি পিওএস ক্যাশিয়ার সিমুলেটর, ভিসা ইন্টারভিউ ডিফেন্স ও পার্ট-টাইম কাজের প্রস্তুতি।';
    } else if (currentView === 'dashboard') {
      title = 'Student Dashboard | Nihomi Japanese Learning OS';
      description = 'আপনার প্রতিদিনের স্টাডি স্ট্রিক, অগ্রগতি ও পরবর্তী পাঠ পর্যবেক্ষণ করুন।';
    } else if (currentView === 'pricing') {
      title = 'Plans & Pricing (সাশ্রয়ী সাবস্ক্রিপশন) | Nihomi';
      description = '২৪/৭ সেনসেই AI, ফুল কারিকুলাম এক্সেস এবং টোকিও ইন্টারভিউ কোচিং।';
    }

    updatePageMetaTags({
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      canonicalUrl: `https://nihomi.com/${currentView === 'landing' ? '' : currentView}`
    });

    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'bn';
    }
  }, [currentView, viewParams]);

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

  const isAdLanding = currentView === 'start' || currentView === 'ad-campaign' || currentView === 'campaign';
  const isCanvasMode = currentView === 'world' || currentView === 'canvas' || currentView === 'shibuya';
  const isDashboardRoute = currentView === 'dashboard' || currentView === 'student-dashboard' || currentView === 'portal-dashboard';
  const isJourneyMode = currentView === 'journey';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] font-sans antialiased text-slate-900 dark:text-stone-100 sepia:text-[#433422] transition-colors overflow-x-hidden max-w-full">
      {/* Offline Feedback & Service Worker Resilience Banner */}
      {!isFocusMode && !isAdLanding && !isCanvasMode && <OfflineNotificationBanner />}

      {/* Focus Mode Sakura Ambient Canvas Background */}
      <FocusSakuraBackground
        isActive={isFocusMode}
        soundscapeMode={soundscapeMode}
        soundActive={zenSoundActive}
        themePreset={ambientTheme}
      />

      {/* Focus Mode Pomodoro Bar (25m / 50m / 5m Break Intervals + Zen Soundscape Player) */}
      {isFocusMode && (
        <FocusPomodoroBar
          zenSoundActive={zenSoundActive}
          toggleZenSound={toggleZenSound}
          soundscapeMode={soundscapeMode}
          setSoundscapeMode={setSoundscapeMode}
          soundscapes={soundscapes}
          ambientTheme={ambientTheme}
          setAmbientTheme={setAmbientTheme}
          onExitFocus={() => toggleFocusMode(false)}
          onFocusBlockComplete={() => window.dispatchEvent(new CustomEvent('nihomi-focus-complete'))}
        />
      )}

      {/* Global Export Download Path Toast Notification */}
      <ExportToastNotification />

      {/* Main Header (Hidden in Real Japan Canvas, Student Dashboard, and Journey for unified minimal UX) */}
      {!isFocusMode && !isAdLanding && !isCanvasMode && !isDashboardRoute && !isJourneyMode && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      )}
      
      <main className={`flex-grow w-full max-w-full ${isJourneyMode ? 'min-h-screen flex flex-col' : 'overflow-x-hidden'} ${isFocusMode ? 'pt-8' : ''} ${isCanvasMode || isJourneyMode ? 'p-0 pb-0' : isAdLanding ? 'p-0' : 'pb-16 md:pb-0'}`}>
        <GlobalErrorBoundary>
          <Suspense fallback={<ViewLoadingFallback />}>
          {(currentView === 'start' || currentView === 'ad-campaign' || currentView === 'campaign') && (
          <AdCampaignView onNavigate={handleNavigate} />
        )}
        {(currentView === 'growth' || currentView === 'admin-growth' || currentView === 'founder/growth') && (
          <AdminGrowthView onNavigate={handleNavigate} />
        )}
        {(currentView === 'landing' || currentView === 'home' || currentView === 'classic') && (
          <LandingView onNavigate={handleNavigate} />
        )}
        {(currentView === 'world' || currentView === 'canvas' || currentView === 'shibuya') && (
          <RealJapanCanvasView onNavigate={handleNavigate} />
        )}
        {(currentView === 'dashboard' || currentView === 'student-dashboard' || currentView === 'portal-dashboard') && (
          <DashboardView onNavigate={handleNavigate} />
        )}
        {(currentView === 'courses' || currentView === 'pathways') && (
          <CoursesView onNavigate={handleNavigate} />
        )}
        {currentView === 'journey' && (
          <LearnerJourneyEngine
            isOpen={true}
            onClose={() => handleNavigate('landing')}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'lesson' && (
          <LessonView lessonId={viewParams.lessonId || 'n5-l1'} onNavigate={handleNavigate} />
        )}
        {(currentView === 'practice' || currentView === 'lesson-practice') && (
          <LessonPracticeView lessonId={viewParams.lessonId || 'n5-l1'} onNavigate={handleNavigate} />
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
        {(currentView === 'baito' || currentView === 'baito-os' || currentView === 'simulation' || currentView === 'relocation' || currentView === 'workos' || currentView === 'work-os') && (
          <BaitoOsView
            onNavigate={handleNavigate}
            initialScenarioId={viewParams.scenarioId}
            initialTab={viewParams.tab}
          />
        )}
        {(currentView === 'interview' || currentView === 'interview-lab' || currentView === 'visa-defense') && (
          <BaitoOsView
            onNavigate={handleNavigate}
            initialScenarioId={viewParams.scenarioId || 'sc-school-principal'}
            initialTab={viewParams.tab || 'interview_lab'}
          />
        )}
        {(currentView === 'rirekisho' || currentView === 'cv-builder' || currentView === 'resume' || currentView === 'jis-rirekisho') && (
          <BaitoOsView
            onNavigate={handleNavigate}
            initialTab="rirekisho"
          />
        )}
        {(currentView === 'keirekisho' || currentView === 'shokumu' || currentView === 'shokumu-keirekisho') && (
          <BaitoOsView
            onNavigate={handleNavigate}
            initialTab="keirekisho"
          />
        )}
        {(currentView === 'verify-cert' || currentView === 'verify' || currentView === 'certificate-verification') && (
          <CertificateVerificationPage
            initialCertId={viewParams.certId}
            onNavigate={handleNavigate}
          />
        )}
        {(currentView === 'kana' || currentView === 'hiragana' || currentView === 'katakana' || currentView === 'kana-lab') && (
          <KanaView onNavigate={handleNavigate} />
        )}
        {(currentView === 'kanji' || currentView === 'kanji-lab' || currentView === 'kanji-100' || currentView === 'n5-kanji') && (
          <KanjiView />
        )}
        {(currentView === 'listening' || currentView === 'listening-lab' || currentView === 'kaiwa' || currentView === 'choukai') && (
          <ListeningLabView onNavigate={handleNavigate} />
        )}
        {(currentView === 'cloud' || currentView === 'nihomi-cloud' || currentView === 'drive' || currentView === 'locker') && (
          <NihomiCloudView onUpgradeClick={() => handleNavigate('pricing')} />
        )}
        {(currentView === 'showcase' || currentView === 'mockups' || currentView === 'mobile-showcase') && (
          <NihomiMobileShowcase />
        )}
        {(currentView === 'memory-os' || currentView === 'memoryos' || currentView === 'srs' || currentView === 'memory') && (
          <MemoryOsView onNavigate={handleNavigate} />
        )}
        {(currentView === 'japan-twin' || currentView === 'japantwin' || currentView === 'twin') && (
          <JapanTwinView onNavigate={handleNavigate} />
        )}
        {(currentView === 'profile' || currentView === 'account' || currentView === 'me') && (
          <ProfileView onNavigate={handleNavigate} />
        )}
        {(currentView === 'badges' || currentView === 'achievements') && (
          <BadgesView onNavigate={handleNavigate} />
        )}
        {(currentView === 'progress' || currentView === 'stats' || currentView === 'telemetry') && (
          <ProgressView onNavigate={handleNavigate} />
        )}
        {(currentView === 'vocabulary' || currentView === 'vocab' || currentView === 'words') && (
          <VocabularyView onNavigate={handleNavigate} />
        )}
        {(currentView === 'ai-coach' || currentView === 'coach' || currentView === 'tutor') && (
          <AICoachView onNavigate={handleNavigate} />
        )}
        {(currentView === 'quiz-insights' || currentView === 'insights') && (
          <QuizPerformanceInsightsView onNavigate={handleNavigate} />
        )}
        {!KNOWN_VIEWS.has(currentView) && (
          <RouteRecoveryView currentView={currentView} onNavigate={handleNavigate} />
        )}
        </Suspense>
        </GlobalErrorBoundary>
      </main>

      {!isFocusMode && !isAdLanding && !isCanvasMode && !isJourneyMode && <Footer onNavigate={handleNavigate} />}

      {/* Mobile Bottom Bar for PWA Touch Experience */}
      {!isFocusMode && !isAdLanding && !isCanvasMode && !isJourneyMode && currentView !== 'dashboard' && currentView !== 'student-dashboard' && currentView !== 'portal-dashboard' && (
        <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />
      )}

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
      {!isCanvasMode && !isJourneyMode && <FloatingAiSenseiWidget currentContext={{ viewName: currentView }} />}

      {/* Official WhatsApp & Student Admission Helpline Widget */}
      {!isFocusMode && !isCanvasMode && !isJourneyMode && <WhatsAppHelpline />}

      {/* PWA Home Screen Installation Prompt Banner */}
      {!isFocusMode && !isCanvasMode && !isJourneyMode && <InstallPWA />}
    </div>
  );
};

export default App;
