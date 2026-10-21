import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, ArrowRight, X, Heart, Bot } from 'lucide-react';

export type NomiPose = 'primary' | 'thinking' | 'encouraging' | 'celebrating' | 'listening';

export interface NomiSenseiCompanionProps {
  variant?: 'inline' | 'card' | 'banner' | 'compact';
  titleBn?: string;
  messageBn: string;
  hintBn?: string;
  actionLabelBn?: string;
  onAction?: () => void;
  characterPose?: NomiPose;
  className?: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
}

const POSE_ASSETS: Record<NomiPose, string> = {
  primary: '/brand/nomi-sensei/nomi-sensei-primary.png',
  thinking: '/brand/nomi/nomi-think.png',
  encouraging: '/brand/nomi/nomi-encourage.png',
  celebrating: '/brand/nomi/nomi-celebrate.png',
  listening: '/brand/nomi/nomi-listen.png'
};

export const NomiSenseiCompanion: React.FC<NomiSenseiCompanionProps> = ({
  variant = 'card',
  titleBn = 'Nomi Sensei (নমি সেন্সেই)',
  messageBn,
  hintBn,
  actionLabelBn,
  onAction,
  characterPose = 'primary',
  className = '',
  isDismissible = false,
  onDismiss
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [imgSrc, setImgSrc] = useState(POSE_ASSETS[characterPose]);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 ${className}`}>
        <img
          src={imgSrc}
          onError={() => setImgSrc('/brand/nomi-sensei/nomi-sensei-primary.png')}
          alt="Nomi Sensei — আপনার জাপানি ভাষা শিক্ষক"
          className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-amber-400/40"
        />
        <span className="font-medium leading-snug">{messageBn}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/30 via-[#181126] to-[#100c1e] border border-amber-500/30 ${className}`}>
        <img
          src={imgSrc}
          onError={() => setImgSrc('/brand/nomi-sensei/nomi-sensei-primary.png')}
          alt="Nomi Sensei — আপনার জাপানি ভাষা শিক্ষক"
          className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-amber-400/40 shadow-md"
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{titleBn}</span>
          </div>
          <p className="text-xs text-stone-200 leading-relaxed font-medium">{messageBn}</p>
          {hintBn && (
            <p className="text-[11px] text-amber-400/90 font-mono pt-0.5">💡 {hintBn}</p>
          )}
        </div>
        {isDismissible && (
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-stone-400 hover:text-white transition"
            aria-label="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // Default 'card' variant (Rich, dockable, responsive)
  return (
    <div
      className={`relative p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#1a1333] via-[#130e26] to-[#0a0717] border border-amber-500/35 shadow-xl overflow-hidden ${className}`}
    >
      {/* Decorative ambient glows */}
      <div className="pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -left-10 -top-10 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Companion Avatar */}
        <div className="relative shrink-0">
          <img
            src={imgSrc}
            onError={() => setImgSrc('/brand/nomi-sensei/nomi-sensei-primary.png')}
            alt="Nomi Sensei — আপনার জাপানি ভাষা শিক্ষক"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-xl bg-black/40"
          />
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-600 text-[9px] font-black text-white font-japanese shadow-sm">
            先生
          </div>
        </div>

        {/* Companion Content */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>{titleBn}</span>
            </div>
            {isDismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg text-stone-400 hover:text-white transition cursor-pointer"
                aria-label="নমি সেন্সেই বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
            {messageBn}
          </p>

          {hintBn && (
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{hintBn}</span>
            </div>
          )}

          {actionLabelBn && onAction && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer active:scale-98"
              >
                <span>{actionLabelBn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NomiSenseiCompanion;
