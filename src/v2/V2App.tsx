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
import { V2WorkOsPage } from './pages/V2WorkOsPage';
import { V2RirekishoPage } from './pages/V2RirekishoPage';
import { V2PricingPage } from './pages/V2PricingPage';
import { V2FounderPage } from './pages/V2FounderPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { RefundPolicyPage } from '../pages/RefundPolicyPage';

const parseHashRoute = (): { route: V2Route; params: V2NavigationParams } => {
  if (typeof window === 'undefined') return { route: 'landing', params: {} };
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
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
      return { route: 'journey', params };
    case 'dashboard':
    case 'student-dashboard':
      return { route: 'dashboard', params };
    case 'kana':
    case 'hiragana':
    case 'katakana':
      if (parts[1]) params.char = parts[1];
      return { route: 'kana', params };
    case 'curriculum':
    case 'courses':
      return { route: 'curriculum', params };
    case 'lesson':
      if (parts[1]) params.lessonId = parts[1];
      return { route: 'lesson', params };
    case 'workos':
    case 'baito':
      return { route: 'workos', params };
    case 'rirekisho':
    case 'cv':
      return { route: 'rirekisho', params };
    case 'pricing':
    case 'plans':
      return { route: 'pricing', params };
    case 'founder':
    case 'admin':
      return { route: 'founder', params };
    case 'terms':
      return { route: 'terms', params };
    case 'privacy':
      return { route: 'privacy', params };
    case 'refund':
      return { route: 'refund', params };
    default:
      return { route: 'landing', params };
  }
};

export const V2App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<V2Route>('landing');
  const [navParams, setNavParams] = useState<V2NavigationParams>({});

  // Synchronize route from window.location.hash on initial mount & hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const { route, params } = parseHashRoute();
      setCurrentRoute(route);
      setNavParams(params);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: V2Route, params?: V2NavigationParams) => {
    setCurrentRoute(route);
    setNavParams(params || {});

    // Update window hash cleanly
    let hash = `#${route}`;
    if (params?.char) hash += `/${params.char}`;
    else if (params?.lessonId) hash += `/${params.lessonId}`;

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
            onNavigate={handleNavigate}
          />
        );
      case 'workos':
        return <V2WorkOsPage onNavigate={handleNavigate} />;
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
    <V2AppShell currentRoute={currentRoute} onNavigate={handleNavigate}>
      {renderActivePage()}
    </V2AppShell>
  );
};
export default V2App;
