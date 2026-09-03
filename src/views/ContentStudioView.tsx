import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BookOpen,
  Eye,
  Send,
  RefreshCw,
  Plus,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Volume2,
  Mic,
  PenTool,
  Brain,
  Award,
  Hash,
  Database,
  Search,
  Filter,
  BarChart2,
  ChevronRight,
  ExternalLink,
  Lock,
  Download,
  Flame,
  FileCode,
  FilePlus,
  Sliders,
  X,
  Clock,
  ListOrdered,
  Play,
  Calendar,
  RotateCcw
} from 'lucide-react';
import {
  StudioLesson,
  ContentStudioStats,
  LessonSourceFile,
  LessonCurriculumMap,
  StudioQAReport,
  SupportedSourceFileType
} from '../core/content-studio/types';
import { JLPTLevel } from '../types/nihomi';
import { ContentDesignSystem } from '../core/content-engine/contentDesignSystem';

interface ContentStudioViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<ContentStudioStats | null>(null);
  const [lessons, setLessons] = useState<StudioLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<StudioLesson | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [activeSectionTab, setActiveSectionTab] = useState<string>('introduction');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStepMessage, setProcessStepMessage] = useState<string>('');
  const [showNewLessonModal, setShowNewLessonModal] = useState<boolean>(false);
  const [showStudentPreviewModal, setShowStudentPreviewModal] = useState<boolean>(false);

  // Publishing Queue State (P1-03)
  const [showPublishingQueueModal, setShowPublishingQueueModal] = useState<boolean>(false);
  const [publishingQueue, setPublishingQueue] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<{ queued: number; scheduledCount: number; completed: number; failed: number; total: number } | null>(null);
  const [isQueueLoading, setIsQueueLoading] = useState<boolean>(false);
  const [showEnqueueModal, setShowEnqueueModal] = useState<boolean>(false);
  const [enqueueTargetLesson, setEnqueueTargetLesson] = useState<StudioLesson | null>(null);
  const [enqueuePriority, setEnqueuePriority] = useState<'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'>('NORMAL');
  const [enqueueScheduledDate, setEnqueueScheduledDate] = useState<string>('');
  const [enqueueChangelog, setEnqueueChangelog] = useState<string>('');
  const [preflightModalReport, setPreflightModalReport] = useState<any | null>(null);
  const [showPreflightModal, setShowPreflightModal] = useState<boolean>(false);

  // Wizard state for new lesson ingestion
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardLevel, setWizardLevel] = useState<JLPTLevel>('N5');
  const [wizardLessonNumber, setWizardLessonNumber] = useState<number>(2);
  const [wizardTitle, setWizardTitle] = useState<string>('Demonstratives (kore/sore/are) & Belonging');
  const [wizardTitleJa, setWizardTitleJa] = useState<string>('これ・それ・あれ と 助詞「の」');
  const [wizardTitleBn, setWizardTitleBn] = useState<string>('নির্দেশক সর্বনাম ও অধিকারবাচক মার্কার の');
  const [wizardTheme, setWizardTheme] = useState<string>('Shopping and Identifying Objects in Tokyo');
  const [wizardRawSources, setWizardRawSources] = useState<Array<{ name: string; type: SupportedSourceFileType; text: string }>>([
    {
      name: 'Minna_No_Nihongo_Lesson_02.txt',
      type: 'TXT',
      text: '第2課：これは 本です。それは わたしの 傘です。あれは 誰の カバンですか。この本は 日本語の本です。...'
    }
  ]);
  const [activeWizardLesson, setActiveWizardLesson] = useState<StudioLesson | null>(null);

  const fetchStudioData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await fetch('/api/content-studio/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      const lessonsRes = await fetch('/api/content-studio/lessons');
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData.lessons || []);
        if (!selectedLesson && lessonsData.lessons?.length > 0) {
          setSelectedLesson(lessonsData.lessons[0]);
        } else if (selectedLesson) {
          const fresh = lessonsData.lessons.find((l: StudioLesson) => l.id === selectedLesson.id);
          if (fresh) setSelectedLesson(fresh);
        }
      }

      // Fetch queue stats
      const qStatsRes = await fetch('/api/content-studio/publishing-queue/stats');
      if (qStatsRes.ok) {
        const qData = await qStatsRes.json();
        setQueueStats(qData.stats);
      }
    } catch (err) {
      console.error('Error fetching Content Studio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPublishingQueueData = async () => {
    setIsQueueLoading(true);
    try {
      const [queueRes, statsRes] = await Promise.all([
        fetch('/api/content-studio/publishing-queue'),
        fetch('/api/content-studio/publishing-queue/stats')
      ]);
      if (queueRes.ok) {
        const qData = await queueRes.json();
        setPublishingQueue(qData.queue || []);
      }
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setQueueStats(sData.stats);
      }
    } catch (err) {
      console.error('Failed to load publishing queue:', err);
    } finally {
      setIsQueueLoading(false);
    }
  };

  const handleOpenPublishingQueue = () => {
    setShowPublishingQueueModal(true);
    fetchPublishingQueueData();
  };

  const handleOpenEnqueueDialog = (lesson: StudioLesson) => {
    setEnqueueTargetLesson(lesson);
    setEnqueuePriority('NORMAL');
    setEnqueueScheduledDate('');
    setEnqueueChangelog(`Live publication release for ${lesson.title}`);
    setShowEnqueueModal(true);
  };

  const handleConfirmEnqueue = async () => {
    if (!enqueueTargetLesson) return;
    setIsProcessing(true);
    setProcessStepMessage(`Enqueuing "${enqueueTargetLesson.title}" into live publishing queue...`);
    try {
      const res = await fetch('/api/content-studio/publishing-queue/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: enqueueTargetLesson.id,
          priority: enqueuePriority,
          scheduledFor: enqueueScheduledDate ? new Date(enqueueScheduledDate).toISOString() : undefined,
          changelog: enqueueChangelog
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Failed to enqueue: ${data.error || 'Unknown error'}`);
        return;
      }
      setShowEnqueueModal(false);
      fetchStudioData();
      fetchPublishingQueueData();
      setShowPublishingQueueModal(true);
    } catch (err: any) {
      alert(`Error enqueuing: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelQueueJob = async (jobId: string) => {
    if (!confirm('Cancel this queued publishing job?')) return;
    try {
      const res = await fetch(`/api/content-studio/publishing-queue/${jobId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to cancel job');
        return;
      }
      fetchPublishingQueueData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRetryQueueJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/content-studio/publishing-queue/${jobId}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to retry job');
        return;
      }
      fetchPublishingQueueData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleProcessNextInQueue = async () => {
    setIsProcessing(true);
    setProcessStepMessage('Triggering queue worker to process next ready item...');
    try {
      const res = await fetch('/api/content-studio/publishing-queue/process-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.result?.processed) {
        alert('Next ready item processed successfully!');
      } else {
        alert('No ready queued items to process at this time.');
      }
      fetchStudioData();
      fetchPublishingQueueData();
    } catch (err: any) {
      alert(`Failed to process: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInspectPreflight = async (lessonId: string) => {
    try {
      const res = await fetch(`/api/content-studio/drafts/${lessonId}/preflight`);
      if (res.ok) {
        const data = await res.json();
        setPreflightModalReport(data.report);
        setShowPreflightModal(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to generate pre-flight report');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchStudioData();
  }, []);

  const handleStartWizard = () => {
    setWizardStep(1);
    setActiveWizardLesson(null);
    setShowNewLessonModal(true);
  };

  const handleCreateDraft = async () => {
    setIsProcessing(true);
    setProcessStepMessage('Creating Studio Lesson Draft...');
    try {
      const payload = {
        level: wizardLevel,
        lessonNumber: Number(wizardLessonNumber),
        title: wizardTitle,
        titleJa: wizardTitleJa,
        titleBn: wizardTitleBn,
        theme: wizardTheme,
        courseId: `jlpt-${wizardLevel.toLowerCase()}-mastery`
      };

      const res = await fetch('/api/content-studio/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.lesson) {
        setActiveWizardLesson(data.lesson);
        // Add default source
        if (wizardRawSources.length > 0) {
          await fetch(`/api/content-studio/lessons/${data.lesson.id}/sources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: wizardRawSources[0].name,
              fileType: wizardRawSources[0].type,
              rawText: wizardRawSources[0].text
            })
          });
        }
        setWizardStep(2);
      }
    } catch (err) {
      console.error('Failed to create draft:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractCurriculumMap = async () => {
    if (!activeWizardLesson) return;
    setIsProcessing(true);
    setProcessStepMessage('AI Parsing Sources & Building Stable Curriculum Map (N5-L02-G001...)...');
    try {
      const res = await fetch(`/api/content-studio/lessons/${activeWizardLesson.id}/analyze-sources`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.lesson) {
        setActiveWizardLesson(data.lesson);
        setWizardStep(3);
      }
    } catch (err) {
      console.error('Failed to extract curriculum map:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate14Sections = async () => {
    if (!activeWizardLesson) return;
    setIsProcessing(true);
    setProcessStepMessage('Synthesizing 14 Pedagogical Sections (Dialogue, Grammar, QA Pass)...');
    try {
      const res = await fetch(`/api/content-studio/lessons/${activeWizardLesson.id}/generate`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.lesson) {
        setActiveWizardLesson(data.lesson);
        setSelectedLesson(data.lesson);
        setWizardStep(4);
        fetchStudioData();
      }
    } catch (err) {
      console.error('Failed to generate 14 sections:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishLesson = async (lessonId: string) => {
    setIsProcessing(true);
    setProcessStepMessage('Executing 23-Point NIHOMI STANDARD™ QA Audit & Publishing...');
    try {
      const res = await fetch(`/api/content-studio/lessons/${lessonId}/publish`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.lesson) {
        setSelectedLesson(data.lesson);
        if (activeWizardLesson?.id === lessonId) {
          setActiveWizardLesson(data.lesson);
          setWizardStep(5);
        }
        fetchStudioData();
      } else if (data.error) {
        alert(`QA Failure: ${data.error}`);
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const levelMatch = selectedLevelFilter === 'ALL' || l.level === selectedLevelFilter;
    const statusMatch = selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter;
    return levelMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a12] text-slate-100 font-sans pb-24 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Master Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                <Brain className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  NIHOMI CONTENT STUDIO™ <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono">v1.0</span>
                </h1>
                <p className="text-sm text-slate-400">
                  Autonomous Curriculum Ingestion, 14-Section Content Engine & 23-Point NIHOMI STANDARD™ QA Gate
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('founder')}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-slate-300 border border-stone-700 text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Command Center
            </button>
            <button
              onClick={handleOpenPublishingQueue}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-xs"
              title="Open Live Lesson Publishing Queue"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Publishing Queue</span>
              {queueStats && queueStats.queued > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black">
                  {queueStats.queued}
                </span>
              )}
            </button>
            <button
              onClick={fetchStudioData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-slate-300 border border-stone-700 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleStartWizard}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Ingest New Lesson
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
              <span className="text-xs text-slate-400 font-medium">Published Lessons</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{stats.publishedLessonsCount} / {stats.totalLessons}</p>
              <span className="text-[11px] text-slate-500">Live in Student App</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
              <span className="text-xs text-slate-400 font-medium">Total Vocabulary</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{stats.totalVocabularyCount}</p>
              <span className="text-[11px] text-slate-500">Trilingual + Furigana</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
              <span className="text-xs text-slate-400 font-medium">Grammar Mastery Points</span>
              <p className="text-2xl font-black text-blue-400 mt-1">{stats.totalGrammarCount}</p>
              <span className="text-[11px] text-slate-500">Bengali Formulas & Rules</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
              <span className="text-xs text-slate-400 font-medium">Kanji Radicals</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{stats.totalKanjiCount}</p>
              <span className="text-[11px] text-slate-500">Stroke Order & Onyomi</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
              <span className="text-xs text-slate-400 font-medium">Interactive Exercises</span>
              <p className="text-2xl font-black text-pink-400 mt-1">{stats.totalExerciseCount + stats.totalQuizQuestionCount}</p>
              <span className="text-[11px] text-slate-500">MCQ & Scrambles</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80">
              <span className="text-xs text-slate-400 font-medium">Overall Health Score</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{stats.overallHealthScorePercent}%</p>
              <span className="text-[11px] text-slate-500">23-Point QA Compliant</span>
            </div>
          </div>
        )}

        {/* Level Readiness Breakdown Badges */}
        {stats && (
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" /> JLPT Level Readiness Matrix:
            </span>
            <div className="flex flex-wrap gap-2">
              {stats.levelBreakdown.map((lb) => (
                <div
                  key={lb.level}
                  className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-2 text-xs"
                >
                  <span className="font-bold text-red-400">{lb.level}</span>
                  <span className="text-slate-400">{lb.publishedCount}/{lb.totalTargetLessons} Lessons</span>
                  <span className="font-mono text-emerald-400">({lb.readinessScore}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Workspace (Left Column: Lesson List & Filters, Right Column: 14-Section Deep-Dive Inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Lesson Directory & Filters */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" /> Lesson Repository
                </h3>
                <span className="text-xs text-slate-400 font-mono">{filteredLessons.length} items</span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedLevelFilter}
                  onChange={(e) => setSelectedLevelFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-800 text-xs text-slate-300 rounded-xl px-2.5 py-2"
                >
                  <option value="ALL">All Levels</option>
                  <option value="N5">JLPT N5</option>
                  <option value="N4">JLPT N4</option>
                  <option value="N3">JLPT N3</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-800 text-xs text-slate-300 rounded-xl px-2.5 py-2"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="AI_GENERATED">AI Generated</option>
                  <option value="NEEDS_REVIEW">Needs Review</option>
                </select>
              </div>

              {/* Lesson List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredLessons.map((l) => {
                  const isSelected = selectedLesson?.id === l.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLesson(l)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                        isSelected
                          ? 'bg-red-950/30 border-red-500/50 shadow-md'
                          : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-red-400 font-bold text-[10px]">
                            {l.level} • L{l.lessonNumber}
                          </span>
                          <span className="text-xs font-bold text-white line-clamp-1">{l.titleJa}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            l.status === 'PUBLISHED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                              : l.status === 'DRAFT'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                              : 'bg-blue-950 text-blue-400 border border-blue-800/60'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{l.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{l.titleBn}</p>
                      <div className="mt-2 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{l.vocabulary?.length || 0} Vocab • {l.grammar?.length || 0} Grammar</span>
                        {l.qaReport && (
                          <span className="flex items-center gap-1 font-mono text-emerald-400">
                            <ShieldCheck className="w-3 h-3" /> QA {l.qaReport.score}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 14-Section Deep-Dive Inspector */}
          <div className="lg:col-span-8 space-y-4">
            {selectedLesson ? (
              <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
                {/* Lesson Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                        {selectedLesson.level} • Lesson {selectedLesson.lessonNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {selectedLesson.id}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedLesson.titleJa} — {selectedLesson.title}</h2>
                    <p className="text-xs text-slate-400">{selectedLesson.titleBn}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleInspectPreflight(selectedLesson.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="Inspect 8-Point Pre-flight Curriculum Readiness"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Pre-flight
                    </button>
                    <button
                      onClick={() => setShowStudentPreviewModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Student Preview
                    </button>
                    <button
                      onClick={() => handleOpenEnqueueDialog(selectedLesson)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      title="Add lesson to background publishing queue"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Queue Publish
                    </button>
                    {selectedLesson.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublishLesson(selectedLesson.id)}
                        disabled={isProcessing}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Direct Publish
                      </button>
                    )}
                  </div>
                </div>

                {/* 14-Section Navigation Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-stone-800/80 scrollbar-none text-xs">
                  {[
                    { id: 'introduction', label: '1. Intro' },
                    { id: 'vocabulary', label: `2. Vocab (${selectedLesson.vocabulary?.length || 0})` },
                    { id: 'grammar', label: `3. Grammar (${selectedLesson.grammar?.length || 0})` },
                    { id: 'kanji', label: `4. Kanji (${selectedLesson.kanji?.length || 0})` },
                    { id: 'expressions', label: '5. Expressions' },
                    { id: 'patterns', label: '6. Patterns' },
                    { id: 'dialogue', label: '7. Dialogue' },
                    { id: 'reading', label: '8. Reading' },
                    { id: 'listening', label: '9. Listening' },
                    { id: 'speaking', label: '10. Speaking' },
                    { id: 'writing', label: '11. Writing' },
                    { id: 'exercises', label: '12. Exercises' },
                    { id: 'quiz', label: '13. Quiz' },
                    { id: 'assessment', label: '14. Assessment & QA' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSectionTab(tab.id)}
                      className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSectionTab === tab.id
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-stone-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content Display */}
                <div className="min-h-[350px]">
                  {/* Tab 1: Introduction */}
                  {activeSectionTab === 'introduction' && selectedLesson.introduction && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Can-Do Pedagogical Objectives</h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                          {selectedLesson.introduction.canDoObjectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Bengali Pedagogical Overview</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{selectedLesson.introduction.overviewBn}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tokyo Cultural Etiquette</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{selectedLesson.introduction.culturalNoteBn}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Vocabulary */}
                  {activeSectionTab === 'vocabulary' && (
                    <div className="space-y-3">
                      {selectedLesson.vocabulary?.map((v) => (
                        <div key={v.id} className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-white">{v.japanese}</span>
                              <span className="text-xs text-red-400 font-mono">[{v.romaji}]</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-slate-400">{v.partOfSpeech}</span>
                            </div>
                            <p className="text-xs text-slate-300"><strong className="text-emerald-400">বাংলা:</strong> {v.bengali} • <strong className="text-blue-400">EN:</strong> {v.english}</p>
                            {v.exampleSentenceJa && (
                              <p className="text-xs text-slate-400 italic">প্রয়োগ: {v.exampleSentenceJa} ({v.exampleSentenceBn})</p>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{v.id}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Grammar */}
                  {activeSectionTab === 'grammar' && (
                    <div className="space-y-4">
                      {selectedLesson.grammar?.map((g) => (
                        <div key={g.id} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-red-400">{g.pattern}</span>
                              <span className="text-xs text-slate-400 font-mono">Formula: {g.structureFormula}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">{g.id}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{g.detailedExplanationBn}</p>
                          
                          {g.commonMistakesBn?.length > 0 && (
                            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-300">
                              <strong>কমন ভুলসমূহ:</strong>
                              <ul className="list-disc list-inside mt-1 space-y-0.5">
                                {g.commonMistakesBn.map((m, i) => <li key={i}>{m}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 7: Dialogue */}
                  {activeSectionTab === 'dialogue' && selectedLesson.dialogue && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{selectedLesson.dialogue.scenarioTitleBn}</span>
                        <span className="text-xs text-slate-400">Location: {selectedLesson.dialogue.location}</span>
                      </div>

                      <div className="space-y-3">
                        {selectedLesson.dialogue.lines.map((line, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-red-400">{line.speaker} ({line.speakerRole})</span>
                            </div>
                            <p className="text-sm text-white font-medium">{line.japanese}</p>
                            <p className="text-xs text-slate-400">{line.romaji}</p>
                            <p className="text-xs text-emerald-400 font-medium">{line.bengali}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 14: Assessment & QA */}
                  {activeSectionTab === 'assessment' && (
                    <div className="space-y-6">
                      {selectedLesson.qaReport && (
                        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-5 h-5 text-emerald-400" />
                              <h4 className="text-sm font-bold text-white">23-Point NIHOMI STANDARD™ QA Audit</h4>
                            </div>
                            <span className="text-sm font-mono font-bold text-emerald-400">Score: {selectedLesson.qaReport.score}% (PASS)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedLesson.qaReport.checks.map((chk) => (
                              <div key={chk.checkId} className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800 flex items-center justify-between text-xs">
                                <span className="text-slate-300 truncate max-w-[220px]">{chk.name}</span>
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                  {chk.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedLesson.aiTutorContext && (
                        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Sensei Context & Guardrail Prompt</h4>
                          <p className="text-xs text-slate-300 font-mono bg-stone-900 p-3 rounded-lg border border-stone-800">
                            {selectedLesson.aiTutorContext.pedagogicalPersonaPrompt}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-stone-900/40 border border-stone-800 text-center space-y-3">
                <Brain className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">Select a lesson from the left directory to inspect its 14 pedagogical modules.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal: 5-Step New Lesson Ingestion Wizard */}
        {showNewLessonModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                    <Plus className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Ingest New Lesson (5-Step AI Pipeline)</h3>
                    <p className="text-xs text-slate-400">Source ➔ AI Extract ➔ Curriculum Map ➔ 14-Section Synthesis ➔ QA & Publish</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewLessonModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Wizard Step 1: Metadata */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Target JLPT Level</label>
                      <select
                        value={wizardLevel}
                        onChange={(e) => setWizardLevel(e.target.value as JLPTLevel)}
                        className="w-full bg-stone-950 border border-stone-800 text-sm text-white rounded-xl px-3 py-2.5"
                      >
                        <option value="N5">JLPT N5 (Foundational)</option>
                        <option value="N4">JLPT N4 (Elementary)</option>
                        <option value="N3">JLPT N3 (Intermediate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Lesson Number</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={wizardLessonNumber}
                        onChange={(e) => setWizardLessonNumber(Number(e.target.value))}
                        className="w-full bg-stone-950 border border-stone-800 text-sm text-white rounded-xl px-3 py-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Lesson Title (English)</label>
                    <input
                      type="text"
                      value={wizardTitle}
                      onChange={(e) => setWizardTitle(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 text-sm text-white rounded-xl px-3 py-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Japanese Title</label>
                      <input
                        type="text"
                        value={wizardTitleJa}
                        onChange={(e) => setWizardTitleJa(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 text-sm text-white rounded-xl px-3 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Bengali Title</label>
                      <input
                        type="text"
                        value={wizardTitleBn}
                        onChange={(e) => setWizardTitleBn(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 text-sm text-white rounded-xl px-3 py-2.5"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateDraft}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Next: Upload Sources & Create Draft
                  </button>
                </div>
              )}

              {/* Wizard Step 2: Upload Sources */}
              {wizardStep === 2 && activeWizardLesson && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                    <span className="text-xs font-bold text-red-400 uppercase">Attached Source Materials</span>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-stone-900 text-xs">
                      <span className="flex items-center gap-2 text-white">
                        <FileText className="w-4 h-4 text-slate-400" /> {wizardRawSources[0]?.name}
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px]">Extracted & SHA-256 Verified</span>
                    </div>
                  </div>

                  <button
                    onClick={handleExtractCurriculumMap}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    AI Source Analysis & Curriculum Mapping
                  </button>
                </div>
              )}

              {/* Wizard Step 3: Curriculum Map Confirmed */}
              {wizardStep === 3 && activeWizardLesson?.curriculumMap && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Curriculum Map Generated (Stable IDs)</span>
                    <div className="space-y-1.5 text-xs text-slate-300 max-h-48 overflow-y-auto">
                      {activeWizardLesson.curriculumMap.grammarPoints.map((g) => (
                        <div key={g.id} className="flex items-center justify-between p-2 rounded bg-stone-900">
                          <span>{g.title} ({g.titleJa})</span>
                          <span className="font-mono text-[10px] text-red-400">{g.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate14Sections}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Synthesize All 14 Pedagogical Sections
                  </button>
                </div>
              )}

              {/* Wizard Step 4: Ready for QA & Publish */}
              {wizardStep === 4 && activeWizardLesson && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">14 Sections Synthesized Successfully!</h4>
                    <p className="text-xs text-slate-400">All exercises, dialogues, audio transcripts, and QA checks are ready.</p>
                  </div>

                  <button
                    onClick={() => handlePublishLesson(activeWizardLesson.id)}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Run 23-Point QA & Publish to Live App
                  </button>
                </div>
              )}

              {/* Wizard Step 5: Finished */}
              {wizardStep === 5 && (
                <div className="space-y-4 text-center">
                  <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-2">
                    <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">Lesson Live on Nihomi.com!</h4>
                    <p className="text-xs text-slate-300">Students can now access this lesson in the Student Portal with full audio, quizzes, and AI tutor support.</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowNewLessonModal(false);
                      fetchStudioData();
                    }}
                    className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Student Preview Modal */}
        {showStudentPreviewModal && selectedLesson && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF9F6] text-stone-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Student View Preview</span>
                  <h3 className="text-xl font-bold text-stone-900">{selectedLesson.titleJa} — {selectedLesson.title}</h3>
                </div>
                <button
                  onClick={() => setShowStudentPreviewModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Live Preview of Intro & Dialogue */}
              {selectedLesson.introduction && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <h4 className="text-sm font-bold text-red-600">Overview</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{selectedLesson.introduction.overviewBn}</p>
                </div>
              )}

              {selectedLesson.dialogue && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-red-600">Tokyo Dialogue Scenario</h4>
                  <div className="space-y-2">
                    {selectedLesson.dialogue.lines.map((line, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                        <span className="font-bold text-red-700">{line.speaker}: </span>
                        <span className="text-stone-900 font-medium">{line.japanese}</span>
                        <p className="text-stone-500 mt-0.5">{line.bengali}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* P1-03: LIVE LESSON PUBLISHING QUEUE MODAL               */}
        {/* ======================================================== */}
        {showPublishingQueueModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Clock className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Live Lesson Publishing Queue
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-amber-500/30 font-mono">
                        P1-03 Autonomous Worker
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Background staging, automated pre-flight curriculum verification & atomic live catalog commits.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchPublishingQueueData}
                    disabled={isQueueLoading}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-300 transition cursor-pointer"
                    title="Refresh Queue"
                  >
                    <RefreshCw className={`w-4 h-4 ${isQueueLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleProcessNextInQueue}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    title="Force worker to process next ready queued job"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Process Next
                  </button>
                  <button
                    onClick={() => setShowPublishingQueueModal(false)}
                    className="w-8 h-8 rounded-full bg-stone-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Real-time Queue Depth Counters */}
              {queueStats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800">
                    <span className="text-[11px] text-slate-400 font-medium">Pending in Queue</span>
                    <p className="text-xl font-black text-amber-400 mt-0.5">{queueStats.queued}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800">
                    <span className="text-[11px] text-slate-400 font-medium">Scheduled Future</span>
                    <p className="text-xl font-black text-blue-400 mt-0.5">{queueStats.scheduledCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800">
                    <span className="text-[11px] text-slate-400 font-medium">Completed Live</span>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">{queueStats.completed}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800">
                    <span className="text-[11px] text-slate-400 font-medium">Failed / Cancelled</span>
                    <p className="text-xl font-black text-rose-400 mt-0.5">{queueStats.failed}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800">
                    <span className="text-[11px] text-slate-400 font-medium">Total Lifetime Jobs</span>
                    <p className="text-xl font-black text-slate-200 mt-0.5">{queueStats.total}</p>
                  </div>
                </div>
              )}

              {/* Queue Items Table / List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {publishingQueue.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-stone-950/50 rounded-2xl border border-dashed border-stone-800">
                    <Clock className="w-10 h-10 text-stone-600 mx-auto" />
                    <p className="text-sm text-slate-400">Publishing queue is currently empty.</p>
                    <p className="text-xs text-stone-600">Select any lesson draft and click "Queue Publish" to stage an automated release.</p>
                  </div>
                ) : (
                  publishingQueue.map((item) => {
                    const isQueued = item.status === 'queued';
                    const isProcessingStatus = ['validating', 'snapshotting', 'publishing'].includes(item.status);
                    const isCompleted = item.status === 'completed';
                    const isFailed = item.status === 'failed';
                    const isCancelled = item.status === 'cancelled';

                    const priorityBg =
                      item.priority === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : item.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : item.priority === 'NORMAL'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-stone-800 text-slate-400 border-stone-700';

                    const statusPill = isCompleted ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        COMPLETED
                      </span>
                    ) : isProcessingStatus ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                        {item.currentStage || 'PROCESSING'}
                      </span>
                    ) : isQueued ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                        QUEUED
                      </span>
                    ) : isFailed ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                        FAILED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700 text-[10px] font-bold">
                        CANCELLED
                      </span>
                    );

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-stone-700/80 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${priorityBg}`}>
                                {item.priority}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-red-400 font-bold text-[10px]">
                                {item.level}
                              </span>
                              {statusPill}
                              <span className="text-xs text-stone-500 font-mono">Job: {item.id}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white">
                              {item.titleJa ? `${item.titleJa} — ` : ''}
                              {item.title}
                            </h4>
                            <p className="text-xs text-stone-400">{item.changelog}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.preflightReport && (
                              <button
                                onClick={() => {
                                  setPreflightModalReport(item.preflightReport);
                                  setShowPreflightModal(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                              >
                                Pre-flight: {item.preflightReport.score}/100
                              </button>
                            )}
                            {(isQueued || isProcessingStatus) && (
                              <button
                                onClick={() => handleCancelQueueJob(item.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-medium transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                            {(isFailed || isCancelled) && (
                              <button
                                onClick={() => handleRetryQueueJob(item.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" /> Retry
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar & Stage Indicator */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>Stage: {item.currentStage || 'PENDING'}</span>
                            <span>{item.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-emerald-500'
                                  : isFailed
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${item.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Scheduled Time or Target IDs */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-900">
                          <div>
                            {item.scheduledFor ? (
                              <span className="text-blue-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Scheduled for: {new Date(item.scheduledFor).toLocaleString()}
                              </span>
                            ) : (
                              <span>Immediate Automated Release</span>
                            )}
                          </div>
                          <div>
                            {item.publishedLessonId && (
                              <span className="text-emerald-400 font-mono">
                                Live ID: {item.publishedLessonId} (v{item.versionNumber || 1})
                              </span>
                            )}
                            {item.error && <span className="text-rose-400 line-clamp-1">{item.error}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* P1-03: ENQUEUE FOR LIVE PUBLISHING DIALOG                */}
        {/* ======================================================== */}
        {showEnqueueModal && enqueueTargetLesson && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Queue Live Lesson Publishing</h3>
                    <p className="text-xs text-slate-400">Target: {enqueueTargetLesson.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEnqueueModal(false)}
                  className="w-7 h-7 rounded-full bg-stone-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Options */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Publishing Priority</label>
                  <select
                    value={enqueuePriority}
                    onChange={(e: any) => setEnqueuePriority(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white font-medium focus:border-amber-500 outline-none"
                  >
                    <option value="CRITICAL">CRITICAL (P0 Hotfix / Urgent Curriculum Correction)</option>
                    <option value="HIGH">HIGH (JLPT Syllabus Milestone Release)</option>
                    <option value="NORMAL">NORMAL (Standard Automated Production Flow)</option>
                    <option value="LOW">LOW (Backlog Archive / Optional Supplementary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Deferred Release Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={enqueueScheduledDate}
                    onChange={(e) => setEnqueueScheduledDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white font-medium focus:border-amber-500 outline-none"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">Leave blank for immediate automated processing.</p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Version Release Changelog</label>
                  <textarea
                    value={enqueueChangelog}
                    onChange={(e) => setEnqueueChangelog(e.target.value)}
                    rows={3}
                    placeholder="Describe educational or technical improvements in this release..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-white font-medium focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  onClick={() => setShowEnqueueModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEnqueue}
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" /> Enqueue Lesson
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* P1-03: PRE-FLIGHT CURRICULUM VERIFICATION REPORT MODAL   */}
        {/* ======================================================== */}
        {showPreflightModal && preflightModalReport && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">8-Point Pre-flight Curriculum Report</h3>
                    <p className="text-xs text-slate-400">Evaluated at: {new Date(preflightModalReport.evaluatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreflightModal(false)}
                  className="w-7 h-7 rounded-full bg-stone-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Overall Score Badge */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Pre-flight Readiness Score</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-white">{preflightModalReport.score}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>
                <div>
                  {preflightModalReport.passed ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                      PASSED (READY FOR LIVE PUBLISHING)
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black">
                      REJECTED ({preflightModalReport.errorsCount} CRITICAL FAILURES)
                    </span>
                  )}
                </div>
              </div>

              {/* Checklist Breakdown */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                {preflightModalReport.checks?.map((check: any, idx: number) => {
                  const isPass = check.status === 'PASS';
                  const isWarn = check.status === 'WARN';
                  const isFail = check.status === 'FAIL';

                  const badgeClass = isPass
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : isWarn
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-stone-800 text-slate-400 font-mono text-[10px]">
                            {check.category}
                          </span>
                          <span className="font-bold text-white">{check.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeClass}`}>
                          {check.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{check.message}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3 border-t border-stone-800">
                <button
                  onClick={() => setShowPreflightModal(false)}
                  className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
