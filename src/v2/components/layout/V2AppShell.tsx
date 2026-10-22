// src/v2/components/layout/V2AppShell.tsx
// NIHOMI V2 — UNIFIED PRODUCT APPLICATION SHELL
import React from 'react';
import { V2Header } from './V2Header';
import { V2Footer } from './V2Footer';
import { V2MobileNav } from './V2MobileNav';
import { V2Route, V2NavigationParams } from '../../types';
import { NomiUniversalCompanion } from '../../../components/nomi';
import { AuthModal } from '../../../components/auth/AuthModal';

interface V2AppShellProps {
  currentRoute: V2Route;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
  children: React.ReactNode;
}

export const V2AppShell: React.FC<V2AppShellProps> = ({
  currentRoute,
  onNavigate,
  children
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A12] text-[#F6F0E6] flex flex-col relative selection:bg-[#E45147]/30 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background glow layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#E45147]/10 via-[#F59E0B]/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-gradient-to-t from-red-950/20 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Sticky V2 Header */}
      <V2Header currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Universal V2 Footer */}
      <V2Footer onNavigate={onNavigate} />

      {/* Mobile Bottom Thumb Navigation */}
      <V2MobileNav currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* AI Sensei Nomi Universal Companion */}
      <NomiUniversalCompanion currentView={currentRoute} />

      {/* Supabase Google Authentication Modal */}
      <AuthModal onNavigate={(view) => onNavigate(view as V2Route)} />
    </div>
  );
};
