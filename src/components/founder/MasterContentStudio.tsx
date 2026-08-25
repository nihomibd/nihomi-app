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
  Globe
} from 'lucide-react';
import { JLPTLevel } from '../../types/nihomi';
import { IngestionJobItem, BatchIngestionQueue } from '../../core/content-engine/batchIngestionQueue';
import { KnowledgeObject, GrammarObject, VocabularyObject, KanjiObject, LevelCompletenessMetrics, ContentGapItem } from '../../core/content-engine/types';
import { ContentIngestionService } from '../../core/content-engine/contentIngestionService';
import { NihomiStandardService } from '../../core/content-engine/nihomiStandardService';
import { ContentGapService } from '../../core/content-engine/contentGapService';
import { InfiniteContentEngine, InfiniteLearningExperience } from '../../core/content-engine/infiniteContentEngine';
import { speakJapanese } from '../../lib/tts';
import { useAuth } from '../../context/AuthContext';

export const MasterContentStudio: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ingestion' | 'review' | 'gaps' | 'infinite'>('ingestion');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');

  // 1. INGESTION STATE
  const [jobs, setJobs] = useState<IngestionJobItem[]>(() => BatchIngestionQueue.getJobs());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddSamplePDFBatch = () => {
    const sampleFiles = [
      { name: 'Minna_no_Nihongo_Lesson_1_to_25_Grammar_Master.pdf', size: 14200000, level: 'N5' as JLPTLevel },
      { name: 'JLPT_N5_Essential_100_Kanji_Radicals_Workbook.pdf', size: 8900000, level: 'N5' as JLPTLevel },
      { name: 'Tokyo_Language_School_Skype_Interview_Scenarios.pdf', size: 5400000, level: 'N5' as JLPTLevel },
      { name: 'Minna_no_Nihongo_Shokyu_II_Lesson_26_to_50.pdf', size: 16800000, level: 'N4' as JLPTLevel },
    ];
    BatchIngestionQueue.createBatch(sampleFiles);
    setJobs(BatchIngestionQueue.getJobs());
  };

  const handleRunBatchPipeline = async () => {
    setIsProcessing(true);
    const allJobs = BatchIngestionQueue.getJobs();
    for (let step = 0; step < 5; step++) {
      await new Promise((r) => setTimeout(r, 600));
      for (const j of allJobs) {
        BatchIngestionQueue.processJobStep(j.id);
      }
      setJobs([...BatchIngestionQueue.getJobs()]);
    }
    setIsProcessing(false);
  };

  // 2. REVIEW QUEUE STATE
  const [objects, setObjects] = useState<KnowledgeObject[]>(() => ContentIngestionService.getKnowledgeObjects());
  const [activeEditingObject, setActiveEditingObject] = useState<KnowledgeObject | null>(() => {
    const list = ContentIngestionService.getKnowledgeObjects();
    return list[0] || null;
  });

  const [editPattern, setEditPattern] = useState(activeEditingObject?.type === 'GRAMMAR' ? (activeEditingObject as GrammarObject).pattern : '');
  const [editFormula, setEditFormula] = useState(activeEditingObject?.type === 'GRAMMAR' ? (activeEditingObject as GrammarObject).formula : '');
  const [editMeaningEn, setEditMeaningEn] = useState(activeEditingObject?.trilingual?.en?.meaning || '');
  const [editMeaningBn, setEditMeaningBn] = useState(activeEditingObject?.trilingual?.bn?.meaning || '');
  const [editExplanationBn, setEditExplanationBn] = useState(activeEditingObject?.trilingual?.bn?.explanationBn || '');
  const [editFurigana, setEditFurigana] = useState(activeEditingObject?.trilingual?.ja?.furigana || '');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const loadObjectToEditor = (obj: KnowledgeObject) => {
    setActiveEditingObject(obj);
    if (obj.type === 'GRAMMAR') {
      const g = obj as GrammarObject;
      setEditPattern(g.pattern || '');
      setEditFormula(g.formula || '');
      setEditMeaningEn(g.trilingual?.en?.meaning || '');
      setEditMeaningBn(g.trilingual?.bn?.meaning || '');
      setEditExplanationBn(g.trilingual?.bn?.explanationBn || '');
      setEditFurigana(g.trilingual?.ja?.furigana || '');
    } else if (obj.type === 'VOCABULARY') {
      const v = obj as VocabularyObject;
      setEditPattern(v.word || '');
      setEditFormula(v.reading || '');
      setEditMeaningEn(v.trilingual?.en?.meaning || '');
      setEditMeaningBn(v.trilingual?.bn?.meaning || '');
      setEditExplanationBn(v.trilingual?.bn?.explanationBn || '');
      setEditFurigana(v.trilingual?.ja?.furigana || '');
    }
  };

  const handleSaveAndReEvaluate = () => {
    if (!activeEditingObject) return;
    const updated = { ...activeEditingObject };
    if (updated.type === 'GRAMMAR') {
      const g = updated as GrammarObject;
      g.pattern = editPattern;
      g.formula = editFormula;
      g.trilingual.en.meaning = editMeaningEn;
      g.trilingual.bn.meaning = editMeaningBn;
      g.trilingual.bn.explanationBn = editExplanationBn;
      g.trilingual.ja.furigana = editFurigana;
    }
    const evalResult = NihomiStandardService.evaluateKnowledgeObject(updated);
    updated.qualityEvaluation = evalResult;
    ContentIngestionService.registerOrUpdateObject(updated);
    setObjects([...ContentIngestionService.getKnowledgeObjects()]);
    setActiveEditingObject({ ...updated });
    setActionFeedback(`Evaluated NIHOMI STANDARD™ Score: ${evalResult.overallScore}/100`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleAuthorizeAndPublish = () => {
    if (!activeEditingObject) return;
    const updated = { ...activeEditingObject };
    updated.lifecycleStage = 'APPROVED';
    updated.status = 'PUBLISHED';
    updated.approvedBy = user?.email || 'mdtanvirkabirbiplob@gmail.com';
    updated.approvedAt = new Date().toISOString();
    const evalResult = NihomiStandardService.evaluateKnowledgeObject(updated);
    updated.qualityEvaluation = evalResult;
    ContentIngestionService.registerOrUpdateObject(updated);
    setObjects([...ContentIngestionService.getKnowledgeObjects()]);
    setActiveEditingObject({ ...updated });
    setActionFeedback(`✓ Authorized & Published "${updated.code}" to Live Knowledge Base!`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // 3. GAPS & COMPLETENESS STATE
  const completeness: LevelCompletenessMetrics = ContentGapService.getLevelCompleteness(selectedLevel);
  const gaps: ContentGapItem[] = ContentGapService.getContentGaps().filter(
    (g) => g.level === selectedLevel || selectedLevel === 'N5'
  );

  // 4. INFINITE CONTENT PREVIEW STATE
  const infiniteExp: InfiniteLearningExperience = InfiniteContentEngine.generateInfiniteExperience(
    activeEditingObject || ContentIngestionService.getKnowledgeObjects()[0]
  );

  return (
    <div id="master-content-studio-root" className="space-y-6 text-left antialiased">
      {/* Top Header */}
      <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                NIHOMI CONTENT ENGINE™ • PRODUCTION INTELLIGENCE SUITE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Master Knowledge Base & NIHOMI STANDARD™ Studio
            </h2>
            <p className="text-xs text-stone-400">
              One Source Document ➔ Unified Knowledge Intelligence ➔ 23-Point Quality Governance ➔ Infinite Learning Experiences.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {(['N5', 'N4', 'N3'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-white'
                }`}
              >
                JLPT {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'ingestion', label: '1. Multi-PDF Ingestion Studio', icon: Upload },
            { id: 'review', label: '2. Review Queue & Quality Gate', icon: ShieldCheck },
            { id: 'gaps', label: '3. Completeness & Gap Radar', icon: BarChart3 },
            { id: 'infinite', label: '4. Infinite Content™ Matrix', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 1. INGESTION TAB */}
      {activeTab === 'ingestion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-stone-500 block">Queue Status</span>
              <strong className="text-white text-base">
                {jobs.filter((j) => j.progressPercent === 100).length} / {jobs.length} Finished
              </strong>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-stone-500 block">Extracted Concepts</span>
              <strong className="text-emerald-400 text-base">
                +{jobs.reduce((a, c) => a + c.extractedConceptsCount, 0)} Objects
              </strong>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-stone-500 block">Quality Governance</span>
              <strong className="text-amber-400 text-base">NIHOMI STANDARD™</strong>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-1">
              <span className="text-[10px] text-stone-500 block">Deduplication</span>
              <strong className="text-white text-base">SHA-256 Hashes</strong>
            </div>
          </div>

          <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/60 rounded-3xl p-8 bg-stone-950/60 text-center space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Drag & drop multiple Japanese learning PDFs</h4>
              <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                Ingest 1, 10, or 50+ textbooks simultaneously. The engine parses lessons, extracts trilingual text, and executes the 23-point NIHOMI STANDARD™.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAddSamplePDFBatch}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 cursor-pointer"
              >
                + Add Sample Batch (4 PDFs)
              </button>
              <button
                onClick={handleRunBatchPipeline}
                disabled={isProcessing || jobs.length === 0}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isProcessing ? 'Processing Pipeline...' : 'Run Ingestion Pipeline'}</span>
              </button>
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
                  Active Ingestion Jobs ({jobs.length})
                </h4>
                <span className="text-[10px] text-stone-500 font-mono">Async Worker Active</span>
              </div>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <strong className="text-white block">{job.filename}</strong>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {(job.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB • Level: JLPT {job.level} • Hash: {job.sourceHash.slice(0, 16)}...
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {job.stage}
                        </span>
                        <span className="font-mono text-stone-300 font-bold">{job.progressPercent}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${job.progressPercent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. REVIEW QUEUE TAB */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-stone-950 border border-stone-800 rounded-3xl p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono border-b border-stone-800 pb-2">
              Knowledge Objects ({objects.length})
            </h4>
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {objects.map((obj) => {
                const isSelected = activeEditingObject?.id === obj.id;
                const score = obj.qualityEvaluation?.overallScore ?? 95;
                return (
                  <div
                    key={obj.id}
                    onClick={() => loadObjectToEditor(obj)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500 ring-1 ring-amber-500/30'
                        : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 font-mono text-[9px] font-bold rounded">
                        {obj.code}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">NS Score: {score}/100</span>
                    </div>
                    <div className="font-bold text-white text-xs truncate">
                      {obj.type === 'GRAMMAR' ? (obj as any).pattern : (obj as any).word}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-5">
            {activeEditingObject ? (
              <div className="space-y-5">
                <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-amber-400 font-bold">{activeEditingObject.code}</span> • JLPT {activeEditingObject.level} • {activeEditingObject.status}
                    <div className="text-[11px] text-stone-400 font-mono">
                      Source: {activeEditingObject.sourceTraceability?.sourceDocumentTitle} (Page {activeEditingObject.sourceTraceability?.sourcePage})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 uppercase block font-mono">NIHOMI STANDARD™</span>
                    <strong className="text-sm font-mono text-emerald-400">
                      {activeEditingObject.qualityEvaluation?.overallScore ?? 98}/100
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-2 text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400">Source Snippet</span>
                    <div className="p-3 bg-stone-950 rounded-xl font-mono text-[11px] text-stone-300 whitespace-pre-wrap font-japanese">
                      {activeEditingObject.sourceTraceability?.sourceTextSnippet}
                    </div>
                  </div>

                  <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-2 text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400">Pattern & Furigana</span>
                    <input
                      type="text"
                      value={editPattern}
                      onChange={(e) => setEditPattern(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-1.5 rounded-xl text-white text-xs font-japanese font-bold"
                    />
                    <input
                      type="text"
                      value={editFurigana}
                      onChange={(e) => setEditFurigana(e.target.value)}
                      placeholder="Furigana [ ]"
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-1.5 rounded-xl text-red-400 text-xs font-japanese"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-2 text-xs">
                    <label className="text-[10px] text-stone-400 font-mono uppercase font-bold">English Meaning</label>
                    <textarea
                      rows={3}
                      value={editMeaningEn}
                      onChange={(e) => setEditMeaningEn(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-2xl space-y-2 text-xs">
                    <label className="text-[10px] text-stone-400 font-mono uppercase font-bold">বাংলা অর্থ ও ব্যাখ্যা (Bengali)</label>
                    <textarea
                      rows={3}
                      value={editExplanationBn}
                      onChange={(e) => setEditExplanationBn(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                  <button
                    onClick={handleSaveAndReEvaluate}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 cursor-pointer flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Re-evaluate Score</span>
                  </button>
                  <button
                    onClick={handleAuthorizeAndPublish}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Authorize & Publish to Student Loop</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 3. GAPS TAB */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
              <span className="text-stone-400 font-bold">Vocabulary: {completeness.vocabularyCoveragePercent}%</span>
              <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2" style={{ width: `${completeness.vocabularyCoveragePercent}%` }}></div>
              </div>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
              <span className="text-stone-400 font-bold">Kanji & Radicals: {completeness.kanjiCoveragePercent}%</span>
              <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2" style={{ width: `${completeness.kanjiCoveragePercent}%` }}></div>
              </div>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2">
              <span className="text-stone-400 font-bold">Grammar Formulas: {completeness.grammarCoveragePercent}%</span>
              <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2" style={{ width: `${completeness.grammarCoveragePercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono border-b border-stone-800 pb-2">
              Detected Content Gap Queue ({gaps.length} Actionable Items)
            </h4>
            <div className="space-y-3">
              {gaps.map((gap) => (
                <div key={gap.id} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-mono text-[9px] font-bold rounded">
                      {gap.priority} PRIORITY
                    </span>
                    <strong className="text-white ml-2">{gap.missingConcept}</strong>
                    <p className="text-stone-400 text-[11px] mt-1">{gap.reason}</p>
                  </div>
                  <button className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 cursor-pointer">
                    Ingest Gap Source →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. INFINITE CONTENT PREVIEW TAB */}
      {activeTab === 'infinite' && (
        <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                1 VERIFIED OBJECT ➔ 15 DYNAMIC LEARNING FORMATS
              </span>
              <h4 className="text-base font-bold text-white">{infiniteExp.title}</h4>
            </div>
            <button
              onClick={() => speakJapanese(infiniteExp.titleJa)}
              className="px-3 py-1.5 bg-stone-900 text-stone-200 hover:text-white rounded-xl border border-stone-700 text-xs flex items-center space-x-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-red-400" />
              <span>Pronounce</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
              <strong className="text-amber-400 block font-mono">1. Micro-Lesson Formula</strong>
              <div className="text-white font-mono">{infiniteExp.formats.microLesson.formula}</div>
              <p className="text-stone-400 text-[11px] pt-1">{infiniteExp.formats.microLesson.explanationBn}</p>
            </div>

            <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
              <strong className="text-emerald-400 block font-mono">2. Concept Quiz</strong>
              <div className="text-white">{infiniteExp.formats.mcqQuiz.question}</div>
              <div className="text-emerald-400 text-[11px] pt-1">Correct: {infiniteExp.formats.mcqQuiz.options[0].textJa}</div>
            </div>

            <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-1">
              <strong className="text-purple-400 block font-mono">3. Baito & Keigo Scenario</strong>
              <div className="text-stone-300">{infiniteExp.formats.baitoScenario.situationBn}</div>
              <div className="text-purple-300 text-[11px] pt-1">Staff: {infiniteExp.formats.baitoScenario.correctStaffResponseJa}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MasterContentStudio;
