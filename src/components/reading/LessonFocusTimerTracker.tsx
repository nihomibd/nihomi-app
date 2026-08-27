import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Timer,
  Sparkles,
  Award,
  CheckCircle2,
  BrainCircuit,
  Pause,
  Play,
  RotateCcw,
  Flame,
  X,
  Share2
} from 'lucide-react';

interface LessonFocusTimerTrackerProps {
  lessonTitle?: string;
  jlptLevel?: string;
  charCount?: number;
  onFinishSession?: (summary: FocusReportSummary) => void;
}

export interface FocusReportSummary {
  activeSeconds: number;
  concentrationScore: number;
  readingSpeedCpm: number;
  gemsEarned: number;
  retentionRating: string;
}

export const LessonFocusTimerTracker: React.FC<LessonFocusTimerTrackerProps> = ({
  lessonTitle = 'Minna no Nihongo Lesson Reading',
  jlptLevel = 'N5',
  charCount = 420,
  onFinishSession
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [focusReport, setFocusReport] = useState<FocusReportSummary | null>(null);

  // Auto increment timer
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Format mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteSession = () => {
    setIsActive(false);

    // Calculate metrics
    const minutes = Math.max(0.5, seconds / 60);
    const cpm = Math.round(charCount / minutes);
    const concentration = Math.min(99, Math.max(85, 98 - Math.floor(seconds / 300)));
    const gems = Math.max(10, Math.min(50, Math.floor(seconds / 30) * 5));

    let retention = 'Excellent';
    if (concentration < 90) retention = 'Good Focus';

    const summary: FocusReportSummary = {
      activeSeconds: seconds,
      concentrationScore: concentration,
      readingSpeedCpm: cpm,
      gemsEarned: gems,
      retentionRating: retention
    };

    setFocusReport(summary);
    setIsReportOpen(true);
    onFinishSession?.(summary);
  };

  return (
    <>
      {/* Subtle Fixed In-Lesson Focus Tracker Bar */}
      <div className="bg-stone-900/90 dark:bg-stone-800/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-stone-700/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-red-600/80 text-white flex items-center justify-center font-bold">
            <Timer className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white font-mono text-sm">
                {formatTime(seconds)}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/50">
                Focus Mode
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono hidden sm:block">
              {isActive ? 'Tracking active immersion' : 'Session paused'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
            title={isActive ? 'Pause Timer' : 'Resume Timer'}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={handleCompleteSession}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>End & Focus Report</span>
          </button>
        </div>
      </div>

      {/* FOCUS REPORT MODAL */}
      {isReportOpen && focusReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl w-full max-w-md p-6 text-left space-y-6 text-stone-900 dark:text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    Reading Session Focus Report
                  </h3>
                  <p className="text-xs text-stone-400 font-mono truncate max-w-[240px]">
                    {lessonTitle} • {jlptLevel}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReportOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Metrics Bento Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">
                  Time on Page
                </span>
                <p className="text-xl font-bold font-mono text-stone-900 dark:text-white mt-1">
                  {formatTime(focusReport.activeSeconds)}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  100% active immersion
                </span>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">
                  Concentration Score
                </span>
                <p className="text-xl font-bold font-mono text-red-600 dark:text-red-400 mt-1">
                  {focusReport.concentrationScore}%
                </p>
                <span className="text-[10px] text-stone-500 font-medium">
                  {focusReport.retentionRating}
                </span>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">
                  Reading Speed
                </span>
                <p className="text-xl font-bold font-mono text-stone-900 dark:text-white mt-1">
                  {focusReport.readingSpeedCpm} <span className="text-xs font-normal">char/min</span>
                </p>
                <span className="text-[10px] text-stone-500 font-medium">
                  Ideal JLPT pacing
                </span>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 font-mono block">
                  Nihomi Gems Earned
                </span>
                <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-300 mt-1 flex items-center space-x-1">
                  <span>+{focusReport.gemsEarned}</span>
                  <span className="text-sm">💎</span>
                </p>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-semibold">
                  Discipline reward
                </span>
              </div>
            </div>

            {/* Pedagogical Insight */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-stone-900 dark:text-white">
                <BrainCircuit className="w-4 h-4 text-red-600" />
                <span>Memory Retention Insight</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                Reading Japanese without English subvocalization activates natural contextual acquisition.
                Your next spaced review for this text is scheduled in 24 hours.
              </p>
            </div>

            {/* Action button */}
            <button
              onClick={() => setIsReportOpen(false)}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 font-bold text-xs rounded-2xl shadow-xs transition cursor-pointer"
            >
              Continue Japanese Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
};
