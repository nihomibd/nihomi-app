import React, { useState } from 'react';
import { JLPTLevel, LearningPace, JLPTStudyPlan } from '../../types.js';
import {
  Calendar,
  Clock,
  Target,
  Zap,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Flame
} from 'lucide-react';

interface StudyPlanConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: JLPTStudyPlan | null;
  onSavePlan: (updatedParams: {
    targetLevel: JLPTLevel;
    targetExamDate: string;
    examSessionName: string;
    targetScore: number;
    dailyTimeMinutes: number;
    learningPace: LearningPace;
    focusAreas: string[];
  }) => Promise<void>;
}

export const StudyPlanConfigModal: React.FC<StudyPlanConfigModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSavePlan
}) => {
  const [targetLevel, setTargetLevel] = useState<JLPTLevel>(currentPlan?.targetLevel || 'N5');
  const [targetExamDate, setTargetExamDate] = useState<string>(currentPlan?.targetExamDate || '2026-12-06');
  const [examSessionName, setExamSessionName] = useState<string>(currentPlan?.examSessionName || 'Official JLPT December 2026 Exam');
  const [targetScore, setTargetScore] = useState<number>(currentPlan?.targetScore || 140);
  const [dailyTimeMinutes, setDailyTimeMinutes] = useState<number>(currentPlan?.dailyTimeMinutes || 30);
  const [learningPace, setLearningPace] = useState<LearningPace>(currentPlan?.learningPace || 'moderate');
  const [focusAreas, setFocusAreas] = useState<string[]>(
    currentPlan?.focusAreas || ['vocabulary', 'grammar', 'particles', 'kanji', 'listening']
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const quickDates = [
    { label: 'Dec 2026 JLPT (Winter Session)', date: '2026-12-06', name: 'Official JLPT December 2026 Exam' },
    { label: 'July 2027 JLPT (Summer Session)', date: '2027-07-04', name: 'Official JLPT July 2027 Exam' },
    { label: 'Dec 2027 JLPT (Winter Session)', date: '2027-12-05', name: 'Official JLPT December 2027 Exam' }
  ];

  const focusOptions = [
    { id: 'vocabulary', label: 'Vocabulary & Kanji (語彙・漢字)', icon: '📖' },
    { id: 'grammar', label: 'Grammar Patterns (文法)', icon: '📐' },
    { id: 'particles', label: 'Particle Accuracy (は vs が, に vs で)', icon: '🎯' },
    { id: 'listening', label: 'Tokyo Real-Audio Listening (聴解)', icon: '🎧' },
    { id: 'reading', label: 'Passage Comprehension (読解)', icon: '📑' }
  ];

  const toggleFocus = (id: string) => {
    if (focusAreas.includes(id)) {
      if (focusAreas.length > 1) {
        setFocusAreas(focusAreas.filter((f) => f !== id));
      }
    } else {
      setFocusAreas([...focusAreas, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSavePlan({
        targetLevel,
        targetExamDate,
        examSessionName,
        targetScore: Number(targetScore),
        dailyTimeMinutes: Number(dailyTimeMinutes),
        learningPace,
        focusAreas
      });
      onClose();
    } catch (err) {
      console.error('Failed to save study plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Personalized JLPT Roadmap Generator
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  Adaptive AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure your target level, exam session date & daily SRS quota
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Target JLPT Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              1. Select Target JLPT Level (目標レベル)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setTargetLevel(lvl)}
                  className={`py-3 rounded-xl font-bold text-center border transition ${
                    targetLevel === lvl
                      ? 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-950/50 scale-[1.02]'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="text-base">{lvl}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {lvl === 'N5' ? 'Beginner' : lvl === 'N4' ? 'Elementary' : lvl === 'N3' ? 'Intermediate' : 'Advanced'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Exam Date & Session */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              2. Target JLPT Examination Date (受験日)
            </label>
            <div className="space-y-2 mb-3">
              {quickDates.map((item) => (
                <div
                  key={item.date}
                  onClick={() => {
                    setTargetExamDate(item.date);
                    setExamSessionName(item.name);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    targetExamDate === item.date
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${targetExamDate === item.date ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Or Custom Date:</span>
              <input
                type="date"
                value={targetExamDate}
                onChange={(e) => {
                  setTargetExamDate(e.target.value);
                  setExamSessionName(`Target Exam: ${e.target.value}`);
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Daily Study Time & Learning Pace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                3. Daily Available Time (1日の学習時間)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => {
                      setDailyTimeMinutes(mins);
                      if (mins >= 60) setLearningPace('turbo');
                      else if (mins >= 45) setLearningPace('intensive');
                      else if (mins >= 30) setLearningPace('moderate');
                      else setLearningPace('relaxed');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition ${
                      dailyTimeMinutes === mins
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {mins}m / day
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                4. Target Scaled Score (目標得点)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={100}
                  max={180}
                  step={5}
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30 whitespace-nowrap">
                  {targetScore} / 180
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Official passing threshold is 90/180 (with 19+ in all 3 sections).
              </p>
            </div>
          </div>

          {/* Focus Areas Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              5. Priority Skill Drills (重点項目)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {focusOptions.map((opt) => {
                const isSelected = focusAreas.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleFocus(opt.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Adaptive Spaced Repetition (SM-2) engine will calibrate daily quota.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-lg shadow-rose-950/50 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? 'Recalculating...' : 'Generate Roadmap'}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
