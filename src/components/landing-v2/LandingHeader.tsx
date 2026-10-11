import React, { useState } from 'react';
import { Globe, ChevronDown, Menu, X, ArrowRight, User } from 'lucide-react';
import { NihomiFlowerLogo } from './NihomiFlowerLogo';
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
    { label: 'কেন Nihomi?', href: '#why-nihomi', action: () => scrollToSection('why-nihomi') },
    { label: 'কোর্স', href: '/courses', action: () => onNavigate('courses') },
    { label: 'AI Sensei', href: '#ai-sensei', action: () => scrollToSection('try-lesson') },
    { label: 'জাপান রেডিনেস', href: '/baito', action: () => onNavigate('baito') },
    { label: 'শিক্ষার্থী অভিজ্ঞতা', href: '#testimonials', action: () => scrollToSection('testimonials') },
    { label: 'দাম', href: '#pricing', action: () => scrollToSection('pricing-section') },
    { label: 'সহায়তা', href: '/contact', action: () => onNavigate('contact') },
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
    <header id="landing-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.03)] h-[60px] flex items-center transition-all">
      <div className="w-full max-w-[1024px] mx-auto px-4 h-full flex items-center justify-between gap-1">
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            onNavigate('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
        >
          <NihomiFlowerLogo size={32} className="transition-transform group-hover:scale-105 shrink-0" />
          <div className="flex flex-col shrink-0">
            <span className="font-extrabold text-xl text-[#101A59] tracking-tight leading-none group-hover:text-[#6D25EA] transition-colors whitespace-nowrap">
              Nihomi
            </span>
            <span className="text-[8.5px] font-medium text-slate-400 tracking-wide mt-0.5 leading-none whitespace-nowrap">
              Learn Japanese, Live Japan.
            </span>
          </div>
        </div>

        {/* Center: Bengali Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-2.5">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="px-1.5 py-1 text-[11px] font-medium text-slate-700 hover:text-[#6D25EA] rounded-lg transition-colors whitespace-nowrap cursor-pointer hover:bg-purple-50/50"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Controls & CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-1.5 py-1 text-[11px] font-medium text-slate-700 hover:text-[#6D25EA] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Language Selector"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-28 bg-white border border-slate-100 rounded-xl shadow-lg p-1 z-50 animate-in fade-in-50 zoom-in-95">
                {(['BN', 'EN', 'JA'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setCurrentLang(lang);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentLang === lang ? 'bg-purple-50 text-[#6D25EA]' : 'text-slate-600 hover:bg-slate-50'
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
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100/70 text-[#6D25EA] text-[11px] font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <User className="w-3 h-3" />
              <span>ড্যাশবোর্ড</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAuthClick('login')}
              className="px-3.5 py-1 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              লগইন
            </button>
          )}

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={() => handleAuthClick('signup')}
            className="inline-flex items-center gap-1 px-3.5 py-1 rounded-xl bg-gradient-to-r from-[#6D25EA] to-[#8B5CF6] hover:opacity-95 text-white text-[11px] font-bold shadow-sm shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>বিনামূল্যে শুরু করুন</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[60px] left-0 w-full bg-white border-b border-slate-200 shadow-xl px-4 py-4 z-50 flex flex-col space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6D25EA] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleAuthClick('login')}
              className="w-full py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              লগইন
            </button>
            <button
              type="button"
              onClick={() => handleAuthClick('signup')}
              className="w-full py-2 rounded-xl bg-[#6D25EA] text-white text-xs font-bold shadow-md shadow-purple-600/30 hover:bg-[#5818D1] transition-all cursor-pointer"
            >
              বিনামূল্যে শুরু করুন
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
