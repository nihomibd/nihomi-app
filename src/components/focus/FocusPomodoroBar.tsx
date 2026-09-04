import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { ZenSoundscapeInfo, ZenSoundscapeType } from '../../lib/zenAudio';
import { soundEffects } from '../../lib/soundEffects';

interface FocusPomodoroBarProps {
  zenSoundActive: boolean;
  toggleZenSound: () => void;
  soundscapeMode: ZenSoundscapeType;
  setSoundscapeMode: (mode: ZenSoundscapeType) => void;
  soundscapes: ZenSoundscapeInfo[];
  onExitFocus: () => void;
  onFocusBlockComplete?: () => void;
}

type PomodoroMode = '25' | '50' | 'break';

export const FocusPomodoroBar: React.FC<FocusPomodoroBarProps> = ({
  zenSoundActive,
  toggleZenSound,
  soundscapeMode,
  setSoundscapeMode,
  soundscapes,
  onExitFocus,
  onFocusBlockComplete,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<PomodoroMode>('25');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [isDurationMenuOpen, setIsDurationMenuOpen] = useState<boolean>(false);

  // Set interval duration
  const setTimerMode = (mode: PomodoroMode) => {
    setSelectedDuration(mode);
    setIsRunning(false);
    if (mode === '25') setTimeLeftSeconds(25 * 60);
    else if (mode === '50') setTimeLeftSeconds(50 * 60);
    else if (mode === 'break') setTimeLeftSeconds(5 * 60);
  };

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = window.setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      try {
        soundEffects.playLessonCelebration();
      } catch {}
      if (selectedDuration !== 'break') {
        setCompletedCycles((prev) => prev + 1);
        if (selectedDuration === '25') onFocusBlockComplete?.();
        setTimerMode('break');
      } else {
        setTimerMode('25');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds, selectedDuration]);

  // Handle Play/Pause with optional Zen Soundscape Sync
  const togglePlayPause = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);

    // If starting timer and zen soundscape is off, optionally auto-start it for deep work
    if (nextState && !zenSoundActive) {
      toggleZenSound();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (selectedDuration === '25') setTimeLeftSeconds(25 * 60);
    else if (selectedDuration === '50') setTimeLeftSeconds(50 * 60);
    else if (selectedDuration === 'break') setTimeLeftSeconds(5 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeSoundscape = soundscapes.find((s) => s.id === soundscapeMode) || soundscapes[0];

  return (
    <div
      id="nihomi-focus-pomodoro-bar"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950/95 text-white px-3 sm:px-4 py-2 rounded-full border border-stone-800 shadow-2xl backdrop-blur-xl flex items-center space-x-2 sm:space-x-3 text-xs animate-in fade-in slide-in-from-top-3 max-w-[96vw] overflow-visible"
    >
      {/* Brand & Mode Indicator */}
      <div className="flex items-center space-x-1.5 text-amber-400 font-semibold shrink-0">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-500" />
        <span className="hidden md:inline font-bold tracking-tight">ZEN FOCUS</span>
        {completedCycles > 0 && (
          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded-full border border-amber-500/30">
            ★{completedCycles}
          </span>
        )}
      </div>

      <span className="text-stone-700 hidden sm:inline">•</span>

      {/* POMODORO TIMER DISPLAY & CONTROLS */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        
        {/* Interval Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDurationMenuOpen(!isDurationMenuOpen)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-[11px] font-mono text-stone-200 cursor-pointer"
            title="Choose Study Interval (25m / 50m / 5m break)"
          >
            <Clock className="w-3 h-3 text-red-400" />
            <span className="font-bold">
              {selectedDuration === '25' ? '25m' : selectedDuration === '50' ? '50m' : '5m Break'}
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
          </button>

          {isDurationMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-36 bg-stone-900 border border-stone-700 rounded-xl p-1.5 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in">
              <button
                type="button"
                onClick={() => {
                  setTimerMode('25');
                  setIsDurationMenuOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-left font-bold flex items-center justify-between cursor-pointer ${
                  selectedDuration === '25' ? 'bg-red-600 text-white' : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <span>25m Focus</span>
                <span className="text-[10px] opacity-75">Standard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerMode('50');
                  setIsDurationMenuOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-left font-bold flex items-center justify-between cursor-pointer ${
                  selectedDuration === '50' ? 'bg-red-600 text-white' : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <span>50m Deep</span>
                <span className="text-[10px] opacity-75">Mastery</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerMode('break');
                  setIsDurationMenuOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-lg text-left font-bold flex items-center justify-between cursor-pointer ${
                  selectedDuration === 'break' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                <span>5m Rest</span>
                <Coffee className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Digital MM:SS Countdown Display */}
        <span
          className={`font-mono text-xs sm:text-sm font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md ${
            selectedDuration === 'break'
              ? 'text-emerald-400 bg-emerald-950/50'
              : isRunning
              ? 'text-amber-300 bg-amber-950/40 animate-pulse'
              : 'text-white bg-stone-900'
          }`}
        >
          {formatTime(timeLeftSeconds)}
        </span>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold shadow-xs'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
          }`}
          title={isRunning ? 'Pause Pomodoro' : 'Start Focus Session (Syncs with Zen Soundscape)'}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-stone-200" />}
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <span className="text-stone-700 hidden sm:inline">•</span>

      {/* ZEN SOUNDSCAPE AUDIO ENGINE TOGGLE */}
      <div className="relative flex items-center shrink-0">
        <button
          type="button"
          onClick={toggleZenSound}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
            zenSoundActive
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Toggle Ambient Audio"
        >
          {zenSoundActive ? (
            <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="text-[11px] font-medium hidden sm:inline">
            {zenSoundActive ? `${activeSoundscape.icon} ${activeSoundscape.label.split(' ')[0]}` : 'Soundscape'}
          </span>
        </button>

        {/* Soundscape Selector Trigger */}
        <button
          type="button"
          onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
          className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer ml-0.5"
          title="Select Nature Soundscape Loop"
        >
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Soundscape Options Menu */}
        {isSoundMenuOpen && (
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-stone-900 border border-stone-700 rounded-2xl p-2 shadow-2xl text-xs space-y-1 z-50 animate-in fade-in">
            <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 flex items-center justify-between">
              <span>Seijaku Soundscapes</span>
              <span className="text-[9px] text-amber-400 font-mono">Crossfade v2.0</span>
            </div>
            {soundscapes.map((sc) => {
              const isSelected = soundscapeMode === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSoundscapeMode(sc.id);
                    setIsSoundMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-start space-x-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                      : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <span className="text-base">{sc.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold flex items-center space-x-1.5">
                      <span>{sc.label}</span>
                      <span className="text-[10px] font-japanese text-stone-500">{sc.labelJa}</span>
                    </div>
                    <p className="text-[10px] text-stone-400 truncate">{sc.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <span className="text-stone-700 hidden sm:inline">•</span>

      {/* Exit Focus Mode Button */}
      <button
        type="button"
        id="btn-exit-focus-mode"
        onClick={onExitFocus}
        className="flex items-center space-x-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-semibold rounded-full border border-stone-700 transition-colors cursor-pointer shrink-0"
        title="Exit Focus Mode"
      >
        <span>Exit</span>
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
