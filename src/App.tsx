import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingView } from './views/LandingView';
import { CoursesView } from './views/CoursesView';
import { StudentPortalView } from './views/StudentPortalView';
import { FounderCommandCenterView } from './views/FounderCommandCenterView';
import { DocumentsView } from './views/DocumentsView';
import { AICreditsView } from './views/AICreditsView';
import { AuthModal } from './components/auth/AuthModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] font-sans antialiased text-stone-900 selection:bg-red-500 selection:text-white">
      
      {/* Global Header */}
      {currentView !== 'founder' && (
        <Header currentView={currentView} onNavigate={setCurrentView} />
      )}
      
      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'landing' && <LandingView onNavigate={setCurrentView} />}
        {currentView === 'courses' && <CoursesView onNavigate={setCurrentView} />}
        {currentView === 'portal' && <StudentPortalView initialTab="learn" onNavigate={setCurrentView} />}
        {currentView === 'portal-practice' && <StudentPortalView initialTab="practice" onNavigate={setCurrentView} />}
        {currentView === 'portal-assess' && <StudentPortalView initialTab="assess" onNavigate={setCurrentView} />}
        {currentView === 'portal-progress' && <StudentPortalView initialTab="progress" onNavigate={setCurrentView} />}
        {currentView === 'portal-profile' && <StudentPortalView initialTab="profile" onNavigate={setCurrentView} />}
        {currentView === 'documents' && <DocumentsView />}
        {currentView === 'credits' && <AICreditsView onNavigate={setCurrentView} />}
        {currentView === 'founder' && <FounderCommandCenterView onNavigate={setCurrentView} />}
      </main>

      {/* Global Brand Footer */}
      {currentView !== 'founder' && (
        <Footer onNavigate={setCurrentView} />
      )}

      {/* Global Verified Auth Modal */}
      <AuthModal />

    </div>
  );
};

export default App;