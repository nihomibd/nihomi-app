import React from 'react';
import { LearnerJourneyEngine } from '../components/learning/LearnerJourneyEngine';
import { loadLearnerKnowledgeState } from '../core/curriculum/learnerKnowledgeState';
import { getNextBestMission } from '../core/curriculum/journeyEngine';

interface JourneyViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ onNavigate }) => {
  return (
    <LearnerJourneyEngine
      isOpen={true}
      onClose={() => {
        const kState = loadLearnerKnowledgeState();
        const next = getNextBestMission(kState);
        onNavigate(next.viewRoute, next.viewParams);
      }}
      onNavigate={onNavigate}
      isModal={false}
    />
  );
};

export default JourneyView;
