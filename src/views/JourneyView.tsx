import React from 'react';
import { LearnerJourneyEngine } from '../components/learning/LearnerJourneyEngine';

interface JourneyViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ onNavigate }) => {
  return (
    <LearnerJourneyEngine
      isOpen={true}
      onClose={() => onNavigate('lesson', { lessonId: 'n5-l2' })}
      onNavigate={onNavigate}
      isModal={false}
    />
  );
};

export default JourneyView;
