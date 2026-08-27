import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Award,
  Sparkles,
  Layers,
  BookOpen,
  TrendingUp,
  Target,
  BrainCircuit,
  CheckCircle2
} from 'lucide-react';

interface JlptPillarScore {
  pillar: string;
  pillarBn: string;
  score: number; // 0 - 100
  fullMark: number;
}

const LEVEL_DATA: Record<string, { pillars: JlptPillarScore[]; overallMastery: number; targetHours: number }> = {
  N5: {
    overallMastery: 88,
    targetHours: 150,
    pillars: [
      { pillar: 'Grammar (文法)', pillarBn: 'ব্যাকরণ', score: 92, fullMark: 100 },
      { pillar: 'Kanji (漢字)', pillarBn: 'কাঞ্জি (১০০+)', score: 85, fullMark: 100 },
      { pillar: 'Vocabulary (語彙)', pillarBn: 'শব্দভাণ্ডার', score: 90, fullMark: 100 },
      { pillar: 'Reading (読解)', pillarBn: 'পঠন দক্ষতা', score: 82, fullMark: 100 },
      { pillar: 'Listening (聴解)', pillarBn: 'শ্রবণ দক্ষতা', score: 91, fullMark: 100 }
    ]
  },
  N4: {
    overallMastery: 64,
    targetHours: 300,
    pillars: [
      { pillar: 'Grammar (文法)', pillarBn: 'ব্যাকরণ', score: 68, fullMark: 100 },
      { pillar: 'Kanji (漢字)', pillarBn: 'কাঞ্জি (৩০০+)', score: 60, fullMark: 100 },
      { pillar: 'Vocabulary (語彙)', pillarBn: 'শব্দভাণ্ডার', score: 72, fullMark: 100 },
      { pillar: 'Reading (読解)', pillarBn: 'পঠন দক্ষতা', score: 58, fullMark: 100 },
      { pillar: 'Listening (聴解)', pillarBn: 'শ্রবণ দক্ষতা', score: 62, fullMark: 100 }
    ]
  },
  N3: {
    overallMastery: 35,
    targetHours: 450,
    pillars: [
      { pillar: 'Grammar (文法)', pillarBn: 'ব্যাকরণ', score: 40, fullMark: 100 },
      { pillar: 'Kanji (漢字)', pillarBn: 'কাঞ্জি (৬৫০+)', score: 32, fullMark: 100 },
      { pillar: 'Vocabulary (語彙)', pillarBn: 'শব্দভাণ্ডার', score: 38, fullMark: 100 },
      { pillar: 'Reading (読解)', pillarBn: 'পঠন দক্ষতা', score: 30, fullMark: 100 },
      { pillar: 'Listening (聴解)', pillarBn: 'শ্রবণ দক্ষতা', score: 35, fullMark: 100 }
    ]
  },
  N2: {
    overallMastery: 12,
    targetHours: 600,
    pillars: [
      { pillar: 'Grammar (文法)', pillarBn: 'ব্যাকরণ', score: 15, fullMark: 100 },
      { pillar: 'Kanji (漢字)', pillarBn: 'কাঞ্জি (১০০০+)', score: 10, fullMark: 100 },
      { pillar: 'Vocabulary (語彙)', pillarBn: 'শব্দভাণ্ডার', score: 14, fullMark: 100 },
      { pillar: 'Reading (読解)', pillarBn: 'পঠন দক্ষতা', score: 12, fullMark: 100 },
      { pillar: 'Listening (聴解)', pillarBn: 'শ্রবণ দক্ষতা', score: 9, fullMark: 100 }
    ]
  },
  N1: {
    overallMastery: 5,
    targetHours: 900,
    pillars: [
      { pillar: 'Grammar (文法)', pillarBn: 'ব্যাকরণ', score: 6, fullMark: 100 },
      { pillar: 'Kanji (漢字)', pillarBn: 'কাঞ্জি (২০০০+)', score: 4, fullMark: 100 },
      { pillar: 'Vocabulary (語彙)', pillarBn: 'শব্দভাণ্ডার', score: 7, fullMark: 100 },
      { pillar: 'Reading (読解)', pillarBn: 'পঠন দক্ষতা', score: 4, fullMark: 100 },
      { pillar: 'Listening (聴解)', pillarBn: 'শ্রবণ দক্ষতা', score: 4, fullMark: 100 }
    ]
  }
};

export const JlptRadarMasteryDashboard: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const levelInfo = LEVEL_DATA[selectedLevel];

  const barComparisonData = [
    { level: 'N5', mastery: 88, fill: '#DC2626' },
    { level: 'N4', mastery: 64, fill: '#F59E0B' },
    { level: 'N3', mastery: 35, fill: '#3B82F6' },
    { level: 'N2', mastery: 12, fill: '#8B5CF6' },
    { level: 'N1', mastery: 5, fill: '#6B7280' },
  ];

  return (
    <div
      id="jlpt-radar-mastery-dashboard"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs text-left space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase rounded-md font-mono mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Recharts JLPT Multi-Category Competency</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            JLPT Mastery Radar & Pillar Assessment
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Holistic skill evaluation across Grammar, Kanji, Vocab, Reading, and Listening.
          </p>
        </div>

        {/* Level Tabs N5 - N1 */}
        <div className="flex items-center space-x-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700">
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual: Radar Chart & Comparative Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart (7 Cols) */}
        <div className="lg:col-span-7 h-[300px] w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={levelInfo.pillars}>
              <PolarGrid stroke="#E7E5E4" />
              <PolarAngleAxis
                dataKey="pillar"
                tick={{ fill: '#78716C', fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D6D3D1" />
              <Radar
                name={selectedLevel}
                dataKey="score"
                stroke="#DC2626"
                fill="#DC2626"
                fillOpacity={0.45}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Breakdown & N5-N1 Milestone Bars (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-stone-50 dark:bg-stone-950/40 p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
              JLPT {selectedLevel} Overall
            </span>
            <span className="text-lg font-bold font-mono text-red-600 dark:text-red-400">
              {levelInfo.overallMastery}% Mastery
            </span>
          </div>

          {/* Mini Bar Breakdown per level */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase font-mono block">
              Level Progression Comparison
            </span>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barComparisonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#78716C' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#78716C' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1917',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="mastery" radius={[6, 6, 0, 0]}>
                    {barComparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.level === selectedLevel ? '#DC2626' : entry.fill}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pillars List Quick View */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
            {levelInfo.pillars.slice(0, 3).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="text-stone-600 dark:text-stone-300 font-medium">
                  {p.pillar}
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">
                  {p.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
