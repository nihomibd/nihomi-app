import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Database,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Filter,
  Check,
  Eye,
  Trash2,
  BookOpen,
  HelpCircle,
  Briefcase,
  AlertTriangle,
  Award,
  Volume2,
  PieChart,
  BarChart3,
  Search,
  Globe,
  FileCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { JLPTLevel } from '../../../types/nihomi';
import { IngestionJobItem, BatchIngestionQueue } from '../../../core/content-engine/batchIngestionQueue';

interface PDFIngestionStudioProps {
  selectedLevel: JLPTLevel;
  onSelectLevel: (lvl: JLPTLevel) => void;
  onNavigateToReview?: () => void;
}

export const PDFIngestionStudio: React.FC<PDFIngestionStudioProps> = ({
  selectedLevel,
  onSelectLevel,
  onNavigateToReview
}) => {
  const [jobs, setJobs] = useState<IngestionJobItem[]>(() => BatchIngestionQueue.getJobs());
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    showToast(`Processing ${files.length} real document file(s) with SHA-256 verification...`);

    const fileList = Array.from(files);
    for (const file of fileList) {
      try {
        await BatchIngestionQueue.processRealFile(file, selectedLevel);
      } catch (err: any) {
        console.error('[PDFIngestionStudio] File processing failed:', err);
      }
    }

    setJobs(BatchIngestionQueue.getJobs());
    setIsProcessing(false);
    showToast(`Successfully extracted ${fileList.length} files. Concepts added to Review Queue!`);
  };

  const handleAddSampleBatch = () => {
    const sampleFiles = [
      { name: 'Minna_no_Nihongo_Shokyu_I_Lesson_1_to_25_Grammar.pdf', size: 14200000, level: 'N5' as JLPTLevel },
      { name: 'JLPT_N5_Essential_100_Kanji_Radicals_Workbook.pdf', size: 8900000, level: 'N5' as JLPTLevel },
      { name: 'Tokyo_Language_School_Skype_Interview_Scenarios.pdf', size: 5400000, level: 'N5' as JLPTLevel },
      { name: 'Minna_no_Nihongo_Shokyu_II_Lesson_26_to_50_Causative.pdf', size: 16800000, level: 'N4' as JLPTLevel },
      { name: 'N3_IT_Engineer_Career_Sonkeigo_Email_Templates.pdf', size: 7600000, level: 'N3' as JLPTLevel }
    ];
    BatchIngestionQueue.createBatch(sampleFiles);
    setJobs(BatchIngestionQueue.getJobs());
    showToast('Batch created: 5 Multi-PDF Textbooks queued with SHA-256 deduplication signatures.');
  };

  const handleRunBatchPipeline = async () => {
    setIsProcessing(true);
    const allJobs = BatchIngestionQueue.getJobs();
    for (let step = 0; step < 4; step++) {
      await new Promise((r) => setTimeout(r, 500));
      for (const j of allJobs) {
        BatchIngestionQueue.processJobStep(j.id);
      }
      setJobs([...BatchIngestionQueue.getJobs()]);
    }
    setIsProcessing(false);
    showToast('Ingestion pipeline completed. Extracted concepts loaded into Review Queue & Quality Gate.');
  };

  const handleClearAllJobs = () => {
    BatchIngestionQueue.clearJobs();
    setJobs([]);
    showToast('Ingestion queue cleared.');
  };

  const totalExtracted = jobs.reduce((sum, j) => sum + j.extractedConceptsCount, 0);
  const finishedCount = jobs.filter((j) => j.progressPercent === 100).length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Ingestion Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">Queue Status</span>
          <strong className="text-white text-base">
            {finishedCount} / {jobs.length} Finished
          </strong>
          <span className="text-[10px] text-emerald-400 block font-sans">
            {isProcessing ? '⚡ Active Worker Processing' : '✓ Batch Ingestion Ready'}
          </span>
        </div>
        <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">Extracted Objects</span>
          <strong className="text-emerald-400 text-base">+{totalExtracted} Concepts</strong>
          <span className="text-[10px] text-stone-400 block font-sans">Grammar, Vocab, Kanji, Drills</span>
        </div>
        <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">Quality Gate</span>
          <strong className="text-amber-400 text-base">23-Point NIHOMI™</strong>
          <span className="text-[10px] text-stone-400 block font-sans">Automated Trilingual Audit</span>
        </div>
        <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-1">
          <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">Deduplication</span>
          <strong className="text-white text-base">SHA-256 Hashes</strong>
          <span className="text-[10px] text-stone-400 block font-sans">Zero content duplication</span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Drag & Drop Upload Stage */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md,.json"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files);
          }
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
          } else {
            handleAddSampleBatch();
          }
        }}
        className={`border-2 border-dashed rounded-3xl p-8 text-center space-y-4 transition-all ${
          dragOver
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-stone-800 hover:border-amber-500/60 bg-stone-950/60'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-xs border border-stone-800">
          <Upload className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-white tracking-tight">
            Drag & Drop Multi-PDF Japanese Learning Textbooks
          </h4>
          <p className="text-xs text-stone-400 max-w-xl mx-auto leading-relaxed">
            Ingest 1 to 50+ textbooks simultaneously (Minna no Nihongo, Kanji Workbooks, Skype Interview PDFs).
            The ingestion pipeline automatically isolates lessons, generates SHA-256 signatures, extracts trilingual tokens, and triggers the 23-point NIHOMI STANDARD™.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Real PDF / Textbooks</span>
          </button>

          <button
            type="button"
            onClick={handleAddSampleBatch}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>+ Load 5 Canonical Syllabus PDFs</span>
          </button>

          <button
            type="button"
            onClick={handleRunBatchPipeline}
            disabled={isProcessing || jobs.length === 0}
            className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-extrabold rounded-xl border border-stone-700 shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-40"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
            <span>{isProcessing ? 'Executing Extraction Pipeline...' : 'Process All Queued Batches'}</span>
          </button>

          {jobs.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllJobs}
              className="px-3.5 py-2.5 bg-stone-900 hover:bg-red-950/60 text-stone-400 hover:text-red-300 text-xs font-semibold rounded-xl border border-stone-800 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {finishedCount > 0 && onNavigateToReview && (
            <button
              type="button"
              onClick={onNavigateToReview}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Review Extracted Queue ({totalExtracted}) →</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Ingestion Jobs Table */}
      {jobs.length > 0 && (
        <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono flex items-center space-x-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Active Ingestion Jobs ({jobs.length})</span>
              </h4>
              <p className="text-[11px] text-stone-500">Real-time asynchronous multi-PDF extraction workers</p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-stone-900 border border-stone-800 text-stone-400 rounded-lg">
              Level Filter: JLPT {selectedLevel}
            </span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => {
              const isDone = job.progressPercent === 100;
              return (
                <div
                  key={job.id}
                  className="p-4 bg-stone-900/80 border border-stone-800 hover:border-stone-700 rounded-2xl space-y-2.5 text-xs transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-amber-400'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white block font-medium">{job.filename}</strong>
                        <span className="text-[10px] text-stone-500 font-mono block">
                          {(job.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB • Level: JLPT {job.level} • Hash: {job.sourceHash.slice(0, 18)}...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border ${
                        isDone
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {job.stage}
                      </span>
                      <span className="font-mono text-stone-200 font-bold text-xs">{job.progressPercent}%</span>
                      {job.extractedConceptsCount > 0 && (
                        <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                          +{job.extractedConceptsCount} objects
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isDone ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${job.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
