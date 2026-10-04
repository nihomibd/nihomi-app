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
import { ChapterPremiumPreviewModal } from '../components/monetization/ChapterPremiumPreviewModal';
import { checkMonetizationGate } from '../core/monetization/monetizationGate';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';
import { LessonQuickNotes } from '../components/LessonQuickNotes.js';
import { CanvasWritingPractice } from '../components/CanvasWritingPractice.js';
import { PronunciationLab } from '../components/PronunciationLab.js';
import { AiLessonFeedbackModal } from '../components/AiLessonFeedbackModal.js';
import { SpeechPracticeWidget } from '../components/SpeechPracticeWidget.js';
import { motion } from 'motion/react';
import { cacheLessonOffline, getCachedLessonOffline } from '../lib/offlineDb.js';
import { soundEffects } from '../lib/soundEffects.js';
import { haptic } from '../lib/haptic.js';
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
import { ZenLearningCanvas } from '../components/learning/ZenLearningCanvas.js';
import { ContextualSenseiCompanion } from '../components/ai/ContextualSenseiCompanion';
import { PrerequisiteFoundationGate } from '../components/learning/PrerequisiteFoundationGate';
import { loadLearnerKnowledgeState } from '../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, getLessonGateStatus } from '../core/curriculum/journeyEngine';

