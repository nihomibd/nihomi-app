import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { JLPTLevel } from '../../../types/nihomi';
import { ContentGapService } from '../../../core/content-engine/contentGapService';
import { Sparkles, Layers, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface LevelCoverageWidgetProps {
  selectedLevel: JLPTLevel;
  onSelectLevel?: (lvl: JLPTLevel) => void;
  showAllLevelsComparison?: boolean;
}

export const LevelCoverageWidget: React.FC<LevelCoverageWidgetProps> = ({
  selectedLevel,
  onSelectLevel,
  showAllLevelsComparison = false
}) => {
  const [activeLevel, setActiveLevel] = useState<JLPTLevel>(selectedLevel);
  const [compareMode, setCompareMode] = useState<'single' | 'multi'>(showAllLevelsComparison ? 'multi' : 'single');

  const currentLevel = onSelectLevel ? selectedLevel : activeLevel;
  const metrics = ContentGapService.getLevelCompleteness(currentLevel);

  // Radar Data for single level (7 dimensions)
  const singleRadarData: Record<string, any>[] = [
    { subject: 'Vocabulary', coverage: metrics.vocabularyCoveragePercent, fullMark: 100 },
    { subject: 'Kanji Radicals', coverage: metrics.kanjiCoveragePercent, fullMark: 100 },
    { subject: 'Grammar Patterns', coverage: metrics.grammarCoveragePercent, fullMark: 100 },
    { subject: 'Reading Passages', coverage: metrics.readingCoveragePercent, fullMark: 100 },
    { subject: 'Listening Audio', coverage: metrics.listeningCoveragePercent, fullMark: 100 },
    { subject: 'Shadowing / Speaking', coverage: metrics.speakingCoveragePercent, fullMark: 100 },
    { subject: 'Diagnostic Assessments', coverage: metrics.assessmentCoveragePercent, fullMark: 100 }
  ];

  // Radar Data across N5, N4, N3, N2, N1 for comparison
  const n5 = ContentGapService.getLevelCompleteness('N5');
  const n4 = ContentGapService.getLevelCompleteness('N4');
  const n3 = ContentGapService.getLevelCompleteness('N3');

  const multiRadarData: Record<string, any>[] = [
    { subject: 'Vocabulary', N5: n5.vocabularyCoveragePercent, N4: n4.vocabularyCoveragePercent, N3: n3.vocabularyCoveragePercent, fullMark: 100 },
    { subject: 'Kanji', N5: n5.kanjiCoveragePercent, N4: n4.kanjiCoveragePercent, N3: n3.kanjiCoveragePercent, fullMark: 100 },
    { subject: 'Grammar', N5: n5.grammarCoveragePercent, N4: n4.grammarCoveragePercent, N3: n3.grammarCoveragePercent, fullMark: 100 },
    { subject: 'Reading', N5: n5.readingCoveragePercent, N4: n4.readingCoveragePercent, N3: n3.readingCoveragePercent, fullMark: 100 },
    { subject: 'Listening', N5: n5.listeningCoveragePercent, N4: n4.listeningCoveragePercent, N3: n3.listeningCoveragePercent, fullMark: 100 },
    { subject: 'Speaking', N5: n5.speakingCoveragePercent, N4: n4.speakingCoveragePercent, N3: n3.speakingCoveragePercent, fullMark: 100 },
    { subject: 'Assessment', N5: n5.assessmentCoveragePercent, N4: n4.assessmentCoveragePercent, N3: n3.assessmentCoveragePercent, fullMark: 100 }
  ];

  const handleLevelChange = (lvl: JLPTLevel) => {
    setActiveLevel(lvl);
    if (onSelectLevel) {
      onSelectLevel(lvl);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-stone-900 border border-stone-700 p-2.5 rounded-xl shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1">{data.payload.subject}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[11px]" style={{ color: entry.color || entry.stroke || '#f59e0b' }}>
              {entry.name || 'Coverage'}: <strong className="font-extrabold">{entry.value}%</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="level-coverage-widget" className="bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-6 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold rounded-lg border border-amber-500/20">
              RECHARTS RADAR ENGINE
            </span>
            <span className="text-xs text-stone-400 font-mono">Syllabus Density & Gap Profiler</span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">
            Curriculum Coverage Radar Matrix
          </h3>
        </div>

        {/* Mode Toggle & Level Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-stone-900 p-1 rounded-xl border border-stone-800 flex items-center space-x-1">
            <button
              id="radar-single-mode-btn"
              onClick={() => setCompareMode('single')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                compareMode === 'single' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Single Level
            </button>
            <button
              id="radar-compare-mode-btn"
              onClick={() => setCompareMode('multi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                compareMode === 'multi' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              N5–N3 Multi-Compare
            </button>
          </div>

          {compareMode === 'single' && (
            <div className="flex items-center space-x-1">
              {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  id={`radar-level-btn-${lvl}`}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                    currentLevel === lvl
                      ? 'bg-stone-800 text-amber-400 border border-amber-500/50'
                      : 'bg-stone-900 text-stone-500 hover:text-stone-300 border border-stone-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Radar Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Interactive Radar */}
        <div className="lg:col-span-7 h-72 sm:h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={compareMode === 'single' ? singleRadarData : multiRadarData}>
              <PolarGrid stroke="#292524" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#a8a29e', fontSize: 11, fontFamily: 'monospace' }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#44403c"
                tick={{ fill: '#78716c', fontSize: 9, fontFamily: 'monospace' }}
              />
              <Tooltip content={<CustomTooltip />} />

              {compareMode === 'single' ? (
                <Radar
                  name={`JLPT ${currentLevel}`}
                  dataKey="coverage"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.4}
                />
              ) : (
                <>
                  <Radar name="JLPT N5" dataKey="N5" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                  <Radar name="JLPT N4" dataKey="N4" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                  <Radar name="JLPT N3" dataKey="N3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                </>
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Key Dimension Metrics & Status Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                JLPT {currentLevel} Completeness Overview
              </span>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold rounded">
                Score: {metrics.overallCompletenessPercent}%
              </span>
            </div>

            {/* Core 3 Dimension Highlights (Vocab, Kanji, Grammar) */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[9px] text-stone-500 font-mono block">VOCABULARY</span>
                <strong className="text-emerald-400 text-sm font-mono">{metrics.vocabularyCoveragePercent}%</strong>
              </div>
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[9px] text-stone-500 font-mono block">KANJI</span>
                <strong className="text-amber-400 text-sm font-mono">{metrics.kanjiCoveragePercent}%</strong>
              </div>
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[9px] text-stone-500 font-mono block">GRAMMAR</span>
                <strong className="text-blue-400 text-sm font-mono">{metrics.grammarCoveragePercent}%</strong>
              </div>
            </div>

            {/* Total Objects & Review Status */}
            <div className="space-y-1.5 text-xs text-stone-300 font-mono pt-1">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Knowledge Objects:</span>
                <strong className="text-white">{metrics.totalKnowledgeObjects} items</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Human Audit Pending:</span>
                <strong className="text-amber-400">{metrics.totalPendingReviewCount} items</strong>
              </div>
            </div>
          </div>

          {compareMode === 'multi' && (
            <div className="p-3 bg-stone-900/50 border border-stone-800 rounded-xl flex items-center justify-around text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-stone-300">N5 (96%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-stone-300">N4 (87%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-stone-300">N3 (75%)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
