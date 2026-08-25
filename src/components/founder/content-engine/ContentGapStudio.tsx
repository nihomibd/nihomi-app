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
import { LevelCoverageWidget } from './LevelCoverageWidget';

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
      showToast(`✓ AI-Fix Executed: Generated 4 culturally verified exemplars & updated coverage matrix.`);
    }
  };

  const filteredGaps = gaps.filter((g) => {
    if (priorityFilter !== 'ALL' && g.priority !== priorityFilter) return false;
    if (severityFilter !== 'ALL' && g.severity !== severityFilter) return false;
    return true;
  });

  const openGapsCount = gaps.filter((g) => g.status === 'OPEN').length;
  const resolvedGapsCount = gaps.filter((g) => g.status === 'RESOLVED').length;

  return (
    <div id="content-gap-studio" className="space-y-6 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Level Coverage Radar Widget using Recharts */}
      <LevelCoverageWidget
        selectedLevel={selectedLevel}
        onSelectLevel={onSelectLevel}
      />

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
                  id={`gap-filter-priority-${p}`}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
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
                  id={`gap-filter-severity-${s}`}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
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
                  id={`gap-item-${gap.id}`}
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
                        id={`trigger-ai-fix-btn-${gap.id}`}
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
