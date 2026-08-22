import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
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
  Plane
} from 'lucide-react';
import { DualTimeWeatherHeader } from './DualTimeWeatherHeader.js';
import { VisionSenseiModal } from '../VisionSenseiModal.js';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, profile, progress, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);

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
  };

  return (
    <>
      {/* 1. Dual Clock & Weather Header Bar */}
      <DualTimeWeatherHeader />

      {/* 2. Quick Access Vision Sensei Modal */}
      <VisionSenseiModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
      />

      {/* 3. Main Navigation Bar */}
      <nav id="nihomi-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 text-stone-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer select-none"
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
                <button
                  id="nav-btn-baito-os"
                  onClick={() => handleNav('baito-os')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'baito-os'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('baito_os')}</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => handleNav('home')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">Home</button>
                <button onClick={() => handleNav('coordination-hub')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">3 Learning Paths</button>
                <button onClick={() => handleNav('pricing')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">{t('pricing')}</button>
                <button onClick={() => handleNav('work-japanese')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">Work Japanese</button>
                <button onClick={() => handleNav('about')} className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer">About</button>
              </div>
            )}

            {/* Right Quick Action: Camera OCR & Profile */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsVisionModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open AI Camera OCR"
                id="btn-nav-vision-sensei"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t('vision_sensei')}</span>
              </button>

              {user ? (
                <>
                  <div
                    className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold cursor-pointer"
                    onClick={() => handleNav('progress')}
                    id="nav-streak-badge"
                  >
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    <span>{progress?.currentStreak || 1}d</span>
                  </div>

                  <div className="relative">
                    <button
                      id="level-switcher-btn"
                      onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                      className="flex items-center space-x-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold hover:bg-red-100 cursor-pointer"
                    >
                      <span>JLPT {profile?.targetLevel || 'N5'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {levelDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border border-stone-200 rounded-2xl shadow-lg py-1.5 z-50">
                        {(['N5', 'N4', 'N3'] as JLPTLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleLevelChange(lvl)}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                          >
                            <span>JLPT {lvl}</span>
                            {profile?.targetLevel === lvl && <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      id="user-menu-btn"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                        {profile?.displayName?.charAt(0) || 'U'}
                      </div>
                      <span className="max-w-[100px] truncate text-xs font-bold text-stone-800">
                        {profile?.displayName || 'Learner'}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-lg py-2 z-50 animate-in fade-in">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs font-bold text-stone-900 truncate">{profile?.displayName}</p>
                          <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold uppercase">
                            Role: {user.role}
                          </span>
                        </div>
                        <button onClick={() => handleNav('profile')} className="w-full text-left px-4 py-2 text-xs hover:bg-stone-50 cursor-pointer flex items-center gap-2">
                          <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                          <span>Profile & Goals</span>
                        </button>
                        <button onClick={() => handleNav('japan-twin')} className="w-full text-left px-4 py-2 text-xs hover:bg-stone-50 cursor-pointer flex items-center gap-2" id="nav-user-japan-twin-link">
                          <Sparkles className="w-3.5 h-3.5 text-red-600" />
                          <span className="font-semibold text-stone-900">JapanTwin™ (Tokyo Simulator)</span>
                        </button>
                        <button onClick={() => handleNav('ghost-mode')} className="w-full text-left px-4 py-2 text-xs hover:bg-stone-50 cursor-pointer flex items-center gap-2" id="nav-user-ghost-mode-link">
                          <History className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-semibold text-stone-900">Ghost Mode™ (Mistake Recovery)</span>
                        </button>
                        <button onClick={() => handleNav('day1-blueprint')} className="w-full text-left px-4 py-2 text-xs hover:bg-stone-50 cursor-pointer flex items-center gap-2" id="nav-user-day1-blueprint-link">
                          <Plane className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold text-stone-900">Day-1 Arrival Blueprint™</span>
                        </button>
                        <button onClick={() => handleNav('subscription')} className="w-full text-left px-4 py-2 text-xs hover:bg-stone-50 cursor-pointer flex items-center gap-2" id="nav-user-subscription-link">
                          <CreditCard className="w-3.5 h-3.5 text-red-600" />
                          <span>Subscription & Invoices</span>
                        </button>
                        <button onClick={() => handleNav('interview-lab')} className="w-full text-left px-4 py-2 text-xs hover:bg-stone-50 cursor-pointer flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Interview Lab™ (Tokyo Principal)</span>
                        </button>
                        {(user.role === 'admin' || user.role === 'instructor') && (
                          <button onClick={() => handleNav('instructor-portal')} className="w-full text-left px-4 py-2 text-xs text-purple-700 font-bold hover:bg-purple-50 cursor-pointer flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-purple-600" />
                            <span>Instructor Workspace</span>
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button onClick={() => handleNav('admin')} className="w-full text-left px-4 py-2 text-xs text-red-600 font-bold hover:bg-red-50 cursor-pointer flex items-center gap-2" id="nav-admin-portal-link">
                            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                            <span>Founder Command Center</span>
                          </button>
                        )}
                        <div className="border-t border-stone-100 my-1"></div>
                        <button
                          onClick={async () => {
                            await logout();
                            handleNav('home');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                          id="nav-logout-btn"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNav('auth', { mode: 'login' })}
                    className="px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
                    id="nav-login-btn"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => handleNav('auth', { mode: 'register' })}
                    className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
                    id="nav-register-btn"
                  >
                    {t('start_free')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsVisionModalOpen(true)}
                className="p-2 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
