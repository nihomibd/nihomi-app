// src/components/onboarding/ConversationalOnboardingModal.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Compass,
  Briefcase,
  GraduationCap,
  Plane,
  Heart,
  Clock,
  BookOpen,
  MessageSquare,
  Store,
  Train,
  UtensilsCrossed,
  Award,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import {
  OnboardingAnswers,
  JapanGoalReason,
  CurrentJapaneseLevel,
  JapanTimeline,
  PrioritySituation,
  DailyTimeCommitment
} from '../../core/onboarding/onboardingTypes';
import {
  saveOnboardingAnswers,
  markOAuthPendingForOnboarding,
  syncOnboardingToProfile
} from '../../core/onboarding/onboardingStorage';
import { useAuth } from '../../context/AuthContext';
import { trackNihomiEvent } from '../../utils/analytics';
import { soundEffects } from '../../lib/soundEffects';

interface ConversationalOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: OnboardingAnswers) => void;
  isStandalone?: boolean;
}

export const ConversationalOnboardingModal: React.FC<ConversationalOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  isStandalone = false
}) => {
  const { user, loginWithGoogle } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isSubmittingOAuth, setIsSubmittingOAuth] = useState<boolean>(false);

  // Form responses
  const [reason, setReason] = useState<JapanGoalReason>('work');
  const [currentLevel, setCurrentLevel] = useState<CurrentJapaneseLevel>('absolute_beginner');
  const [timeline, setTimeline] = useState<JapanTimeline>('6_to_12_months');
  const [prioritySituation, setPrioritySituation] = useState<PrioritySituation>('konbini');
  const [dailyMinutes, setDailyMinutes] = useState<DailyTimeCommitment>(20);

  if (!isOpen) return null;

  const handleNext = () => {
    soundEffects.playButtonClick();
    if (step === 1) {
      trackNihomiEvent('journey_started', { reason });
    }
    setStep((prev) => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    soundEffects.playButtonClick();
    setStep((prev) => Math.max(1, prev - 1));
  };

  const getAnswers = (): OnboardingAnswers => ({
    reason,
    currentLevel,
    timeline,
    prioritySituation,
    dailyMinutes,
    completedAt: new Date().toISOString()
  });

  const handleFinalize = (isGuest = false) => {
    const finalAnswers = getAnswers();
    saveOnboardingAnswers(finalAnswers);
    trackNihomiEvent('onboarding_completed', {
      isGuest,
      reason: finalAnswers.reason,
      level: finalAnswers.currentLevel,
      timeline: finalAnswers.timeline
    });

    if (user) {
      syncOnboardingToProfile(finalAnswers).catch(() => {});
    }

    soundEffects.playLevelUp();
    onComplete(finalAnswers);
  };

  const handleGoogleContinue = async () => {
    setIsSubmittingOAuth(true);
    soundEffects.playButtonClick();
    const finalAnswers = getAnswers();
    saveOnboardingAnswers(finalAnswers);
    markOAuthPendingForOnboarding();
    trackNihomiEvent('onboarding_completed', {
      method: 'google_oauth_pending',
      reason: finalAnswers.reason
    });

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/journey` : undefined;
      const success = await loginWithGoogle(redirectUrl);
      if (!success) {
        // Fallback to guest completion if OAuth popup was blocked
        handleFinalize(true);
      }
    } catch {
      handleFinalize(true);
    } finally {
      setIsSubmittingOAuth(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto ${
        isStandalone ? 'relative bg-transparent p-0 z-0' : ''
      }`}
    >
      <div className="relative w-full max-w-2xl bg-[#0e0d1b] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 text-white my-auto overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Progress */}
        <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase">
              {step <= 5 ? `প্রশ্ন ${step} / ৫` : 'জার্নি রেডি 🇯🇵'}
            </span>
          </div>

          {!isStandalone && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden relative z-10">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* ================================================================= */}
        {/* QUESTION 1: REASON                                               */}
        {/* ================================================================= */}
        {step === 1 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 inline-block mb-2">
                লক্ষ্য নির্ধারণ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                তুমি জাপানে যেতে চাও কেন?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                তোমার নির্দিষ্ট লক্ষ্যের ওপর ভিত্তি করে নিহোমি তোমার কারিকুলাম সাজাবে।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'study', title: 'উচ্চশিক্ষা (Study)', desc: 'বিশ্ববিদ্যালয় বা গ্র্যাজুয়েট স্কুল', icon: GraduationCap },
                { id: 'work', title: 'চাকরি / SSW ভিসা (Work)', desc: 'আইটি, ইঞ্জিনিয়ারিং বা স্পেসিফায়েড স্কিলড', icon: Briefcase },
                { id: 'language_school', title: 'ল্যাঙ্গুয়েজ স্কুল (Language School)', desc: 'জাপানে ১-২ বছর ভাষা শিক্ষা', icon: BookOpen },
                { id: 'travel', title: 'ভ্রমণ (Travel)', desc: 'টোকিও, কিয়োটো ও ঘুরে দেখা', icon: Plane },
                { id: 'long_term', title: 'স্থায়ী বসবাস (Long-term Life)', desc: 'পরিবার নিয়ে জাপানে স্থায়ী জীবন', icon: Heart }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = reason === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setReason(opt.id as JapanGoalReason);
                      soundEffects.playButtonClick();
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-red-500/15 border-red-500 text-white shadow-lg shadow-red-500/10 scale-[1.01]'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-stone-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-red-600 text-white' : 'bg-white/5 text-stone-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{opt.title}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* QUESTION 2: CURRENT LEVEL                                        */}
        {/* ================================================================= */}
        {step === 2 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-2">
                বর্তমান যোগ্যতা
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                জাপানি এখন কতটুকু পারো?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                লজ্জা পাওয়ার কিছু নেই! একদম শূন্য থেকে শুরু হলেও নিহোমি তোমাকে হাত ধরে শেখাবে।
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'absolute_beginner', label: 'একদম নতুন (Zero Japanese)', desc: 'জাপানি বর্ণ বা কোনো শব্দ এখনও শিখিনি' },
                { id: 'know_kana', label: 'Hiragana/Katakana জানি', desc: 'অক্ষরগুলো চিনি ও অল্প রিডিং পড়তে পারি' },
                { id: 'know_some_words', label: 'কিছু শব্দ ও সম্ভাষণ পারি', desc: 'Konnichiwa, Arigatou ইত্যাদি প্রাথমিক বাক্য বলতে পারি' },
                { id: 'jlpt_n5', label: 'JLPT N5 বেসিক জানি', desc: 'মিন্না নো নিহোঙ্গো ১-২৫ বা এন৫ লেভেলের ব্যাকরণ পড়া আছে' },
                { id: 'jlpt_n4_plus', label: 'N4 বা তার বেশি (N4+)', desc: 'সাবলীল কথোপকথন ও মধ্যবর্তী ব্যাকরণ শিখতে চাই' }
              ].map((opt) => {
                const isSelected = currentLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCurrentLevel(opt.id as CurrentJapaneseLevel);
                      soundEffects.playButtonClick();
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white">{opt.label}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{opt.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পেছনে</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* QUESTION 3: TIMELINE                                             */}
        {/* ================================================================= */}
        {step === 3 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-block mb-2">
                সময়সীমা
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                তোমার Japan plan কবে?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                নির্দিষ্ট সময় অনুযায়ী তোমার দৈনিক পড়ার পেসিং ঠিক করা হবে।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: '3_to_6_months', label: '৩–৬ মাস', desc: 'খুব শীঘ্রই যাত্রা (Fast Track)' },
                { id: '6_to_12_months', label: '৬–১২ মাস', desc: 'পরবর্তী সেশনের জন্য প্রস্তুত (Standard)' },
                { id: '1_to_2_years', label: '১–২ বছর', desc: 'ধীরে সুস্থে নিশ্চিত প্রস্তুতি (Steady)' },
                { id: 'exploring', label: 'এখনও ভাবছি', desc: 'আগে ভালো করে শিখি তারপর দেখব (Flexible)' }
              ].map((opt) => {
                const isSelected = timeline === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTimeline(opt.id as JapanTimeline);
                      soundEffects.playButtonClick();
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-stone-300'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{opt.label}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পেছনে</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* QUESTION 4: PRIORITY SITUATION                                   */}
        {/* ================================================================= */}
        {step === 4 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 inline-block mb-2">
                বাস্তব পরিস্থিতি
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                জাপানে কোন পরিস্থিতি সবচেয়ে confidently handle করতে চাও?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                নিহোমি শুধু বইয়ের ভাষা নয়—বাস্তব জাপানের চ্যালেঞ্জিং পরিস্থিতি ড্রিল করায়।
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'konbini', label: 'Konbini (কনবিনি চ্যালেঞ্জ)', desc: '7-Eleven বা Lawson-এ ক্যাশিয়ারের সাথে কেনাকাটা ও ব্যাগ হ্যান্ডলিং', icon: Store },
                { id: 'speaking', label: 'Speaking (সাবলীল কথা বলা)', desc: 'ভয় কাটিয়ে স্বতঃস্ফূর্ত জাপানিজে কথা বলা ও পিচ অ্যাকসেন্ট', icon: MessageSquare },
                { id: 'train_travel', label: 'Train & Travel (ট্রেন ও দিকনির্দেশনা)', desc: 'টোকিও সাবওয়ে, টিকিট কাটা ও রাস্তা হারিয়ে না যাওয়া', icon: Train },
                { id: 'restaurant', label: 'Restaurant (রেস্তোরাঁয় অর্ডার)', desc: 'মেন্যু দেখে অর্ডার করা ও কাস্টমাইজেশন', icon: UtensilsCrossed },
                { id: 'job_interview', label: 'Job / Baito Interview (ইন্টারভিউ)', desc: 'বাইতো ও কাজের জন্য আত্মবিশ্বাসী উত্তর ও কেইগো', icon: Briefcase }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = prioritySituation === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPrioritySituation(opt.id as PrioritySituation);
                      soundEffects.playButtonClick();
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-stone-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-600 text-white' : 'bg-white/5 text-stone-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-sm text-white">{opt.label}</div>
                      <div className="text-xs text-stone-400 mt-0.5">{opt.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পেছনে</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* QUESTION 5: DAILY COMMITMENT                                     */}
        {/* ================================================================= */}
        {step === 5 && (
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right duration-200">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-2">
                দৈনিক লক্ষ্য
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                প্রতিদিন কতটুকু সময় দিতে পারবে?
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                অল্প হলেও ধারাবাহিকতা সবচেয়ে গুরুত্বপূর্ণ। দিনে ১০ মিনিটও কার্যকর!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { min: 10, label: '10 min / দিন', desc: 'হালকা কিন্তু নিয়মিত', badge: 'ক্যাজুয়াল' },
                { min: 20, label: '20 min / দিন', desc: 'সর্বোচ্চ কার্যকর পেস', badge: 'জনপ্রিয়' },
                { min: 30, label: '30 min / দিন', desc: 'দ্রুত প্রবৃদ্ধি', badge: 'প্রস্তাবিত' },
                { min: 45, label: '45+ min / দিন', desc: 'ইনটেনসিভ জাম্প', badge: 'ফাস্ট ট্র্যাক' }
              ].map((opt) => {
                const isSelected = dailyMinutes === opt.min;
                return (
                  <button
                    key={opt.min}
                    type="button"
                    onClick={() => {
                      setDailyMinutes(opt.min as DailyTimeCommitment);
                      soundEffects.playButtonClick();
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-[1.01]'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-mono text-base font-black text-white">{opt.label}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-bold text-stone-300">
                        {opt.badge}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400">{opt.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পেছনে</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>জার্নি তৈরি করুন →</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 6: AUTH GATE PLACEMENT (HIGH CONVERSION HOOK)                */}
        {/* ================================================================= */}
        {step === 6 && (
          <div className="space-y-6 relative z-10 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 mx-auto shadow-2xl shadow-red-600/30">
              <div className="w-full h-full bg-[#0e0d1b] rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                তোমার Japan Journey তৈরি হয়ে গেছে! 🇯🇵
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                তোমার পার্সোনালাইজড জার্নিটি সংরক্ষণ করতে Google দিয়ে কন্টিনিউ করো।
              </p>
            </div>

            {/* Quick summary badges */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>🎯 লক্ষ্য:</span>
                <span className="font-bold text-white uppercase">{reason}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>⚡ বর্তমান লেভেল:</span>
                <span className="font-bold text-amber-300">
                  {currentLevel === 'absolute_beginner' ? 'একদম নতুন (Zero)' : currentLevel}
                </span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>⏱️ দৈনিক প্র্যাকটিস:</span>
                <span className="font-bold text-emerald-400">{dailyMinutes} মিনিট</span>
              </div>
            </div>

            {/* Google OAuth & Alternate CTA */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={handleGoogleContinue}
                disabled={isSubmittingOAuth}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-95 disabled:opacity-70"
              >
                {isSubmittingOAuth ? (
                  <Loader2 className="w-5 h-5 animate-spin text-stone-800" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Google দিয়ে Continue করি →</span>
              </button>

              <button
                type="button"
                onClick={() => handleFinalize(true)}
                className="w-full py-3 px-4 rounded-xl text-stone-400 hover:text-white text-xs font-semibold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>অ্যাকাউন্ট ছাড়াও জার্নি ও প্রথম মিশন দেখতে চাই →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
