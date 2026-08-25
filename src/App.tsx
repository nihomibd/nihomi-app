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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  const handleNavigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] font-sans antialiased text-slate-900 dark:text-stone-100 sepia:text-[#433422] transition-colors">
      {/* Offline Feedback & Service Worker Resilience Banner */}
      <OfflineNotificationBanner />

      {/* Main Header */}
      <Header currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="flex-grow">
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

      <Footer onNavigate={handleNavigate} />

      {/* Google Sign-in & Authentication Modal */}
      <AuthModal />

      {/* PWA Home Screen Installation Prompt Banner */}
      <InstallPWA />
    </div>
  );
};

export default App;
