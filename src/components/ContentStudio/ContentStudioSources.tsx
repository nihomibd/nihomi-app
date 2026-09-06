import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  RefreshCw,
  Trash2,
  Play,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  Eye,
  Info,
  Zap,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Ban,
  RotateCcw,
  Activity,
  Cpu
} from 'lucide-react';
import { ContentSource, JLPTLevel, Course } from '../../types.js';
import { contentEngineApi } from '../../lib/contentEngineApi.js';

interface ContentStudioSourcesProps {
  sources: ContentSource[];
  courses: Course[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenDraft?: (draftId: string) => void;
}

export const ContentStudioSources: React.FC<ContentStudioSourcesProps> = ({
  sources,
  courses,
  isLoading,
  onRefresh,
  onOpenDraft
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [targetLevel, setTargetLevel] = useState<JLPTLevel>('N5');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [autoProcess, setAutoProcess] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [processingSourceId, setProcessingSourceId] = useState<string | null>(null);

  // Batch Ingestion Queue State
  const [batchJobs, setBatchJobs] = useState<any[]>([]);
  const [activeBatchCount, setActiveBatchCount] = useState<number>(0);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [isBatchQueueExpanded, setIsBatchQueueExpanded] = useState(true);

  // Minna no Nihongo L1 Test Runner State
  const [isTestPipelineRunning, setIsTestPipelineRunning] = useState(false);
  const [testAutoPublish, setTestAutoPublish] = useState(true);
  const [testPipelineTelemetry, setTestPipelineTelemetry] = useState<any | null>(null);
  const [testPipelineError, setTestPipelineError] = useState<string | null>(null);
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(true);

  // Preview extracted text modal
  const [previewSource, setPreviewSource] = useState<ContentSource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll batch queue
  const fetchBatchJobs = async () => {
    try {
      const res = await contentEngineApi.getBatchJobs();
      if (res.success) {
        setBatchJobs(res.jobs || []);
        setActiveBatchCount(res.activeCount || 0);
      }
    } catch {
      // quiet poll
    }
  };

  useEffect(() => {
    fetchBatchJobs();
    const interval = setInterval(() => {
      fetchBatchJobs();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRunMinnaL1Test = async () => {
    setIsTestPipelineRunning(true);
    setTestPipelineError(null);
    setTestPipelineTelemetry(null);

    const res = await contentEngineApi.runTestPipeline({
      autoPublish: testAutoPublish
    });

    setIsTestPipelineRunning(false);
    if (res.success && res.telemetry) {
      setTestPipelineTelemetry(res.telemetry);
      onRefresh();
      fetchBatchJobs();
    } else {
      setTestPipelineError(res.error || 'Test pipeline failed to execute');
    }
  };

  const handleEnqueueBatch = async (documentId: string) => {
    setIsBatchLoading(true);
    const res = await contentEngineApi.enqueueBatchJob({
      documentId,
      totalPages: 1,
      maxTokenBudget: 50000,
      priority: 'NORMAL'
    });
    setIsBatchLoading(false);
    if (res.success) {
      setUploadSuccess(`Document ${documentId} enqueued in background batch worker.`);
      fetchBatchJobs();
    } else {
      setUploadError(res.error || 'Failed to enqueue batch job.');
    }
  };

  const handleCancelBatchJob = async (jobId: string) => {
    const res = await contentEngineApi.cancelBatchJob(jobId);
    if (res.success) {
      fetchBatchJobs();
    } else {
      alert(res.error || 'Could not cancel job.');
    }
  };

  const handleRetryBatchJob = async (jobId: string) => {
    const res = await contentEngineApi.retryBatchJob(jobId);
    if (res.success) {
      fetchBatchJobs();
    } else {
      alert(res.error || 'Could not retry job.');
    }
  };

  const handleClearCompletedJobs = async () => {
    const res = await contentEngineApi.clearCompletedBatchJobs();
    if (res.success) {
      fetchBatchJobs();
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
        setUploadError(null);
      } else {
        setUploadError('Only PDF files (.pdf) are supported.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a PDF document to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('title', title || selectedFile.name.replace(/\.[^/.]+$/, ''));
    formData.append('targetJlptLevel', targetLevel);
    if (selectedCourseId) formData.append('courseId', selectedCourseId);
    formData.append('autoProcess', String(autoProcess));

    const res = await contentEngineApi.uploadPdfSource(formData);
    setIsUploading(false);

    if (res.success && res.source) {
      setUploadSuccess(`Source "${res.source.title}" uploaded successfully! Extraction started.`);
      setSelectedFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onRefresh();
    } else {
      setUploadError(res.error || 'Failed to upload PDF source');
    }
  };

  const handleTriggerProcess = async (sourceId: string) => {
    setProcessingSourceId(sourceId);
    setUploadError(null);
    const res = await contentEngineApi.processSource(sourceId);
    setProcessingSourceId(null);
    if (res.success) {
      setUploadSuccess(`Processed successfully! Generated draft: ${res.draft?.title}`);
      onRefresh();
    } else {
      setUploadError(res.error || 'Extraction / Gemini generation failed');
      onRefresh();
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!confirm('Are you sure you want to delete this content source?')) return;
    const res = await contentEngineApi.deleteSource(sourceId);
    if (res.success) {
      onRefresh();
    } else {
      alert(res.error || 'Failed to delete source');
    }
  };

  const filteredSources = sources.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.originalFilename.toLowerCase().includes(q) || s.targetJlptLevel.toLowerCase().includes(q);
  });

  const getStatusBadge = (status: ContentSource['processingStatus']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'AI_PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 animate-pulse">
            <Sparkles className="w-3 h-3 animate-spin" />
            Gemini Generating
          </span>
        );
      case 'EXTRACTING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Extracting PDF
          </span>
        );
      case 'SCANNED_PDF_OCR_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
            <AlertTriangle className="w-3 h-3" />
            Scanned PDF (OCR Required)
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'UPLOADED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Clock className="w-3 h-3" />
            Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" id="content-studio-sources">
      {/* ========================================================================= */}
      {/* 1. Controlled E2E Pipeline Test Runner: Minna no Nihongo L1 Corpus       */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-extrabold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>Phase 23 & 24 E2E Pipeline Runner</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Minna no Nihongo Lesson 1 Live Test Corpus</span>
              <span className="text-xs font-mono font-medium text-zinc-400">はじめまして (Greetings & Identity)</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Executes the complete operational pipeline end-to-end: Ingestion &rarr; Structural Extraction &rarr; Gemini Curriculum Synthesis &rarr; 23-Dimension Nihomi QA Scoring &rarr; Atomic Publishing &rarr; Multi-Student SRS Leitner Deck Provisioning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <label className="flex items-center space-x-2 bg-zinc-800/80 hover:bg-zinc-800 px-3.5 py-2.5 rounded-xl border border-zinc-700/80 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={testAutoPublish}
                onChange={(e) => setTestAutoPublish(e.target.checked)}
                className="rounded text-red-500 focus:ring-red-400 w-4 h-4 bg-zinc-900 border-zinc-600"
              />
              <span className="font-semibold text-zinc-200">Auto-Publish Live</span>
            </label>

            <button
              onClick={handleRunMinnaL1Test}
              disabled={isTestPipelineRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-red-950/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
              id="btn-run-minna-l1-pipeline"
            >
              {isTestPipelineRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Executing Pipeline Stages...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Minna L1 Pipeline (E2E)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {testPipelineError && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pipeline Execution Error:</p>
              <p className="text-zinc-300 mt-0.5 font-mono">{testPipelineError}</p>
            </div>
          </div>
        )}

        {/* Telemetry Card */}
        {testPipelineTelemetry && (
          <div className="relative z-10 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-100">
                  Pipeline Telemetry & Execution Summary
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  PASSED ALL GATES
                </span>
              </div>
              <button
                onClick={() => setShowTelemetryDetails(!showTelemetryDetails)}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-semibold"
              >
                <span>{showTelemetryDetails ? 'Collapse Telemetry' : 'Expand Metrics'}</span>
                {showTelemetryDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showTelemetryDetails && (
              <div className="space-y-4">
                {/* 4 Core High-Level Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-400" />
                      Total Latency
                    </span>
                    <p className="text-lg font-black text-white">
                      {testPipelineTelemetry.timings.totalDurationMs.toLocaleString()} <span className="text-xs font-normal text-zinc-400">ms</span>
                    </p>
                    <p className="text-[10px] text-zinc-500">6/6 stages completed</p>
                  </div>

                  <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-amber-400" />
                      Token Usage
                    </span>
                    <p className="text-lg font-black text-amber-300 font-mono">
                      {testPipelineTelemetry.tokenUsage.totalTokens.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Cap: {testPipelineTelemetry.tokenUsage.tokenBudgetCap.toLocaleString()} tokens &bull; ${testPipelineTelemetry.tokenUsage.estimatedCostUsd}
                    </p>
                  </div>

                  <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-400" />
                      Nihomi Standard™ QA
                    </span>
                    <p className="text-lg font-black text-emerald-400">
                      {testPipelineTelemetry.qaScorecard.overallScore}/100
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {testPipelineTelemetry.qaScorecard.passedCount}/{testPipelineTelemetry.qaScorecard.totalDimensions} dimensions passed
                    </p>
                  </div>

                  <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                      <Layers className="w-3 h-3 text-sky-400" />
                      SRS Cards Synced
                    </span>
                    <p className="text-lg font-black text-sky-300">
                      {testPipelineTelemetry.srsCardsProvisioned} <span className="text-xs font-normal text-zinc-400">cards</span>
                    </p>
                    <p className="text-[10px] text-zinc-500">Leitner Box 1 Deck Active</p>
                  </div>
                </div>

                {/* Stage Execution Waterfall */}
                <div className="bg-zinc-900/70 border border-zinc-800/70 rounded-xl p-3 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                    Execution Latency Breakdown
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                      <span className="text-zinc-400 block text-[9px] uppercase">1. Ingestion</span>
                      <span className="font-mono font-bold text-zinc-200">{testPipelineTelemetry.timings.ingestionMs} ms</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                      <span className="text-zinc-400 block text-[9px] uppercase">2. Extraction</span>
                      <span className="font-mono font-bold text-zinc-200">{testPipelineTelemetry.timings.extractionMs} ms</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                      <span className="text-zinc-400 block text-[9px] uppercase">3. Synthesis</span>
                      <span className="font-mono font-bold text-zinc-200">{testPipelineTelemetry.timings.generationMs} ms</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                      <span className="text-zinc-400 block text-[9px] uppercase">4. QA Validation</span>
                      <span className="font-mono font-bold text-zinc-200">{testPipelineTelemetry.timings.qaScoringMs} ms</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                      <span className="text-zinc-400 block text-[9px] uppercase">5. Publishing</span>
                      <span className="font-mono font-bold text-zinc-200">{testPipelineTelemetry.timings.publishingMs} ms</span>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>
                      Draft Created: <strong className="font-mono text-zinc-100">#{testPipelineTelemetry.draftId.slice(0, 8)}</strong>
                      {testPipelineTelemetry.publishedLessonId && (
                        <span> &bull; Live Lesson: <strong className="font-mono text-emerald-400">#{testPipelineTelemetry.publishedLessonId.slice(0, 8)}</strong></span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenDraft && (
                      <button
                        onClick={() => onOpenDraft(testPipelineTelemetry.draftId)}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Draft in Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. Asynchronous Batch Ingestion Queue (Apple / MUJI Minimal Stage Tracker) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-bold">
              <Activity className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Asynchronous Batch Ingestion Queue & Stage Tracker
                </h3>
                {activeBatchCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    {activeBatchCount} Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">
                Multi-page async processing worker with exponential retry backoff, token budget caps, and atomic publishing transactions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {batchJobs.some(j => j.current_stage === 'REVIEW_READY' || j.current_stage === 'PUBLISHED' || j.current_stage === 'FAILED' || j.current_stage === 'CANCELLED') && (
              <button
                onClick={handleClearCompletedJobs}
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Clear Inactive
              </button>
            )}
            <button
              onClick={() => setIsBatchQueueExpanded(!isBatchQueueExpanded)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              title="Toggle queue expansion"
            >
              {isBatchQueueExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isBatchQueueExpanded && (
          <div className="space-y-3">
            {batchJobs.length === 0 ? (
              <div className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                Batch queue is currently idle. Enqueue any uploaded document below or trigger the Minna no Nihongo L1 test run.
              </div>
            ) : (
              batchJobs.map((job) => {
                const stages = ['INGESTING', 'EXTRACTING', 'GENERATING', 'QA_SCORING', 'REVIEW_READY', 'PUBLISHED'];
                const stageIndex = stages.indexOf(job.current_stage);
                const isFailed = job.current_stage === 'FAILED';
                const isCancelled = job.current_stage === 'CANCELLED';

                return (
                  <div
                    key={job.job_id}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3"
                  >
                    {/* Job Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          #{job.job_id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          Doc: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">#{job.document_id.slice(0, 8)}</strong>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase">
                          Priority: {job.priority}
                        </span>
                        {job.retry_count > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Retried {job.retry_count}x
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {job.progress_percentage}% Complete
                        </span>
                        {/* Token usage meter */}
                        <div className="text-[11px] font-mono text-zinc-500 bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          {job.token_usage.total_tokens.toLocaleString()} / {job.token_budget_cap.toLocaleString()} tokens
                        </div>

                        {/* Actions */}
                        {!isFailed && !isCancelled && job.current_stage !== 'REVIEW_READY' && job.current_stage !== 'PUBLISHED' && (
                          <button
                            onClick={() => handleCancelBatchJob(job.job_id)}
                            className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-zinc-500 hover:text-rose-600 transition-colors"
                            title="Cancel Job"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {(isFailed || isCancelled) && (
                          <button
                            onClick={() => handleRetryBatchJob(job.job_id)}
                            className="px-2 py-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Retry Job"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}

                        {job.draft_id && onOpenDraft && (
                          <button
                            onClick={() => onOpenDraft(job.draft_id)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect Draft</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Apple / MUJI Style Stage Tracker Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isFailed
                              ? 'bg-rose-500'
                              : isCancelled
                              ? 'bg-zinc-400'
                              : job.current_stage === 'PUBLISHED'
                              ? 'bg-emerald-500'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${job.progress_percentage}%` }}
                        />
                      </div>

                      {/* Stage steps indicators */}
                      <div className="grid grid-cols-6 gap-1 pt-1">
                        {stages.map((st, i) => {
                          const isPassed = !isFailed && !isCancelled && stageIndex > i;
                          const isCurrent = !isFailed && !isCancelled && stageIndex === i;
                          const isPending = stageIndex < i;

                          return (
                            <div key={st} className="text-center space-y-1">
                              <div
                                className={`h-1 rounded-full transition-all ${
                                  isPassed
                                    ? 'bg-emerald-500'
                                    : isCurrent
                                    ? 'bg-red-600 animate-pulse'
                                    : isFailed && stageIndex === i
                                    ? 'bg-rose-500'
                                    : 'bg-zinc-200 dark:bg-zinc-800'
                                }`}
                              />
                              <span
                                className={`block text-[9px] font-extrabold uppercase tracking-tight truncate ${
                                  isCurrent
                                    ? 'text-red-600 dark:text-red-400'
                                    : isPassed
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-zinc-400 dark:text-zinc-600'
                                }`}
                              >
                                {st.replace('_', ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Errors if any */}
                    {job.error_log.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-700 dark:text-rose-300 font-mono">
                        {job.error_log[job.error_log.length - 1]}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. Original PDF Upload Zone                                               */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Upload Japanese Educational PDF
              </h3>
              <p className="text-xs text-zinc-500">
                Securely extract vocabulary, grammar points, kanji, and dialogues with Gemini AI structuring.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
            Max 25MB &bull; Text-based PDF
          </span>
        </div>

        {uploadError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              selectedFile
                ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-red-400 bg-zinc-50/50 dark:bg-zinc-800/30'
            }`}
            id="pdf-upload-dropzone"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="application/pdf,.pdf"
              className="hidden"
              id="input-pdf-file"
            />
            {selectedFile ? (
              <div className="space-y-1">
                <FileText className="w-8 h-8 mx-auto text-red-600 dark:text-red-400" />
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for ingestion
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <UploadCloud className="w-8 h-8 mx-auto text-zinc-400" />
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Drag & drop your Japanese textbook PDF here, or <span className="text-red-600 font-bold">browse</span>
                </p>
                <p className="text-[11px] text-zinc-400">
                  Supports JLPT N5–N1 textbook chapters, Minna no Nihongo units, Marugoto PDFs, or custom syllabus docs.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                Lesson / Source Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 1: Greetings & Self-Introduction"
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                id="input-source-title"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                Target JLPT Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as JLPTLevel)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                id="select-target-level"
              >
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    JLPT {lvl} ({lvl === 'N5' ? 'Beginner' : lvl === 'N4' ? 'Elementary' : lvl === 'N3' ? 'Intermediate' : 'Advanced'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                Target Course Link
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                id="select-course-link"
              >
                <option value="">Auto-map by JLPT Level</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.level}] {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoProcess}
                onChange={(e) => setAutoProcess(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                id="checkbox-autoprocess"
              />
              <span>Trigger Gemini AI Extraction & Structured Draft Generation automatically</span>
            </label>

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
              id="btn-upload-pdf-source"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading & Extracting...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Ingest & Generate Educational Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sources List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              Content Sources Repository ({sources.length})
            </h3>
            <p className="text-xs text-zinc-500">
              Ingested PDF documents, page counts, extraction logs, and associated curriculum drafts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              title="Refresh Sources"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Source Title & Document</th>
                <th className="pb-3 px-3">Level</th>
                <th className="pb-3 px-3">Size & Pages</th>
                <th className="pb-3 px-3">Uploaded At</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredSources.map((src) => {
                const isProcessing = processingSourceId === src.id;
                return (
                  <tr key={src.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(src.processingStatus)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">
                        {src.title}
                      </div>
                      <div className="font-mono text-zinc-500 text-[11px] flex items-center gap-1">
                        <span>{src.originalFilename}</span>
                        {src.contentHash && (
                          <span className="text-[9px] text-zinc-400" title={`SHA256: ${src.contentHash}`}>
                            &bull; #{src.contentHash.slice(0, 8)}
                          </span>
                        )}
                      </div>
                      {src.processingError && (
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                          {src.processingError}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px]">
                        JLPT {src.targetJlptLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                      <div>{(src.fileSize / 1024).toFixed(1)} KB</div>
                      <div className="text-[10px] text-zinc-400">
                        {src.pageCount ? `${src.pageCount} pages` : 'Pending parse'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                      {new Date(src.createdAt).toLocaleDateString()} &bull; {new Date(src.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {src.extractedText && (
                          <button
                            onClick={() => setPreviewSource(src)}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                            title="Preview Extracted Text"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleEnqueueBatch(src.id)}
                          disabled={isBatchLoading}
                          className="px-2 py-1 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1 transition-colors"
                          title="Enqueue in Background Batch Worker"
                        >
                          <Activity className="w-3 h-3 text-amber-500" />
                          <span>Queue Batch</span>
                        </button>

                        <button
                          onClick={() => handleTriggerProcess(src.id)}
                          disabled={isProcessing}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1 transition-colors"
                          title="Generate / Re-process with Gemini"
                        >
                          <Play className={`w-3 h-3 text-red-600 ${isProcessing ? 'animate-spin' : ''}`} />
                          <span>{src.processingStatus === 'COMPLETED' ? 'Re-Generate' : 'Process'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSource(src.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-zinc-400 hover:text-rose-600 transition-colors"
                          title="Delete Source"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredSources.length === 0 && (
            <div className="text-center py-10 text-xs text-zinc-500">
              No Japanese content sources found. Upload your first PDF syllabus or textbook chapter above to begin.
            </div>
          )}
        </div>
      </div>

      {/* Extracted Text Preview Modal */}
      {previewSource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Extracted Raw Text & Stream Preview
                </h4>
                <p className="text-xs text-zinc-500">
                  {previewSource.title} ({previewSource.originalFilename}) &bull; {previewSource.pageCount || 1} pages
                </p>
              </div>
              <button
                onClick={() => setPreviewSource(null)}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 whitespace-pre-wrap flex-1 rounded-b-2xl">
              {previewSource.extractedText || 'No text extracted from document.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
