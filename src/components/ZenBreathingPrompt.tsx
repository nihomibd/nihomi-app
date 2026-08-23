import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Sparkles,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Heart
} from 'lucide-react';

interface ZenBreathingPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const ZenBreathingPrompt: React.FC<ZenBreathingPromptProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<any>(null);

  // Synthesize soft Zen chime tone
  const playZenBell = (frequency: number = 432) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {
      console.warn('Zen audio note:', e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(30);
      setIsDone(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    playZenBell(528); // Initial opening chime

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsDone(true);
          playZenBell(660);
          return 0;
        }
        return prev - 1;
      });

      setPhaseSeconds((ps) => {
        if (ps <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') {
              playZenBell(440);
              return 'hold1';
            }
            if (currentPhase === 'hold1') {
              playZenBell(392);
              return 'exhale';
            }
            if (currentPhase === 'exhale') {
              playZenBell(349);
              return 'hold2';
            }
            playZenBell(528);
            return 'inhale';
          });
          return 4;
        }
        return ps - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return { en: 'Inhale deeply through your nose...', bn: 'নাক দিয়ে গভীরভাবে শ্বাস নিন (৪ সেকেন্ড)' };
      case 'hold1':
        return { en: 'Hold gently & focus your mind...', bn: 'শ্বাস ধরে রাখুন ও মন শান্ত করুন (৪ সেকেন্ড)' };
      case 'exhale':
        return { en: 'Exhale slowly through your mouth...', bn: 'মুখ দিয়ে ধীরে ধীরে শ্বাস ছাড়ুন (৪ সেকেন্ড)' };
      case 'hold2':
        return { en: 'Rest in pure awareness...', bn: 'প্রশান্তিতে বিশ্রাম নিন (৪ সেকেন্ড)' };
    }
  };

  const currentText = getPhaseText();

  return (
    <div
      id="zen-breathing-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative flex flex-col items-center text-center space-y-6">
        {/* Close and Sound Toggle */}
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'Mute Zen Chimes' : 'Enable Zen Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-900">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zen Focus Reset</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif text-white">
            {isDone ? '✨ Mind Ready & Focused' : '30-Second Zen Breathing'}
          </h3>
          <p className="text-xs text-stone-400 max-w-xs">
            {isDone
              ? 'Your neural pathways are primed for Japanese character and grammar retention.'
              : 'Box breathing reduces study anxiety and activates deep memory consolidation.'}
          </p>
        </div>

        {/* Breathing Circle Animation */}
        <div className="relative w-48 h-48 flex items-center justify-center my-2">
          {/* Pulsing Outer Aura */}
          <div
            className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
              phase === 'inhale' || phase === 'hold1'
                ? 'w-44 h-44 bg-amber-500/20 border border-amber-500/40 scale-110 shadow-lg shadow-amber-500/10'
                : 'w-32 h-32 bg-stone-800/40 border border-stone-700 scale-90'
            }`}
          />

          {/* Inner Breathing Core */}
          <div
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out border-2 ${
              phase === 'inhale'
                ? 'bg-gradient-to-tr from-amber-600 to-red-600 border-amber-300 scale-105 shadow-xl shadow-red-600/30'
                : phase === 'hold1' || phase === 'hold2'
                ? 'bg-gradient-to-tr from-amber-700 to-amber-900 border-amber-400 scale-100'
                : 'bg-gradient-to-tr from-stone-800 to-stone-900 border-stone-600 scale-90'
            }`}
          >
            <Wind className={`w-6 h-6 text-white mb-1 ${phase === 'inhale' ? 'animate-pulse' : ''}`} />
            <span className="text-2xl font-black font-mono text-white leading-none">
              {isDone ? '0s' : `${secondsRemaining}s`}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 mt-0.5">
              {phase.toUpperCase()} ({phaseSeconds}s)
            </span>
          </div>
        </div>

        {/* Phase Instruction */}
        <div className="space-y-1 min-h-[48px]">
          <p className="text-sm font-bold text-amber-300 transition-all">
            {isDone ? 'Deep focus activated!' : currentText.en}
          </p>
          <p className="text-xs text-stone-400 font-medium">
            {isDone ? 'এখন মনোযোগ দিয়ে পাঠ শুরু করুন।' : currentText.bn}
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full pt-2">
          {isDone ? (
            <button
              type="button"
              onClick={() => {
                if (onComplete) onComplete();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enter Lesson with Deep Focus</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onComplete) onComplete();
                  onClose();
                }}
                className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs border border-stone-700 transition cursor-pointer"
              >
                Skip & Start Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
