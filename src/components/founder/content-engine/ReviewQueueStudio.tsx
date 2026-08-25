import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RotateCcw,
  Check,
  History,
  GitCompare,
  Volume2,
  FileText,
  Clock,
  User,
  Sparkles,
  ArrowLeftRight,
  Filter,
  Eye,
  Info,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  KnowledgeObject,
  GrammarObject,
  VocabularyObject,
  KanjiObject,
  ContentLifecycleStage,
  KnowledgeObjectVersionSnapshot
} from '../../../core/content-engine/types';
import { ContentIngestionService } from '../../../core/content-engine/contentIngestionService';
import { NihomiStandardService } from '../../../core/content-engine/nihomiStandardService';
import { speakJapanese } from '../../../lib/tts';
import { useAuth } from '../../../context/AuthContext';

export const ReviewQueueStudio: React.FC = () => {
  const { user } = useAuth();
  const [filterStage, setFilterStage] = useState<ContentLifecycleStage | 'ALL'>('HUMAN_REVIEW_REQUIRED');
  const [objects, setObjects] = useState<KnowledgeObject[]>(() => ContentIngestionService.getKnowledgeObjects());
  const [activeObjectId, setActiveObjectId] = useState<string>(() => {
    const list = ContentIngestionService.getKnowledgeObjects();
    const reviewFirst = list.find((o) => o.lifecycleStage === 'HUMAN_REVIEW_REQUIRED');
    return reviewFirst ? reviewFirst.id : list[0]?.id || '';
  });

  const activeObject = objects.find((o) => o.id === activeObjectId) || objects[0] || null;

  // Form State for Editing active object
  const [editPattern, setEditPattern] = useState(() => {
    if (!activeObject) return '';
    return activeObject.type === 'GRAMMAR' ? (activeObject as GrammarObject).pattern : (activeObject as any).word || (activeObject as any).kanji;
  });
  const [editFormula, setEditFormula] = useState(() => {
    if (!activeObject) return '';
    return activeObject.type === 'GRAMMAR' ? (activeObject as GrammarObject).formula : (activeObject as any).reading || '';
  });
  const [editMeaningEn, setEditMeaningEn] = useState(() => activeObject?.trilingual?.en?.meaning || '');
  const [editExplanationEn, setEditExplanationEn] = useState(() => activeObject?.trilingual?.en?.explanationEn || '');
  const [editMeaningBn, setEditMeaningBn] = useState(() => activeObject?.trilingual?.bn?.meaning || '');
  const [editExplanationBn, setEditExplanationBn] = useState(() => activeObject?.trilingual?.bn?.explanationBn || '');
  const [editFurigana, setEditFurigana] = useState(() => activeObject?.trilingual?.ja?.furigana || '');

  // Version History State
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedDiffVersion, setSelectedDiffVersion] = useState<KnowledgeObjectVersionSnapshot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleSelectObject = (obj: KnowledgeObject) => {
    setActiveObjectId(obj.id);
    if (obj.type === 'GRAMMAR') {
      const g = obj as GrammarObject;
      setEditPattern(g.pattern || '');
      setEditFormula(g.formula || '');
    } else if (obj.type === 'VOCABULARY') {
      const v = obj as VocabularyObject;
      setEditPattern(v.word || '');
      setEditFormula(v.reading || '');
    } else if (obj.type === 'KANJI') {
      const k = obj as KanjiObject;
      setEditPattern(k.kanji || '');
      setEditFormula(k.onyomi.join(', ') || '');
    }
    setEditMeaningEn(obj.trilingual?.en?.meaning || '');
    setEditExplanationEn(obj.trilingual?.en?.explanationEn || '');
    setEditMeaningBn(obj.trilingual?.bn?.meaning || '');
    setEditExplanationBn(obj.trilingual?.bn?.explanationBn || '');
    setEditFurigana(obj.trilingual?.ja?.furigana || '');
    setSelectedDiffVersion(null);
  };

  const handleSaveAndReEvaluate = () => {
    if (!activeObject) return;
    const updated: KnowledgeObject = { ...activeObject };

    if (updated.type === 'GRAMMAR') {
      const g = updated as GrammarObject;
      g.pattern = editPattern;
      g.formula = editFormula;
    } else if (updated.type === 'VOCABULARY') {
      const v = updated as VocabularyObject;
      v.word = editPattern;
      v.reading = editFormula;
    }

    updated.trilingual = {
      ...updated.trilingual,
      ja: {
        ...updated.trilingual.ja,
        furigana: editFurigana,
        text: editPattern
      },
      en: {
        ...updated.trilingual.en,
        meaning: editMeaningEn,
        explanationEn: editExplanationEn
      },
      bn: {
        ...updated.trilingual.bn,
        meaning: editMeaningBn,
        explanationBn: editExplanationBn
      }
    };

    const evalResult = NihomiStandardService.evaluateKnowledgeObject(updated);
    updated.qualityEvaluation = evalResult;

    const saved = ContentIngestionService.registerOrUpdateObject(
      updated,
      user?.email || 'mdtanvirkabirbiplob@gmail.com',
      'Audit refinement: trilingual content update'
    );

    setObjects(ContentIngestionService.getKnowledgeObjects());
    handleSelectObject(saved);
    showToast(`Evaluated NIHOMI STANDARD™ Score: ${evalResult.overallScore}/100. Snapshot saved as v${saved.version}.`);
  };

  const handleAuthorizeAndPublish = () => {
    if (!activeObject) return;
    const published = ContentIngestionService.authorizeAndPublish(
      activeObject.id,
      user?.email || 'mdtanvirkabirbiplob@gmail.com'
    );
    if (published) {
      setObjects(ContentIngestionService.getKnowledgeObjects());
      handleSelectObject(published);
      showToast(`✓ Authorized & Published "${published.code}" to Live Production Knowledge Base!`);
    }
  };

  const handleRevertVersion = (versionNum: number) => {
    if (!activeObject) return;
    const reverted = ContentIngestionService.revertToVersion(
      activeObject.id,
      versionNum,
      user?.email || 'mdtanvirkabirbiplob@gmail.com'
    );
    if (reverted) {
      setObjects(ContentIngestionService.getKnowledgeObjects());
      handleSelectObject(reverted);
      showToast(`Successfully reverted "${reverted.code}" to Version ${versionNum}.`);
      setSelectedDiffVersion(null);
    }
  };

  const filteredObjects = filterStage === 'ALL'
    ? objects
    : objects.filter((o) => o.lifecycleStage === filterStage);

  const evaluation = activeObject?.qualityEvaluation || (activeObject ? NihomiStandardService.evaluateKnowledgeObject(activeObject) : null);
  const violations = evaluation?.violations || [];

  return (
    <div className="space-y-6 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-700/80 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stage Selector & Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 border border-stone-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {[
            { id: 'HUMAN_REVIEW_REQUIRED', label: 'Human Review Queue', count: objects.filter((o) => o.lifecycleStage === 'HUMAN_REVIEW_REQUIRED').length, color: 'text-amber-400' },
            { id: 'PUBLISHED', label: 'Published Production', count: objects.filter((o) => o.lifecycleStage === 'PUBLISHED' || o.status === 'PUBLISHED').length, color: 'text-emerald-400' },
            { id: 'APPROVED', label: 'Approved Staging', count: objects.filter((o) => o.lifecycleStage === 'APPROVED').length, color: 'text-blue-400' },
            { id: 'ALL', label: 'All Knowledge Base', count: objects.length, color: 'text-stone-300' }
          ].map((tab) => {
            const isSelected = filterStage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStage(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-extrabold ${isSelected ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-300'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowVersionHistory(!showVersionHistory)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
            showVersionHistory
              ? 'bg-stone-800 text-amber-400 border-amber-500/40'
              : 'bg-stone-900 text-stone-300 border-stone-700 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Version History & Diff</span>
        </button>
      </div>

      {/* Main Grid: Left Queue List, Right Side-by-Side Audit & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Filtered Knowledge Object Queue */}
        <div className="lg:col-span-4 bg-stone-950 border border-stone-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 font-mono flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Queue Items ({filteredObjects.length})</span>
            </h4>
            <span className="text-[10px] font-mono text-stone-500">23 Dimensions</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredObjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-2xl">
                No items pending for stage "{filterStage}".
              </div>
            ) : (
              filteredObjects.map((obj) => {
                const isSelected = activeObject?.id === obj.id;
                const score = obj.qualityEvaluation?.overallScore ?? 90;
                const hasViolations = (obj.qualityEvaluation?.violations?.length ?? 0) > 0;
                return (
                  <div
                    key={obj.id}
                    onClick={() => handleSelectObject(obj)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500 ring-1 ring-amber-500/30'
                        : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 font-mono text-[9px] font-bold rounded">
                          {obj.code}
                        </span>
                        <span className="px-1.5 py-0.5 bg-stone-800 text-stone-400 font-mono text-[9px] rounded">
                          v{obj.version}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        NS: {score}/100
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs truncate">
                      {obj.type === 'GRAMMAR'
                        ? (obj as GrammarObject).pattern
                        : obj.type === 'VOCABULARY'
                        ? (obj as VocabularyObject).word
                        : (obj as KanjiObject).kanji}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-sans">
                      <span className="truncate max-w-[170px]">{obj.trilingual?.bn?.meaning || 'No Bangla'}</span>
                      {hasViolations && (
                        <span className="text-amber-400 font-mono flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{obj.qualityEvaluation.violations.length} audit</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Side-by-Side Audit, Traceability, Trilingual Editor & Version History */}
        <div className="lg:col-span-8 space-y-5">
          {activeObject ? (
            <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 space-y-5">
              {/* Header Badge */}
              <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-mono text-amber-400 font-bold text-sm">{activeObject.code}</span>
                    <span className="px-2 py-0.5 bg-stone-800 text-stone-300 font-mono text-[10px] rounded">
                      JLPT {activeObject.level} • {activeObject.type} • Version {activeObject.version}
                    </span>
                    <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                      activeObject.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {activeObject.lifecycleStage}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono">
                    Source Citation: {activeObject.sourceTraceability?.sourceDocumentTitle} (Page {activeObject.sourceTraceability?.sourcePage})
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:text-right">
                  <button
                    onClick={() => speakJapanese(editPattern)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl border border-stone-700 cursor-pointer"
                    title="Pronounce Japanese Text"
                  >
                    <Volume2 className="w-4 h-4 text-red-400" />
                  </button>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-mono font-bold">NIHOMI STANDARD™</span>
                    <strong className={`text-base font-mono font-extrabold ${evaluation?.overallScore && evaluation.overallScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {evaluation?.overallScore ?? 90}/100
                    </strong>
                  </div>
                </div>
              </div>

              {/* NihomiStandardEvaluation Violations Bar */}
              {violations.length > 0 && (
                <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl space-y-2.5 text-xs">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>23-Dimension Evaluation Violations ({violations.length})</span>
                  </div>
                  <div className="space-y-2">
                    {violations.map((v, idx) => (
                      <div key={idx} className="p-2.5 bg-stone-950/80 rounded-xl border border-amber-900/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-300 text-[10px]">{v.ruleId} [{v.dimension}]</span>
                          <span className={`px-2 py-0.2 rounded font-mono text-[9px] font-bold ${
                            v.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-stone-300 text-[11px]">{v.message}</p>
                        {v.suggestedFix && (
                          <p className="text-emerald-400 text-[10px] font-mono">Suggested Fix: {v.suggestedFix}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Version History & Diff Comparison Modal/Drawer */}
              {showVersionHistory && (
                <div className="p-5 bg-stone-900 border border-amber-500/40 rounded-2xl space-y-4 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <History className="w-4 h-4 text-amber-400" />
                      <strong className="text-white text-xs">Version Snapshots & Diff for {activeObject.code}</strong>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">Total Versions: {activeObject.versionHistory?.length || 1}</span>
                  </div>

                  <div className="space-y-2.5">
                    {activeObject.versionHistory?.map((snap) => (
                      <div key={snap.version} className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-amber-400 font-bold">Version {snap.version}</span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {new Date(snap.timestamp).toLocaleDateString()} by {snap.author}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 mt-0.5">{snap.summary}</p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => setSelectedDiffVersion(selectedDiffVersion?.version === snap.version ? null : snap)}
                            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold rounded-lg border border-stone-700 cursor-pointer"
                          >
                            {selectedDiffVersion?.version === snap.version ? 'Close Diff' : 'Compare Diff'}
                          </button>
                          {snap.version !== activeObject.version && (
                            <button
                              onClick={() => handleRevertVersion(snap.version)}
                              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900/80 text-red-300 text-[10px] font-bold rounded-lg border border-red-800 cursor-pointer"
                            >
                              Revert to v{snap.version}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Diff Inspector Box */}
                  {selectedDiffVersion && (
                    <div className="p-4 bg-stone-950 rounded-xl border border-amber-500/30 space-y-3 font-mono text-[11px]">
                      <strong className="text-amber-400 block">Diff: Current (v{activeObject.version}) vs Snapshot (v{selectedDiffVersion.version})</strong>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2.5 bg-stone-900 rounded border border-stone-800 space-y-1">
                          <span className="text-[10px] text-stone-500 uppercase block">Snapshot v{selectedDiffVersion.version}</span>
                          <div className="text-stone-300">Pattern: {selectedDiffVersion.dataSnapshot.patternOrWord}</div>
                          <div className="text-stone-400">Meaning BN: {selectedDiffVersion.dataSnapshot.trilingual.bn.meaning}</div>
                        </div>
                        <div className="p-2.5 bg-stone-900 rounded border border-stone-800 space-y-1">
                          <span className="text-[10px] text-emerald-400 uppercase block">Current v{activeObject.version}</span>
                          <div className="text-white">Pattern: {editPattern}</div>
                          <div className="text-emerald-300">Meaning BN: {editMeaningBn}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Side-by-Side Manuscript Traceability vs Trilingual Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Source Traceability Snippet */}
                <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400">
                      Original Textbook Source Snippet
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Hash: {activeObject.sourceTraceability?.sourceHash?.slice(0, 14)}...
                    </span>
                  </div>
                  <div className="p-3.5 bg-stone-950 rounded-xl font-mono text-[11px] text-stone-300 whitespace-pre-wrap font-japanese border border-stone-900 leading-relaxed">
                    {activeObject.sourceTraceability?.sourceTextSnippet || 'No raw source snippet attached.'}
                  </div>
                  <div className="text-[11px] text-stone-400 space-y-1">
                    <div><strong>Publisher:</strong> {activeObject.sourceTraceability?.sourcePublisher || '3A Corporation Tokyo'}</div>
                    <div><strong>Section:</strong> {activeObject.sourceTraceability?.sourceSection || 'Grammar Notes'}</div>
                    <div><strong>Copyright:</strong> {activeObject.sourceTraceability?.copyrightLicense || 'ACADEMIC_FAIR_USE'}</div>
                  </div>
                </div>

                {/* Right: Japanese Pattern & Furigana Notation */}
                <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-2xl space-y-3 text-xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-400 block">
                    Verified Pattern & Furigana Formula
                  </span>
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">Target Pattern / Word (Japanese)</label>
                    <input
                      type="text"
                      value={editPattern}
                      onChange={(e) => setEditPattern(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-2 rounded-xl text-white text-xs font-japanese font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">Furigana [Ruby Bracket Format]</label>
                    <input
                      type="text"
                      value={editFurigana}
                      onChange={(e) => setEditFurigana(e.target.value)}
                      placeholder="e.g. わたしは [学生|がくせい]です。"
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-2 rounded-xl text-red-400 text-xs font-japanese font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block mb-1">Connection Formula / Reading</label>
                    <input
                      type="text"
                      value={editFormula}
                      onChange={(e) => setEditFormula(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 px-3 py-2 rounded-xl text-amber-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Trilingual English & Bengali Content Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-2xl space-y-2 text-xs">
                  <label className="text-[10px] text-stone-400 font-mono uppercase font-bold block">
                    English Meaning & Pedagogical Explanation
                  </label>
                  <input
                    type="text"
                    value={editMeaningEn}
                    onChange={(e) => setEditMeaningEn(e.target.value)}
                    placeholder="English core meaning"
                    className="w-full bg-stone-950 border border-stone-700 px-3 py-1.5 rounded-xl text-white text-xs"
                  />
                  <textarea
                    rows={3}
                    value={editExplanationEn}
                    onChange={(e) => setEditExplanationEn(e.target.value)}
                    placeholder="Pedagogical explanation in English"
                    className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-2xl space-y-2 text-xs">
                  <label className="text-[10px] text-stone-400 font-mono uppercase font-bold block">
                    বাংলা অর্থ ও সাংস্কৃতিক ব্যাখ্যা (Bengali Trilingual)
                  </label>
                  <input
                    type="text"
                    value={editMeaningBn}
                    onChange={(e) => setEditMeaningBn(e.target.value)}
                    placeholder="বাংলা মূল অর্থ"
                    className="w-full bg-stone-950 border border-stone-700 px-3 py-1.5 rounded-xl text-white text-xs font-sans"
                  />
                  <textarea
                    rows={3}
                    value={editExplanationBn}
                    onChange={(e) => setEditExplanationBn(e.target.value)}
                    placeholder="শিক্ষার্থীদের জন্য সহজ ও স্পষ্ট বাংলা ব্যাখ্যা"
                    className="w-full bg-stone-950 border border-stone-700 p-2.5 rounded-xl text-white text-xs font-sans"
                  />
                </div>
              </div>

              {/* Action Buttons: Re-evaluate & Authorize Gate */}
              <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleSaveAndReEvaluate}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Re-evaluate Score & Save Snapshot</span>
                </button>

                <button
                  onClick={handleAuthorizeAndPublish}
                  className="w-full sm:w-auto px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>1-Click Authorize & Publish Gate</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
