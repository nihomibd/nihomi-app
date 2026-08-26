import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Award,
  Info,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { JLPTLevel } from '../../types/nihomi';

interface HeatmapCell {
  level: JLPTLevel;
  domain: string;
  domainJa: string;
  masteryPercent: number;
  totalItems: number;
  masteredItems: number;
  recentActivityDays: number;
  status: 'mastered' | 'learning' | 'locked' | 'untested';
}

interface JlptMasteryHeatmapProps {
  currentLevel?: JLPTLevel;
  completedLessonsCount?: number;
}

export const JlptMasteryHeatmap: React.FC<JlptMasteryHeatmapProps> = ({
  currentLevel = 'N5',
  completedLessonsCount = 19,
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const domains = [
    { id: 'grammar', name: 'Grammar (文法)', nameJa: '文法' },
    { id: 'kanji', name: 'Kanji Bank (漢字)', nameJa: '漢字' },
    { id: 'vocab', name: 'Core Vocab (語彙)', nameJa: '語彙' },
    { id: 'listening', name: 'Shadowing (聴解)', nameJa: '聴解' },
    { id: 'particles', name: 'Particles (助詞)', nameJa: '助詞' },
  ];

  // Derive dynamic activity data based on student's current level & completed lessons
  const getCellData = (level: JLPTLevel, domainId: string): HeatmapCell => {
    const isCurrent = level === currentLevel;
    const isLower = levels.indexOf(level) < levels.indexOf(currentLevel);
    const isHigher = levels.indexOf(level) > levels.indexOf(currentLevel);

    if (level === 'N5') {
      const baseProgress = Math.min(100, Math.round((completedLessonsCount / 25) * 100));
      if (domainId === 'grammar') {
        return {
          level,
          domain: 'Grammar Patterns',
          domainJa: '文法',
          masteryPercent: Math.min(100, Math.round(baseProgress * 0.95)),
          totalItems: 48,
          masteredItems: Math.min(48, Math.round(48 * (baseProgress / 100))),
          recentActivityDays: 1,
          status: 'learning',
        };
      }
      if (domainId === 'kanji') {
        return {
          level,
          domain: 'Essential Kanji',
          domainJa: '漢字',
          masteryPercent: Math.min(100, Math.round(baseProgress * 1.05)),
          totalItems: 120,
          masteredItems: Math.min(120, Math.round(120 * (baseProgress / 100))),
          recentActivityDays: 2,
          status: 'learning',
        };
      }
      if (domainId === 'vocab') {
        return {
          level,
          domain: 'Core Vocabulary',
          domainJa: '語彙',
          masteryPercent: Math.min(100, Math.round(baseProgress * 0.9)),
          totalItems: 800,
          masteredItems: Math.min(800, Math.round(800 * (baseProgress / 100))),
          recentActivityDays: 1,
          status: 'learning',
        };
      }
      if (domainId === 'listening') {
        return {
          level,
          domain: 'Tokyo Audio Drills',
          domainJa: '聴解',
          masteryPercent: Math.min(100, Math.round(baseProgress * 0.85)),
          totalItems: 50,
          masteredItems: Math.min(50, Math.round(50 * (baseProgress / 100))),
          recentActivityDays: 3,
          status: 'learning',
        };
      }
      // particles
      return {
        level,
        domain: 'Particle Accuracy (は/が/に/で)',
        domainJa: '助詞',
        masteryPercent: Math.min(100, Math.round(baseProgress * 0.88)),
        totalItems: 32,
        masteredItems: Math.min(32, Math.round(32 * (baseProgress / 100))),
        recentActivityDays: 1,
        status: 'learning',
      };
    }

    if (level === 'N4') {
      return {
        level,
        domain: domainId.toUpperCase(),
        domainJa: domainId === 'grammar' ? '文法' : domainId === 'kanji' ? '漢字' : '総合',
        masteryPercent: 24,
        totalItems: 300,
        masteredItems: 72,
        recentActivityDays: 4,
        status: 'learning',
      };
    }

    if (level === 'N3') {
      return {
        level,
        domain: domainId.toUpperCase(),
        domainJa: '中級',
        masteryPercent: 8,
        totalItems: 650,
        masteredItems: 52,
        recentActivityDays: 9,
        status: 'learning',
      };
    }

    return {
      level,
      domain: domainId.toUpperCase(),
      domainJa: '上級',
      masteryPercent: 0,
      totalItems: 1000,
      masteredItems: 0,
      recentActivityDays: 0,
      status: 'locked',
    };
  };

  // Color intensity scaling: smooth heat gradient
  const getCellColor = (percent: number, status: string) => {
    if (status === 'locked' || percent === 0) return 'bg-stone-100 dark:bg-stone-800/40 text-stone-400 border-stone-200 dark:border-stone-800';
    if (percent < 25) return 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20';
    if (percent < 50) return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30';
    if (percent < 75) return 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500/35';
    return 'bg-emerald-600 text-white border-emerald-600 font-bold';
  };

  return (
    <div
      id="nihomi-jlpt-mastery-heatmap"
      className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xs text-left space-y-4 transition-all"
    >
      {/* Header with Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="space-y-0.5">
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Mastery Heatmap & Retention Matrix</span>
          </div>
          <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
            JLPT Progression Across Skill Dimensions
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Replaces static progress bars with real-time competency density across N5–N1 levels.
          </p>
        </div>

        {/* Heat Legend */}
        <div className="flex items-center space-x-2 text-[10px] font-semibold text-stone-500 self-start sm:self-auto">
          <span>0%</span>
          <div className="flex items-center space-x-1">
            <div className="w-3.5 h-3.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"></div>
            <div className="w-3.5 h-3.5 rounded bg-red-500/20 border border-red-500/30"></div>
            <div className="w-3.5 h-3.5 rounded bg-amber-500/25 border border-amber-500/40"></div>
            <div className="w-3.5 h-3.5 rounded bg-emerald-500/30 border border-emerald-500/40"></div>
            <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-700"></div>
          </div>
          <span>100% Mastered</span>
        </div>
      </div>

      {/* HEATMAP GRID */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[520px] space-y-2">
          
          {/* Top Axis: JLPT Levels */}
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-stone-500 dark:text-stone-400">
            <div className="text-left pl-1">Domain</div>
            {levels.map((lvl) => (
              <div
                key={lvl}
                className={`py-1 rounded-lg ${
                  lvl === currentLevel
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-black shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800/60'
                }`}
              >
                JLPT {lvl}
              </div>
            ))}
          </div>

          {/* Rows: Domains */}
          {domains.map((dom) => (
            <div key={dom.id} className="grid grid-cols-6 gap-2 items-center">
              
              {/* Domain Label */}
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 pl-1 truncate" title={dom.name}>
                {dom.name}
              </div>

              {/* Cells per Level */}
              {levels.map((lvl) => {
                const cell = getCellData(lvl, dom.id);
                const colorClass = getCellColor(cell.masteryPercent, cell.status);

                return (
                  <button
                    key={`${lvl}-${dom.id}`}
                    type="button"
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => setHoveredCell(cell)}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 hover:shadow-md ${colorClass}`}
                  >
                    <span className="text-xs font-mono font-bold">
                      {cell.masteryPercent > 0 ? `${cell.masteryPercent}%` : '—'}
                    </span>
                    {cell.masteryPercent > 0 && (
                      <span className="text-[9px] opacity-80 truncate">
                        {cell.masteredItems}/{cell.totalItems}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

        </div>
      </div>

      {/* Dynamic Detail Card on Hover */}
      {hoveredCell && (
        <div className="p-3 bg-stone-50 dark:bg-stone-800/70 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-4 text-xs animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold text-xs flex items-center justify-center">
              {hoveredCell.level}
            </div>
            <div>
              <span className="font-bold text-stone-900 dark:text-white block">
                JLPT {hoveredCell.level} • {hoveredCell.domain}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {hoveredCell.masteredItems} of {hoveredCell.totalItems} concepts verified in MemoryOS™
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block">
              {hoveredCell.masteryPercent}% Mastered
            </span>
            <span className="text-[10px] text-stone-400">
              {hoveredCell.recentActivityDays > 0 ? `Active ${hoveredCell.recentActivityDays}d ago` : 'Not started'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
