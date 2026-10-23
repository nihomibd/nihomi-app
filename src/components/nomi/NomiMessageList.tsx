// NIHOMI.COM — NOMI MESSAGE LIST v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React, { useEffect, useRef } from 'react';
import { useNomi } from './NomiCompanionContext';
import { NomiTypingIndicator } from './NomiTypingIndicator';
import { Volume2, Sparkles, Award, Radio } from 'lucide-react';
import { NOMI_STATE_ASSETS } from './types';

export const NomiMessageList: React.FC = () => {
  const { messages, state, speakText, isSpeaking } = useNomi();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  return (
    <div id="nomi-message-list" className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-stone-200">
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
              className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] ${
                isNomi ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Nomi Avatar on incoming message */}
              {isNomi && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F6F0E6] border border-[#E45147]/50 shrink-0 mt-0.5 shadow-xs">
                  <img src={avatarSrc} alt="Nomi" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl space-y-2 shadow-sm leading-relaxed ${
                  isNomi
                    ? 'bg-[#1B1E30] text-[#F6F0E6] rounded-tl-xs border border-[#F6F0E6]/10'
                    : 'bg-[#E45147] text-white rounded-tr-xs shadow-md shadow-red-900/20'
                }`}
              >
                {/* Voice Input Badge */}
                {msg.isVoiceInput && (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-mono">
                    <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>ভয়েস রিকগনিশন ইনপুট</span>
                  </div>
                )}

                <p className="text-xs sm:text-[13px] font-normal leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </p>

                {/* Pronunciation Evaluation Feedback Card */}
                {msg.pronunciationFeedback && (
                  <div className="p-3 bg-[#0D0F18] text-[#F6F0E6] rounded-xl border border-[#E45147]/40 space-y-2 text-[11px] animate-fadeIn mt-2">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-black">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>উচ্চারণ স্কোর ও বিশ্লেষণ</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono font-black text-[10px] rounded border border-emerald-700">
                        Grade {msg.pronunciationFeedback.accuracyGrade} ({msg.pronunciationFeedback.score}%)
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-stone-300">
                      <div><strong className="text-stone-400">পিচ অ্যাকসেন্ট:</strong> {msg.pronunciationFeedback.pitchAccuracy}</div>
                      <div><strong className="text-stone-400">মোরা রিদম:</strong> {msg.pronunciationFeedback.moraRhythm}</div>
                    </div>

                    <button
                      type="button"
                      id="btn-speak-nomi-pronunciation-model"
                      onClick={() => speakText(msg.pronunciationFeedback?.detectedText || msg.text)}
                      className="w-full mt-1.5 py-1.5 bg-[#1B1E30] hover:bg-[#252a42] rounded-lg text-[10px] font-bold text-amber-300 flex items-center justify-center gap-1.5 border border-[#F6F0E6]/10 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>টোকিও নেটিভ অ্যাকসেন্টে শুনুন</span>
                    </button>
                  </div>
                )}

                {/* Tokyo Native Voice Audio Playback CTA */}
                {isNomi && !msg.pronunciationFeedback && (
                  <button
                    type="button"
                    id="btn-speak-nomi-phrase"
                    onClick={() => speakText(msg.audioPhrase || msg.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-amber-300 hover:text-amber-200 text-[11px] font-bold transition cursor-pointer mt-1 border border-amber-500/20 shadow-xs"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-[#E45147]' : ''}`} />
                    <span>উচ্চারণ শুনুন {msg.audioPhrase ? `(${msg.audioPhrase})` : ''}</span>
                  </button>
                )}

                {/* Bilingual explanation */}
                {msg.bengaliTranslation && !msg.pronunciationFeedback && (
                  <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-300">
                    <span className="text-[9px] uppercase font-bold text-[#E45147] block font-mono">
                      বাংলা অনুবাদ ও নোট:
                    </span>
                    {msg.bengaliTranslation}
                  </div>
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
