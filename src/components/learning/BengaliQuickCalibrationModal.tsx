// src/components/learning/BengaliQuickCalibrationModal.tsx
// NIHOMI.COM — BENGALI-FIRST QUICK CALIBRATION MODAL
// 5-Track Diagnostic: Zero Japanese, Some Hiragana, Dual Kana, JLPT, Returning Learner
// Displays unambiguous "আপনার শুরু করার জায়গা", verified capabilities, unverified gaps,
// and single primary action "পরের সেরা পাঠ শুরু করুন".

import React, { useState } from 'react';
import {
  X,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Volume2,
  RotateCcw,
  BookOpen,
  Layers,
  Award,
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  CALIBRATION_TRACKS,
  TRACK_QUESTIONS,
  CalibrationTrackId,
  CalibrationResult,
  evaluateCalibration,
  applyCalibrationToState
} from '../../core/curriculum/quickCalibrationEngine';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';

interface BengaliQuickCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlacementApplied: (nodeId: string, viewRoute: string, viewParams?: Record<string, any>) => void;
  onExploreCourses?: () => void;
}

export const BengaliQuickCalibrationModal: React.FC<BengaliQuickCalibrationModalProps> = ({
  isOpen,
  onClose,
  onPlacementApplied,
  onExploreCourses
}) => {
  const [selectedTrack, setSelectedTrack] = useState<CalibrationTrackId | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<CalibrationResult | null>(null);

  if (!isOpen) return null;

  const currentTrackInfo = CALIBRATION_TRACKS.find((t) => t.id === selectedTrack);
  const activeQuestions = selectedTrack ? TRACK_QUESTIONS[selectedTrack] : [];
  const activeQuestion = activeQuestions[currentQuestionIndex];
  const isQuizPhase = selectedTrack && selectedTrack !== 'track_zero' && !result;

  const handleSelectTrack = (trackId: CalibrationTrackId) => {
    soundEffects.playButtonTap();
    setSelectedTrack(trackId);
    setAnswers({});
    setCurrentQuestionIndex(0);

    // Track A (Zero Japanese) needs no test; evaluate immediately!
    if (trackId === 'track_zero') {
      const evaluation = evaluateCalibration('track_zero', {});
      setResult(evaluation);
      soundEffects.playCorrectPing();
    }
  };

  const handleAnswerQuestion = (optionIndex: number) => {
    if (!activeQuestion || !selectedTrack) return;
    soundEffects.playButtonTap();

    const updatedAnswers = {
      ...answers,
      [activeQuestion.id]: optionIndex
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions in track
      const evaluation = evaluateCalibration(selectedTrack, updatedAnswers);
      setResult(evaluation);
      if (evaluation.score >= 2) {
        soundEffects.playLevelUp();
        triggerCelebrationConfetti();
      } else {
        soundEffects.playCorrectPing();
      }
    }
  };

  const handleStartMission = () => {
    if (!result) return;
    soundEffects.playButtonTap();
    const updatedState = applyCalibrationToState(result);
    onPlacementApplied(
      result.startingNodeId,
      result.recommendedMission.viewRoute,
      result.recommendedMission.viewParams
    );
    onClose();
  };

  const handleRestart = () => {
    soundEffects.playButtonTap();
    setSelectedTrack(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0F141C] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow Ambient */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  তোমার শেখার শুরুটা ঠিক করি
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  তুমি কতটুকু জানো?
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                তোমার বর্তমান অবস্থা অনুযায়ী সবচেয়ে সঠিক শুরুর পয়েন্ট বেছে নাও
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 3 Distinct Phases */}
        <div className="overflow-y-auto pr-1 space-y-5 flex-1">
          {/* ========================================================== */}
          {/* PHASE 1: TRACK SELECTION (If no track selected)            */}
          {/* ========================================================== */}
          {!selectedTrack && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>সহজ লেভেল যাচাই:</strong> তুমি এখন জাপানি ভাষার কোন পর্যায়ে আছো? নিচের ৪টি অপশন থেকে বেছে নাও:
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CALIBRATION_TRACKS.map((t) => {
                  const symbolJa =
                    t.id === 'track_zero' ? 'あ' :
                    t.id === 'track_some_hiragana' ? 'あ・い' :
                    t.id === 'track_dual_kana' ? 'あ+ア' : 'N5–N1';

                  const badgeColor =
                    t.id === 'track_zero' ? 'border-rose-500/30 text-rose-300 bg-rose-500/15' :
                    t.id === 'track_some_hiragana' ? 'border-amber-500/30 text-amber-300 bg-amber-500/15' :
                    t.id === 'track_dual_kana' ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/15' :
                    'border-indigo-500/30 text-indigo-300 bg-indigo-500/15';

                  return (
                    <button
                      key={t.id}
                      id={`calibration-track-${t.id}`}
                      type="button"
                      onClick={() => handleSelectTrack(t.id)}
                      className="p-4 rounded-2xl bg-[#161D2B] hover:bg-[#1C2536] border border-slate-800 hover:border-rose-500/40 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center font-japanese font-black text-white text-base group-hover:scale-105 group-hover:border-rose-500/50 transition-all">
                            {symbolJa}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                              {t.titleBn}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {t.taglineBn}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t.descriptionBn}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${badgeColor}`}>
                          {t.badgeBn}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* PHASE 2: VERIFIED QUIZ QUESTIONS (Tracks B, C, D, E)       */}
          {/* ========================================================== */}
          {isQuizPhase && activeQuestion && (
            <div className="space-y-5 animate-in fade-in">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>
                    প্রশ্ন {currentQuestionIndex + 1} / {activeQuestions.length} ({currentTrackInfo?.titleBn})
                  </span>
                  <span>
                    অগ্রগতি: {Math.round(((currentQuestionIndex) / activeQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Japanese Prompt Box */}
              <div className="bg-[#161D2B] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  লেভেল যাচাই প্রশ্ন
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white font-japanese tracking-wider">
                    {activeQuestion.promptJa}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakJapanese(activeQuestion.promptJa)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition cursor-pointer"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                {activeQuestion.furigana && (
                  <div className="text-xs text-slate-400 font-mono">
                    {activeQuestion.furigana}
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-bold text-white pt-2 border-t border-slate-800/80">
                  {activeQuestion.questionBn}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerQuestion(idx)}
                    className="p-4 rounded-xl bg-[#161D2B] hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/40 text-left text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <span>{opt.labelBn}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* PHASE 3: UNAMBIGUOUS RESULT CARD                           */}
          {/* ========================================================== */}
          {result && (
            <div id="calibration-result-card" className="space-y-5 animate-in zoom-in-95 duration-200">
              {/* Main Starting Point Banner */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#161D2B] via-[#1b2334] to-[#121722] border-2 border-rose-500/40 shadow-xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>তুমি এখান থেকে শুরু করো • আপনার শুরু করার জায়গা (Your Starting Point)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {result.titleBn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {result.rationaleBn}
                </p>
                {result.totalQuestions > 0 && (
                  <div className="text-xs font-mono text-emerald-400 font-semibold pt-1">
                    যাচাইয়ের স্কোর: {result.score} / {result.totalQuestions} সঠিক
                  </div>
                )}
              </div>

              {/* Two-Column Audit: Verified vs Unverified */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Verified Capabilities */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>কী কী যাচাই করা হয়েছে</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.verifiedCapabilities.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unverified Capabilities */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>কী কী এখনও লক করা বা বাকি</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.unverifiedCapabilities.map((u, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  id="btn-calibration-start-next-mission"
                  onClick={handleStartMission}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>পরের সেরা পাঠ শুরু করুন</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>পুনরায় টেস্ট দিন</span>
                  </button>

                  {onExploreCourses && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onExploreCourses();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
                    >
                      কোর্স ওভারভিউ দেখুন →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