interface LessonViewProps {
  lessonId?: string;
  char?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lessonId: propLessonId, char: propChar, onNavigate }) => {
  // লোকাল স্টেট দিয়ে ইউজার যে লেসন সিলেক্ট করবে তা ইনস্ট্যান্ট পরিবর্তন করার ব্যবস্থা
  const [selectedLessonNum, setSelectedLessonNum] = useState<number>(() => {
    if (propLessonId) {
      const str = String(propLessonId).trim();
      const lMatch = str.match(/l(?:esson)?[-_]?(\d+)/i) || str.match(/[-_](\d+)$/);
      if (lMatch) return parseInt(lMatch[1], 10);
      const allMatches = str.match(/\d+/g);
      if (allMatches && allMatches.length > 0) return parseInt(allMatches[allMatches.length - 1], 10);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id') || params.get('lessonId');
      if (idParam) {
        const str = String(idParam).trim();
        const lMatch = str.match(/l(?:esson)?[-_]?(\d+)/i) || str.match(/[-_](\d+)$/);
        if (lMatch) return parseInt(lMatch[1], 10);
        const allMatches = str.match(/\d+/g);
        if (allMatches && allMatches.length > 0) return parseInt(allMatches[allMatches.length - 1], 10);
      }
    }
    return 1; // Default to Lesson 1
  });

  const rawId = String(propLessonId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') || new URLSearchParams(window.location.search).get('lessonId') || 'n5-l1' : 'n5-l1')).toLowerCase().trim();
  let targetLvl = 'n5';
  if (rawId.startsWith('n1')) targetLvl = 'n1';
  else if (rawId.startsWith('n2')) targetLvl = 'n2';
  else if (rawId.startsWith('n3')) targetLvl = 'n3';
  else if (rawId.startsWith('n4')) targetLvl = 'n4';

  const lessonId = `${targetLvl}-l${selectedLessonNum}`;

  const { user, refreshProgress } = useAuth();
  const { syncLessonCompletion } = useProgressSync();
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'kanji' | 'canvas-trace' | 'pronunciation' | 'dialogue' | 'practice'>('grammar');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [resumedToast, setResumedToast] = useState<string | null>(null);
  const [dnaSentence, setDnaSentence] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, { isCorrect: boolean; show: boolean }>>({});
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

  const monetizationStatus = checkMonetizationGate(`n5-l${selectedLessonNum}`, isPro);
  const isLockedForNonPro = monetizationStatus.isRestricted;
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPremiumPreviewOpen, setIsPremiumPreviewOpen] = useState(false);

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

  useEffect(() => {
    async function loadLesson() {
      setIsLoading(true);
      try {
        // Try local offline cache first
        const cached = await getCachedLessonOffline(lessonId);
        if (cached) {
          const payload = (cached as any).data || cached;
          if (payload && payload.lesson) {
            setLessonData(payload);
            setIsLoading(false);
            return;
          }
        }

        // Try API endpoint
        try {
          const res = await apiRequest(`/api/lessons/${lessonId}`);
          if (res && res.lesson) {
            setLessonData(res);
            cacheLessonOffline(lessonId, res);
            setIsLoading(false);
            return;
          }
        } catch {
          // Ignore server fetch error, use resilient master curriculum fallback
        }

        // Fallback to our master curriculum
        const fallbackLesson = getCurriculumLesson(lessonId || `n5-l${selectedLessonNum}`);
        if (fallbackLesson) {
          const courseTitle = fallbackLesson.level === 'N1'
            ? 'JLPT N1 Executive Japanese Master Course'
            : fallbackLesson.level === 'N2'
            ? 'JLPT N2 Advanced Business Japanese Course'
            : fallbackLesson.level === 'N3'
            ? 'JLPT N3 Intermediate Japanese Master Course'
            : fallbackLesson.level === 'N4'
            ? 'JLPT N4 Intermediate Japanese Course'
            : 'JLPT N5 Complete Minna no Nihongo Course';
          const payload = {
            lesson: fallbackLesson,
            courseTitle,
            moduleTitle: `Module ${fallbackLesson.moduleId || '1'}`,
            isCompleted: false,
            quizSummary: fallbackLesson.quizId ? { quizId: fallbackLesson.quizId, totalQuestions: 5 } : null
          };
          setLessonData(payload);
          cacheLessonOffline(lessonId, payload);
        }
      } catch (err) {
        console.warn('Load failed:', err);
      } finally {
        setIsLoading(false);
      }
    }
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
    if (!lessonData || !lessonData.lesson) return;
    setIsCompleting(true);

    const lId = lessonData.lesson.id;
    const xpReward = lessonData.lesson.xpReward || 50;
    const estMinutes = lessonData.lesson.estimatedMinutes || 15;

    // 1. Local Persistence (Instant zero-latency feedback for all learners)
    try {
      const raw = localStorage.getItem('nihomi_completed_lessons');
      const currentCompleted: string[] = raw ? JSON.parse(raw) : [];
      if (!currentCompleted.includes(lId)) {
        currentCompleted.push(lId);
        localStorage.setItem('nihomi_completed_lessons', JSON.stringify(currentCompleted));
      }

      const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
      const nextXp = prevXp + xpReward;
      localStorage.setItem('nihomi_student_xp', nextXp.toString());

      // Global sync events for Course roadmaps and Student Dashboard
      window.dispatchEvent(new CustomEvent('nihomi:progress-updated', {
        detail: {
          type: 'lesson',
          lessonId: lId,
          xp: xpReward,
          totalXp: nextXp,
          completedCount: currentCompleted.length
        }
      }));

      window.dispatchEvent(new CustomEvent('nihomi:lesson-completed', {
        detail: {
          lessonId: lId,
          xp: xpReward,
          totalXp: nextXp
        }
      }));
    } catch (err) {
      console.warn('[LessonSync] Failed local lesson storage:', err);
    }

    setCompletedSuccess(true);
    soundEffects.playLessonCelebration();
    if (lessonData) {
      setLessonData({ ...lessonData, isCompleted: true });
    }

    // 2. Authenticated Cloud & Database Sync
    if (user) {
      try {
        await apiRequest('/api/progress/complete-lesson', {
          method: 'POST',
          body: JSON.stringify({
            lessonId: lId,
            studyMinutes: estMinutes
          })
        });
        await syncLessonCompletion(
          lId,
          100,
          estMinutes * 60,
          xpReward
        );
        trackNihomiEvent('first_lesson_completed', {
          lessonId: lId,
          title: lessonData.lesson.title,
          studyMinutes: estMinutes,
          xpReward: xpReward
        });
        await refreshProgress();
      } catch (err) {
        console.warn('[LessonSync] Authenticated cloud sync degraded gracefully:', err);
      }
    }

    // Open AI Lesson Feedback Modal and Session Summary
    setIsFeedbackModalOpen(true);
    setIsSessionReportOpen(true);
    setIsCompleting(false);
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
      haptic.correct();
    } else {
      soundEffects.playErrorBuzzer();
      haptic.incorrect();
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


  const targetChar = propChar || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('char') || undefined : undefined);

  if (selectedLessonNum === 1) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white py-6 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ZenLearningCanvas
            initialChar={targetChar}
            onBack={() => onNavigate('courses')}
            onNextLesson={() => {
              const kState = loadLearnerKnowledgeState();
              const nextMission = getNextBestMission(kState);
              if (nextMission.viewRoute === 'lesson') {
                onNavigate('lesson', nextMission.viewParams || { lessonId: 'n5-l1' });
              } else if (nextMission.viewRoute === 'journey') {
                onNavigate('journey', nextMission.viewParams);
              } else {
                onNavigate(nextMission.viewRoute, nextMission.viewParams);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // AUTHORITATIVE CURRICULUM GATE: Check if learner meets prerequisites for this lesson
  const kState = loadLearnerKnowledgeState();
  const gateStatus = getLessonGateStatus(lessonId, kState);

  if (gateStatus.isLocked) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white py-6 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <PrerequisiteFoundationGate
            gateStatus={gateStatus}
            requestedLessonId={lessonId}
            knowledgeState={kState}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    );
  }

  if (isLoading || !lessonData || !lessonData.lesson) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-8 text-white">
        <div className="text-center space-y-3 bg-[#131926] p-8 rounded-3xl border border-slate-800 shadow-xl max-w-sm">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-300">Loading Lesson {selectedLessonNum}...</p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => {
                const fallbackLesson = getCurriculumLesson(lessonId || `n5-l${selectedLessonNum}`);
                if (fallbackLesson) {
                  const courseTitle = fallbackLesson.level === 'N3'
                    ? 'JLPT N3 Intermediate Japanese Master Course'
                    : fallbackLesson.level === 'N4'
                    ? 'JLPT N4 Intermediate Japanese Course'
                    : 'JLPT N5 Complete Minna no Nihongo Course';
                  setLessonData({
                    lesson: fallbackLesson,
                    courseTitle,
                    moduleTitle: `Module ${fallbackLesson.moduleId || '1'}`,
                    isCompleted: false
                  });
                  setIsLoading(false);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition"
            >
              সরাসরি লোড করুন (Direct Load)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { lesson, courseTitle, moduleTitle, quizSummary, isCompleted } = lessonData;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Sleek Minimalist Top Bar */}
        <div className="bg-[#131926] border border-slate-800 text-white p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </button>
            <span className="text-slate-700">|</span>
            <select
              value={selectedLessonNum}
              onChange={(e) => setSelectedLessonNum(parseInt(e.target.value, 10))}
              className="bg-slate-900 text-white border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer focus:outline-none focus:border-red-500"
            >
              {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Lesson {num} {num === 1 ? '(Zen Canvas)' : num <= 5 ? '(Free)' : '(Pro)'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            {quizSummary && (
              <button
                onClick={() => onNavigate('quiz-runner', { lessonId: lesson.id })}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Take Quiz</span>
              </button>
            )}
            {user && (
              <button
                onClick={handleCompleteLesson}
                disabled={isCompleting || isCompleted}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : isCompleting ? 'Saving...' : 'Mark as Completed'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Lesson Header Banner */}
        <div className="bg-[#131926] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-950/60 text-red-400 border border-red-800/40">
              JLPT N5
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Lesson {selectedLessonNum} &bull; Minna no Nihongo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">{lesson.title}</h1>
          <p className="text-sm font-serif text-red-400">{lesson.titleJa}</p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">{lesson.summary}</p>
        </div>

        {/* If lesson >= 6 and student is not Pro, show Pro lock screen */}
        {isLockedForNonPro ? (
          <div className="bg-stone-900 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold font-serif">Lesson {selectedLessonNum} is a PRO Feature</h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Lessons 1 to 5 are completely free for all students. Upgrade to NIHOMI PRO to unlock full JLPT N5 Minna no Nihongo Lessons 6 through 25, interactive audio drills, unlimited AI Sensei feedback, and offline mode.
              </p>
            </div>
            <button
              id="btn-lesson-pro-unlock"
              onClick={() => setIsPremiumPreviewOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Crown className="w-5 h-5" />
              <span>Unlock with NIHOMI PRO</span>
            </button>
          </div>
        ) : (
          <>
            {/* Tab Navigation (All 7 Study Tabs) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
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

              <button
                onClick={() => setActiveTab('canvas-trace')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'canvas-trace' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Canvas Trace</span>
              </button>

              <button
                onClick={() => setActiveTab('pronunciation')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'pronunciation' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Pronunciation</span>
              </button>

              <button
                onClick={() => setActiveTab('dialogue')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'dialogue' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Dialogue ({lesson.dialogue?.length || 0})</span>
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

            {/* TAB 1: Grammar Patterns */}
            {activeTab === 'grammar' && (
              <div className="space-y-4">
                {lesson.grammar?.map((g: any, idx: number) => (
                  <div key={idx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-stone-900 font-serif">{g.title}</h3>
                        {g.titleJa && <p className="text-xs text-stone-500 font-serif">{g.titleJa}</p>}
                      </div>
                      <span className="bg-red-50 text-red-800 px-3 py-1 rounded-xl text-xs font-mono font-bold">
                        {g.structure}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-1">
                      <p className="font-semibold text-stone-900">{g.meaning}</p>
                      <p className="text-stone-600">{g.explanation}</p>
                    </div>

                    {/* Grammar Examples */}
                    {g.examples && g.examples.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Examples</span>
                        {g.examples.map((ex: any, eIdx: number) => (
                          <div key={eIdx} className="p-3 bg-stone-50/70 rounded-xl border border-stone-100 flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-serif font-bold text-stone-900">{ex.japanese}</p>
                              <p className="text-xs text-stone-600">{ex.english}</p>
                              {ex.breakdown && <p className="text-xs text-emerald-700 font-sans">{ex.breakdown}</p>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => speakJapanese(ex.japanese)}
                                className="p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                                title="Listen"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                              <button
                                onClick={() => setDnaSentence(ex.japanese)}
                                className="px-2 py-1 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-700 text-xs font-bold cursor-pointer"
                                title="Analyze Sentence DNA™"
                              >
                                DNA™
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Real-Life Japan Context Layer */}
                    <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/30 space-y-1.5 text-left">
                      <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-400 text-xs font-mono font-bold">
                        <span>🗼 REAL-LIFE TOKYO CONTEXT (বাস্তব জাপানিজ প্রয়োগ)</span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                        {g.titleJa?.includes('は') || g.structure?.includes('は')
                          ? 'টোকিওর কনবিনি, হোটেল কাউন্টার বা ইমিগ্রেশনে নিজের পরিচয় দিতে এই প্যাটার্নটি প্রথম ব্যবহৃত হয় (যেমন: 私は バングラデシュ人です - আমি বাংলাদেশি)।'
                          : 'টোকিওর সাবওয়ে স্টেশন, কনবিনি ও রেস্তোরাঁয় বিনম্র যোগাযোগের জন্য এই ব্যাকরণ কাঠামো নিয়মিত ব্যবহৃত হয়।'}
                      </p>
                    </div>

                    {/* Contextual AI Sensei Companion */}
                    <ContextualSenseiCompanion
                      currentConcept={{
                        topic: g.title,
                        reading: g.structure,
                        meaningBn: g.meaning,
                        japanContext: g.explanation,
                        type: 'grammar'
                      }}
                      compact
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Vocabulary */}
            {activeTab === 'vocab' && (
              <div className="space-y-4">
                {/* Audio Listen-Only Sequential Player Controls */}
                <div className="bg-stone-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsListenOnlyActive(!isListenOnlyActive)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                        isListenOnlyActive ? 'bg-red-600 text-white animate-pulse' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                      }`}
                    >
                      {isListenOnlyActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-red-500" />}
                      <span>{isListenOnlyActive ? 'Pause Auto-Player' : 'Play All Vocabulary'}</span>
                    </button>
                    {isListenOnlyActive && (
                      <span className="text-xs text-stone-400">
                        Playing word {currentWordIndex + 1} of {lesson.vocabulary?.length || 0}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-stone-400">Speed:</span>
                    {[0.7, 0.9, 1.0].map((s) => (
                      <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-2 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                          playbackSpeed === s ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`ml-2 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                        isLooping ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Repeat className="w-3 h-3" />
                      <span>Loop</span>
                    </button>
                  </div>
                </div>

                {/* Vocabulary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.vocabulary?.map((v: any, vIdx: number) => {
                    const isCurrentlyPlaying = isListenOnlyActive && currentWordIndex === vIdx;
                    return (
                      <div
                        key={v.id || vIdx}
                        className={`bg-white border rounded-3xl p-5 shadow-sm space-y-3 transition-all ${
                          isCurrentlyPlaying ? 'border-red-500 ring-2 ring-red-500/20 shadow-md' : 'border-stone-200'
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
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => speakJapanese(v.japanese, { rate: playbackSpeed })}
                              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4 text-red-600" />
                              <span>Listen</span>
                            </button>
                            <button
                              onClick={() => setSpeakingTarget({ phrase: v.japanese, romaji: v.romaji, english: v.english })}
                              className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer"
                              title="Speech Practice (Mic)"
                            >
                              <Mic className="w-4 h-4 text-purple-600" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-stone-800">{v.english}</p>
                          {v.banglaMeaning && (
                            <p className="text-xs font-semibold text-emerald-700 font-sans mt-0.5">{v.banglaMeaning}</p>
                          )}
                        </div>

                        {/* Example sentence if present */}
                        {v.exampleSentenceJa && (
                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs space-y-0.5">
                            <p className="font-serif text-stone-800 font-semibold">{v.exampleSentenceJa}</p>
                            <p className="text-stone-500">{v.exampleSentenceEn}</p>
                            {v.exampleSentenceBn && <p className="text-emerald-700">{v.exampleSentenceBn}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Kanji with SRS & Stroke Orders */}
            {activeTab === 'kanji' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lesson.kanji?.map((k: any, kIdx: number) => {
                    const badge = formatNextReviewBadge(k.character);
                    return (
                      <div key={k.id || kIdx} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-4xl font-bold font-serif text-stone-900">{k.character}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedKanjiForStrokeAnim({ character: k.character, meaning: k.meaning })}
                                className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1 border border-red-200 cursor-pointer"
                                title="Animate Stroke Order"
                              >
                                <PenTool className="w-3.5 h-3.5" />
                                <span>Strokes</span>
                              </button>
                              <button
                                onClick={() => speakJapanese(k.character)}
                                className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-bold text-red-600 mt-2">{k.meaning}</p>
                          <div className="text-xs text-stone-500 space-y-0.5 mt-1 font-mono">
                            <p>Onyomi: {Array.isArray(k.onyomi) ? k.onyomi.join(', ') : k.onyomi || '—'}</p>
                            <p>Kunyomi: {Array.isArray(k.kunyomi) ? k.kunyomi.join(', ') : k.kunyomi || '—'}</p>
                            {k.strokes && <p className="text-stone-400">Strokes: {k.strokes}</p>}
                          </div>

                          {/* Compounds */}
                          {k.examples && k.examples.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-stone-100 space-y-1">
                              {k.examples.slice(0, 2).map((comp: any, cIdx: number) => (
                                <div key={cIdx} className="text-xs flex items-center justify-between">
                                  <span className="font-serif font-bold text-stone-800">{comp.word} ({comp.reading})</span>
                                  <span className="text-stone-500 text-[11px] truncate max-w-[140px]">{comp.meaning}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* SRS Flashcard Rating Bar */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            SRS: {badge.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSrsReview(k.character, 'again')}
                              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 text-[11px] font-bold cursor-pointer"
                            >
                              Hard
                            </button>
                            <button
                              onClick={() => handleSrsReview(k.character, 'good')}
                              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-blue-100 text-stone-700 hover:text-blue-700 text-[11px] font-bold cursor-pointer"
                            >
                              Good
                            </button>
                            <button
                              onClick={() => handleSrsReview(k.character, 'easy')}
                              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-700 text-[11px] font-bold cursor-pointer"
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

            {/* TAB 4: Canvas Writing Practice */}
            {activeTab === 'canvas-trace' && (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <CanvasWritingPractice
                  initialCharacter={lesson.kanji?.[0]?.character || '日'}
                  characterList={
                    lesson.kanji?.map((k: any) => ({
                      char: k.character,
                      reading: Array.isArray(k.onyomi) ? k.onyomi.join(', ') : k.onyomi,
                      meaning: k.meaning,
                      strokes: k.strokes || 4
                    })) || undefined
                  }
                />
              </div>
            )}

            {/* TAB 5: Pronunciation Lab */}
            {activeTab === 'pronunciation' && (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <PronunciationLab
                  initialPhrase={lesson.vocabulary?.[0]?.japanese || 'はじめまして。'}
                  phraseList={
                    lesson.vocabulary && lesson.vocabulary.length > 0
                      ? lesson.vocabulary.map((v: any, idx: number) => ({
                          id: `vocab-${idx}`,
                          japanese: v.japanese,
                          reading: v.furigana || v.japanese,
                          romaji: v.romaji || '',
                          english: v.english || '',
                          bangla: v.banglaMeaning || ''
                        }))
                      : undefined
                  }
                  onScoreEarned={(score) => {
                    if (score >= 80) soundEffects.playCorrectPing();
                  }}
                />
              </div>
            )}

            {/* TAB 6: Dialogue Player with Sentence DNA™ */}
            {activeTab === 'dialogue' && (
              <div className="space-y-4">
                {lesson.dialogue && lesson.dialogue.length > 0 ? (
                  lesson.dialogue.map((d: any, dIdx: number) => (
                    <div key={dIdx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                            {d.speaker?.charAt(0) || '話'}
                          </span>
                          <span className="text-sm font-bold text-stone-800">{d.speaker}</span>
                          {d.speakerRole && <span className="text-xs text-stone-400 font-medium">({d.speakerRole})</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => speakJapanese(d.japanese)}
                            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer"
                            title="Listen"
                          >
                            <Volume2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            onClick={() => setDnaSentence(d.japanese)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-700 text-xs font-bold cursor-pointer"
                            title="Analyze Sentence DNA™"
                          >
                            Sentence DNA™
                          </button>
                        </div>
                      </div>

                      <p className="text-lg font-serif font-bold text-stone-900">{d.japanese}</p>
                      <p className="text-xs sm:text-sm text-stone-600">{d.english}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center text-stone-500">
                    <p className="text-sm font-medium">No dialogue scripts in this lesson yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: Practice Exercises with Instant Feedback */}
            {activeTab === 'practice' && (
              <div className="space-y-4">
                {/* Interactive Practice Engine Launcher Banner */}
                <div className="p-6 rounded-3xl bg-linear-to-r from-red-950/40 via-stone-900 to-amber-950/30 border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shadow-xl">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>ইন্টারঅ্যাক্টিভ প্র্যাকটিস ইঞ্জিন • INTERACTIVE DRILL ENGINE</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">পূর্ণাঙ্গ MCQ কুইজ ও টাইピング ড্রিল শুরু করুন</h3>
                    <p className="text-xs text-stone-300">ইনস্ট্যান্ট ফিডব্যাক, উচ্চারণ অডিও ও স্কোর ট্র্যাকারসহ বাস্তবসম্মত অনুশীলন।</p>
                  </div>
                  <button
                    onClick={() => onNavigate('practice', { lessonId })}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>ফুলস্ক্রিন প্র্যাকটিস শুরু করুন</span>
                  </button>
                </div>

                {lesson.practiceExercises && lesson.practiceExercises.length > 0 ? (
                  lesson.practiceExercises.map((ex: any, pIdx: number) => {
                    const fb = practiceFeedback[ex.id];
                    const selected = practiceAnswers[ex.id];
                    return (
                      <div key={ex.id || pIdx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                            Exercise {pIdx + 1}
                          </span>
                          <h4 className="text-base font-bold text-stone-900">{ex.instruction}</h4>
                          <p className="text-lg font-serif font-bold text-stone-950">{ex.questionJa}</p>
                          {ex.hint && <p className="text-xs text-stone-500 font-mono">{ex.hint}</p>}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {ex.options?.map((opt: string, oIdx: number) => {
                            const isChosen = selected === opt;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  haptic.selection();
                                  setPracticeAnswers((prev) => ({ ...prev, [ex.id]: opt }));
                                }}
                                className={`btn-haptic p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                  isChosen
                                    ? 'bg-red-50 border-red-500 text-red-950 font-bold ring-2 ring-red-500/20'
                                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Check Answer Button & Feedback */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                          <button
                            disabled={!selected}
                            onClick={() => checkPracticeAnswer(ex.id, selected, ex.correctAnswer)}
                            className="btn-haptic px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all"
                          >
                            Check Answer
                          </button>

                          {fb?.show && (
                            <div
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                                fb.isCorrect ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
                              }`}
                            >
                              <span>{fb.isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${ex.correctAnswer}`}</span>
                            </div>
                          )}
                        </div>

                        {fb?.show && ex.explanation && (
                          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                            <strong>Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center text-stone-500">
                    <p className="text-sm font-medium">Practice drills are complete for this lesson.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Floating Zen Breathing Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setIsZenBreathingOpen(true)}
            className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border border-stone-300"
          >
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>Zen Breathing (Take a 30s Break)</span>
          </button>
        </div>

        {/* Modals & Overlays */}
        <ProUpgradeModal
          isOpen={isProModalOpen}
          onClose={() => setIsProModalOpen(false)}
          onSuccess={() => setIsProModalOpen(false)}
        />

        <ChapterPremiumPreviewModal
          isOpen={isPremiumPreviewOpen}
          status={monetizationStatus}
          onClose={() => setIsPremiumPreviewOpen(false)}
          onUpgrade={() => {
            setIsPremiumPreviewOpen(false);
            setIsProModalOpen(true);
          }}
        />

        {dnaSentence && (
          <SentenceDnaModal
            isOpen={!!dnaSentence}
            initialSentence={dnaSentence}
            onClose={() => setDnaSentence(null)}
          />
        )}

        {isFeedbackModalOpen && (
          <AiLessonFeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            jlptLevel="N5"
          />
        )}

        {isSessionReportOpen && (
          <SessionReportOverlay
            isOpen={isSessionReportOpen}
            onClose={() => setIsSessionReportOpen(false)}
            onNavigateToPortal={() => {
              setIsSessionReportOpen(false);
              onNavigate('portal');
            }}
            onRetake={() => {
              setIsSessionReportOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data={{
              title: lesson.title,
              category: 'JLPT N5 Minna no Nihongo',
              durationSeconds: Math.max(60, Math.round((Date.now() - sessionStartTime) / 1000)),
              vocabCount: lesson.vocabulary?.length || 0,
              kanjiCount: lesson.kanji?.length || 0,
              grammarPoints: lesson.grammar?.length || 0,
              accuracyScore: 92,
              xpEarned: lesson.xpReward || 50,
              jlptLevel: 'N5',
              proficiencyGainPercent: 2.5
            }}
          />
        )}

        <LessonQuickNotes
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
          lessonId={lesson.id}
          lessonTitle={lesson.title}
        />

        <ZenBreathingPrompt
          isOpen={isZenBreathingOpen}
          onClose={() => setIsZenBreathingOpen(false)}
        />

        {selectedKanjiForStrokeAnim && (
          <KanjiStrokeAnimator
            kanji={selectedKanjiForStrokeAnim.character}
            fallbackData={{
              meaningEnglish: selectedKanjiForStrokeAnim.meaning
            }}
            onClose={() => setSelectedKanjiForStrokeAnim(null)}
          />
        )}

        {speakingTarget && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Speech Practice</span>
                <button
                  onClick={() => setSpeakingTarget(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SpeechPracticeWidget
                targetPhrase={speakingTarget.phrase}
                romaji={speakingTarget.romaji}
                english={speakingTarget.english}
                onSuccess={() => {
                  soundEffects.playCorrectPing();
                  setTimeout(() => setSpeakingTarget(null), 2000);
                }}
              />
            </div>
          </div>
        )}

        {/* Toasts */}
        {resumedToast && (
          <div className="fixed bottom-6 right-6 z-40 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-medium border border-stone-700 animate-fade-in">
            {resumedToast}
          </div>
        )}

        {downloadSuccessToast && (
          <div className="fixed bottom-6 left-6 z-40 bg-emerald-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-medium border border-emerald-700 animate-fade-in">
            {downloadSuccessToast}
          </div>
        )}

      </div>
    </div>
  );
};
export default LessonView;