// src/v2/V2App.tsx
// NIHOMI V2 — UNIFIED PRODUCT ROUTER & APPLICATION ENTRY POINT
import React, { useState, useEffect } from 'react';
import { V2AppShell } from './components/layout/V2AppShell';
import { V2Route, V2NavigationParams } from './types';
import { V2LandingPage } from './pages/V2LandingPage';
import { V2JourneyPage } from './pages/V2JourneyPage';
import { V2DashboardPage } from './pages/V2DashboardPage';
import { V2KanaPage } from './pages/V2KanaPage';
import { V2CurriculumPage } from './pages/V2CurriculumPage';
import { V2LessonPage } from './pages/V2LessonPage';
import { V2ExamPage } from './pages/V2ExamPage';
import { V2WorkOsPage } from './pages/V2WorkOsPage';
import { V2RirekishoPage } from './pages/V2RirekishoPage';
import { V2PricingPage } from './pages/V2PricingPage';
import { V2FounderPage } from './pages/V2FounderPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { RefundPolicyPage } from '../pages/RefundPolicyPage';
import { CheckoutModal } from '../components/CheckoutModal';
import { hydrateKnowledgeStateFromServer } from '../core/curriculum/learnerKnowledgeState';
import { NomiProvider } from '../components/nomi';

