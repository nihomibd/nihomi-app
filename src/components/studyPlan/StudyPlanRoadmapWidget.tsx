import React, { useState, useEffect } from 'react';
import { JLPTStudyPlan, DailyStudySessionRecord } from '../../types.js';
import {
  Calendar,
  Clock,
  Target,
  Flame,
  Zap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Headphones,
  Layers,
  Settings,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { StudyPlanConfigModal } from './StudyPlanConfigModal.js';
import { apiRequest } from '../../lib/api.js';

interface StudyPlanRoadmapWidgetProps {
  initialPlan?: JLPTStudyPlan | null;
  initialSession?: DailyStudySessionRecord | null;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const StudyPlanRoadmapWidget: React.FC<StudyPlanRoadmapWidgetProps> = ({
  initialPlan,
  initialSession,
  onNavigate
}) => {
  const [studyPlan, setStudyPlan] = useState<JLPTStudyPlan | null>(initialPlan || null);
  const [dailySession, setDailySession] = useState<DailyStudySessionRecord | null>(initialSession || null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialPlan);

  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await apiRequest<{
          success: boolean;
          studyPlan: JLPTStudyPlan;
          dailySession: DailyStudySessionRecord;
        }>('/api/study-plan');
        if (res.success) {
          setStudyPlan(res.studyPlan);
          setDailySession(res.dailySession);
        }
      } catch (err) {
        console.error('Failed to load study plan:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!initialPlan) {
      loadPlan();
    }
  }, [initialPlan]);

  // Real-time ticking countdown to target exam date
  useEffect(() => {
    if (!studyPlan?.targetExamDate) return;

    const targetTime = new Date(`${studyPlan.targetExamDate}T09:00:00Z`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetTime - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [studyPlan?.targetExamDate]);

  const handleSavePlan = async (updatedParams: any) => {
    const res = await apiRequest<{
      success: boolean;
      studyPlan: JLPTStudyPlan;
      dailySession: DailyStudySessionRecord;
    }>('/api/study-plan/save', {
      method: 'POST',
      body: JSON.stringify(updatedParams)
    });
    if (res.success) {
      setStudyPlan(res.studyPlan);
      setDailySession(res.dailySession);
    }
  };

  if (isLoading || !studyPlan) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 animate-pulse flex items-center justify-center min-h-[160px]">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <Clock className="w-5 h-5 animate-spin text-amber-400" />
          Loading personalized JLPT roadmap & countdown...
        </div>
      </div>
    );
  }

  const currentPhase = studyPlan.currentSprintPhase || studyPlan.sprintPhases[0];
  const quota = studyPlan.dailyQuota;
  const completedTasks = dailySession?.checklist?.filter((t) => t.isCompleted).length || 0;
  const totalTasks = dailySession?.checklist?.length || 5;

  return (
    <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 rounded-2xl p-5 md:p-6 shadow-2xl overflow-hidden">
      {/* Neo-Tokyo Amber & Rose Glow Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Target Level + Countdown + Config Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-500 p-0.5 shadow-lg shadow-rose-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-amber-400">JLPT</span>
                <span className="text-base font-extrabold text-white leading-none">
                  {studyPlan.targetLevel}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {studyPlan.examSessionName}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {studyPlan.learningPace.toUpperCase()} PACE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>🎯 Target Scaled Score: <strong className="text-emerald-400">{studyPlan.targetScore}/180</strong></span>
              <span>•</span>
              <span>⚡ Daily Goal: <strong className="text-sky-300">{studyPlan.dailyTimeMinutes} mins</strong></span>
            </p>
          </div>
        </div>

        {/* Real-Time Countdown Ticker */}
        <div className="flex items-center gap-2 self-start lg:self-auto bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-inner">
          <div className="text-center px-1.5">
            <div className="text-xl md:text-2xl font-black font-mono text-rose-400 leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Days</div>
          </div>
          <span className="text-slate-600 font-bold text-lg mb-3">:</span>
          <div className="text-center px-1.5">
            <div className="text-xl md:text-2xl font-black font-mono text-amber-300 leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Hours</div>
          </div>
          <span className="text-slate-600 font-bold text-lg mb-3">:</span>
          <div className="text-center px-1.5">
            <div className="text-xl md:text-2xl font-black font-mono text-slate-300 leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Mins</div>
          </div>
          <span className="text-slate-600 font-bold text-lg mb-3">:</span>
          <div className="text-center px-1.5">
            <div className="text-xl md:text-2xl font-black font-mono text-slate-400 leading-none">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">Secs</div>
          </div>

          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            className="ml-2 p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
            title="Configure Target Date & Goal"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Grid: 4-Phase Sprint Roadmap & Projected Score Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-5">
        {/* Left 2 Cols: Sprint Phase Progress Bar & Current Phase Highlight */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Sprint Phase {currentPhase.phaseNumber} of {currentPhase.totalPhases}
              </span>
              <span className="text-xs text-slate-300 font-japanese">
                ({currentPhase.nameJa})
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {currentPhase.progressPercent}% Active
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-100 mb-1">
            {currentPhase.name}
          </h4>
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">
            {currentPhase.goalDescriptionBn}
          </p>

          {/* 4-Phase Visual Step Flow */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/60">
            {studyPlan.sprintPhases.map((phase) => (
              <div key={phase.phaseNumber} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>P{phase.phaseNumber}</span>
                  <span>{phase.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      phase.status === 'completed'
                        ? 'bg-emerald-400'
                        : phase.status === 'active'
                        ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                        : 'bg-slate-700/50'
                    }`}
                    style={{ width: `${phase.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 truncate">
                  {phase.phaseNumber === 1 ? 'Foundation' : phase.phaseNumber === 2 ? 'Acceleration' : phase.phaseNumber === 3 ? 'Listening' : 'Mock Marathon'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Real-Time Readiness Score & Projected JLPT Scaled Score */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Exam Readiness Score</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {studyPlan.readinessScore}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${studyPlan.readinessScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60 text-center">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Projected Score</div>
              <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                {studyPlan.projectedScore} <span className="text-xs text-slate-500 font-normal">/180</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pass Probability</div>
              <div className="text-lg font-black font-mono text-sky-400 mt-0.5">
                {studyPlan.passProbability}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Daily SRS Quota Rings & Quick Action Triggers */}
      <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Daily Quota Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 text-xs font-semibold mr-1">Daily Targets:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{quota.vocabSrsReviewTarget} Vocab SRS</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>{quota.kanjiStrokeTarget} Kanji Flips</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>{quota.particleWeakSpotsTarget} Ghost Particles</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
            <Headphones className="w-3.5 h-3.5 text-sky-400" />
            <span>{quota.listeningMinutesTarget}m Audio</span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('study-plan')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Full Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('study-plan', { openDailyMission: true })}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-950/50 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Daily Mission ({completedTasks}/{totalTasks})</span>
          </button>
        </div>
      </div>

      {/* Config Modal */}
      <StudyPlanConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        currentPlan={studyPlan}
        onSavePlan={handleSavePlan}
      />
    </div>
  );
};
