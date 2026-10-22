// src/v2/pages/V2LessonPage.tsx
// NIHOMI V2 — INTERACTIVE GRAMMAR LOOP & PEDAGOGICAL GATE
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { InteractiveGrammarLoop } from '../../components/learning/InteractiveGrammarLoop';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { isGrammarEligible } from '../../core/curriculum/journeyEngine';

interface V2LessonPageProps {
  lessonId?: string;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2LessonPage: React.FC<V2LessonPageProps> = ({
  lessonId = 'n5-l01',
  onNavigate
}) => {
  const [knowledgeState, setKnowledgeState] = useState(loadLearnerKnowledgeState());

  useEffect(() => {
    setKnowledgeState(loadLearnerKnowledgeState());
  }, []);

  const grammarEligibility = isGrammarEligible(knowledgeState);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Return to Curriculum */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={() => onNavigate('curriculum')}
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কারিকুলামে ফিরে যান</span>
        </button>

        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          LESSON: {lessonId.toUpperCase()}
        </span>
      </div>

      {/* Prerequisite Gate Check */}
      {!grammarEligibility.eligible ? (
        <div className="bg-[#141726] border-2 border-red-500/40 rounded-3xl p-8 sm:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl shadow-red-600/10">
          <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
              পেডাগোজিক্যাল ফাউন্ডেশন গেট (Prerequisite Gate)
            </span>
            <h2 className="text-2xl font-black text-white">
              ব্যাকরণ শুরু করার আগে স্বরবর্ণ প্রয়োজন!
            </h2>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed text-left bg-black/40 p-5 rounded-2xl border border-white/5">
            {grammarEligibility.unmetReasonBn ||
              'নিহোমি লার্নিং ল্যাটিসের অমোঘ নিয়ম অনুযায়ী, জাপানিজ ব্যাকরণ বা সেন্টেন্স প্যাটার্ন শুরু করার পূর্বে মৌলিক ৫টি স্বরবর্ণ (あ, い, う, え, お) নির্ভুলভাবে চেনা ও লেখার দক্ষতা অর্জন করতে হবে।'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('kana', { char: 'あ' })}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            >
              <span>স্বরবর্ণ অনুশীলন শুরু করুন (あ)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('journey')}
              className="px-6 py-3.5 rounded-2xl bg-[#1E2338] hover:bg-[#252c48] border border-white/20 text-stone-300 hover:text-white font-bold text-sm cursor-pointer transition-colors"
            >
              টোকিও জার্নি ম্যাপে যান
            </button>
          </div>
        </div>
      ) : (
        /* Full Interactive Grammar Loop */
        <div className="bg-[#141726] border border-white/10 rounded-3xl p-6 sm:p-8">
          <InteractiveGrammarLoop
            lessonId={lessonId}
            onComplete={() => onNavigate('curriculum')}
          />
        </div>
      )}
    </div>
  );
};
