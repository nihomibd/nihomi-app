// src/v2/components/layout/V2Header.tsx
import React, { useState } from 'react';
import {
  Menu,
  X,
  Compass,
  BookOpen,
  Store,
  FileText,
  CreditCard,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Award,
  Crown
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../../types';
import { useAuth } from '../../../context/AuthContext';
import { NihomiBrandLogo } from '../../../components/brand/NihomiBrandLogo';

interface V2HeaderProps {
  currentRoute: V2Route;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2Header: React.FC<V2HeaderProps> = ({ currentRoute, onNavigate }) => {
  const { user, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Strict Founder Invariant: ONLY mdtanvirkabirbiplob@gmail.com
  const isFounder = Boolean(
    (user?.email?.trim().toLowerCase() === 'mdtanvirkabirbiplob@gmail.com') ||
    user?.role === 'founder' ||
    (() => {
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('nihomi_user');
          if (raw) {
            const parsed = JSON.parse(raw);
            return parsed?.email?.trim().toLowerCase() === 'mdtanvirkabirbiplob@gmail.com' || parsed?.role === 'founder';
          }
        }
      } catch {}
      return false;
    })()
  );

  const navLinks: { route: V2Route; label: string; icon: React.FC<{ className?: string }> }[] = [
    { route: 'landing', label: 'হোম', icon: Sparkles },
    { route: 'journey', label: 'টোকিও জার্নি', icon: Compass },
    { route: 'dashboard', label: 'শিক্ষার্থী ড্যাশবোর্ড', icon: GraduationCap },
    { route: 'curriculum', label: 'পাঠ্যক্রম (N5–N1)', icon: BookOpen },
    { route: 'exam', label: 'JLPT মক এক্সাম ওএস', icon: Award },
    { route: 'workos', label: 'কনবিনি WorkOS™', icon: Store },
    { route: 'rirekisho', label: 'রিলোকেশন CV', icon: FileText },
    { route: 'pricing', label: 'সাবস্ক্রিপশন', icon: CreditCard }
  ];

  const handleNavClick = (route: V2Route) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    onNavigate(route);
  };

  return (
    <header id="v2-header" className="sticky top-0 z-40 w-full bg-[#141726]/95 backdrop-blur-md border-b border-[#F6F0E6]/10 text-[#F6F0E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Authentic Founder Brand Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <NihomiBrandLogo
            variant="full"
            theme="dark"
            size={36}
            showTagline={true}
          />
        </div>

        {/* Desktop Navigation Links (Segmented for Learning Excellence) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(({ route, label }) => {
            const isActive = currentRoute === route;
            return (
              <button
                key={route}
                onClick={() => handleNavClick(route)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E45147] text-white shadow-md shadow-red-600/30'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-2.5">
          {/* Dedicated Founder Cockpit Gateway — STRICTLY visible only for mdtanvirkabirbiplob@gmail.com */}
          {isFounder && (
            <button
              id="header-founder-cockpit-btn"
              onClick={() => handleNavClick('founder')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Cockpit</span>
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                id="header-user-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#6D7C55] text-white flex items-center justify-center text-[11px] font-black">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-stone-200">
                  {user.name || user.email.split('@')[0]}
                </span>
              </button>

              {profileDropdownOpen && (
                <div id="v2-profile-dropdown" className="absolute right-0 mt-2 w-64 bg-[#1B1E30] border border-[#F6F0E6]/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 mb-1">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#6D7C55] text-white flex items-center justify-center text-xs font-black shrink-0">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{user.name || (isFounder ? 'ফাউন্ডার' : 'শিক্ষার্থী')}</p>
                      <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isFounder ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[#6D7C55]/20 text-[#6D7C55]'
                      }`}>
                        {isFounder ? 'রোল: FOUNDER' : `রোল: STUDENT (${(user.planId || 'free').toUpperCase()})`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-stone-200 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>আমার ড্যাশবোর্ড</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('exam')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-stone-200 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>JLPT মক এক্সাম ওএস</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('pricing')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-stone-200 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>সাবস্ক্রিপশন ও বিলিং</span>
                  </button>
                  {isFounder && (
                    <button
                      onClick={() => handleNavClick('founder')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/10 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>ফাউন্ডার ককপিট</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNavClick('legacy')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-stone-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-stone-400" />
                    <span>লেগ্যাসি ভিউ (Classic)</span>
                  </button>
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট (Sign Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => openAuthModal('login')}
              className="btn-haptic px-4 py-2 rounded-xl bg-[#E45147] hover:bg-[#D43E34] text-white text-xs font-extrabold shadow-md shadow-red-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>লগইন / সাইন-আপ</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation (Cleanly Segmented) */}
      {mobileMenuOpen && (
        <div id="v2-mobile-drawer" className="lg:hidden bg-[#1B1E30] border-b border-[#F6F0E6]/10 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          {/* Mobile User Profile or Login CTA */}
          {user ? (
            <div className="p-3 mb-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#6D7C55] text-white flex items-center justify-center text-xs font-black shrink-0">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{user.name || user.email.split('@')[0]}</div>
                  <div className="text-[10px] text-amber-300 font-bold">{isFounder ? 'FOUNDER' : 'STUDENT'}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 text-xs font-bold hover:bg-rose-500/25 transition cursor-pointer"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <button
              id="mobile-drawer-login-btn"
              onClick={() => {
                openAuthModal('login');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E45147] hover:bg-[#D43E34] text-white text-xs font-black shadow-lg shadow-red-600/30 transition cursor-pointer mb-3"
            >
              <User className="w-4 h-4" />
              <span>লগইন / সাইন-আপ (Sign In / Register)</span>
            </button>
          )}

          {navLinks.map(({ route, label, icon: IconComp }) => (
            <button
              key={route}
              onClick={() => handleNavClick(route)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentRoute === route
                  ? 'bg-[#E45147] text-white'
                  : 'text-stone-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
          {isFounder && (
            <button
              onClick={() => handleNavClick('founder')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Founder Command Center</span>
            </button>
          )}
          <button
            onClick={() => handleNavClick('legacy')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-white/5 border border-dashed border-white/10"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span>লেগ্যাসি ভিউ (Classic Platform)</span>
          </button>
        </div>
      )}
    </header>
  );
};
export default V2Header;
