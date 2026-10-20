import React, { useState } from 'react';
import { Globe, ChevronDown, Menu, X, ArrowRight, User } from 'lucide-react';
import { LandingPageContainer } from './LandingPageContainer';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';
import { useAuth } from '../../context/AuthContext';

interface LandingHeaderProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'BN' | 'EN' | 'JA'>('BN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else if (openAuthModal) {
      openAuthModal(mode);
    } else {
      onNavigate('auth', { mode });
    }
  };

  const navLinks = [
    { label: '১ মিনিটে দেখুন', href: '#explainer-video', action: () => scrollToSection('explainer-video') },
    { label: 'শেখার পথ', href: '#learning-journey', action: () => scrollToSection('learning-journey') },
    { label: 'Nomi Sensei', href: '#bengali-sensei', action: () => scrollToSection('bengali-sensei') },
    { label: 'টোকিও সিমুলেশন', href: '#workos-simulation', action: () => scrollToSection('workos-simulation') },
    { label: 'JLPT মক', href: '#jlpt-mock', action: () => scrollToSection('jlpt-mock') },
    { label: 'সাবস্ক্রিপশন', href: '#pricing-section', action: () => scrollToSection('pricing-section') },
    { label: 'প্রশ্নোত্তর', href: '#faq-section', action: () => scrollToSection('faq-section') },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="landing-header" className="sticky top-0 z-50 bg-[#141726]/95 backdrop-blur-md border-b border-[#F6F0E6]/10 text-[#F6F0E6] h-[64px] flex items-center transition-all">
      <LandingPageContainer className="h-full flex items-center justify-between gap-2">
        {/* Left: Brand Identity (Brand Guidelines v1.0) */}
        <div
          id="landing-header-brand-logo"
          onClick={() => {
            onNavigate('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer select-none group shrink-0"
        >
          <NihomiBrandLogo variant="full" theme="dark" size={32} showTagline={true} />
        </div>

        {/* Center: Bengali Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Controls & CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Language Selector"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#141726] border border-white/15 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in-50 zoom-in-95">
                {(['BN', 'EN', 'JA'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setCurrentLang(lang);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentLang === lang ? 'bg-[#E45147]/20 text-[#E45147]' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {lang === 'BN' ? 'বাংলা (BN)' : lang === 'EN' ? 'English (EN)' : '日本語 (JA)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Action (Login Button) */}
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate(user.role === 'founder' || user.role === 'admin' ? 'founder' : 'dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>{user.role === 'founder' || user.role === 'admin' ? 'কমান্ড সেন্টার' : 'ড্যাশবোর্ড'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAuthClick('login')}
              className="px-3.5 py-1.5 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              লগইন
            </button>
          )}

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={() => user ? onNavigate(user.role === 'founder' || user.role === 'admin' ? 'founder' : 'dashboard') : handleAuthClick('signup')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#E45147] hover:bg-[#c93b32] text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{user ? (user.role === 'founder' || user.role === 'admin' ? 'কমান্ড সেন্টার' : 'ড্যাশবোর্ডে প্রবেশ') : 'বিনামূল্যে শুরু করুন'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </LandingPageContainer>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[64px] left-0 w-full bg-[#141726] border-b border-white/15 shadow-2xl px-5 py-4 z-50 flex flex-col space-y-2.5 animate-in slide-in-from-top-2">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-200 hover:text-[#E45147] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  onNavigate(user.role === 'founder' || user.role === 'admin' ? 'founder' : 'dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#E45147] text-white text-xs font-bold shadow-md shadow-red-600/30 hover:bg-[#c93b32] transition-all cursor-pointer"
              >
                {user.role === 'founder' || user.role === 'admin' ? 'কমান্ড সেন্টারে প্রবেশ করুন' : 'ড্যাশবোর্ডে প্রবেশ করুন'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleAuthClick('login')}
                  className="w-full py-2.5 rounded-xl border border-white/15 text-slate-200 text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  লগইন
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthClick('signup')}
                  className="w-full py-2.5 rounded-xl bg-[#E45147] text-white text-xs font-bold shadow-md shadow-red-600/30 hover:bg-[#c93b32] transition-all cursor-pointer"
                >
                  বিনামূল্যে শুরু করুন
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
