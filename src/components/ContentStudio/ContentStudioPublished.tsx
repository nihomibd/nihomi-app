import React, { useState } from 'react';
import {
  Send,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileCheck,
  Award,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ContentDraft, Lesson, JLPTLevel } from '../../types.js';

interface ContentStudioPublishedProps {
  publishedDrafts: ContentDraft[];
  publishedLessons: Lesson[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectDraft: (draft: ContentDraft) => void;
}

export const ContentStudioPublished: React.FC<ContentStudioPublishedProps> = ({
  publishedDrafts,
  publishedLessons,
  isLoading,
  onRefresh,
  onSelectDraft
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrafts = publishedDrafts.filter((d) => {
    if (selectedLevel !== 'ALL' && d.level !== selectedLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || (d.titleJa && d.titleJa.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6" id="content-studio-published">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Published Live Educational Curriculum ({publishedDrafts.length} Lessons)
            </h3>
            <p className="text-xs text-zinc-500">
              Live curriculum modules accessible by students in the Nihomi Student Portal.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start sm:self-auto p-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search published lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrafts.map((draft) => {
          const vocabCount = draft.structuredContent?.vocabulary?.length || 0;
          const grammarCount = draft.structuredContent?.grammar?.length || 0;
          const kanjiCount = draft.structuredContent?.kanji?.length || 0;

          return (
            <div
              key={draft.id}
              onClick={() => onSelectDraft(draft)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs hover:border-emerald-500 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> JLPT {draft.level} Live
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Lesson #{draft.lessonId || 'Active'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {draft.title}
                </h4>
                {draft.titleJa && (
                  <p className="text-xs text-zinc-500 font-japanese mt-0.5">{draft.titleJa}</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-red-500" /> {vocabCount} Vocab
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-sky-500" /> {grammarCount} Grammar
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" /> {kanjiCount} Kanji
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">
                  Published {new Date(draft.updatedAt).toLocaleDateString()}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span>Manage / Audit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrafts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-xs text-zinc-500 space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-zinc-400" />
          <p className="font-bold text-zinc-700 dark:text-zinc-300">No published curriculum lessons yet.</p>
          <p>Approve and publish drafts from the Editorial Review Queue to make them live for students.</p>
        </div>
      )}
    </div>
  );
};
