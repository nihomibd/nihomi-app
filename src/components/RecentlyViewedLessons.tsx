import React, { useState, useEffect } from 'react';
import {
  Clock,
  BookOpen,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

export interface RecentlyViewedItem {
  lessonId: string;
  lessonNumber: number;
  title: string;
  titleJa?: string;
  level: string;
  lastAccessedAt: string;
  progressPct?: number;
}

interface RecentlyViewedLessonsProps {
  onNavigateLesson: (lessonId: string) => void;
}

export const RecentlyViewedLessons: React.FC<RecentlyViewedLessonsProps> = ({
  onNavigateLesson
}) => {
  const [recentLessons, setRecentLessons] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nihomi_recently_viewed_lessons_v1');
      if (raw) {
        const parsed: RecentlyViewedItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentLessons(parsed.slice(0, 3));
          return;
        }
      }
    } catch {}

    // Fallback default recently viewed lessons if empty
    setRecentLessons([
      {
        lessonId: 'les-n5-1-1',
        lessonNumber: 1,
        title: 'Meeting People, Polite Self-Introductions (自己紹介) & Particles は/です',
        titleJa: 'はじめまして・自己紹介',
        level: 'N5',
        lastAccessedAt: new Date().toISOString(),
        progressPct: 85
      },
      {
        lessonId: 'les-n5-1-2',
        lessonNumber: 2,
        title: 'Demonstrative Pronouns (これ・それ・あれ・この・その) & Belonging の',
        titleJa: 'これ・それ・あれ',
        level: 'N5',
        lastAccessedAt: new Date(Date.now() - 86400000).toISOString(),
        progressPct: 60
      },
      {
        lessonId: 'les-n5-1-3',
        lessonNumber: 3,
        title: 'Asking Locations, Store Shopping (ここ・そこ・あそこ) & Price Questions',
        titleJa: 'ここ・そこ・あそこ・いくら',
        level: 'N5',
        lastAccessedAt: new Date(Date.now() - 172800000).toISOString(),
        progressPct: 40
      }
    ]);
  }, []);

  if (recentLessons.length === 0) return null;

  return (
    <div
      id="recently-viewed-lessons-section"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
              <span>Recently Viewed Lessons (সর্বশেষ দেখা পাঠ্যক্রম)</span>
            </h3>
            <p className="text-xs text-stone-400">যেখান থেকে বন্ধ করেছিলেন সেখান থেকেই শুরু করুন</p>
          </div>
        </div>

        <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-200">
          Last 3 Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {recentLessons.map((item, idx) => (
          <div
            key={item.lessonId || idx}
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:border-red-300 dark:hover:border-red-800 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 text-red-600 border border-stone-200 dark:border-stone-700 text-[10px] font-extrabold uppercase font-mono">
                  JLPT {item.level} &bull; Lesson {item.lessonNumber}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {new Date(item.lastAccessedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {item.titleJa && (
                <p className="text-xs font-bold font-serif text-stone-900 dark:text-white truncate">
                  {item.titleJa}
                </p>
              )}

              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed font-medium">
                {item.title}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
              {item.progressPct !== undefined && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold">
                    <span>Progress</span>
                    <span>{item.progressPct}%</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full transition-all"
                      style={{ width: `${item.progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => onNavigateLesson(item.lessonId)}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-900 hover:bg-red-600 hover:text-white text-stone-900 dark:text-white text-xs font-bold border border-stone-200 dark:border-stone-700 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Lesson</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
