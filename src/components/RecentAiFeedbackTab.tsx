import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  Filter,
  Trash2,
  BookOpen,
  Mic,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';
import { speakJapanese } from '../lib/tts';

export interface AIFeedbackRecord {
  id: string;
  timestamp: number;
  category: 'Grammar & Particles' | 'Pronunciation & Pitch' | 'Sentence DNA' | 'Quiz Mistakes' | 'General Coach';
  targetJapanese: string;
  romaji?: string;
  userAttempt?: string;
  feedbackText: string;
  feedbackTextBn?: string;
  keyRule?: string;
  score?: number;
}

const DEFAULT_FEEDBACK_HISTORY: AIFeedbackRecord[] = [
  {
    id: 'fb-1',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    category: 'Grammar & Particles',
    targetJapanese: '図書館で本を読みます。',
    romaji: 'Toshokan de hon wo yomimasu.',
    userAttempt: '図書館に本を読みます。(Incorrect particle に used for active reading location)',
    feedbackText: 'Action locations take "で" (de). "に" (ni) is reserved for static existence (あります/います) and movement destinations (行きます).',
    feedbackTextBn: 'কাজের স্থান বোঝাতে "で" (de) বসে। অবস্থান বা গন্তব্যের ক্ষেত্রে "に" (ni) বসে।',
    keyRule: 'Action location = [Place] + で + [Action Verb]'
  },
  {
    id: 'fb-2',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    category: 'Pronunciation & Pitch',
    targetJapanese: 'はじめまして、よろしくおねがいします。',
    romaji: 'Hajimemashite, yoroshiku onegaishimasu.',
    userAttempt: 'Voice recording evaluated',
    feedbackText: 'Syllables were distinct. Keep the pitch steady across "onegaishimasu" without stressing the English-style "ga".',
    feedbackTextBn: 'উচ্চারণ পরিষ্কার হয়েছে। "onegaishimasu" বলার সময় কোনো একটি সিলেবলে অতিরিক্ত জোর না দিয়ে সমান তালে বলুন।',
    score: 88,
    keyRule: 'Standard Tokyo Heiban intonation keeps flat pitch contour.'
  },
  {
    id: 'fb-3',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    category: 'Quiz Mistakes',
    targetJapanese: '毎朝 ７時に 起きます。',
    romaji: 'Maiasa shichi-ji ni okimasu.',
    userAttempt: 'Selected: 毎朝 ７時で 起きます。',
    feedbackText: 'Specific clock times requiring exact points in time take "に". Do not confuse time marker に with location de.',
    feedbackTextBn: 'নির্দিষ্ট সময় (ঘণ্টা, দিন) বোঝাতে সময়ের পর "に" (ni) বসে।',
    keyRule: 'Specific numeric clock time = [Time] + に'
  },
  {
    id: 'fb-4',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    category: 'Sentence DNA',
    targetJapanese: '田中さんは親切で、ハンサムです。',
    romaji: 'Tanaka-san wa shinsetsu de, hansamu desu.',
    feedbackText: 'Na-adjective conjunction connects using "で". Both qualities (kind & handsome) are positive.',
    feedbackTextBn: 'Na-Adjective যুক্ত করার জন্য "で" ব্যবহৃত হয়।',
    keyRule: 'Na-adjective stem + で + [Adjective 2]'
  }
];

export const RecentAiFeedbackTab: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<AIFeedbackRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nihomi_recent_ai_feedback_v1');
      if (stored) {
        setFeedbackList(JSON.parse(stored));
      } else {
        setFeedbackList(DEFAULT_FEEDBACK_HISTORY);
        localStorage.setItem('nihomi_recent_ai_feedback_v1', JSON.stringify(DEFAULT_FEEDBACK_HISTORY));
      }
    } catch {
      setFeedbackList(DEFAULT_FEEDBACK_HISTORY);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your AI feedback history?')) {
      setFeedbackList([]);
      localStorage.removeItem('nihomi_recent_ai_feedback_v1');
    }
  };

  const filteredList = feedbackList.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.targetJapanese.toLowerCase().includes(q) ||
      item.feedbackText.toLowerCase().includes(q) ||
      (item.feedbackTextBn && item.feedbackTextBn.toLowerCase().includes(q)) ||
      (item.keyRule && item.keyRule.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div id="nihomi-recent-ai-feedback" className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17]">
              Recent AI Sensei Feedback & Corrections
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 sepia:text-[#7a6344]">
            Review all personalized grammar tips, quiz mistake breakdowns, and Tokyo pitch accent evaluations from your recent study sessions.
          </p>
        </div>

        {feedbackList.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {['All', 'Grammar & Particles', 'Pronunciation & Pitch', 'Quiz Mistakes', 'Sentence DNA'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-stone-900 sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback notes..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-stone-900 sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Feedback Feed Cards */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center space-y-3">
            <BrainCircuit className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
              No AI feedback entries found
            </p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Complete lessons, practice with the Pronunciation Coach, or take quizzes with 'Explain Mistake' to populate your personalized feed.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 hover:border-red-300 dark:hover:border-red-900/60 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[10px] font-extrabold uppercase">
                    {item.category}
                  </span>
                  {item.score !== undefined && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {item.score}% Accuracy
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-[11px] text-stone-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Japanese Target Phrase */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] rounded-2xl border border-stone-200 dark:border-stone-800">
                <div>
                  <p className="text-base font-bold font-japanese text-stone-900 dark:text-white sepia:text-[#382a17]">
                    {item.targetJapanese}
                  </p>
                  {item.romaji && (
                    <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                      {item.romaji}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => speakJapanese(item.targetJapanese)}
                  className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-red-600 transition cursor-pointer shadow-2xs"
                  title="Listen Native Audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* User Attempt if present */}
              {item.userAttempt && (
                <div className="text-xs p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 font-medium">
                  <span className="font-bold text-[10px] uppercase tracking-wider block text-amber-600">Your Attempt / Quiz Response:</span>
                  <span>{item.userAttempt}</span>
                </div>
              )}

              {/* Sensei Feedback Content */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {item.feedbackText}
                </p>
                {item.feedbackTextBn && (
                  <p className="text-xs font-serif text-stone-500 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-2">
                    {item.feedbackTextBn}
                  </p>
                )}
              </div>

              {/* Key Grammar Rule Badge */}
              {item.keyRule && (
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-stone-400">Core Syntactic Rule:</span>
                  <span className="font-mono font-bold text-[11px] text-red-600 dark:text-red-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    {item.keyRule}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
