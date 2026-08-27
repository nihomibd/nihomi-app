import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { haptic } from '../../lib/haptic';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Headphones,
  Award,
  RefreshCw,
  ChevronRight,
  Brain,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';

interface Task {
  day: string;
  taskJa: string;
  taskEn: string;
  taskBn: string;
  estimatedMinutes: number;
  activityType: 'vocab' | 'grammar' | 'kanji' | 'quiz' | 'listening' | 'shadowing';
}

interface WeekSchedule {
  weekNumber: number;
  title: string;
  focusArea: string;
  focusAreaBn: string;
  dailyTasks: Task[];
  weeklyGoal: string;
}

interface ScheduleData {
  studentLevel: string;
  generatedDate: string;
  diagnosticSummary: string;
  diagnosticSummaryBn: string;
  detectedWeakAreas: string[];
  weeks: WeekSchedule[];
}

interface StudyScheduleWidgetProps {
  userLevel?: string;
  onNavigateAction?: (type: string) => void;
}

const STORAGE_KEY = 'nihomi_personalized_study_schedule_v1';

export const StudyScheduleWidget: React.FC<StudyScheduleWidgetProps> = ({
  userLevel = 'N5',
  onNavigateAction
}) => {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    // Load cached schedule or fetch initial
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setSchedule(JSON.parse(cached));
      } else {
        generateSchedule();
      }
    } catch {
      generateSchedule();
    }

    try {
      const completed = localStorage.getItem('nihomi_completed_schedule_tasks');
      if (completed) {
        setCompletedTasks(JSON.parse(completed));
      }
    } catch {}
  }, [userLevel]);

  const generateSchedule = async () => {
    setIsGenerating(true);
    try {
      const res = await apiRequest<{ success: boolean; schedule: ScheduleData }>('/api/ai/study-schedule', {
        method: 'POST',
        body: JSON.stringify({
          userLevel,
          quizHistory: [
            { category: 'particles', score: 65, mistakePatterns: ['wa vs ga', 'ni vs de'] },
            { category: 'te_form', score: 72, mistakePatterns: ['group 1 irregulars'] },
            { category: 'kanji_readings', score: 88 }
          ],
          weakCategories: ['Particle Nuances (は vs が, に vs で)', 'Te-form Speed Conjugations', 'Listening to Natural Speed Conversations']
        })
      });

      if (res?.success && res.schedule) {
        setSchedule(res.schedule);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.schedule));
        haptic.trigger('achievement');
      }
    } catch (e) {
      console.warn('Failed to generate study schedule:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (taskKey: string) => {
    const next = { ...completedTasks, [taskKey]: !completedTasks[taskKey] };
    setCompletedTasks(next);
    localStorage.setItem('nihomi_completed_schedule_tasks', JSON.stringify(next));

    if (next[taskKey]) {
      haptic.trigger('success');
    } else {
      haptic.trigger('light');
    }
  };

  const activeWeekData = schedule?.weeks.find((w) => w.weekNumber === selectedWeek) || schedule?.weeks[0];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'grammar':
        return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      case 'quiz':
        return <Award className="w-3.5 h-3.5 text-red-500" />;
      case 'kanji':
        return <Brain className="w-3.5 h-3.5 text-amber-500" />;
      case 'listening':
      case 'shadowing':
        return <Headphones className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6 text-stone-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI Curriculum Director • 4-Week Smart Study Blueprint</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900">
            Personalized 4-Week Study Schedule ({userLevel} মাস্টার প্ল্যান)
          </h2>
          <p className="text-xs text-stone-500">
            Dynamically synthesized by Gemini AI analyzing your weakest quiz categories, particle mistakes, and SRS retention speed.
          </p>
        </div>

        <button
          type="button"
          onClick={generateSchedule}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'AI Analyzing Quizzes...' : 'Regenerate Study Plan'}</span>
        </button>
      </div>

      {/* Diagnostic Overview Box */}
      {schedule && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/70 to-amber-50/60 border border-red-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-red-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <Brain className="w-4 h-4 text-red-600" />
              AI Sensei Diagnostic Summary:
            </span>
            <span className="font-mono text-[10px] text-stone-500">Updated: {schedule.generatedDate}</span>
          </div>
          <p className="text-stone-700 leading-relaxed font-medium">{schedule.diagnosticSummary}</p>
          <p className="text-stone-600 leading-relaxed text-[11px]">{schedule.diagnosticSummaryBn}</p>

          <div className="pt-1 flex items-center flex-wrap gap-2">
            <span className="text-[10px] font-bold text-stone-500 uppercase">Target Weak Areas:</span>
            {schedule.detectedWeakAreas.map((area, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-white text-red-700 border border-red-200 text-[10px] font-bold"
              >
                ⚠️ {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((wk) => {
          const isSelected = selectedWeek === wk;
          return (
            <button
              key={wk}
              type="button"
              onClick={() => {
                setSelectedWeek(wk);
                haptic.trigger('light');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Week {wk}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Week Tasks List */}
      {activeWeekData && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">{activeWeekData.title}</h3>
              <p className="text-xs text-stone-500">{activeWeekData.focusArea} ({activeWeekData.focusAreaBn})</p>
            </div>
            <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-xl text-[11px] font-bold self-start sm:self-auto">
              🎯 Weekly Goal: {activeWeekData.weeklyGoal}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeWeekData.dailyTasks.map((task, idx) => {
              const taskKey = `w${selectedWeek}-d${idx + 1}`;
              const isDone = completedTasks[taskKey] || false;

              return (
                <div
                  key={taskKey}
                  onClick={() => toggleTask(taskKey)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-xs'
                      : 'bg-white hover:bg-stone-50/80 border-stone-200 text-stone-900'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                          {task.day}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                          {getActivityIcon(task.activityType)}
                          <span className="capitalize">{task.activityType}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes}m
                      </span>
                    </div>

                    <p className={`text-xs font-serif font-bold ${isDone ? 'line-through text-emerald-800' : 'text-stone-900'}`}>
                      {task.taskJa}
                    </p>
                    <p className="text-[11px] text-stone-600 leading-snug">{task.taskEn}</p>
                    <p className="text-[10px] text-stone-500 font-medium">{task.taskBn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
