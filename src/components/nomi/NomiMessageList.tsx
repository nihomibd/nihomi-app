// NIHOMI.COM — NOMI MESSAGE LIST v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React, { useEffect, useRef } from 'react';
import { useNomi } from './NomiCompanionContext';
import { NomiTypingIndicator } from './NomiTypingIndicator';
import { Volume2, Sparkles } from 'lucide-react';
import { NOMI_STATE_ASSETS } from './types';

export const NomiMessageList: React.FC = () => {
  const { messages, state, speakText, isSpeaking } = useNomi();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-stone-200">
      {messages.map((msg) => {
        const isNomi = msg.sender === 'nomi';
        const avatarSrc = msg.stateSnapshot
          ? NOMI_STATE_ASSETS[msg.stateSnapshot] || NOMI_STATE_ASSETS.idle
          : NOMI_STATE_ASSETS.idle;

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isNomi ? 'items-start' : 'items-end'} animate-fadeIn`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] ${
                isNomi ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Nomi Avatar on incoming message */}
              {isNomi && (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#F6F0E6] border border-[#E45147]/50 shrink-0 mt-0.5 shadow-xs">
                  <img src={avatarSrc} alt="Nomi" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl space-y-1.5 shadow-sm leading-relaxed ${
                  isNomi
                    ? 'bg-[#1B1E30] text-[#F6F0E6] rounded-tl-xs border border-[#F6F0E6]/10'
                    : 'bg-[#E45147] text-white rounded-tr-xs shadow-md shadow-red-900/20'
                }`}
              >
                <p className="text-xs sm:text-[13px] font-normal leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Optional Japanese Audio Playback CTA */}
                {msg.audioPhrase && (
                  <button
                    type="button"
                    onClick={() => speakText(msg.audioPhrase!)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-amber-300 text-[11px] font-bold transition cursor-pointer mt-1"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-[#E45147]' : ''}`} />
                    <span>উচ্চারণ শুনুন: {msg.audioPhrase}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Thinking Indicator */}
      {(state === 'thinking' || state === 'responding') && <NomiTypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
};
