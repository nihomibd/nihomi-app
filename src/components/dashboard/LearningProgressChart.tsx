import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ChartMetric = 'duration' | 'kanji' | 'milestones';
type TimeRange = '7d' | '14d' | '30d';

interface LearningProgressChartProps {
  studentLevel?: string;
}

export const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
  studentLevel = 'N5'
}) => {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('duration');
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');

  // Daily Study Duration Data
  const durationData = useMemo(() => {
    const count = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const items = [];
    const today = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const hash = (d.getFullYear() * 17 + (d.getMonth() + 1) * 23 + d.getDate() * 7) % 50;
      const minutes = 25 + hash + (i % 2 === 0 ? 15 : 0);
      const target = 45;

      items.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes,
        target,
        sessions: Math.max(1, Math.round(minutes / 25))
      });
    }
    return items;
  }, [timeRange]);

  // Mastered Kanji & Vocab cumulative growth over time
  const growthData = useMemo(() => {
    const count = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const items = [];
    const today = new Date();
    let baseKanji = 18;
    let baseVocab = 45;
    let baseGrammar = 8;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      baseKanji += Math.floor(Math.random() * 3) + 1;
      baseVocab += Math.floor(Math.random() * 6) + 2;
      if (i % 3 === 0) baseGrammar += 1;

      items.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        masteredKanji: baseKanji,
        masteredVocab: baseVocab,
        grammarPatterns: baseGrammar
      });
    }
    return items;
  }, [timeRange]);

  // JLPT Competency Milestone Radar Data
  const jlptMilestoneData = [
    { subject: 'Vocabulary (語彙)', current: 84, target: 100, fullMark: 100 },
    { subject: 'Kanji (漢字)', current: 76, target: 100, fullMark: 100 },
    { subject: 'Grammar (文法)', current: 88, target: 100, fullMark: 100 },
    { subject: 'Listening (聴解)', current: 65, target: 100, fullMark: 100 },
    { subject: 'Reading (読解)', current: 72, target: 100, fullMark: 100 }
  ];

  const totalMinutesStudied = durationData.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgDailyMinutes = Math.round(totalMinutesStudied / durationData.length);
  const currentTotalKanji = growthData[growthData.length - 1]?.masteredKanji || 48;
  const currentTotalVocab = growthData[growthData.length - 1]?.masteredVocab || 165;

  return (
    <div
      id="learning-progress-chart-component"
      className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-stone-900"
    >
      {/* Header with Metric Mode Switcher & Time Range Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="flex items-center space-x-3">
          <span className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200">
            <TrendingUp className="w-5 h-5 text-red-600" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <span>Learning Analytics & Progress Engine</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                JLPT {studentLevel}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Interactive visualization for study duration, cumulative Kanji mastery, and JLPT benchmarks
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric('duration')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMetric === 'duration'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Study Duration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('kanji')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMetric === 'kanji'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kanji Growth</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('milestones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMetric === 'milestones'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>JLPT Radar</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">
            Avg Daily Focus
          </span>
          <p className="text-xl font-bold font-mono text-stone-900">
            {avgDailyMinutes} <span className="text-xs font-normal text-stone-500">mins/day</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">+12% vs last period</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">
            Mastered Kanji
          </span>
          <p className="text-xl font-bold font-mono text-stone-900">
            {currentTotalKanji} <span className="text-xs font-normal text-stone-500">/ 103 (N5)</span>
          </p>
          <span className="text-[10px] text-red-600 font-bold">
            {Math.round((currentTotalKanji / 103) * 100)}% of N5 curriculum
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">
            Retained Vocab
          </span>
          <p className="text-xl font-bold font-mono text-stone-900">
            {currentTotalVocab} <span className="text-xs font-normal text-stone-500">words</span>
          </p>
          <span className="text-[10px] text-purple-600 font-bold">SM-2 Spaced Retention</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">
            Target Readiness
          </span>
          <p className="text-xl font-bold font-mono text-stone-900">
            78% <span className="text-xs font-normal text-stone-500">Pass Index</span>
          </p>
          <span className="text-[10px] text-amber-600 font-bold">On track for December</span>
        </div>
      </div>

      {/* Time Range Filter (For Duration & Kanji Growth) */}
      {activeMetric !== 'milestones' && (
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-semibold">Showing trend data:</span>
          <div className="flex items-center space-x-1">
            {(['7d', '14d', '30d'] as TimeRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                  timeRange === r
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chart Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        {activeMetric === 'duration' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1917',
                  borderColor: '#292524',
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any) => [
                  `${value} minutes`,
                  name === 'minutes' ? 'Study Duration' : 'Goal Target'
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                name="Daily Goal (45m)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#DC2626"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#durationGradient)"
                name="Minutes Studied"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeMetric === 'kanji' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1917',
                  borderColor: '#292524',
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="masteredKanji"
                stroke="#DC2626"
                strokeWidth={2.5}
                name="Mastered Kanji (漢字)"
                dot={{ r: 3, fill: '#DC2626' }}
              />
              <Line
                type="monotone"
                dataKey="masteredVocab"
                stroke="#9333EA"
                strokeWidth={2.5}
                name="Retained Vocab (単語)"
                dot={{ r: 3, fill: '#9333EA' }}
              />
              <Line
                type="monotone"
                dataKey="grammarPatterns"
                stroke="#2563EB"
                strokeWidth={2}
                name="Grammar Rules (文法)"
                dot={{ r: 2, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeMetric === 'milestones' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={jlptMilestoneData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="subject" stroke="#4B5563" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" fontSize={10} />
              <Radar
                name="Current Mastery (%)"
                dataKey="current"
                stroke="#DC2626"
                fill="#DC2626"
                fillOpacity={0.35}
              />
              <Radar
                name="JLPT Benchmark (100%)"
                dataKey="target"
                stroke="#F59E0B"
                strokeDasharray="3 3"
                fill="#F59E0B"
                fillOpacity={0.05}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1917',
                  borderColor: '#292524',
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
