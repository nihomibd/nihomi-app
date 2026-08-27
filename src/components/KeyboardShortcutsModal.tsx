import React, { useState, useEffect } from 'react';
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
  Zap,
  Grid,
  List,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface ShortcutDef {
  key: string;
  label: string;
  description: string;
  view: string;
  icon: any;
  color: string;
  badgeBg: string;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const shortcuts: ShortcutDef[] = [
    {
      key: 'D',
      label: 'Dashboard (ড্যাশবোর্ড)',
      description: 'Go directly to your personalized study dashboard and daily goals',
      view: 'dashboard',
      icon: LayoutDashboard,
      color: 'text-red-600 dark:text-red-400',
      badgeBg: 'bg-red-600 text-white'
    },
    {
      key: 'L',
      label: 'Lessons & Courses (কোর্সসমূহ)',
      description: 'Explore Minna no Nihongo N5/N4 and JLPT grammar modules',
      view: 'courses',
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-600 text-white'
    },
    {
      key: 'K',
      label: 'AI Coach & Sensei (AI সেনসেই)',
      description: 'Instant Japanese conversational practice and grammar feedback',
      view: 'ai-coach',
      icon: Bot,
      color: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-600 text-white'
    },
    {
      key: 'Q',
      label: 'Quizzes & Mock Tests (কুইজ)',
      description: 'Test your vocabulary, particles, and JLPT exam readiness',
      view: 'quizzes',
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-600 text-white'
    },
    {
      key: 'F',
      label: 'Flashcards Bank (ফ্ল্যাশকার্ড)',
      description: 'Spaced repetition flashcards with audio and kanji stroke order',
      view: 'flashcards',
      icon: Layers,
      color: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-600 text-white'
    },
    {
      key: 'M',
      label: 'MemoryOS™ & Mistakes (মেমোরি ওএস)',
      description: 'Targeted recovery for particle confusion (は vs が, に vs で)',
      view: 'memory-os',
      icon: Brain,
      color: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-600 text-white'
    },
    {
      key: 'P',
      label: 'Progress & Analytics (অগ্রগতি)',
      description: 'View study minutes, mastery charts, and JLPT radar analysis',
      view: 'progress',
      icon: BarChart3,
      color: 'text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-600 text-white'
    },
    {
      key: 'B',
      label: 'Badges & Milestones (অর্জিত ব্যাজ)',
      description: 'Check unlocked achievement badges and upcoming milestones',
      view: 'badges',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-600 text-white'
    },
    {
      key: 'N',
      label: 'Documents & PDFs (ডকুমেন্ট)',
      description: 'Download offline vocabulary decks and JLPT milestone certificates',
      view: 'documents',
      icon: FileText,
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-600 text-white'
    }
  ];

  const shortcutKeyMap = new Map<string, ShortcutDef>();
  shortcuts.forEach((sc) => shortcutKeyMap.set(sc.key.toUpperCase(), sc));

  // Listen to physical key events inside modal for interactive visual feedback
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      setPressedKey(key);

      const match = shortcutKeyMap.get(key);
      if (match && match.view) {
        setTimeout(() => {
          onNavigate(match.view);
          onClose();
        }, 180);
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, onNavigate, onClose]);

  if (!isOpen) return null;

  // QWERTY Virtual Keyboard Layout Definitions
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '?']
  ];

  return (
    <div
      id="keyboard-shortcuts-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 text-stone-900 dark:text-white max-h-[90vh] overflow-y-auto"
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
                Interactive keyboard map & navigation accelerators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>Map Overlay</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <List className="w-3 h-3" />
                <span>List View</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VISUAL KEYBOARD MAP OVERLAY */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-stone-950 text-white shadow-2xl border border-stone-800 space-y-2 select-none">
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-b border-stone-800 pb-2 px-1">
                <span>VIRTUAL HARDWARE OVERLAY (QWERTY)</span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Active Hotkeys Highlighted
                </span>
              </div>

              {/* Virtual Keyboard Rows */}
              <div className="space-y-2 pt-2">
                {keyboardRows.map((row, rIdx) => (
                  <div key={rIdx} className="flex justify-center gap-1.5 sm:gap-2">
                    {row.map((char) => {
                      const shortcut = shortcutKeyMap.get(char);
                      const isPressed = pressedKey === char;

                      return (
                        <button
                          key={char}
                          onClick={() => {
                            if (shortcut) {
                              onNavigate(shortcut.view);
                              onClose();
                            }
                          }}
                          className={`relative flex flex-col items-center justify-between p-2 rounded-xl text-xs font-mono font-bold transition-all ${
                            char === '?' ? 'w-12 sm:w-16' : 'w-10 sm:w-14'
                          } h-12 sm:h-16 ${
                            shortcut
                              ? 'bg-stone-800 hover:bg-red-600 border-2 border-red-500/80 text-white shadow-md shadow-red-950/40 hover:scale-105 cursor-pointer ring-1 ring-red-400/50'
                              : 'bg-stone-900/80 border border-stone-800 text-stone-600 opacity-60 cursor-default'
                          } ${isPressed ? 'scale-90 bg-red-500 text-white ring-4 ring-amber-400' : ''}`}
                        >
                          <span className="text-xs sm:text-sm font-extrabold">{char}</span>
                          {shortcut && (
                            <span className="text-[8px] sm:text-[9px] uppercase tracking-tighter truncate w-full text-center text-amber-300 font-sans font-extrabold">
                              {shortcut.label.split(' ')[0]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="text-center text-[10px] text-stone-400 font-mono pt-2">
                * Click any glowing key or press the key on your physical keyboard to jump instantly.
              </div>
            </div>

            {/* Quick Cards of Active Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {shortcuts.map((sc) => {
                const Icon = sc.icon;
                return (
                  <div
                    key={sc.key}
                    onClick={() => {
                      onNavigate(sc.view);
                      onClose();
                    }}
                    className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 hover:bg-stone-100 hover:border-red-300 dark:hover:border-red-800 transition cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate text-stone-800 dark:text-stone-200">
                          {sc.label.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono block">
                          Jump to view
                        </span>
                      </div>
                    </div>

                    <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-white border border-stone-300 dark:border-stone-700 text-xs font-mono font-extrabold shadow-xs">
                      {sc.key}
                    </kbd>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
            {shortcuts.map((sc) => {
              const Icon = sc.icon;
              return (
                <div
                  key={sc.key}
                  onClick={() => {
                    onNavigate(sc.view);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900">
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
        )}

        {/* Pro Tip Footer */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Pro Tip:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-amber-300 text-[10px] font-mono font-bold">?</kbd> at any time to open this visual cheat sheet.
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
