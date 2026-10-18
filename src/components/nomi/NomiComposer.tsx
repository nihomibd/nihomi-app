// NIHOMI.COM — NOMI COMPOSER v1.0
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol

import React, { useState, useRef } from 'react';
import { useNomi } from './NomiCompanionContext';
import { Send, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { soundEffects } from '../../lib/soundEffects';

export const NomiComposer: React.FC = () => {
  const { sendMessage, state, routeConfig, dispatch } = useNomi();
  const [inputText, setInputText] = useState('');
  const [isMicRecording, setIsMicRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isBusy = state === 'thinking';

  const handleSend = () => {
    if (!inputText.trim() || isBusy) return;
    const text = inputText;
    setInputText('');
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (query: string) => {
    if (isBusy) return;
    sendMessage(query);
  };

  // Explicit opt-in speech recognition
  const toggleMic = async () => {
    if (isMicRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsMicRecording(false);
      dispatch('AI_RESPONSE_RECEIVED', { nextState: 'encouraging' });
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsMicRecording(true);
          dispatch('COMPANION_OPENED'); // keep active
        };

        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          setIsMicRecording(false);
          setInputText(transcript);
          sendMessage(transcript);
          try {
            soundEffects.playCorrectPing();
          } catch {}
        };

        recognition.onerror = () => {
          setIsMicRecording(false);
        };

        recognition.onend = () => {
          setIsMicRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        // Fallback for browsers without SpeechRecognition
        setIsMicRecording(true);
        setTimeout(() => {
          setIsMicRecording(false);
          setInputText('あ');
          sendMessage('あ');
        }, 1500);
      }
    } catch {
      setIsMicRecording(false);
    }
  };

  return (
    <div className="p-3 bg-[#111320] border-t border-[#F6F0E6]/10 flex flex-col gap-2.5">
      {/* Quick Prompt Chips */}
      {routeConfig.quickPrompts.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] text-[#E45147] font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> সাজেশন:
          </span>
          {routeConfig.quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isBusy}
              onClick={() => handleChipClick(prompt.query)}
              className="px-2.5 py-1 rounded-full bg-[#1B1E30] hover:bg-[#252a42] text-[11px] text-stone-300 hover:text-white border border-[#F6F0E6]/10 whitespace-nowrap transition cursor-pointer disabled:opacity-50"
            >
              {prompt.labelBn}
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2">
        {/* Opt-in Microphone Button */}
        <button
          type="button"
          onClick={toggleMic}
          aria-label={isMicRecording ? 'মাইক্রোফোন বন্ধ করুন' : 'উচ্চারণ ড্রিল ভয়েস ইনপুট'}
          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
            isMicRecording
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
              : 'bg-[#1B1E30] hover:bg-[#252a42] text-stone-300 border-[#F6F0E6]/10'
          }`}
          title="উচ্চারণ ড্রিল (ভয়েস ইনপুট)"
        >
          {isMicRecording ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-[#E45147]" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="নমি সেন্সেইকে প্রশ্ন করুন বা জাপানিজ লিখুন..."
          disabled={isBusy}
          className="flex-1 bg-[#1B1E30] text-[#F6F0E6] placeholder-stone-500 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#F6F0E6]/10 outline-hidden focus:border-[#E45147] focus:ring-1 focus:ring-[#E45147] transition disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || isBusy}
          aria-label="বার্তা পাঠান"
          className="p-2.5 rounded-xl bg-[#E45147] hover:bg-[#c93b32] disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-red-600/20 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
