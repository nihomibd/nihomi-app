import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone/installed mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed prompt in the last 7 days
    const dismissedTimestamp = localStorage.getItem('nihomi_pwa_install_dismissed_at');
    if (dismissedTimestamp) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) {
        setIsDismissed(true);
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.removeItem('nihomi_pwa_install_dismissed_at');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instruction for browsers like iOS Safari
      alert('To install Nihomi on iOS: Tap the Share button in Safari, then select "Add to Home Screen" 📲');
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    } catch (err) {
      console.warn('PWA install error:', err);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('nihomi_pwa_install_dismissed_at', Date.now().toString());
  };

  // Do not render if installed or dismissed or not installable
  if (isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <div
      id="nihomi-pwa-install-banner"
      className="fixed bottom-4 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-auto bg-[#0C0A09]/95 dark:bg-[#0C0A09]/95 sepia:bg-[#2b1f14]/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-stone-800 sepia:border-amber-900/60 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-serif font-black text-lg shadow-lg shrink-0 border border-red-500/30">
            日
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-white tracking-wide">
                Nihomi অ্যাপ ইনস্টল করুন
              </h4>
              <span className="px-1.5 py-0.2 bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-bold rounded uppercase">
                PWA Fast
              </span>
            </div>
            <p className="text-[11px] text-stone-300 leading-tight">
              অফলাইনে মিনি-লেসন ও কাঞ্জি অনুশীলন করুন হোম স্ক্রিন থেকে।
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-stone-400 pt-0.5">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> অফলাইন সাপোর্ট
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-stone-300" /> মোবাইল ও পিসি
              </span>
            </div>
          </div>
        </div>

        <button
          id="btn-dismiss-pwa-install"
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex items-center justify-end space-x-2 pt-2 border-t border-stone-800/80">
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 transition font-medium cursor-pointer"
        >
          পরে করব
        </button>
        <button
          id="btn-pwa-install-action"
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="px-4 py-1.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-900/30 flex items-center space-x-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isInstalling ? 'ইনস্টল হচ্ছে...' : 'ইনস্টল অ্যাপ'}</span>
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
