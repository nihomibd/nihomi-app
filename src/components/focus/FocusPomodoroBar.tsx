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
  CheckCircle2,
  Sliders,
  Flame,
  History,
  Palette,
  Wind,
  BrainCircuit,
  BookOpen,
  Check
} from 'lucide-react';
import { ZenSoundscapeInfo, ZenSoundscapeType, zenAudioService, ZenMixerLevels } from '../../lib/zenAudio';
import { soundEffects } from '../../lib/soundEffects';
import { FocusAmbientTheme } from './FocusSakuraBackground';

export type FocusActivityType =
  | 'Grammar Study'
  | 'Vocabulary Drill'
  | 'Kanji Mastery'
  | 'General Reading'
  | 'JLPT Mock Exam';

export interface FocusSessionRecord {
  id: string;
  date: string; // ISO date
  durationMinutes: number;
  activityType: FocusActivityType;
  completed: boolean;
}

interface FocusPomodoroBarProps {
  zenSoundActive: boolean;
  toggleZenSound: () => void;
  soundscapeMode: ZenSoundscapeType;
  setSoundscapeMode: (mode: ZenSoundscapeType) => void;
  soundscapes: ZenSoundscapeInfo[];
  ambientTheme?: FocusAmbientTheme;
  setAmbientTheme?: (theme: FocusAmbientTheme) => void;
  onExitFocus: () => void;
  onFocusBlockComplete?: () => void;
}

type PomodoroMode = '25' | '50' | 'break';

const AMBIENT_THEMES: { id: FocusAmbientTheme; label: string; icon: string; desc: string }[] = [
  { id: 'Kyoto Rainy', label: 'Kyoto Rainy', icon: '🌧️', desc: 'Gentle raindrops & pale sakura' },
  { id: 'Tokyo Neon', label: 'Tokyo Neon', icon: '⚡', desc: 'Cyber-obsidian glowing sparks' },
  { id: 'Zen Garden', label: 'Zen Garden', icon: '🎋', desc: 'Warm bamboo & orbital drift' },
];

const ACTIVITY_OPTIONS: { id: FocusActivityType; labelJa: string; icon: string }[] = [
  { id: 'Grammar Study', labelJa: '文法学習', icon: '📖' },
  { id: 'Vocabulary Drill', labelJa: '単語ドリル', icon: '📇' },
  { id: 'Kanji Mastery', labelJa: '漢字特訓', icon: '✍️' },
  { id: 'General Reading', labelJa: '読解練習', icon: '📰' },
  { id: 'JLPT Mock Exam', labelJa: '模擬試験', icon: '🎯' },
];

