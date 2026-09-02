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
    await supabase.auth.signOut().then(() => { localStorage.clear(); window.location.href = '/'; });
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
      setTimerToast(`ðŸŽ‰ Saved ${minutes} study minutes! (+${minutes * 2} XP)`);
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
    { id: 'bn', label: 'à¦¬à¦¾à¦‚à¦²à¦¾', flag: 'ðŸ‡§ðŸ‡©', native: 'à¦¬à¦¾à¦‚à¦²à¦¾ (Bengali)' },
    { id: 'en', label: 'English', flag: 'ðŸ‡ºðŸ‡¸', native: 'English (US)' },
    { id: 'ja', label: 'æ—¥æœ¬èªž', flag: 'ðŸ‡¯ðŸ‡µ', native: 'æ—¥æœ¬èªž (Japanese)' }
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
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-red-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm relative border border-stone-200">
                      {user?.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : null}
                      <span>{(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                    </div>
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
                  <span>{language === 'bn' ? 'à¦†à¦®à¦¾à¦° à¦¡à§à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§à¦¡' : 'My Dashboard'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('passport'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-red-600" />
                  <span>{language === 'bn' ? 'à¦¡à¦¿à¦œà¦¿à¦Ÿà¦¾à¦² à¦†à¦‡à¦¡à¦¿ à¦•à¦¾à¦°à§à¦¡' : 'Digital Student ID'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNav('courses'); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 rounded-xl flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-red-600" />
                  <span>{language === 'bn' ? 'à¦†à¦®à¦¾à¦° à¦•à§‹à¦°à§à¦¸ à¦“ à¦ªà§à¦°à¦—à§à¦°à§‡à¦¸' : 'My Courses & Progress'}</span>
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










