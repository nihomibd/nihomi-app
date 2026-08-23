import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, X, DownloadCloud, Sparkles } from 'lucide-react';

interface OfflineNotificationToastProps {
  onOpenOfflineDownloads?: () => void;
}

export const OfflineNotificationToast: React.FC<OfflineNotificationToastProps> = ({
  onOpenOfflineDownloads
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'offline' | 'online'>('offline');

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      setToastType('offline');
      setShowToast(true);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setToastType('online');
      setShowToast(true);
      // Auto-hide online toast after 4 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div
      id="connectivity-notification-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      {toastType === 'offline' ? (
        <div className="bg-stone-900/95 border-2 border-amber-500/80 text-white rounded-3xl p-4.5 shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                <WifiOff className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 font-serif flex items-center gap-1.5">
                  <span>Offline Mode Activated</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-200">
                    অফলাইন মোড
                  </span>
                </h4>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                  Your internet connection is currently offline. Nihomi offline caching is keeping downloaded lessons, kanji drills, and local quizzes fully operational!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-xs">
            <span className="text-[11px] text-stone-400">
              Quiz attempts will auto-sync on reconnect.
            </span>
            <button
              onClick={() => setShowToast(false)}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-[11px] transition cursor-pointer shadow-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/95 border-2 border-emerald-500/80 text-white rounded-3xl p-4.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-300 font-serif">
                Back Online! (অনলাইন সংযুক্ত)
              </h4>
              <p className="text-[11px] text-emerald-100/80">
                Your connection has been restored. Study progress and streak data are syncing to cloud.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-900 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
