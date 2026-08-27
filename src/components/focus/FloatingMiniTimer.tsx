import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Pin,
  PinOff,
  Minimize2,
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle2,
  Flame,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../../lib/soundEffects';

export type FocusActivity = 'kanji' | 'grammar' | 'vocab' | 'listening' | 'reading';

interface FloatingMiniTimerProps {
  initialMinutes?: number;
  onSessionComplete?: (durationMinutes: number, activity: FocusActivity) => void;
  defaultPinned?: boolean;
}

const ACTIVITIES: { id: FocusActivity; label: string; emoji: string; color: string }[] = [
  { id: 'kanji', label: 'Kanji Practice', emoji: '漢字', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'grammar', label: 'Grammar Drills', emoji: '文法', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'vocab', label: 'Vocab SRS', emoji: '単語', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'listening', label: 'Listening Lab', emoji: '聴解', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'reading', label: 'Reading Comprehension', emoji: '読解', color: 'bg-purple-100 text-purple-700 border-purple-200' }
];

export const FloatingMiniTimer: React.FC<FloatingMiniTimerProps> = ({
  initialMinutes = 25,
  onSessionComplete,
  defaultPinned = false
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    try {
      const saved = localStorage.getItem('nihomi_mini_timer_pinned');
      return saved !== null ? JSON.parse(saved) : defaultPinned;
    } catch {
      return defaultPinned;
    }
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<FocusActivity>('kanji');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync pin state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nihomi_mini_timer_pinned', JSON.stringify(isPinned));
    } catch {
      // ignore
    }
  }, [isPinned]);

  // Main countdown interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, totalSeconds, selectedActivity]);

  const handleFinishSession = () => {
    const minutesCompleted = Math.round(totalSeconds / 60);
    setCompletedSessionsCount((prev) => prev + 1);
    setShowCelebration(true);

    if (soundEnabled) {
      soundEffects.playLessonCelebration();
    }

    if (onSessionComplete) {
      onSessionComplete(minutesCompleted, selectedActivity);
    }

    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  };

  const handleTogglePlay = () => {
    if (!isRunning && secondsRemaining === 0) {
      setSecondsRemaining(totalSeconds);
    }
    setIsRunning(!isRunning);
    if (soundEnabled) {
      soundEffects.playButtonTap();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
    if (soundEnabled) {
      soundEffects.playButtonTap();
    }
  };

  const handleSetPreset = (minutes: number) => {
    setIsRunning(false);
    setTotalSeconds(minutes * 60);
    setSecondsRemaining(minutes * 60);
    if (soundEnabled) {
      soundEffects.playButtonTap();
    }
  };

  const handleAddMinutes = (extraMinutes: number) => {
    setTotalSeconds((prev) => prev + extraMinutes * 60);
    setSecondsRemaining((prev) => prev + extraMinutes * 60);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;

  const currentActivityObj = ACTIVITIES.find((a) => a.id === selectedActivity) || ACTIVITIES[0];

  return (
    <div
      id="nihomi-floating-mini-timer"
      className={`transition-all duration-300 z-40 ${
        isPinned
          ? 'relative w-full'
          : 'fixed bottom-5 right-5 shadow-2xl max-w-sm sm:max-w-md'
      }`}
    >
      <AnimatePresence>
        {isMinimized ? (
          // Minimized Floating Pill
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-stone-900 text-white rounded-full px-4 py-2 flex items-center space-x-3 shadow-xl border border-stone-700/80"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold">{formattedTime}</span>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-medium">
              {currentActivityObj.emoji} {currentActivityObj.label}
            </span>

            <button
              onClick={handleTogglePlay}
              className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
              title={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition"
              title="Expand Timer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          // Expanded Full Widget
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`rounded-3xl border border-stone-200 p-5 shadow-lg space-y-4 text-stone-900 ${
              isPinned
                ? 'bg-gradient-to-br from-white via-stone-50/50 to-white'
                : 'bg-white/95 backdrop-blur-md ring-1 ring-stone-900/5'
            }`}
          >
            {/* Header: Title, Controls, Pin & Minimize */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Timer className="w-4 h-4 text-red-600" />
                </span>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <span>Focused Study Mini-Timer</span>
                    {isRunning && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </h4>
                  <p className="text-[10px] text-stone-500">Autonomous session tracker</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    soundEnabled ? 'text-stone-600 hover:bg-stone-100' : 'text-stone-400 bg-stone-100'
                  }`}
                  title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Pin / Unpin Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    isPinned
                      ? 'bg-red-50 text-red-600 font-bold'
                      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                  title={isPinned ? 'Unpin from Dashboard' : 'Pin to Dashboard'}
                >
                  {isPinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>

                {/* Minimize Toggle (only when floating) */}
                {!isPinned && (
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 text-xs transition"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Timer Display with Circular / Linear Progress */}
            <div className="text-center space-y-2 py-1">
              <div className="flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-stone-900">
                  {formattedTime}
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/60">
                <div
                  className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                <span>{Math.round(totalSeconds / 60)} min target</span>
                <span>{Math.round(progressPercent)}% elapsed</span>
              </div>
            </div>

            {/* Activity Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Focus Category
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {ACTIVITIES.map((act) => {
                  const isSelected = selectedActivity === act.id;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setSelectedActivity(act.id)}
                      className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold text-left transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? `${act.color} ring-1 ring-offset-1 shadow-xs`
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{act.emoji}</span>
                      <span className="truncate">{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Duration Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Presets
                </label>
                <button
                  type="button"
                  onClick={() => handleAddMinutes(5)}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> +5 mins
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSetPreset(mins)}
                    className={`py-1 rounded-xl text-xs font-mono font-bold border transition ${
                      totalSeconds === mins * 60
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Play/Pause, Reset */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Focus Session</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Completed Session Celebration Toast */}
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center space-x-2.5 text-xs font-bold shadow-xs"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p>Awesome work! Session complete 🎉</p>
                  <p className="text-[10px] text-emerald-700 font-normal">
                    +{Math.round(totalSeconds / 60) * 5} XP logged to your daily study progress
                  </p>
                </div>
              </motion.div>
            )}

            {/* Sessions count footer */}
            {completedSessionsCount > 0 && (
              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>{completedSessionsCount} focus blocks completed today</span>
                </span>
                <span className="font-mono font-bold text-amber-600">
                  +{completedSessionsCount * 125} XP
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
