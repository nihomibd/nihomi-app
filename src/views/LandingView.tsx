import React from 'react';
import { HomeView } from './HomeView';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return <HomeView onNavigate={onNavigate} />;
};
