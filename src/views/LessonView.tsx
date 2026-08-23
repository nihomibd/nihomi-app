import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import { speakJapanese, stopJapaneseSpeech } from '../lib/tts.js';
import { getSrsState, saveSrsItemReview, formatNextReviewBadge, SrsItemState, SrsRating } from '../lib/srs.js';
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
  Lightbulb,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  Zap,
  Repeat,
  FileText,
  WifiOff,
  PenTool,
  Mic,
  Bot,
  Maximize2,
  Minimize2,
  Eye
} from 'lucide-react';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';
import { LessonQuickNotes } from '../components/LessonQuickNotes.js';
import { CanvasWritingPractice } from '../components/CanvasWritingPractice.js';
import { PronunciationLab } from '../components/PronunciationLab.js';
import { AiLessonFeedbackModal } from '../components/AiLessonFeedbackModal.js';
import { SpeechPracticeWidget } from '../components/SpeechPracticeWidget.js';
import {
  isLessonDownloaded,
  saveLessonOffline,
  removeDownloadedLesson
} from '../lib/offlineStorage.js';
import { Download, DownloadCloud, Wind, RefreshCw } from 'lucide-react';
import { ZenBreathingPrompt } from '../components/ZenBreathingPrompt.js';

interface LessonViewProps {
  lessonId: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lessonId, onNavigate }) => {
  const { user, refreshProgress } = useAuth();
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'kanji' | 'canvas-trace' | 'pronunciation' | 'dialogue' | 'practice'>('grammar');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Focus Mode state
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Quick Notes slideout state
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Online / Offline tracking
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && 'onLine' in navigator ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sentence DNA Modal
  const [dnaSentence, setDnaSentence] = useState<string | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, { isCorrect: boolean; show: boolean }>>({});

  // SRS State for Kanji
  const [srsDeck, setSrsDeck] = useState<Record<string, SrsItemState>>(() => getSrsState());

  // Listen Only Mode State for Vocabulary
  const [isListenOnlyActive, setIsListenOnlyActive] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const listenTimerRef = useRef<any>(null);

  // Offline download state
  const [isDownloaded, setIsDownloaded] = useState<boolean>(() => isLessonDownloaded(lessonId));
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Active phrase for speech practice modal/widget
  const [speakingTarget, setSpeakingTarget] = useState<{ phrase: string; romaji?: string; english?: string } | null>(null);

  // Zen Breathing Prompt Modal state
  const [isZenBreathingOpen, setIsZenBreathingOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadLesson() {
      setIsLoading(true);
      try {
        const data = await apiRequest<{ lesson: Lesson; courseTitle?: string; moduleTitle?: string; quizSummary?: any; isCompleted: boolean }>(
          `/api/lessons/${lessonId}`
        );
        setLessonData(data);

        // Record in Recently Viewed Lessons storage
        if (data?.lesson) {
          try {
            const raw = localStorage.getItem('nihomi_recently_viewed_lessons_v1');
            let list = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(list)) list = [];
            // Remove current if exists
            list = list.filter((item: any) => item.lessonId !== data.lesson.id);
            // Prepend current
            list.unshift({
              lessonId: data.lesson.id,
              lessonNumber: data.lesson.lessonNumber || 1,
              title: data.lesson.title,
              titleJa: data.lesson.titleJa || '日本語レッスン',
              level: data.lesson.level || 'N5',
              lastAccessedAt: new Date().toISOString(),
              progressPct: data.isCompleted ? 100 : 45
            });
            // Keep top 6
            localStorage.setItem('nihomi_recently_viewed_lessons_v1', JSON.stringify(list.slice(0, 6)));
          } catch (e) {
            console.warn('Recently viewed storage error:', e);
          }
        }
      } catch (err) {
        console.warn('Network load failed, checking offline storage:', err);
        // Fallback to offline stored lesson
        const offlineItem = isLessonDownloaded(lessonId);
        if (offlineItem) {
          const { getOfflineLesson } = await import('../lib/offlineStorage.js');
          const cached = getOfflineLesson(lessonId);
          if (cached) {
            setLessonData({
              lesson: cached.lesson,
              courseTitle: cached.courseTitle,
              moduleTitle: cached.moduleTitle,
              isCompleted: false
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (lessonId) {
      loadLesson();
      setIsDownloaded(isLessonDownloaded(lessonId));
    }
  }, [lessonId]);

  const handleToggleOfflineDownload = () => {
    if (!lessonData?.lesson) return;

    if (isDownloaded) {
      removeDownloadedLesson(lessonId);
      setIsDownloaded(false);
      setDownloadSuccessToast('Lesson removed from offline storage.');
      setTimeout(() => setDownloadSuccessToast(null), 3000);
    } else {
      saveLessonOffline(
        lessonId,
        lessonData.lesson,
        lessonData.courseTitle || 'JLPT Curriculum',
        lessonData.moduleTitle || 'Japanese Core Foundations'
      );
      setIsDownloaded(true);
      setDownloadSuccessToast('✅ Downloaded for offline study! You can access this lesson anytime without internet.');
      setTimeout(() => setDownloadSuccessToast(null), 4000);
    }
  };

  // Clean up speech and timer on tab change or unmount
  useEffect(() => {
    return () => {
      stopJapaneseSpeech();
      if (listenTimerRef.current) {
        clearTimeout(listenTimerRef.current);
      }
    };
  }, [activeTab]);

  // Listen Only sequential player engine
  useEffect(() => {
    if (!isListenOnlyActive || !lessonData?.lesson?.vocabulary?.length) {
      stopJapaneseSpeech();
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
      return;
    }

    const vocabList = lessonData.lesson.vocabulary;
    const currentVocab = vocabList[currentWordIndex];

    if (currentVocab) {
      speakJapanese(currentVocab.japanese, {
        rate: playbackSpeed,
        onEnd: () => {
          listenTimerRef.current = setTimeout(() => {
            if (currentWordIndex + 1 < vocabList.length) {
              setCurrentWordIndex((idx) => idx + 1);
            } else if (isLooping) {
              setCurrentWordIndex(0);
            } else {
              setIsListenOnlyActive(false);
              setCurrentWordIndex(0);
            }
          }, 1800);
        }
      });
    }

    return () => {
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    };
  }, [isListenOnlyActive, currentWordIndex, playbackSpeed, isLooping, lessonData]);

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
      // Open AI Lesson Feedback Modal
      setIsFeedbackModalOpen(true);
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSrsReview = (kanjiChar: string, rating: SrsRating) => {
    const updated = saveSrsItemReview(kanjiChar, rating, srsDeck[kanjiChar]);
    setSrsDeck((prev) => ({ ...prev, [kanjiChar]: updated }));
    speakJapanese(kanjiChar);
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

  // Character list for Canvas Writing Practice
  const kanjiTraceList = lesson.kanji?.length
    ? lesson.kanji.map((k: any) => ({
        char: k.character,
        reading: k.onyomi?.[0] || k.kunyomi?.[0] || '',
        meaning: k.meaning || '',
        strokes: k.strokeCount || 4
      }))
    : [
        { char: '日', reading: 'ひ / にち', meaning: 'Sun / Day', strokes: 4 },
        { char: '本', reading: 'ほん', meaning: 'Book / Origin', strokes: 5 },
        { char: '語', reading: 'ご', meaning: 'Language', strokes: 14 }
      ];

  return (
    <div
      id="nihomi-lesson-view"
      className={`min-h-screen transition-all duration-300 ${
        isFocusMode
          ? 'bg-stone-950 text-stone-100 py-4 px-3 sm:px-6'
          : 'bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8'
      }`}
    >
      {/* Focus Mode Floating Top Bar */}
      {isFocusMode && (
        <div className="max-w-4xl mx-auto mb-4 p-3 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-2xl flex items-center justify-between text-xs sticky top-4 z-40 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="font-extrabold text-white">Focus Mode Active (Zen Study)</span>
            <span className="text-stone-400 hidden sm:inline">&bull; {lesson.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZenBreathingOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-bold border border-amber-800 transition cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="Start 30-Second Box Breathing before studying"
            >
              <Wind className="w-3.5 h-3.5 text-amber-400" />
              <span>30s Zen Reset</span>
            </button>

            <button
              onClick={() => setIsFocusMode(false)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focus</span>
            </button>
          </div>
        </div>
      )}

      {/* 30-Second Zen Breathing Reset Prompt Modal */}
      <ZenBreathingPrompt
        isOpen={isZenBreathingOpen}
        onClose={() => setIsZenBreathingOpen(false)}
      />
      {/* Quick Notes Slide-Out Panel */}
      <LessonQuickNotes
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
      />

      {/* Sentence DNA Modal Trigger */}
      {dnaSentence && (
        <SentenceDnaModal
          isOpen={!!dnaSentence}
          onClose={() => setDnaSentence(null)}
          initialSentence={dnaSentence}
        />
      )}

      {/* AI Lesson Feedback Modal */}
      <AiLessonFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        lessonTitle={lesson.title}
        lessonId={lesson.id}
        jlptLevel={lesson.level}
        onContinueNextLesson={() => onNavigate('courses', { courseId: lesson.courseId })}
        onOpenGhostMode={() => onNavigate('ghost-mode')}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Offline Banner Alert */}
        {!isOnline && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Offline Study Mode:</strong> Your lesson progress, Kanji SRS ratings, and Quick Notes are stored locally and will sync when reconnected.
              </span>
            </div>
          </div>
        )}

        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('courses', { courseId: lesson.courseId })}
            className="self-start inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-red-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {courseTitle || 'Course'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Focus Mode Toggle Button */}
            <button
              id="btn-lesson-focus-mode"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer border ${
                isFocusMode
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold ring-2 ring-amber-400/30'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
              title={isFocusMode ? 'Exit Distraction-Free Focus Mode' : 'Enter Focus Mode (Zen Study)'}
            >
              {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-amber-600" />}
              <span>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
            </button>

            {/* AI Feedback Button */}
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Get AI Sensei Feedback"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>AI Feedback</span>
            </button>

            {/* Download for Offline Button */}
            <button
              id="btn-lesson-offline-download"
              onClick={handleToggleOfflineDownload}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer border ${
                isDownloaded
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
              title={isDownloaded ? 'Saved for offline study. Click to remove' : 'Download lesson for offline study'}
            >
              {isDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Offline Ready</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4 text-stone-500" />
                  <span>Download for Offline</span>
                </>
              )}
            </button>

            {/* Quick Notes Toggle Button */}
            <button
              id="btn-lesson-quick-notes"
              onClick={() => setIsNotesOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span>Quick Notes</span>
            </button>

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

        {/* Offline Download Toast Notification */}
        {downloadSuccessToast && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{downloadSuccessToast}</span>
            </div>
            <button
              onClick={() => setDownloadSuccessToast(null)}
              className="p-1 hover:bg-emerald-600 rounded-lg text-emerald-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Speech Practice Focus Modal / Drawer if user triggers a specific sentence */}
        {speakingTarget && (
          <div className="bg-white border-2 border-red-400 rounded-3xl p-6 shadow-xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <h4 className="text-sm font-bold text-stone-900 font-serif">
                  Live Web Speech Pronunciation Practice
                </h4>
              </div>
              <button
                onClick={() => setSpeakingTarget(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SpeechPracticeWidget
              targetPhrase={speakingTarget.phrase}
              romaji={speakingTarget.romaji}
              english={speakingTarget.english}
              onSuccess={(score) => {
                console.log('Pronunciation success score:', score);
              }}
            />
          </div>
        )}

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
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
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
            <span>Vocab ({lesson.vocabulary?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('kanji')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'kanji' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kanji SRS ({lesson.kanji?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('canvas-trace')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'canvas-trace' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-amber-600" />
            <span>Canvas Writing</span>
          </button>
          <button
            onClick={() => setActiveTab('pronunciation')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pronunciation' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-600" />
            <span>Pronunciation</span>
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
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'practice' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice ({lesson.practiceExercises?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content: Grammar */}
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
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4"
                    >
                      <div
                        onClick={() => setDnaSentence(ex.japanese)}
                        className="cursor-pointer space-y-0.5"
                        title="Click for Sentence DNA™"
                      >
                        <p className="text-sm font-serif font-bold text-stone-900 hover:text-red-600 transition-colors">
                          {ex.japanese}
                        </p>
                        <p className="text-xs text-stone-500">{ex.english}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setDnaSentence(ex.japanese)}
                          className="px-2 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold border border-red-200 hover:bg-red-100 cursor-pointer"
                        >
                          DNA
                        </button>
                        <button
                          type="button"
                          onClick={() => speakJapanese(ex.japanese)}
                          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-red-600 cursor-pointer"
                          title="উচ্চারণ শুনুন"
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

        {/* Tab: Vocabulary with dedicated LISTEN button & LISTEN ONLY Mode */}
        {activeTab === 'vocab' && (
          <div className="space-y-4">
            {/* LISTEN ONLY CONTROL BAR */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>AI Coach Listen-Only Mode</span>
                    {isListenOnlyActive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-[10px] font-bold uppercase animate-pulse">
                        Playing #{currentWordIndex + 1}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-400">
                    হ্যান্ডস-ফ্রি ক্রমান্বয়ে জাপানি শব্দভাণ্ডার অডিও শোনার প্লেয়ার
                  </p>
                </div>
              </div>

              {/* Player Controls & Speed Adjustment */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Speed Controls: 0.75x, 1.0x, 1.25x */}
                <div className="flex items-center bg-stone-800 rounded-xl p-1 border border-stone-700 text-xs font-bold">
                  {[
                    { label: '0.75x', val: 0.75 },
                    { label: '1.0x', val: 0.95 },
                    { label: '1.25x', val: 1.25 }
                  ].map((spd) => (
                    <button
                      key={spd.label}
                      onClick={() => setPlaybackSpeed(spd.val)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        playbackSpeed === spd.val
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>

                {/* Loop Toggle */}
                <button
                  onClick={() => setIsLooping((prev) => !prev)}
                  className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    isLooping
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                  }`}
                  title="লুপ প্লেব্যাক"
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Play / Pause Main Button */}
                <button
                  onClick={() => {
                    if (isListenOnlyActive) {
                      setIsListenOnlyActive(false);
                      stopJapaneseSpeech();
                    } else {
                      setIsListenOnlyActive(true);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  {isListenOnlyActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isListenOnlyActive ? 'পজ করুন' : 'লিসেন-অনলি শুরু করুন'}</span>
                </button>
              </div>
            </div>

            {/* Vocabulary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.vocabulary?.map((v: any, vIdx: number) => {
                const isPlayingThisWord = isListenOnlyActive && currentWordIndex === vIdx;

                return (
                  <div
                    key={v.id || vIdx}
                    className={`bg-white border rounded-3xl p-5 shadow-sm space-y-3 transition duration-300 ${
                      isPlayingThisWord
                        ? 'border-red-500 ring-2 ring-red-400 ring-offset-1 bg-red-50/40'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <ruby className="text-2xl font-bold font-serif text-stone-900">
                          {v.japanese}
                          <rt className="text-xs text-red-600 font-sans">{v.furigana}</rt>
                        </ruby>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">{v.romaji}</p>
                      </div>

                      {/* Audio & Speech Practice Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSpeakingTarget({ phrase: v.japanese, romaji: v.romaji, english: v.english })}
                          className="px-2.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50 text-stone-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                          title="Practice Speaking (Web Speech API)"
                        >
                          <Mic className="w-3.5 h-3.5 text-purple-600" />
                          <span>Speak</span>
                        </button>

                        <button
                          id={`btn-listen-vocab-${v.id || vIdx}`}
                          onClick={() => speakJapanese(v.japanese, { rate: playbackSpeed })}
                          className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                            isPlayingThisWord
                              ? 'bg-red-600 text-white border-red-600 shadow-md'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:text-red-600 hover:bg-stone-100'
                          }`}
                          title="উচ্চারণ শুনুন (Listen)"
                        >
                          <Volume2 className="w-4 h-4 text-red-600" />
                          <span>Listen</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-stone-800">{v.english}</p>
                    {v.banglaMeaning && (
                      <p className="text-xs font-semibold text-emerald-700 font-sans mt-0.5">{v.banglaMeaning}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Kanji with SPACED REPETITION SYSTEM (SRS) */}
        {activeTab === 'kanji' && (
          <div className="space-y-4">
            {/* SRS Explainer Header */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-stone-700">
                  <strong>স্পেসড রিপিটিশন (SRS) শিডিউলিং সক্রিয়:</strong> আপনার রেটিং অনুসারে পরবর্তীতে সঠিক সময়ে কাঞ্জি রিভিশনের শিডিউল তৈরি হয়।
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lesson.kanji?.map((k: any) => {
                const srsItem = srsDeck[k.character];
                const badge = formatNextReviewBadge(srsItem);

                return (
                  <div
                    key={k.id || k.character}
                    className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold font-serif text-stone-900">{k.character}</span>
                        <div className="text-right space-y-1">
                          <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 rounded text-stone-600 block">
                            {k.strokeCount || 4} strokes
                          </span>
                          <button
                            onClick={() => speakJapanese(k.character)}
                            className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                            title="উচ্চারণ"
                          >
                            <Volume2 className="w-3.5 h-3.5 ml-auto" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-red-600 mt-1">{k.meaning}</p>
                      <div className="text-[11px] text-stone-500 space-y-0.5 mt-1">
                        <p>Onyomi: {k.onyomi?.join(', ')}</p>
                        <p>Kunyomi: {k.kunyomi?.join(', ')}</p>
                      </div>
                    </div>

                    {/* SRS Next Review Metadata Badge & Action Buttons */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`px-2.5 py-0.5 rounded-lg border font-semibold text-[10px] ${badge.colorClass}`}>
                          {badge.label}
                        </span>
                        {srsItem?.stage && (
                          <span className="text-[10px] font-bold text-stone-400 uppercase font-mono">
                            Stage: {srsItem.stage}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1">
                        <button
                          onClick={() => handleSrsReview(k.character, 'again')}
                          className="py-1.5 px-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[10px] font-bold border border-rose-200 text-center transition cursor-pointer"
                          title="ভুলে গেছি (পুনরায় দেখুন)"
                        >
                          Again
                        </button>
                        <button
                          onClick={() => handleSrsReview(k.character, 'hard')}
                          className="py-1.5 px-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold border border-amber-200 text-center transition cursor-pointer"
                          title="কঠিন (1 দিন পর)"
                        >
                          Hard
                        </button>
                        <button
                          onClick={() => handleSrsReview(k.character, 'good')}
                          className="py-1.5 px-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-[10px] font-bold border border-blue-200 text-center transition cursor-pointer"
                          title="পেরেছি (3 দিন পর)"
                        >
                          Good
                        </button>
                        <button
                          onClick={() => handleSrsReview(k.character, 'easy')}
                          className="py-1.5 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold border border-emerald-200 text-center transition cursor-pointer"
                          title="সহজ (7 দিন পর)"
                        >
                          Easy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Canvas Writing Practice */}
        {activeTab === 'canvas-trace' && (
          <CanvasWritingPractice
            characterList={kanjiTraceList}
            onCompletePractice={(char) => {
              console.log('Writing completed for:', char);
            }}
          />
        )}

        {/* Tab: Pronunciation Lab */}
        {activeTab === 'pronunciation' && (
          <PronunciationLab
            initialPhrase={lesson.vocabulary?.[0]?.japanese || 'はじめまして'}
            onScoreEarned={(score) => {
              console.log('Pronunciation score earned:', score);
            }}
          />
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSpeakingTarget({ phrase: line.japanese, english: line.english })}
                        className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                        title="Practice Speaking (Web Speech API)"
                      >
                        <Mic className="w-3 h-3 text-purple-600" />
                        <span>Speak</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => speakJapanese(line.japanese)}
                        className="p-1 rounded text-stone-400 hover:text-red-600 cursor-pointer"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
export default LessonView;
