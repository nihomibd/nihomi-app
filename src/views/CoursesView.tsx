import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  GraduationCap,
  Play,
  FileText,
  Filter,
  Flame,
  Volume2
} from 'lucide-react';
import { Course, JLPTLevel } from '../types/nihomi';
import { LessonPlayerModal } from '../components/learning/LessonPlayerModal';
import { useAuth } from '../context/AuthContext';

interface CoursesViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

const ALL_COURSES_CATALOG: Course[] = [
  {
    id: 'c1',
    title: 'Minna no Nihongo I (Grammar & Sentence Patterns)',
    titleJa: 'みんなの日本語 初級I 文法・文型マスター',
    level: 'N5',
    progressPercent: 76,
    totalLessons: 25,
    completedLessons: 19,
    currentLessonTitle: 'Lesson 20: Plain Form Conjugation (普通形)',
    category: 'GRAMMAR',
  },
  {
    id: 'c2',
    title: 'Essential 100 Foundational Kanji & Radicals Workshop',
    titleJa: 'JLPT N5 必須漢字100字と部首書き順演習',
    level: 'N5',
    progressPercent: 92,
    totalLessons: 12,
    completedLessons: 11,
    currentLessonTitle: 'Set 12: Directional & Calendar Kanji',
    category: 'KANJI',
  },
  {
    id: 'c3',
    title: 'Tokyo Language School Skype Interview Prep Lab',
    titleJa: '日本語学校 オンライン面接シミュレーション',
    level: 'N5',
    progressPercent: 50,
    totalLessons: 6,
    completedLessons: 3,
    currentLessonTitle: 'Session 4: Financial Sponsorship & Career Goal Defense',
    category: 'INTERVIEW_PREP',
  },
  {
    id: 'c4',
    title: 'Minna no Nihongo II (Intermediate Grammar & Particles)',
    titleJa: 'みんなの日本語 初級II 文法・複合表現',
    level: 'N4',
    progressPercent: 20,
    totalLessons: 25,
    completedLessons: 5,
    currentLessonTitle: 'Lesson 28: Simultaneous Actions (~ながら / V-nagara)',
    category: 'GRAMMAR',
  },
  {
    id: 'c5',
    title: 'JLPT N4 300 Kanji & Reading Comprehension Accelerator',
    titleJa: 'JLPT N4 漢字300字と読解スピードマスター',
    level: 'N4',
    progressPercent: 15,
    totalLessons: 18,
    completedLessons: 2,
    currentLessonTitle: 'Module 3: Short Passage Logic & Inference',
    category: 'READING',
  },
  {
    id: 'c6',
    title: 'JLPT N3 Bridge to Fluency & Workplace Japanese',
    titleJa: 'JLPT N3 中級総合・ビジネス日本語基礎',
    level: 'N3',
    progressPercent: 0,
    totalLessons: 30,
    completedLessons: 0,
    currentLessonTitle: 'Lesson 1: Formal Speech & Nuance Distinction',
    category: 'GRAMMAR',
  },
];

export const CoursesView: React.FC<CoursesViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeCourseToPlay, setActiveCourseToPlay] = useState<Course | null>(null);

  const filteredCourses = ALL_COURSES_CATALOG.filter((c) => {
    const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesLevel && matchesCat;
  });

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-amber-950 min-h-screen pb-20 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors">
      
      {/* Header Banner */}
      <div className="bg-stone-900 dark:bg-stone-950 text-white border-b border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>CANONICAL JAPANESE CURRICULUM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            JLPT N5–N1 Structured Programs
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Every course is directly mapped to the Nihomi Master Content repository and synchronized with your personal Learning DNA.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs">
          
          {/* Level Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
              <button
                key={lvl}
                id={`filter-level-${lvl}`}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-stone-900 dark:bg-rose-600 sepia:bg-amber-900 text-white shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 sepia:text-amber-950'
                }`}
              >
                {lvl === 'ALL' ? 'All Levels' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              id="select-course-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] px-3 py-1.5 rounded-xl text-stone-800 dark:text-stone-200 sepia:text-amber-950 focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="GRAMMAR">Grammar & Patterns</option>
              <option value="KANJI">Kanji & Radicals</option>
              <option value="READING">Reading Comprehension</option>
              <option value="INTERVIEW_PREP">Visa & Interview Prep</option>
            </select>
          </div>

        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                
                {/* Level & Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-stone-900 dark:bg-stone-800 text-white text-[10px] font-bold rounded-md uppercase font-mono">
                    JLPT {course.level}
                  </span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>

                {/* Course Titles */}
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500 font-japanese mt-0.5">
                    {course.titleJa}
                  </p>
                </div>

                {/* Progress / Lesson stats */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 sepia:bg-[#f0e4cc] rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                    <span className="font-bold text-stone-900 dark:text-white sepia:text-amber-950">{course.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-stone-900 dark:bg-rose-500 sepia:bg-amber-900 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 sepia:text-amber-950 font-medium truncate pt-0.5">
                    Next: {course.currentLessonTitle}
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <button
                id={`btn-course-action-${course.id}`}
                type="button"
                onClick={() => setActiveCourseToPlay(course)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-red-400 dark:text-rose-200 fill-red-400 dark:fill-rose-200" />
                <span>{course.progressPercent > 0 ? 'Resume Lesson' : 'Start Curriculum'}</span>
              </button>

            </div>
          ))}
        </div>

      </div>

      {/* Interactive Lesson Modal */}
      {activeCourseToPlay && (
        <LessonPlayerModal
          isOpen={!!activeCourseToPlay}
          onClose={() => setActiveCourseToPlay(null)}
          course={activeCourseToPlay}
          onOpenFullLesson={(lessonId) => {
            setActiveCourseToPlay(null);
            onNavigate('lesson', { lessonId });
          }}
        />
      )}

    </div>
  );
};
