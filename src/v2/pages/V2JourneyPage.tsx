// src/v2/pages/V2JourneyPage.tsx
import React from 'react';
import { LearnerJourneyEngine } from '../../components/learning/LearnerJourneyEngine';
import { V2Route, V2NavigationParams } from '../types';
import { Compass, Sparkles } from 'lucide-react';

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
    else if (view === 'exam' || view === 'mock-exams' || view === 'mock-exam-runner') targetRoute = 'exam';
    else if (view === 'rirekisho' || view === 'cv' || view === 'resume') targetRoute = 'rirekisho';
    else if (view === 'founder' || view === 'admin') targetRoute = 'founder';
    onNavigate(targetRoute, params);
  };

  return (
    <div className="w-full min-h-screen bg-[#0E0E18] text-[#F6F0E6] py-6 sm:py-8 px-4 sm:px-6">
      {/* Tokyo Golden Journey Title Header */}
      <div className="max-w-4xl mx-auto mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>টোকিও গোল্ডেন জার্নি • Tokyo Golden Journey</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white">
          ক্যানোনিকাল লার্নিং পথ ও পর্যায়ক্রমিক আনলক
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          প্রতিটি বর্ণ ও শব্দ শেখার পর সরাসরি টোকিও কনবিনিতে বাস্তব প্রয়োগ।
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <LearnerJourneyEngine
          isOpen={true}
          onClose={() => onNavigate('dashboard')}
          onNavigate={handleAdapterNavigate}
          isModal={false}
        />
      </div>
    </div>
  );
};
