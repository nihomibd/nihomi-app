import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

const LANGUAGES: { code: Language; label: string; nativeName: string; flag: string }[] = [
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'en', label: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'dropdown', className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Segmented compact button style
  if (variant === 'compact') {
    return (
      <div id="language-switcher-compact" className={`inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] ${className}`}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            id={`lang-btn-${l.code}`}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-2 py-1 text-xs font-bold rounded-md transition-all flex items-center space-x-1 ${
              language === l.code
                ? 'bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] text-red-600 dark:text-rose-400 sepia:text-amber-900 shadow-xs'
                : 'text-slate-600 dark:text-stone-400 sepia:text-stone-700 hover:text-slate-900 dark:hover:text-stone-200'
            }`}
            title={`Switch to ${l.nativeName}`}
          >
            <span>{l.flag}</span>
            <span className="text-[11px]">{l.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  // Dropdown selector button
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        id="btn-language-switcher"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-stone-200 sepia:text-amber-950 bg-slate-100 hover:bg-slate-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#f0e4cc] sepia:hover:bg-[#e4d6bc] border border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] transition-all shadow-2xs"
        aria-label="Select UI Language"
        aria-expanded={isOpen}
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="font-bold text-[11px]">{currentLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="language-switcher-menu"
          className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] border border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-stone-500 sepia:text-stone-500 border-b border-slate-100 dark:border-stone-800 sepia:border-[#ebdcc3] mb-1 flex items-center justify-between">
            <span>UI Language</span>
            <Globe className="w-3 h-3" />
          </div>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              id={`lang-option-${l.code}`}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
                language === l.code
                  ? 'bg-red-50 text-red-700 dark:bg-rose-950/40 dark:text-rose-400 sepia:bg-[#ebdcc3] sepia:text-amber-950 font-bold'
                  : 'text-slate-700 dark:text-stone-300 sepia:text-stone-800 hover:bg-slate-50 dark:hover:bg-stone-800 sepia:hover:bg-[#f3e7d1]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">{l.flag}</span>
                <div>
                  <div className="leading-tight">{l.nativeName}</div>
                  <div className="text-[10px] text-slate-400 dark:text-stone-500">{l.label}</div>
                </div>
              </div>
              {language === l.code && <Check className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