export const FocusPomodoroBar: React.FC<FocusPomodoroBarProps> = ({
  zenSoundActive,
  toggleZenSound,
  soundscapeMode,
  setSoundscapeMode,
  soundscapes,
  ambientTheme = 'Kyoto Rainy',
  setAmbientTheme,
  onExitFocus,
  onFocusBlockComplete,
}) => {
  // Timer states
  const [selectedDuration, setSelectedDuration] = useState<PomodoroMode>('25');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDurationMenuOpen, setIsDurationMenuOpen] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<FocusActivityType>('Grammar Study');

  // Menus and Modals
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState<boolean>(false);
  const [isMixerOpen, setIsMixerOpen] = useState<boolean>(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isSmartBreakOpen, setIsSmartBreakOpen] = useState<boolean>(false);

  // Audio Mixer levels
  const [mixerLevels, setMixerLevels] = useState<ZenMixerLevels>({
    rain: 60,
    forest: 40,
    city: 50,
  });

  // Tracking states (persistent)
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [sessions, setSessions] = useState<FocusSessionRecord[]>([]);

  // Smart Break sub-modes
  const [smartBreakTab, setSmartBreakTab] = useState<'breathing' | 'kanji'>('breathing');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const [kanjiCardIdx, setKanjiCardIdx] = useState<number>(0);
  const [isKanjiRevealed, setIsKanjiRevealed] = useState<boolean>(false);

  // Load persistent stats on mount
  useEffect(() => {
    try {
      const savedMinutes = parseInt(localStorage.getItem('nihomi_focus_total_minutes') || '0', 10);
      setTotalMinutes(isNaN(savedMinutes) ? 0 : savedMinutes);

      const savedSessionsRaw = localStorage.getItem('nihomi_focus_sessions');
      if (savedSessionsRaw) {
        const parsed: FocusSessionRecord[] = JSON.parse(savedSessionsRaw);
        setSessions(parsed);
      }

      const savedDatesRaw = localStorage.getItem('nihomi_focus_dates');
      if (savedDatesRaw) {
        const dates: string[] = JSON.parse(savedDatesRaw);
        calculateStreak(dates);
      }
    } catch {}
  }, []);

  const calculateStreak = (dates: string[]) => {
    if (!dates || dates.length === 0) {
      setStreakDays(0);
      return;
    }
    const sorted = Array.from(new Set(dates)).sort().reverse();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let streak = 0;
    let checkDate = sorted[0] === today ? today : sorted[0] === yesterday ? yesterday : null;

    if (!checkDate) {
      setStreakDays(0);
      return;
    }

    let cursor = new Date(checkDate);
    for (const d of sorted) {
      const expected = cursor.toISOString().slice(0, 10);
      if (d === expected) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    setStreakDays(streak);
  };

  const recordCompletedSession = (minutes: number) => {
    const today = new Date().toISOString().slice(0, 10);
    const newTotal = totalMinutes + minutes;
    setTotalMinutes(newTotal);
    localStorage.setItem('nihomi_focus_total_minutes', newTotal.toString());

    const newSession: FocusSessionRecord = {
      id: `foc-${Date.now()}`,
      date: new Date().toISOString(),
      durationMinutes: minutes,
      activityType: selectedActivity,
      completed: true,
    };
    const updatedSessions = [newSession, ...sessions.slice(0, 49)];
    setSessions(updatedSessions);
    localStorage.setItem('nihomi_focus_sessions', JSON.stringify(updatedSessions));

    let dates: string[] = [];
    try {
      dates = JSON.parse(localStorage.getItem('nihomi_focus_dates') || '[]');
    } catch {}
    if (!dates.includes(today)) {
      dates.push(today);
      localStorage.setItem('nihomi_focus_dates', JSON.stringify(dates));
    }
    calculateStreak(dates);
  };

  // Set timer mode
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
        const mins = selectedDuration === '25' ? 25 : 50;
        recordCompletedSession(mins);
        onFocusBlockComplete?.();
        // Trigger Smart Break recommendation modal
        setIsSmartBreakOpen(true);
        setTimerMode('break');
      } else {
        setTimerMode('25');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds, selectedDuration, selectedActivity, totalMinutes, sessions]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
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

  const handleMixerChange = (channel: keyof ZenMixerLevels, value: number) => {
    const updated = { ...mixerLevels, [channel]: value };
    setMixerLevels(updated);
    zenAudioService.setMixerLevels({ [channel]: value });
  };

  // Smart Break 4-7-8 Breathing Loop
  useEffect(() => {
    if (!isSmartBreakOpen || smartBreakTab !== 'breathing') return;

    let breathInterval = window.setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            zenAudioService.playChimeCue(349.23); // F4
            setBreathPhase('hold');
            return 7;
          } else if (breathPhase === 'hold') {
            zenAudioService.playChimeCue(261.63); // C4
            setBreathPhase('exhale');
            return 8;
          } else {
            zenAudioService.playChimeCue(392.00); // G4
            setBreathPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [isSmartBreakOpen, smartBreakTab, breathPhase]);

  // Smart Break N5 Kanji Recall Flashcards
  const N5_BREAK_KANJI = [
    { kanji: '日', on: 'ニチ, ジツ', kun: 'ひ, -び', meaningEn: 'Sun, Day, Japan', meaningBn: 'সূর্য, দিন, জাপান' },
    { kanji: '本', on: 'ホン', kun: 'もと', meaningEn: 'Book, Origin', meaningBn: 'বই, মূল উৎস' },
    { kanji: '学', on: 'ガク', kun: 'まな-ぶ', meaningEn: 'Study, Learning', meaningBn: 'শিক্ষা, অধ্যায়ন' },
    { kanji: '生', on: 'セイ, ショウ', kun: 'い-きる, う-まれる', meaningEn: 'Life, Student, Birth', meaningBn: 'জীবন, জন্ম, ছাত্র' },
    { kanji: '先', on: 'セン', kun: 'さき, ま-ず', meaningEn: 'Before, Ahead, Teacher', meaningBn: 'আগে, ভবিষ্যৎ, শিক্ষক' },
  ];

  const activeSoundscape = soundscapes.find((s) => s.id === soundscapeMode) || soundscapes[0];
  const activeThemeObj = AMBIENT_THEMES.find((t) => t.id === ambientTheme) || AMBIENT_THEMES[0];

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING TOP POMODORO BAR */}
      {/* ========================================================================= */}
      <div
        id="nihomi-focus-pomodoro-bar"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950/95 text-white px-3 sm:px-4 py-2 rounded-full border border-stone-800 shadow-2xl backdrop-blur-xl flex items-center space-x-2 sm:space-x-3 text-xs animate-in fade-in slide-in-from-top-3 max-w-[98vw] overflow-visible"
      >
        {/* Brand & Activity Selector */}
        <div className="flex items-center space-x-1.5 text-amber-400 font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span className="hidden lg:inline font-bold tracking-tight">ZEN FOCUS</span>
        </div>

        {/* STREAK & TOTAL STATS BADGE (Click to open History) */}
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-amber-400 cursor-pointer transition shrink-0"
          title="View Focus Streak & Session History"
        >
          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span className="font-mono font-bold text-[11px]">{streakDays}d</span>
          <span className="text-stone-500 text-[10px] hidden sm:inline">•</span>
          <span className="text-stone-300 font-mono text-[10px] hidden sm:inline">{totalMinutes}m</span>
        </button>

        <span className="text-stone-700 hidden sm:inline">•</span>

        {/* POMODORO TIMER DISPLAY & CONTROLS */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Interval Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDurationMenuOpen(!isDurationMenuOpen)}
              className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-[11px] font-mono text-stone-200 cursor-pointer"
              title="Select Study Interval"
            >
              <Clock className="w-3 h-3 text-red-400" />
              <span className="font-bold">
                {selectedDuration === '25' ? '25m' : selectedDuration === '50' ? '50m' : '5m Rest'}
              </span>
              <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
            </button>

            {isDurationMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-40 bg-stone-900 border border-stone-700 rounded-xl p-1.5 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in">
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
            title={isRunning ? 'Pause Pomodoro' : 'Start Focus Session'}
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

        {/* AMBIENT THEME PRESET CYCLER */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center space-x-1 px-2 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition cursor-pointer text-[11px]"
            title="Change Ambient Visual Theme"
          >
            <Palette className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">{activeThemeObj.label}</span>
            <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 sm:left-0 top-full mt-2 w-56 bg-stone-900 border border-stone-700 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                Ambient Visual Theme
              </div>
              {AMBIENT_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setAmbientTheme?.(theme.id);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-start space-x-2 transition cursor-pointer ${
                    ambientTheme === theme.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <span className="text-base">{theme.icon}</span>
                  <div>
                    <div className="font-bold">{theme.label}</div>
                    <div className="text-[10px] text-stone-400">{theme.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ZEN SOUNDSCAPE AUDIO ENGINE & MULTI-CHANNEL MIXER */}
        <div className="relative flex items-center shrink-0">
          <button
            type="button"
            onClick={toggleZenSound}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded-full transition-colors cursor-pointer ${
              zenSoundActive
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle Ambient Sound"
          >
            {zenSoundActive ? (
              <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px] font-medium hidden md:inline">
              {zenSoundActive ? `${activeSoundscape.icon} ${activeSoundscape.label.split(' ')[0]}` : 'Audio'}
            </span>
          </button>

          {/* Mixer Trigger */}
          <button
            type="button"
            onClick={() => setIsMixerOpen(!isMixerOpen)}
            className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition cursor-pointer ml-0.5"
            title="Open 3-Channel Soundscape Mixer"
          >
            <Sliders className="w-3 h-3 text-amber-400" />
          </button>

          {/* Multi-Channel Mixer Popover */}
          {isMixerOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-stone-900 border border-stone-700 rounded-2xl p-3 shadow-2xl text-xs space-y-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center space-x-1.5 font-bold text-stone-200">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Soundscape Audio Mixer</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMixerOpen(false)}
                  className="text-stone-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Rain Channel */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-stone-300">
                  <span className="flex items-center space-x-1">
                    <span>🌧️</span>
                    <span>Rain (雨音)</span>
                  </span>
                  <span className="font-mono text-cyan-400">{mixerLevels.rain}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mixerLevels.rain}
                  onChange={(e) => handleMixerChange('rain', parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Forest / Bamboo Wind Channel */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-stone-300">
                  <span className="flex items-center space-x-1">
                    <span>🎋</span>
                    <span>Forest Wind (竹林の風)</span>
                  </span>
                  <span className="font-mono text-emerald-400">{mixerLevels.forest}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mixerLevels.forest}
                  onChange={(e) => handleMixerChange('forest', parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* City / Chimes Channel */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-stone-300">
                  <span className="flex items-center space-x-1">
                    <span>🔔</span>
                    <span>Temple Bell (京都の鐘)</span>
                  </span>
                  <span className="font-mono text-amber-400">{mixerLevels.city}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mixerLevels.city}
                  onChange={(e) => handleMixerChange('city', parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-1 text-[10px] text-stone-500 border-t border-stone-800 text-center">
                Balanced client-side Web Audio synthesis
              </div>
            </div>
          )}
        </div>

        {/* SMART BREAK TRIGGER BUTTON */}
        <button
          type="button"
          onClick={() => setIsSmartBreakOpen(true)}
          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium cursor-pointer transition shrink-0"
          title="Open Smart Break (Breathing & Kanji Recall)"
        >
          <BrainCircuit className="w-3 h-3 text-emerald-400" />
          <span className="hidden sm:inline">Break</span>
        </button>

        <span className="text-stone-700 hidden sm:inline">•</span>

        {/* Exit Focus Mode */}
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

      {/* ========================================================================= */}
      {/* HISTORY & STREAK MODAL */}
      {/* ========================================================================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-stone-100 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg">Focus History & Streak Tracker</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lifetime Stats Card */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-xl font-mono font-extrabold text-amber-400">{streakDays}</div>
                  <div className="text-[11px] text-stone-400">Day Streak</div>
                </div>

                <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl font-mono font-extrabold text-cyan-300">{totalMinutes}m</div>
                  <div className="text-[11px] text-stone-400">Total Minutes</div>
                </div>

                <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-center">
                  <div className="flex justify-center mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-mono font-extrabold text-emerald-300">{sessions.length}</div>
                  <div className="text-[11px] text-stone-400">Sessions</div>
                </div>
              </div>

              {/* Current Active Study Topic */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Target Activity for This Session
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACTIVITY_OPTIONS.map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setSelectedActivity(act.id)}
                      className={`px-3 py-2 rounded-xl text-left border text-xs transition cursor-pointer flex items-center space-x-2 ${
                        selectedActivity === act.id
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                      }`}
                    >
                      <span>{act.icon}</span>
                      <div className="min-w-0 truncate">
                        <div>{act.id}</div>
                        <div className="text-[10px] text-stone-500">{act.labelJa}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Focus Session Logs */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Recent Focus Logs</span>
                  <span className="text-[11px] font-normal text-stone-500">Last 50 entries</span>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs bg-stone-950/40 rounded-xl border border-stone-800">
                    No focus sessions logged yet. Complete a 25m or 50m timer to record your progress!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between px-3 py-2 bg-stone-950/60 border border-stone-800 rounded-xl text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-stone-200">{s.activityType}</span>
                            <span className="text-[10px] text-stone-500 ml-2">
                              {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="font-mono text-amber-400 font-bold">
                          +{s.durationMinutes}m
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SMART BREAK MODAL (Breathing Exercise & Kanji Recall) */}
      {/* ========================================================================= */}
      {isSmartBreakOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-stone-100 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Nihomi Smart Break (休憩)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSmartBreakOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-stone-950 mx-6 mt-4 rounded-xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setSmartBreakTab('breathing')}
                className={`py-2 rounded-lg font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                  smartBreakTab === 'breathing'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Mindful Breathing (呼吸)</span>
              </button>
              <button
                type="button"
                onClick={() => setSmartBreakTab('kanji')}
                className={`py-2 rounded-lg font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                  smartBreakTab === 'kanji'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kanji Recall (漢字)</span>
              </button>
            </div>

            {/* Tab 1: 4-7-8 Breathing */}
            {smartBreakTab === 'breathing' && (
              <div className="p-6 text-center space-y-5">
                <p className="text-xs text-stone-400">
                  Calm mental fatigue with 4-7-8 breathing synchronized with Japanese chimes.
                </p>

                {/* Animated Breathing Circle */}
                <div className="py-4 flex justify-center">
                  <div
                    className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border-2 ${
                      breathPhase === 'inhale'
                        ? 'scale-110 bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
                        : breathPhase === 'hold'
                        ? 'scale-110 bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
                        : 'scale-90 bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    }`}
                  >
                    <span className="text-2xl font-japanese font-extrabold mb-1">
                      {breathPhase === 'inhale' ? '吸う' : breathPhase === 'hold' ? '止める' : '吐く'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {breathPhase === 'inhale' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : 'Exhale'}
                    </span>
                    <span className="text-lg font-mono font-bold mt-1">{breathTimer}s</span>
                  </div>
                </div>

                <p className="text-xs font-bangla text-stone-400">
                  {breathPhase === 'inhale' && 'নাক দিয়ে ধীরে ধীরে গভীর শ্বাস গ্রহণ করুন (৪ সেকেন্ড)'}
                  {breathPhase === 'hold' && 'শান্তভাবে শ্বাস ধরে রাখুন (৭ সেকেন্ড)'}
                  {breathPhase === 'exhale' && 'মুখ দিয়ে সম্পূর্ণ শ্বাস ত্যাগ করুন (৮ সেকেন্ড)'}
                </p>
              </div>
            )}

            {/* Tab 2: Kanji Recall Game */}
            {smartBreakTab === 'kanji' && (
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Kanji Flashcard {kanjiCardIdx + 1} of {N5_BREAK_KANJI.length}
                  </span>
                </div>

                {/* Card Canvas */}
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 text-center space-y-3">
                  <div className="text-6xl font-japanese font-bold text-amber-300">
                    {N5_BREAK_KANJI[kanjiCardIdx].kanji}
                  </div>

                  {isKanjiRevealed ? (
                    <div className="space-y-1 animate-in fade-in">
                      <div className="text-xs text-stone-400">
                        <span className="font-bold text-stone-300">On:</span> {N5_BREAK_KANJI[kanjiCardIdx].on} •{' '}
                        <span className="font-bold text-stone-300">Kun:</span> {N5_BREAK_KANJI[kanjiCardIdx].kun}
                      </div>
                      <div className="font-bold text-sm text-stone-200">
                        {N5_BREAK_KANJI[kanjiCardIdx].meaningEn}
                      </div>
                      <div className="text-xs font-bangla text-emerald-400">
                        {N5_BREAK_KANJI[kanjiCardIdx].meaningBn}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsKanjiRevealed(true)}
                      className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Reveal Reading & Meaning
                    </button>
                  )}
                </div>

                {/* Card Navigation */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    disabled={kanjiCardIdx === 0}
                    onClick={() => {
                      setKanjiCardIdx((prev) => prev - 1);
                      setIsKanjiRevealed(false);
                    }}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (kanjiCardIdx < N5_BREAK_KANJI.length - 1) {
                        setKanjiCardIdx((prev) => prev + 1);
                        setIsKanjiRevealed(false);
                      } else {
                        setIsSmartBreakOpen(false);
                      }
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {kanjiCardIdx < N5_BREAK_KANJI.length - 1 ? 'Next Card' : 'Finish Break'}
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/50 flex justify-between items-center text-xs">
              <span className="text-stone-500">2-Minute Cognitive Reset</span>
              <button
                type="button"
                onClick={() => setIsSmartBreakOpen(false)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-bold cursor-pointer"
              >
                Back to Focus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
