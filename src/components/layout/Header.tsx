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
  ChevronRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AppTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDictionary?: () => void;
  onOpenShortcuts?: () => void;
}

type DropdownId = 'curriculum' | 'practice' | 'mocks' | 'career' | 'theme' | 'user' | null;

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, progress, openAuthModal, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<'curriculum' | 'practice' | 'mocks' | 'career' | null>('curriculum');

  const navContainerRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isFounder = user?.role === 'founder' || user?.email === 'mdtanvirkabirbiplob@gmail.com';
  const streak = progress?.streakDays || progress?.currentStreak || user?.streakDays || 1;

  // Active Category Detection
  const isCurriculumActive = ['curriculum', 'lesson', 'courses', 'listening-lab', 'listening', 'kaiwa', 'choukai', 'study-plan', 'roadmap'].includes(currentView);
  const isPracticeActive = ['kana', 'hiragana', 'katakana', 'kanji', 'kanji-100', 'kanji-lab'].includes(currentView);
  const isMockActive = ['mock-exams', 'mock-exam-runner', 'mock-exam', 'mock-tests'].includes(currentView);
  const isCareerActive = ['baito', 'baito-os', 'interview', 'leaderboard', 'community'].includes(currentView);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        navContainerRef.current && !navContainerRef.current.contains(target) &&
        themeDropdownRef.current && !themeDropdownRef.current.contains(target) &&
        userDropdownRef.current && !userDropdownRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Safe debounce for hover menus (Apple / Stripe standard)
  const handleMouseEnter = (id: DropdownId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

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

  const handleDropdownSelect = (viewId: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onNavigate(viewId);
  };

  const renderThemeIcon = (themeMode: AppTheme) => {
    switch (themeMode) {
      case 'light':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'dark':
        return <Moon className="w-3.5 h-3.5 text-blue-400" />;
      case 'sepia':
        return <BookOpen className="w-3.5 h-3.5 text-amber-600" />;
      case 'system':
      default:
        return <Laptop className="w-3.5 h-3.5 text-stone-300" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0a0a12]/80 border-b border-white/[0.08] text-white select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 1. BRAND LOGO: MINIMALIST RED SUN EMBLEM + HORIZONTAL NIHOMI (ニホミ) + OS BADGE */}
          <button
            id="header-brand-logo"
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 group cursor-pointer focus:outline-hidden shrink-0"
          >
            {/* Minimalist Red Sun Emblem */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25 ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-red-500/40 transition-all duration-200">
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
            </div>

            {/* Typography */}
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-red-400 transition-colors">
                NIHOMI
              </span>
              <span className="font-japanese text-xs font-semibold text-white/50 tracking-normal">
                (ニホミ)
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.12] text-[10px] font-mono font-bold tracking-wider text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                OS
              </span>
            </div>
          </button>

          {/* 2. DESKTOP NAVIGATION: 4 SLEEK PILL TABS WITH GENTLE CHEVRONS & STRIPE MEGA-DROPDOWNS */}
          <nav
            ref={navContainerRef}
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            {/* TAB 1: কারিকুলাম */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('curriculum')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-tab-curriculum"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'curriculum' ? null : 'curriculum')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isCurriculumActive || activeDropdown === 'curriculum'
                    ? 'bg-white/[0.12] text-white border border-white/[0.18] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span>কারিকুলাম</span>
                <ChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                    activeDropdown === 'curriculum' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'curriculum' && (
                <div
                  className="absolute left-0 mt-2.5 w-80 sm:w-88 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/5"
                  onMouseEnter={() => handleMouseEnter('curriculum')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    কোর্স ও স্টাডি মেটেরিয়াল
                  </div>

                  {/* Tile 1: Minna no Nihongo 1-25 */}
                  <button
                    id="nav-item-minna-lessons"
                    type="button"
                    onClick={() => handleDropdownSelect('curriculum')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 mt-0.5 border border-red-500/20 group-hover/item:scale-105 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          Minna no Nihongo ১–২৫
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-red-500/10 text-red-400 font-mono font-semibold">
                          ২৫ লেসন
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        প্রতিটি অধ্যায়ের ব্যাকরণ ও শব্দভাণ্ডার
                      </p>
                    </div>
                  </button>

                  {/* Tile 2: Listening Lab */}
                  <button
                    id="nav-item-listening-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('listening-lab')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20 group-hover/item:scale-105 transition-transform">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          লিসেনিং অডিও ল্যাব
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-400 font-mono font-semibold">
                          Choukai
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        টোকিও নেটিভ ভয়েস ও কাইওয়া ডায়ালগ
                      </p>
                    </div>
                  </button>

                  {/* Tile 3: Syllabus Roadmap */}
                  <button
                    id="nav-item-n5-roadmap"
                    type="button"
                    onClick={() => handleDropdownSelect('study-plan')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 group-hover/item:scale-105 transition-transform">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          এন৫ সিলেবাস রোডম্যাপ
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                          ৬০-৯০ দিন
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        ৬০-৯০ দিনের কমপ্লিট স্টাডি প্ল্যান
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 2: প্র্যাকটিস ল্যাব */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('practice')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-tab-practice"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'practice' ? null : 'practice')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isPracticeActive || activeDropdown === 'practice'
                    ? 'bg-white/[0.12] text-white border border-white/[0.18] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span>প্র্যাকটিস ল্যাব</span>
                <ChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                    activeDropdown === 'practice' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'practice' && (
                <div
                  className="absolute left-0 mt-2.5 w-84 sm:w-92 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/5"
                  onMouseEnter={() => handleMouseEnter('practice')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    রাইটিং ক্যানভাস ও মেমোরি সিস্টেম
                  </div>

                  {/* Tile 1: Hiragana Lab */}
                  <button
                    id="nav-item-hiragana-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('kana')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20 group-hover/item:scale-105 transition-transform">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          ৪৬ হিরাগানা ল্যাব
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-500/10 text-rose-400 font-mono font-semibold">
                          Canvas
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        অ্যানিমেটেড স্ট্রোক অর্ডার ও ক্যানভাস
                      </p>
                    </div>
                  </button>

                  {/* Tile 2: Katakana Lab */}
                  <button
                    id="nav-item-katakana-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('kana')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/20 group-hover/item:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          ৪৬ কাতাকানা ল্যাব
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-500/10 text-sky-400 font-mono font-semibold">
                          Vector
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        ভেক্টর গাইড ও রাইটিং টেস্ট
                      </p>
                    </div>
                  </button>

                  {/* Tile 3: 100 Kanji Lab */}
                  <button
                    id="nav-item-kanji-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('kanji')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20 group-hover/item:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          ১০০ কানজি ল্যাব
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-400 font-mono font-semibold">
                          ১০০ কানজি
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        ওন-কুনিওমি ও স্টক ডিরেকশন
                      </p>
                    </div>
                  </button>

                  {/* Tile 4: SRS Flashcards */}
                  <button
                    id="nav-item-srs-flashcards"
                    type="button"
                    onClick={() => handleDropdownSelect('study-plan')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/20 group-hover/item:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          এসআরএস ফ্ল্যাশকার্ড
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-400 font-mono font-semibold">
                          Spaced
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        স্মার্ট মেমোরি রিটেনশন
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 3: জেএলপিটি মক টেস্ট */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('mocks')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-tab-mock-exams"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'mocks' ? null : 'mocks')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isMockActive || activeDropdown === 'mocks'
                    ? 'bg-white/[0.12] text-white border border-white/[0.18] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span>জেএলপিটি মক টেস্ট</span>
                <ChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                    activeDropdown === 'mocks' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'mocks' && (
                <div
                  className="absolute left-0 mt-2.5 w-80 sm:w-88 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/5"
                  onMouseEnter={() => handleMouseEnter('mocks')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    অফিশিয়াল ফরম্যাট ও সিমুলেটর
                  </div>

                  {/* Tile 1: 180 Marks Official Mock */}
                  <button
                    id="nav-item-full-mock"
                    type="button"
                    onClick={() => handleDropdownSelect('mock-exams')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 mt-0.5 border border-red-500/20 group-hover/item:scale-105 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          ১৮০ মার্কস অফিশিয়াল মক টেস্ট
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-red-500/10 text-red-400 font-mono font-semibold">
                          সার্টিফিকেট
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        টাইমার ও রিয়েল-টাইম স্কোরিং
                      </p>
                    </div>
                  </button>

                  {/* Tile 2: Sectional Practice */}
                  <button
                    id="nav-item-sectional-practice"
                    type="button"
                    onClick={() => handleDropdownSelect('mock-exams')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20 group-hover/item:scale-105 transition-transform">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          সেকশন-ভিত্তিক প্র্যাকটিস
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-400 font-mono font-semibold">
                          Sectional
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        ভোকাবুলারি, ব্যাকরণ ও চৌকাই
                      </p>
                    </div>
                  </button>

                  {/* Tile 3: Performance Analytics */}
                  <button
                    id="nav-item-performance-analytics"
                    type="button"
                    onClick={() => handleDropdownSelect('mock-exams')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 group-hover/item:scale-105 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          পারফরম্যান্স অ্যানালিটিক্স
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                          Scorecard
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        দুর্বল টপিক চিহ্নিতকরণ ও স্কোরকার্ড
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 4: ক্যারিয়ার */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('career')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-tab-career"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'career' ? null : 'career')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isCareerActive || activeDropdown === 'career'
                    ? 'bg-white/[0.12] text-white border border-white/[0.18] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span>ক্যারিয়ার</span>
                <ChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                    activeDropdown === 'career' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'career' && (
                <div
                  className="absolute left-0 mt-2.5 w-80 sm:w-88 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/5"
                  onMouseEnter={() => handleMouseEnter('career')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    জাপান রিলোকেশন ও কমিউনিটি
                  </div>

                  {/* Tile 1: BaitoOS Simulator */}
                  <button
                    id="nav-item-baito"
                    type="button"
                    onClick={() => handleDropdownSelect('baito')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20 group-hover/item:scale-105 transition-transform">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          BaitoOS™ কনবিনি সিমুলেটর
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-400 font-mono font-semibold">
                          Tokyo Job
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        টোকিও কনবিনি জব ও ভিসা ডিফেন্স সিমুলেশন
                      </p>
                    </div>
                  </button>

                  {/* Tile 2: Leaderboard */}
                  <button
                    id="nav-item-leaderboard"
                    type="button"
                    onClick={() => handleDropdownSelect('leaderboard')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20 group-hover/item:scale-105 transition-transform">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          লিডারবোর্ড ও স্টুডেন্ট র্যাংকিং
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-400 font-mono font-semibold">
                          Daily XP
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        দৈনিক XP ও স্টাডি স্ট্রিক র‍্যাঙ্কিং
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* 3. RIGHT UTILITY: GEMINI STYLE N5 PRO CTA + THEME + PROFILE */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">

            {/* Offline Ready Badge (Service worker indicator) */}
            {isOfflineReady && (
              <div
                id="header-offline-ready-badge"
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold"
                title="Service Worker Cached: Complete Offline Access"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <Wifi className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">অফলাইন</span>
              </div>
            )}

            {/* GEMINI STYLE GLOWING GOLDEN-GRADIENT CTA PILL */}
            <button
              id="header-btn-unlock-pro"
              type="button"
              onClick={() => onNavigate('courses')}
              className="relative group overflow-hidden px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 hover:from-amber-500/30 hover:via-orange-500/30 hover:to-rose-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
              <span className="whitespace-nowrap font-semibold">N5 Pro আনলক ৳৪৯৯</span>
            </button>

            {/* THEME TOGGLE */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                id="header-theme-toggle-btn"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'theme' ? null : 'theme')}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white/80 text-xs font-medium transition-all cursor-pointer"
                title={`Theme: ${theme.toUpperCase()}`}
              >
                {renderThemeIcon(theme)}
                <span className="capitalize text-[11px] font-semibold text-white/90">{theme}</span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>

              {activeDropdown === 'theme' && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-xl p-1.5 z-50 text-xs text-white/80 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    থিম নির্বাচন করুন
                  </div>
                  {(['system', 'light', 'dark', 'sepia'] as AppTheme[]).map((optId) => {
                    const isSelected = theme === optId;
                    return (
                      <button
                        key={optId}
                        type="button"
                        onClick={() => {
                          setTheme(optId);
                          setActiveDropdown(null);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.12] text-white font-bold'
                            : 'hover:bg-white/[0.06] text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {renderThemeIcon(optId)}
                          <span className="capitalize">{optId}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
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
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Founder Command Center"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Command</span>
              </button>
            )}

            {/* DYNAMIC STUDENT PROFILE WITH ACTIVE STREAK FLAME COUNTER */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Active Streak Flame Counter */}
                <div
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono font-bold"
                  title={`স্টাডি স্ট্রিক: ${streak} দিন`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/70 animate-pulse" />
                  <span>{streak}d</span>
                </div>

                {/* Profile Dropdown Trigger */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    id="header-user-avatar-btn"
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                    className="flex items-center space-x-2 p-1 pl-2.5 pr-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-white max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>

                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-1 ring-white/20">
                        {user.name.charAt(0)}
                      </div>
                    )}

                    <ChevronDown className="w-3 h-3 text-white/50" />
                  </button>

                  {activeDropdown === 'user' && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl p-2 z-50 text-xs text-white/80 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-white/[0.08] flex items-center space-x-3 mb-1">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white font-bold text-sm flex items-center justify-center ring-1 ring-white/20">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="font-bold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-white/50 font-mono truncate">{user.email}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 font-bold">
                              {user.planId === 'pro' ? 'N5 Pro Plan' : 'Student Member'}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300 font-mono font-bold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" />
                              {streak}d
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('portal')}
                        className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-white/60" />
                        <span>স্টুডেন্ট ড্যাশবোর্ড</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('leaderboard')}
                        className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>কমিউনিটি লিডারবোর্ড</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDropdownSelect('credits')}
                        className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        <span>নিহোমি কয়েন ও সাবস্ক্রিপশন</span>
                      </button>

                      {isFounder && (
                        <button
                          type="button"
                          onClick={() => handleDropdownSelect('founder')}
                          className="w-full px-3 py-2 rounded-xl hover:bg-amber-500/20 text-amber-300 text-left font-bold flex items-center space-x-2 cursor-pointer"
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <span>Founder Command Center</span>
                        </button>
                      )}

                      <div className="border-t border-white/[0.08] my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          logout();
                        }}
                        className="w-full px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-300 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>লগআউট (Sign Out)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="px-4 py-1.5 bg-white text-stone-950 hover:bg-white/90 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                লগইন / সাইন আপ
              </button>
            )}
          </div>

          {/* 4. MOBILE CONTROLS (HAMBURGER & COMPACT CTA) */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile N5 Pro CTA button */}
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-bold shadow-xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>৳৪৯৯</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => onNavigate('portal')}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex items-center justify-center cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-rose-600 to-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="px-3 py-1 bg-white text-stone-950 rounded-full text-xs font-bold"
              >
                লগইন
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/[0.08] cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. MOBILE DRAWER: FLUID ACCORDIONS WITH MINIMALIST FROSTED GLASS */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a12]/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-2 pb-6 space-y-2.5 text-xs animate-in slide-in-from-top-2">
          
          {/* Mobile Group 1: কারিকুলাম */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'curriculum' ? null : 'curriculum')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-400" />
                <span>কারিকুলাম</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'curriculum' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'curriculum' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('curriculum')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Minna no Nihongo ১–২৫</div>
                    <div className="text-[10px] text-white/50">প্রতিটি অধ্যায়ের ব্যাকরণ ও শব্দভাণ্ডার</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('listening-lab')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">লিসেনিং অডিও ল্যাব</div>
                    <div className="text-[10px] text-white/50">টোকিও নেটিভ ভয়েস ও কাইওয়া ডায়ালগ</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('study-plan')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">এন৫ সিলেবাস রোডম্যাপ</div>
                    <div className="text-[10px] text-white/50">৬০-৯০ দিনের কমপ্লিট স্টাডি প্ল্যান</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 2: প্র্যাকটিস ল্যাব */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'practice' ? null : 'practice')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-rose-400" />
                <span>প্র্যাকটিস ল্যাব</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'practice' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'practice' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kana')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">৪৬ হিরাগানা ল্যাব</div>
                    <div className="text-[10px] text-white/50">অ্যানিমেটেড স্ট্রোক অর্ডার ও ক্যানভাস</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kana')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">৪৬ কাতাকানা ল্যাব</div>
                    <div className="text-[10px] text-white/50">ভেক্টর গাইড ও রাইটিং টেস্ট</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kanji')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">১০০ কানজি ল্যাব</div>
                    <div className="text-[10px] text-white/50">ওন-কুনিওমি ও স্টক ডিরেকশন</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('study-plan')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">এসআরএস ফ্ল্যাশকার্ড</div>
                    <div className="text-[10px] text-white/50">স্মার্ট মেমোরি রিটেনশন</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 3: জেএলপিটি মক টেস্ট */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'mocks' ? null : 'mocks')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>জেএলপিটি মক টেস্ট</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'mocks' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'mocks' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('mock-exams')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">১৮০ মার্কস অফিশিয়াল মক টেস্ট</div>
                    <div className="text-[10px] text-white/50">পূর্ণাঙ্গ এন৫ পরীক্ষার রিয়েল সিমুলেশন</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('mock-exams')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">সেকশন-ভিত্তিক প্র্যাকটিস</div>
                    <div className="text-[10px] text-white/50">ভোকাবুলারি, ব্যাকরণ ও চৌকাই</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('mock-exams')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">পারফরম্যান্স অ্যানালিটিক্স</div>
                    <div className="text-[10px] text-white/50">দুর্বল টপিক চিহ্নিতকরণ ও স্কোরকার্ড</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 4: ক্যারিয়ার */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'career' ? null : 'career')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>ক্যারিয়ার</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'career' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'career' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('baito')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">BaitoOS™ কনবিনি সিমুলেটর</div>
                    <div className="text-[10px] text-white/50">টোকিও কনবিনি জব ও ভিসা ডিফেন্স</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('leaderboard')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">লিডারবোর্ড ও স্টুডেন্ট র্যাংকিং</div>
                    <div className="text-[10px] text-white/50">দৈনিক XP ও স্টাডি স্ট্রিক</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile N5 Pro CTA Button */}
          <button
            type="button"
            onClick={() => handleDropdownSelect('courses')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-rose-500/30 border border-amber-400/40 text-amber-200 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>N5 Pro আনলক করুন (৳৪৯৯) — লাইফটাইম অ্যাক্সেস</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
