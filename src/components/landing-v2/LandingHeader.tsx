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
    { label: 'সহায়তা', href: '/contact', action: () => onNavigate('contact') },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback if rendered on a different route
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            onNavigate('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <NihomiFlowerLogo size={36} className="transition-transform group-hover:scale-105 shrink-0" />
          <div className="flex flex-col shrink-0">
            <span className="font-extrabold text-xl sm:text-2xl text-[#101A59] tracking-tight leading-none group-hover:text-[#6D25EA] transition-colors whitespace-nowrap">
              Nihomi
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 tracking-wide mt-1 leading-none whitespace-nowrap">
              Learn Japanese, Live Japan.
            </span>
          </div>
        </div>

        {/* Center: Bengali Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="px-2 py-1 text-xs xl:text-sm font-semibold text-slate-700 hover:text-[#6D25EA] rounded-lg transition-colors whitespace-nowrap cursor-pointer hover:bg-purple-50/50"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Controls & CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 text-xs font-bold text-slate-700 hover:text-[#6D25EA] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
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
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      currentLang === lang
                        ? 'bg-[#F4EFFF] text-[#6D25EA]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lang === 'BN' ? 'বাংলা (BN)' : lang === 'EN' ? 'English' : '日本語 (JA)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User / Login Button (Hidden on tiny screens to avoid overflow, accessible in menu) */}
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-[#6D25EA] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-[#6D25EA]" />
              <span className="hidden sm:inline">ড্যাশবোর্ড</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAuthClick('login')}
              className="hidden sm:inline-block px-2.5 py-1 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#6D25EA] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              লগইন
            </button>
          )}

          {/* Primary High-Contrast Purple CTA */}
          <button
            type="button"
            onClick={() => onNavigate('journey')}
            className="group inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4.5 py-1.5 sm:py-2 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>বিনামূল্যে শুরু করুন</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-5 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6D25EA] hover:bg-purple-50/50 rounded-xl transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!user && (
              <button
                type="button"
                onClick={() => {
                  handleAuthClick('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                লগইন করুন
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onNavigate('journey');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#6D25EA] hover:bg-[#5818D1] rounded-full shadow-md shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>বিনামূল্যে শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
