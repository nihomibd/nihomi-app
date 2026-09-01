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
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, AppTheme } from '../../context/ThemeContext';

// Self-contained Nihomi Master Monogram SVG
const NihomiMonogram: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    <path d="M20 82V28C20 23.5817 23.5817 20 28 20H32C36.4183 20 40 23.5817 40 28V82H20Z" fill="#0F172A" />
    <path d="M32 24L72 76C75 80 80 80 84 76C88 72 88 66 84 62L62 38C58 34 52 34 48 38L32 54" stroke="#4F46E5" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M68 82V38C68 33.5817 71.5817 30 76 30H80C84.4183 30 88 33.5817 88 38V82H68Z" fill="#0F172A" />
    <circle cx="50" cy="50" r="10" stroke="#4F46E5" strokeWidth="6" strokeDasharray="4 2" />
    <circle cx="78" cy="22" r="8" fill="#E11D48" />
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
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const isFounder = user?.role === 'founder' || user?.email === 'mdtanvirkabirbiplob@gmail.com';

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'courses', label: 'Pathways' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'study-plan', label: 'Roadmap & SRS' },
    { id: 'baito', label: 'BaitoOS™' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'portal', label: 'Dashboard' },
    { id: 'documents', label: 'Resources' },
  ];

  const themeOptions: { id: AppTheme; label: string; icon: any }[] = [
    { id: 'system', label: 'System', icon: Laptop },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'sepia', label: 'Sepia', icon: BookOpen },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ActiveThemeIcon = theme === 'system' ? Laptop : theme === 'dark' ? Moon : theme === 'sepia' ? BookOpen : Sun;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 dark:bg-[#0a0a12]/95 sepia:bg-[#fbf0d9]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 sepia:border-[#d9cbb2] transition-colors text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 group cursor-pointer focus:outline-hidden"
          >
            <NihomiMonogram size={32} className="group-hover:scale-105 transition-transform" />
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-lg tracking-tight text-stone-950 dark:text-white sepia:text-[#332211]">
                NIHOMI
              </span>
              <span className="text-[11px] font-japanese font-medium text-stone-500 dark:text-stone-400 hidden sm:inline">
                日本語
              </span>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'portal' && currentView.startsWith('portal'));
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT CONTROLS: THEME SWITCHER + GOOGLE AVATAR PILL */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* PERSISTENT UI THEME TOGGLE (System / Light / Dark / Sepia) */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                id="header-theme-toggle-btn"
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbb2] text-stone-700 dark:text-stone-300 text-xs font-medium hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer shadow-2xs"
                title={`Theme: ${theme.toUpperCase()} (Click to change)`}
              >
                <ActiveThemeIcon className="w-3.5 h-3.5 text-stone-600 dark:text-amber-400" />
                <span className="capitalize text-[11px] font-semibold">{theme}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbb2] py-1.5 z-50 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    Select Theme
                  </div>
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        id={`theme-select-${opt.id}`}
                        onClick={() => {
                          setTheme(opt.id);
                          setIsThemeDropdownOpen(false);
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
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 pr-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  
                  {/* Google Profile Picture / Initial */}
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

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in slide-in-from-top-2">
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
                        onNavigate('leaderboard');
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Community Leaderboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onNavigate('credits');
                      }}
                      className="w-full px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      <span>Nihomi Coins ({user.planId.toUpperCase()})</span>
                    </button>

                    {isFounder && (
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onNavigate('founder');
                        }}
                        className="w-full px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-left font-bold flex items-center space-x-2 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Founder Command Center</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-left font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-4 py-1.5 bg-stone-950 dark:bg-white text-white dark:text-stone-950 hover:bg-stone-800 rounded-full text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Quick theme cycle for mobile */}
            <button
              onClick={() => {
                if (theme === 'light') setTheme('dark');
                else if (theme === 'dark') setTheme('sepia');
                else if (theme === 'sepia') setTheme('system');
                else setTheme('light');
              }}
              className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300"
              title="Toggle Theme"
            >
              <ActiveThemeIcon className="w-4 h-4" />
            </button>

            {user ? (
              <button
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
                onClick={() => openAuthModal()}
                className="px-3 py-1 bg-stone-950 dark:bg-white text-white dark:text-stone-950 rounded-full text-xs font-bold"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-2 text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(item.id);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-left font-bold ${
                currentView === item.id
                  ? 'bg-stone-950 dark:bg-white text-white dark:text-stone-950'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Theme Selector Strip */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-stone-500">Theme:</span>
            <div className="flex space-x-1">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
