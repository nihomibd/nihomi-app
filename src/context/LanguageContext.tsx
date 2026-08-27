import React, { createContext, useContext, useState, useEffect } from 'react';
import { WhiteLabelService } from '../core/content-engine/whiteLabelService';
import { ContentDesignSystem } from '../core/content-engine/contentDesignSystem';

export type Language = 'bn' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dynamicDictionary: Record<string, string>;
  setDictionaryOverride: (key: string, value: string) => void;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation & Core Labels
  welcome_title: {
    bn: 'নিহোমিতে আপনাকে স্বাগতম',
    en: 'Welcome to Nihomi',
    ja: 'Nihomiへようこそ'
  },
  tagline: {
    bn: 'আমরা জাপানি ভাষা শিক্ষা ও ক্যারিয়ার সমন্বয় করি',
    en: 'We Coordinate Japanese Learning & Relocation',
    ja: '日本語学習と日本進出を一括コーディネート'
  },
  nav_home: {
    bn: 'হোম',
    en: 'Home',
    ja: 'ホーム'
  },
  nav_courses: {
    bn: 'কোর্সসমূহ',
    en: 'Courses',
    ja: 'コース'
  },
  nav_portal: {
    bn: 'স্টুডেন্ট পোর্টাল',
    en: 'Portal',
    ja: 'ポータル'
  },
  nav_quizzes: {
    bn: 'মক টেস্ট',
    en: 'Quizzes',
    ja: '試験・クイズ'
  },
  nav_coordination: {
    bn: 'ভিসা ও ক্যারিয়ার',
    en: 'Visa & Job',
    ja: '就職・ビザ'
  },
  courses: {
    bn: 'কোর্স ও পাঠ্যক্রম',
    en: 'Courses & Curriculum',
    ja: 'コース・カリキュラム'
  },
  coordination_hub: {
    bn: 'কোঅর্ডিনেশন হাব (ভিসা ও জব)',
    en: 'Coordination Hub (Visa & Job)',
    ja: '総合案内ハブ (ビザ・就職)'
  },
  ai_sensei: {
    bn: 'AI সেনসেই (২৪/৭ টিউটর)',
    en: 'AI Sensei (24/7 Tutor)',
    ja: 'AI先生 (24時間指導)'
  },
  vision_sensei: {
    bn: 'ভিশন সেনসেই (📷 OCR স্ক্যানার)',
    en: 'Vision Sensei (📷 OCR Scanner)',
    ja: 'ビジョン先生 (📷 OCR解析)'
  },
  memory_os: {
    bn: 'মেমোরি ওএস™ (SRS ট্র্যাকার)',
    en: 'MemoryOS™ (Spaced Repetition)',
    ja: 'メモリーOS™ (忘却曲線記憶)'
  },
  baito_os: {
    bn: 'বাইতো ওএস™ (জাপান জব ল্যাব)',
    en: 'BaitoOS™ (Part-time Job Lab)',
    ja: 'バイトOS™ (アルバイト準備)'
  },
  pricing: {
    bn: 'প্রাইসিং ও মেম্বারশিপ',
    en: 'Pricing & Membership',
    ja: '料金・会員プラン'
  },
  dashboard: {
    bn: 'ড্যাশবোর্ড',
    en: 'Dashboard',
    ja: 'ダッシュボード'
  },
  community: {
    bn: 'কমিউনিটি লিডারবোর্ড',
    en: 'Community Leaderboard',
    ja: 'コミュニティ・順位表'
  },
  daily_goal: {
    bn: 'দৈনিক লক্ষ্য',
    en: 'Daily Goal',
    ja: '今日の目標'
  },
  study_timer: {
    bn: 'স্টাডি টাইমার',
    en: 'Study Timer',
    ja: '学習タイマー'
  },
  focus_mode: {
    bn: 'ফোকাস মোড',
    en: 'Focus Mode',
    ja: '集中モード'
  },
  quizzes: {
    bn: 'কুইজ ও পরীক্ষা',
    en: 'Quizzes & Tests',
    ja: 'クイズ・模擬試験'
  },
  badges: {
    bn: 'অর্জিত ব্যাজ ও মেডেল',
    en: 'Badges & Milestones',
    ja: '獲得バッジ・マイルストーン'
  },
  shortcuts: {
    bn: 'কিবোর্ড শর্টকাট',
    en: 'Keyboard Shortcuts',
    ja: 'キーボードショートカット'
  },
  offline_mode: {
    bn: 'অফলাইন মোড',
    en: 'Offline Mode',
    ja: 'オフラインモード'
  },
  online_status: {
    bn: 'অনলাইন সংযুক্ত',
    en: 'Online Connected',
    ja: 'オンライン接続中'
  },
  login: {
    bn: 'লগ ইন',
    en: 'Log In',
    ja: 'ログイン'
  },
  logout: {
    bn: 'লগ আউট',
    en: 'Log Out',
    ja: 'ログアウト'
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
  },
  // Portal and Learning Metrics
  overview_summary: {
    bn: 'সারসংক্ষেপ ও অগ্রগতি',
    en: 'Overview & Summary',
    ja: '概要・進捗サマリー'
  },
  curriculum_lessons: {
    bn: 'পাঠ্যক্রম ও অধ্যায়',
    en: 'Curriculum & Lessons',
    ja: 'カリキュラム・レッスン'
  },
  exams_scorecards: {
    bn: 'পরীক্ষা ও স্কোরকার্ড',
    en: 'Exams & Scorecards',
    ja: '試験結果・スコア'
  },
  digital_student_id: {
    bn: 'ডিজিটাল স্টুডেন্ট আইডি',
    en: 'Digital Student ID',
    ja: 'デジタル学生証'
  },
  certificates_records: {
    bn: 'সার্টিফিকেট ও সনদ',
    en: 'Certificates & Records',
    ja: '修了証・認定証'
  },
  profile_settings: {
    bn: 'প্রোফাইল সেটিংস',
    en: 'Profile Settings',
    ja: 'プロファイル設定'
  },
  subscription_billing: {
    bn: 'সাবস্ক্রিপশন ও বিলিং',
    en: 'Subscription & Billing',
    ja: 'サブスクリプション管理'
  },
  infinite_hub: {
    bn: 'ইনফিনিট লার্নিং হাব™',
    en: 'Infinite Learning Hub™',
    ja: 'インフィニット学習ハブ™'
  },
  save_changes: {
    bn: 'পরিবর্তন সংরক্ষণ করুন',
    en: 'Save Changes',
    ja: '変更を保存'
  },
  install_pwa_title: {
    bn: 'নিহোমি মোবাইল অ্যাপ ইনস্টল করুন',
    en: 'Install Nihomi Mobile App',
    ja: 'Nihomiアプリをインストール'
  },
  install_pwa_desc: {
    bn: 'হোম স্ক্রিন থেকে সহজে ও দ্রুত অফলাইনে জাপানি শিখুন।',
    en: 'Add to home screen for lightning-fast offline Japanese study.',
    ja: 'ホーム画面に追加して、オフラインでも超高速で日本語学習。'
  },
  install_now: {
    bn: 'ইনস্টল করুন',
    en: 'Install Now',
    ja: 'インストール'
  },
  cancel: {
    bn: 'বাতিল',
    en: 'Cancel',
    ja: 'キャンセル'
  },
  close: {
    bn: 'বন্ধ করুন',
    en: 'Close',
    ja: '閉じる'
  },
  continue_learning: {
    bn: 'পড়া চালিয়ে যান',
    en: 'Continue Learning',
    ja: '学習を続ける'
  },
  start_quiz: {
    bn: 'কুইজ শুরু করুন',
    en: 'Start Quiz',
    ja: 'クイズ開始'
  },
  listen_pronunciation: {
    bn: 'উচ্চারণ শুনুন',
    en: 'Listen Audio',
    ja: '音声を聴く'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn'); // Default to Bengali
  const [dynamicOverrides, setDynamicOverrides] = useState<Record<string, string>>({});

  // Initialize dynamic branding tokens from WhiteLabelService
  const [brandingTokens, setBrandingTokens] = useState<Record<string, Record<Language, string>>>(() => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'nihomi.com';
    const resolved = WhiteLabelService.resolveTenantFromHost(hostname);
    const b = resolved.branding;

    return {
      brandName: {
        bn: b.brandName,
        en: b.brandName,
        ja: b.brandName === 'NIHOMI™' ? 'ニホミ™' : b.brandName
      },
      brandNameJa: {
        bn: b.brandNameJa,
        en: b.brandNameJa,
        ja: b.brandNameJa
      },
      watermarkText: {
        bn: b.watermarkText,
        en: b.watermarkText,
        ja: b.watermarkText
      },
      certifiedSealText: {
        bn: b.certifiedSealText,
        en: b.certifiedSealText,
        ja: b.certifiedSealText
      }
    };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nihomi_preferred_lang') as Language;
      if (saved && (saved === 'bn' || saved === 'en' || saved === 'ja')) {
        setLanguageState(saved);
      }
    } catch (e) {
      console.warn('Language persistence error:', e);
    }

    if (typeof window !== 'undefined') {
      const resolved = WhiteLabelService.resolveTenantFromHost(window.location.hostname);
      const b = resolved.branding;
      setBrandingTokens({
        brandName: {
          bn: b.brandName,
          en: b.brandName,
          ja: b.brandName === 'NIHOMI™' ? 'ニホミ™' : b.brandName
        },
        brandNameJa: {
          bn: b.brandNameJa,
          en: b.brandNameJa,
          ja: b.brandNameJa
        },
        watermarkText: {
          bn: b.watermarkText,
          en: b.watermarkText,
          ja: b.watermarkText
        },
        certifiedSealText: {
          bn: b.certifiedSealText,
          en: b.certifiedSealText,
          ja: b.certifiedSealText
        }
      });
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('nihomi_preferred_lang', lang);
    } catch (e) {
      console.warn('Language storage error:', e);
    }
  };

  const setDictionaryOverride = (key: string, value: string) => {
    setDynamicOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const t = (key: string): string => {
    if (dynamicOverrides[key]) {
      return dynamicOverrides[key];
    }
    if (brandingTokens[key]) {
      return brandingTokens[key][language] || brandingTokens[key]['en'] || brandingTokens[key]['bn'];
    }
    return translations[key]?.[language] || translations[key]?.['en'] || translations[key]?.['bn'] || key;
  };

  // Compile active dictionary for external UI component inspections
  const dynamicDictionary: Record<string, string> = {
    ...Object.keys(translations).reduce((acc, k) => {
      acc[k] = translations[k][language] || translations[k]['en'] || translations[k]['bn'];
      return acc;
    }, {} as Record<string, string>),
    ...Object.keys(brandingTokens).reduce((acc, k) => {
      acc[k] = brandingTokens[k][language] || brandingTokens[k]['en'] || brandingTokens[k]['bn'];
      return acc;
    }, {} as Record<string, string>),
    ...dynamicOverrides
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dynamicDictionary, setDictionaryOverride }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    const tokens = ContentDesignSystem.getDesignTokens();
    return {
      language: 'bn',
      setLanguage: () => {},
      t: (key: string) => {
        if (key === 'brandNameJa') return tokens.brandNameJa;
        if (key === 'brandName') return tokens.brandName;
        if (key === 'watermarkText') return tokens.watermarkText;
        if (key === 'certifiedSealText') return tokens.certifiedSealText;
        return translations[key]?.['bn'] || translations[key]?.['en'] || key;
      },
      dynamicDictionary: {},
      setDictionaryOverride: () => {}
    };
  }
  return context;
};
