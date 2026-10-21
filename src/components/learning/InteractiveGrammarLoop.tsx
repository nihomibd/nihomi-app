// src/components/learning/InteractiveGrammarLoop.tsx
// NIHOMI.COM — CANONICAL INTERACTIVE N.I.H.O.M.I. GRAMMAR LEARNING LOOP
// Strictly follows the 6 Constitution Stages: Notice -> Identify -> Hunt -> Own -> Make Meaning -> Improve
// Transforms static reference reading into an engaging, interactive pedagogical mastery cycle.

import React, { useState } from 'react';
import {
  Eye,
  Target,
  Search,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Award
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { NihomiConstitutionStageId, NIHOMI_CONSTITUTION_STAGES } from './NihomiLearningConstitution';

export interface InteractiveGrammarLoopProps {
  lessonId?: string;
  lessonTitle?: string;
  onComplete?: () => void;
  className?: string;
}

export const InteractiveGrammarLoop: React.FC<InteractiveGrammarLoopProps> = ({
  lessonId = 'n5-l1',
  lessonTitle = 'JLPT N5 Lesson 01: 〜は〜です (Topic Marker & Identity)',
  onComplete,
  className = ''
}) => {
  const [activeStage, setActiveStage] = useState<NihomiConstitutionStageId>('notice_scene');
  const [completedStages, setCompletedStages] = useState<Set<NihomiConstitutionStageId>>(new Set());

  // Stage 3 (Hunt) State
  const [huntSentenceIndex, setHuntSentenceIndex] = useState(0);
  const [huntSelectedWord, setHuntSelectedWord] = useState<string | null>(null);
  const [huntFeedback, setHuntFeedback] = useState<string | null>(null);
  const [huntSolved, setHuntSolved] = useState(false);

  // Stage 4 (Own Answer) State
  const [assembledTokens, setAssembledTokens] = useState<string[]>([]);
  const [builderSolved, setBuilderSolved] = useState(false);
  const [builderFeedback, setBuilderFeedback] = useState<string | null>(null);

  // Stage 5 (Make Meaning) State
  const [meaningSelectedOption, setMeaningSelectedOption] = useState<number | null>(null);
  const [meaningSubmitted, setMeaningSubmitted] = useState(false);

  // Stage 6 (Improve / Mastery Gate) State
  const [masterySelectedOption, setMasterySelectedOption] = useState<number | null>(null);
  const [masterySubmitted, setMasterySubmitted] = useState(false);
  const [isLessonMastered, setIsLessonMastered] = useState(false);

  const huntChallenges = [
    {
      sentenceJa: 'わたし は がくせい です',
      tokens: ['わたし', 'は', 'がくせい', 'です'],
      targetToken: 'は',
      meaningBn: 'আমি ছাত্র। (I am a student.)',
      promptBn: 'টপিক মার্কার (Topic Marker) কোনটি? ট্যাপ করো:'
    },
    {
      sentenceJa: 'かれ は せんせい です',
      tokens: ['かれ', 'は', 'せんせい', 'です'],
      targetToken: 'です',
      meaningBn: 'তিনি শিক্ষক। (He is a teacher.)',
      promptBn: 'বিনম্র সমাপিকা ক্রিয়া (Polite Copula) কোনটি? ট্যাপ করো:'
    }
  ];

  const builderAvailableTokens = ['わたし', 'は', 'タンヴィル', 'です'];
  const builderTargetSentence = ['わたし', 'は', 'タンヴィル', 'です'];

  const advanceToStage = (next: NihomiConstitutionStageId) => {
    soundEffects.playButtonTap();
    setCompletedStages(prev => new Set([...prev, activeStage]));
    setActiveStage(next);
  };

  const handleHuntTokenClick = (token: string) => {
    if (huntSolved) return;
    setHuntSelectedWord(token);
    const currentHunt = huntChallenges[huntSentenceIndex];

    if (token === currentHunt.targetToken) {
      soundEffects.playCorrectPing();
      setHuntSolved(true);
      setHuntFeedback(`✔ চমৎকার! '${token}' হলো সঠিক সংকেত।`);
    } else {
      soundEffects.playIncorrectSoft();
      setHuntFeedback(`❌ '${token}' লক্ষ্য নয়। ভালো করে লক্ষ্য করো—কোনটি টপিক নির্দেশ করে বা বাক্য শেষ করে?`);
    }
  };

  const handleNextHunt = () => {
    if (huntSentenceIndex < huntChallenges.length - 1) {
      setHuntSentenceIndex(prev => prev + 1);
      setHuntSelectedWord(null);
      setHuntFeedback(null);
      setHuntSolved(false);
    } else {
      advanceToStage('own_answer');
    }
  };

  const handleBuilderTokenClick = (token: string) => {
    if (builderSolved) return;
    soundEffects.playButtonTap();
    const nextTokens = [...assembledTokens, token];
    setAssembledTokens(nextTokens);

    const isMatchSoFar = nextTokens.every((t, i) => t === builderTargetSentence[i]);
    if (!isMatchSoFar) {
      soundEffects.playIncorrectSoft();
      setBuilderFeedback('ক্রম ভুল হয়েছে! আবার চেষ্টা করুন।');
    } else if (nextTokens.length === builderTargetSentence.length) {
      soundEffects.playCorrectPing();
      setBuilderSolved(true);
      setBuilderFeedback('🎉 দারুণ! আপনি সম্পূর্ণ সঠিক জাপানি বাক্য তৈরি করেছেন: わたし は タンヴィル です (আমি তানভীর)।');
      triggerCelebrationConfetti();
    }
  };

  const handleResetBuilder = () => {
    setAssembledTokens([]);
    setBuilderSolved(false);
    setBuilderFeedback(null);
  };

  const handleMasterySubmit = () => {
    if (masterySelectedOption === null) return;
    setMasterySubmitted(true);

    if (masterySelectedOption === 0) {
      soundEffects.playLessonCelebration();
      triggerCelebrationConfetti();
      setIsLessonMastered(true);
      setCompletedStages(prev => new Set([...prev, 'improve_retry']));
      onComplete?.();
    } else {
      soundEffects.playIncorrectSoft();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl bg-[#0f111c] border border-amber-500/30 p-5 sm:p-7 text-white shadow-2xl space-y-6 ${className}`}>
      {/* Header & Canonical N.I.H.O.M.I. Cycle Tracker */}
      <div className="space-y-4 border-b border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>N.I.H.O.M.I. লার্নিং সাইকেল™</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{lessonTitle}</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">ধাপ {NIHOMI_CONSTITUTION_STAGES.findIndex(s => s.id === activeStage) + 1} / 6</span>
        </div>

        {/* 6 Constitution Steps Visual Indicator Bar */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {NIHOMI_CONSTITUTION_STAGES.map((s) => {
            const isActive = activeStage === s.id;
            const isDone = completedStages.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStage(s.id)}
                className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400 shadow-md'
                    : isDone
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="font-mono text-xs font-black">{s.letter}</div>
                <div className="text-[10px] truncate hidden sm:block">{s.labelBn}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE 1: N - NOTICE THE SCENE (দৃশ্য দেখো ও শোনো)                         */}
      {/* ========================================================================= */}
      {activeStage === 'notice_scene' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-left">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>১. বাস্তব পরিস্থিতি মনোযোগ দিয়ে লক্ষ্য করো</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              টোকিও নারিতা বিমানবন্দরে ইমিগ্রেশন পার হয়ে বা ভাষা স্কুলে প্রথম দিনে নিজের পরিচয় দেওয়া সবচেয়ে গুরুত্বপূর্ণ মুহূর্ত। নিচের বাক্যটি শুনুন:
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-japanese font-black text-white block">
                はじめまして、わたし は タンヴィル です。
              </span>
              <span className="text-xs sm:text-sm font-mono text-amber-300/90 block">
                Hajimemashite, watashi wa Tanvir desu.
              </span>
              <span className="text-sm text-slate-300 block pt-1">
                (পরিচিত হয়ে আনন্দিত, আমি তানভীর।)
              </span>
            </div>

            <button
              type="button"
              onClick={() => speakJapanese('はじめまして、わたしはタンヴィルです。どうぞよろしくおねがいします。')}
              className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>উচ্চারণ শুনুন (Listen Native Audio)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => advanceToStage('identify_task')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>কাঠামো শনাক্ত করি (Next: Identify) →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: I - IDENTIFY THE TASK (কাজটি চেনো ও সূত্র বোঝো)                  */}
      {/* ========================================================================= */}
      {activeStage === 'identify_task' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-2 text-left">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>২. ব্যাকরণ কাঠামো শনাক্তকরণ (Structural Blueprint)</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              জাপানি ভাষায় নিজের পরিচয় বা যেকোনো বিষয়ের বিবরণ দিতে এই মূল সূত্রটি মুখস্থ রাখতে হবে:
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-cyan-500/30 text-center space-y-4 shadow-xl">
            <div className="inline-block p-3 rounded-2xl bg-[#090b14] border border-cyan-500/40 text-xl sm:text-2xl font-mono font-black text-cyan-300">
              [ A (বিষয়) ] <span className="text-rose-400 font-bold">は</span> [ B (পরিচয়/তথ্য) ] <span className="text-emerald-400 font-bold">です</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-rose-400 font-japanese text-sm">は (উচ্চারণ: Wa)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  টপিক মার্কার (Topic Marker)। এটি বোঝায় বক্তা কাকে নিয়ে কথা বলছেন ("আমি সম্পর্কে বলি তো...")।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400 font-japanese text-sm">です (উচ্চারণ: Desu)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  বিনম্র সমাপিকা ক্রিয়া (Polite Copula: am / is / are)। এটি জাপানি শিষ্টাচার প্রকাশ করে।
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => advanceToStage('hunt_signals')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>সংকেত অনুসন্ধান খেলায় যাই (Next: Hunt Signals) →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: H - HUNT FOR SIGNALS (Clue খোঁজো — ইন্টারঅ্যাক্টিভ স্পট গেম)       */}
      {/* ========================================================================= */}
      {activeStage === 'hunt_signals' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1 text-left">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>৩. বাক্যে সঠিক মার্কার সংকেত খুঁজে ট্যাপ করো</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-200">
              {huntChallenges[huntSentenceIndex].promptBn}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5 shadow-xl">
            <div className="text-xs text-slate-400">
              বাক্য: <span className="text-white font-medium">{huntChallenges[huntSentenceIndex].meaningBn}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
              {huntChallenges[huntSentenceIndex].tokens.map((token, i) => {
                const isSelected = huntSelectedWord === token;
                const isCorrectTarget = token === huntChallenges[huntSentenceIndex].targetToken;
                let style = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';
                if (isSelected) {
                  style = isCorrectTarget
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400'
                    : 'bg-rose-950 border-rose-500 text-rose-200';
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleHuntTokenClick(token)}
                    className={`px-4 py-3 rounded-2xl border text-lg sm:text-xl font-japanese font-bold transition-all cursor-pointer active:scale-95 ${style}`}
                  >
                    {token}
                  </button>
                );
              })}
            </div>

            {huntFeedback && (
              <div className={`p-3 rounded-2xl text-xs sm:text-sm font-bold animate-in fade-in ${huntSolved ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300' : 'bg-rose-950/70 border border-rose-500 text-rose-300'}`}>
                {huntFeedback}
              </div>
            )}
          </div>

          {huntSolved && (
            <button
              type="button"
              onClick={handleNextHunt}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-in fade-in"
            >
              <span>{huntSentenceIndex < huntChallenges.length - 1 ? 'পরের সংকেত খুঁজি →' : 'নিজে বাক্য গঠন করি (Next: Own Answer) →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: O - OWN YOUR ANSWER (নিজে বাক্য তৈরি করো)                          */}
      {/* ========================================================================= */}
      {activeStage === 'own_answer' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1 text-left">
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>৪. নিজের হাতে সঠিক জাপানি বাক্য তৈরি করো</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-200">
              লক্ষ্য: "আমি তানভীর (I am Tanvir)" বাক্যটি তৈরি করতে নিচের শব্দগুলোতে সঠিক ক্রমে চাপ দিন:
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
            {/* Word assembly zone */}
            <div className="min-h-16 p-4 rounded-2xl bg-[#090a14] border-2 border-dashed border-purple-500/40 flex items-center justify-center gap-2 flex-wrap">
              {assembledTokens.length === 0 ? (
                <span className="text-xs text-slate-500">নিচ থেকে শব্দ নির্বাচন করুন...</span>
              ) : (
                assembledTokens.map((t, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-japanese font-bold text-lg shadow">
                    {t}
                  </span>
                ))
              )}
            </div>

            {/* Selection Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {builderAvailableTokens.map((token, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBuilderTokenClick(token)}
                  disabled={builderSolved}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-japanese text-base font-bold border border-slate-700 transition cursor-pointer active:scale-95"
                >
                  {token}
                </button>
              ))}
              <button
                type="button"
                onClick={handleResetBuilder}
                className="px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="রিসেট"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>মুছুন</span>
              </button>
            </div>

            {builderFeedback && (
              <div className={`p-3 rounded-2xl text-xs sm:text-sm font-bold animate-in fade-in ${builderSolved ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300' : 'bg-rose-950/70 border border-rose-500 text-rose-300'}`}>
                {builderFeedback}
              </div>
            )}
          </div>

          {builderSolved && (
            <button
              type="button"
              onClick={() => advanceToStage('make_meaning')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-in fade-in"
            >
              <span>অর্থ ও সংস্কৃতির গভীরতা বুঝি (Next: Make Meaning) →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: M - MAKE MEANING (কারণ বোঝো ও মেমোরি হুক)                       */}
      {/* ========================================================================= */}
      {activeStage === 'make_meaning' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1 text-left">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>৫. জাপানি সংস্কৃতির সারমর্ম ও স্মৃতিসূত্র</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-200">
              জাপানিরা নিজেকে নিয়ে কথা বলার সময় 'は' কেন ব্যবহার করে?
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-4 shadow-xl">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <p className="font-bold text-amber-300">💡 গোল্ডেন মেমোরি রুল:</p>
              <p>
                'は' (Wa) কেবল একটি ব্যাকরণ নয়—এটি বিনম্রতার প্রতীক। বক্তা যখন বলেন <span className="font-japanese font-bold text-white">わたし は</span>, তখন শ্রোতার পূর্ণ মনোযোগ চলে যায় তার পরের তথ্যের ওপর ("তানভীর", "ছাত্র", বা "বাংলাদেশি")।
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-white block">দ্রুত উপলব্ধি পরীক্ষা: 'わたし は がくせい です' বাক্যে বক্তা কী প্রকাশ করছেন?</span>
              {[
                { text: 'নিজের পেশা বা ছাত্র পরিচয় বিনম্রভাবে তুলে ধরছেন।', isCorrect: true },
                { text: 'অন্য কাউকে আদেশ বা অনুরোধ করছেন।', isCorrect: false }
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMeaningSelectedOption(i);
                    setMeaningSubmitted(true);
                    if (opt.isCorrect) soundEffects.playCorrectPing();
                    else soundEffects.playIncorrectSoft();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                    meaningSubmitted
                      ? opt.isCorrect
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                        : meaningSelectedOption === i
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      : meaningSelectedOption === i
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          {meaningSubmitted && meaningSelectedOption === 0 && (
            <button
              type="button"
              onClick={() => advanceToStage('improve_retry')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-in fade-in"
            >
              <span>চূড়ান্ত মাস্টারি আনলক গেটে যাই (Next: Mastery Gate) →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 6: I - IMPROVE & RETRY (মাস্টারি গেট ও লেসন আনলক)                   */}
      {/* ========================================================================= */}
      {activeStage === 'improve_retry' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25 space-y-1 text-left">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              <span>৬. চূড়ান্ত ব্যাকরণ মাস্টারি যাচাই (Mastery Gate)</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-200">
              টোকিওতে ইন্টারভিউ বোর্ডে নিজের পরিচয় দেওয়ার জন্য কোন বাক্যটি শতভাগ নির্ভুল?
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-3 shadow-xl">
            {[
              {
                textJa: 'わたし は エンジニア です。',
                textBn: 'আমি প্রকৌশলী (I am an engineer) — [A は B です]',
                isCorrect: true
              },
              {
                textJa: 'エンジニア は わたし です。',
                textBn: 'প্রকৌশলী হলো আমি (উল্টো ক্রম)',
                isCorrect: false
              },
              {
                textJa: 'わたし です エンジニア は。',
                textBn: 'ক্রিয়া মাঝখানে বসেছে (ভুল জাপানি ক্রম)',
                isCorrect: false
              }
            ].map((opt, idx) => {
              const isSelected = masterySelectedOption === idx;
              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

              if (masterySubmitted) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-800 text-slate-500';
                }
              } else if (isSelected) {
                style = 'bg-sky-500/20 border-sky-400 text-white ring-1 ring-sky-400';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!masterySubmitted) setMasterySelectedOption(idx);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${style}`}
                >
                  <div className="space-y-0.5">
                    <span className="font-japanese font-black text-lg block">{opt.textJa}</span>
                    <span className="text-xs text-slate-400 block">{opt.textBn}</span>
                  </div>
                  {masterySubmitted && (
                    <div>
                      {opt.isCorrect ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <X className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!masterySubmitted ? (
            <button
              type="button"
              disabled={masterySelectedOption === null}
              onClick={handleMasterySubmit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>মাস্টারি যাচাই ও পাঠ সম্পন্ন করুন →</span>
            </button>
          ) : isLessonMastered ? (
            <div className="p-5 rounded-3xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>লেসন ০১ ব্যাকরণ দক্ষতা অর্জিত • +৫০ XP</span>
              </div>
              <h3 className="text-lg font-black text-white">অভিনন্দন! আপনি জাপানিজ বাক্যের প্রথম কাঠামো সম্পূর্ণ জয় করেছেন!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                '〜は〜です' ব্যবহার করে আপনি এখন জাপানে নির্ভুলভাবে নিজের নাম, পেশা ও জাতীয়তার পরিচয় দিতে পারেন।
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMasterySubmitted(false);
                setMasterySelectedOption(null);
              }}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition"
            >
              আবার চেষ্টা করুন (Try Again)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveGrammarLoop;
