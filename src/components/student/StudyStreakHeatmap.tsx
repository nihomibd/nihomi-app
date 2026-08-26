import React, { useState, useMemo } from 'react';
import { Flame, Trophy, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface DayHeatmapCell {
  date: string;
  dayOfWeek: number;
  count: number; // minutes
  level: 0 | 1 | 2 | 3 | 4;
  xp: number;
}

interface StudyStreakHeatmapProps {
  currentStreak?: number;
  longestStreak?: number;
  totalStudyDays?: number;
}

export const StudyStreakHeatmap: React.FC<StudyStreakHeatmapProps> = ({
  currentStreak = 14,
  longestStreak = 26,
  totalStudyDays = 68,
}) => {
  const [hoveredCell, setHoveredCell] = useState<DayHeatmapCell | null>(null);

  // Generate 16 weeks (112 days) of study heatmap data leading up to today
  const heatmapData = useMemo(() => {
    const cells: DayHeatmapCell[] = [];
    const today = new Date();
    const totalDays = 112; // 16 weeks

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay(); // 0-6

      // Realistic pseudo-random deterministic study density
      const seed = (d.getFullYear() * 37 + d.getMonth() * 19 + d.getDate() * 11) % 100;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      let count = 0;
      let xp = 0;

      // Make recent days part of current active streak
      if (i < currentStreak) {
        level = (seed % 3 + 2) as any;
        count = 30 + (seed % 45);
        xp = count * 6;
      } else if (seed > 30) {
        if (seed > 85) level = 4;
        else if (seed > 65) level = 3;
        else if (seed > 45) level = 2;
        else level = 1;

        count = level * 20 + (seed % 15);
        xp = count * 5;
      }

      cells.push({
        date: dateStr,
        dayOfWeek,
        count,
        level,
        xp,
      });
    }

    return cells;
  }, [currentStreak]);

  // Group into columns of 7 days (Sunday - Saturday)
  const columns = useMemo(() => {
    const cols: DayHeatmapCell[][] = [];
    let currentCol: DayHeatmapCell[] = [];

    heatmapData.forEach((cell, idx) => {
      currentCol.push(cell);
      if (currentCol.length === 7 || idx === heatmapData.length - 1) {
        cols.push(currentCol);
        currentCol = [];
      }
    });

    return cols;
  }, [heatmapData]);

  // Level colors
  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-200 hover:bg-emerald-300 border-emerald-300';
      case 2:
        return 'bg-emerald-400 hover:bg-emerald-500 border-emerald-500';
      case 3:
        return 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700';
      case 4:
        return 'bg-amber-500 hover:bg-amber-600 border-amber-600 ring-1 ring-amber-400';
      default:
        return 'bg-slate-100 hover:bg-slate-200 border-slate-200/60';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header with Streak Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 text-amber-500" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Study Streak & Habit Heatmap
              </h3>
              <p className="text-xs text-slate-500">
                Daily Japanese learning consistency over the past 16 weeks
              </p>
            </div>
          </div>
        </div>

        {/* Streak Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl flex items-center space-x-2.5">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-xs text-amber-800 font-bold leading-none">
                {currentStreak} Days
              </div>
              <span className="text-[10px] text-amber-600 font-medium">Current Streak</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl flex items-center space-x-2.5">
            <Trophy className="w-5 h-5 text-amber-600" />
            <div>
              <div className="text-xs text-slate-900 font-bold leading-none">
                {longestStreak} Days
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Longest Streak</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl flex items-center space-x-2.5">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-xs text-slate-900 font-bold leading-none">
                {totalStudyDays} Days
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Total Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[650px]">
          <div className="flex items-start gap-1.5">
            {/* Day Labels */}
            <div className="flex flex-col gap-1.5 text-[10px] font-bold text-slate-400 pr-2 pt-0.5">
              <span className="h-3.5 leading-none">Sun</span>
              <span className="h-3.5 leading-none">Mon</span>
              <span className="h-3.5 leading-none">Tue</span>
              <span className="h-3.5 leading-none">Wed</span>
              <span className="h-3.5 leading-none">Thu</span>
              <span className="h-3.5 leading-none">Fri</span>
              <span className="h-3.5 leading-none">Sat</span>
            </div>

            {/* Matrix of Columns */}
            <div className="flex gap-1.5">
              {columns.map((col, cIdx) => (
                <div key={`col-${cIdx}`} className="flex flex-col gap-1.5">
                  {col.map((cell) => (
                    <motion.div
                      key={cell.date}
                      whileHover={{ scale: 1.3 }}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-colors ${getColorClass(
                        cell.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend and Hover Tooltip Bar */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div>
              {hoveredCell ? (
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{hoveredCell.date}</strong>: {hoveredCell.count > 0 ? `${hoveredCell.count} mins study • +${hoveredCell.xp} XP` : 'No study logged'}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Hover over any day tile to inspect study duration and XP
                </span>
              )}
            </div>

            {/* Scale */}
            <div className="flex items-center space-x-1.5 text-[10px] font-medium text-slate-400">
              <span>Less</span>
              <div className="w-3 h-3 rounded-xs bg-slate-100 border border-slate-200"></div>
              <div className="w-3 h-3 rounded-xs bg-emerald-200 border border-emerald-300"></div>
              <div className="w-3 h-3 rounded-xs bg-emerald-400 border border-emerald-500"></div>
              <div className="w-3 h-3 rounded-xs bg-emerald-600 border border-emerald-700"></div>
              <div className="w-3 h-3 rounded-xs bg-amber-500 border border-amber-600"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
