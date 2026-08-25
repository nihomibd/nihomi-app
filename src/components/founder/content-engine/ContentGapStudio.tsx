import React, { useState } from 'react';
import {
  Radar,
  PieChart,
  BarChart3,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Filter,
  Check,
  ChevronRight,
  Loader2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { JLPTLevel } from '../../../types/nihomi';
import { ContentGapItem, LevelCompletenessMetrics } from '../../../core/content-engine/types';
import { ContentGapService } from '../../../core/content-engine/contentGapService';

interface ContentGapStudioProps {
  selectedLevel: JLPTLevel;
  onSelectLevel: (lvl: JLPTLevel) => void;
}

export const ContentGapStudio: React.FC<ContentGapStudioProps> = ({
  selectedLevel,
  onSelectLevel
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'MINOR'>('ALL');
  const [gaps, setGaps] = useState<ContentGapItem[]>(() => ContentGapService.getContentGaps());
  const [fixingGapId, setFixingGapId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const metrics: LevelCompletenessMetrics = ContentGapService.getLevelCompleteness(selectedLevel);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerAiFix = async (gapId: string) => {
    setFixingGapId(gapId);
    await new Promise((r) => setTimeout(r, 800));
    const result = ContentGapService.triggerAiFixForGap(gapId);
    setFixingGapId(null);

    if (result.success) {
      setGaps(ContentGapService.getContentGaps());
      showToast(`✓ AI-Fix Executed: Generated 4 exemplar sentences and updated syllabus coverage.`);
    }
  };

  const filteredGaps = gaps.filter((g) => {
    if (priorityFilter !== 'ALL' && g.priority !== priorityFilter) return false;
    if (severityFilter !== 'ALL' && g.severity !== severityFilter) return false;
    return true;
  });

  const openGapsCount = gaps.filter((g) => g.status === 'OPEN').length;
  const resolvedGapsCount = gaps.filter((g) => g.status === 'RESOLVED').length;

  const radarMetrics = [
    { label: 'Vocabulary', percent: metrics.vocabularyCoveragePercent, color: 'bg-emerald-500' },
    { label: 'Kanji Radicals', percent: metrics.kanjiCoveragePercent, color: 'bg-amber-500' },
    { label: 'Grammar Patterns', percent: metrics.grammarCoveragePercent, color: 'bg-blue-500' },
    { label: 'Reading Passages', percent: metrics.readingCoveragePercent, color: 'bg-purple-500' },
    { label: 'Listening Audio', percent: metrics.listeningCoveragePercent, color: 'bg-rose-500' },
    { label: 'Speaking / Shadowing', percent: metrics.speakingCoveragePercent, color: 'bg-cyan-500' },
    { label: 'Assessment Quizzes', percent: metrics.assessmentCoveragePercent, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Level Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 border border-stone-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                JLPT {lvl}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-stone-400">
            Open Gaps: <strong className="text-amber-400">{openGapsCount}</strong>
          </span>
          <span className="text-stone-600">|</span>
          <span className="text-stone-400">
            Resolved: <strong className="text-emerald-400">{resolvedGapsCount}</strong>
          </span>
        </div>
      </div>

      {/* Dashboard Widget: Level Completeness Radar & Circular Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Completeness Circular Card */}
        <div className="lg:col-span-4 bg-stone-950 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-500">
              Syllabus Completeness Index
            </span>
            <h4 className="text-base font-extrabold text-white">JLPT {selectedLevel} Master Coverage</h4>
          </div>

          <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-900"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-500"
                strokeDasharray={`${metrics.overallCompletenessPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <strong className="text-3xl font-mono font-extrabold text-white">
                {metrics.overallCompletenessPercent}%
              </strong>
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase">Calibrated</span>
            </div>
          </div>

          <div className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 text-[11px] space-y-1">
            <div className="flex justify-between text-stone-300">
              <span>Total Knowledge Objects:</span>
              <strong className="font-mono text-white">{metrics.totalKnowledgeObjects}</strong>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Pending Review Queue:</span>
              <strong className="font-mono text-amber-400">{metrics.totalPendingReviewCount} items</strong>
            </div>
          </div>
        </div>

        {/* 7-Dimension Breakdown Bars */}
        <div className="lg:col-span-8 bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>7-Dimension Coverage Matrix (JLPT {selectedLevel})</span>
              </h4>
              <p className="text-[11px] text-stone-500">Comprehensive curriculum distribution & deficit mapping</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Target Tracking
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {radarMetrics.map((item) => (
              <div key={item.label} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-stone-300 font-medium">{item.label}</span>
                  <span className="text-stone-200 font-bold">{item.percent}%</span>
                </div>
                <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Gaps List View with Priority & Severity Filters */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Curriculum Content Gaps ({filteredGaps.length})</span>
            </h4>
            <p className="text-[11px] text-stone-500">Audit gaps detected across exemplar sets and trilingual definitions</p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 px-1 font-mono uppercase">Priority:</span>
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${
                    priorityFilter === p ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 px-1 font-mono uppercase">Severity:</span>
              {(['ALL', 'CRITICAL', 'WARNING', 'MINOR'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${
                    severityFilter === s ? 'bg-red-500 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gaps List */}
        <div className="space-y-3">
          {filteredGaps.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-2xl">
              No matching content gaps for current filter criteria.
            </div>
          ) : (
            filteredGaps.map((gap) => {
              const isResolved = gap.status === 'RESOLVED';
              const isFixing = fixingGapId === gap.id;

              return (
                <div
                  key={gap.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 text-xs ${
                    isResolved
                      ? 'bg-stone-900/40 border-stone-800'
                      : 'bg-stone-900/90 border-stone-700/80 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold rounded">
                        JLPT {gap.level}
                      </span>
                      <span className="px-2 py-0.5 bg-stone-800 text-stone-300 font-mono text-[10px] rounded">
                        {gap.domain}
                      </span>
                      <span className={`px-2 py-0.5 font-mono text-[9px] font-extrabold rounded ${
                        gap.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : gap.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {gap.severity}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        Type: {gap.gapType}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                      isResolved ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}>
                      {gap.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-white font-bold text-sm tracking-tight">{gap.missingConcept}</h5>
                    <p className="text-stone-400 text-xs mt-1 leading-relaxed">{gap.reason}</p>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                    <div className="text-stone-300">
                      <strong className="text-amber-400 font-mono">Recommended Action: </strong>
                      <span>{gap.recommendedAction}</span>
                    </div>

                    {!isResolved ? (
                      <button
                        onClick={() => handleTriggerAiFix(gap.id)}
                        disabled={isFixing}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
                      >
                        {isFixing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{isFixing ? 'Generating...' : 'AI-Assisted Fix (4 Exemplars)'}</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-mono text-[10px] font-bold flex items-center space-x-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved via AI Calibration</span>
                      </span>
                    )}
                  </div>

                  {/* If exemplars were generated */}
                  {gap.exemplarsGenerated && gap.exemplarsGenerated.length > 0 && (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-2 text-xs">
                      <strong className="text-emerald-400 font-mono text-[10px] uppercase block">
                        ✓ Generated Trilingual Exemplars:
                      </strong>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {gap.exemplarsGenerated.map((ex, idx) => (
                          <div key={idx} className="p-2 bg-stone-950 rounded-lg border border-emerald-900/50 space-y-0.5">
                            <div className="text-white font-japanese font-bold text-[11px]">{ex.ja}</div>
                            <div className="text-stone-400 text-[10px]">{ex.en}</div>
                            <div className="text-emerald-300 text-[10px] font-sans">{ex.bn}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
