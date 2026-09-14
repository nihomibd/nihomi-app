import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  User,
  Crown,
  Sparkles,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
  BookOpen,
  Trophy,
  Check,
  Wifi,
  Volume2,
  Compass,
  PenTool,
  FileText,
  Layers,
  Award,
  Briefcase,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AppTheme } from '../../context/ThemeContext';

// Self-contained Nihomi Master Monogram SVG
const NihomiMonogram: React.FC<{ size?: number; className?: string }> = ({ size = 30, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    <rect width="100" height="100" rx="22" fill="#E11D48" />
    <path d="M26 78V30C26 25.5817 29.5817 22 34 22H36C40.4183 22 44 25.5817 44 30V78H26Z" fill="#FFFFFF" />
    <path d="M38 28L72 74C75 78 80 78 83 74C86 70 86 65 83 61L64 38C60 33 54 33 50 38L38 52" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M66 78V40C66 35.5817 69.5817 32 74 32H76C80.4183 32 84 35.5817 84 40V78H66Z" fill="#FFFFFF" />
    <circle cx="50" cy="50" r="8" fill="#FDE047" />
  </svg>
);

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDictionary?: () => void;
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, openAuthModal, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<'curriculum' | 'practice' | 'career' | 'theme' | 'user' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<'curriculum' | 'practice' | 'career' | null>('curriculum');

  const navContainerRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const isFounder = user?.role === 'founder' || user?.email === 'mdtanvirkabirbiplob@gmail.com';

  const themeOptions: { id: AppTheme; label: string; icon: any }[] = [
    { id: 'system', label: 'System', icon: Laptop },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'sepia', label: 'Sepia', icon: BookOpen },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node) &&
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Service Worker Offline Readiness Detection
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkOfflineReadiness = async () => {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          const cacheKeys = await caches.keys();
          const hasNihomiCache = cacheKeys.some((key) => key.startsWith('nihomi-pwa-cache-') || key.startsWith('nihomi-'));
          if (hasNihomiCache) {
            setIsOfflineReady(true);
          }
        }
      } catch {}
    };

    checkOfflineReadiness();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', checkOfflineReadiness);
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'NIHOMI_CACHE_READY') {
          setIsOfflineReady(true);
        }
      });
    }
  }, []);

  const ActiveThemeIcon = theme === 'system' ? Laptop : theme === 'dark' ? Moon : theme === 'sepia' ? BookOpen : Sun;

  // Active category detection
  const isCurriculumActive = ['curriculum', 'lesson', 'courses', 'listening-lab', 'listening', 'kaiwa', 'choukai', 'study-plan', 'roadmap'].includes(currentView);
  const isPracticeActive = ['kana', 'hiragana', 'katakana', 'kanji', 'kanji-100', 'kanji-lab'].includes(currentView);
  const isMockActive = ['mock-exams', 'mock-exam-runner', 'mock-exam', 'mock-tests'].includes(currentView);
  const isCareerActive = ['baito', 'baito-os', 'interview', 'leaderboard', 'community'].includes(currentView);

  const handleDropdownSelect = (viewId: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onNavigate(viewId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 dark:bg-[#0a0a12]/95 sepia:bg-[#fbf0d9]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 sepia:border-[#d9cbb2] transition-colors text-left select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 1. BRAND LOGO: CLEAN, HORIZONTAL NIHOMI (ニホミ) + JLPT N5 OS BADGE */}
          <button
            id="header-brand-logo"
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2.5 group cursor-pointer focus:outline-hidden shrink-0 select-none mr-2 lg:mr-6"
          >
            <NihomiMonogram size={32} className="group-hover:scale-105 transition-transform shadow-xs" />
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-black text-lg sm:text-xl tracking-tight text-stone-950 dark:text-white sepia:text-[#332211]">
                NIHOMI <span className="font-japanese text-sm font-bold text-red-600 dark:text-rose-400">(ニホミ)</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 text-[10px] font-bold font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                JLPT N5 OS
              </span>
            </div>
          </button>

          {/* 2. DESKTOP NAVIGATION: 4 ELEGANT GROUPED DROPDOWNS */}
          <nav
            ref={navContainerRef}
            className="hidden md:flex items-center space-x-1 lg:space-x-1.5 shrink-0"
          >
            {/* DROPDOWN 1: কারিকুলাম ও লিসেনিং */}
            <div className="relative">
              <button
                id="nav-dropdown-curriculum"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'curriculum' ? null : 'curriculum')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurriculumActive
                    ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 shadow-2xs font-bold'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/70'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 opacity-80" />
                <span>কারিকুলাম ও লিসেনিং</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'curriculum' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'curriculum' && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    Minna no Nihongo & Audio Lab
                  </div>

                  <button
                    id="nav-item-curriculum-lessons"
                    type="button"
                    onClick={() => handleDropdownSelect('curriculum')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-red-600 dark:text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        মিন্না নো নিহোঙ্গো ১–২৫ লেসন
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        ব্যাখ্যামূলক ব্যাকরণ ও ভোকাবুলারি
                      </div>
                    </div>
                  </button>

                  <button
                    id="nav-item-listening-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('listening-lab')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        লিসেনিং অডিও ল্যাব
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        টোকিও নেটিভ অ্যাকসেন্ট ও চৌকাই প্র্যাকটিস
                      </div>
                    </div>
                  </button>

                  <button
                    id="nav-item-roadmap"
                    type="button"
                    onClick={() => handleDropdownSelect('study-plan')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        এন৫ রোডম্যাপ ও গাইডলাইন
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        ৬০-৯০ দিনের ব্যক্তিগত রুটিন
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* DROPDOWN 2: প্র্যাকটিস ল্যাব */}
            <div className="relative">
              <button
                id="nav-dropdown-practice"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'practice' ? null : 'practice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isPracticeActive
                    ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 shadow-2xs font-bold'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/70'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 opacity-80" />
                <span>প্র্যাকটিস ল্যাব</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'practice' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'practice' && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    Interactive Writing & Memory
                  </div>

                  <button
                    id="nav-item-hiragana-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('kana')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <PenTool className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        ৪৬ হিরাগানা রাইটিং ল্যাব
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        ভেক্টর স্ট্রোক অর্ডার ও টাচ ড্রয়িং
                      </div>
                    </div>
                  </button>

                  <button
                    id="nav-item-katakana-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('kana')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        ৪৬ কাতাকানা রাইটিং ল্যাব
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        বিদেশি শব্দ ও সম্পূর্ণ স্ট্রোক ডিরেকশন
                      </div>
                    </div>
                  </button>

                  <button
                    id="nav-item-kanji-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('kanji')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        ১০০ কানজি স্ট্রোক ল্যাব
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        ওন-কুনি রিডিং ও অ্যানিমেটেড স্ট্রোক
                      </div>
                    </div>
                  </button>

                  <button
                    id="nav-item-srs-flashcards"
                    type="button"
                    onClick={() => handleDropdownSelect('study-plan')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <Layers className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        এসআরএস ফ্ল্যাশকার্ড (SRS Flashcards)
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        স্পেসড রিপিটেশন ভোকাভুলারি রিভিশন
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 3: জেএলপিটি মক টেস্ট (DIRECT TAB) */}
            <button
              id="nav-tab-mock-exams"
              type="button"
              onClick={() => handleDropdownSelect('mock-exams')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isMockActive
                  ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 shadow-2xs font-bold'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/70'
              }`}
              title="১৮০ মার্কসের অফিশিয়াল সিমুলেটর ও সার্টিফিকেট"
            >
              <Award className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>জেএলপিটি মক টেস্ট</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full font-mono font-bold">
                ১৮০ মার্কস
              </span>
            </button>

            {/* DROPDOWN 4: ক্যারিয়ার ও লাইফস্টাইল */}
            <div className="relative">
              <button
                id="nav-dropdown-career"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'career' ? null : 'career')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCareerActive
                    ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 shadow-2xs font-bold'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/70'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 opacity-80" />
                <span>ক্যারিয়ার ও লাইফস্টাইল</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'career' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'career' && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    Japan Relocation & Community
                  </div>

                  <button
                    id="nav-item-baito"
                    type="button"
                    onClick={() => handleDropdownSelect('baito')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        বাইতো ও ইন্টারভিউ প্রিপ (BaitoOS™)
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        টোকিও কনবিনি জব ও ভিসা ডিফেন্স সিমুলেশন
                      </div>
                    </div>
                  </button>

                  <button
                    id="nav-item-leaderboard"
                    type="button"
                    onClick={() => handleDropdownSelect('leaderboard')}
                    className="w-full px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800/80 text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                  >
                    <Flame className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        লিডারবোর্ড ও স্ট্রিক ড্যাশবোর্ড
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        দৈনিক XP র‍্যাংকিং ও স্টাডি স্ট্রিক
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* 3. RIGHT UTILITY: N5 PRO UNLOCK CTA + THEME + USER AVATAR + OFFLINE */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">
            {/* OFFLINE READY INDICATOR */}
            {isOfflineReady && (
              <div
                id="header-offline-ready-badge"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shadow-2xs"
                title="Service Worker Cached: Complete Offline Access"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">অফলাইন রেডি</span>
              </div>
            )}

            {/* N5 PRO UNLOCK CTA BUTTON (৳৪৯৯) */}
            <button
              id="header-btn-unlock-pro"
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow group-hover:rotate-12 transition-transform" />
              <span className="whitespace-nowrap">N5 Pro আনলক করুন (৳৪৯৯)</span>
            </button>

            {/* THEME TOGGLE */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                id="header-theme-toggle-btn"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'theme' ? null : 'theme')}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbb2] text-stone-700 dark:text-stone-300 text-xs font-medium hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer shadow-2xs"
                title={`Theme: ${theme.toUpperCase()}`}
              >
                <ActiveThemeIcon className="w-3.5 h-3.5 text-stone-600 dark:text-amber-400" />
                <span className="capitalize text-[11px] font-semibold">{theme}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {activeDropdown === 'theme' && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    থিম নির্বাচন করুন
                  </div>
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setTheme(opt.id);
                          setActiveDropdown(null);
                        }}
                        className={`w-full px-3 py-2 text-left font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold'
                            : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOUNDER COMMAND SHORTCUT */}
            {isFounder && (
              <button
                type="button"
                onClick={() => onNavigate('founder')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Founder Command Center"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Command</span>
              </button>
            )}

            {/* USER PROFILE AVATAR / SIGN IN */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  id="header-user-avatar-btn"
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                  className="flex items-center space-x-2 p-1 pl-2.5 pr-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>

                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-stone-950 dark:bg-white text-white dark:text-stone-950 text-[10px] font-bold flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {activeDropdown === 'user' && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center space-x-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-stone-950 dark:bg-white text-white dark:text-stone-950 font-bold text-sm flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDropdownSelect('portal')}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>স্টুডেন্ট ড্যাশবোর্ড (Dashboard)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDropdownSelect('leaderboard')}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>কমিউনিটি লিডারবোর্ড</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDropdownSelect('credits')}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      <span>নিহোমি কয়েন ও সাবস্ক্রিপশন</span>
                    </button>

                    {isFounder && (
                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('founder')}
                        className="w-full px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-left font-bold flex items-center space-x-2 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Founder Command Center</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        logout();
                      }}
                      className="w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>লগআউট (Sign Out)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="px-4 py-1.5 bg-stone-950 dark:bg-white text-white dark:text-stone-950 hover:bg-stone-800 rounded-full text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                লগইন / সাইন আপ
              </button>
            )}
          </div>

          {/* 4. MOBILE CONTROLS (HAMBURGER & COMPACT TOGGLE) */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile N5 Pro CTA button */}
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>৳৪৯৯</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => onNavigate('portal')}
                className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700 flex items-center justify-center cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-950 text-white text-xs font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="px-2.5 py-1 bg-stone-950 dark:bg-white text-white dark:text-stone-950 rounded-full text-xs font-bold"
              >
                লগইন
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. MOBILE ACCORDION DRAWER (MUJI MINIMALIST GROUPED ACCORDIONS) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-3 text-xs animate-in slide-in-from-top-2">
          
          {/* Mobile Group 1: কারিকুলাম ও লিসেনিং */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-stone-900/50">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'curriculum' ? null : 'curriculum')}
              className="w-full px-4 py-3 font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>কারিকুলাম ও লিসেনিং</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'curriculum' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'curriculum' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('curriculum')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>মিন্না নো নিহোঙ্গো ১–২৫ লেসন</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('listening-lab')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>লিসেনিং অডিও ল্যাব (Choukai)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('study-plan')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>এন৫ রোডম্যাপ ও গাইডলাইন</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 2: প্র্যাকটিস ল্যাব */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-stone-900/50">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'practice' ? null : 'practice')}
              className="w-full px-4 py-3 font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-rose-500" />
                <span>প্র্যাকটিস ল্যাব</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'practice' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'practice' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kana')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>৪৬ হিরাগানা রাইটিং ল্যাব</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kana')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>৪৬ কাতাকানা রাইটিং ল্যাব</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kanji')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>১০০ কানজি স্ট্রোক ল্যাব</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('study-plan')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>এসআরএস ফ্ল্যাশকার্ড (SRS Review)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Tab 3: জেএলপিটি মক টেস্ট */}
          <button
            type="button"
            onClick={() => handleDropdownSelect('mock-exams')}
            className={`w-full p-3.5 rounded-2xl font-bold flex items-center justify-between border ${
              isMockActive
                ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 border-transparent'
                : 'bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-red-500" />
              <span>১৮০ মার্কসের জেএলপিটি মক টেস্ট</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-mono font-bold">
              সার্টিফিকেট
            </span>
          </button>

          {/* Mobile Group 4: ক্যারিয়ার ও লাইফস্টাইল */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white/50 dark:bg-stone-900/50">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'career' ? null : 'career')}
              className="w-full px-4 py-3 font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>ক্যারিয়ার ও লাইফস্টাইল</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'career' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'career' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('baito')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>বাইতো ও ইন্টারভিউ প্রিপ (BaitoOS™)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('leaderboard')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                >
                  <span>লিডারবোর্ড ও স্ট্রিক ড্যাশবোর্ড</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile N5 Pro Full CTA */}
          <button
            type="button"
            onClick={() => handleDropdownSelect('courses')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>N5 Pro আনলক করুন (৳৪৯৯) — লাইফটাইম অ্যাক্সেস</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
