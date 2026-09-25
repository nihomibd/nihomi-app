// src/components/learning/GoldenLearningLoopModal.tsx
// NIHOMI SENSEI AI™ — GOLDEN LEARNING LOOP COMPONENT
// Loop: Situation → Goal → Input → Attempt → Feedback → Retry → Success → Memory → Transfer → Mastery

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  Send,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  X,
  Coins,
  ShieldCheck,
  Store,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { soundEffects } from '../../lib/soundEffects';
import { memoryOS } from '../canvas3d/engine/MemoryOSEngine';

export interface NextExperienceData {
  id: string;
  situation: string;
  situationJa: string;
  situationBn: string;
  goal: string;
  goalJa: string;
  goalBn: string;
  whyExplanation: string;
  targetPhraseJa: string;
  targetPhraseRomaji: string;
  targetPhraseEn: string;
  targetPhraseBn: string;
  keigoRuleNote: string;
  actionType: 'experience' | 'workos' | 'recovery_drill' | 'lesson';
  targetView: string;
  targetParams?: Record<string, any>;
  rewardCoins: number;
  rewardXp: number;
}

interface GoldenLearningLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: NextExperienceData | null;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  onSuccessReward?: (coins: number, xp: number) => void;
  onMasteryComplete?: () => void;
  onExploreTokyo?: () => void;
}

export const MISSION_REELS_SEQUENCE: NextExperienceData[] = [
  {
    id: 'exp-golden-path-001',
    situation: '7-Eleven Shibuya (渋谷スクランブル前)',
    situationJa: 'セブン-イレブン 渋谷スクランブル店',
    situationBn: 'শিবুয়া ক্রসিং সেভেন-ইলেভেন',
    goal: "Mission 1: Buy Water & Decline Plastic Bag",
    goalJa: '水を1本買い、レジ袋を丁寧に断る（袋は結構です）',
    goalBn: 'মিশন ১: এক বোতল পানি কেনা ও শপিং ব্যাগ বিনম্রভাবে না বলা',
    whyExplanation: 'Practice polite refusal in real Tokyo convenience stores.',
    targetPhraseJa: 'お水を1本ください。袋は結構です。',
    targetPhraseRomaji: 'Omizu o ippon kudasai. Fukuro wa kekkou desu.',
    targetPhraseEn: 'One bottle of water, please. No bag needed, thank you.',
    targetPhraseBn: 'এক বোতল পানি দিন দয়া করে। ব্যাগ লাগবে না।',
    keigoRuleNote: '『結構です (Kekkou desu)』is the polished way to decline optional items.',
    actionType: 'experience',
    targetView: 'landing',
    targetParams: { hotspotId: 'spot-conbini' },
    rewardCoins: 20,
    rewardXp: 50
  },
  {
    id: 'exp-golden-path-002',
    situation: 'Starbucks Tsutaya Shibuya (スターバックス 渋谷店)',
    situationJa: 'スターバックス 渋谷TSUTAYA店',
    situationBn: 'শিবুয়া স্টারবাকস কফি শপ',
    goal: "Mission 2: Order Iced Matcha Latte (Tall Size)",
    goalJa: 'アイス抹茶ラテのトールサイズを1つ注文する',
    goalBn: 'মিশন ২: স্টারবাকসে আইসড মাচ্চা লাতে অর্ডার করা',
    whyExplanation: 'Order custom drinks at Tokyo cafes like a local.',
    targetPhraseJa: 'アイス抹茶ラテのトールを1つお願いします。',
    targetPhraseRomaji: 'Aisu matcha rate no tooru o hitotsu onegaishimasu.',
    targetPhraseEn: 'One Tall Iced Matcha Latte, please.',
    targetPhraseBn: 'একটি টল সাইজ আইসড মাচ্চা লাতে দিন দয়া করে।',
    keigoRuleNote: 'Use『〜をお願いします (o onegaishimasu)』for polite customer requests.',
    actionType: 'experience',
    targetView: 'landing',
    targetParams: { hotspotId: 'spot-cafe' },
    rewardCoins: 25,
    rewardXp: 60
  },
  {
    id: 'exp-golden-path-003',
    situation: 'Shibuya Station Hachiko Gate (渋谷駅 ハチ公口)',
    situationJa: 'JR渋谷駅 ハチ公改札口',
    situationBn: 'জেআর শিবুয়া স্টেশন হাচিকো গেট',
    goal: "Mission 3: Ask Station Staff for Yamanote Line Platform",
    goalJa: '駅員に山手線のホームの場所を尋ねる',
    goalBn: 'মিশন ৩: স্টেশন মাস্টারকে ইয়ামানতে ট্রেনের প্ল্যাটফর্ম জিজ্ঞেস করা',
    whyExplanation: 'Essential navigation phrase for the Tokyo train network.',
    targetPhraseJa: 'すみません、山手線のホームはどこですか？',
    targetPhraseRomaji: 'Sumimasen, Yamanote-sen no hoomu wa doko desu ka?',
    targetPhraseEn: 'Excuse me, where is the Yamanote Line platform?',
    targetPhraseBn: 'শুনুন, ইয়ামানতে লাইনের প্ল্যাটফর্মটি কোনদিকে?',
    keigoRuleNote: '『すみません (Sumimasen)』opens any respectful inquiry in Japan.',
    actionType: 'experience',
    targetView: 'landing',
    targetParams: { hotspotId: 'spot-station' },
    rewardCoins: 30,
    rewardXp: 75
  }
];

