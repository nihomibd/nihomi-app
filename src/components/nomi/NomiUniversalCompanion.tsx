// NIHOMI.COM — NOMI UNIVERSAL COMPANION ROOT v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React, { useEffect } from 'react';
import { useNomi } from './NomiCompanionContext';
import { NomiPresence } from './NomiPresence';
import { NomiPanel } from './NomiPanel';

interface NomiUniversalCompanionProps {
  currentView?: string;
  className?: string;
}

export const NomiUniversalCompanion: React.FC<NomiUniversalCompanionProps> = ({
  currentView,
  className = ''
}) => {
  const { setRouteContext, context } = useNomi();

  // Keep route context in sync with the active view prop
  useEffect(() => {
    if (currentView && currentView !== context.currentView) {
      setRouteContext({ currentView });
    }
  }, [currentView, context.currentView, setRouteContext]);

  return (
    <div className={`nomi-universal-companion ${className}`}>
      {/* Canonical Floating Presence Anchor Button */}
      <NomiPresence />

      {/* Anchored Accessible Slide-Out Panel */}
      <NomiPanel />
    </div>
  );
};

export default NomiUniversalCompanion;
