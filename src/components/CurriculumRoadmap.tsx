import React from 'react';
import { JLPTLevel } from '../types.js';
import {
  GraduationCap,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  Star,
  Zap
} from 'lucide-react';

interface CurriculumRoadmapProps {
  currentLevel: JLPTLevel;
  completedLessonsCount: number;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface MilestoneNode {
  id: string;
  level: JLPTLevel;
  title: string;
  titleJa: string;
  banglaTitle: string;
  lessonsRequired: number;
  totalLessons: number;
  description: string;
  skillsAcquired: string[];
  rewardXp: number;
  badgeName: string;
  estimatedWeeks: number;
}

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({
  currentLevel,
  completedLessonsCount,
  onNavigate
}) => {
  const roadmapMilestones: MilestoneNode[] = [
    {
      id: 'n5-phase1',
      level: 'N5',
      title: 'Phase 1: Hiragana, Katakana & Survival Greetings',
      titleJa: '文字と日常挨拶の基礎',
      banglaTitle: 'হিরাগানা, কাতাকানা ও দৈনিক শুভেচ্ছা',
      lessonsRequired: 5,
      totalLessons: 5,
      description: 'Master reading kana without hesitation, self-introductions (自己紹介), and essential particles (は, も, の).',
      skillsAcquired: ['Hiragana & Katakana Fluency', 'Basic Self Introduction', 'Demonstratives (これ/それ/あれ)'],
      rewardXp: 200,
      badgeName: 'Kana Explorer',
      estimatedWeeks: 2
    },
    {
      id: 'n5-phase2',
      level: 'N5',
      title: 'Phase 2: Verbs, Conjugations & Daily Life Actions',
      titleJa: '動詞活用と日常生活表現',
      banglaTitle: 'ক্রিয়া পদ, রূপান্তর ও দৈনন্দিন অভ্যাস',
      lessonsRequired: 15,
      totalLessons: 25,
      description: 'Conjugate Masu form, Te-form requests, location particles (で, に, へ), and time expressions for Tokyo commute.',
      skillsAcquired: ['Masu & Masen Form', 'Te-Form Request (~てください)', 'Particles で vs に Precision'],
      rewardXp: 450,
      badgeName: 'Grammar Trailblazer',
      estimatedWeeks: 4
    },
    {
      id: 'n5-mastery',
      level: 'N5',
      title: 'Phase 3: JLPT N5 Official Complete Mastery',
      titleJa: 'JLPT N5 公式認定レベル達成',
      banglaTitle: 'JLPT N5 পূর্ণাঙ্গ সিলেবাস সমাপনী',
      lessonsRequired: 25,
      totalLessons: 25,
      description: 'Full 120 Kanji mastery, listening comprehension reflexes, short story reading, and basic konbini interaction.',
      skillsAcquired: ['120 JLPT N5 Kanji', 'NHK Easy News Listening', 'Mock Exam Readiness 90%+'],
      rewardXp: 750,
      badgeName: 'N5 Shogun Master',
      estimatedWeeks: 6
    },
    {
      id: 'n4-phase1',
      level: 'N4',
      title: 'Phase 4: Intermediate Connectors, Potential & Volitional',
      titleJa: 'N4 中級文型・可能形・意向形',
      banglaTitle: 'ইন্টারমিডিয়েট কানেক্টর ও ইচ্ছাসূচক ব্যাকরণ',
      lessonsRequired: 35,
      totalLessons: 50,
      description: 'Express ability (可能形), decisions, conditional forms (~たら, ~ば), and multi-clause conversation logic.',
      skillsAcquired: ['Potential & Volitional Verbs', 'Conditional Logic (~たら)', '300 Essential Kanji'],
      rewardXp: 1000,
      badgeName: 'N4 Pioneer',
      estimatedWeeks: 8
    },
    {
      id: 'n4-mastery',
      level: 'N4',
      title: 'Phase 5: JLPT N4 Work & Study In Japan Ready',
      titleJa: 'JLPT N4 就労・留学準備完了',
      banglaTitle: 'জাপানে চাকরি ও ভিসা প্রস্তুতির N4 স্ট্যান্ডার্ড',
      lessonsRequired: 50,
      totalLessons: 50,
      description: 'Passive (~られる) and causative (~させる) speech, honorific basics, and SSW Tokutei Ginou exam readiness.',
      skillsAcquired: ['Causative-Passive Voice', 'Part-time Baito Interviewing', 'Tokyo Metro & City Office Prep'],
      rewardXp: 1500,
      badgeName: 'Japan Ready Candidate',
      estimatedWeeks: 10
    },
    {
      id: 'n3-business',
      level: 'N3',
      title: 'Phase 6: JLPT N3 Conversational Fluency & Keigo',
      titleJa: 'JLPT N3 ビジネス敬語と流暢な対話',
      banglaTitle: 'JLPT N3 কর্পোরেট কেইগো ও ব্যবসায়িক জাপানি',
      lessonsRequired: 75,
      totalLessons: 75,
      description: 'Complex nuance, corporate email etiquette, business honorifics (Sonkeigo/Kenjougo), and relocation fluency.',
      skillsAcquired: ['Corporate Keigo Precision', 'Japanese Workplace Culture', 'Fluent Interview Mastery'],
      rewardXp: 2500,
      badgeName: 'Tokyo Executive',
      estimatedWeeks: 12
    }
  ];

  // Determine user progress in terms of milestones
  const getMilestoneStatus = (milestone: MilestoneNode, index: number) => {
    // If user's completed count exceeds or meets required lessons
    if (completedLessonsCount >= milestone.lessonsRequired) {
      return 'completed';
    }
    // If this is the current active milestone user is working towards
    const prevMilestoneLessons = index === 0 ? 0 : roadmapMilestones[index - 1].lessonsRequired;
    if (completedLessonsCount >= prevMilestoneLessons && completedLessonsCount < milestone.lessonsRequired) {
      return 'active';
    }
    return 'locked';
  };

  return (
    <div id="curriculum-roadmap-section" className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
              LEARNING JOURNEY MAP &bull; JLPT N5 ➔ N3
            </span>
            <span className="text-xs font-bold text-stone-500">
              Total Milestones: 6
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-600" />
            <span>Interactive Curriculum Roadmap (পাঠ্যক্রম রোডম্যাপ)</span>
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl">
            A clear progression timeline from beginner kana to JLPT N3 business fluency, with verified nodes, skill checkpoints, and milestone XP rewards.
          </p>
        </div>

        {/* Global Progress pill */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm">
            {completedLessonsCount}
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Lessons Mastered</span>
            <span className="text-xs font-extrabold text-stone-900">Current Target: JLPT {currentLevel}</span>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Nodes & Timeline */}
      <div className="relative pt-2 pb-4">
        {/* Timeline Path Line for Desktop */}
        <div className="hidden lg:block absolute left-8 top-12 bottom-12 w-1 bg-stone-200 rounded-full z-0" />

        <div className="space-y-6 relative z-10">
          {roadmapMilestones.map((node, index) => {
            const status = getMilestoneStatus(node, index);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const isLocked = status === 'locked';

            return (
              <div
                key={node.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-red-50/80 via-white to-amber-50/40 border-red-300 ring-2 ring-red-400/30 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 shadow-xs'
                    : 'bg-stone-50/70 border-stone-200 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left: Node status circle + details */}
                  <div className="flex items-start gap-4">
                    {/* Node Visual Indicator */}
                    <div
                      className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-bold text-sm shadow-xs transition-transform ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isActive ? (
                        <Play className="w-5 h-5 fill-current" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isActive
                              ? 'bg-red-100 text-red-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          JLPT {node.level} &bull; {status.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-serif font-bold text-red-600">
                          {node.titleJa}
                        </span>
                      </div>

                      <h3 className="text-base font-bold font-serif text-stone-900 flex items-center gap-2">
                        <span>{node.title}</span>
                      </h3>

                      <p className="text-xs text-stone-500 font-medium">
                        {node.banglaTitle} &bull; <span className="italic">{node.description}</span>
                      </p>

                      {/* Skills Acquired Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {node.skillsAcquired.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-stone-700"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Milestone Reward & Action */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200/60">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Milestone Reward</span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        +{node.rewardXp} XP &bull; {node.badgeName}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Est. {node.estimatedWeeks} weeks</span>
                    </div>

                    {isActive ? (
                      <button
                        onClick={() => onNavigate('courses')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <span>Continue Lessons</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => onNavigate('courses')}
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Review Module</span>
                      </button>
                    ) : (
                      <span className="text-xs text-stone-400 font-semibold px-3 py-1.5 bg-stone-100 rounded-xl border border-stone-200 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Requires {node.lessonsRequired} Lessons</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CurriculumRoadmap;
