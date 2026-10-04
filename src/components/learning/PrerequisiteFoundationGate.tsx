// src/components/learning/PrerequisiteFoundationGate.tsx
// Strict Pedagogical Gatekeeper Component for Locked Grammar / Advance Lessons
// Displays clear rationale, learner knowledge state, and 1-click CTA to the Next Best Mission.

import React from 'react';
import { Lock, ArrowRight, BookOpen, ShieldAlert, CheckCircle2, Sparkles, Home } from 'lucide-react';
import { NextBestMission, LessonGateStatus } from '../../core/curriculum/journeyEngine';
import { LearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';

interface PrerequisiteFoundationGateProps {
  gateStatus: LessonGateStatus;
  requestedLessonId: string;
  knowledgeState: LearnerKnowledgeState;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const PrerequisiteFoundationGate: React.FC<PrerequisiteFoundationGateProps> = ({
  gateStatus,
  requestedLessonId,
  knowledgeState,
  onNavigate,
}) => {
  const nextMission = gateStatus.nextBestMission;
  const knownKana = knowledgeState.knownHiragana;

  const handleGoToNextMission = () => {
    if (nextMission.viewRoute === 'lesson') {
      onNavigate('lesson', nextMission.viewParams || { lessonId: 'n5-l1' });
    } else if (nextMission.viewRoute === 'journey') {
      onNavigate('journey', nextMission.viewParams);
    } else {
      onNavigate(nextMission.viewRoute, nextMission.viewParams);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 text-white" id="prerequisite-foundation-gate">
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-[#131926] via-[#10141f] to-[#0b0e17] border border-amber-500/35 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gate Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>শিক্ষাক্রম প্রাক-শর্ত গেইট (Prerequisite Gate)</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {requestedLessonId.toUpperCase()}
          </span>
        </div>

        {/* Hero Visual & Headline */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            থামো! ব্যাকরণে প্রবেশের আগে অক্ষরের ভিত্তি প্রয়োজন
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {gateStatus.reasonBn}
          </p>
        </div>

        {/* Current Knowledge Summary vs Missing Prereqs */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800/80 pb-2">
            <span>তোমার বর্তমান জ্ঞান (Current State)</span>
            <span className="text-emerald-400 font-mono">
              {knownKana.length} বর্ণ আয়ত্তে
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">চেনা বর্ণসমূহ:</span>
            {knownKana.length > 0 ? (
              knownKana.map((k) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-japanese font-bold text-sm"
                >
                  {k}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic">এখনো শুরু হয়নি</span>
            )}
          </div>

          {gateStatus.requiredSkills && gateStatus.requiredSkills.length > 0 && (
            <div className="pt-1 text-[11px] text-amber-300/90 flex items-start gap-1.5">
              <span className="font-bold shrink-0">প্রয়োজনীয় শর্ত:</span>
              <span>{gateStatus.requiredSkills.join(' • ')}</span>
            </div>
          )}
        </div>

        {/* Primary CTA: Next Best Mission Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-slate-900 border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>তোমার পরবর্তী সঠিক মিশন (Next Best Mission)</span>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-black text-white">
              {nextMission.titleBn}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {nextMission.subTitleBn}
            </p>
          </div>

          <button
            type="button"
            id="btn-gate-accept-next-mission"
            onClick={handleGoToNextMission}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-950/50 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
          >
            <span>{nextMission.actionLabelBn || 'পরের সঠিক মিশনে যাই →'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Secondary Back Navigation */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>পাঠ্যক্রম রোডম্যাপ</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>হোমে ফিরুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
