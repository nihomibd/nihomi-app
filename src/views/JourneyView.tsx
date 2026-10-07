// src/views/JourneyView.tsx
import React, { useState, useEffect } from 'react';
import { ConversationalOnboardingModal } from '../components/onboarding/ConversationalOnboardingModal';
import { JourneyRevealView } from '../components/onboarding/JourneyRevealView';
import { TokyoKonbiniFirstMissionModal } from '../components/missions/TokyoKonbiniFirstMissionModal';
import {
  getSavedOnboardingAnswers,
  isOnboardingCompleted,
  DEFAULT_ONBOARDING_ANSWERS
} from '../core/onboarding/onboardingStorage';
import { OnboardingAnswers } from '../core/onboarding/onboardingTypes';
import { HanabiBackground } from '../components/HanabiBackground';

interface JourneyViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ onNavigate }) => {
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(() => getSavedOnboardingAnswers());
  const [activeScreen, setActiveScreen] = useState<'onboarding' | 'reveal'>(() => {
    return isOnboardingCompleted() ? 'reveal' : 'onboarding';
  });
  const [isFirstMissionOpen, setIsFirstMissionOpen] = useState(false);

  useEffect(() => {
    // Check if coming directly with hash or params to trigger first mission
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      if (search.get('mission') === 'first' || search.get('mission') === 'konbini') {
        setIsFirstMissionOpen(true);
      }
    }
  }, []);

  const handleOnboardingComplete = (newAnswers: OnboardingAnswers) => {
    setAnswers(newAnswers);
    setActiveScreen('reveal');
  };

  return (
    <div className="relative min-h-screen bg-[#080711] text-stone-100 flex flex-col justify-center items-center py-10 px-4 overflow-hidden">
      {/* Neo-Tokyo Hanabi subtle canvas background */}
      <HanabiBackground />

      {activeScreen === 'onboarding' && (
        <div className="w-full max-w-2xl z-10">
          <ConversationalOnboardingModal
            isOpen={true}
            onClose={() => {
              // Allow fallback to reveal with defaults
              setAnswers(DEFAULT_ONBOARDING_ANSWERS);
              setActiveScreen('reveal');
            }}
            onComplete={handleOnboardingComplete}
            isStandalone={true}
          />
        </div>
      )}

      {activeScreen === 'reveal' && (
        <div className="w-full z-10 animate-in fade-in duration-300">
          <JourneyRevealView
            answers={answers || DEFAULT_ONBOARDING_ANSWERS}
            onNavigate={onNavigate}
            onStartFirstMission={() => setIsFirstMissionOpen(true)}
          />

          <div className="max-w-4xl mx-auto px-4 mt-6 flex items-center justify-center text-xs text-stone-400 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setActiveScreen('onboarding')}
              className="hover:text-white underline cursor-pointer"
            >
              🔄 অনবোর্ডিং প্রশ্নগুলো আবার পরিবর্তন করুন
            </button>
          </div>
        </div>
      )}

      {/* Interactive First Mission Modal */}
      <TokyoKonbiniFirstMissionModal
        isOpen={isFirstMissionOpen}
        onClose={() => setIsFirstMissionOpen(false)}
        onComplete={() => {
          setIsFirstMissionOpen(false);
          onNavigate('dashboard');
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default JourneyView;
