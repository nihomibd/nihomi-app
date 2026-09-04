import React from 'react';
import { StudentProfile, AccountUsage } from '../types';
import { AIUsageSummary } from './AIUsageSummary';

interface StudentHeaderProps {
  student: StudentProfile;
  accountUsage: AccountUsage;
  onOpenAiTutor?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ student, accountUsage, onOpenAiTutor }) => {
  return (
    <header className="pt-2 pb-4 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-stone-900 text-white">
              JLPT {student.jlptLevel}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Day {student.journeyDay}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            おはよう, {student.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {student.learningStatusMessageBn || student.learningStatusMessage}
          </p>
        </div>

        <div className="shrink-0 pt-1">
          <AIUsageSummary usage={accountUsage} onOpenAiTutor={onOpenAiTutor} />
        </div>
      </div>
    </header>
  );
};