import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Filter
} from 'lucide-react';
import { Course, JLPTLevel } from '../types/nihomi';
import { LessonPlayerModal } from '../components/learning/LessonPlayerModal';

interface CoursesViewProps {
  onNavigate: (view: string) => void;
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
    currentLessonTitle: 'Lesson 1: Self-Introduction & ~は ~です (自己紹介)',
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
    currentLessonTitle: 'Set 1: Sun, Origin, Person & Language Kanji',
    category: 'KANJI',
  },
  {
    id: 'c3',
    title: 'Tokyo Conversation & Daily Life Survival Lab',
    titleJa: '日本語学校・東京生活サバイバル会話',
    level: 'N5',
    progressPercent: 50,
    totalLessons: 6,
    completedLessons: 3,
    currentLessonTitle: 'Session 2: Ordering at Restaurant & Train Stations',
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
    currentLessonTitle: 'Lesson 26: ~んです Explanatory Form',
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
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeCourseToPlay, setActiveCourseToPlay] = useState<Course | null>(null);

  const filteredCourses = ALL_COURSES_CATALOG.filter((c) => {
    const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesLevel && matchesCat;
  });

  return (
    <div className="bg-[#FAF9F6] text-stone-900 min-h-screen pb-20 font-sans antialiased text-left selection:bg-red-500 selection:text-white">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white border-b border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          
          {/* Level Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                }`}
              >
                {lvl === 'ALL' ? 'All Levels' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-stone-800 focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="GRAMMAR">Grammar & Patterns</option>
              <option value="KANJI">Kanji & Radicals</option>
              <option value="READING">Reading Comprehension</option>
              <option value="INTERVIEW_PREP">Conversation & Life Prep</option>
            </select>
          </div>

        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                
                {/* Level & Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-md uppercase font-mono">
                    JLPT {course.level}
                  </span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>

                {/* Course Titles */}
                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-japanese mt-0.5">
                    {course.titleJa}
                  </p>
                </div>

                {/* Progress / Lesson stats */}
                <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                    <span className="font-bold text-stone-900">{course.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-stone-900 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium truncate pt-0.5">
                    Current: {course.currentLessonTitle}
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveCourseToPlay(course)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
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
        />
      )}

    </div>
  );
};