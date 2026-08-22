import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import { Course, JLPTLevel, Module, LessonSummary } from '../types.js';
import { NihomiBookReader } from '../components/NihomiBookReader.js';
import { EbookShowcaseCarousel } from '../components/EbookShowcaseCarousel.js';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award
} from 'lucide-react';

interface CoursesViewProps {
  initialCourseId?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ initialCourseId, onNavigate }) => {
  const { profile, progress } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'All'>(profile?.targetLevel || 'N5');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModules, setCourseModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [showEBookReader, setShowEBookReader] = useState(false);

  // Load all courses
  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      try {
        const query = selectedLevel !== 'All' ? `?level=${selectedLevel}` : '';
        const res = await apiRequest<{ courses: Course[] }>(`/api/courses${query}`);
        setCourses(res.courses || []);

        if (initialCourseId) {
          loadCourseDetail(initialCourseId);
        } else if (res.courses && res.courses.length > 0) {
          loadCourseDetail(res.courses[0].id);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, [selectedLevel]);

  const loadCourseDetail = async (courseId: string) => {
    try {
      const res = await apiRequest<{ course: Course; modules: any[]; userProgress: any }>(
        `/api/courses/${courseId}`
      );
      setSelectedCourse(res.course);
      setCourseModules(res.modules || []);
      if (res.modules && res.modules.length > 0) {
        setExpandedModuleId(res.modules[0].id);
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
    }
  };

  const completedLessonIds = progress?.completedLessonIds || [];

  return (
    <div id="nihomi-courses-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bento Hero Header */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  JLPT Curriculum
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Levels N5, N4 & N3 Modules
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                Core Japanese Courses & Lessons
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                Structured step-by-step curriculum featuring furigana breakdowns, native audio, Kanji stroke guides, authentic dialogues, and integrated quizzes.
              </p>
            </div>

            {/* Level Filter Bento Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowEBookReader(prev => !prev)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{showEBookReader ? 'Close E-Book' : '📖 Minna no Nihongo E-Book'}</span>
              </button>

              <div className="flex items-center space-x-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 text-xs font-bold">
                {(['All', 'N5', 'N4', 'N3'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setSelectedCourse(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {lvl === 'All' ? 'All Levels' : `JLPT ${lvl}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive E-Book FlipBook Reader */}
        {showEBookReader && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <NihomiBookReader
              initialLesson={1}
              bookType="vocabulary"
              onClose={() => setShowEBookReader(false)}
            />
          </div>
        )}

        {/* Bento Grid: Courses List (Left 4 cols) + Module Details (Right 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Available Courses Bento Column */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Available Courses ({courses.length})
            </h2>

            <div className="space-y-3">
              {courses.map((course) => {
                const isSelected = selectedCourse?.id === course.id;
                return (
                  <div
                    key={course.id}
                    onClick={() => loadCourseDetail(course.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                      isSelected
                        ? 'bg-white border-red-500 shadow-md ring-1 ring-red-500'
                        : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                        JLPT {course.level}
                      </span>
                      <span className="text-[11px] text-stone-400 font-semibold">{course.estimatedHours} hrs</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{course.title}</h3>
                      <p className="text-xs text-red-600 font-serif mt-0.5">{course.titleJa}</p>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">{course.lessonCount || 2} Lessons</span>
                      <span className="text-red-600 font-bold flex items-center space-x-1">
                        <span>{isSelected ? 'Viewing' : 'Select'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Course Modules & Lessons */}
          <div className="lg:col-span-8">
            {selectedCourse ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Course Header */}
                <div className="border-b border-stone-100 pb-5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                      JLPT {selectedCourse.level}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold">
                      &bull; ~{selectedCourse.estimatedHours} study hours
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-stone-900">{selectedCourse.title}</h2>
                  <p className="text-sm font-serif text-red-600">{selectedCourse.titleJa}</p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{selectedCourse.description}</p>
                </div>

                {/* Modules Accordion */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Curriculum Modules ({courseModules.length})
                  </h3>

                  {courseModules.map((mod, idx) => {
                    const isExpanded = expandedModuleId === mod.id;
                    const lessons = mod.lessons || [];
                    const completedInMod = lessons.filter((l: any) => completedLessonIds.includes(l.id)).length;

                    return (
                      <div
                        key={mod.id}
                        className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-sm"
                      >
                        {/* Module Header */}
                        <div
                          onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-stone-100/60 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-red-600">Module {idx + 1}:</span>
                              <span className="text-sm font-bold text-stone-900">{mod.title}</span>
                            </div>
                            <p className="text-xs text-stone-500">{mod.description}</p>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <span className="text-xs font-semibold text-stone-500">
                              {completedInMod}/{lessons.length} done
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-stone-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-500" />
                            )}
                          </div>
                        </div>

                        {/* Lessons List */}
                        {isExpanded && (
                          <div className="p-4 pt-0 border-t border-stone-200/80 space-y-2.5">
                            {lessons.map((les: any) => {
                              const isCompleted = completedLessonIds.includes(les.id);
                              return (
                                <div
                                  key={les.id}
                                  className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-red-300 transition-all shadow-sm"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
                                      )}
                                      <span className="text-xs font-bold text-stone-900">
                                        Lesson {les.lessonNumber}: {les.title}
                                      </span>
                                    </div>
                                    <p className="text-xs text-red-600 font-serif pl-6">{les.titleJa}</p>
                                    <p className="text-xs text-stone-500 pl-6 leading-relaxed">{les.summary}</p>
                                    <div className="pl-6 flex items-center space-x-3 text-[11px] text-stone-400 pt-1">
                                      <span>{les.vocabCount} Vocab</span>
                                      <span>&bull;</span>
                                      <span>{les.grammarCount} Grammar</span>
                                      <span>&bull;</span>
                                      <span>{les.kanjiCount} Kanji</span>
                                      <span>&bull;</span>
                                      <span>~{les.estimatedMinutes} min</span>
                                    </div>
                                  </div>

                                  <div className="self-end sm:self-center shrink-0 flex items-center space-x-2">
                                    {les.hasQuiz && (
                                      <button
                                        onClick={() => onNavigate('quiz-runner', { lessonId: les.id })}
                                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all flex items-center space-x-1"
                                        title="Take Lesson Quiz"
                                      >
                                        <Award className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Quiz</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => onNavigate('lesson', { lessonId: les.id })}
                                      className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>{isCompleted ? 'Review' : 'Start'}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400 shadow-sm space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs font-medium">Select a course on the left to view modules and lesson details.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ebook & Masterbook Library Showcase */}
        <EbookShowcaseCarousel />
      </div>
    </div>
  );
};
