import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Layers,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { ContentSource, ContentDraft, ContentVersion, Course } from '../../types.js';
import { contentEngineApi } from '../../lib/contentEngineApi.js';
import { ContentStudioSources } from './ContentStudioSources.js';
import { ContentStudioDrafts } from './ContentStudioDrafts.js';
import { ContentStudioPublished } from './ContentStudioPublished.js';
import { ContentDraftReviewModal } from './ContentDraftReviewModal.js';

interface ContentStudioSectionProps {
  courses: Course[];
}

export const ContentStudioSection: React.FC<ContentStudioSectionProps> = ({ courses }) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'drafts' | 'published'>('sources');
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);
  const [selectedDraftVersions, setSelectedDraftVersions] = useState<ContentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [sourcesRes, draftsRes] = await Promise.all([
        contentEngineApi.getContentSources(),
        contentEngineApi.getContentDrafts()
      ]);

      if (sourcesRes.success) setSources(sourcesRes.sources);
      if (draftsRes.success) setDrafts(draftsRes.drafts);
    } catch (err) {
      console.error('[ContentStudio] Failed to load studio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenDraftReview = async (draft: ContentDraft) => {
    setSelectedDraft(draft);
    const verRes = await contentEngineApi.getDraftVersions(draft.id);
    if (verRes.success) {
      setSelectedDraftVersions(verRes.versions);
    }
  };

  const handleOpenDraftById = async (draftId: string) => {
    const res = await contentEngineApi.getContentDraftById(draftId);
    if (res.success && res.draft) {
      setSelectedDraft(res.draft);
      setSelectedDraftVersions(res.versions || []);
    }
  };

  const publishedDrafts = drafts.filter((d) => d.status === 'PUBLISHED');

  return (
    <div className="space-y-6" id="content-studio-main-section">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-red-900 to-zinc-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-red-500/30 border border-red-400/40 text-red-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-300" />
              Nihomi AI Content Engine V1.0
            </span>
            <span className="text-xs text-zinc-400">&bull;</span>
            <span className="text-xs text-zinc-300 font-semibold">
              PDF Ingestion &bull; Gemini Structuring &bull; Editorial Review
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Curriculum Ingestion & Content Studio
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl mt-1">
            Upload Japanese syllabus PDFs, extract vocabulary & grammar with Gemini, review educational quality in the editorial queue, and publish lessons directly to students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Engine</span>
          </button>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'sources'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>1. PDF Sources Repository</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-black/20 text-white">
            {sources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'drafts'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>2. Editorial Review Queue</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-black/20 text-white">
            {drafts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'published'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>3. Published Live Curriculum</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-black/20 text-white">
            {publishedDrafts.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'sources' && (
        <ContentStudioSources
          sources={sources}
          courses={courses}
          isLoading={isLoading}
          onRefresh={fetchAll}
          onOpenDraft={handleOpenDraftById}
        />
      )}

      {activeTab === 'drafts' && (
        <ContentStudioDrafts
          drafts={drafts}
          sources={sources}
          isLoading={isLoading}
          onRefresh={fetchAll}
          onSelectDraft={handleOpenDraftReview}
        />
      )}

      {activeTab === 'published' && (
        <ContentStudioPublished
          publishedDrafts={publishedDrafts}
          publishedLessons={[]}
          isLoading={isLoading}
          onRefresh={fetchAll}
          onSelectDraft={handleOpenDraftReview}
        />
      )}

      {/* Review & Inspector Modal */}
      {selectedDraft && (
        <ContentDraftReviewModal
          draft={selectedDraft}
          source={sources.find((s) => s.id === selectedDraft.sourceId)}
          versions={selectedDraftVersions}
          onClose={() => setSelectedDraft(null)}
          onUpdate={() => {
            fetchAll();
          }}
        />
      )}
    </div>
  );
};
