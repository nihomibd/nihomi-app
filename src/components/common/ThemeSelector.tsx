import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Sparkles, Coffee, ChevronDown, Check } from 'lucide-react';
import { useTheme, AppTheme } from '../../context/ThemeContext';

interface ThemeSelectorProps {
  variant?: 'dropdown' | 'toggle' | 'segmented';
  className?: string;
}

const THEME_OPTIONS: { id: AppTheme; label: string; sublabel: string; icon: typeof Sun; bgPreview: string }[] = [
  {
    id: 'light',
    label: 'Light Mode',
    sublabel: 'Classic Crisp Paper',
    icon: Sun,
    bgPreview: 'bg-[#F8F9FA] border-slate-300',
  },
  {
    id: 'dark',
    label: 'Neo-Tokyo',
    sublabel: 'Deep Indigo Dark',
    icon: Moon,
    bgPreview: 'bg-[#0a0a12] border-rose-500/50',
  },
  {
    id: 'sepia',
    label: 'Sepia Mode',
    sublabel: 'Warm Eye-Care Parchment',
    icon: Coffee,
    bgPreview: 'bg-[#fbf0d9] border-amber-400',
  },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ variant = 'dropdown', className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
  const IconComponent = currentThemeObj.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'toggle') {
    return (
      <button
        id="btn-theme-quick-toggle"
        type="button"
        onClick={() => {
          if (theme === 'light') setTheme('dark');
          else if (theme === 'dark') setTheme('sepia');
          else setTheme('light');
        }}
        className={`p-1.5 rounded-lg text-slate-700 dark:text-stone-200 sepia:text-amber-950 bg-slate-100 hover:bg-slate-200 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#f0e4cc] border border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] transition-colors ${className}`}
        title={`Current: ${currentThemeObj.label} - Click to cycle theme`}
        aria-label="Cycle UI theme"
      >
        <IconComponent className="w-4 h-4 text-amber-500 dark:text-rose-400 sepia:text-amber-800" />
      </button>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        id="btn-theme-selector-dropdown"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-stone-200 sepia:text-amber-950 bg-slate-100 hover:bg-slate-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#f0e4cc] sepia:hover:bg-[#e4d6bc] border border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] transition-all shadow-2xs"
        aria-label="Select Theme Mode"
        aria-expanded={isOpen}
      >
        <IconComponent className="w-3.5 h-3.5 text-amber-500 dark:text-rose-400 sepia:text-amber-800" />
        <span className="font-bold text-[11px] hidden sm:inline">{currentThemeObj.label.split(' ')[0]}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="theme-selector-menu"
          className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] border border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-stone-500 sepia:text-stone-500 border-b border-slate-100 dark:border-stone-800 sepia:border-[#ebdcc3] mb-1 flex items-center justify-between">
            <span>Theme & Atmosphere</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
          {THEME_OPTIONS.map((opt) => {
            const OptIcon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                id={`theme-option-${opt.id}`}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-red-50 text-red-700 dark:bg-rose-950/40 dark:text-rose-400 sepia:bg-[#ebdcc3] sepia:text-amber-950 font-bold'
                    : 'text-slate-700 dark:text-stone-300 sepia:text-stone-800 hover:bg-slate-50 dark:hover:bg-stone-800 sepia:hover:bg-[#f3e7d1]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${opt.bgPreview}`}>
                    <OptIcon className="w-3.5 h-3.5 text-slate-700 dark:text-rose-400 sepia:text-amber-900" />
                  </div>
                  <div>
                    <div className="leading-tight font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-stone-500">{opt.sublabel}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
