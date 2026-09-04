import React from 'react';
import { ContinueLesson } from '../types';

interface ContinueLearningCardProps {
  lesson: ContinueLesson | null;
  onResumeLesson?: (lessonId: string) => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  lesson,
  onResumeLesson,
}) => {
  if (!lesson) {
    return (
      <section className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-5 text-center">
        <p className="text-sm font-medium text-stone-700">কোনো অসমাপ্ত লেসন নেই</p>
        <p className="text-xs text-stone-500 mt-1">নতুন লেসন শুরু করতে পাঠ্যতালিকায় যান।</p>
      </section>
    );
  }

  return (
    <section 
      aria-labelledby="continue-learning-heading"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-6 shadow-md"
    >
      <div 
        aria-hidden="true" 
        className="absolute -right-4 -bottom-6 text-7xl font-light text-white/5 select-none pointer-events-none font-sans"
      >
        日本語
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white">
              {lesson.jlptLevel} • Lesson {lesson.lessonNumber}
            </span>
            <span className="text-xs text-stone-300 font-medium">
              {lesson.estimatedMinutesLeft} min left
            </span>
          </div>
          <span className="text-xs font-semibold text-rose-300">
            {lesson.progressPercent}% Complete
          </span>
        </div>

        <div>
          <h2 id="continue-learning-heading" className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {lesson.topic}
          </h2>
          {lesson.topicJapanese && (
            <p className="text-xs text-stone-300 font-medium mt-0.5 tracking-wide font-sans">
              {lesson.topicJapanese}
            </p>
          )}
          <p className="text-xs text-stone-400 mt-1">
            {lesson.title}
          </p>
        </div>

        <div 
          role="progressbar" 
          aria-valuenow={lesson.progressPercent} 
          aria-valuemin={0} 
          aria-valuemax={100}
          className="w-full bg-stone-700 rounded-full h-2 overflow-hidden"
        >
          <div
            className="bg-gradient-to-r from-rose-500 to-amber-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${lesson.progressPercent}%` }}
          />
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => onResumeLesson?.(lesson.lessonId)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-stone-950 font-semibold text-sm hover:bg-stone-100 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          >
            <span>Continue Learning</span>
            <span className="text-xs text-stone-500 font-normal">| শেখা চালিয়ে যান</span>
            <svg 
              className="w-4 h-4 ml-1 text-stone-900" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};