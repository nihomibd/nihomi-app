import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { JLPTLevel } from '../../types/nihomi';
import { CurriculumSequencerService, CurriculumUnit } from '../../core/content-engine/curriculumSequencerService';

interface CurriculumUnitLinearTrackerProps {
  selectedLevel: JLPTLevel | 'ALL';
  onNavigateLesson?: (lessonId: string) => void;
}

export const CurriculumUnitLinearTracker: React.FC<CurriculumUnitLinearTrackerProps> = ({
  selectedLevel,
  onNavigateLesson,
}) => {
  const activeLevel: JLPTLevel = selectedLevel === 'ALL' ? 'N5' : selectedLevel;
  const units = CurriculumSequencerService.getSequencedCurriculum(activeLevel);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  // Determine completed state based on unit index
  const getUnitStatus = (unitIndex: number) => {
    if (activeLevel === 'N5') {
      if (unitIndex === 0) return { status: 'completed', percent: 100 };
      if (unitIndex === 1) return { status: 'in-progress', percent: 85 };
      return { status: 'next', percent: 20 };
    }
    if (activeLevel === 'N4') {
      if (unitIndex === 0) return { status: 'in-progress', percent: 45 };
      return { status: 'locked', percent: 0 };
    }
    return { status: 'locked', percent: 0 };
  };

  return (
    <div
      id="nihomi-curriculum-linear-tracker"
      className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs text-left space-y-6 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-red-500/15 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase rounded-md font-mono">
            <Layers className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Curriculum Sequencer & Unit Pipeline</span>
          </div>
          <h3 className="text-lg font-extrabold text-stone-900 dark:text-white sepia:text-amber-950">
            JLPT {activeLevel} Unit Mastery Sequence
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Pedagogically ordered progression with verified prerequisite locks and estimated cognitive load.
          </p>
        </div>

        {/* Global Level Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-mono font-bold rounded-xl shadow-2xs">
            JLPT {activeLevel}
          </span>
          <span className="text-xs text-stone-500 font-semibold font-mono">
            {units.length} Core Units
          </span>
        </div>
      </div>

      {/* LINEAR PROGRESS STEPPER */}
      <div className="relative space-y-4">
        {units.map((unit, idx) => {
          const { status, percent } = getUnitStatus(idx);
          const isExpanded = expandedUnit === unit.unitNumber;

          return (
            <div
              key={unit.unitNumber}
              className={`rounded-2xl border transition-all ${
                status === 'completed'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : status === 'in-progress'
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 ring-2 ring-amber-500/20'
                  : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800'
              }`}
            >
              {/* Unit Step Row Header */}
              <div
                onClick={() => setExpandedUnit(isExpanded ? null : unit.unitNumber)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  
                  {/* Step Status Badge / Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : status === 'in-progress'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : status === 'locked' ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      `0${unit.unitNumber}`
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white sepia:text-amber-950 truncate">
                        {unit.title}
                      </h4>
                      <span className="text-[10px] font-japanese text-stone-400 hidden md:inline">
                        {unit.titleJa}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{unit.estimatedHours}h est.</span>
                      </span>
                      <span>•</span>
                      <span>{unit.concepts.length} Concept Nodes</span>
                      <span>•</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        {percent}% Mastered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action / Toggle */}
                <div className="flex items-center space-x-3 shrink-0">
                  {status === 'in-progress' && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase rounded-md hidden sm:inline">
                      Active Unit
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Detail Section */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 border-t border-stone-200/60 dark:border-stone-700/60 pt-4 space-y-4 text-xs animate-in fade-in">
                  
                  {/* Learning Objectives */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-mono">
                      Target Learning Outcomes:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {unit.learningObjectives.map((obj, i) => (
                        <li
                          key={i}
                          className="flex items-start space-x-2 text-stone-700 dark:text-stone-200 bg-white/70 dark:bg-stone-900/70 p-2 rounded-xl border border-stone-200/60 dark:border-stone-800"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Concept Nodes with Prerequisites */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-mono">
                      Sequenced Knowledge Nodes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {unit.concepts.map((concept) => (
                        <div
                          key={concept.code}
                          className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center space-x-2 text-[11px]"
                        >
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                              concept.type === 'GRAMMAR'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : concept.type === 'KANJI'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {concept.type}
                          </span>
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {concept.patternOrWord}
                          </span>
                          {concept.prerequisitesRequired.length > 0 && (
                            <span className="text-[9px] text-stone-400 font-mono">
                              req: {concept.prerequisitesRequired[0]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigateLesson?.(`les-${activeLevel.toLowerCase()}-${unit.unitNumber}-1`)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-950 font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Launch Unit Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
