import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { trackNihomiEvent } from '../../utils/analytics';

export interface WeakAreaRecommendation {
  concept: string;
  itemType: string;
  mistakeCount: number;
  patternDetected: string;
  recommendedAction: string;
  guidanceBn: string;
  drillUrl: string;
}

interface WeakAreasResponse {
  success: boolean;
  recommendations: WeakAreaRecommendation[];
  summary: {
    totalMistakesRecorded: number;
    unresolvedCount: number;
    topConfusionPattern: string | null;
    absoluteZeroLearner: boolean;
  };
}

interface NextBestActionCardProps {
  userId?: string;
  completedLessonsCount?: number;
  onLaunchLesson?: (lessonId?: string) => void;
  onLaunchReview?: (concept: string) => void;
  onOpenZeroGateway?: () => void;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({
  userId,
  completedLessonsCount = 0,
  onLaunchLesson,
  onLaunchReview,
  onOpenZeroGateway
}) => {
  const [data, setData] = useState<WeakAreasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDrillQuickView, setActiveDrillQuickView] = useState<WeakAreaRecommendation | null>(null);

  useEffect(() => {
    let isMounted = true;
    const url = userId ? `/api/progress/weak-areas/${userId}` : '/api/progress/weak-areas';

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: WeakAreasResponse | null) => {
        if (isMounted) {
          if (json && json.success) {
            setData(json);
          } else {
            // Intelligent fallback based on completed lessons
            const isZero = completedLessonsCount === 0;
            setData({
              success: true,
              recommendations: isZero
                ? [
                    {
                      concept: 'হিরাগানা ভাওয়েল সাউন্ডস (あ, い, う, え, お)',
                      itemType: 'KANA',
                      mistakeCount: 0,
                      patternDetected: 'ABSOLUTE_ZERO_ENTRY',
                      recommendedAction: 'Kana Zero Drill',
                      guidanceBn: 'প্রথম ৫টি স্বরবর্ণের উচ্চারণ ও স্ট্রোক অর্ডার নিখুঁত করুন।',
                      drillUrl: '/practice/kana-zero'
                    }
                  ]
                : [],
              summary: {
                totalMistakesRecorded: 0,
                unresolvedCount: 0,
                topConfusionPattern: null,
                absoluteZeroLearner: isZero
              }
            });
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId, completedLessonsCount]);

  const isZeroLearner = completedLessonsCount === 0 || data?.summary?.absoluteZeroLearner;
  const primaryWeakArea = data?.recommendations && data.recommendations.length > 0
    ? data.recommendations[0]
    : null;
  const hasUnresolvedMistakes = !isZeroLearner && primaryWeakArea && data?.summary?.unresolvedCount && data.summary.unresolvedCount > 0;

  // Render State 1: Absolute Zero Learner
  if (isZeroLearner) {
    return (
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-red-950/40 text-white rounded-3xl p-6 sm:p-8 border border-red-500/30 shadow-xl relative overflow-hidden text-left">
        {/* Ambient Japanese Pattern Accents */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold rounded-full font-mono">
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>JAPANESE ZERO • FOUNDATIONAL ROUTE</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              প্রথম ৫টি হিরাগানা স্বরবর্ণ দিয়ে শুরু করুন: あ, い, う, え, お
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
              বাংলা উচ্চারণের সাথে হিরাগানার প্রথম ৫টি অক্ষর মুখস্থ করুন। সাউন্ড শুনে শুনে সঠিক উচ্চারণ আয়ত্ত করা হলো জাপানিজ ভাষার প্রথম সিঁড়ি।
            </p>

            <div className="flex items-center space-x-3 text-xs text-stone-400 pt-1">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">ধাপ ১ / ৪৬</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">+২৫ কয়েন রিওয়ার্ড</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                trackNihomiEvent('nba_zero_kana_clicked', { source: 'dashboard_nba' });
                if (onOpenZeroGateway) {
                  onOpenZeroGateway();
                } else if (onLaunchLesson) {
                  onLaunchLesson('lesson-0');
                }
              }}
              className="px-7 py-4 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shrink-0 group"
            >
              <Zap className="w-4 h-4 fill-current text-white group-hover:scale-110 transition-transform" />
              <span>Start Kana Zero Drill (শুরু করুন)</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render State 2: MemoryOS Targeted Review (Mistakes Detected)
  if (hasUnresolvedMistakes && primaryWeakArea) {
    return (
      <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-xl relative overflow-hidden text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>NIHOMI MEMORYOS™ • TARGETED REVIEW REQUIRED</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              টার্গেটেড ড্রিল: {primaryWeakArea.concept}
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
              {primaryWeakArea.guidanceBn}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-lg bg-red-500/20 text-red-300 text-[11px] font-mono font-bold">
                {primaryWeakArea.mistakeCount} বার ভুল রেকর্ড হয়েছে
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-stone-300 text-[11px] font-mono">
                Pattern: {primaryWeakArea.patternDetected}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                trackNihomiEvent('nba_targeted_review_clicked', {
                  concept: primaryWeakArea.concept,
                  pattern: primaryWeakArea.patternDetected
                });
                if (onLaunchReview) {
                  onLaunchReview(primaryWeakArea.concept);
                } else if (onLaunchLesson) {
                  onLaunchLesson('lesson-review');
                }
              }}
              className="px-7 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shrink-0 group"
            >
              <RotateCcw className="w-4 h-4 text-stone-950 group-hover:rotate-180 transition-transform" />
              <span>Fix This Weak Area (ভুল সংশোধন)</span>
              <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render State 3: Normal Progression (Next Minna no Nihongo Lesson)
  return (
    <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left transition-colors">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RECOMMENDED NEXT LESSON</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white">
          Minna no Nihongo Lesson 1 Grammar Master
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
          N1 は N2 です / N1 は N2 じゃありません • পার্টিকেল ও বাক্য গঠন
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          id="btn-launch-lesson"
          onClick={() => {
            trackNihomiEvent('nba_lesson_launched', { lesson: 'lesson-1' });
            if (onLaunchLesson) {
              onLaunchLesson('lesson-1');
            }
          }}
          className="px-6 py-3 bg-stone-950 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-950 text-xs font-bold rounded-2xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Interactive Lesson (12 min)</span>
        </button>
      </div>
    </div>
  );
};