export const GoldenLearningLoopModal: React.FC<GoldenLearningLoopModalProps> = ({
  isOpen,
  onClose,
  experience,
  onNavigate,
  onSuccessReward,
  onMasteryComplete,
  onExploreTokyo
}) => {
  const [step, setStep] = useState<'prompt' | 'attempt' | 'evaluating' | 'retry' | 'success'>('prompt');
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [missionIndex, setMissionIndex] = useState(0);
  const recognitionRef = useRef<any>(null);

  const expData: NextExperienceData = experience
    ? (missionIndex === 0 ? experience : MISSION_REELS_SEQUENCE[missionIndex % MISSION_REELS_SEQUENCE.length])
    : MISSION_REELS_SEQUENCE[missionIndex % MISSION_REELS_SEQUENCE.length];

  const nextMissionPreview: NextExperienceData =
    MISSION_REELS_SEQUENCE[(missionIndex + 1) % MISSION_REELS_SEQUENCE.length];

  const handleNextContinuousMission = () => {
    soundEffects.playCorrectPing();
    setMissionIndex((prev) => prev + 1);
    setStep('prompt');
    setUserInput('');
    setEvaluation(null);
  };

  useEffect(() => {
    if (isOpen) {
      setStep('prompt');
      setUserInput('');
      setEvaluation(null);
    }
  }, [isOpen]);

  // Web Speech recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Web Speech Recognition. Please type your answer.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAudioPlayback = (text: string) => {
    stopJapaneseSpeech();
    speakJapanese(text);
  };

  const handleSubmitAttempt = async () => {
    if (!userInput.trim()) return;
    setStep('evaluating');

    try {
      const res = await fetch('/api/ai/evaluate-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situationId: expData.id,
          userInput: userInput.trim(),
          targetPhraseJa: expData.targetPhraseJa
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);

        // Record locally into Nihomi MemoryOS™
        memoryOS.recordAttempt({
          phraseJa: expData.targetPhraseJa,
          meaningEn: expData.targetPhraseEn,
          jlptLevel: 'N5',
          qualityScore: data.scoreGrade || 4,
          studentInput: userInput.trim()
        });

        if (data.isCorrect) {
          setStep('success');
          soundEffects.playLessonCelebration();
          triggerCelebrationConfetti();
          onSuccessReward?.(data.coinsAwarded || expData.rewardCoins, data.xpAwarded || expData.rewardXp);
          onMasteryComplete?.();
        } else {
          setStep('retry');
          soundEffects.playIncorrectSoft();
        }
      } else {
        // Graceful Client-side fallback for static/edge deployment
        handleClientFallbackEvaluation();
      }
    } catch {
      handleClientFallbackEvaluation();
    }
  };

  const handleClientFallbackEvaluation = () => {
    const isClose = userInput.includes('水') || userInput.includes('ください') || userInput.includes('結構');
    if (isClose) {
      setStep('success');
      soundEffects.playLessonCelebration();
      triggerCelebrationConfetti();
      setEvaluation({
        isCorrect: true,
        feedbackJa: 'すばらしい！東京の店舗で通じる自然な日本語です。',
        feedbackBn: 'চমৎকার! টোকিওর দোকানে সরাসরি ব্যবহারযোগ্য স্বাভাবিক জাপানি।',
        coinsAwarded: expData.rewardCoins,
        xpAwarded: expData.rewardXp
      });
      onSuccessReward?.(expData.rewardCoins, expData.rewardXp);
      onMasteryComplete?.();
    } else {
      setStep('retry');
      soundEffects.playIncorrectSoft();
      setEvaluation({
        isCorrect: false,
        feedbackJa: 'もう一度声に出して練習してみましょう。',
        feedbackBn: 'লক্ষ্য বাক্যটি শুনে আরেকবার চেষ্টা করুন।'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-amber-500/30 text-slate-100 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6">
        
        {/* Header: Situation Context & Close */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>NIHOMI SENSEI AI™ • TODAY'S NEXT EXPERIENCE</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span>{expData.goal}</span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{expData.situation}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SITUATION & GOAL PRESENTATION */}
        {step === 'prompt' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                Why you need this phrase (বাস্তব জীবনের প্রাসঙ্গিকতা)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {expData.whyExplanation}
              </p>
            </div>

            {/* Target Japanese Audio Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-slate-950 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Target Japanese Phrase</span>
                <button
                  onClick={() => handleAudioPlayback(expData.targetPhraseJa)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Audio</span>
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-japanese">
                {expData.targetPhraseJa}
              </div>
              <div className="text-xs font-mono text-amber-300">
                {expData.targetPhraseRomaji}
              </div>
              <div className="text-xs text-slate-300">
                বাংলা: {expData.targetPhraseBn}
              </div>
              <div className="pt-2 text-[11px] text-emerald-400 font-medium border-t border-slate-800">
                💡 Keigo Norm: {expData.keigoRuleNote}
              </div>
            </div>

            {/* Ready to Attempt Button */}
            <button
              onClick={() => setStep('attempt')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <span>I'm Ready to Attempt • কথা বলুন বা লিখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: INPUT & ATTEMPT */}
        {(step === 'attempt' || step === 'evaluating') && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Speak or type the Japanese phrase for this situation:
            </div>

            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitAttempt(); }}
                placeholder="Say or type: お水を1本ください。袋は結構です。"
                className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('prompt')}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:text-white"
              >
                ← Review Phrase
              </button>

              <button
                type="button"
                disabled={step === 'evaluating' || !userInput.trim()}
                onClick={handleSubmitAttempt}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{step === 'evaluating' ? 'Sensei Evaluating...' : 'Submit Attempt'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RETRY STATE */}
        {step === 'retry' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-rose-300">
                <RotateCcw className="w-4 h-4" />
                <span>Nihomi Sensei AI™ Feedback:</span>
              </div>
              <p>{evaluation?.feedbackJa || 'もう一度正確なフレーズを確認して練習しましょう。'}</p>
              <p className="text-slate-300 font-sans">{evaluation?.feedbackBn}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Standard Reference:</div>
              <div className="text-sm font-bold text-white font-japanese">{expData.targetPhraseJa}</div>
              <div className="text-xs font-mono text-amber-300">{expData.targetPhraseRomaji}</div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => handleAudioPlayback(expData.targetPhraseJa)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Hear Native Audio</span>
              </button>

              <button
                onClick={() => {
                  setUserInput('');
                  setStep('attempt');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Attempt (আবার চেষ্টা করুন)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS, MEMORY UPDATE & TRANSFER */}
        {step === 'success' && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-white">Mission Accomplished! (মিশন সফল)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>+{expData.rewardCoins} Coins &bull; +{expData.rewardXp} XP</span>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {evaluation?.feedbackJa || 'すばらしい！完璧な丁寧語（敬語）です。東京のコンビニでそのまま使えます。'}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Nihomi MemoryOS™ updated: phrase logged with SuperMemo-2 scheduled retrieval.</span>
              </div>
            </div>

            {/* CONTINUOUS PLAY (THE REELS PRINCIPLE) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border-2 border-amber-400/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  REELS PRINCIPLE • CONTINUOUS ACTION
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  Next Up
                </span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  Next: {nextMissionPreview.goal}
                </h4>
                <p className="text-xs text-stone-300 font-japanese mt-0.5">
                  {nextMissionPreview.targetPhraseJa}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextContinuousMission}
                className="btn-haptic w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Play Next Mission ➔ (পরবর্তী মিশন শুরু করুন)</span>
                <ArrowRight className="w-4 h-4 fill-stone-950" />
              </button>
            </div>

            {/* Transfer & 3D Exploration Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  if (onExploreTokyo) {
                    onExploreTokyo();
                  } else if (onNavigate) {
                    onNavigate('landing', { hotspotId: 'spot-conbini' });
                  }
                }}
                className="btn-haptic p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-bold text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Experience in 3D Shibuya</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={onClose}
                className="btn-haptic p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold text-center transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
