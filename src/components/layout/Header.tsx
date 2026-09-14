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
  MapPin,
  Phone,
  MessageSquare,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AppTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDictionary?: () => void;
  onOpenShortcuts?: () => void;
}

type DropdownId = 'curriculum' | 'readiness' | 'career' | 'pricing' | 'theme' | 'user' | null;

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, progress, openAuthModal, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<'curriculum' | 'readiness' | 'career' | 'pricing' | null>('curriculum');

  const navContainerRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isFounder = user?.role === 'founder' || user?.email === 'mdtanvirkabirbiplob@gmail.com';
  const streak = progress?.streakDays || progress?.currentStreak || user?.streakDays || 1;

  // Active Category Detection for the 4 core pillars
  const isCurriculumActive = ['curriculum', 'lesson', 'courses', 'kana', 'hiragana', 'katakana', 'kanji', 'kanji-100', 'kanji-lab', 'listening-lab', 'listening', 'kaiwa', 'choukai'].includes(currentView);
  const isReadinessActive = ['mock-exams', 'mock-exam-runner', 'mock-exam', 'mock-tests', 'baito', 'baito-os', 'study-plan', 'roadmap', 'quizzes', 'quiz-runner'].includes(currentView);
  const isCareerActive = ['coordination', 'portal', 'dashboard', 'interview', 'interview-lab', 'visa-guide', 'leaderboard', 'community'].includes(currentView);
  const isPricingActive = ['pricing', 'plans', 'contact', 'credits', 'subscription'].includes(currentView);

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

          {/* 2. DESKTOP NAVIGATION: STRICT 4-TAB APPLE MINIMALIST HEADER */}
          <nav
            ref={navContainerRef}
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            {/* TAB 1: কারিকুলাম ও শিক্ষা */}
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
                <span>কারিকুলাম ও শিক্ষা</span>
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
                    কারিকুলাম ও ফাউন্ডেশন
                  </div>

                  {/* 1. বর্ণমালা (Kana) */}
                  <button
                    id="nav-item-kana-lab"
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
                          বর্ণমালা (Kana Lab)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-500/10 text-rose-400 font-mono font-semibold">
                          ৪৬+৪৬ বর্ণ
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        হিরাগানা ও কাতাকানা স্ট্রোক অর্ডার ক্যানভাস
                      </p>
                    </div>
                  </button>

                  {/* 2. পাঠ্যক্রম (Minna no Nihongo 1-25) */}
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
                          পাঠ্যক্রম (Minna no Nihongo ১–২৫)
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

                  {/* 3. কাঞ্জি ল্যাব (Kanji Lab) */}
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
                          কাঞ্জি ল্যাব (Kanji Lab)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-400 font-mono font-semibold">
                          ১০০ কাঞ্জি
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        ওন-কুনিওমি ও স্টক ডিরেকশন ক্যানভাস
                      </p>
                    </div>
                  </button>

                  {/* 4. লিসেনিং ও উচ্চারণ (Listening Lab) */}
                  <button
                    id="nav-item-listening-lab"
                    type="button"
                    onClick={() => handleDropdownSelect('listening-lab')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20 group-hover/item:scale-105 transition-transform">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          লিসেনিং ও উচ্চারণ (Listening Lab)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-400 font-mono font-semibold">
                          Choukai
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        টোকিও নেটিভ ভয়েস ও কাইওয়া ডায়ালগ
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 2: পরীক্ষা ও প্রস্তুতি */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('readiness')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-tab-readiness"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'readiness' ? null : 'readiness')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isReadinessActive || activeDropdown === 'readiness'
                    ? 'bg-white/[0.12] text-white border border-white/[0.18] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span>পরীক্ষা ও প্রস্তুতি</span>
                <ChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                    activeDropdown === 'readiness' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'readiness' && (
                <div
                  className="absolute left-0 mt-2.5 w-80 sm:w-88 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/5"
                  onMouseEnter={() => handleMouseEnter('readiness')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    মক পরীক্ষা ও সিমুলেটর
                  </div>

                  {/* 1. মক টেস্ট ও কুইজ */}
                  <button
                    id="nav-item-mock-exams"
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
                          মক টেস্ট ও কুইজ (Mock Tests)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-red-500/10 text-red-400 font-mono font-semibold">
                          ১৮০ মার্কস
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        অফিশিয়াল জেএলপিটি ফরম্যাট ও রিয়েল টাইমার
                      </p>
                    </div>
                  </button>

                  {/* 2. বাইতোওএস™ সিমুলেটর */}
                  <button
                    id="nav-item-baito-sim"
                    type="button"
                    onClick={() => handleDropdownSelect('baito')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20 group-hover/item:scale-105 transition-transform">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          বাইতোওএস™ সিমুলেটর (BaitoOS™)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-400 font-mono font-semibold">
                          Tokyo Conbini
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        টোকিও ৭-ইলেভেন ও লসন ক্যাশিয়ার ডায়ালগ সিমুলেশন
                      </p>
                    </div>
                  </button>

                  {/* 3. রিটেনশন ও মেমোরি */}
                  <button
                    id="nav-item-memory-srs"
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
                          রিটেনশন ও মেমোরি (Memory SRS)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-400 font-mono font-semibold">
                          Spaced Rep
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        দৈনিক মিশন ও স্মার্ট স্পেসড রিভিশন সিস্টেম
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 3: জাপান ক্যারিয়ার */}
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
                <span>জাপান ক্যারিয়ার</span>
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
                    রিলোকেশন ও ক্যারিয়ার
                  </div>

                  {/* 1. ভিসা ও প্রস্তুতি গাইড */}
                  <button
                    id="nav-item-visa-guide"
                    type="button"
                    onClick={() => handleDropdownSelect('coordination')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 group-hover/item:scale-105 transition-transform">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          ভিসা ও প্রস্তুতি গাইড (Visa & Life)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                          Relocation
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        জাপান স্টুডেন্ট ভিসা ও স্পন্সর গাইডলাইন
                      </p>
                    </div>
                  </button>

                  {/* 2. জবসাইট ও ক্যারিয়ার */}
                  <button
                    id="nav-item-job-roadmap"
                    type="button"
                    onClick={() => handleDropdownSelect('portal')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/20 group-hover/item:scale-105 transition-transform">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          জবসাইট ও ক্যারিয়ার (Job Roadmap)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-500/10 text-sky-400 font-mono font-semibold">
                          Jobs
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        পার্ট-টাইম ও ফুল-টাইম জবের প্রস্তুতি ও ড্যাশবোর্ড
                      </p>
                    </div>
                  </button>

                  {/* 3. ইন্টারভিউ প্রস্তুতি */}
                  <button
                    id="nav-item-interview-prep"
                    type="button"
                    onClick={() => handleDropdownSelect('interview')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20 group-hover/item:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          ইন্টারভিউ প্রস্তুতি (Interview Prep)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-400 font-mono font-semibold">
                          AI Drill
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        ভিসা ও জব ইন্টারভিউ প্রশ্নোত্তর মহড়া
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 4: ফিচার ও অফার */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('pricing')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                id="nav-tab-pricing"
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'pricing' ? null : 'pricing')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isPricingActive || activeDropdown === 'pricing'
                    ? 'bg-white/[0.12] text-white border border-white/[0.18] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <span>ফিচার ও অফার</span>
                <ChevronDown
                  className={`w-3 h-3 text-white/50 transition-transform duration-200 ${
                    activeDropdown === 'pricing' ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'pricing' && (
                <div
                  className="absolute left-0 mt-2.5 w-80 sm:w-88 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/5"
                  onMouseEnter={() => handleMouseEnter('pricing')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    সাবস্ক্রিপশন ও যোগাযোগ
                  </div>

                  {/* 1. প্রিমিয়াম সাবস্ক্রিপশন */}
                  <button
                    id="nav-item-premium-pricing"
                    type="button"
                    onClick={() => handleDropdownSelect('pricing')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20 group-hover/item:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          প্রিমিয়াম সাবস্ক্রিপশন (Pricing)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                          ৳৪৯৯
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        সম্পূর্ণ N5 কোর্স ও আনলিমিটেড লাইফটাইম অ্যাক্সেস
                      </p>
                    </div>
                  </button>

                  {/* 2. হেল্পলাইন ও অফিস */}
                  <button
                    id="nav-item-support-contact"
                    type="button"
                    onClick={() => handleDropdownSelect('contact')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-left flex items-start gap-3 transition-all duration-150 group/item border border-transparent hover:border-white/[0.08] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 group-hover/item:scale-105 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90 group-hover/item:text-white transition-colors">
                          হেল্পলাইন ও অফিস (Support/Contact)
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                          01834348966
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 group-hover/item:text-white/70 line-clamp-1 transition-colors mt-0.5">
                        হোয়াটসঅ্যাপ হেল্পলাইন ও ফার্মগেট ঢাকা অফিস
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
          
          {/* Mobile Group 1: কারিকুলাম ও শিক্ষা */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'curriculum' ? null : 'curriculum')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-400" />
                <span>কারিকুলাম ও শিক্ষা</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'curriculum' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'curriculum' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kana')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">বর্ণমালা (Kana Lab)</div>
                    <div className="text-[10px] text-white/50">হিরাগানা ও কাতাকানা স্ট্রোক অর্ডার</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('curriculum')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">পাঠ্যক্রম (Minna no Nihongo ১–২৫)</div>
                    <div className="text-[10px] text-white/50">প্রতিটি অধ্যায়ের ব্যাকরণ ও শব্দভাণ্ডার</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('kanji')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">কাঞ্জি ল্যাব (Kanji Lab)</div>
                    <div className="text-[10px] text-white/50">১০০ মৌলিক কাঞ্জি ও ওন-কুনিওমি</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('listening-lab')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">লিসেনিং ও উচ্চারণ (Listening Lab)</div>
                    <div className="text-[10px] text-white/50">টোকিও নেটিভ অডিও ও কাইওয়া ডায়ালগ</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 2: পরীক্ষা ও প্রস্তুতি */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'readiness' ? null : 'readiness')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>পরীক্ষা ও প্রস্তুতি</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'readiness' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'readiness' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('mock-exams')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">মক টেস্ট ও কুইজ (Mock Tests)</div>
                    <div className="text-[10px] text-white/50">১৮০ মার্কস অফিশিয়াল ফরম্যাট ও সনদ</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('baito')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">বাইতোওএস™ সিমুলেটর (BaitoOS™)</div>
                    <div className="text-[10px] text-white/50">৭-ইলেভেন ক্যাশিয়ার ও কাস্টমার ডায়ালগ</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('study-plan')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">রিটেনশন ও মেমোরি (Memory SRS)</div>
                    <div className="text-[10px] text-white/50">দৈনিক মিশন ও স্পেসড রিভিশন</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 3: জাপান ক্যারিয়ার */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'career' ? null : 'career')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>জাপান ক্যারিয়ার</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'career' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'career' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('coordination')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">ভিসা ও প্রস্তুতি গাইড (Visa & Life)</div>
                    <div className="text-[10px] text-white/50">জাপান স্টুডেন্ট ভিসা ও স্পন্সর গাইড</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('portal')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">জবসাইট ও ক্যারিয়ার (Job Roadmap)</div>
                    <div className="text-[10px] text-white/50">পার্ট-টাইম ও ফুল-টাইম জবের প্রস্তুতি</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('interview')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">ইন্টারভিউ প্রস্তুতি (Interview Prep)</div>
                    <div className="text-[10px] text-white/50">ভিসা ও জব ইন্টারভিউ প্রশ্নোত্তর মহড়া</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Group 4: ফিচার ও অফার */}
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'pricing' ? null : 'pricing')}
              className="w-full px-4 py-3 font-bold text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>ফিচার ও অফার</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedGroup === 'pricing' ? 'rotate-180' : ''}`} />
            </button>

            {mobileExpandedGroup === 'pricing' && (
              <div className="px-3 pb-3 pt-1 space-y-1 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('pricing')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">প্রিমিয়াম সাবস্ক্রিপশন (Pricing)</div>
                    <div className="text-[10px] text-white/50">লাইফটাইম অ্যাক্সেস মাত্র ৳৪৯৯</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('contact')}
                  className="w-full py-2 px-3 rounded-xl text-left font-medium text-white/80 hover:text-white hover:bg-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">হেল্পলাইন ও অফিস (Support/Contact)</div>
                    <div className="text-[10px] text-white/50">01834348966 • BTI Central Plaza, Farmgate</div>
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
