import React, { useState, useRef } from 'react';
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
  Info
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

  // Preview extracted text modal
  const [previewSource, setPreviewSource] = useState<ContentSource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      {/* Upload Zone */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
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
