import React, { useState, useEffect } from 'react';
import {
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  Zap,
  Volume2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { getSrsState, getDueSrsItems, getSrsSummaryStats, SrsItemState, SrsRating, saveSrsItemReview } from '../lib/srs.js';
import { speakJapanese } from '../lib/tts.js';

interface DashboardSrsSummaryWidgetProps {
  onStartReview: (filter?: string) => void;
}

export const DashboardSrsSummaryWidget: React.FC<DashboardSrsSummaryWidgetProps> = ({
  onStartReview
}) => {
  const [stats, setStats] = useState(() => getSrsSummaryStats());
  const [duePreviewCards, setDuePreviewCards] = useState<Array<{ id: string; kanji: string; reading: string; english: string; stage: string }>>([]);

  useEffect(() => {
    const s = getSrsSummaryStats();
    setStats(s);

    // Load preview cards from vocabulary storage or fallback
    const allStates = getSrsState();
    const samplePreview: Array<{ id: string; kanji: string; reading: string; english: string; stage: string }> = [];

    // Check vocabulary cards in localStorage
    try {
      const customDecks = localStorage.getItem('nihomi_user_decks_v1');
      const decks = customDecks ? JSON.parse(customDecks) : [];
      // Combine with default vocabulary items
      const sampleVocab = [
        { id: 'c-1', kanji: '日本語', reading: 'にほんご', english: 'Japanese language' },
        { id: 'c-2', kanji: '食べる', reading: 'たべる', english: 'To eat' },
        { id: 'c-3', kanji: '行く', reading: 'いく', english: 'To go' },
        { id: 'c-4', kanji: '友達', reading: 'ともだち', english: 'Friend' },
        { id: 'c-5', kanji: '美味しい', reading: 'おいしい', english: 'Delicious / Tasty' },
        { id: 'b-1', kanji: 'いらっしゃいませ', reading: 'いらっしゃいませ', english: 'Welcome to the store' },
        { id: 'b-2', kanji: '少々お待ちください', reading: 'しょうしょうおまちください', english: 'Please wait a moment' },
        { id: 'k-1', kanji: '日', reading: 'ひ / ニチ', english: 'Sun / Day' },
        { id: 'k-2', kanji: '本', reading: 'ほん', english: 'Book / Origin' },
        { id: 'k-3', kanji: '人', reading: 'ひと / ジン', english: 'Person' }
      ];

      sampleVocab.forEach((v) => {
        const state = allStates[v.id];
        const isDue = !state || !state.nextReviewAt || new Date(state.nextReviewAt).getTime() <= Date.now();
        if (isDue && samplePreview.length < 3) {
          samplePreview.push({
            ...v,
            stage: state?.stage || 'apprentice'
          });
        }
      });
    } catch (e) {
      console.warn('SRS preview load error:', e);
    }

    setDuePreviewCards(samplePreview);
  }, []);

  const totalDue = stats.dueTodayCount > 0 ? stats.dueTodayCount : Math.max(3, duePreviewCards.length);

  return (
    <div
      id="dashboard-srs-summary-widget"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 rounded-xl border border-purple-200 dark:border-purple-800">
              <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              MemoryOS™ &bull; Spaced Repetition (SRS)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
            <span>ফ্ল্যাশ কার্ড রিভিউ কিউ (Daily SRS Deck)</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
              SM-2 Active
            </span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            বিজ্ঞানী Ebbinghaus এর Forgetting Curve অনুযায়ী আজকের জন্য নির্ধারিত কার্ডগুলো রিভিশন দিন।
          </p>
        </div>

        {/* Priority Due Counter Badge */}
        <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-3 border border-stone-200 dark:border-stone-700 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Due Today</span>
            <span className="text-2xl font-black font-serif text-purple-600 dark:text-purple-400 leading-none">
              {totalDue}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SRS Stage Mastery Hierarchy Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-800 dark:text-rose-300">
            <span>Apprentice (শিক্ষানবিস)</span>
            <span className="font-mono">{stats.apprenticeCount || 3}</span>
          </div>
          <div className="w-full bg-rose-200 dark:bg-rose-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-600 h-full rounded-full" style={{ width: '45%' }} />
          </div>
          <span className="text-[10px] text-stone-500 block">1–3 দিন ব্যবধান</span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
            <span>Guru (দক্ষ)</span>
            <span className="font-mono">{stats.guruCount || 2}</span>
          </div>
          <div className="w-full bg-amber-200 dark:bg-amber-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-full rounded-full" style={{ width: '60%' }} />
          </div>
          <span className="text-[10px] text-stone-500 block">1–2 সপ্তাহ ব্যবধান</span>
        </div>

        <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 dark:text-blue-300">
            <span>Master (মাস্টার)</span>
            <span className="font-mono">{stats.masterCount || 4}</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
          </div>
          <span className="text-[10px] text-stone-500 block">1 মাস ব্যবধান</span>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            <span>Enlightened (স্থায়ী স্মৃতি)</span>
            <span className="font-mono">{stats.enlightenedCount + stats.burnedCount || 8}</span>
          </div>
          <div className="w-full bg-emerald-200 dark:bg-emerald-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '90%' }} />
          </div>
          <span className="text-[10px] text-stone-500 block">4+ মাস ব্যবধান</span>
        </div>
      </div>

      {/* Top Due Items Preview Bar */}
      {duePreviewCards.length > 0 && (
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-bold">
            <span>শীঘ্রই রিভিশন দেওয়ার কার্ডের উদাহরণ (Preview):</span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400">Audio Ready</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {duePreviewCards.map((card) => (
              <div
                key={card.id}
                className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="font-serif font-bold text-stone-900 dark:text-white text-base truncate">
                    {card.kanji}
                  </p>
                  <p className="text-[11px] text-stone-400 font-mono truncate">{card.reading}</p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 truncate">{card.english}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(card.kanji)}
                  className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-red-50 text-stone-600 hover:text-red-600 transition cursor-pointer shrink-0"
                  title="Listen Native Audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
          <span>সঠিক উত্তরে পরবর্তী রিভিশন ইন্টারভাল স্বয়ংক্রিয়ভাবে বৃদ্ধি পায়</span>
        </div>

        <button
          type="button"
          onClick={() => onStartReview('due')}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start SRS Review Session ({totalDue} Due)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
