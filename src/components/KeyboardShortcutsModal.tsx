import React from 'react';
import {
  Keyboard,
  X,
  Sparkles,
  BookOpen,
  Bot,
  Award,
  Layers,
  BarChart3,
  LayoutDashboard,
  Brain,
  History,
  Search,
  Zap
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      key: 'D',
      label: 'Dashboard (ড্যাশবোর্ড)',
      description: 'Go directly to your personalized study dashboard and daily goals',
      view: 'dashboard',
      icon: LayoutDashboard,
      color: 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'
    },
    {
      key: 'L',
      label: 'Lessons & Courses (কোর্সসমূহ)',
      description: 'Explore Minna no Nihongo N5/N4 and JLPT grammar modules',
      view: 'courses',
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
    },
    {
      key: 'K',
      label: 'AI Coach & Sensei (AI সেনসেই)',
      description: 'Instant Japanese conversational practice and grammar feedback',
      view: 'ai-coach',
      icon: Bot,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
    },
    {
      key: 'Q',
      label: 'Quizzes & Mock Tests (কুইজ)',
      description: 'Test your vocabulary, particles, and JLPT exam readiness',
      view: 'quizzes',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
    },
    {
      key: 'F',
      label: 'Flashcards Bank (ফ্ল্যাশকার্ড)',
      description: 'Spaced repetition flashcards with audio and kanji stroke order',
      view: 'flashcards',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900'
    },
    {
      key: 'M',
      label: 'MemoryOS™ & Mistakes (মেমোরি ওএস)',
      description: 'Targeted recovery for particle confusion (は vs が, に vs で)',
      view: 'memory-os',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900'
    },
    {
      key: 'P',
      label: 'Progress & Analytics (অগ্রগতি)',
      description: 'View study minutes, mastery charts, and JLPT radar analysis',
      view: 'progress',
      icon: BarChart3,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900'
    },
    {
      key: 'B',
      label: 'Badges & Milestones (অর্জিত ব্যাজ)',
      description: 'Check unlocked achievement badges and upcoming milestones',
      view: 'badges',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
    },
    {
      key: '?',
      label: 'Help / Cheat Sheet (শর্টকাট তালিকা)',
      description: 'Toggle this keyboard shortcuts cheat sheet anywhere',
      view: '',
      icon: Keyboard,
      color: 'text-stone-700 bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
    }
  ];

  return (
    <div
      id="keyboard-shortcuts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-stone-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-serif">
                Global Keyboard Shortcuts (কিবোর্ড শর্টকাট)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Navigate Nihomi instantly without lifting your hands from the keyboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.key}
                onClick={() => {
                  if (sc.view) {
                    onNavigate(sc.view);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  sc.view
                    ? 'hover:bg-stone-50 dark:hover:bg-stone-800/80 border-stone-200 dark:border-stone-800'
                    : 'border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${sc.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{sc.label}</p>
                    <p className="text-[11px] text-stone-400 truncate">{sc.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  <kbd className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-mono font-extrabold shadow-xs">
                    {sc.key}
                  </kbd>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Tip Footer */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Pro Tip:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-amber-300 text-[10px] font-mono font-bold">?</kbd> at any time to open this cheat sheet. Shortcuts are auto-disabled inside text inputs.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition cursor-pointer shrink-0 ml-3"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
