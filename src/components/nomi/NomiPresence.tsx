// NIHOMI.COM — NOMI PRESENCE (CANONICAL DOCK / ANCHOR) v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React from 'react';
import { useNomi } from './NomiCompanionContext';
import { Sparkles, MessageSquare, X } from 'lucide-react';

interface NomiPresenceProps {
  className?: string;
}

export const NomiPresence: React.FC<NomiPresenceProps> = ({ className = '' }) => {
  const { state, isOpen, toggleCompanion, activeAvatar, routeConfig } = useNomi();

  return (
    <div
      className={`fixed z-40 transition-all duration-300 ${
        isOpen
          ? 'hidden' // When open, panel handles its own anchored header/close
          : 'bottom-20 right-4 sm:bottom-6 sm:right-6'
      } ${className}`}
    >
      <button
        id="btn-nomi-presence"
        type="button"
        onClick={toggleCompanion}
        aria-label={isOpen ? 'Nomi companion বন্ধ করুন' : 'Nomi companion খুলুন'}
        aria-expanded={isOpen}
        className="group relative flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full bg-[#141726] hover:bg-[#1B1E30] text-[#F6F0E6] border-2 border-[#E45147] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#E45147] focus:ring-offset-2 focus:ring-offset-[#141726]"
      >
        {/* Canonical Nomi Avatar with State Expression */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#F6F0E6] border border-[#E45147]/60 shrink-0 shadow-inner">
          <img
            src={activeAvatar}
            alt="Nomi Companion"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              state === 'celebrating' ? 'scale-110' : 'group-hover:scale-105'
            }`}
          />
          {/* Active State Dot Indicator */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#141726] ${
              state === 'celebrating'
                ? 'bg-amber-400 animate-ping'
                : state === 'listening'
                ? 'bg-emerald-400 animate-pulse'
                : state === 'thinking'
                ? 'bg-purple-400 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
        </div>

        {/* Text Pill on Desktop */}
        <div className="hidden sm:flex flex-col text-left pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white">Nomi Sensei (নমি সেন্সেই)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#6D7C55]/20 text-[#a3e635] font-bold">
              সঙ্গী
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-medium truncate max-w-[130px]">
            {routeConfig.titleBn}
          </span>
        </div>

        {/* Subtle Pulse Halo when not reduced motion */}
        {state !== 'reduced_motion' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E45147] rounded-full animate-ping opacity-60 hidden sm:block" />
        )}
      </button>
    </div>
  );
};
