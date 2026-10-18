// NIHOMI.COM — NOMI TYPING INDICATOR v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React from 'react';

export const NomiTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1B1E30] border border-[#F6F0E6]/10 text-xs w-fit text-stone-300 animate-fadeIn">
      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#F6F0E6] shrink-0 border border-[#E45147]/40">
        <img
          src="/brand/nomi/nomi-think.png"
          alt="Nomi thinking"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[11px] font-medium text-stone-300">নমি সেন্সেই ভাবছেন...</span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E45147] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#E45147] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#E45147] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
