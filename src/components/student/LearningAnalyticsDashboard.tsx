import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Award,
  Brain,
  Zap,
  Calendar,
  Flame,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  ArrowUpRight,
  Filter,
  BarChart2,
  Mic,
  Radio,
  Sparkles
} from 'lucide-react';
import { SrsVocabularyService, VocabSrsRecord } from '../../lib/srsService';
import { TokyoPitchAccentLab } from '../voice/TokyoPitchAccentLab';
import { fetchVoiceAssessmentHistory } from '../../lib/voiceApi';
import { useAuth } from '../../context/AuthContext';
import { VoicePronunciationTelemetry } from '../../types';

interface LearningAnalyticsProps {
  studentName?: string;
  currentLevel?: string;
  totalStudyHours?: number;
  studyStreakDays?: number;
  onLaunchSrsReview?: () => void;
}

export const LearningAnalyticsDashboard: React.FC<LearningAnalyticsProps> = ({
  studentName = 'Tanvir Kabir Biplob',
  currentLevel = 'N5',
  totalStudyHours = 124,
  studyStreakDays = 18,
  onLaunchSrsReview
}) => {
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [srsStats, setSrsStats] = useState(() => SrsVocabularyService.getRetentionAnalytics());
  const [dueVocab, setDueVocab] = useState<VocabSrsRecord[]>(() => SrsVocabularyService.getDueVocabItems());
  const [isPitchLabOpen, setIsPitchLabOpen] = useState(false);
  const [voiceTelemetry, setVoiceTelemetry] = useState<VoicePronunciationTelemetry>({
    totalVoiceSessions: 3,
    totalVoiceRecordings: 8,
    averageClarityScore: 92,
    averagePitchAccuracy: 89,
    averageMoraRhythm: 86,
    overallPronunciationScore: 89,
    tokyoAccentReadinessRate: 88,
    pitchPatternMastery: {
      heibanAccuracy: 93,
      atamadakaAccuracy: 90,
      nakadakaAccuracy: 82,
      odakaAccuracy: 78
    },
    patternsEvaluatedCount: {
      heiban: 4,
      atamadaka: 2,
      nakadaka: 1,
      odaka: 1
    },
    weakPhonemes: ['tsu', 'ryo', 'zu'],
    recentEvaluations: []
  });

  useEffect(() => {
    setSrsStats(SrsVocabularyService.getRetentionAnalytics());
    setDueVocab(SrsVocabularyService.getDueVocabItems());

    let isMounted = true;
    async function loadVoiceTelemetry() {
      try {
        if (token) {
          const res = await fetch('/api/analytics/voice-telemetry', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (isMounted && data.voiceTelemetry) {
              setVoiceTelemetry(data.voiceTelemetry);
              return;
            }
          }
        }
      } catch {}

      // Local storage fallback
      try {
        const localHistory = await fetchVoiceAssessmentHistory();
        if (isMounted && localHistory.length > 0) {
          const total = localHistory.length;
          const avgPitch = Math.round(localHistory.reduce((s, a) => s + a.pitchAccuracyScore, 0) / total);
          const avgRhythm = Math.round(localHistory.reduce((s, a) => s + a.moraRhythmScore, 0) / total);
          const avgClarity = Math.round(localHistory.reduce((s, a) => s + a.clarityScore, 0) / total);
          const avgOverall = Math.round(localHistory.reduce((s, a) => s + a.overallScore, 0) / total);

          const heibanList = localHistory.filter((a) => a.targetPattern === 'heiban');
          const atamadakaList = localHistory.filter((a) => a.targetPattern === 'atamadaka');
          const nakadakaList = localHistory.filter((a) => a.targetPattern === 'nakadaka');
          const odakaList = localHistory.filter((a) => a.targetPattern === 'odaka');

          const calcAcc = (list: typeof localHistory, fallback: number) =>
            list.length > 0
              ? Math.round(list.reduce((s, a) => s + a.pitchAccuracyScore, 0) / list.length)
              : fallback;

          setVoiceTelemetry((prev) => ({
            ...prev,
            totalVoiceRecordings: total,
            totalVoiceSessions: Math.max(1, Math.ceil(total / 3)),
            averagePitchAccuracy: avgPitch,
            averageMoraRhythm: avgRhythm,
            averageClarityScore: avgClarity,
            overallPronunciationScore: avgOverall,
            tokyoAccentReadinessRate: avgPitch,
            pitchPatternMastery: {
              heibanAccuracy: calcAcc(heibanList, prev.pitchPatternMastery.heibanAccuracy),
              atamadakaAccuracy: calcAcc(atamadakaList, prev.pitchPatternMastery.atamadakaAccuracy),
              nakadakaAccuracy: calcAcc(nakadakaList, prev.pitchPatternMastery.nakadakaAccuracy),
              odakaAccuracy: calcAcc(odakaList, prev.pitchPatternMastery.odakaAccuracy)
            },
            patternsEvaluatedCount: {
              heiban: heibanList.length,
              atamadaka: atamadakaList.length,
              nakadaka: nakadakaList.length,
              odaka: odakaList.length
            },
            recentEvaluations: localHistory.slice(0, 5)
          }));
        }
      } catch {}
    }

    loadVoiceTelemetry();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // 1. Daily Study Time Data (minutes per day)
  const studyTime14Days = [
    { date: 'Aug 14', minutes: 25, goal: 20, completedLessons: 1 },
    { date: 'Aug 15', minutes: 35, goal: 20, completedLessons: 2 },
    { date: 'Aug 16', minutes: 18, goal: 20, completedLessons: 1 },
    { date: 'Aug 17', minutes: 45, goal: 20, completedLessons: 2 },
    { date: 'Aug 18', minutes: 30, goal: 20, completedLessons: 1 },
    { date: 'Aug 19', minutes: 50, goal: 20, completedLessons: 3 },
    { date: 'Aug 20', minutes: 40, goal: 20, completedLessons: 2 },
    { date: 'Aug 21', minutes: 22, goal: 20, completedLessons: 1 },
    { date: 'Aug 22', minutes: 38, goal: 20, completedLessons: 2 },
    { date: 'Aug 23', minutes: 45, goal: 20, completedLessons: 2 },
    { date: 'Aug 24', minutes: 60, goal: 20, completedLessons: 3 },
    { date: 'Aug 25', minutes: 55, goal: 20, completedLessons: 2 },
    { date: 'Aug 26', minutes: 48, goal: 20, completedLessons: 2 },
    { date: 'Aug 27', minutes: 52, goal: 20, completedLessons: 2 }
  ];

  const studyTimeData =
    timeRange === '7d'
      ? studyTime14Days.slice(-7)
      : timeRange === '14d'
      ? studyTime14Days
      : [
          ...studyTime14Days.map((d, i) => ({
            ...d,
            date: `Aug ${i + 1}`,
            minutes: Math.max(15, Math.round(d.minutes * 0.9 + (i % 5) * 4))
          })),
          ...studyTime14Days
        ].slice(-30);

  // 2. Completed Quiz Scores & Accuracy Progression
  const quizScoreData = [
    { quiz: 'Q1: Topic は', score: 85, threshold: 70, correct: 17, total: 20, category: 'Grammar' },
    { quiz: 'Q2: Demonstratives', score: 90, threshold: 70, correct: 18, total: 20, category: 'Grammar' },
    { quiz: 'Q3: Action Verbs', score: 88, threshold: 70, correct: 22, total: 25, category: 'Verbs' },
    { quiz: 'Q4: Kanji Set 1', score: 95, threshold: 70, correct: 19, total: 20, category: 'Kanji' },
    { quiz: 'Q5: Te-Form Flow', score: 82, threshold: 70, correct: 20, total: 25, category: 'Grammar' },
    { quiz: 'Q6: Direction へ', score: 92, threshold: 70, correct: 23, total: 25, category: 'Particles' },
    { quiz: 'Q7: Time に/から', score: 94, threshold: 70, correct: 24, total: 25, category: 'Grammar' },
    { quiz: 'Q8: Kanji Set 2', score: 96, threshold: 70, correct: 24, total: 25, category: 'Kanji' },
    { quiz: 'Q9: Plain Form', score: 90, threshold: 70, correct: 27, total: 30, category: 'Grammar' },
    { quiz: 'Q10: N5 Mock Exam', score: 94, threshold: 70, correct: 47, total: 50, category: 'Full Exam' }
  ];

  // 3. Category Mastery Breakdown
  const categoryMastery = [
    { category: 'Grammar & Particles', mastery: 92, fill: '#dc2626' },
    { category: 'Kanji & Stroke Order', mastery: 96, fill: '#d97706' },
    { category: 'Vocabulary & Idioms', mastery: 89, fill: '#2563eb' },
    { category: 'Listening & Task Speed', mastery: 84, fill: '#059669' },
    { category: 'Reading Comprehension', mastery: 88, fill: '#7c3aed' }
  ];

  // Total calculated metrics
  const totalMinutes = studyTimeData.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgMinutesPerDay = Math.round(totalMinutes / studyTimeData.length);
  const avgQuizScore = Math.round(
    quizScoreData.reduce((acc, curr) => acc + curr.score, 0) / quizScoreData.length
  );

  return (
    <div className="space-y-8 text-left antialiased">
      
      {/* Top Header Card */}
      <div className="p-6 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                NIHOMI COGNITIVE LEARNING METRICS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Learning Analytics & Memory Telemetry
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl">
              Track daily active study time, quiz score trends, Spaced Repetition (SRS) memory decay resistance, and multi-skill JLPT {currentLevel} progression.
            </p>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center space-x-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl shrink-0 text-xs">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary Metric Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span>Avg Daily Study</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{avgMinutesPerDay}m / day</div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% vs last cycle
            </span>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span>Quiz Average</span>
              <Award className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{avgQuizScore}%</div>
            <span className="text-[10px] text-stone-400 font-mono">10/10 Quizzes Passed</span>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span>SRS Retention Rate</span>
              <Brain className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400">{srsStats.overallRetentionPercent}%</div>
            <span className="text-[10px] text-emerald-400 font-mono">Optimal Recall Curve</span>
          </div>

          <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-stone-400">
              <span>Active Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500">{studyStreakDays} Days</div>
            <span className="text-[10px] text-amber-300 font-mono">100% Habit Consistency</span>
          </div>
        </div>
      </div>

      {/* Chart Row 1: Daily Study Time (Area Chart) */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Daily Study Time Velocity (Minutes)</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Active engagement duration across the selected {timeRange} window with daily goal baseline (20 min).
            </p>
          </div>
          <span className="px-2.5 py-1 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-full font-mono text-[11px] font-bold border border-red-200 dark:border-red-800/80">
            Total Window: {Math.round(totalMinutes / 60 * 10) / 10} Hours
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studyTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyTimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#888' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#888' }}
                unit="m"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  borderColor: '#292524',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`${val} minutes`, 'Study Duration']}
              />
              <ReferenceLine y={20} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Goal: 20m', fill: '#d97706', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="#dc2626"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#studyTimeGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Row 2: Completed Quiz Scores & Accuracy (Line / Bar Composite) */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Quiz Scores & Assessment Accuracy Trend</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Exam scores plotted against official JLPT passing threshold (70%) and mastery standard (90%).
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/80">
            Passing Rate: 100%
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quizScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis
                dataKey="quiz"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#888' }}
              />
              <YAxis
                domain={[50, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#888' }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  borderColor: '#292524',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val: any, name: string) => [`${val}%`, name === 'score' ? 'Score' : name]}
              />
              <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Pass: 70%', fill: '#dc2626', fontSize: 10 }} />
              <ReferenceLine y={90} stroke="#059669" strokeDasharray="3 3" label={{ value: 'Mastery: 90%', fill: '#059669', fontSize: 10 }} />
              <Bar dataKey="score" fill="#d97706" radius={[6, 6, 0, 0]}>
                {quizScoreData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 90 ? '#059669' : entry.score >= 80 ? '#d97706' : '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Row 3: SRS Vocabulary Retention Decay & Leitner Box Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Retention Decay Curve (Line Chart) */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs space-y-4">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span>SM-2 Memory Retention Decay Curve</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ebbinghaus forgetting curve without review vs Nihomi SRS spaced reinforcement.
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={srsStats.retentionDecayCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#888' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderColor: '#292524',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  name="With Nihomi SRS"
                  dataKey="idealRetention"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  name="Without Review (Decay)"
                  dataKey="retention"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leitner Box Spaced Repetition Distribution */}
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs space-y-4">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Leitner 5-Box Vocabulary Distribution</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Current active vocabulary words distributed by retention stability intervals.
              </p>
            </div>
            {dueVocab.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold rounded-full border border-rose-300 dark:border-rose-800">
                {dueVocab.length} Due Now
              </span>
            )}
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={srsStats.boxDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderColor: '#292524',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} Words`, 'Vocabulary in Box']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {srsStats.boxDistribution.map((entry, index) => (
                    <Cell
                      key={`box-${index}`}
                      fill={['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'][index % 5]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 4: Multi-Pillar Competency Radial Breakdown */}
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs space-y-4">
        <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-red-600" />
            <span>JLPT {currentLevel} Multi-Skill Mastery Breakdown</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Synthesized competency across all five foundational learning pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {categoryMastery.map((cat) => (
            <div
              key={cat.category}
              className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700/60 space-y-2"
            >
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block line-clamp-1">
                {cat.category}
              </span>
              <div className="text-2xl font-black" style={{ color: cat.fill }}>
                {cat.mastery}%
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.mastery}%`, backgroundColor: cat.fill }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 5: Multimodal Tokyo Pitch-Accent & Voice Telemetry */}
      <div className="p-6 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white border border-stone-800 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                P1-06 MULTIMODAL VOICE TELEMETRY
              </span>
            </div>
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Mic className="w-5 h-5 text-amber-400" />
              <span>Tokyo Pitch-Accent & Mora Rhythm Readiness</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                東京式アクセント
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Evaluated fundamental frequency (F0) contours, downstep drop rates, and mora timing against standard NHK Tokyo acoustic benchmarks.
            </p>
          </div>

          <button
            type="button"
            id="btn-analytics-open-pitch-lab"
            onClick={() => setIsPitchLabOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md transition-all cursor-pointer w-fit"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Open Pitch-Accent Lab</span>
          </button>
        </div>

        {/* 4 Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Tokyo Readiness
            </span>
            <div className="text-2xl font-black text-amber-400">
              {voiceTelemetry.tokyoAccentReadinessRate}%
            </div>
            <span className="text-[10px] text-stone-500">Native Tokyo baseline</span>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Pitch Accuracy
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {voiceTelemetry.averagePitchAccuracy}%
            </div>
            <span className="text-[10px] text-stone-500">F0 contour alignment</span>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Mora Rhythm
            </span>
            <div className="text-2xl font-black text-sky-400">
              {voiceTelemetry.averageMoraRhythm}%
            </div>
            <span className="text-[10px] text-stone-500">Isochronous mora tempo</span>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Pronunciation ({voiceTelemetry.totalVoiceRecordings} Tests)
            </span>
            <div className="text-2xl font-black text-purple-400">
              {voiceTelemetry.overallPronunciationScore}%
            </div>
            <span className="text-[10px] text-stone-500">{voiceTelemetry.totalVoiceSessions} active speech sessions</span>
          </div>
        </div>

        {/* 4 Tokyo Accent Types Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400">
            <span>TOKYO 4-PATTERN MASTERY MATRIX</span>
            <span className="text-[10px] font-mono text-stone-500">Odaka • Atamadaka • Nakadaka • Heiban</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400">平板 (Heiban)</span>
                <span className="text-xs font-mono font-bold text-white">
                  {voiceTelemetry.pitchPatternMastery.heibanAccuracy}%
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${voiceTelemetry.pitchPatternMastery.heibanAccuracy}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 block">Low-High flat ({voiceTelemetry.patternsEvaluatedCount.heiban} tested)</span>
            </div>

            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">頭高 (Atamadaka)</span>
                <span className="text-xs font-mono font-bold text-white">
                  {voiceTelemetry.pitchPatternMastery.atamadakaAccuracy}%
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${voiceTelemetry.pitchPatternMastery.atamadakaAccuracy}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 block">High on 1st mora ({voiceTelemetry.patternsEvaluatedCount.atamadaka} tested)</span>
            </div>

            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">中高 (Nakadaka)</span>
                <span className="text-xs font-mono font-bold text-white">
                  {voiceTelemetry.pitchPatternMastery.nakadakaAccuracy}%
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${voiceTelemetry.pitchPatternMastery.nakadakaAccuracy}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 block">Peak in middle ({voiceTelemetry.patternsEvaluatedCount.nakadaka} tested)</span>
            </div>

            <div className="p-3 bg-stone-900/90 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">尾高 (Odaka)</span>
                <span className="text-xs font-mono font-bold text-white">
                  {voiceTelemetry.pitchPatternMastery.odakaAccuracy}%
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${voiceTelemetry.pitchPatternMastery.odakaAccuracy}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 block">Peak on last mora ({voiceTelemetry.patternsEvaluatedCount.odaka} tested)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tokyo Pitch Accent Lab Modal */}
      <TokyoPitchAccentLab
        isOpen={isPitchLabOpen}
        onClose={() => setIsPitchLabOpen(false)}
      />

    </div>
  );
};
