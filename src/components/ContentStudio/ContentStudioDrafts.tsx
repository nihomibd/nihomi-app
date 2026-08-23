import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Send,
  BookOpen,
  Layers,
  FileCheck,
  Award,
  HelpCircle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ContentDraft, ContentDraftStatus, JLPTLevel, ContentSource } from '../../types.js';
import { contentEngineApi } from '../../lib/contentEngineApi.js';

interface ContentStudioDraftsProps {
  drafts: ContentDraft[];
  sources: ContentSource[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectDraft: (draft: ContentDraft) => void;
}

export const ContentStudioDrafts: React.FC<ContentStudioDraftsProps> = ({
  drafts,
  sources,
  isLoading,
  onRefresh,
  onSelectDraft
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrafts = drafts.filter((d) => {
    if (selectedStatus !== 'ALL' && d.status !== selectedStatus) return false;
    if (selectedLevel !== 'ALL' && d.level !== selectedLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        (d.titleJa && d.titleJa.toLowerCase().includes(q)) ||
        (d.summary && d.summary.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: ContentDraftStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Published (Live)
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
            <ShieldCheck className="w-3 h-3" />
            Approved
          </span>
        );
      case 'REVISION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-3 h-3" />
            Revision Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'AI_GENERATED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            <Sparkles className="w-3 h-3 text-amber-500" />
            AI Generated
          </span>
        );
    }
  };

  const countsByStatus = {
    ALL: drafts.length,
    AI_GENERATED: drafts.filter((d) => d.status === 'AI_GENERATED').length,
    UNDER_REVIEW: drafts.filter((d) => d.status === 'UNDER_REVIEW').length,
    APPROVED: drafts.filter((d) => d.status === 'APPROVED').length,
    PUBLISHED: drafts.filter((d) => d.status === 'PUBLISHED').length,
    REVISION_REQUIRED: drafts.filter((d) => d.status === 'REVISION_REQUIRED').length,
    REJECTED: drafts.filter((d) => d.status === 'REJECTED').length
  };

  return (
    <div className="space-y-6" id="content-studio-drafts">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              Content Review & Editorial Staging Queue ({drafts.length})
            </h3>
            <p className="text-xs text-zinc-500">
              Inspect AI-generated educational packages, verify pedagogical quality, approve, and publish to live students.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start sm:self-auto p-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'All Drafts' },
            { id: 'AI_GENERATED', label: 'AI Generated' },
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'REVISION_REQUIRED', label: 'Revisions' },
            { id: 'APPROVED', label: 'Approved (Ready)' },
            { id: 'PUBLISHED', label: 'Published (Live)' },
            { id: 'REJECTED', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatus === tab.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  selectedStatus === tab.id
                    ? 'bg-red-800/60 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {(countsByStatus as any)[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Level and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by lesson title, Japanese title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
            >
              <option value="ALL">All JLPT Levels</option>
              <option value="N5">JLPT N5</option>
              <option value="N4">JLPT N4</option>
              <option value="N3">JLPT N3</option>
              <option value="N2">JLPT N2</option>
              <option value="N1">JLPT N1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Draft Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrafts.map((draft) => {
          const source = sources.find((s) => s.id === draft.sourceId);
          const vocabCount = draft.structuredContent?.vocabulary?.length || 0;
          const grammarCount = draft.structuredContent?.grammar?.length || 0;
          const kanjiCount = draft.structuredContent?.kanji?.length || 0;
          const exerciseCount = draft.structuredContent?.practiceExercises?.length || 0;
          const hasQuiz = Boolean(draft.structuredContent?.quiz);

          return (
            <div
              key={draft.id}
              onClick={() => onSelectDraft(draft)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs hover:border-red-400 dark:hover:border-red-500/60 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs">
                      JLPT {draft.level}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {draft.contentType.toUpperCase()}
                    </span>
                  </div>
                  {getStatusBadge(draft.status)}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {draft.title}
                  </h4>
                  {draft.titleJa && (
                    <p className="text-xs text-zinc-500 font-japanese mt-0.5">
                      {draft.titleJa}
                    </p>
                  )}
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {draft.summary || 'Educational curriculum draft.'}
                </p>
              </div>

              {/* Item Breakdown Badges */}
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <Layers className="w-3 h-3 text-red-500" />
                    {vocabCount} Vocab
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <FileCheck className="w-3 h-3 text-sky-500" />
                    {grammarCount} Grammar
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <Award className="w-3 h-3 text-amber-500" />
                    {kanjiCount} Kanji
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <HelpCircle className="w-3 h-3 text-purple-500" />
                    {exerciseCount} Practice
                  </span>
                  {hasQuiz && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      Quiz Included
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[200px]">
                    PDF: {source?.originalFilename || 'Document'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDraft(draft);
                    }}
                    className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline"
                  >
                    <span>Inspect & Review</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrafts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-xs text-zinc-500 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-zinc-400" />
          <p className="font-bold text-zinc-700 dark:text-zinc-300">No educational drafts match your criteria.</p>
          <p>Upload a new textbook PDF in the "PDF Sources" tab to generate structured curricula.</p>
        </div>
      )}
    </div>
  );
};
