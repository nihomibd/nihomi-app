import React, { useEffect, useState } from 'react';
import {
  Award,
  Sparkles,
  Clock,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  GraduationCap,
  Layers,
  Flame,
  Share2,
  Check
} from 'lucide-react';
import { soundEffects } from '../lib/soundEffects';

export interface SessionReportData {
  title: string;
  category: string;
  durationSeconds: number;
  vocabCount?: number;
  kanjiCount?: number;
  grammarPoints?: number;
  accuracyScore?: number;
  xpEarned: number;
  jlptLevel: 'N5' | 'N4' | 'N3';
  proficiencyGainPercent: number; // e.g. 1.8%
  weakItems?: string[];
}

interface SessionReportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data: SessionReportData;
  onRetake?: () => void;
  onReviewWeak?: () => void;
  onNavigateToPortal?: () => void;
}

export const SessionReportOverlay: React.FC<SessionReportOverlayProps> = ({
  isOpen,
  onClose,
  data,
  onRetake,
  onReviewWeak,
  onNavigateToPortal
}) => {
  const [animatedXp, setAnimatedXp] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      soundEffects.playLessonCelebration();

      // Animate XP counter
      let start = 0;
      const target = data.xpEarned;
      const step = Math.max(1, Math.floor(target / 25));
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setAnimatedXp(target);
          clearInterval(timer);
        } else {
          setAnimatedXp(start);
        }
      }, 30);

      return () => clearInterval(timer);
    } else {
      setAnimatedXp(0);
    }
  }, [isOpen, data.xpEarned]);

  if (!isOpen) return null;

  const minutes = Math.floor(data.durationSeconds / 60);
  const seconds = data.durationSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  const handleShare = () => {
    const text = `🎉 I just finished ${data.title} on Nihomi.com! Earned +${data.xpEarned} XP and gained +${data.proficiencyGainPercent}% towards JLPT ${data.jlptLevel}! 🇯🇵`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      id="nihomi-session-report-overlay"
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="session-report-card"
        className="w-full max-w-lg bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95"
      >
        {/* Decorative ambient shine */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
            Study Session Complete!
          </span>

          <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17]">
            {data.title}
          </h2>

          <p className="text-xs text-stone-500 dark:text-stone-400 sepia:text-[#7a6344]">
            {data.category} • JLPT {data.jlptLevel} Curriculum
          </p>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] text-center">
            <Clock className="w-4 h-4 text-stone-400 mx-auto mb-1" />
            <p className="text-[10px] uppercase font-bold text-stone-400">Time Spent</p>
            <p className="text-sm font-extrabold text-stone-800 dark:text-stone-100 sepia:text-[#382a17]">
              {timeFormatted}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] text-center">
            <BookOpen className="w-4 h-4 text-stone-400 mx-auto mb-1" />
            <p className="text-[10px] uppercase font-bold text-stone-400">Vocab Mastered</p>
            <p className="text-sm font-extrabold text-stone-800 dark:text-stone-100 sepia:text-[#382a17]">
              {data.vocabCount || 12} Words
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] text-center">
            <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-[10px] uppercase font-bold text-stone-400">XP Gained</p>
            <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
              +{animatedXp} XP
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] text-center">
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-[10px] uppercase font-bold text-stone-400">JLPT {data.jlptLevel} Gain</p>
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              +{data.proficiencyGainPercent}%
            </p>
          </div>
        </div>

        {/* JLPT Progress Milestone Indicator */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border border-red-200/60 dark:border-red-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-stone-900 dark:text-white">
                JLPT {data.jlptLevel} Readiness Boost
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                You are now closer to full N5/N4 certificate mastery!
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-red-600 dark:text-red-400 bg-white dark:bg-stone-900 px-2.5 py-1 rounded-xl shadow-2xs">
            +{data.proficiencyGainPercent}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onNavigateToPortal || onClose}
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <span>Continue to Student Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Share Result'}</span>
            </button>

            {onRetake && (
              <button
                onClick={onRetake}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
