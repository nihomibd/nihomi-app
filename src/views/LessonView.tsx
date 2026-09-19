import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useProgressSync } from '../hooks/useProgressSync.js';
import { apiRequest } from '../lib/api.js';
import { speakJapanese, stopJapaneseSpeech } from '../lib/tts.js';
import { getSrsState, saveSrsItemReview, formatNextReviewBadge, SrsItemState, SrsRating } from '../lib/srs.js';
import { getCurriculumLesson } from '../data/lessons/n5MasterCurriculum.js';
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
  Eye,
  Crown,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ProUpgradeModal } from '../components/billing/ProUpgradeModal';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';
import { LessonQuickNotes } from '../components/LessonQuickNotes.js';
import { CanvasWritingPractice } from '../components/CanvasWritingPractice.js';
import { PronunciationLab } from '../components/PronunciationLab.js';
import { AiLessonFeedbackModal } from '../components/AiLessonFeedbackModal.js';
import { SpeechPracticeWidget } from '../components/SpeechPracticeWidget.js';
import { motion } from 'motion/react';
import { cacheLessonOffline, getCachedLessonOffline } from '../lib/offlineDb.js';
import { soundEffects } from '../lib/soundEffects.js';
import {
  isLessonDownloaded,
  saveLessonOffline,
  removeDownloadedLesson
} from '../lib/offlineStorage.js';
import { Download, DownloadCloud, Wind, RefreshCw } from 'lucide-react';
import { ZenBreathingPrompt } from '../components/ZenBreathingPrompt.js';
import { LessonFocusTimerTracker } from '../components/reading/LessonFocusTimerTracker.js';
import { KanjiStrokeAnimator } from '../components/kanji/KanjiStrokeAnimator.js';
import { SessionReportOverlay } from '../components/SessionReportOverlay.js';
import { PronunciationCoach } from '../components/PronunciationCoach.js';
import { trackNihomiEvent } from '../utils/analytics.js';

interface LessonViewProps {
  lessonId?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lessonId: propLessonId, onNavigate }) => {
  // লোকাল স্টেট দিয়ে ইউজার যে লেসন সিলেক্ট করবে তা ইনস্ট্যান্ট পরিবর্তন করার ব্যবস্থা
  const [selectedLessonNum, setSelectedLessonNum] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id') || params.get('lessonId');
      if (idParam) {
        const match = idParam.match(/(\d+)/);
        if (match) return parseInt(match[1], 10);
      }
    }
    return 5; // ডিফল্ট লেসন ৫
  });

  const lessonId = `n5-l${selectedLessonNum}`;

  const { user, refreshProgress } = useAuth();
  const { syncLessonCompletion } = useProgressSync();
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'kanji' | 'canvas-trace' | 'pronunciation' | 'dialogue' | 'practice'>('grammar');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSessionReportOpen, setIsSessionReportOpen] = useState(false);
  const [sessionStartTime] = useState<number>(() => Date.now());

  // Focus Mode state
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // SRS State for Kanji
  const [srsDeck, setSrsDeck] = useState<Record<string, SrsItemState>>(() => getSrsState());
  const [isListenOnlyActive, setIsListenOnlyActive] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const listenTimerRef = useRef<any>(null);

  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [speakingTarget, setSpeakingTarget] = useState<{ phrase: string; romaji?: string; english?: string } | null>(null);
  const [selectedKanjiForStrokeAnim, setSelectedKanjiForStrokeAnim] = useState<{ character: string; meaning?: string } | null>(null);
  const [isZenBreathingOpen, setIsZenBreathingOpen] = useState<boolean>(false);

  const isPro =
    user?.role === 'founder' ||
    user?.role === 'admin' ||
    user?.planId === 'pro' ||
    user?.planId === 'japan_ready' ||
    (user as any)?.subscription?.planId === 'pro';

  const isLockedForNonPro = selectedLessonNum >= 6 && !isPro;
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      setIsLoading(true);
      try {
        // সরাসরি আমাদের মাস্টার কারিকুলাম থেকে সিলেক্ট করা লেসন নাম্বার অনুযায়ী ডেটা ফেচ করব
        const fallbackLesson = getCurriculumLesson(`n5-l${selectedLessonNum}`);
        if (fallbackLesson) {
          setLessonData({
            lesson: fallbackLesson,
            courseTitle: 'JLPT N5 Complete Minna no Nihongo Course',
            moduleTitle: `Module ${fallbackLesson.moduleId || '1'}`,
            isCompleted: false
          });
        }
      } catch (err) {
        console.warn('Load failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
<<<<<<< HEAD
    loadLesson();
  }, [selectedLessonNum]);
