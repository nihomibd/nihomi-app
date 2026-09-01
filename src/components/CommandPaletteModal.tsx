import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  X,
  Compass,
  Mic,
  GraduationCap,
  PenTool,
  BrainCircuit,
  FileText,
  Flame,
  Volume2,
  Clock,
  Keyboard,
  CreditCard,
  Briefcase
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Lessons' | 'Quizzes' | 'Practice & Tools' | 'Curriculum & Docs' | 'Navigation';
  icon: any;
  action: () => void;
  keywords: string[];
  badge?: string;
  level?: string;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allCommands = useMemo<CommandItem[]>(() => {
    const commands: CommandItem[] = [
      // Primary Navigation
      {
        id: 'nav-dashboard',
        title: 'Student Dashboard & Progress',
        subtitle: 'View overall JLPT stats, streak, badges & XP',
        category: 'Navigation',
        icon: GraduationCap,
        action: () => onNavigate('portal'),
        keywords: ['dashboard', 'portal', 'home', 'progress', 'stats', 'profile']
      },
      {
        id: 'nav-courses',
        title: 'All Courses & Lessons (N5 - N3)',
        subtitle: 'Minna no Nihongo & interactive modular curriculum',
        category: 'Navigation',
        icon: BookOpen,
        action: () => onNavigate('courses'),
        keywords: ['courses', 'curriculum', 'lessons', 'minna', 'n5', 'n4', 'n3']
      },
      {
        id: 'nav-quizzes',
        title: 'JLPT Verified Quizzes & Tests',
        subtitle: 'Comprehensive evaluation engine with leaderboard',
        category: 'Navigation',
        icon: HelpCircle,
        action: () => onNavigate('quizzes'),
        keywords: ['quizzes', 'tests', 'exam', 'jlpt', 'assessment']
      },
      {
        id: 'nav-pricing',
        title: 'Subscription & Membership Plans',
        subtitle: 'Upgrade to Pro or Enterprise for unlimited AI',
        category: 'Navigation',
        icon: CreditCard,
        action: () => onNavigate('pricing'),
        keywords: ['pricing', 'subscription', 'upgrade', 'bdt', 'pro', 'plan']
      },
      {
        id: 'nav-coordination',
        title: 'Japan Coordination & Visa Docs',
        subtitle: 'Legal templates, COE guidance & translation docs',
        category: 'Curriculum & Docs',
        icon: FileText,
        action: () => onNavigate('coordination'),
        keywords: ['coordination', 'visa', 'coe', 'documents', 'japan', 'relocation']
      },

      // Essential Tools & Labs
      {
        id: 'tool-flashcards',
        title: 'Vocabulary Flashcards & Folders',
        subtitle: 'Interactive card bank with custom folder tagging & SRS',
        category: 'Practice & Tools',
        icon: Layers,
        badge: 'SRS Powered',
        action: () => onNavigate('portal', { tab: 'flashcards' }),
        keywords: ['flashcards', 'vocabulary', 'words', 'folders', 'tango']
      },
      {
        id: 'tool-kanji-bank',
        title: '120 Essential JLPT N5 Kanji Bank',
        subtitle: '3D Flip cards, stroke order visualizer & tracing pad',
        category: 'Practice & Tools',
        icon: PenTool,
        badge: 'Stroke Studio',
        action: () => onNavigate('portal', { tab: 'kanji' }),
        keywords: ['kanji', 'stroke', 'trace', 'writing', 'characters', '120']
      },
      {
        id: 'tool-pronunciation',
        title: 'Pronunciation & Pitch Accent Coach',
        subtitle: 'Web Speech API & AI-powered Tokyo accent analysis',
        category: 'Practice & Tools',
        icon: Mic,
        badge: 'AI Coach',
        action: () => onNavigate('portal', { tab: 'pronunciation' }),
        keywords: ['pronunciation', 'accent', 'pitch', 'voice', 'speak', 'audio']
      },
      {
        id: 'tool-memory-os',
        title: 'MemoryOS™ Error Tracker & Ghost Mode',
        subtitle: 'Dynamic recovery for は vs が, に vs で particle confusion',
        category: 'Practice & Tools',
        icon: BrainCircuit,
        badge: 'Ghost Mode',
        action: () => onNavigate('ghost-mode'),
        keywords: ['memoryos', 'ghost', 'particles', 'weakness', 'errors', 'srs']
      },
      {
        id: 'tool-baito-os',
        title: 'Workplace Japanese & Baito Simulation',
        subtitle: 'Konbini, restaurant & office keigo roleplay exercises',
        category: 'Practice & Tools',
        icon: Briefcase,
        action: () => onNavigate('portal', { tab: 'work-japanese' }),
        keywords: ['work', 'baito', 'job', 'keigo', 'interview', 'konbini']
      },
      {
        id: 'tool-badges',
        title: 'JLPT Milestone Badges & Achievements',
        subtitle: 'Unlockable rewards for study streaks and kanji milestones',
        category: 'Practice & Tools',
        icon: Award,
        action: () => onNavigate('portal', { tab: 'badges' }),
        keywords: ['badges', 'achievements', 'rewards', 'xp', 'streak']
      },

      // Popular Lessons
      {
        id: 'lesson-n5-l1',
        title: 'Lesson 1: Self-Introductions & は / です',
        subtitle: 'Minna no Nihongo N5 • Hajimemashite & Watashi wa...',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l1' }),
        keywords: ['lesson 1', 'n5-l1', 'hajimemashite', 'wa', 'desu', 'introduction']
      },
      {
        id: 'lesson-n5-l2',
        title: 'Lesson 2: Demonstratives (これ, それ, あれ, どれ)',
        subtitle: 'Minna no Nihongo N5 • Identifying objects & possession (の)',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l2' }),
        keywords: ['lesson 2', 'n5-l2', 'kore', 'sore', 'are', 'dore', 'no']
      },
      {
        id: 'lesson-n5-l3',
        title: 'Lesson 3: Places & Directions (ここ, そこ, あそこ)',
        subtitle: 'Minna no Nihongo N5 • Location markers & asking where',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l3' }),
        keywords: ['lesson 3', 'n5-l3', 'koko', 'soko', 'asoko', 'doko', 'places']
      },
      {
        id: 'lesson-n5-l4',
        title: 'Lesson 4: Time, Days & Daily Actions (から / まで)',
        subtitle: 'Minna no Nihongo N5 • Clock time, schedule & verb present forms',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l4' }),
        keywords: ['lesson 4', 'n5-l4', 'time', 'hours', 'kara', 'made', 'masu']
      },
      {
        id: 'lesson-n5-l5',
        title: 'Lesson 5: Movement & Destination Particles (へ / で / と)',
        subtitle: 'Minna no Nihongo N5 • Ikimasu, kimasu, kaerimasu with transit',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l5' }),
        keywords: ['lesson 5', 'n5-l5', 'ikimasu', 'transit', 'he', 'de', 'to']
      },
      {
        id: 'lesson-n5-l6',
        title: 'Lesson 6: Transitive Verbs & Direct Objects (を / で)',
        subtitle: 'Minna no Nihongo N5 • Eating, drinking, buying & action locations',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l6' }),
        keywords: ['lesson 6', 'n5-l6', 'wo', 'tabemasu', 'nomimasu', 'action']
      },
      {
        id: 'lesson-n5-l14',
        title: 'Lesson 14: The Crucial Te-Form (て形)',
        subtitle: 'Minna no Nihongo N5 • Verb groupings, requests & progressive states',
        category: 'Lessons',
        level: 'N5',
        icon: BookOpen,
        action: () => onNavigate('lesson', { lessonId: 'n5-l14' }),
        keywords: ['lesson 14', 'n5-l14', 'te form', 'kudasai', 'imasu', 'verbs']
      },

      // Popular Quizzes
      {
        id: 'quiz-n5-01',
        title: 'JLPT N5 Core Grammar Assessment',
        subtitle: '20 Questions • Particles, sentence patterns & time words',
        category: 'Quizzes',
        level: 'N5',
        icon: HelpCircle,
        action: () => onNavigate('quiz-runner', { quizId: 'quiz-n5-01' }),
        keywords: ['quiz n5', 'quiz-n5-01', 'grammar quiz', 'n5 test']
      },
      {
        id: 'quiz-n5-02',
        title: 'JLPT N5 Particle Precision Challenge',
        subtitle: '15 Questions • Focus on は vs が, に vs で discrimination',
        category: 'Quizzes',
        level: 'N5',
        icon: HelpCircle,
        action: () => onNavigate('quiz-runner', { quizId: 'quiz-n5-02' }),
        keywords: ['particle quiz', 'particles', 'ha vs ga', 'ni vs de', 'quiz-n5-02']
      },
      {
        id: 'quiz-n4-01',
        title: 'JLPT N4 Intermediate Te-Form & Passive',
        subtitle: '15 Questions • Verb inflections, passive & conditional Tara/Ba',
        category: 'Quizzes',
        level: 'N4',
        icon: HelpCircle,
        action: () => onNavigate('quiz-runner', { quizId: 'quiz-n4-01' }),
        keywords: ['quiz n4', 'n4 quiz', 'passive', 'conditionals', 'quiz-n4-01']
      }
    ];

    return commands;
  }, [onNavigate]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const lowerQuery = query.toLowerCase().trim();
    return allCommands.filter((cmd) => {
      const titleMatch = cmd.title.toLowerCase().includes(lowerQuery);
      const subtitleMatch = cmd.subtitle.toLowerCase().includes(lowerQuery);
      const categoryMatch = cmd.category.toLowerCase().includes(lowerQuery);
      const keywordMatch = cmd.keywords.some((k) => k.toLowerCase().includes(lowerQuery));
      const levelMatch = cmd.level?.toLowerCase() === lowerQuery;
      return titleMatch || subtitleMatch || categoryMatch || keywordMatch || levelMatch;
    });
  }, [query, allCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  const handleSelect = (item: CommandItem) => {
    item.action();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="nihomi-command-palette-overlay"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="nihomi-command-palette-dialog"
        className="w-full max-w-2xl bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] gap-3">
          <Search className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, quizzes, kanji bank, tools, or docs... (e.g. 'Lesson 5', 'Particles', 'SRS')"
            className="w-full bg-transparent border-none text-sm sm:text-base font-medium text-stone-900 dark:text-stone-100 sepia:text-[#382a17] placeholder-stone-400 focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 sepia:bg-[#ede0b9] text-[10px] font-mono text-stone-500 border border-stone-200 dark:border-stone-700">
                ESC
              </kbd>
            </div>
          )}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-stone-50/80 dark:bg-stone-900/60 sepia:bg-[#ede0b9]/60 border-b border-stone-200/60 dark:border-stone-800/60 overflow-x-auto text-[11px] font-semibold text-stone-600 dark:text-stone-300">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold shrink-0">Filter:</span>
          {['Lessons', 'Quizzes', 'Practice & Tools', 'Curriculum & Docs'].map((cat) => (
            <button
              key={cat}
              onClick={() => setQuery(cat)}
              className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                query.toLowerCase() === cat.toLowerCase()
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-stone-800 sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-700 hover:border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 space-y-1 divide-y divide-stone-100 dark:divide-stone-800/40"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Compass className="w-8 h-8 text-stone-400 mx-auto animate-pulse" />
              <p className="text-xs font-bold text-stone-600 dark:text-stone-300">No matching resources found for "{query}"</p>
              <p className="text-[11px] text-stone-400">Try searching for "N5", "Kanji", "Grammar", or "Lesson 1"</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const IconComponent = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-50/90 dark:bg-red-950/40 sepia:bg-[#ede0b9] border border-red-200 dark:border-red-900/60'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 sepia:bg-[#ede0b9] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 sepia:text-[#382a17] truncate">
                          {cmd.title}
                        </p>
                        {cmd.badge && (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[9px] font-extrabold uppercase">
                            {cmd.badge}
                          </span>
                        )}
                        {cmd.level && (
                          <span className="px-1.5 py-0.2 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[9px] font-bold">
                            {cmd.level}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 sepia:text-[#7a6344] truncate">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-semibold text-stone-400 hidden sm:inline">
                      {cmd.category}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-red-600 translate-x-0.5' : 'text-stone-300 dark:text-stone-700'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Navigation Footer */}
        <div className="px-4 sm:px-6 py-2.5 bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] border-t border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-700 font-mono text-[10px]">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-700 font-mono text-[10px]">
                ↵
              </kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="font-mono text-[10px]">NIHOMI Command Bar</span>
        </div>
      </div>
    </div>
  );
};
