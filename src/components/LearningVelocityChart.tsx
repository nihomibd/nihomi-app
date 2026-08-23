import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Activity, Sparkles, BookOpen, Layers, Volume2, Calendar } from 'lucide-react';

interface LearningVelocityChartProps {
  totalMinutes?: number;
  completedLessons?: number;
}

export const LearningVelocityChart: React.FC<LearningVelocityChartProps> = ({
  totalMinutes = 120,
  completedLessons = 4
}) => {
  const [chartMode, setChartMode] = useState<'stacked' | 'bar' | 'velocity'>('stacked');
  const [selectedSkill, setSelectedSkill] = useState<'all' | 'kanji' | 'grammar' | 'vocabulary' | 'listening'>('all');

  // Generate realistic 30-day historical time & velocity distribution
  const thirtyDayData = useMemo(() => {
    const today = new Date();
    const data = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
      const dayOfWeek = date.getDay(); // 0 is Sun, 6 is Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Base variance based on day
      const activityMultiplier = isWeekend ? 1.4 : (i % 3 === 0 ? 1.2 : 0.85);
      const baseMins = Math.max(5, Math.round((12 + ((29 - i) * 0.4) + ((i * 7) % 15)) * activityMultiplier));

      const kanji = Math.round(baseMins * 0.32);
      const grammar = Math.round(baseMins * 0.28);
      const vocabulary = Math.round(baseMins * 0.26);
      const listening = Math.max(2, baseMins - (kanji + grammar + vocabulary));

      // Velocity: mastery points / items acquired per day
      const velocityPoints = Math.round((kanji * 1.5) + (vocabulary * 1.2) + (grammar * 2.0));

      data.push({
        date: dateLabel,
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: kanji + grammar + vocabulary + listening,
        kanji,
        grammar,
        vocabulary,
        listening,
        velocity: velocityPoints
      });
    }
    return data;
  }, []);

  const total30DayMins = useMemo(() => {
    return thirtyDayData.reduce((acc, curr) => acc + curr.total, 0);
  }, [thirtyDayData]);

  const skillTotals = useMemo(() => {
    return {
      kanji: thirtyDayData.reduce((acc, curr) => acc + curr.kanji, 0),
      grammar: thirtyDayData.reduce((acc, curr) => acc + curr.grammar, 0),
      vocabulary: thirtyDayData.reduce((acc, curr) => acc + curr.vocabulary, 0),
      listening: thirtyDayData.reduce((acc, curr) => acc + curr.listening, 0)
    };
  }, [thirtyDayData]);

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>30-Day Skill Velocity</span>
            </span>
            <span className="text-xs text-stone-500 font-medium">Time per category & acceleration</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">
            Learning Velocity & Skill Category Breakdown
          </h3>
          <p className="text-xs text-stone-500 max-w-xl">
            Detailed tracking of minutes spent acquiring Kanji, Grammar structures, Vocabulary cards, and Audio listening over the past 30 days.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Stacked Area
            </button>
            <button
              onClick={() => setChartMode('bar')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMode === 'bar'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Daily Bars
            </button>
            <button
              onClick={() => setChartMode('velocity')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                chartMode === 'velocity'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              XP Velocity
            </button>
          </div>
        </div>
      </div>

      {/* Skill Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedSkill(selectedSkill === 'kanji' ? 'all' : 'kanji')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            selectedSkill === 'kanji'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20'
              : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>漢字 Kanji</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          </div>
          <p className="text-xl font-bold font-serif text-stone-900 mt-1">
            {skillTotals.kanji} <span className="text-xs font-normal text-stone-500">mins</span>
          </p>
          <p className="text-[10px] text-stone-400 font-medium">
            {Math.round((skillTotals.kanji / total30DayMins) * 100)}% of total study
          </p>
        </button>

        <button
          onClick={() => setSelectedSkill(selectedSkill === 'grammar' ? 'all' : 'grammar')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            selectedSkill === 'grammar'
              ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/20'
              : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>文法 Grammar</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          </div>
          <p className="text-xl font-bold font-serif text-stone-900 mt-1">
            {skillTotals.grammar} <span className="text-xs font-normal text-stone-500">mins</span>
          </p>
          <p className="text-[10px] text-stone-400 font-medium">
            {Math.round((skillTotals.grammar / total30DayMins) * 100)}% of total study
          </p>
        </button>

        <button
          onClick={() => setSelectedSkill(selectedSkill === 'vocabulary' ? 'all' : 'vocabulary')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            selectedSkill === 'vocabulary'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
              : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>単語 Vocabulary</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xl font-bold font-serif text-stone-900 mt-1">
            {skillTotals.vocabulary} <span className="text-xs font-normal text-stone-500">mins</span>
          </p>
          <p className="text-[10px] text-stone-400 font-medium">
            {Math.round((skillTotals.vocabulary / total30DayMins) * 100)}% of total study
          </p>
        </button>

        <button
          onClick={() => setSelectedSkill(selectedSkill === 'listening' ? 'all' : 'listening')}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            selectedSkill === 'listening'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
              : 'bg-stone-50/70 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>聴解 Audio / Immersion</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <p className="text-xl font-bold font-serif text-stone-900 mt-1">
            {skillTotals.listening} <span className="text-xs font-normal text-stone-500">mins</span>
          </p>
          <p className="text-[10px] text-stone-400 font-medium">
            {Math.round((skillTotals.listening / total30DayMins) * 100)}% of total study
          </p>
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'velocity' ? (
            <AreaChart data={thirtyDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
                formatter={(val: any) => [`${val} XP Velocity Points`, 'Velocity']}
              />
              <Area type="monotone" dataKey="velocity" stroke="#DC2626" strokeWidth={2.5} fillOpacity={1} fill="url(#velocityGrad)" />
            </AreaChart>
          ) : chartMode === 'bar' ? (
            <BarChart data={thirtyDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
                formatter={(val: any, name: any) => [`${val} mins`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {(selectedSkill === 'all' || selectedSkill === 'kanji') && (
                <Bar dataKey="kanji" name="Kanji" stackId="a" fill="#E11D48" />
              )}
              {(selectedSkill === 'all' || selectedSkill === 'grammar') && (
                <Bar dataKey="grammar" name="Grammar" stackId="a" fill="#6366F1" />
              )}
              {(selectedSkill === 'all' || selectedSkill === 'vocabulary') && (
                <Bar dataKey="vocabulary" name="Vocabulary" stackId="a" fill="#10B981" />
              )}
              {(selectedSkill === 'all' || selectedSkill === 'listening') && (
                <Bar dataKey="listening" name="Listening" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <AreaChart data={thirtyDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="kanjiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E11D48" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="grammarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="vocabGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="listenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ''}
                formatter={(val: any, name: any) => [`${val} mins`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {(selectedSkill === 'all' || selectedSkill === 'kanji') && (
                <Area
                  type="monotone"
                  dataKey="kanji"
                  name="Kanji"
                  stackId="1"
                  stroke="#E11D48"
                  strokeWidth={2}
                  fill="url(#kanjiGrad)"
                />
              )}
              {(selectedSkill === 'all' || selectedSkill === 'grammar') && (
                <Area
                  type="monotone"
                  dataKey="grammar"
                  name="Grammar"
                  stackId="1"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#grammarGrad)"
                />
              )}
              {(selectedSkill === 'all' || selectedSkill === 'vocabulary') && (
                <Area
                  type="monotone"
                  dataKey="vocabulary"
                  name="Vocabulary"
                  stackId="1"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#vocabGrad)"
                />
              )}
              {(selectedSkill === 'all' || selectedSkill === 'listening') && (
                <Area
                  type="monotone"
                  dataKey="listening"
                  name="Listening"
                  stackId="1"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#listenGrad)"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 pt-3">
        <span>Showing 30-day activity aggregated across all study sessions</span>
        <span className="font-semibold text-stone-600">Total: {total30DayMins} minutes</span>
      </div>
    </div>
  );
};