=======
    if (lessonId) {
      loadLesson();
      setIsDownloaded(isLessonDownloaded(lessonId));

      // Restore saved progress if available
      try {
        const saved = localStorage.getItem(`nihomi_lesson_progress_${lessonId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.activeTab) setActiveTab(parsed.activeTab);
          if (typeof parsed.currentWordIndex === 'number') setCurrentWordIndex(parsed.currentWordIndex);
          setResumedToast(`Resumed previous session at ${parsed.activeTab.toUpperCase()} tab.`);
          setTimeout(() => setResumedToast(null), 3500);
        }
      } catch {}
    }
  }, [lessonId]);

  // Auto-save student progress as they navigate tabs or vocabulary
  useEffect(() => {
    if (lessonId && lessonData?.lesson) {
      try {
        localStorage.setItem(
          `nihomi_lesson_progress_${lessonId}`,
          JSON.stringify({
            lessonId,
            activeTab,
            currentWordIndex,
            lastUpdated: Date.now()
          })
        );
      } catch {}
    }
  }, [lessonId, activeTab, currentWordIndex, lessonData]);

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
      const advanceSequence = () => {
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
      };

      try {
        speakJapanese(currentVocab.japanese, {
          rate: playbackSpeed,
          onEnd: advanceSequence,
          onError: advanceSequence
        });
      } catch (err) {
        console.warn('[LessonAudio] Audio playback exception safely bypassed:', err);
        advanceSequence();
      }
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
      // Synchronize to Supabase database (lesson_progress + learning_progress + activity_logs)
      await syncLessonCompletion(
        lessonData.lesson.id,
        100,
        (lessonData.lesson.estimatedMinutes || 15) * 60,
        lessonData.lesson.xpReward || 50
      );
      trackNihomiEvent('first_lesson_completed', {
        lessonId: lessonData.lesson.id,
        title: lessonData.lesson.title,
        studyMinutes: lessonData.lesson.estimatedMinutes || 15,
        xpReward: lessonData.lesson.xpReward || 50
      });
      setCompletedSuccess(true);
      soundEffects.playLessonCelebration();
      await refreshProgress();
      if (lessonData) {
        setLessonData({ ...lessonData, isCompleted: true });
      }
      // Open AI Lesson Feedback Modal and Session Summary
      setIsFeedbackModalOpen(true);
      setIsSessionReportOpen(true);
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

  const checkPracticeAnswer = async (exerciseId: string, answer: string, correctAnswer: string) => {
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setPracticeFeedback((prev) => ({
      ...prev,
      [exerciseId]: { isCorrect, show: true }
    }));

    if (isCorrect) {
      soundEffects.playCorrectPing();
    } else {
      soundEffects.playErrorBuzzer();
      if (user?.id) {
        try {
          await apiRequest('/api/progress/record-mistake', {
            method: 'POST',
            body: JSON.stringify({
              userId: user.id,
              itemType: 'GRAMMAR',
              conceptId: `lesson-${lessonId}-ex-${exerciseId}`,
              studentAnswer: answer,
              correctAnswer: correctAnswer,
              notes: `Lesson ${lessonId} practice exercise mistake`
            })
          });
        } catch (e) {
          console.warn('Silent MemoryOS tracking note:', e);
        }
      }
    }
  };
>>>>>>> 58140fa9043b58b8c637a84bcf90d02a96c6a8ac

  if (isLoading || !lessonData) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-8">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-stone-600">Loading Lesson {selectedLessonNum}...</p>
        </div>
      </div>
    );
  }

  const { lesson, courseTitle, moduleTitle, quizSummary, isCompleted } = lessonData;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* INSTANT LESSON SWITCHER BAR (১ থেকে ২৫ লেসন বদলানোর ইনস্ট্যান্ট ড্রপডাউন) */}
        <div className="bg-stone-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              ⚡ Instant Lesson Switcher:
            </span>
            <select
              value={selectedLessonNum}
              onChange={(e) => setSelectedLessonNum(parseInt(e.target.value, 10))}
              className="bg-stone-800 text-white border border-stone-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer focus:outline-none focus:border-red-500"
            >
              {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Lesson {num} {num <= 5 ? '(Free)' : '(Pro)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>
<<<<<<< HEAD
=======

          {/* Mobile 1-Row Compact Action Toolbar */}
          <div className="flex sm:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full shrink-0">
            {/* Focus Mode Pill */}
            <button
              id="btn-lesson-focus-mode-mobile"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer whitespace-nowrap ${
                isFocusMode
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold ring-2 ring-amber-400/30'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-xs'
              }`}
            >
              <span>🎯</span>
              <span>{isFocusMode ? 'ফোকাস অন' : 'ফোকাস'}</span>
            </button>

            {/* AI Feedback / Sensei Pill */}
            <button
              id="btn-lesson-ai-feedback-mobile"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>🤖</span>
              <span>সেনসেই</span>
            </button>

            {/* Offline Download Pill */}
            <button
              id="btn-lesson-offline-mobile"
              onClick={handleToggleOfflineDownload}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer whitespace-nowrap ${
                isDownloaded
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-xs'
              }`}
            >
              <span>{isDownloaded ? '✓' : '📥'}</span>
              <span>{isDownloaded ? 'অফলাইন রেডি' : 'অফলাইন'}</span>
            </button>

            {/* Quick Notes Pill */}
            <button
              id="btn-lesson-notes-mobile"
              onClick={() => setIsNotesOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>📝</span>
              <span>নোট</span>
            </button>

            {/* Mark as Completed Pill */}
            {user && (
              <button
                id="btn-lesson-complete-mobile"
                onClick={handleCompleteLesson}
                disabled={isCompleting || isCompleted}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <span>✓</span>
                <span>{isCompleted ? 'সম্পন্ন' : isCompleting ? 'সেভ হচ্ছে...' : 'সম্পন্ন করুন'}</span>
              </button>
            )}

            {/* Optional Quiz Pill */}
            {quizSummary && (
              <button
                onClick={() => onNavigate('quiz-runner', { lessonId: lesson.id })}
                className="shrink-0 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
              >
                <span>🏆</span>
                <span>কুইজ</span>
              </button>
            )}

            {/* Optional Pro Pill */}
            {!isPro && (
              <button
                onClick={() => setIsProModalOpen(true)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>👑</span>
                <span>প্রো</span>
              </button>
            )}
          </div>

          {/* Desktop Actions Toolbar */}
          <div className="hidden sm:flex flex-wrap items-center gap-2.5">
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

            {!isPro && (
              <button
                id="btn-lesson-upgrade-pro"
                onClick={() => setIsProModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-stone-950" />
                <span>Upgrade to PRO</span>
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
>>>>>>> 58140fa9043b58b8c637a84bcf90d02a96c6a8ac
        </div>

        {/* Lesson Header Banner */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              JLPT N5
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Lesson {selectedLessonNum} &bull; Minna no Nihongo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">{lesson.title}</h1>
          <p className="text-sm font-serif text-red-600">{lesson.titleJa}</p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">{lesson.summary}</p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
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
            <span>Kanji ({lesson?.kanji?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content: Grammar */}
        {activeTab === 'grammar' && (
          <div className="space-y-4">
            {lesson.grammar?.map((g: any, idx: number) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-lg font-bold text-stone-900 font-serif">{g.title}</h3>
                  <span className="bg-red-50 text-red-800 px-3 py-1 rounded-xl text-xs font-mono font-bold">{g.structure}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  {g.meaning} &bull; {g.explanation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Vocabulary */}
        {activeTab === 'vocab' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.vocabulary?.map((v: any, vIdx: number) => (
                <div key={v.id || vIdx} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3">
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
                      className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-red-600" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-sm font-bold text-stone-800">{v.english}</p>
                  {v.banglaMeaning && (
                    <p className="text-xs font-semibold text-emerald-700 font-sans mt-0.5">{v.banglaMeaning}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Kanji */}
        {activeTab === 'kanji' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lesson.kanji?.map((k: any, kIdx: number) => (
              <div key={kIdx} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-2">
                <span className="text-4xl font-bold font-serif text-stone-900">{k.character}</span>
                <p className="text-xs font-bold text-red-600">{k.meaning}</p>
                <p className="text-xs text-stone-500">Onyomi: {k.onyomi?.join(', ')}</p>
                <p className="text-xs text-stone-500">Kunyomi: {k.kunyomi?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
export default LessonView;