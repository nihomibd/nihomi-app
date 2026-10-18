import React from 'react';
import { Eye, Target, Search, CheckCircle2, Lightbulb, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';

/**
 * NIHOMI.COM — CANONICAL LEARNING CONSTITUTION (IMMUTABLE)
 * Section 1 of Phase 21 Specification:
 * Canonical visible order: N → I → H → O → M → I
 * Internal IDs distinguish the two I stages: identify_task and improve_retry.
 * Official labels and helper strings are strictly immutable.
 */

export type NihomiConstitutionStageId = 
  | 'notice_scene' 
  | 'identify_task' 
  | 'hunt_signals' 
  | 'own_answer' 
  | 'make_meaning' 
  | 'improve_retry';

export interface NihomiConstitutionStage {
  id: NihomiConstitutionStageId;
  letter: 'N' | 'I' | 'H' | 'O' | 'M';
  stepNumber: number;
  nameEn: string;
  labelBn: string;
  helperBn: string;
  iconName: string;
  themeColor: string;
}

export const NIHOMI_CONSTITUTION_STAGES: readonly NihomiConstitutionStage[] = [
  {
    id: 'notice_scene',
    letter: 'N',
    stepNumber: 1,
    nameEn: 'Notice the scene',
    labelBn: 'দৃশ্য দেখো।',
    helperBn: 'ছবি বা দৃশ্য দেখে পরিস্থিতি বোঝো।',
    iconName: 'Eye',
    themeColor: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40'
  },
  {
    id: 'identify_task',
    letter: 'I',
    stepNumber: 2,
    nameEn: 'Identify the task',
    labelBn: 'কাজটি চেনো।',
    helperBn: 'কী জানতে হবে বা কী শিখতে হবে, বুঝে নাও।',
    iconName: 'Target',
    themeColor: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/40'
  },
  {
    id: 'hunt_signals',
    letter: 'H',
    stepNumber: 3,
    nameEn: 'Hunt for signals',
    labelBn: 'Clue খোঁজো।',
    helperBn: 'শব্দ, particle, সংখ্যা, সময় বা অবস্থানের সংকেত ধরো।',
    iconName: 'Search',
    themeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40'
  },
  {
    id: 'own_answer',
    letter: 'O',
    stepNumber: 4,
    nameEn: 'Own your answer',
    labelBn: 'নিজে উত্তর দাও।',
    helperBn: 'উত্তর দেখার আগে নিজে বলো, লেখো বা চেষ্টা করো।',
    iconName: 'CheckCircle2',
    themeColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/40'
  },
  {
    id: 'make_meaning',
    letter: 'M',
    stepNumber: 5,
    nameEn: 'Make meaning',
    labelBn: 'কারণ বোঝো।',
    helperBn: 'কেন উত্তরটি সঠিক, বোঝো এবং একটি সহজ memory hook ব্যবহার করো।',
    iconName: 'Lightbulb',
    themeColor: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/40'
  },
  {
    id: 'improve_retry',
    letter: 'I',
    stepNumber: 6,
    nameEn: 'Improve and retry',
    labelBn: 'আবার চেষ্টা করো।',
    helperBn: 'নতুন উদাহরণে প্রয়োগ করো এবং পরে আবার মনে করো।',
    iconName: 'RefreshCw',
    themeColor: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/40'
  }
] as const;

/**
 * Compact memory aid allowed as supplementary microcopy only:
 * "দেখো → কাজ চেনো → সূত্র খোঁজো → চেষ্টা করো → কারণ বোঝো → আবার চেষ্টা করো।"
 */
export const NIHOMI_COMPACT_MEMORY_AID = 'দেখো → কাজ চেনো → সূত্র খোঁজো → চেষ্টা করো → কারণ বোঝো → আবার চেষ্টা করো।';

export function getConstitutionStage(id: NihomiConstitutionStageId): NihomiConstitutionStage {
  const stage = NIHOMI_CONSTITUTION_STAGES.find(s => s.id === id);
  if (!stage) {
    throw new Error(`Unknown constitution stage id: ${id}`);
  }
  return stage;
}

export function getNextConstitutionStage(currentId: NihomiConstitutionStageId): NihomiConstitutionStageId | null {
  const index = NIHOMI_CONSTITUTION_STAGES.findIndex(s => s.id === currentId);
  if (index >= 0 && index < NIHOMI_CONSTITUTION_STAGES.length - 1) {
    return NIHOMI_CONSTITUTION_STAGES[index + 1].id;
  }
  return null;
}

export function getPrevConstitutionStage(currentId: NihomiConstitutionStageId): NihomiConstitutionStageId | null {
  const index = NIHOMI_CONSTITUTION_STAGES.findIndex(s => s.id === currentId);
  if (index > 0) {
    return NIHOMI_CONSTITUTION_STAGES[index - 1].id;
  }
  return null;
}

const STAGE_ICONS: Record<NihomiConstitutionStageId, React.ComponentType<{ className?: string }>> = {
  notice_scene: Eye,
  identify_task: Target,
  hunt_signals: Search,
  own_answer: CheckCircle2,
  make_meaning: Lightbulb,
  improve_retry: RefreshCw,
};

interface ConstitutionIndicatorProps {
  currentStage: NihomiConstitutionStageId;
  completedStages?: Set<NihomiConstitutionStageId> | NihomiConstitutionStageId[];
  onSelectStage?: (stageId: NihomiConstitutionStageId) => void;
  showMemoryAid?: boolean;
  className?: string;
}

export const NihomiConstitutionIndicator: React.FC<ConstitutionIndicatorProps> = ({
  currentStage,
  completedStages = [],
  onSelectStage,
  showMemoryAid = true,
  className = ''
}) => {
  const completedSet = React.useMemo(() => {
    return completedStages instanceof Set ? completedStages : new Set(completedStages);
  }, [completedStages]);

  const currentIndex = NIHOMI_CONSTITUTION_STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className={`w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-xl ${className}`}>
      {/* Header bar with Constitution Identity */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center font-bold text-red-400">
            法
          </div>
          <span className="font-bold tracking-wider text-slate-200">
            N-I-H-O-M-I লার্নিং সংবিধান
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            ধাপ {currentIndex + 1} / 6
          </span>
        </div>
        {showMemoryAid && (
          <div className="text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-800/40 rounded-full px-3 py-0.5 font-medium truncate max-w-full">
            💡 {NIHOMI_COMPACT_MEMORY_AID}
          </div>
        )}
      </div>

      {/* Sequential Step Badges: N → I → H → O → M → I */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {NIHOMI_CONSTITUTION_STAGES.map((stage, idx) => {
          const isCurrent = stage.id === currentStage;
          const isCompleted = completedSet.has(stage.id);
          const Icon = STAGE_ICONS[stage.id];
          const isAccessible = idx <= currentIndex || isCompleted || Boolean(onSelectStage);

          return (
            <button
              key={stage.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => onSelectStage?.(stage.id)}
              className={`group text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-gradient-to-br from-red-950/40 to-slate-900 border-red-500/80 shadow-lg shadow-red-950/30 ring-1 ring-red-500/50'
                  : isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/70 hover:bg-slate-800/60'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
              } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              title={`${stage.nameEn} — ${stage.labelBn}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-xs ${
                      isCurrent
                        ? 'bg-red-500 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {stage.letter}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    ধাপ {stage.stepNumber}
                  </span>
                </div>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isCurrent
                      ? 'text-red-400 animate-pulse'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
              </div>

              <div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? 'text-white'
                      : isCompleted
                      ? 'text-emerald-200'
                      : 'text-slate-300'
                  }`}
                >
                  {stage.labelBn}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                  {stage.nameEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface ConstitutionStageBannerProps {
  stageId: NihomiConstitutionStageId;
  className?: string;
}

export const NihomiConstitutionStageBanner: React.FC<ConstitutionStageBannerProps> = ({
  stageId,
  className = ''
}) => {
  const stage = getConstitutionStage(stageId);
  const Icon = STAGE_ICONS[stageId];

  return (
    <div
      className={`rounded-2xl border p-4 bg-gradient-to-r ${stage.themeColor} flex items-start gap-3.5 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-md">
        <Icon className="w-5 h-5 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-red-400 uppercase tracking-wider">
            {stage.letter} — {stage.nameEn}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            ধাপ {stage.stepNumber}
          </span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-white mt-1">
          {stage.labelBn}
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
          {stage.helperBn}
        </p>
      </div>
    </div>
  );
};
