import React, { useState } from 'react';
import { Award, Flower2, X } from 'lucide-react';
import { StudentProfile, AccountUsage } from '../types';
import { AIUsageSummary } from './AIUsageSummary';
import { AchievementBadges } from '../../../components/student/AchievementBadges';
import { DigitalStudentIdCard } from '../../../components/student/DigitalStudentIdCard';
import { StudentProfile as DigitalStudentProfile } from '../../../types/nihomi';
import { useFocusMode } from '../../../context/FocusModeContext';

interface StudentHeaderProps {
  student: StudentProfile;
  accountUsage: AccountUsage;
  onOpenAiTutor?: () => void;
  onOpenStore?: () => void;
  activeStreak: number;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ student, accountUsage, onOpenAiTutor, onOpenStore, activeStreak }) => {
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const [isIdOpen, setIsIdOpen] = useState(false);
  const [areBadgesOpen, setAreBadgesOpen] = useState(false);
  const digitalStudent: DigitalStudentProfile = {
    id: student.id,
    nihomiAccountId: `NHM-${student.id.slice(-6)}`,
    name: student.name,
    email: `${student.id}@student.nihomi.com`,
    enrolledDate: new Date().toISOString(),
    currentLevel: student.jlptLevel,
    targetLevel: student.jlptLevel,
    streakDays: activeStreak,
    totalStudyHours: 0,
  };

  return (
    <>
    <header className="pt-2 pb-4 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={() => setIsIdOpen(true)} className="space-y-0.5 text-left rounded-xl p-1 -m-1 transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-stone-900 text-white">
              JLPT {student.jlptLevel} • Day {student.journeyDay}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            おはよう, {student.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {student.learningStatusMessageBn || student.learningStatusMessage}
          </p>
        </button>

        <div className="shrink-0 pt-1">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => toggleFocusMode()} aria-pressed={isFocusMode} aria-label="Zen Focus Mode" title="Zen Focus Mode" className={`rounded-full border p-2 focus:outline-none focus:ring-2 focus:ring-rose-500 ${isFocusMode ? 'border-rose-300 bg-rose-100 text-rose-700' : 'border-stone-200 bg-white text-stone-500 hover:bg-rose-50'}`}><Flower2 size={16} aria-hidden="true" /></button>
            <button type="button" onClick={() => setAreBadgesOpen(true)} aria-label="View badges" title="View badges" className="rounded-full border border-amber-200 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"><Award size={16} aria-hidden="true" /></button>
            <AIUsageSummary usage={accountUsage} onOpenAiTutor={onOpenAiTutor} onOpenStore={onOpenStore} />
          </div>
        </div>
      </div>
    </header>
    {isIdOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsIdOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="student-id-title" className="relative w-full max-w-sm"><div className="sr-only" id="student-id-title">Digital Student ID Card</div><button type="button" aria-label="ID card বন্ধ করুন" onClick={() => setIsIdOpen(false)} className="absolute right-2 top-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-rose-400"><X size={18} aria-hidden="true" /></button><DigitalStudentIdCard student={digitalStudent} /></section></div>}
    {areBadgesOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/60 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAreBadgesOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="badges-title" className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white"><button type="button" aria-label="Badges বন্ধ করুন" onClick={() => setAreBadgesOpen(false)} className="absolute right-3 top-3 z-10 rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"><X size={18} aria-hidden="true" /></button><h2 id="badges-title" className="sr-only">Student Achievements and Badges</h2><AchievementBadges /></section></div>}
    </>
  );
};