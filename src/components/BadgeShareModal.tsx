import React, { useState } from 'react';
import { MilestoneBadge } from '../lib/badgesData.js';
import {
  X,
  Share2,
  Check,
  Sparkles,
  ExternalLink,
  Copy,
  MessageCircle
} from 'lucide-react';

interface BadgeShareModalProps {
  badge: MilestoneBadge | null;
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const BadgeShareModal: React.FC<BadgeShareModalProps> = ({
  badge,
  isOpen,
  onClose,
  userName = 'Learner'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !badge) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com';
  const shareText = `🏆 I just unlocked the "${badge.title}" (${badge.titleJa}) achievement badge on Nihomi! ${badge.description} 🇯🇵 Join my JLPT Japanese journey!`;
  const hashtags = 'Nihomi,JapaneseLearning,JLPT,LearnJapanese,Tokyo';

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}&hashtags=${encodeURIComponent(hashtags)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodeURIComponent(shareText)}`;
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${appUrl}`)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${appUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Nihomi Achievement: ${badge.title}`,
          text: shareText,
          url: appUrl
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const getRarityConfig = (rarity: MilestoneBadge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return {
          glow: 'shadow-amber-500/25 border-amber-400 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent',
          badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
          accent: 'text-amber-500'
        };
      case 'Epic':
        return {
          glow: 'shadow-purple-500/25 border-purple-400 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent',
          badge: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-700',
          accent: 'text-purple-500'
        };
      case 'Rare':
        return {
          glow: 'shadow-blue-500/20 border-blue-400 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent',
          badge: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-700',
          accent: 'text-blue-500'
        };
      default:
        return {
          glow: 'shadow-stone-500/10 border-stone-300 bg-stone-50/50',
          badge: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
          accent: 'text-stone-500'
        };
    }
  };

  const config = getRarityConfig(badge.rarity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative text-stone-900 dark:text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Share Achievement</span>
          </div>
          <h2 className="text-xl font-bold font-serif">Celebrate Your Milestone</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Inspire your fellow learners and showcase your verifiable Japanese progress.
          </p>
        </div>

        {/* Visual Badge Card Preview */}
        <div className={`p-5 rounded-3xl border-2 shadow-lg ${config.glow} space-y-3 text-center`}>
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mx-auto flex items-center justify-center text-3xl shadow-sm">
            🏆
          </div>

          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${config.badge}`}>
              {badge.rarity} &bull; {badge.category}
            </span>
            <h3 className="text-lg font-bold font-serif mt-1.5">{badge.title}</h3>
            <p className="text-xs font-serif font-bold text-red-600 dark:text-red-400">{badge.titleJa}</p>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
            {badge.description}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>+{badge.xpReward} XP Earned by {userName}</span>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block text-center">
            Select Share Destination
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter / X</span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Copy Formatted Message Button & Native Web Share */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-stone-200 dark:border-stone-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                title="Open System Share Menu"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
