import React, { useState, useEffect } from 'react';
import {
  Clock,
  CloudSun,
  Globe,
  Sun,
  MapPin,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext.js';

export const DualTimeWeatherHeader: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [dhakaTime, setDhakaTime] = useState('');
  const [dhakaDate, setDhakaDate] = useState('');
  const [tokyoTime, setTokyoTime] = useState('');
  const [tokyoDate, setTokyoDate] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      // Dhaka Time (UTC+6)
      const dhakaOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const dhakaDateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      };
      setDhakaTime(new Intl.DateTimeFormat('en-US', dhakaOptions).format(now));
      setDhakaDate(new Intl.DateTimeFormat('en-US', dhakaDateOptions).format(now));

      // Tokyo Time (UTC+9)
      const tokyoOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const tokyoDateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Tokyo',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      };
      setTokyoTime(new Intl.DateTimeFormat('en-US', tokyoOptions).format(now));
      setTokyoDate(new Intl.DateTimeFormat('en-US', tokyoDateOptions).format(now));
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' }
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="bg-stone-950 text-stone-200 border-b border-stone-800 text-[11px] font-sans px-4 sm:px-6 lg:px-8 py-1.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Dual Time & Live Weather (Dhaka 🇧🇩 & Tokyo 🇯🇵) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-stone-300">
          {/* Dhaka Clock & Weather */}
          <div className="flex items-center gap-1.5" title="Dhaka Local Time & Weather">
            <span className="text-xs">🇧🇩</span>
            <span className="font-bold text-white">ঢাকা:</span>
            <span className="font-mono text-emerald-400 font-semibold">{dhakaTime || '03:15 AM'}</span>
            <span className="text-stone-500">({dhakaDate})</span>
            <span className="text-stone-400 flex items-center gap-0.5 ml-0.5">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>28°C</span>
            </span>
          </div>

          <span className="text-stone-700 hidden sm:inline">&bull;</span>

          {/* Tokyo Clock & Weather */}
          <div className="flex items-center gap-1.5" title="Tokyo Local Time & Weather">
            <span className="text-xs">🇯🇵</span>
            <span className="font-bold text-white">東京:</span>
            <span className="font-mono text-rose-400 font-semibold">{tokyoTime || '06:15 AM'}</span>
            <span className="text-stone-500">({tokyoDate})</span>
            <span className="text-stone-400 flex items-center gap-0.5 ml-0.5">
              <CloudSun className="w-3 h-3 text-sky-400" />
              <span>22°C</span>
            </span>
          </div>
        </div>

        {/* Right: Cultural Welcome + 1-Click Language Switcher Button */}
        <div className="flex items-center gap-3">
          {/* Cultural Welcome Note */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-stone-400">
            <span className="text-rose-400 font-serif">ようこそ！</span>
            <span>NHK Easy Japanese মেথডোলজিতে সমন্বিত শিক্ষা</span>
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              id="btn-language-switcher"
            >
              <span>{currentLangObj.flag}</span>
              <span>{currentLangObj.label.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer ${
                      language === l.code ? 'text-rose-400 font-bold bg-stone-800/60' : 'text-stone-300'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
