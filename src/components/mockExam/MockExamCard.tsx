import React from 'react';
import { Clock, Award, BookOpen, Headphones, Play, CheckCircle2, AlertCircle, Sparkles, ChevronRight, BarChart2 } from 'lucide-react';
import { MockExamSummaryItem } from '../../services/mockExamApi';

interface MockExamCardProps {
  exam: MockExamSummaryItem;
  onStartExam: (examId: string) => void;
}

export const MockExamCard: React.FC<MockExamCardProps> = ({ exam, onStartExam }) => {
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'N5':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'N4':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'N3':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'N2':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'N1':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 hover:border-rose-500/40 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top badges & Title */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase border ${getLevelBadgeColor(exam.level)}`}>
              JLPT {exam.level}
            </span>
            <span className="font-mono text-[11px] text-slate-500">{exam.examCode}</span>
          </div>

          {exam.userBestAttempt && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              exam.userBestAttempt.isPassed
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {exam.userBestAttempt.isPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>
                Best: {exam.userBestAttempt.totalScaledScore}/180 ({exam.userBestAttempt.letterGrade})
              </span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-rose-300 transition-colors mb-1 font-japanese">
          {exam.titleJa}
        </h3>
        <h4 className="text-sm font-semibold text-slate-300 mb-2">
          {exam.title}
        </h4>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">
          {exam.descriptionBn || exam.description}
        </p>

        {/* Section Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-5 text-center">
          <div className="p-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Time</span>
            </div>
            <div className="font-bold text-xs text-slate-200">{exam.totalTimeMinutes} min</div>
          </div>

          <div className="p-1 border-x border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <BookOpen className="w-3 h-3 text-blue-400" />
              <span>Sections</span>
            </div>
            <div className="font-bold text-xs text-slate-200">{exam.sectionCount} Parts</div>
          </div>

          <div className="p-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Award className="w-3 h-3 text-rose-400" />
              <span>Pass Mark</span>
            </div>
            <div className="font-bold text-xs text-slate-200">{exam.overallPassingScore} / 180</div>
          </div>
        </div>

        {/* Section Breakdown Pills */}
        <div className="space-y-1.5 mb-6">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Sectional Scaled Rules (19/60 Min. Threshold)
          </div>
          {exam.sectionBreakdown.map((sec, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950/40 text-slate-300">
              <span className="truncate max-w-[200px]">{sec.title}</span>
              <span className="font-mono text-slate-400">{sec.timeLimitMinutes}m • {sec.questionCount}Q</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onStartExam(exam.id)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-600/20 transition-all group-hover:scale-[1.01]"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Start Official Exam Simulation (模試開始)</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
