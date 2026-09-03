import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Send,
  Save,
  ShieldCheck,
  FileCheck,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Award,
  Layers,
  History,
  Info,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  GitCompare,
  RotateCcw,
  Hash,
  FileCode
} from 'lucide-react';
import {
  ContentDraft,
  ContentVersion,
  ContentDifferentialDiff,
  ContentSource,
  StructuredEducationalContent,
  VocabularyItem,
  GrammarItem,
  KanjiItem,
  LessonPracticeExercise,
  QuizQuestion,
  LessonDialogue,
  JLPTLevel
} from '../../types.js';
import { contentEngineApi } from '../../lib/contentEngineApi.js';

interface ContentDraftReviewModalProps {
  draft: ContentDraft;
  source?: ContentSource;
  versions?: ContentVersion[];
  onClose: () => void;
  onUpdate: () => void;
}

export const ContentDraftReviewModal: React.FC<ContentDraftReviewModalProps> = ({
  draft: initialDraft,
  source,
  versions = [],
  onClose,
  onUpdate
}) => {
  const [draft, setDraft] = useState<ContentDraft>(initialDraft);
  const [activeTab, setActiveTab] = useState<'overview' | 'vocabulary' | 'grammar' | 'kanji' | 'dialogue' | 'exercises' | 'versions'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Versioning and Diffing State
  const [localVersions, setLocalVersions] = useState<ContentVersion[]>(versions);
  const [selectedDiff, setSelectedDiff] = useState<ContentDifferentialDiff | null>(null);
  const [isDiffLoading, setIsDiffLoading] = useState(false);
  const [diffTargetVersion, setDiffTargetVersion] = useState<number | null>(null);

  // Rollback Modal State
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [rollbackTargetVersion, setRollbackTargetVersion] = useState<number | null>(null);
  const [rollbackReason, setRollbackReason] = useState('');
  const [isRollingBack, setIsRollingBack] = useState(false);

  // Revision modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Structured Content State
  const [content, setContent] = useState<StructuredEducationalContent>(
    JSON.parse(JSON.stringify(draft.structuredContent || { vocabulary: [], grammar: [], kanji: [], practiceExercises: [] }))
  );

  const [title, setTitle] = useState(draft.title);
  const [titleJa, setTitleJa] = useState(draft.titleJa || '');
  const [summary, setSummary] = useState(draft.summary || '');
  const [explanation, setExplanation] = useState(draft.explanation || '');
  const [level, setLevel] = useState<JLPTLevel>(draft.level);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await contentEngineApi.updateDraftContent(draft.id, {
      title,
      titleJa,
      summary,
      explanation,
      level,
      structuredContent: content
    });

    setIsSaving(false);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setActionSuccess('Curriculum draft modifications saved successfully.');
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to save changes');
    }
  };

  const handleApprove = async () => {
    if (!confirm('Approve this educational curriculum for publication?')) return;
    setActionError(null);
    const res = await contentEngineApi.approveDraft(draft.id);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setActionSuccess('Draft approved! It is now ready for live curriculum publishing.');
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to approve draft');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please specify rejection reason / audit notes (optional):');
    if (reason === null) return;
    setActionError(null);
    const res = await contentEngineApi.rejectDraft(draft.id, reason);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setActionSuccess('Draft marked as REJECTED.');
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to reject draft');
    }
  };

  const handleRequestRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) {
      alert('Please enter revision feedback notes.');
      return;
    }
    setActionError(null);
    const res = await contentEngineApi.requestRevision(draft.id, revisionNotes);
    setIsRevisionModalOpen(false);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setActionSuccess('Revision requested. Status updated to REVISION_REQUIRED.');
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to request revision');
    }
  };

  const refreshVersions = async () => {
    const res = await contentEngineApi.getDraftVersions(draft.id);
    if (res.success) {
      setLocalVersions(res.versions);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish this educational curriculum to the live Nihomi student portal and course curriculum?')) return;
    setActionError(null);
    const res = await contentEngineApi.publishDraft(draft.id);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setActionSuccess(`Published! Live Lesson ID: ${res.lesson?.id}. Version ${res.version?.versionNumber} recorded.`);
      await refreshVersions();
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to publish draft');
    }
  };

  const handleOpenDiff = async (verNumber: number) => {
    setIsDiffLoading(true);
    setDiffTargetVersion(verNumber);
    setActionError(null);
    const res = await contentEngineApi.diffDraftWithVersion(draft.id, verNumber);
    setIsDiffLoading(false);
    if (res.success && res.diff) {
      setSelectedDiff(res.diff);
    } else {
      setActionError(res.error || 'Failed to compute version diff');
    }
  };

  const handleConfirmRollback = async () => {
    if (rollbackTargetVersion === null) return;
    setIsRollingBack(true);
    setActionError(null);
    const res = await contentEngineApi.rollbackDraft(draft.id, rollbackTargetVersion, rollbackReason);
    setIsRollingBack(false);
    setIsRollbackModalOpen(false);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setContent(JSON.parse(JSON.stringify(res.draft.structuredContent || { vocabulary: [], grammar: [], kanji: [], practiceExercises: [] })));
      setTitle(res.draft.title);
      setTitleJa(res.draft.titleJa || '');
      setSummary(res.draft.summary || '');
      setExplanation(res.draft.explanation || '');
      setLevel(res.draft.level);
      setActionSuccess(`Successfully rolled back to Version ${rollbackTargetVersion}! Audit version created.`);
      await refreshVersions();
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to execute rollback');
    }
  };

  const handleUnpublish = async () => {
    if (!confirm('Unpublish this lesson from live student access?')) return;
    setActionError(null);
    const res = await contentEngineApi.unpublishDraft(draft.id);
    if (res.success && res.draft) {
      setDraft(res.draft);
      setActionSuccess('Draft unpublished and set back to APPROVED.');
      onUpdate();
    } else {
      setActionError(res.error || 'Failed to unpublish draft');
    }
  };

  // Quick Vocabulary Manipulations
  const handleUpdateVocab = (index: number, field: keyof VocabularyItem, value: any) => {
    const next = [...content.vocabulary];
    next[index] = { ...next[index], [field]: value };
    setContent({ ...content, vocabulary: next });
  };

  const handleDeleteVocab = (index: number) => {
    const next = content.vocabulary.filter((_, i) => i !== index);
    setContent({ ...content, vocabulary: next });
  };

  const handleAddVocab = () => {
    const newItem: VocabularyItem = {
      id: `voc-${Date.now()}`,
      japanese: '',
      furigana: '',
      romaji: '',
      english: '',
      partOfSpeech: 'noun',
      level: draft.level,
      exampleSentenceJa: '',
      exampleSentenceEn: '',
      exampleFurigana: ''
    };
    setContent({ ...content, vocabulary: [...content.vocabulary, newItem] });
  };

  const getStatusBadge = () => {
    switch (draft.status) {
      case 'PUBLISHED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published (Live)
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'REVISION_REQUIRED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Revision Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'AI_GENERATED':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Generated
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4" id="content-draft-review-modal">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs">
                JLPT {draft.level}
              </span>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-lg">
                {title || 'Untitled Curriculum Draft'}
              </h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Source: <span className="font-mono">{source?.originalFilename || draft.sourceId}</span> &bull; Model: {draft.generationMetadata?.modelUsed || 'Gemini'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-xs"
              id="btn-save-draft"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Edits'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mandatory Quality & Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Editorial Notice:</strong> {draft.generationMetadata?.disclaimer || 'AI-generated content — Human review required.'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-amber-800 dark:text-amber-300">
            <span>Confidence: {draft.generationMetadata?.confidenceScore || 95}%</span>
            <span>&bull;</span>
            <span>Source-derived: {draft.generationMetadata?.sourceDerived ? 'Verified' : 'Enriched'}</span>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {actionError && (
          <div className="mx-5 mt-3 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
          <div className="mx-5 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Overview & Scope
          </button>
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'vocabulary'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Vocabulary ({content.vocabulary?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Grammar ({content.grammar?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('kanji')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'kanji'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Kanji ({content.kanji?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'dialogue'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Dialogue ({content.dialogue?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'exercises'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Exercises & Quiz ({(content.practiceExercises?.length || 0) + (content.quiz?.questions?.length || 0)})
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'versions'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Version History ({versions.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Lesson Title (English / Romaji)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Japanese Title (Kanji / Kana)
                  </label>
                  <input
                    type="text"
                    value={titleJa}
                    onChange={(e) => setTitleJa(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-japanese"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Pedagogical Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Detailed Lesson Explanation
                </label>
                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                />
              </div>

              {draft.reviewNotes && (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200">
                    Latest Editorial Review Notes:
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 italic">"{draft.reviewNotes}"</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Vocabulary items extracted and enriched with Bangla + English meanings and sample sentences.
                </p>
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Vocabulary Item
                </button>
              </div>

              <div className="space-y-3">
                {content.vocabulary.map((voc, idx) => (
                  <div
                    key={voc.id || idx}
                    className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-zinc-400">#{idx + 1}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {voc.partOfSpeech || 'Word'}
                        </span>
                        {voc.sourceDerived !== false && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Source Text
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteVocab(idx)}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">Japanese</label>
                        <input
                          type="text"
                          value={voc.japanese}
                          onChange={(e) => handleUpdateVocab(idx, 'japanese', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">Furigana / Reading</label>
                        <input
                          type="text"
                          value={voc.furigana}
                          onChange={(e) => handleUpdateVocab(idx, 'furigana', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">Romaji</label>
                        <input
                          type="text"
                          value={voc.romaji || ''}
                          onChange={(e) => handleUpdateVocab(idx, 'romaji', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">English Meaning</label>
                        <input
                          type="text"
                          value={voc.english}
                          onChange={(e) => handleUpdateVocab(idx, 'english', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">Example Sentence (Japanese)</label>
                        <input
                          type="text"
                          value={voc.exampleSentenceJa}
                          onChange={(e) => handleUpdateVocab(idx, 'exampleSentenceJa', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400">Example Sentence (English / Bangla)</label>
                        <input
                          type="text"
                          value={voc.exampleSentenceEn}
                          onChange={(e) => handleUpdateVocab(idx, 'exampleSentenceEn', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'grammar' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Grammar rules, sentence structures, and pedagogical breakdowns.
              </p>
              <div className="space-y-3">
                {content.grammar.map((grm, idx) => (
                  <div
                    key={grm.id || idx}
                    className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {grm.title} ({grm.titleJa})
                      </h4>
                      <span className="font-extrabold text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
                        Structure: {grm.structure}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      <strong>Meaning:</strong> {grm.meaning}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {grm.explanation}
                    </p>
                    {grm.examples && grm.examples.length > 0 && (
                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-zinc-400">Examples:</span>
                        {grm.examples.map((ex, exIdx) => (
                          <div key={exIdx} className="text-xs font-mono bg-white dark:bg-zinc-800 p-2 rounded-lg">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{ex.japanese}</div>
                            <div className="text-zinc-500 text-[11px]">{ex.english}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'kanji' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Kanji radicals, readings (onyomi/kunyomi), stroke orders, and compound words.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.kanji.map((kan, idx) => (
                  <div
                    key={kan.id || idx}
                    className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl font-bold font-japanese shadow-xs">
                        {kan.character}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{kan.meaning}</div>
                        <div className="text-[11px] text-zinc-500">
                          Strokes: {kan.strokes} &bull; Radical: {kan.radicals}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs space-y-1 pt-1">
                      <div><strong className="text-[10px] text-zinc-400 uppercase">Onyomi:</strong> {kan.onyomi?.join(', ')}</div>
                      <div><strong className="text-[10px] text-zinc-400 uppercase">Kunyomi:</strong> {kan.kunyomi?.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dialogue' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Real-life situational dialogue turns between Japanese speakers.
              </p>
              <div className="space-y-2">
                {content.dialogue?.map((dia, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-red-600 dark:text-red-400">{dia.speaker}</span>
                      {dia.speakerRole && (
                        <span className="text-[10px] text-zinc-400">({dia.speakerRole})</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{dia.japanese}</div>
                    <div className="text-xs text-zinc-500">{dia.english}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Practice Exercises ({content.practiceExercises?.length || 0})
                </h4>
                <div className="space-y-3">
                  {content.practiceExercises.map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1 text-xs"
                    >
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">{ex.instruction}</div>
                      <div className="font-bold text-red-600 text-sm">{ex.questionJa}</div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {ex.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-xs ${
                              opt === ex.correctAnswer
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-zinc-500 pt-1 italic">{ex.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {content.quiz && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    Mastery Quiz: {content.quiz.title} (Passing: {content.quiz.passingScore}%)
                  </h4>
                  <div className="space-y-3">
                    {content.quiz.questions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1 text-xs"
                      >
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">{q.question}</div>
                        {q.questionJa && <div className="text-zinc-600 dark:text-zinc-400">{q.questionJa}</div>}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-lg border text-xs ${
                                optIdx === q.correctIndex
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <History className="w-4 h-4 text-red-500" />
                    Immutable Publication Versions & Audit Lineage
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Snapshots created on every publish. Compare versions differentially or execute one-click atomic rollbacks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshVersions}
                  className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  Refresh Versions
                </button>
              </div>

              <div className="space-y-3">
                {localVersions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                          Version {ver.versionNumber}
                        </span>
                        {ver.rollbackFromVersion && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            Restored from V{ver.rollbackFromVersion}
                          </span>
                        )}
                        {ver.checksumSha256 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1" title={ver.checksumSha256}>
                            <Hash className="w-3 h-3 text-zinc-500" />
                            {ver.checksumSha256.substring(0, 10)}...
                          </span>
                        )}
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Lesson: {ver.targetLessonId || 'N/A'}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {new Date(ver.publishedAt || ver.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-200/50 dark:border-zinc-800/50">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        Approved: <strong>{ver.approvedBy || 'System'}</strong> &bull; Published: <strong>{ver.publishedBy || 'System'}</strong>
                        {ver.changelogSummary && (
                          <span className="block text-[11px] text-zinc-500 mt-0.5 italic">
                            Changelog: {ver.changelogSummary}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedDiff && diffTargetVersion === ver.versionNumber) {
                              setSelectedDiff(null);
                              setDiffTargetVersion(null);
                            } else {
                              handleOpenDiff(ver.versionNumber);
                            }
                          }}
                          disabled={isDiffLoading && diffTargetVersion === ver.versionNumber}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <GitCompare className="w-3.5 h-3.5 text-sky-500" />
                          {isDiffLoading && diffTargetVersion === ver.versionNumber
                            ? 'Diffing...'
                            : selectedDiff && diffTargetVersion === ver.versionNumber
                            ? 'Hide Diff'
                            : 'Diff vs Current'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRollbackTargetVersion(ver.versionNumber);
                            setRollbackReason(`Rollback to Version ${ver.versionNumber}`);
                            setIsRollbackModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Rollback to V{ver.versionNumber}
                        </button>
                      </div>
                    </div>

                    {/* Differential Diff Inspection Drawer */}
                    {selectedDiff && diffTargetVersion === ver.versionNumber && (
                      <div className="mt-3 p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 space-y-3 animate-in fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200 dark:border-sky-900/40 pb-2">
                          <div className="flex items-center gap-2">
                            <GitCompare className="w-4 h-4 text-sky-500" />
                            <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                              Differential Diff: Version {ver.versionNumber} vs Current Draft
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                              Total Changes: {selectedDiff.stats.totalChanges}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              Vocab: +{selectedDiff.stats.vocabularyChanges.added} / -{selectedDiff.stats.vocabularyChanges.removed} / ~{selectedDiff.stats.vocabularyChanges.modified}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              Grammar: +{selectedDiff.stats.grammarChanges.added} / -{selectedDiff.stats.grammarChanges.removed} / ~{selectedDiff.stats.grammarChanges.modified}
                            </span>
                          </div>
                        </div>

                        {selectedDiff.stats.totalChanges === 0 ? (
                          <div className="text-xs text-zinc-500 py-2 italic text-center">
                            No differences detected. Current draft structured content is identical to Version {ver.versionNumber}.
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                            {/* Metadata Changes */}
                            {selectedDiff.metadataDiff.length > 0 && (
                              <div className="space-y-1">
                                <h5 className="text-[11px] font-extrabold uppercase text-zinc-500 tracking-wider">Metadata Changes</h5>
                                {selectedDiff.metadataDiff.map((md, idx) => (
                                  <div key={idx} className="text-xs p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="font-mono text-zinc-600 dark:text-zinc-400">{md.field}:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="line-through text-rose-600 dark:text-rose-400">{String(md.oldValue || '—')}</span>
                                      <span>&rarr;</span>
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{String(md.newValue || '—')}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Vocabulary Diff */}
                            {selectedDiff.vocabularyDiff.length > 0 && (
                              <div className="space-y-1">
                                <h5 className="text-[11px] font-extrabold uppercase text-zinc-500 tracking-wider">
                                  Vocabulary ({selectedDiff.vocabularyDiff.length} changes)
                                </h5>
                                {selectedDiff.vocabularyDiff.map((item) => (
                                  <div
                                    key={item.id}
                                    className={`text-xs p-2.5 rounded-lg border flex flex-col gap-1 ${
                                      item.changeType === 'ADDED'
                                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                                        : item.changeType === 'REMOVED'
                                        ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                                        : 'border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between font-bold">
                                      <span className="flex items-center gap-1.5">
                                        <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-black ${
                                          item.changeType === 'ADDED' ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100' :
                                          item.changeType === 'REMOVED' ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-100' :
                                          'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-100'
                                        }`}>
                                          {item.changeType}
                                        </span>
                                        {item.title || (item.newItem?.japanese || item.oldItem?.japanese)}
                                      </span>
                                      <span className="text-[11px] opacity-80">
                                        {item.newItem?.english || item.oldItem?.english}
                                      </span>
                                    </div>
                                    {item.fieldChanges && item.fieldChanges.length > 0 && (
                                      <div className="text-[11px] pt-1 space-y-0.5 border-t border-amber-200 dark:border-amber-800/50">
                                        {item.fieldChanges.map((fc, idx) => (
                                          <div key={idx} className="flex items-center gap-1">
                                            <span className="font-mono text-zinc-500">{fc.field}:</span>
                                            <span className="line-through text-rose-600 dark:text-rose-400">{String(fc.oldValue)}</span>
                                            <span>&rarr;</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{String(fc.newValue)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Grammar Diff */}
                            {selectedDiff.grammarDiff.length > 0 && (
                              <div className="space-y-1">
                                <h5 className="text-[11px] font-extrabold uppercase text-zinc-500 tracking-wider">
                                  Grammar ({selectedDiff.grammarDiff.length} changes)
                                </h5>
                                {selectedDiff.grammarDiff.map((item) => (
                                  <div
                                    key={item.id}
                                    className={`text-xs p-2.5 rounded-lg border flex flex-col gap-1 ${
                                      item.changeType === 'ADDED'
                                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40'
                                        : item.changeType === 'REMOVED'
                                        ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/70 dark:bg-rose-950/40'
                                        : 'border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between font-bold">
                                      <span>
                                        [{item.changeType}] {item.title || item.newItem?.title || item.oldItem?.title || item.newItem?.structure || item.oldItem?.structure}
                                      </span>
                                      <span className="text-[11px] text-zinc-500">
                                        {item.newItem?.meaning || item.oldItem?.meaning}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {localVersions.length === 0 && (
                  <div className="text-center py-8 text-xs text-zinc-500">
                    No publication versions recorded yet. Once approved and published, immutable audit snapshots will appear here.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer State Transition Actions */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Status:</span>
            {getStatusBadge()}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {draft.status === 'AI_GENERATED' && (
              <button
                type="button"
                onClick={async () => {
                  const res = await contentEngineApi.moveToReview(draft.id);
                  if (res.success && res.draft) {
                    setDraft(res.draft);
                    setActionSuccess('Draft moved to UNDER_REVIEW.');
                    onUpdate();
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold"
              >
                Mark Under Review
              </button>
            )}

            {['AI_GENERATED', 'UNDER_REVIEW', 'REVISION_REQUIRED'].includes(draft.status) && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Request Revision
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Curriculum
                </button>
              </>
            )}

            {draft.status === 'APPROVED' && (
              <button
                type="button"
                onClick={handlePublish}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md animate-pulse hover:animate-none"
                id="btn-publish-draft"
              >
                <Send className="w-3.5 h-3.5" />
                Publish to Live Curriculum
              </button>
            )}

            {draft.status === 'PUBLISHED' && (
              <button
                type="button"
                onClick={handleUnpublish}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold"
              >
                Unpublish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Revision Prompt Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Request Curriculum Revision
            </h4>
            <p className="text-xs text-zinc-500">
              Provide editorial guidance on which vocabulary, grammar points, or explanations need adjustments.
            </p>
            <form onSubmit={handleRequestRevisionSubmit} className="space-y-3">
              <textarea
                rows={4}
                required
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="e.g. Please verify the furigana on vocabulary items #3 and #7, and add more context to the particle は explanation."
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                >
                  Submit Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rollback Confirmation Modal */}
      {isRollbackModalOpen && rollbackTargetVersion !== null && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              Confirm Rollback to Version {rollbackTargetVersion}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              This will atomically restore this draft's structured curriculum (vocabulary, grammar points, and practice exercises) to <strong>Version {rollbackTargetVersion}</strong>. If this draft is currently published, the live PostgreSQL lesson will also be updated with zero student disruption.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                  Rollback Reason / Audit Note (Optional):
                </label>
                <input
                  type="text"
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  placeholder="e.g. Revert vocabulary translation error introduced in V2"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRollbackModalOpen(false)}
                  disabled={isRollingBack}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRollback}
                  disabled={isRollingBack}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  {isRollingBack ? (
                    <>Rolling back...</>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Confirm & Rollback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
