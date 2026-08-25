import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, X, Database, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineNotificationBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showDismissed, setShowDismissed] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustCameOnline(true);
      setShowDismissed(false);
      const timer = setTimeout(() => {
        setJustCameOnline(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !justCameOnline) {
    return null;
  }

  if (showDismissed && !justCameOnline) {
    return null;
  }

  if (justCameOnline) {
    return (
      <div
        id="online-restored-toast"
        className="fixed bottom-4 right-4 z-50 max-w-md bg-emerald-900 text-emerald-100 border border-emerald-700 rounded-xl shadow-2xl p-3.5 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-bold text-white">ইন্টারনেট পুনঃসংযোগ সম্পন্ন (Back Online)</div>
          <div className="text-[11px] text-emerald-200">
            Offline study progress & SRS reviews successfully synchronized with Nihomi Cloud.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setJustCameOnline(false)}
          className="text-emerald-300 hover:text-white p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      id="offline-notification-banner"
      aria-label="Offline Mode Active"
      className="bg-amber-600 dark:bg-amber-700 sepia:bg-amber-800 text-white px-4 py-2 text-xs font-medium sticky top-0 z-50 shadow-md transition-all animate-in fade-in duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="p-1 bg-amber-700/80 dark:bg-amber-800 rounded-md shrink-0">
            <WifiOff className="w-4 h-4 text-amber-200" />
          </span>
          <div>
            <span className="font-bold text-white">অফলাইন মোড সক্রিয় (Offline Mode Active):</span>{' '}
            <span className="text-amber-100">
              ইন্টারনেট সংযোগ না থাকলেও সার্ভিস ওয়ার্কার ও লোকাল ক্যাশ দিয়ে নিহোমি ফুল স্টাডি, ফ্ল্যাশ কার্ড ও প্র্যাকটিস নির্বিঘ্নে চলবে।
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 bg-amber-700/60 rounded text-[11px] text-amber-100 border border-amber-500/40">
            <Database className="w-3 h-3 text-amber-300" />
            <span>SW Cache & IndexedDB Active</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDismissed(true)}
            className="p-1 hover:bg-amber-700/60 rounded-md text-amber-200 hover:text-white transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
