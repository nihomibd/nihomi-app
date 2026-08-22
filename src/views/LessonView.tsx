import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import { speakJapanese } from '../lib/tts.js';
import { Lesson } from '../types.js';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  ArrowLeft,
  Award,
  Sparkles,
  Layers,
  HelpCircle,
  Check,
  X,
  MessageSquare,
  Globe,
  Lightbulb
} from 'lucide-react';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';

interface LessonViewProps {
  lessonId: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lessonId, onNavigate }) => {
  const { user, refreshProgress } = useAuth();
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'kanji' | 'dialogue' | 'practice'>('grammar');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  // Sentence DNA Modal
  const [dnaSentence, setDnaSentence] = useState<string | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, { isCorrect: boolean; show: boolean }>>({});

  useEffect(() => {
    async function loadLesson() {
      setIsLoading(true);
      try {
        const data = await apiRequest<{ lesson: Lesson; courseTitle?: string; moduleTitle?: string; quizSummary?: any; isCompleted: boolean }>(
          `/api/lessons/${lessonId}`
        );
        setLessonData(data);
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  const handleCompleteLesson = async () => {
    if (!user || !lessonData) return;
    setIsCompleting(true);
    try {
      await apiRequest('/api/progress/complete-lesson', {
        method: 'POST',
        body: JSON.stringify({
          lessonId: lessonData.lesson.id,
          studyMinutes: lessonData.lesson.estimatedMinutes || 15
        })
      });
      setCompletedSuccess(true);
      await refreshProgress();
      if (lessonData) {
        setLessonData({ ...lessonData, isCompleted: true });
      }
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  const checkPracticeAnswer = (exerciseId: string, answer: string, correctAnswer: string) => {
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setPracticeFeedback((prev) => ({
      ...prev,
      [exerciseId]: { isCorrect, show: true }
    }));
  };

  if (isLoading || !lessonData) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-8">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-stone-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  const { lesson, courseTitle, moduleTitle, quizSummary, isCompleted } = lessonData;

  return (
    <div id="nihomi-lesson-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      {/* Sentence DNA Modal Trigger */}
      {dnaSentence && (
        <SentenceDnaModal
          isOpen={!!dnaSentence}
          onClose={() => setDnaSentence(null)}
          initialSentence={dnaSentence}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Breadcrumb & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('courses', { courseId: lesson.courseId })}
            className="self-start inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-red-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {courseTitle || 'Course'}</span>
          </button>
          <div className="flex items-center gap-3">
            {quizSummary && (
              <button
                onClick={() => onNavigate('quiz-runner', { lessonId: lesson.id })}
                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>Take Lesson Quiz</span>
              </button>
            )}
            {user && (
              <button
                onClick={handleCompleteLesson}
                disabled={isCompleting || isCompleted}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : isCompleting ? 'Saving...' : 'Mark as Completed'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Lesson Header Banner */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              JLPT {lesson.level}
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Lesson {lesson.lessonNumber} &bull; {moduleTitle}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">{lesson.title}</h1>
          <p className="text-sm font-serif text-red-600">{lesson.titleJa}</p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">{lesson.summary}</p>
        </div>

        {/* Bengali Cultural & Emotional Anchor Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50/40 to-rose-50 border border-red-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Bengali Cultural Anchor™ (বাস্তব জীবনের অ্যানালজি)</span>
          </div>
          <p className="text-stone-700 leading-relaxed">
            <strong>বাংলাদেশে আমরা কী করি:</strong> পরিচিত বন্ধু বা ছোট ভাইদের সাথে কথা বলা আর পরিবারের মুরুব্বি বা শিক্ষকদের সাথে কথা বলার আদব যেমন আলাদা, জাপানেও তেমনি পরিস্থিতি অনুযায়ী Teineigo এবং Keigo ব্যবহার করা হয়।
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('grammar')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'grammar' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Grammar ({lesson.grammar?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'vocab' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vocabulary ({lesson.vocabulary?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('kanji')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'kanji' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kanji ({lesson.kanji?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'dialogue' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Dialogue</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`col-span-2 sm:col-span-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'practice' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice ({lesson.practiceExercises?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            {lesson.grammar?.map((g: any, idx: number) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-red-600">Grammar #{idx + 1}</span>
                    <h3 className="text-lg font-bold text-stone-900 font-serif">{g.title}</h3>
                  </div>
                  <div className="bg-red-50 text-red-800 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-mono font-bold">
                    {g.structure}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  {g.meaning} &bull; {g.explanation}
                </p>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700">Example Sentences (Click for Sentence DNA™):</span>
                  {g.examples?.map((ex: any, exIdx: number) => (
                    <div
                      key={exIdx}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3 hover:border-red-300 transition-colors"
                    >
                      <div
                        onClick={() => setDnaSentence(ex.japanese)}
                        className="space-y-1 cursor-pointer flex-1"
                        title="Click to view 6-layer Sentence DNA"
                      >
                        <p className="text-sm font-serif font-bold text-stone-900 hover:text-red-600">{ex.japanese}</p>
                        <p className="text-xs text-stone-600">{ex.english}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setDnaSentence(ex.japanese)}
                          className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold hover:bg-blue-100 cursor-pointer"
                        >
                          DNA™
                        </button>
                        <button
                          type="button"
                          onClick={() => speakJapanese(ex.japanese)}
                          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-red-600 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Vocabulary */}
        {activeTab === 'vocab' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary?.map((v: any) => (
              <div key={v.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <ruby className="text-2xl font-bold font-serif text-stone-900">
                      {v.japanese}
                      <rt className="text-xs text-red-600 font-sans">{v.furigana}</rt>
                    </ruby>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">{v.romaji}</p>
                  </div>
                  <button
                    onClick={() => speakJapanese(v.japanese)}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 hover:text-red-600 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-stone-800">{v.english}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Kanji */}
        {activeTab === 'kanji' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.kanji?.map((k: any) => (
              <div key={k.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold font-serif text-stone-900">{k.character}</span>
                  <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 rounded text-stone-600">{k.strokeCount} strokes</span>
                </div>
                <p className="text-xs font-bold text-red-600">{k.meaning}</p>
                <div className="text-[11px] text-stone-500 space-y-0.5">
                  <p>Onyomi: {k.onyomi?.join(', ')}</p>
                  <p>Kunyomi: {k.kunyomi?.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Dialogue */}
        {activeTab === 'dialogue' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif">
              {lesson.dialogue?.title || 'Interactive Context Dialogue'}
            </h3>
            <div className="space-y-3">
              {lesson.dialogue?.lines?.map((line: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700">{line.speaker}</span>
                    <button
                      type="button"
                      onClick={() => speakJapanese(line.japanese)}
                      className="p-1 rounded text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p
                    onClick={() => setDnaSentence(line.japanese)}
                    className="text-sm font-serif font-bold text-stone-900 hover:text-red-600 cursor-pointer"
                    title="Click for Sentence DNA™"
                  >
                    {line.japanese}
                  </p>
                  <p className="text-xs text-stone-600">{line.english}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Practice Exercises */}
        {activeTab === 'practice' && (
          <div className="space-y-4">
            {lesson.practiceExercises?.map((ex: any, idx: number) => {
              const feedback = practiceFeedback[ex.id];
              return (
                <div key={ex.id || idx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-red-600">Exercise #{idx + 1}</span>
                  <p className="text-sm font-bold text-stone-900">{ex.prompt}</p>
                  
                  {ex.type === 'multiple_choice' && ex.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {ex.options.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => checkPracticeAnswer(ex.id, opt, ex.correctAnswer)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            practiceAnswers[ex.id] === opt
                              ? 'bg-red-50 border-red-500 text-red-900'
                              : 'bg-stone-50 border-stone-200 hover:border-stone-400 text-stone-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {feedback?.show && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {feedback.isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                      <span>{feedback.isCorrect ? 'Correct! Well done.' : `Incorrect. Correct answer: ${ex.correctAnswer}`}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
