import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  X,
  Smartphone,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles
} from 'lucide-react';
import { trackPwaInstallPrompt, trackPwaInstallAccepted, trackPwaInstallDismissed } from '../../utils/analytics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallPWAProps {
  delayMs?: number;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ delayMs = 15000 }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isTimeTriggered, setIsTimeTriggered] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone / installed mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS / Safari
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // 3. Check dismissal memory (7 days cooling period)
    const dismissedTimestamp = localStorage.getItem('nihomi_pwa_install_dismissed_at');
    if (dismissedTimestamp) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) {
        setIsDismissed(true);
      }
    }

    // 4. Intercept Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem('nihomi_pwa_install_dismissed_at');
    };

    // 5. 15-second site engagement timer
    const timer = setTimeout(() => {
      setIsTimeTriggered(true);
    }, delayMs);

    // 6. Manual trigger listener
    const handleManualTrigger = () => {
      setIsDismissed(false);
      setIsTimeTriggered(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('nihomi:trigger-install-pwa', handleManualTrigger);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('nihomi:trigger-install-pwa', handleManualTrigger);
    };
  }, [delayMs]);

  // Track when prompt becomes visible to user
  const hasLoggedShown = useRef(false);
  useEffect(() => {
    if (!isInstalled && !isDismissed && isTimeTriggered && !hasLoggedShown.current) {
      hasLoggedShown.current = true;
      trackPwaInstallPrompt(isIOS ? 'ios_safari' : deferredPrompt ? 'android_chrome' : 'generic_web');
    }
  }, [isInstalled, isDismissed, isTimeTriggered, isIOS, deferredPrompt]);

  const handleInstallClick = async () => {
    // If on iOS or no beforeinstallprompt, show the 2-step iOS/Safari instructions
    if (isIOS || !deferredPrompt) {
      setShowIosGuide(true);
      trackPwaInstallPrompt('ios_safari_guide_opened');
      return;
    }

    // Android / Chromium native install prompt
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        trackPwaInstallAccepted('android_chrome');
      } else {
        trackPwaInstallDismissed('browser_dialog_cancelled');
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('nihomi_pwa_install_dismissed_at', Date.now().toString());
    trackPwaInstallDismissed(showIosGuide ? 'ios_guide_dismissed' : 'banner_later_button');
  };

  // Do not show if already installed, dismissed, or 15s timer has not elapsed yet
  if (isInstalled || isDismissed || !isTimeTriggered) {
    return null;
  }

  return (
    <aside
      id="nihomi-pwa-install-banner"
      aria-label="PWA Install Prompt"
      className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 z-50 md:max-w-md bg-[#0d0d18]/95 dark:bg-[#0d0d18]/95 sepia:bg-[#251b12]/95 text-stone-100 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80 border border-emerald-500/40 sepia:border-amber-700/60 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 text-left"
    >
      {showIosGuide ? (
        /* iOS / Safari 2-Step Tooltip Guide */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <Smartphone className="w-4 h-4" />
              <span>আইফোন / Safari তে ইনস্টল করার নিয়ম</span>
            </div>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs space-y-2.5 text-stone-200">
            <div className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                ১
              </span>
              <p className="leading-snug">
                Safari ব্রাউজারের নিচে বা উপরে <strong className="text-emerald-300 inline-flex items-center gap-1">Share <Share2 className="w-3.5 h-3.5 inline" /></strong> আইকনে চাপ দিন
              </p>
            </div>

            <div className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                ২
              </span>
              <p className="leading-snug">
                নিচে স্ক্রোল করে <strong className="text-emerald-300 inline-flex items-center gap-1">'Add to Home Screen' <PlusSquare className="w-3.5 h-3.5 inline" /></strong> সিলেক্ট করুন
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
            >
              ← পেছনে যান
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
            >
              বুঝেছি, পরে করব
            </button>
          </div>
        </div>
      ) : (
        /* High-Converting Standard Mobile Prompter */
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              {/* Kanji / App Badge with Emerald Beacon */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white font-serif font-black text-xl shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
                  日
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0d0d18]"></span>
                </span>
              </div>

              {/* Exact Requested Title & Description */}
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                  📲 নিহোমি অ্যাপ আপনার হোম স্ক্রিনে যুক্ত করুন
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-300 leading-snug">
                  বিনা ডাউনলোডে সরাসরি মোবাইলে অ্যাপের মতো ব্যবহার করুন এবং অফলাইনে কাঞ্জি রিভিশন দিন।
                </p>
                {isIOS && (
                  <button
                    type="button"
                    onClick={() => setShowIosGuide(true)}
                    className="text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-1 pt-0.5 cursor-pointer"
                  >
                    <span>আইফোনে কীভাবে ইনস্টল করবেন? গাইড দেখুন →</span>
                  </button>
                )}
              </div>
            </div>

            {/* Top Close Dismiss */}
            <button
              id="btn-dismiss-pwa-install-top"
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer shrink-0"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Value Pillars */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] text-emerald-300/90">
            <span className="bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ০ MB স্টোরেজ
            </span>
            <span className="bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> অফলাইন কাঞ্জি
            </span>
            <span className="bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> ১-ট্যাপ ফুলস্ক্রিন
            </span>
          </div>

          {/* Action Buttons: [এখনই ইনস্টল করুন (Emerald Button)] and [পরে করব (Dismiss)] */}
          <div className="mt-3.5 flex items-center justify-end space-x-2.5 pt-2.5 border-t border-stone-800/80">
            <button
              id="btn-dismiss-pwa-install"
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
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-emerald-950/50 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalling ? 'ইনস্টল হচ্ছে...' : 'এখনই ইনস্টল করুন'}</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default InstallPWA;
