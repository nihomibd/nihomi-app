import React, { useState } from 'react';
import { DailyRoadmapTask, DailyStudySessionRecord } from '../../types.js';
import { apiRequest } from '../../lib/api.js';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  BookOpen,
  Headphones,
  RotateCcw,
  Award,
  Layers,
  Clock
} from 'lucide-react';

interface DailyMissionChecklistProps {
  session: DailyStudySessionRecord | null;
  onTaskUpdated?: (updatedSession: DailyStudySessionRecord) => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const DailyMissionChecklist: React.FC<DailyMissionChecklistProps> = ({
  session,
  onTaskUpdated,
  onNavigate
}) => {
  const [activeTasks, setActiveTasks] = useState<DailyRoadmapTask[]>(session?.checklist || []);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [celebrationToast, setCelebrationToast] = useState<{ message: string; xp: number } | null>(null);

  React.useEffect(() => {
    if (session?.checklist) {
      setActiveTasks(session.checklist);
    }
  }, [session]);

  const handleToggleTask = async (task: DailyRoadmapTask) => {
    if (task.isCompleted || isUpdating) return;
    setIsUpdating(task.id);
    try {
      const res = await apiRequest<{
        success: boolean;
        session: DailyStudySessionRecord;
        xpAwarded: number;
        message: string;
      }>('/api/study-plan/complete-task', {
        method: 'POST',
        body: JSON.stringify({
          taskId: task.id,
          completedIncrement: task.targetCount - task.completedCount
        })
      });

      if (res.success) {
        setActiveTasks(res.session.checklist);
        if (onTaskUpdated) onTaskUpdated(res.session);

        if (res.xpAwarded > 0) {
          setCelebrationToast({
            message: res.message,
            xp: res.xpAwarded
          });
          setTimeout(() => setCelebrationToast(null), 3500);
        }
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const getTaskIcon = (type: DailyRoadmapTask['taskType']) => {
    switch (type) {
      case 'vocab_srs':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'kanji_drill':
        return <Layers className="w-4 h-4 text-rose-400" />;
      case 'grammar_lesson':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'ghost_recovery':
        return <RotateCcw className="w-4 h-4 text-indigo-400" />;
      case 'listening_drill':
        return <Headphones className="w-4 h-4 text-sky-400" />;
      case 'mock_exam':
        return <Award className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const completedCount = activeTasks.filter((t) => t.isCompleted).length;
  const totalTasks = activeTasks.length || 5;
  const completionPct = Math.round((completedCount / Math.max(1, totalTasks)) * 100);
  const isQuotaMet = completedCount >= 3;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with completion meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Today's Adaptive JLPT Missions
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {session?.date || new Date().toISOString().split('T')[0]}
              </span>
            </h3>
            {isQuotaMet && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quota Met
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete daily missions to maintain streak multiplier & master weak spots
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 px-3.5 py-1.5 rounded-xl">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-200">
              {completedCount} / {totalTasks} Completed
            </div>
            <div className="text-[10px] text-slate-400">
              {completionPct}% Daily Quota
            </div>
          </div>
          <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isQuotaMet ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-rose-500'
              }`}
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Celebration Toast */}
      {celebrationToast && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-slideDown shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{celebrationToast.message}</span>
          </div>
          <span className="font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
            +{celebrationToast.xp} XP
          </span>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2.5">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              task.isCompleted
                ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-200'
            }`}
          >
            {/* Left Checkbox & Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => handleToggleTask(task)}
                disabled={task.isCompleted || isUpdating === task.id}
                className="flex-shrink-0 text-slate-400 hover:text-emerald-400 transition"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="p-1 rounded-md bg-slate-900/90 border border-slate-800">
                    {getTaskIcon(task.taskType)}
                  </span>
                  <span
                    className={`text-sm font-semibold truncate ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[11px] font-japanese text-slate-400 hidden md:inline">
                    {task.titleJa}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {task.estimatedMinutes} mins
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Zap className="w-3 h-3" />
                    +{task.xpReward} XP
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {task.titleBn}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => onNavigate(task.linkView, task.linkParams)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  task.isCompleted
                    ? 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    : 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                {task.isCompleted ? 'Review' : 'Start Drill'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Bonus Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Complete all missions today to earn +50 Bonus XP and streak protection!</span>
        </div>
        <div className="font-mono text-slate-300">
          Earned Today: <span className="font-bold text-amber-400">+{session?.earnedXp || 0} XP</span>
        </div>
      </div>
    </div>
  );
};
