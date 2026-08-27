import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  User,
  Crown,
  Sparkles,
  LogOut,
  ChevronDown,
  Search,
  Flame,
  Keyboard,
  BookOpen,
  HelpCircle,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AppTheme } from '../../context/ThemeContext';
import { DailyStreakBadge } from '../common/DailyStreakBadge';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDictionary?: () => void;
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenDictionary,
  onOpenShortcuts,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Simulated / dynamic 7-day study streak (default 18 days if logged in or active)
  const streakDays = user ? 18 : 7;

  // 7-day progress sparkline data points (e.g. daily minutes / reviewed cards)
  const sparklineData = [14, 22, 19, 32, 28, 45, 52];
  const maxVal = Math.max(...sparklineData);
  const minVal = Math.min(...sparklineData);
  const sparklinePoints = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 48;
      const y = 14 - ((val - minVal) / (maxVal - minVal || 1)) * 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const isFounder =
    (user?.role as string) === 'admin' ||
    (user?.role as string) === 'FOUNDER' ||
    user?.email === 'mdtanvirkabirbiplob@gmail.com';

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'portal', label: 'Dashboard' },
    { id: 'coordination', label: 'Coordination / Docs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 dark:bg-[#0a0a12]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-all text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* LEFT: BRAND LOGO */}
          <div className="flex items-center space-x-4 shrink-0">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2.5 group cursor-pointer focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 flex items-center justify-center font-bold text-sm shadow-2xs group-hover:bg-red-600 dark:group-hover:bg-red-600 dark:group-hover:text-white transition-colors">
                日
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-950 dark:text-white">
                  NIHOMI
                </span>
                <span className="text-[11px] font-japanese font-medium text-stone-500 hidden sm:inline">
                  日本語
                </span>
              </div>
            </button>

            {/* QUICK DICTIONARY TRIGGER SEARCH BAR */}
            <button
              type="button"
              onClick={onOpenDictionary}
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-stone-100/80 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-white text-xs transition-all cursor-pointer shadow-2xs"
              title="Quick Dictionary Search (Press ⌘K or ?)"
            >
              <Search className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="text-stone-600 dark:text-stone-400 font-medium">Quick Dictionary</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 text-[10px] font-mono text-stone-400 border border-stone-200 dark:border-stone-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* DESKTOP NAV (4 CLEAN LINKS) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === 'portal' && currentView.startsWith('portal'));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: USER PROFILE PILL + STREAK + SPARKLINE */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">
            {/* Quick Dictionary Icon for medium screens */}
            <button
              onClick={onOpenDictionary}
              className="lg:hidden p-2 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Quick Dictionary"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Persistent Theme Selector (Light, Dark Neo-Tokyo, Sepia) */}
            <div className="relative">
              <button
                id="btn-header-theme-toggle"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-900/90 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] text-stone-600 dark:text-stone-300 sepia:text-[#433422] text-xs font-semibold hover:border-stone-400 dark:hover:border-stone-600 transition cursor-pointer shadow-2xs"
                title={`Current Theme: ${theme.toUpperCase()} (Click to change)`}
              >
                {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                {theme === 'sepia' && <Coffee className="w-3.5 h-3.5 text-amber-700" />}
                <span className="capitalize text-[11px] hidden xl:inline">{theme === 'dark' ? 'Neo-Tokyo' : theme}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isThemeMenuOpen && (
                <div
                  id="theme-dropdown-menu"
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-stone-900 sepia:bg-[#f4e5c3] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <p className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Display Theme
                  </p>
                  {(
                    [
                      { id: 'light' as AppTheme, label: 'Light', desc: 'Classic Clean', icon: Sun, color: 'text-amber-500' },
                      { id: 'dark' as AppTheme, label: 'Dark (Neo-Tokyo)', desc: 'Slate #0a0a12', icon: Moon, color: 'text-indigo-400' },
                      { id: 'sepia' as AppTheme, label: 'Sepia', desc: 'Warm Paper', icon: Coffee, color: 'text-amber-700' }
                    ]
                  ).map((t) => {
                    const IconComponent = t.icon;
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-stone-100 dark:bg-stone-800 sepia:bg-[#ede0b9] font-bold text-stone-900 dark:text-white sepia:text-[#382a17]'
                            : 'text-stone-600 dark:text-stone-400 sepia:text-[#5c472d] hover:bg-stone-50 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${t.color}`} />
                          <div>
                            <p className="text-xs font-semibold">{t.label}</p>
                            <p className="text-[10px] text-stone-400">{t.desc}</p>
                          </div>
                        </div>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={onOpenShortcuts}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Global Keyboard Shortcuts (Press ? or Cmd)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Daily Streak Badge */}
            <DailyStreakBadge onNavigateStreak={() => onNavigate('portal')} />

            {isFounder && (
              <button
                onClick={() => onNavigate('founder')}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Founder Command Center"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Command</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                {/* ENHANCED PROFILE PILL: NAME + SVG SPARKLINE */}
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pl-2.5 pr-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-colors cursor-pointer group"
                >
                  {/* SVG Minimalist Progress Sparkline Chart */}
                  <div
                    className="hidden xl:flex items-center px-1"
                    title="7-Day Learning Velocity Sparkline"
                  >
                    <svg className="w-12 h-4 overflow-visible" viewBox="0 0 48 16">
                      <polyline
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={sparklinePoints}
                      />
                      <circle
                        cx="48"
                        cy="4"
                        r="2.2"
                        className="fill-red-600"
                      />
                    </svg>
                  </div>

                  {/* User First Name */}
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>

                  {/* Avatar Circle */}
                  <div className="w-6 h-6 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-[10px] font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>

                  <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-stone-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-mono text-[9px] font-bold">
                          {user.planId.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono truncate">{user.email}</p>
                      
                      <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Learning Streak:</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          {streakDays} Days
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('portal');
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>Student Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('credits');
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      <span>AI Credits & Balance</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenDictionary) onOpenDictionary();
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Quick Dictionary (辞書)</span>
                    </button>

                    {isFounder && (
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onNavigate('founder');
                        }}
                        className="w-full px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-left font-bold flex items-center space-x-2 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>Founder Command Center</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-1.5 bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-950 rounded-full text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE CONTROLS (SEARCH, STREAK, USER, HAMBURGER) */}
          <div className="md:hidden flex items-center space-x-1.5">
            <button
              onClick={onOpenDictionary}
              className="p-1.5 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Quick Dictionary"
            >
              <Search className="w-4 h-4 text-red-600" />
            </button>

            <DailyStreakBadge onNavigateStreak={() => onNavigate('portal')} />

            {user ? (
              <button
                onClick={() => onNavigate('portal')}
                className="flex items-center space-x-1 p-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-bold"
              >
                <div className="w-5 h-5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-[9px] flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-2.5 py-1 bg-stone-900 dark:bg-white text-white dark:text-stone-950 rounded-full text-xs font-bold"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] dark:bg-[#0a0a12] border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-2 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(item.id);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left font-bold ${
                currentView === item.id
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isFounder && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('founder');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-left font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center space-x-2"
            >
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Founder Command Center</span>
            </button>
          )}

          {/* Mobile Theme Selector */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <p className="text-[10px] font-bold uppercase text-stone-400 px-1 mb-1.5">Theme / থিম</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs ${
                  theme === 'light'
                    ? 'bg-amber-100 border-amber-400 text-amber-900'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs ${
                  theme === 'dark'
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Neo-Tokyo</span>
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold text-xs ${
                  theme === 'sepia'
                    ? 'bg-[#ede0b9] border-[#d9c595] text-[#382a17]'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>Sepia</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-stone-500 px-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenShortcuts) onOpenShortcuts();
              }}
              className="flex items-center space-x-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-400"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keyboard Shortcuts</span>
            </button>
            <span className="text-[10px] font-mono">NIHOMI 2026</span>
          </div>
        </div>
      )}
    </header>
  );
};
