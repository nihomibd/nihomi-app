// src/components/learning/PlacementDiagnosticModal.tsx
// Canonical Placement Diagnostic Modal for Experienced Learners
// Law 8: Experienced learners placed at exact node with retroactive prerequisite hydration

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Volume2,
  Compass,
  RotateCcw
} from 'lucide-react';
import {
  PLACEMENT_DIAGNOSTIC_QUESTIONS,
  evaluatePlacementAnswers,
  applyPlacementResult,
  PlacementAssessmentResult
} from '../../core/curriculum/placementEngine';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { speakJapanese } from '../../lib/tts';
import { trackNihomiEvent } from '../../utils/analytics';

interface PlacementDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlacementApplied: (nodeId: string, viewRoute: string, viewParams?: Record<string, any>) => void;
}

export const PlacementDiagnosticModal: React.FC<PlacementDiagnosticModalProps> = ({
  isOpen,
  onClose,
  onPlacementApplied
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PlacementAssessmentResult | null>(null);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_DIAGNOSTIC_QUESTIONS[currentStep];
  const isFinished = currentStep >= PLACEMENT_DIAGNOSTIC_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    const updatedAnswers = { ...answers, [currentQ.id]: index };
    setAnswers(updatedAnswers);

    if (currentStep < PLACEMENT_DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Completed diagnostic
      const evaluation = evaluatePlacementAnswers(updatedAnswers);
      setResult(evaluation);
      setCurrentStep(PLACEMENT_DIAGNOSTIC_QUESTIONS.length);
      trackNihomiEvent('placement_test_completed', {
        score: evaluation.score,
        tier: evaluation.tier,
        placedNode: evaluation.recommendedStartingNodeId
      });
    }
  };

  const handleApply = () => {
    if (!result) return;
    const currentState = loadLearnerKnowledgeState();
    const updatedState = applyPlacementResult(result.tier, currentState);
    trackNihomiEvent('placement_applied', {
      tier: result.tier,
      startingNodeId: result.recommendedStartingNodeId
    });
    onPlacementApplied(
      result.recommendedStartingNodeId,
      result.recommendedStartingMission.viewRoute,
      result.recommendedStartingMission.viewParams
    );
    onClose();
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0F141C] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-white overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                জাপানিজ প্লেসমেন্ট ডায়াগনস্টিক
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  5 Min Fast Track
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                আগে কিছুটা জাপানি শেখা থাকলে আপনার সঠিক লেভেলে সরাসরি প্রবেশ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isFinished && currentQ ? (
          <div>
            {/* Step Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>প্রশ্ন {currentStep + 1} / {PLACEMENT_DIAGNOSTIC_QUESTIONS.length}</span>
              <span>অগ্রগতি: {Math.round(((currentStep) / PLACEMENT_DIAGNOSTIC_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / PLACEMENT_DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Prompt Box */}
            <div className="bg-[#161D2B] border border-slate-800 rounded-2xl p-6 mb-6 text-center">
              <div className="text-xs text-rose-400 uppercase tracking-widest font-bold mb-2">
                ডায়াগনস্টিক প্রশ্ন
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                {currentQ.questionBn}
              </h3>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/40 border border-slate-700/60 text-2xl font-bold text-amber-300">
                <span>{currentQ.promptJa}</span>
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQ.promptJa)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left p-4 rounded-xl border border-slate-800 bg-[#161D2B]/80 hover:bg-rose-500/10 hover:border-rose-500/40 text-slate-200 hover:text-white transition-all font-medium flex items-center justify-between group"
                >
                  <span>{opt.labelBn}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/60">
              <span>উত্তর নিশ্চিত করলে পরবর্তী প্রশ্ন আসবে</span>
              <button
                onClick={() => handleSelectOption(999)}
                className="text-slate-400 hover:text-slate-300 underline"
              >
                জানা নেই / এড়িয়ে যাই
              </button>
            </div>
          </div>
        ) : result ? (
          /* Result Summary */
          <div className="text-center py-4">
            <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
              <Trophy className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              আপনার প্লেসমেন্ট মূল্যায়ন সম্পন্ন!
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
              {result.messageBn}
            </p>

            <div className="bg-[#161D2B] border border-slate-800 rounded-2xl p-5 mb-6 text-left max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <span className="text-xs text-slate-400 uppercase font-semibold">মূল্যায়ন স্কোর</span>
                <span className="text-sm font-bold text-amber-400">{result.score} / {result.totalQuestions} সঠিক</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <span className="text-xs text-slate-400 uppercase font-semibold">প্লেসমেন্ট ধাপ</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                  {result.tier}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase font-semibold">নির্ধারিত মিশন</span>
                <span className="text-sm font-bold text-white">
                  {result.recommendedStartingMission.titleBn}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={handleRestart}
                className="px-5 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                আবার পরীক্ষা দিই
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-sm font-bold shadow-lg shadow-rose-900/40 transition flex items-center gap-2"
              >
                <span>এই লেভেলে যাত্রা শুরু করি</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
