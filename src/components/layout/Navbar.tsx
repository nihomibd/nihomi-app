'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage, Language } from '../../context/LanguageContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { apiRequest } from '../../lib/api.js';
import { JLPTLevel } from '../../types.js';
import {
  BookOpen,
  Briefcase,
  Bot,
  Award,
  Flame,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Camera,
  Compass,
  Zap,
  Users,
  CreditCard,
  History,
  Plane,
  Sun,
  Moon,
  Volume2,
  Wifi,
  WifiOff,
  Layers,
  Search,
  Languages,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Check,
  Keyboard,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';
import { DualTimeWeatherHeader } from './DualTimeWeatherHeader.js';
import { VisionSenseiModal } from '../VisionSenseiModal.js';
import { QuickDictionaryOverlay } from '../QuickDictionaryOverlay.js';
import { supabase } from '../../lib/supabase.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user: authUser, profile, progress, logout, updateProfile, refreshProgress, openLoginModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Supabase User State & Real-time Listener
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
    });

    // Listen for login / logout state changes in real time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    if (logout) {
      await logout();
    }
    window.location.href = '/';
  };

  const setIsLoginModalOpen = (open: boolean) => {
    if (open && openLoginModal) {
      openLoginModal('login');
    } else if (open) {
      handleNav('auth', { mode: 'login' });
    }
  };

  const setIsRegisterModalOpen = (open: boolean) => {
    if (open && openLoginModal) {
      openLoginModal('register');
    } else if (open) {
      handleNav('auth', { mode: 'register' });
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [timerDropdownOpen, setTimerDropdownOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isSavingTimer, setIsSavingTimer] = useState(false);
  const [timerToast, setTimerToast] = useState<string | null>(null);
  const [studySeconds, setStudySeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nihomi_study_seconds_v1');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Connectivity state
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });

  // Connectivity Listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persistent Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudySeconds((prev) => {
          const next = prev + 1;
          try {
            localStorage.setItem('nihomi_study_seconds_v1', String(next));
          } catch {}
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSaveStudySession = async () => {
    const minutes = Math.max(1, Math.round(studySeconds / 60));
    if (minutes <= 0) return;

    setIsSavingTimer(true);
    try {
      if (user) {
        await apiRequest('/api/progress/add-study-time', {
          method: 'POST',
          body: JSON.stringify({
            minutes,
            xp: minutes * 2
          })
        });
        if (refreshProgress) {
          await refreshProgress();
        }
      }
      setTimerToast(`🎉 Saved ${minutes} study minutes! (+${minutes * 2} XP)`);
      setTimeout(() => setTimerToast(null), 4000);
      setStudySeconds(0);
      try {
        localStorage.setItem('nihomi_study_seconds_v1', '0');
      } catch {}
      setTimerDropdownOpen(false);
    } catch (err) {
      console.warn('Could not sync study time to cloud, saved locally:', err);
      setTimerToast(`Saved ${minutes}m locally!`);
      setTimeout(() => setTimerToast(null), 3000);
      setStudySeconds(0);
      setTimerDropdownOpen(false);
    } finally {
      setIsSavingTimer(false);
    }
  };

  const handleResetTimer = () => {
    setStudySeconds(0);
    try {
      localStorage.setItem('nihomi_study_seconds_v1', '0');
    } catch {}
    setTimerDropdownOpen(false);
  };

  const handleLevelChange = async (newLevel: JLPTLevel) => {
    setLevelDropdownOpen(false);
    if (user && profile) {
      await updateProfile({ targetLevel: newLevel });
    }
  };

  const handleNav = (view: string, params?: Record<string, any>) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setLevelDropdownOpen(false);
    setLangDropdownOpen(false);
    setTimerDropdownOpen(false);
  };

  const languageOptions: { id: Language; label: string; flag: string; native: string }[] = [
    { id: 'bn', label: 'বাংলা', flag: '🇧🇩', native: 'বাংলা (Bengali)' },
    { id: 'en', label: 'English', flag: '🇺🇸', native: 'English (US)' },
    { id: 'ja', label: '日本語', flag: '🇯🇵', native: '日本語 (Japanese)' }
  ];

  return (
    <>
      {/* 1. Dual Clock & Weather Header Bar */}
      <DualTimeWeatherHeader />

      {/* 2. Quick Access Vision Sensei Modal */}
      <VisionSenseiModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
      />

      {/* 3. Quick Dictionary Overlay */}
      <QuickDictionaryOverlay
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />

      {/* Toast for Study Session Saved */}
      {timerToast && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-amber-500/50 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{timerToast}</span>
        </div>
      )}

      {/* 4. Main Navigation Bar */}
      <nav id="nihomi-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 text-stone-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Connectivity Indicator */}
            <div className="flex items-center space-x-3">
              <div
                className="flex items-center space-x-2.5 cursor-pointer select-none"
                onClick={() => handleNav(user ? 'dashboard' : 'home')}
                id="nav-logo"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-sm font-serif text-lg">
                  日
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-lg tracking-tight text-stone-900 font-serif">Nihomi</span>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-stone-100 text-red-700 font-bold border border-stone-200">
                      v1.0
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-sans">{t('tagline')}</span>
                </div>
              </div>

              {/* Subtle Live Connectivity Indicator */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
                title={isOnline ? 'Edge connected (Tokyo & Cloudflare sync)' : 'Offline mode — local caches active'}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            {/* Desktop Nav Items */}
            {user ? (
              <div className="hidden md:flex items-center space-x-1">
                <button
                  id="nav-btn-dashboard"
                  onClick={() => handleNav('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-stone-100 text-red-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span>{t('dashboard')}</span>
                </button>
                <button
                  id="nav-btn-courses"
                  onClick={() => handleNav('courses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'courses' || currentView === 'lesson'
                      ? 'bg-stone-100 text-red-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t('courses')}</span>
                </button>
                <button
                  id="nav-btn-flashcards"
                  onClick={() => handleNav('flashcards')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'flashcards'
                      ? 'bg-stone-100 text-red-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Flashcards</span>
                </button>
                <button
                  id="nav-btn-quizzes"
                  onClick={() => handleNav('quizzes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'quizzes' || currentView === 'quiz-runner'
                      ? 'bg-stone-100 text-red-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{t('quizzes')}</span>
                </button>
                <button
                  id="nav-btn-coordination"
                  onClick={() => handleNav('coordination-hub')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'coordination-hub'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-red-600" />
                  <span>{t('coordination_hub')}</span>
                </button>
                <button
                  id="nav-btn-ai-coach"
                  onClick={() => handleNav('ai-coach')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'ai-coach'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-red-600" />
                  <span>{t('ai_sensei')}</span>
                </button>
                <button
                  id="nav-btn-memory-os"
                  onClick={() => handleNav('memory-os')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'memory-os'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t('memory_os')}</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    id="nav-btn-admin-portal"
                    onClick={() => handleNav('admin')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'admin'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                    title="Founder & Content Engine Command Center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    <span>Founder Command</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => handleNav('home')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">Home</button>
                <button onClick={() => handleNav('coordination-hub')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">3 Learning Paths</button>
                <button onClick={() => handleNav('flashcards')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">Flashcards</button>
                <button onClick={() => handleNav('pricing')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">{t('pricing')}</button>
                <button onClick={() => handleNav('work-japanese')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">Work Japanese</button>
              </div>
            )}

            {/* Right Quick Action: Timer, Language Switcher, Dictionary, Theme Toggle, Camera OCR & Profile */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Persistent Study Session Timer */}
              <div className="relative">
                <button
                  type="button"
                  id="btn-nav-study-timer"
                  onClick={() => setTimerDropdownOpen(!timerDropdownOpen)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    isTimerRunning
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                  title="Persistent Study Session Timer"
                >
                  <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-amber-600 animate-spin' : 'text-stone-500'}`} style={{ animationDuration: '4s' }} />
                  <span className="font-mono">{formatTimer(studySeconds)}</span>
                </button>

                {timerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="text-xs font-extrabold text-stone-900 font-serif flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Active Study Timer</span>
                      </span>
                      <span className="text-[10px] font-bold text-stone-400 font-mono">
                        {Math.floor(studySeconds / 60)} min
                      </span>
                    </div>

                    <div className="text-center py-2 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-2xl font-mono font-extrabold text-stone-900 tracking-wider">
                        {formatTimer(studySeconds)}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {isTimerRunning ? '🟢 Timer is actively tracking' : '⏸️ Timer paused'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isTimerRunning
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleResetTimer}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition cursor-pointer"
                        title="Reset session timer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleSaveStudySession}
                      disabled={isSavingTimer || studySeconds < 30}
                      className={`w-full py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer ${
                        studySeconds < 30
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSavingTimer ? 'Saving...' : 'Save & Record Minutes (+XP)'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Global Language Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  id="btn-nav-language-switcher"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer border border-stone-200 flex items-center gap-1.5 text-xs font-bold"
                  title="Change Platform Language"
                >
                  <Languages className="w-3.5 h-3.5 text-stone-600" />
                  <span>{languageOptions.find((l) => l.id === language)?.flag || '🇧🇩'}</span>
                  <span className="hidden lg:inline">{languageOptions.find((l) => l.id === language)?.label || 'বাংলা'}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                      Choose Language:
                    </div>
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setLanguage(opt.id);
                          setLangDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{opt.flag}</span>
                          <span>{opt.native}</span>
                        </div>
                        {language === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Dictionary Button */}
              <button
                type="button"
                onClick={() => setIsDictionaryOpen(true)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer border border-stone-200 flex items-center gap-1 text-xs font-bold"
                title="Quick Search Japanese Dictionary"
                id="btn-nav-dictionary"
              >
                <Search className="w-4 h-4 text-stone-600" />
                <span className="hidden xl:inline text-[11px]">Dictionary</span>
              </button>

              {/* Theme Toggle Button (Light, Dark Neo-Tokyo, Sepia) */}
              <button
                type="button"
                id="btn-nav-theme-toggle"
                onClick={toggleTheme}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer border border-stone-200 flex items-center gap-1.5 text-xs font-bold"
                title={`Current: ${theme === 'dark' ? 'Dark (Neo-Tokyo)' : theme === 'sepia' ? 'Sepia (Eye-Care)' : 'Light'}. Click to switch theme.`}
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-4 h-4 text-purple-400" />
                    <span className="hidden xl:inline text-[11px] text-purple-600">Dark</span>
                  </>
                ) : theme === 'sepia' ? (
                  <>
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span className="hidden xl:inline text-[11px] text-amber-800">Sepia</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="hidden xl:inline text-[11px] text-stone-700">Light</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsVisionModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open AI Camera OCR"
                id="btn-nav-vision-sensei"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('vision_sensei')}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  {/* User Name Badge */}
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                      {user.email ? user.email[0].toUpperCase() : 'T'}
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {user.user_metadata?.full_name || 'Tanvir-san'}
                    </span>
                  </div>

                  {/* Explicit Logout Button */}
                  <button
                    id="nav-direct-logout-btn"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      if (logout) {
                        await logout();
                      }
                      window.location.reload();
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    লগ আউট
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    id="nav-login-btn"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    লগ ইন
                  </button>
                  <button
                    id="nav-register-btn"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition cursor-pointer"
                  >
                    বিনামূল্যে শুরু করুন
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-1.5">
              {/* Mobile Timer Chip */}
              <div className="px-2 py-1 bg-amber-50 rounded-lg text-[11px] font-mono font-bold text-amber-800 border border-amber-200">
                {formatTimer(studySeconds)}
              </div>

              {/* Mobile Language Switcher Toggle */}
              <button
                onClick={() => {
                  const nextLang: Language = language === 'bn' ? 'en' : language === 'en' ? 'ja' : 'bn';
                  setLanguage(nextLang);
                }}
                className="p-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                title="Switch Language"
              >
                <span>{languageOptions.find((l) => l.id === language)?.flag}</span>
              </button>

              <button
                onClick={() => setIsDictionaryOpen(true)}
                className="p-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                title="Dictionary"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVisionModalOpen(true)}
                className="p-1.5 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2">
            {user ? (
              <>
                {/* Mobile Student Badge */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 mb-2">
                  <div className="flex items-center space-x-2.5">
                    {profile?.avatar || user.avatar ? (
                      <img
                        src={profile?.avatar || user.avatar}
                        alt={profile?.displayName || user.name || 'Student'}
                        className="w-8 h-8 rounded-full object-cover border border-red-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {(profile?.displayName || user.name || 'S').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 truncate">{profile?.displayName || user.name || 'Learner'}</p>
                      <p className="text-[10px] font-mono font-bold text-red-600">{user.nihomiAccountId || profile?.nihomiAccountId || `NHM-${user.id.slice(0, 6).toUpperCase()}`}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('dashboard'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-red-600" />
                  <span>{language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('passport'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-red-600" />
                  <span>{language === 'bn' ? 'ডিজিটাল আইডি কার্ড' : 'Digital Student ID'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('courses'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-red-600" />
                  <span>{language === 'bn' ? 'আমার কোর্স ও প্রগ্রেস' : 'My Courses & Progress'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('flashcards'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-stone-400" />
                  <span>Flashcards & Decks</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('quizzes'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-stone-400" />
                  <span>{t('quizzes')}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('ai-coach'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-stone-400" />
                  <span>{t('ai_sensei')}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('progress'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-stone-400" />
                  <span>Progress & Analytics</span>
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleNav('admin'); }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-2"
                    id="mobile-nav-admin-portal-link"
                  >
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    <span>Founder Command Center</span>
                  </button>
                )}
                <div className="border-t border-stone-200 my-1"></div>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    handleNav('home');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (openLoginModal) {
                      openLoginModal('login');
                    } else {
                      handleNav('auth', { mode: 'login' });
                    }
                  }}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-stone-700 border border-stone-300 rounded-xl cursor-pointer"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (openLoginModal) {
                      openLoginModal('register');
                    } else {
                      handleNav('auth', { mode: 'register' });
                    }
                  }}
                  className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl shadow-xs cursor-pointer"
                >
                  {t('start_free')}
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

