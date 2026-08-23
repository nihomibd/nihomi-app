import React, { useEffect, useState } from 'react';
import { JLPTLevel } from '../types.js';
import {
  Award,
  Sparkles,
  CheckCircle2,
  X,
  Share2,
  ArrowRight,
  Flame,
  BookOpen,
  GraduationCap,
  Download
} from 'lucide-react';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: JLPTLevel | string;
  completedLessonsCount: number;
  totalStudyMinutes: number;
  streakDays: number;
  onAdvanceLevel?: (nextLevel: JLPTLevel) => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  level,
  completedLessonsCount,
  totalStudyMinutes,
  streakDays,
  onAdvanceLevel
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Create a celebratory audio chime using Web Audio API if supported
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.7);
        });
      }
    } catch (e) {
      console.log('Audio celebratory chime skipped');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextLevelMap: Record<string, JLPTLevel> = {
    N5: 'N4',
    N4: 'N3',
    N3: 'N2',
    N2: 'N1'
  };
  const nextLvl = nextLevelMap[level] || 'N4';

  const handleShare = () => {
    const text = `🎉 I just completed the JLPT ${level} curriculum milestone on Nihomi.com with a ${streakDays}-day streak! 🇯🇵`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      id="milestone-celebration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center space-y-6">
        {/* Glowing Background Ring */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Icon Badge */}
        <div className="relative inline-flex">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-red-600/30 mx-auto animate-bounce">
            <GraduationCap className="w-10 h-10" />
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-amber-950 rounded-full border-2 border-white">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        {/* Headlines */}
        <div className="space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            LEVEL MILESTONE UNLOCKED
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 dark:text-white">
            おめでとうございます！
          </h2>
          <p className="text-sm sm:text-base font-semibold text-red-600">
            Congratulations! You have mastered the JLPT {level} Core Curriculum!
          </p>
          <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed pt-1">
            আপনার অধ্যবসায় ও নিয়মিত অনুশীলনে JLPT {level} পাঠক্রম সফলভাবে সম্পন্ন হয়েছে। নিহোমি অ্যাকাডেমির পক্ষ থেকে আন্তরিক অভিনন্দন।
          </p>
        </div>

        {/* Achievement Metrics Bento */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div className="space-y-1">
            <div className="flex items-center justify-center text-red-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-stone-900">{completedLessonsCount}</span>
            <p className="text-[10px] font-bold text-stone-500 uppercase">Lessons Mastered</p>
          </div>

          <div className="space-y-1 border-x border-stone-200">
            <div className="flex items-center justify-center text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <span className="text-lg font-black text-stone-900">{streakDays} Days</span>
            <p className="text-[10px] font-bold text-stone-500 uppercase">Study Streak</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-stone-900">{Math.round(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m</span>
            <p className="text-[10px] font-bold text-stone-500 uppercase">Active Time</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onAdvanceLevel && (
            <button
              onClick={() => {
                onAdvanceLevel(nextLvl);
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Advance to JLPT {nextLvl}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copied to Clipboard!' : 'Share Milestone'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
