// src/components/missions/TokyoKonbiniFirstMissionModal.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  X,
  Store,
  ArrowRight,
  Trophy,
  RotateCcw,
  ShoppingBag,
  Check,
  Award
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { trackNihomiEvent } from '../../utils/analytics';

interface TokyoKonbiniFirstMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const TokyoKonbiniFirstMissionModal: React.FC<TokyoKonbiniFirstMissionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onNavigate
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const playClerkGreeting = () => {
    soundEffects.playButtonClick();
    speakJapanese('いらっしゃいませ！ レジ袋はご利用ですか？');
  };

  const handleSelect = (id: string, textJa: string) => {
    if (isCompleted) return;
    setSelectedOption(id);
    setIsEvaluated(true);
    soundEffects.playButtonClick();
    speakJapanese(textJa);

    if (id === 'opt1' || id === 'opt3') {
      soundEffects.playCorrect();
      setTimeout(() => {
        setIsCompleted(true);
        triggerCelebrationConfetti();
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('nihomi_mission_konbini_completed', 'true');
            const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
            localStorage.setItem('nihomi_student_xp', (prevXp + 50).toString());
            window.dispatchEvent(new CustomEvent('nihomi:progress-updated'));
          }
        } catch {}
        trackNihomiEvent('mission_completed', {
          missionId: 'tokyo_konbini_01',
          choice: id,
          score: 100
        });
      }, 900);
    } else {
      soundEffects.playWrong();
    }
  };

  const handleFinish = () => {
    onComplete();
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0d0d1a] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 text-white my-auto overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              Mission 01: Tokyo Konbini
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCENARIO SCREEN */}
        {!isCompleted ? (
          <div className="space-y-6 relative z-10">
            {/* Konbini Scene Setting Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#181a2e] to-[#121324] border border-amber-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <Store className="w-4 h-4" />
                  <span>টোকিও কনবিনি (7-Eleven / Lawson) কাউন্টার</span>
                </div>
                <button
                  type="button"
                  onClick={playClerkGreeting}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>শুনুন</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-stone-400">
                  তুমি টোকিওর একটি কনবিনিতে দাঁড়িয়ে আছো। ক্যাশিয়ার তোমাকে দেখে হাসিমুখে বললেন:
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  「いらっしゃいませ！ レジ袋はご利用ですか？」
                </div>
                <div className="text-xs text-amber-200/90 font-mono">
                  (Irasshaimase! Rejibukuro wa go-riyō desu ka?)
                </div>
                <div className="text-xs text-stone-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  অর্থ: <span className="font-semibold text-white">"স্বাগতম! আপনার কি শপিং ব্যাগ লাগবে?"</span>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                তোমার করণীয়:
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                প্লাস্টিক ব্যাগ লাগবে কি না জিজ্ঞেস করলে তুমি কী বলবে?
              </h3>
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
              {[
                {
                  id: 'opt1',
                  textJa: '大丈夫です、袋はいりません。',
                  romaji: 'Daijōbu desu, fukuro wa irimasen.',
                  textBn: 'ঠিক আছে, ব্যাগ লাগবে না। (প্রাকৃতিক জাপানিজ)',
                  isCorrect: true
                },
                {
                  id: 'opt2',
                  textJa: 'ありがとう、さようなら。',
                  romaji: 'Arigatō, sayōnara.',
                  textBn: 'ধন্যবাদ, বিদায়। (পরিস্থিতির সাথে মানানসই নয়)',
                  isCorrect: false
                },
                {
                  id: 'opt3',
                  textJa: 'はい、一枚お願いします。',
                  romaji: 'Hai, ichimai onegaishimasu.',
                  textBn: 'হ্যাঁ, একটি ব্যাগ দিন। (সঠিক ও ভদ্র)',
                  isCorrect: true
                }
              ].map((opt) => {
                const isThisSelected = selectedOption === opt.id;
                let borderClass = 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]';
                if (isEvaluated && isThisSelected) {
                  borderClass = opt.isCorrect
                    ? 'border-emerald-500 bg-emerald-500/15 text-white'
                    : 'border-red-500 bg-red-500/15 text-white';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id, opt.textJa)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${borderClass}`}
                  >
                    <div>
                      <div className="font-bold text-sm sm:text-base text-white">{opt.textJa}</div>
                      <div className="text-xs text-stone-400 font-mono mt-0.5">{opt.romaji}</div>
                      <div className="text-xs text-stone-300 mt-1">{opt.textBn}</div>
                    </div>
                    {isEvaluated && isThisSelected && (
                      <div>
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bengali Feedback for wrong answer */}
            {isEvaluated && selectedOption === 'opt2' && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1">
                <span className="font-bold">পুনরায় চেষ্টা করো:</span>
                <p>
                  জাপানে কেনাকাটার সময় বিদায় না জানিয়ে ব্যাগ লাগবে কি না তার উত্তর দেওয়া হয়। যেমন: ব্যাগ না লাগলে <strong>「大丈夫です (Daijōbu desu)」</strong> বলুন।
                </p>
              </div>
            )}
          </div>
        ) : (
          /* COMPLETION CELEBRATION SCREEN */
          <div className="space-y-6 text-center relative z-10 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 p-0.5 mx-auto shadow-2xl shadow-emerald-500/30">
              <div className="w-full h-full bg-[#0d0d1a] rounded-[22px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                MISSION ACCOMPLISHED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Mission Complete! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                তুমি বাস্তব জাপানের একটি পরিস্থিতি সফলভাবে হ্যান্ডেল করেছো।
              </p>
            </div>

            {/* Achievement Perks */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-lg font-black text-amber-300 font-mono">+50 XP</div>
                <div className="text-[11px] text-stone-400 mt-0.5">অভিজ্ঞতা পয়েন্ট</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-lg font-black text-emerald-400 font-mono">+10%</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Japan Readiness™</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left text-xs text-amber-200/90 leading-relaxed max-w-md mx-auto">
              💡 <strong>নিহোমি সেনসেই টিপ:</strong> জাপানের কনবিনিতে 'だいじょうぶです (Daijōbu desu)' বা 'いりません (Irimasen)' বললে ক্যাশিয়ার নিশ্চিত হয় এবং ব্যাগ চার্জ করে না।
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full max-w-sm mx-auto py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>আমার ড্যাশবোর্ডে যাই →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
