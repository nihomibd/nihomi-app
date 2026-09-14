import React from 'react';
import { AuthView } from './AuthView.js';
import { JLPTLevel } from '../types.js';

interface LoginViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  initialLevel?: JLPTLevel;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, initialLevel = 'N5' }) => {
  return (
    <AuthView
      initialMode="login"
      initialLevel={initialLevel}
      onNavigate={onNavigate}
    />
  );
};

export default LoginView;
