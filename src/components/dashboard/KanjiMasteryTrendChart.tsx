import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { JLPTLevel } from '../../types/nihomi';

interface KanjiMasteryTrendChartProps {
  currentLevel?: JLPTLevel;
  masteredCount?: number;
}

export const KanjiMasteryTrendChart: React.FC<KanjiMasteryTrendChartProps> = ({
  currentLevel = 'N5',
  masteredCount = 84,
}) => {
  const [timeRange, setTimeRange] = useState<'14d' | '30d'>('14d');
  const targetTotal = currentLevel === 'N5' ? 120 : currentLevel === 'N4' ? 300 : 650;

  // 14-day learning trajectory data
  const data14d = [
    { day: 'Day 1', date: 'Aug 13', mastered: 24, reviewed: 32, precision: 88, target: 20 },
    { day: 'Day 2', date: 'Aug 14', mastered: 28, reviewed: 40, precision: 90, target: 26 },
    { day: 'Day 3', date: 'Aug 15', mastered: 35, reviewed: 45, precision: 91, target: 32 },
    { day: 'Day 4', date: 'Aug 16', mastered: 41, reviewed: 52, precision: 89, target: 40 },
    { day: 'Day 5', date: 'Aug 17', mastered: 46, reviewed: 48, precision: 92, target: 48 },
    { day: 'Day 6', date: 'Aug 18', mastered: 52, reviewed: 56, precision: 94, target: 55 },
    { day: 'Day 7', date: 'Aug 19', mastered: 58, reviewed: 60, precision: 95, target: 62 },
    { day: 'Day 8', date: 'Aug 20', mastered: 63, reviewed: 65, precision: 93, target: 70 },
    { day: 'Day 9', date: 'Aug 21', mastered: 69, reviewed: 72, precision: 96, target: 78 },
    { day: 'Day 10', date: 'Aug 22', mastered: 74, reviewed: 80, precision: 97, target: 85 },
    { day: 'Day 11', date: 'Aug 23', mastered: 78, reviewed: 85, precision: 96, target: 92 },
    { day: 'Day 12', date: 'Aug 24', mastered: 81, reviewed: 88, precision: 98, target: 100 },
    { day: 'Day 13', date: 'Aug 25', mastered: 84, reviewed: 92, precision: 98, target: 108 },
    { day: 'Today', date: 'Aug 26', mastered: masteredCount, reviewed: 95, precision: 99, target: 115 },
  ];

  const currentData = data14d;
  const currentCompletionRate = Math.round((masteredCount / targetTotal) * 100);

  return (
    <div
      id="nihomi-kanji-mastery-trend-chart"
      className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xs text-left space-y-4 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="space-y-0.5">
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kanji Mastery Velocity (漢字習得曲線)</span>
          </div>
          <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
            JLPT {currentLevel} Kanji Retention & Completion Trends
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Real-time memory curve modeled via Spaced Repetition (SRS) and Kanji Stroke precision.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 text-center">
            <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block">Mastered</span>
            <span className="text-sm font-black font-mono text-red-700 dark:text-red-300">
              {masteredCount}/{targetTotal}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Rate</span>
            <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-300">
              {currentCompletionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* RECHARTS AREA CHART */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="kanjiMasteredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="targetVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-stone-800" />
            
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#888' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={false}
            />
            
            <YAxis
              domain={[0, targetTotal]}
              tick={{ fontSize: 11, fill: '#888' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={false}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload;
                  return (
                    <div className="bg-stone-900 text-white p-3 rounded-2xl shadow-xl border border-stone-700 text-xs space-y-1 text-left">
                      <div className="font-bold text-stone-300 flex items-center justify-between gap-4">
                        <span>{label} ({pData.date})</span>
                        <span className="text-[10px] font-mono text-emerald-400">★ {pData.precision}% Accuracy</span>
                      </div>
                      <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                        <span>● Mastered:</span>
                        <span>{pData.mastered} Kanji</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-400 text-[11px]">
                        <span>Reviewed:</span>
                        <span>{pData.reviewed} checks</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="mastered"
              name="Mastered Kanji"
              stroke="#DC2626"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#kanjiMasteredGradient)"
            />

            <Area
              type="monotone"
              dataKey="target"
              name="JLPT Target Velocity"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#targetVelocityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
        <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Daily Velocity</span>
          <span className="font-bold text-stone-900 dark:text-white font-mono">+4.2 Kanji / day</span>
        </div>
        <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Stroke Accuracy</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">98.4% Precision</span>
        </div>
        <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Ghost Re-tests</span>
          <span className="font-bold text-stone-900 dark:text-white font-mono">0 Pending</span>
        </div>
        <div className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Est. Completion</span>
          <span className="font-bold text-red-600 dark:text-red-400 font-mono">9 Days (Sep 4)</span>
        </div>
      </div>
    </div>
  );
};
