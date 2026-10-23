// NIHOMI.COM — NOMI ANCHORED PANEL v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React, { useEffect, useRef } from 'react';
import { useNomi } from './NomiCompanionContext';
import { NomiMessageList } from './NomiMessageList';
import { NomiComposer } from './NomiComposer';
import { X, Minimize2, Sparkles, Volume2, Sliders } from 'lucide-react';

interface NomiPanelProps {
  className?: string;
}

export const NomiPanel: React.FC<NomiPanelProps> = ({ className = '' }) => {
  const { isOpen, closeCompanion, state, activeAvatar, routeConfig, speechRate, setSpeechRate } = useNomi();
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: Escape to close panel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCompanion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCompanion]);

  if (!isOpen) return null;

  return (
    <div
      id="nomi-companion-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nomi-panel-title"
      ref={panelRef}
      className={`fixed z-[10001] bottom-20 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] h-[520px] sm:h-[580px] max-h-[82vh] bg-[#141726] border-2 border-[#E45147]/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#F6F0E6] animate-in zoom-in-95 duration-200 ${className}`}
    >
      {/* Panel Header */}
      <div id="nomi-panel-header" className="p-3.5 bg-[#1B1E30] border-b border-[#F6F0E6]/10 flex items-center justify-between gap-3 shrink-0">
        {/* Nomi Identity with State Expression */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#F6F0E6] border-2 border-[#E45147] shrink-0 shadow-sm">
            <img
              src={activeAvatar}
              alt="Nomi"
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#1B1E30] ${
                state === 'celebrating'
                  ? 'bg-amber-400'
                  : state === 'listening'
                  ? 'bg-emerald-400'
                  : 'bg-emerald-500'
              }`}
            />
          </div>

          <div>
            <h3
              id="nomi-panel-title"
              className="text-sm font-black text-white flex items-center gap-1.5"
            >
              <span>Nomi Sensei (নমি সেন্সেই)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#E45147]/20 text-[#E45147]">
                AI কোচ
              </span>
            </h3>
            <p className="text-[11px] text-stone-400 font-medium truncate max-w-[190px]">
              {routeConfig.titleBn}
            </p>
          </div>
        </div>

        {/* Audio Speed Controls & Panel Controls */}
        <div className="flex items-center gap-1.5">
          {/* Listening Speed Selector */}
          <div className="flex items-center bg-[#111320] rounded-lg p-0.5 border border-[#F6F0E6]/10 text-[10px] font-mono">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                type="button"
                id={`btn-speed-${rate}`}
                onClick={() => setSpeechRate(rate)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                  speechRate === rate
                    ? 'bg-[#E45147] text-white font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={`স্পিচ স্পিড ${rate}x`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            type="button"
            id="btn-nomi-minimize"
            onClick={closeCompanion}
            aria-label="মিনিমাইজ করুন"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="মিনিমাইজ"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="btn-close-nomi"
            onClick={closeCompanion}
            aria-label="Nomi companion বন্ধ করুন"
            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/10 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <NomiMessageList />

      {/* Composer Input */}
      <NomiComposer />
    </div>
  );
};