const parseHashRoute = (): { route: V2Route; params: V2NavigationParams } => {
  if (typeof window === 'undefined') return { route: 'landing', params: {} };
  let rawHash = window.location.hash.replace(/^#\/?/, '').trim();

  // If hash is empty, check pathname so direct URLs (/workos, /dashboard, /curriculum, /pricing, /exam) resolve seamlessly to V2
  if (!rawHash) {
    const pathname = window.location.pathname.replace(/^\//, '').toLowerCase().trim();
    if (pathname && pathname !== 'v2' && pathname !== 'legacy' && pathname !== 'classic') {
      rawHash = pathname;
    }
  }

  if (!rawHash) return { route: 'landing', params: {} };

  const [pathPart, queryPart] = rawHash.split('?');
  const params: V2NavigationParams = {};

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  const parts = pathPart.split('/');
  const mainSegment = parts[0]?.toLowerCase();

  switch (mainSegment) {
    case 'journey':
    case 'mission':
    case 'tokyo':
    case 'roadmap':
    case 'pathway':
      return { route: 'journey', params };
    case 'dashboard':
    case 'student-dashboard':
    case 'portal':
    case 'portal-dashboard':
    case 'student':
      return { route: 'dashboard', params };
    case 'kana':
    case 'hiragana':
    case 'katakana':
    case 'alphabet':
      if (parts[1]) params.char = parts[1];
      return { route: 'kana', params };
    case 'curriculum':
    case 'courses':
    case 'course':
    case 'syllabus':
    case 'n5':
    case 'n4':
    case 'n3':
    case 'n2':
    case 'n1':
      return { route: 'curriculum', params };
    case 'lesson':
    case 'lessons':
    case 'grammar':
      if (parts[1]) params.lessonId = parts[1];
      return { route: 'lesson', params };
    case 'exam':
    case 'exams':
    case 'mock':
    case 'mock-exam':
    case 'mock-exams':
    case 'jlpt':
      if (parts[1]) params.examId = parts[1];
      return { route: 'exam', params };
    case 'workos':
    case 'baito':
    case 'conbini':
    case '7eleven':
    case '7-eleven':
    case 'shift':
      return { route: 'workos', params };
    case 'rirekisho':
    case 'cv':
    case 'resume':
    case 'documents':
    case 'relocation-cv':
      return { route: 'rirekisho', params };
    case 'pricing':
    case 'plans':
    case 'subscription':
    case 'subscribe':
    case 'checkout':
      return { route: 'pricing', params };
    case 'founder':
    case 'admin':
    case 'cockpit':
    case 'command-center':
      return { route: 'founder', params };
    case 'terms':
    case 'tos':
      return { route: 'terms', params };
    case 'privacy':
    case 'privacy-policy':
      return { route: 'privacy', params };
    case 'refund':
    case 'refund-policy':
    case 'refunds':
      return { route: 'refund', params };
    case 'legacy':
    case 'classic':
      return { route: 'legacy', params };
    default:
      return { route: 'landing', params };
  }
};

const ROUTE_TITLES: Record<V2Route, string> = {
  landing: 'NIHOMI (にほみ) — শূন্য থেকে JLPT N5, N4, N3 জাপানিজ লার্নিং প্ল্যাটফর্ম',
  journey: 'লার্নার জার্নি — NIHOMI (にほみ)',
  dashboard: 'স্টুডেন্ট ড্যাশবোর্ড — NIHOMI (にほみ)',
  kana: 'হিরাগানা ও কাতাকানা ক্যালিগ্রাফি ক্যানভাস — NIHOMI (にほみ)',
  curriculum: 'JLPT মাস্টার পাঠ্যক্রম (N5–N1) — NIHOMI (にほみ)',
  lesson: 'জাপানি ব্যাকরণ ও শব্দার্থ লেসন — NIHOMI (にほみ)',
  exam: 'JLPT CBT কম্পিউটার-বেইজড মক এক্সাম ও সার্টিফিকেট — NIHOMI (にほみ)',
  workos: 'টোকিও কনবিনি WorkOS™ ক্যাশিয়ার সিমুলেশন — NIHOMI (にほみ)',
  rirekisho: 'JIS স্ট্যান্ডার্ড জাপানি জীবনবৃত্তান্ত (履歴書) স্টুডিও — NIHOMI (にほみ)',
  pricing: 'প্রাইসিং ও মেম্বারশিপ প্ল্যান — NIHOMI (にほみ)',
  founder: 'ফাউন্ডার কমান্ড সেন্টার — NIHOMI (にほみ)',
  terms: 'শর্তাবলী (Terms of Service) — NIHOMI (にほみ)',
  privacy: 'গোপনীয়তা নীতি (Privacy Policy) — NIHOMI (にほみ)',
  refund: 'রিফান্ড পলিসি — NIHOMI (にほみ)',
  legacy: 'NIHOMI Classic'
};

export interface V2AppProps {
  onNavigateLegacy?: () => void;
}

export const V2App: React.FC<V2AppProps> = ({ onNavigateLegacy }) => {
  const [currentRoute, setCurrentRoute] = useState<V2Route>(() => {
    const initial = parseHashRoute();
    return initial.route === 'legacy' ? 'landing' : initial.route;
  });
  const [navParams, setNavParams] = useState<V2NavigationParams>(() => parseHashRoute().params);

  // Global Checkout Modal State
  // Dynamic Unique Route Titles
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = ROUTE_TITLES[currentRoute] || 'NIHOMI (にほみ)';
    }
  }, [currentRoute]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<any>({
    id: 'pro',
    name: 'Nihomi Pro',
    monthlyPrice: 1990
  });

  const handleOpenCheckout = (planTier: string = 'pro') => {
    let name = 'Nihomi Pro';
    let monthlyPrice = 1990;
    if (planTier === 'starter') {
      name = 'Nihomi Starter';
      monthlyPrice = 990;
    } else if (planTier === 'japan_ready') {
      name = 'Nihomi Japan Ready';
      monthlyPrice = 3990;
    }
    setSelectedPlanForCheckout({
      id: planTier,
      name,
      monthlyPrice
    });
    setIsCheckoutOpen(true);
  };

  // Synchronize route from window.location.hash on initial mount & hashchange
  useEffect(() => {
    hydrateKnowledgeStateFromServer().catch(() => {});
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const { route, params } = parseHashRoute();
      if (route === 'legacy') {
        if (onNavigateLegacy) {
          onNavigateLegacy();
        } else {
          window.location.href = '/legacy';
        }
        return;
      }
      setCurrentRoute(route);
      setNavParams(params);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onNavigateLegacy]);

  const handleNavigate = (route: V2Route, params?: V2NavigationParams) => {
    if (route === 'legacy') {
      if (onNavigateLegacy) {
        onNavigateLegacy();
      } else {
        window.location.href = '/legacy';
      }
      return;
    }

    setCurrentRoute(route);
    setNavParams(params || {});

    // Update window hash cleanly
    let hash = `#${route}`;
    if (params?.char) hash += `/${params.char}`;
    else if (params?.lessonId) hash += `/${params.lessonId}`;
    else if (params?.examId) hash += `/${params.examId}`;

    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'landing':
        return <V2LandingPage onNavigate={handleNavigate} />;
      case 'journey':
        return <V2JourneyPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <V2DashboardPage onNavigate={handleNavigate} />;
      case 'kana':
        return (
          <V2KanaPage
            initialChar={navParams.char}
            onNavigate={handleNavigate}
          />
        );
      case 'curriculum':
        return <V2CurriculumPage onNavigate={handleNavigate} />;
      case 'lesson':
        return (
          <V2LessonPage
            lessonId={navParams.lessonId || 'n5-l01'}
            params={navParams}
            onNavigate={handleNavigate}
            onOpenCheckout={handleOpenCheckout}
          />
        );
      case 'exam':
        return (
          <V2ExamPage
            examId={navParams.examId}
            onNavigate={handleNavigate}
            onOpenCheckout={handleOpenCheckout}
          />
        );
      case 'workos':
        return (
          <V2WorkOsPage
            onNavigate={handleNavigate}
            onOpenCheckout={handleOpenCheckout}
          />
        );
      case 'rirekisho':
        return <V2RirekishoPage onNavigate={handleNavigate} />;
      case 'pricing':
        return (
          <V2PricingPage
            initialPlan={navParams.planId}
            initialInterval={navParams.interval}
            onNavigate={handleNavigate}
          />
        );
      case 'founder':
        return <V2FounderPage onNavigate={handleNavigate} />;
      case 'terms':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <TermsPage onNavigate={() => handleNavigate('landing')} />
          </div>
        );
      case 'privacy':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <PrivacyPage onNavigate={() => handleNavigate('landing')} />
          </div>
        );
      case 'refund':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <RefundPolicyPage onNavigate={() => handleNavigate('landing')} />
          </div>
        );
      default:
        return <V2LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <NomiProvider initialView={currentRoute}>
        <V2AppShell currentRoute={currentRoute} onNavigate={handleNavigate}>
          {renderActivePage()}
        </V2AppShell>
      </NomiProvider>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlanForCheckout}
        plan={selectedPlanForCheckout}
        initialInterval="monthly"
        onSuccess={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
export default V2App;
