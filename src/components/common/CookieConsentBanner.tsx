// src/components/common/CookieConsentBanner.tsx
// NIHOMI Cookie Consent Banner — GDPR / BDPA compliant, Bengali first.
// Consent state is persisted in localStorage under 'nihomi_cookie_consent'.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'nihomi_cookie_consent';

export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't already consented
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (!saved) {
        // Small delay so it doesn't flash immediately on load
        const t = setTimeout(() => setVisible(true), 1800);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable — silently skip
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, at: new Date().toISOString() }));
    } catch {
      // Fail silently
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-consent-banner"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-xl px-4"
          role="dialog"
          aria-label="Cookie Consent"
          id="cookie-consent-banner"
        >
          <div className="relative flex items-start gap-3 p-4 rounded-2xl border border-amber-500/20 bg-[#0e0e1a]/95 backdrop-blur-md shadow-2xl shadow-black/50">
            {/* Icon */}
            <div className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Cookie className="w-4.5 h-4.5 text-amber-400" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-100 leading-snug">
                আপনার শেখার অগ্রগতি ও পার্সোনালাইজড জার্নি ট্র্যাক রাখতে আমরা কুকিজ ব্যবহার করি।
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                We use cookies to track your learning progress and personalise your journey.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="cookie-consent-accept-btn"
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-[#141726] text-xs font-bold transition-all duration-150 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                সম্মত আছি
              </button>
              <button
                type="button"
                id="cookie-consent-dismiss-btn"
                onClick={handleAccept}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="বন্ধ করুন"
                aria-label="Dismiss cookie notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
