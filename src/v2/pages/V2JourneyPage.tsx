// src/v2/pages/V2JourneyPage.tsx
import React from 'react';
import { LearnerJourneyEngine } from '../../components/learning/LearnerJourneyEngine';
import { V2Route, V2NavigationParams } from '../types';

interface V2JourneyPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2JourneyPage: React.FC<V2JourneyPageProps> = ({ onNavigate }) => {
  const handleAdapterNavigate = (view: string, params?: Record<string, any>) => {
    let targetRoute: V2Route = 'dashboard';
    if (view === 'landing' || view === 'home') targetRoute = 'landing';
    else if (view === 'courses' || view === 'curriculum') targetRoute = 'curriculum';
    else if (view === 'lesson') targetRoute = 'lesson';
    else if (view === 'kana') targetRoute = 'kana';
    else if (view === 'baito' || view === 'workos') targetRoute = 'workos';
    else if (view === 'pricing') targetRoute = 'pricing';
    onNavigate(targetRoute, params);
  };

  return (
    <div className="w-full min-h-screen bg-[#0E0E18] text-[#F6F0E6]">
      <LearnerJourneyEngine
        isOpen={true}
        onClose={() => onNavigate('dashboard')}
        onNavigate={handleAdapterNavigate}
        isModal={false}
      />
    </div>
  );
};
