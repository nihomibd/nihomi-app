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
  Compass,
  PenTool,
  Award,
  ChevronRight,
  Flame,
  LayoutDashboard,
  Coins,
  Brain,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
  GraduationCap,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AppTheme } from '../../context/ThemeContext';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenDictionary?: () => void;
  onOpenShortcuts?: () => void;
}

type DropdownId = 'curriculum' | 'readiness' | 'kana_kanji' | 'theme' | 'user' | null;

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, progress, openAuthModal, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Server-authoritative role check
  const isFounder = user?.role === 'admin' || user?.role === 'founder';
  const streak = progress?.currentStreak ?? progress?.streakDays ?? user?.streakDays ?? 0;

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

  const handleDropdownSelect = (viewId: string, params?: Record<string, any>) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onNavigate(viewId, params);
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
    <header className="sticky top-0 z-50 w-full h-16 backdrop-blur-md bg-[#141726]/95 border-b border-[#F6F0E6]/10 text-[#F6F0E6] select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* 1. BRAND LOGO (Brand Guidelines v1.0) */}
          <button
            id="header-brand-logo"
            type="button"
            onClick={() => onNavigate(isFounder ? 'founder' : user ? 'dashboard' : 'landing')}
            className="flex items-center space-x-2.5 group cursor-pointer focus:outline-hidden shrink-0"
          >
            <NihomiBrandLogo variant="full" theme="dark" size={28} showTagline={false} />
            {isFounder ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-[10px] font-mono font-bold tracking-wider text-amber-300">
                <Crown className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                FOUNDER
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.12] text-[10px] font-mono font-bold tracking-wider text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                OS
              </span>
            )}
          </button>

          {/* 2. ROLE-BASED DESKTOP NAVIGATION */}
          <nav
            ref={navContainerRef}
            className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs"
          >
            {/* ============================================================ */}
            {/* ROLE A: FOUNDER / EXECUTIVE NAVIGATION                       */}
            {/* ============================================================ */}
            {isFounder ? (
              <>
                <button
                  id="nav-founder-command-center"
                  type="button"
                  onClick={() => onNavigate('founder')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'founder' || currentView === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>👑 Command Center</span>
                </button>

                <button
                  id="nav-founder-growth"
                  type="button"
                  onClick={() => onNavigate('growth')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'growth' || currentView === 'admin-growth'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Growth & Telemetry</span>
                </button>

                <button
                  id="nav-founder-content-studio"
                  type="button"
                  onClick={() => onNavigate('content-studio')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'content-studio'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Content Studio</span>
                </button>

                {/* Safe & Distinct Preview Student Experience Toggle */}
                <button
                  id="nav-founder-preview-student"
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white border border-white/[0.15] transition-all cursor-pointer"
                  title="Switch to Student Dashboard to inspect learner experience"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview Student</span>
                </button>
              </>
            ) : user ? (
              /* ============================================================ */
              /* ROLE B: AUTHENTICATED STUDENT NAVIGATION (9 CANONICAL)       */
              /* ============================================================ */
              <>
                {/* 1. শেখা (Home / Next Mission) */}
                <button
                  id="nav-student-dashboard"
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="শেখা (Home / Next Mission)"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-red-400" />
                  <span>শেখা</span>
                </button>

                {/* 2. পাঠ্যক্রম */}
                <button
                  id="nav-student-courses"
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'courses' || currentView === 'lesson'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="পাঠ্যক্রম (Minna no Nihongo ১–২৫)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                  <span>পাঠ্যক্রম</span>
                </button>

                {/* 3. Kana / Writing Canvas */}
                <button
                  id="nav-student-kana"
                  type="button"
                  onClick={() => onNavigate('kana')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'kana' || currentView === 'hiragana' || currentView === 'katakana'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="Kana ক্যানভাস (Writing Lab)"
                >
                  <PenTool className="w-3.5 h-3.5 text-purple-400" />
                  <span>Kana ক্যানভাস</span>
                </button>

                {/* 4. Kotoba Canvas™ (Visual Vocabulary) */}
                <button
                  id="nav-student-kotoba"
                  type="button"
                  onClick={() => onNavigate('kotoba')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'kotoba' || currentView === 'vocabulary'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="Kotoba Canvas™ (ভিজ্যুয়াল শব্দভাণ্ডার)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kotoba Canvas™</span>
                </button>

                {/* 5. Nihomi WorkOS™ (Real-Life Simulations) */}
                <button
                  id="nav-student-baito"
                  type="button"
                  onClick={() => onNavigate('baito')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'baito' || currentView === 'japan-twin'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="Nihomi WorkOS™ (বাস্তব জীবন সিমুলেশন)"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nihomi WorkOS™</span>
                </button>

                {/* 6. JLPT Mock */}
                <button
                  id="nav-student-mock-exams"
                  type="button"
                  onClick={() => onNavigate('mock-exams')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'mock-exams' || currentView === 'mock-exam-runner'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="JLPT মক টেস্ট (N5–N1)"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JLPT মক</span>
                </button>

                {/* 7. প্র্যাকটিস শিট ও নোটস */}
                <button
                  id="nav-student-documents"
                  type="button"
                  onClick={() => onNavigate('documents')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'documents'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="প্র্যাকটিস শিট PDF (Workbook Packs)"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>প্র্যাকটিস শিট</span>
                </button>

                {/* 8. আমার অগ্রগতি */}
                <button
                  id="nav-student-journey"
                  type="button"
                  onClick={() => onNavigate('journey')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    currentView === 'journey'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                  title="আমার অগ্রগতি (Learner Journey)"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>আমার অগ্রগতি</span>
                </button>
              </>
            ) : (
              /* ============================================================ */
              /* ROLE C: ANONYMOUS PUBLIC VISITOR                             */
              /* ============================================================ */
              <>
                <button
                  id="nav-public-world"
                  type="button"
                  onClick={() => onNavigate('world')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-amber-300 bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>নিহোমি ওয়ার্ল্ড™ (3D)</span>
                </button>

                <button
                  id="nav-public-courses"
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    currentView === 'courses'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                  <span>লেসন ও পাঠ্যক্রম</span>
                </button>

                <button
                  id="nav-public-japan-twin"
                  type="button"
                  onClick={() => onNavigate('japan-twin')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    currentView === 'japan-twin'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>জাপান প্রস্তুতি</span>
                </button>

                <button
                  id="nav-public-pricing"
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    currentView === 'pricing'
                      ? 'bg-white/[0.12] text-white border border-white/[0.18]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>সাবস্ক্রিপশন ও ফি</span>
                </button>
              </>
            )}
          </nav>

          {/* 3. RIGHT HEADER CONTROLS */}
          <div className="flex items-center space-x-2 shrink-0">
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
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>

              {activeDropdown === 'theme' && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/[0.12] shadow-xl p-1.5 z-50 text-xs text-white/80 animate-in fade-in zoom-in-95 duration-150">
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
                        className={`w-full px-2.5 py-1.5 rounded-xl text-left font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.12] text-white font-bold'
                            : 'hover:bg-white/[0.06] text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {renderThemeIcon(optId)}
                          <span className="capitalize text-[11px]">{optId}</span>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* IF AUTHENTICATED */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Coins / Subscription Pill for Students */}
                {!isFounder && (
                  <button
                    type="button"
                    onClick={() => onNavigate('subscription')}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                    title="Subscription & Coins"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>সাবস্ক্রিপশন</span>
                  </button>
                )}

                {/* Streak Counter for Students */}
                {!isFounder && streak > 0 && (
                  <div
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono font-bold"
                    title={`স্টাডি স্ট্রিক: ${streak} দিন`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/70 animate-pulse" />
                    <span>{streak}d</span>
                  </div>
                )}

                {/* Profile Dropdown */}
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
                            {isFounder ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                                👑 Founder / Admin
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 font-bold">
                                {user.planId === 'pro' ? 'Pro Member' : user.planId === 'japan_ready' ? 'Japan Ready' : 'Student'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Role-Specific Dropdown Items */}
                      {isFounder ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('founder')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-amber-500/15 text-left font-bold flex items-center space-x-2 text-amber-300 cursor-pointer"
                          >
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>Executive Command Center</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('growth')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Growth & Telemetry</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('content-studio')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Curriculum Studio</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('dashboard')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Preview Student Dashboard</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('dashboard')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-red-400" />
                            <span>লার্নার ড্যাশবোর্ড</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('profile')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <User className="w-3.5 h-3.5 text-white/60" />
                            <span>আমার প্রোফাইল ও সেটিংস</span>
                          </button>
                          <button
                            type="button"
                            id="nav-dropdown-student-mock-exams"
                            onClick={() => handleDropdownSelect('mock-exams')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-rose-400" />
                            <span>JLPT মক টেস্ট (Mock Exams)</span>
                          </button>
                          <button
                            type="button"
                            id="nav-dropdown-student-documents"
                            onClick={() => handleDropdownSelect('documents')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span>প্র্যাকটিস শিট PDF (Workbooks)</span>
                          </button>
                          <button
                            type="button"
                            id="nav-dropdown-student-cv-builder"
                            onClick={() => handleDropdownSelect('cv-builder')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                            <span>JIS সিভি বিল্ডার (CV Studio)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('subscription')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                            <span>সাবস্ক্রিপশন ও বিলিং</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDropdownSelect('leaderboard')}
                            className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left font-semibold flex items-center space-x-2 text-white/90 hover:text-white cursor-pointer"
                          >
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>কমিউনিটি লিডারবোর্ড</span>
                          </button>
                        </>
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
              /* ANONYMOUS RIGHT CTA */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="header-btn-login"
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-stone-300 hover:text-white rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap hover:bg-white/[0.08]"
                >
                  লগইন
                </button>
                <button
                  type="button"
                  id="header-btn-start-journey"
                  onClick={() => onNavigate('journey')}
                  className="px-4 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white rounded-full text-xs font-bold shadow-md shadow-red-600/25 transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                  <span>শুরু করুন</span>
                </button>
              </div>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/[0.08] cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 4. MOBILE DRAWER: ROLE-SPECIFIC FROSTED GLASS ACCORDION */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#141726]/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-2 pb-6 space-y-2 text-xs animate-in slide-in-from-top-2">
          {isFounder ? (
            /* FOUNDER MOBILE MENU */
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                👑 Founder / Executive Controls
              </div>
              <button
                type="button"
                onClick={() => handleDropdownSelect('founder')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 text-amber-300 font-bold text-left flex items-center justify-between"
              >
                <span>Executive Command Center</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('growth')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <span>Growth & Telemetry</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('content-studio')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <span>Curriculum Content Studio</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('dashboard')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-cyan-300 font-medium text-left flex items-center justify-between"
              >
                <span>Preview Student Dashboard</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 text-rose-300 font-bold text-left flex items-center justify-between mt-2"
              >
                <span>লগআউট (Sign Out)</span>
                <LogOut className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          ) : user ? (
            /* STUDENT MOBILE MENU (9 CANONICAL SURFACES) */
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                লার্নার নেভিগেশন (Canonical Navigation)
              </div>
              <button
                type="button"
                id="drawer-student-dashboard"
                onClick={() => handleDropdownSelect('dashboard')}
                className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 text-red-300 font-bold text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-red-400" />
                  <span>১. শেখা (Home / Next Mission)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
              <button
                type="button"
                id="drawer-student-courses"
                onClick={() => handleDropdownSelect('courses')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  <span>২. পাঠ্যক্রম (Minna no Nihongo ১–২৫)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                id="drawer-student-kana"
                onClick={() => handleDropdownSelect('kana')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-purple-400" />
                  <span>৩. Kana / Writing Canvas (বর্ণমালা)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                id="drawer-student-kotoba"
                onClick={() => handleDropdownSelect('kotoba')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-red-400 font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>৪. Kotoba Canvas™ (ভিজ্যুয়াল শব্দভাণ্ডার)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
              <button
                type="button"
                id="drawer-student-baito"
                onClick={() => handleDropdownSelect('baito')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-emerald-400 font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>৫. Nihomi WorkOS™ (বাস্তব সিমুলেশন)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                id="drawer-student-mock-exams"
                onClick={() => handleDropdownSelect('mock-exams')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-cyan-300 font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>৬. JLPT Mock (মক টেস্ট ইঞ্জিন)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                id="drawer-student-documents"
                onClick={() => handleDropdownSelect('documents')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-blue-300 font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>৭. প্র্যাকটিস শিট ও নোটস (PDF Workbooks)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                id="drawer-student-journey"
                onClick={() => handleDropdownSelect('journey')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>৮. আমার অগ্রগতি (Learner Journey)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                id="drawer-student-profile"
                onClick={() => handleDropdownSelect('profile')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-stone-300" />
                  <span>৯. Account / Settings (প্রোফাইল)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>

              <div className="border-t border-white/[0.08] my-2 pt-1" />

              {/* Secondary Utility Links */}
              <button
                type="button"
                id="drawer-student-cv-builder"
                onClick={() => handleDropdownSelect('cv-builder')}
                className="w-full py-2 px-3 rounded-xl hover:bg-white/[0.06] text-stone-300 text-left flex items-center justify-between"
              >
                <span>JIS সিভি বিল্ডার (CV Studio)</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </button>
              <button
                type="button"
                id="drawer-student-subscription"
                onClick={() => handleDropdownSelect('subscription')}
                className="w-full py-2 px-3 rounded-xl hover:bg-white/[0.06] text-amber-300 font-medium text-left flex items-center justify-between"
              >
                <span>সাবস্ক্রিপশন ও বিলিং</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 text-rose-300 font-bold text-left flex items-center justify-between mt-2"
              >
                <span>লগআউট (Sign Out)</span>
                <LogOut className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          ) : (
            /* ANONYMOUS MOBILE MENU */
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleDropdownSelect('world')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 text-amber-300 font-bold text-left flex items-center justify-between"
              >
                <span>নিহোমি ওয়ার্ল্ড™ (3D Canvas)</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('courses')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <span>লেসন ও পাঠ্যক্রম</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('kotoba')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-red-400 font-medium text-left flex items-center justify-between"
              >
                <span>কতোবা ক্যানভাস (Kotoba Canvas™)</span>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('japan-twin')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <span>জাপান প্রস্তুতি</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <button
                type="button"
                onClick={() => handleDropdownSelect('pricing')}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/[0.06] text-white font-medium text-left flex items-center justify-between"
              >
                <span>সাবস্ক্রিপশন ও ফি</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.08] text-white font-bold text-center"
                >
                  লগইন
                </button>
                <button
                  type="button"
                  onClick={() => handleDropdownSelect('journey')}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-center shadow-md shadow-red-600/30"
                >
                  শুরু করুন
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
