import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  welcome_title: {
    bn: 'নিহোমিতে আপনাকে স্বাগতম',
    en: 'Welcome to Nihomi',
    ja: 'Nihomiへようこそ'
  },
  tagline: {
    bn: 'আমরা জাপানি ভাষা শিক্ষা সমন্বয় করি',
    en: 'We Coordinate Japanese Learning',
    ja: '日本語学習をコーディネートします'
  },
  courses: {
    bn: 'কোর্সসমূহ',
    en: 'Courses',
    ja: 'コース'
  },
  coordination_hub: {
    bn: 'কোঅর্ডিনেশন হাব',
    en: 'Coordination Hub',
    ja: '総合案内ハブ'
  },
  ai_sensei: {
    bn: 'AI সেনসেই',
    en: 'AI Sensei',
    ja: 'AI先生'
  },
  vision_sensei: {
    bn: 'ভিশন সেনসেই (📷 OCR)',
    en: 'Vision Sensei (📷 OCR)',
    ja: 'ビジョン先生 (📷 OCR)'
  },
  memory_os: {
    bn: 'মেমোরি ওএস™',
    en: 'MemoryOS™',
    ja: 'メモリーOS™'
  },
  baito_os: {
    bn: 'বাইতো ওএস™ (জব ল্যাব)',
    en: 'BaitoOS™ (Job Lab)',
    ja: 'バイトOS™ (仕事ラボ)'
  },
  pricing: {
    bn: 'প্রাইসিং ও প্ল্যান',
    en: 'Pricing & Plans',
    ja: '料金プラン'
  },
  dashboard: {
    bn: 'ড্যাশবোর্ড',
    en: 'Dashboard',
    ja: 'ダッシュボード'
  },
  login: {
    bn: 'লগ ইন',
    en: 'Log In',
    ja: 'ログイン'
  },
  start_free: {
    bn: 'বিনামূল্যে শুরু করুন',
    en: 'Start Free',
    ja: '無料で始める'
  },
  dhaka_label: {
    bn: 'ঢাকা (বাংলাদেশ)',
    en: 'Dhaka (Bangladesh)',
    ja: 'ダッカ (バングラデシュ)'
  },
  tokyo_label: {
    bn: 'টোকিও (জাপান)',
    en: 'Tokyo (Japan)',
    ja: '東京 (日本)'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn'); // Default to Bengali

  useEffect(() => {
    const saved = localStorage.getItem('nihomi_preferred_lang') as Language;
    if (saved && (saved === 'bn' || saved === 'en' || saved === 'ja')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nihomi_preferred_lang', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
