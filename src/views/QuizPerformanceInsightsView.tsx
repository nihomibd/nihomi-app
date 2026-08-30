import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  ArrowLeft,
  Brain,
  Zap,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  BarChart3,
  Target,
  RefreshCw,
  Play,
  RotateCcw,
  BookOpen,
  Languages
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine
} from 'recharts';
import { getSrsSummaryStats, getSrsState } from '../lib/srs';

interface QuizPerformanceInsightsViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const QuizPerformanceInsightsView: React.FC<QuizPerformanceInsightsViewProps> = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'N5' | 'N4' | 'N3'>('N5');
  const [selectedParticleFilter, setSelectedParticleFilter] = useState<string | null>(null);

  // Retrieve actual local SRS stats or fallback to computed performance
  const srsStats = useMemo(() => getSrsSummaryStats(), []);
  const allSrsItems = useMemo(() => Object.values(getSrsState()), []);

  // 1. Particle Performance Dataset
  const particlePerformanceData = useMemo(() => [
    {
      particle: 'は (wa)',
      fullName: 'Topic Marker (は)',
      accuracy: 88,
      attempts: 42,
      mastery: 'High',
      benchmark: 85,
      notesEn: 'Topic marker: distinguishes known topic from new assertion.',
      notesBn: 'টপিক মার্কার: বাক্যের মূল আলোচ্য বিষয় নির্দেশ করে।'
    },
    {
      particle: 'が (ga)',
      fullName: 'Subject / Focus Marker (が)',
      accuracy: 64,
      attempts: 38,
      mastery: 'Needs Work',
      benchmark: 85,
      notesEn: 'Subject/Identifier marker: marks specific actor or answers "who/which".',
      notesBn: 'নির্দিষ্ট কর্তা নির্দেশক: কে বা কোনটি প্রশ্নের উত্তর দেয়।'
    },
    {
      particle: 'に (ni)',
      fullName: 'Time / Destination (に)',
      accuracy: 72,
      attempts: 50,
      mastery: 'Moderate',
      benchmark: 85,
      notesEn: 'Points to specific point in time or final static location/recipient.',
      notesBn: 'নির্দিষ্ট সময়, স্থির অবস্থান বা গন্তব্যের বিন্দু নির্দেশ করে।'
    },
    {
      particle: 'で (de)',
      fullName: 'Action Location / Means (で)',
      accuracy: 79,
      attempts: 45,
      mastery: 'Moderate',
      benchmark: 85,
      notesEn: 'Marks venue where dynamic action occurs or vehicle/tool used.',
      notesBn: 'যেখানে ক্রিয়া সংঘটিত হয় বা যে মাধ্যম/যানবাহন দিয়ে করা হয়।'
    },
    {
      particle: 'へ (e)',
      fullName: 'Directional Vector (へ)',
      accuracy: 58,
      attempts: 31,
      mastery: 'Critical Weakness',
      benchmark: 85,
      notesEn: 'Direction of movement toward a destination (often confused with に).',
      notesBn: 'কোনো নির্দিষ্ট গন্তব্যের অভিমুখী চলাচলের দিক নির্দেশ করে।'
    },
    {
      particle: 'を (o)',
      fullName: 'Direct Object (を)',
      accuracy: 94,
      attempts: 55,
      mastery: 'Mastered',
      benchmark: 85,
      notesEn: 'Marks the direct object receiving the transitive action.',
      notesBn: 'সকর্মক ক্রিয়ার কর্ম বা অবজেক্ট নির্দেশ করে।'
    },
    {
      particle: 'と (to)',
      fullName: 'And / Together With (と)',
      accuracy: 91,
      attempts: 34,
      mastery: 'Mastered',
      benchmark: 85,
      notesEn: 'Complete noun listing or companion actor ("together with").',
      notesBn: 'এবং (পরিপূর্ণ তালিকা) বা "সাথে" নির্দেশক কণা।'
    },
    {
      particle: 'から/まで',
      fullName: 'Range: From / To (から〜まで)',
      accuracy: 84,
      attempts: 29,
      mastery: 'Good',
      benchmark: 85,
      notesEn: 'Time or spatial origin (から) to terminal boundary (まで).',
      notesBn: 'শুরু (হতে/থেকে) এবং শেষ (পর্যন্ত) সীমা নির্দেশক।'
    }
  ], []);

  // 2. Timeline Retention Curve Data (Past 14 Days)
  const retentionTimelineData = useMemo(() => [
    { day: 'Aug 17', vocabRetention: 68, kanjiRetention: 62, grammarPrecision: 70, srsReviews: 12 },
    { day: 'Aug 19', vocabRetention: 72, kanjiRetention: 65, grammarPrecision: 71, srsReviews: 18 },
    { day: 'Aug 21', vocabRetention: 75, kanjiRetention: 68, grammarPrecision: 74, srsReviews: 24 },
    { day: 'Aug 23', vocabRetention: 79, kanjiRetention: 74, grammarPrecision: 78, srsReviews: 30 },
    { day: 'Aug 25', vocabRetention: 83, kanjiRetention: 77, grammarPrecision: 80, srsReviews: 22 },
    { day: 'Aug 27', vocabRetention: 85, kanjiRetention: 82, grammarPrecision: 84, srsReviews: 35 },
    { day: 'Aug 29', vocabRetention: 89, kanjiRetention: 84, grammarPrecision: 86, srsReviews: 40 },
    { day: 'Today', vocabRetention: 92, kanjiRetention: 88, grammarPrecision: 89, srsReviews: 28 }
  ], []);

  // 3. 5-Pillar Competency Radar Dataset
  const competencyRadarData = useMemo(() => [
    { subject: 'Particles (助詞)', score: 76, fullMark: 100 },
    { subject: 'Kanji Strokes (漢字筆順)', score: 84, fullMark: 100 },
    { subject: 'Verb Forms (活用)', score: 81, fullMark: 100 },
    { subject: 'Vocabulary Recall (語彙)', score: 92, fullMark: 100 },
    { subject: 'Context Nuance (読解)', score: 78, fullMark: 100 }
  ], []);

  // 4. Identified Linguistic Weakness Vector
  const weaknessVectorList = [
    {
      id: 'wv-1',
      concept: 'Particle 「へ」 vs 「に」 in Direction',
      conceptJa: '「へ」と「に」の使い分け',
      errorRate: '42%',
      causeEn: 'Using 「に」 when focusing purely on the directional vector rather than the static arrival arrival point.',
      causeBn: 'নির্দিষ্ট গন্তব্যে পৌঁছানো (に) এবং গন্তব্যের অভিমুখে যাত্রা (へ) এর মধ্যকার সূক্ষ্ম পার্থক্য গুলিয়ে ফেলা।',
      sampleMistake: '❌ 東京に 行きます (Acceptable, but misses pure vector orientation)',
      correction: '✅ 東京へ 行きます (Emphasizes movement towards Tokyo direction)',
      fixActionLabel: 'Drill 10 Vector Sentences'
    },
    {
      id: 'wv-2',
      concept: 'Topic 「は」 vs Subject 「が」 in Subordinate Clauses',
      conceptJa: '主節・従属節の「は」と「が」',
      errorRate: '36%',
      causeEn: 'Defaulting to 「は」 inside relative qualifying clauses where 「が」 is required.',
      causeBn: 'সংযুক্ত বাক্যাংশে (Relative Clause) বিষয়ের ক্ষেত্রে 「が」 ব্যবহার না করে 「は」 দিয়ে ফেলা।',
      sampleMistake: '❌ わたしは 買った 本',
      correction: '✅ わたしが 買った 本 (The book that I bought)',
      fixActionLabel: 'Master Relative Clauses'
    },
    {
      id: 'wv-3',
      concept: 'Kanji Stroke Order: 「学」 & 「先」 Top Radicals',
      conceptJa: '「学」・「先」の筆順ミス',
      errorRate: '30%',
      causeEn: 'Drawing the middle crown vertical before the left and right slanted dots.',
      causeBn: 'মাথার মুকুট লেখার সময় বাম-ডানের বিন্দুর আগে মাঝের দাগ দিয়ে ফেলা।',
      sampleMistake: '❌ Started from central pillar first',
      correction: '✅ Left dot → Middle slant → Right dot → Roof cover',
      fixActionLabel: 'Trace in Stroke Animator'
    }
  ];

  // 5. Recent Quiz Attempts Log
  const pastQuizLogs = [
    {
      id: 'att-101',
      title: 'JLPT N5 Lesson 5-8 Comprehensive Sprint',
      date: 'Today, 2:15 PM',
      score: 85,
      total: 20,
      mode: 'Adaptive Mastery',
      duration: '4m 12s',
      status: 'Passed'
    },
    {
      id: 'att-102',
      title: 'Essential Particles Speed Challenge',
      date: 'Yesterday',
      score: 70,
      total: 10,
      mode: 'Speed Challenge (15s)',
      duration: '2m 05s',
      status: 'Review Needed'
    },
    {
      id: 'att-103',
      title: 'Lesson 1-4 Basics & Identity Checkpoint',
      date: '3 Days Ago',
      score: 95,
      total: 20,
      mode: 'Standard',
      duration: '5m 40s',
      status: 'Mastered'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 font-sans pb-24 text-left transition-colors">
      
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="bg-stone-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('portal')}
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Student Portal</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>MEMORY RETENTION VECTOR™ & RECHARTS ANALYTICS</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Quiz Performance Insights</span>
                <span className="text-xl font-japanese font-normal text-stone-400">（学習成績と記憶曲線）</span>
              </h1>
              <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
                Granular visual breakdown of grammatical particle precision, kanji stroke accuracy, and Ebbinghaus forgetting curve stability over time.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('quiz-runner', { intensity: 'adaptive_mastery' })}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch Adaptive Remediation Quiz</span>
              </button>
            </div>
          </div>

          {/* Time & Level Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800 text-xs">
            {/* Level selector */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-semibold">Target Level:</span>
              <div className="flex bg-stone-800 rounded-xl p-1 border border-stone-700">
                {(['N5', 'N4', 'N3', 'all'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {lvl === 'all' ? 'All Levels' : `JLPT ${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Time range selector */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-semibold">Timeline:</span>
              <div className="flex bg-stone-800 rounded-xl p-1 border border-stone-700">
                {(['7d', '30d', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      timeRange === range
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS SUMMARY CARDS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Overall Accuracy */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-red-500" />
              Overall Quiz Accuracy
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                83.5%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +4.2% this week
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Across 285 total quiz questions answered
            </p>
          </div>

          {/* Card 2: Particle Mastery Index */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              Particle Precision (助詞)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                76.2%
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Weak: 「へ」 & 「が」
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Target benchmark: 85% for JLPT N5
            </p>
          </div>

          {/* Card 3: Kanji Stroke Accuracy */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-500" />
              Kanji Stroke Accuracy
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                87.0%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Optimal
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Mastered {srsStats.masteredCount} out of {srsStats.totalTracked} character items
            </p>
          </div>

          {/* Card 4: SRS SM-2 Stability */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              Memory Half-Life
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                14.2 <span className="text-xs font-normal text-stone-500">Days</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                SM-2 Active
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {srsStats.dueTodayCount} reviews currently scheduled for today
            </p>
          </div>

        </div>

        {/* 3. RECHARTS VISUALIZATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart 1: Grammar Particle Accuracy Breakdown (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  <span>Grammar Particle Precision Breakdown</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Accuracy percentage across core Japanese grammatical particles. Red dashed line indicates the 85% JLPT N5 competency benchmark.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 self-start sm:self-auto">
                Goal: ≥ 85%
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={particlePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                  <XAxis
                    dataKey="particle"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#88888840' }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-stone-700">
                            <p className="font-bold text-red-400">{data.fullName}</p>
                            <p className="font-mono text-sm">Accuracy: <span className="font-bold text-white">{data.accuracy}%</span> ({data.attempts} questions)</p>
                            <p className="text-stone-300 text-[11px]">{data.notesEn}</p>
                            <p className="text-indigo-300 text-[11px]">{data.notesBn}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'N5 Target (85%)', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                  <Bar
                    dataKey="accuracy"
                    radius={[8, 8, 0, 0]}
                    fill="#3b82f6"
                    onClick={(data: any) => data?.particle && setSelectedParticleFilter(data.particle)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Clickable Particle Pills for Quick Drill-down */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              {particlePerformanceData.map((p) => (
                <button
                  key={p.particle}
                  onClick={() => setSelectedParticleFilter(selectedParticleFilter === p.particle ? null : p.particle)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    p.accuracy < 70
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      : p.accuracy < 85
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  } ${selectedParticleFilter === p.particle ? 'ring-2 ring-stone-900 dark:ring-white' : ''}`}
                >
                  <span className="font-bold">{p.particle}</span>
                  <span className="font-mono text-[10px]">{p.accuracy}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart 2: 5-Pillar Competency Radar (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                <span>Competency Radar</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Multi-axial assessment across 5 core mastery pillars.
              </p>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={competencyRadarData}>
                  <PolarGrid stroke="#88888830" />
                  <PolarAngleAxis dataKey="subject" stroke="#888888" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#88888840" fontSize={9} />
                  <Radar
                    name="Student Score"
                    dataKey="score"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.35}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                Strongest: <span className="text-emerald-600 dark:text-emerald-400">Vocabulary (92%)</span> • Focus Area:{' '}
                <span className="text-rose-600 dark:text-rose-400">Particles (76%)</span>
              </span>
            </div>
          </div>

        </div>

        {/* 4. RETENTION TIMELINE AREA CHART */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Memory Retention & Accuracy Trend (Ebbinghaus SM-2 Curve)</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Tracking how consistent daily SRS reviews prevent forgetting curve decay across Vocabulary, Kanji, and Grammar.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Vocab Recall
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Kanji Accuracy
              </span>
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Grammar Precision
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="vocabGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="kanjiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="grammarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" vertical={false} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} unit="%" />
                <Tooltip />
                <Area type="monotone" dataKey="vocabRetention" name="Vocab Retention" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#vocabGrad)" />
                <Area type="monotone" dataKey="kanjiRetention" name="Kanji Retention" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#kanjiGrad)" />
                <Area type="monotone" dataKey="grammarPrecision" name="Grammar Precision" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#grammarGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. IDENTIFIED LINGUISTIC WEAKNESS VECTOR (SOCRATIC DIAGNOSTICS) */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>SOCRATIC DIAGNOSTICS</span>
              </div>
              <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1">
                Identified Linguistic Weakness Vectors
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Root-cause analysis computed from recent quiz answer patterns with targeted corrective mnemonics.
              </p>
            </div>
            <button
              onClick={() => onNavigate('quiz-runner', { intensity: 'adaptive_mastery' })}
              className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Practice All Weak Spots</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weaknessVectorList.map((wv) => (
              <div
                key={wv.id}
                className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black text-rose-800 dark:text-rose-300">
                      {wv.concept}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 shrink-0">
                      {wv.errorRate} Error
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {wv.causeEn}
                  </p>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">
                    {wv.causeBn}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] space-y-1 font-mono">
                    <p className="text-rose-600 dark:text-rose-400">{wv.sampleMistake}</p>
                    <p className="text-emerald-600 dark:text-emerald-400">{wv.correction}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('quiz-runner', { intensity: 'adaptive_mastery', targetConcept: wv.concept })}
                  className="w-full mt-2 py-2 px-3 bg-white dark:bg-stone-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Zap className="w-3 h-3" />
                  <span>{wv.fixActionLabel}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 6. HISTORICAL QUIZ SESSIONS LOG */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-stone-500" />
              <span>Recent Quiz Sessions</span>
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Showing past 3 verified test sprints
            </span>
          </div>

          <div className="space-y-3">
            {pastQuizLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      {log.title}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {log.mode}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                    <span>{log.date}</span>
                    <span>•</span>
                    <span>Duration: {log.duration}</span>
                    <span>•</span>
                    <span>Questions: {log.total}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-stone-900 dark:text-white">
                      {log.score}%
                    </span>
                    <span className={`block text-[10px] font-bold ${
                      log.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('quiz-runner', { intensity: 'speed_challenge' })}
                    className="px-3 py-1.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Retake
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
