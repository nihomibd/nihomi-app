// src/components/cloud/CloudFileCard.tsx
// Nihomi Cloud V1 — Interactive File Card & List Row

import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  FileArchive,
  FileCode,
  File,
  Star,
  Download,
  Share2,
  Sparkles,
  MoreVertical,
  Trash2,
  RotateCcw,
  Edit2,
  ShieldCheck,
  FolderInput,
} from 'lucide-react';
import { CloudFile } from '../../types/cloud';
import { formatBytes } from './CloudStorageBar';

interface CloudFileCardProps {
  file: CloudFile;
  isGrid?: boolean;
  onDownload: (file: CloudFile) => void;
  onShare: (file: CloudFile) => void;
  onAskAi: (file: CloudFile) => void;
  onToggleFavorite: (file: CloudFile) => void;
  onRename: (file: CloudFile) => void;
  onMove: (file: CloudFile) => void;
  onTrash: (file: CloudFile) => void;
  onRestore?: (file: CloudFile) => void;
  onPermanentDelete?: (file: CloudFile) => void;
}

export function getFileIcon(mimeType: string, filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
    return <ImageIcon className="w-5 h-5 text-emerald-500" />;
  }
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'm4a'].includes(ext)) {
    return <Music className="w-5 h-5 text-purple-500" />;
  }
  if (mimeType.startsWith('video/') || ['mp4', 'mov', 'webm'].includes(ext)) {
    return <Video className="w-5 h-5 text-red-500" />;
  }
  if (mimeType.includes('pdf') || ext === 'pdf') {
    return <FileText className="w-5 h-5 text-red-600" />;
  }
  if (mimeType.includes('zip') || ['zip', 'tar', 'gz'].includes(ext)) {
    return <FileArchive className="w-5 h-5 text-amber-500" />;
  }
  if (['json', 'csv', 'js', 'ts', 'html'].includes(ext)) {
    return <FileCode className="w-5 h-5 text-blue-500" />;
  }
  return <File className="w-5 h-5 text-stone-500" />;
}

export const CloudFileCard: React.FC<CloudFileCardProps> = ({
  file,
  isGrid = true,
  onDownload,
  onShare,
  onAskAi,
  onToggleFavorite,
  onRename,
  onMove,
  onTrash,
  onRestore,
  onPermanentDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDeleted = Boolean(file.deletedAt);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderDropdownMenu = () => (
    <div className="absolute right-2 top-8 z-30 w-44 bg-white dark:bg-[#151522] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100 select-none">
      {!isDeleted ? (
        <>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onDownload(file);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-700 dark:text-stone-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onAskAi(file);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Nihomi AI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onShare(file);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-700 dark:text-stone-300 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onRename(file);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-700 dark:text-stone-300 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Rename</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onMove(file);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-700 dark:text-stone-300 cursor-pointer"
          >
            <FolderInput className="w-3.5 h-3.5" />
            <span>Move to Folder</span>
          </button>

          <div className="my-1 border-t border-stone-200 dark:border-stone-800" />

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onTrash(file);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Move to Trash</span>
          </button>
        </>
      ) : (
        <>
          {onRestore && (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onRestore(file);
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore File</span>
            </button>
          )}
          {onPermanentDelete && (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onPermanentDelete(file);
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-red-500/10 text-red-600 font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>
          )}
        </>
      )}
    </div>
  );

  // ============================================================================
  // GRID LAYOUT
  // ============================================================================
  if (isGrid) {
    return (
      <div
        id={`cloud-file-card-${file.id}`}
        className="group relative rounded-2xl bg-white dark:bg-[#12121e] border border-stone-200 dark:border-stone-800/80 p-4 transition-all duration-200 hover:shadow-lg hover:border-stone-300 dark:hover:border-stone-700 flex flex-col justify-between"
      >
        {/* Top bar */}
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 shrink-0">
            {getFileIcon(file.mimeType, file.name)}
          </div>

          <div className="flex items-center gap-1">
            {!isDeleted && (
              <button
                type="button"
                onClick={() => onToggleFavorite(file)}
                title={file.isFavorite ? 'Remove Star' : 'Star file'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  file.isFavorite
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400'
                }`}
              >
                <Star
                  className="w-4 h-4"
                  fill={file.isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {isMenuOpen && renderDropdownMenu()}
            </div>
          </div>
        </div>

        {/* File Name & Badges */}
        <div className="mb-3">
          <h4
            title={file.name}
            className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate mb-1"
          >
            {file.name}
          </h4>

          <div className="flex flex-wrap items-center gap-1.5">
            {file.japanLockerSection && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>{file.japanLockerSection}</span>
              </span>
            )}

            {file.category === 'learning' && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Learning
              </span>
            )}
            {file.category === 'certificate' && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Certificate
              </span>
            )}
            {file.category === 'career' && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Career
              </span>
            )}
          </div>
        </div>

        {/* Footer info & quick action */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
          <span>{formatBytes(file.sizeBytes)}</span>

          {!isDeleted ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onAskAi(file)}
                title="Ask Nihomi AI Sensei"
                className="p-1 rounded-lg hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDownload(file)}
                title="Download"
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span>{formatDate(file.updatedAt)}</span>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // LIST / TABLE ROW LAYOUT
  // ============================================================================
  return (
    <div
      id={`cloud-file-row-${file.id}`}
      className="group relative flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-[#12121e] border border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 transition-all text-xs"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 shrink-0">
          {getFileIcon(file.mimeType, file.name)}
        </div>

        <div className="min-w-0 flex-1">
          <p
            title={file.name}
            className="font-bold text-stone-900 dark:text-stone-100 truncate"
          >
            {file.name}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
            <span>{formatBytes(file.sizeBytes)}</span>
            <span>•</span>
            <span>{formatDate(file.createdAt)}</span>
            {file.japanLockerSection && (
              <>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {file.japanLockerSection}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!isDeleted && (
          <>
            <button
              type="button"
              onClick={() => onAskAi(file)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Sensei</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(file)}
              className={`p-1.5 rounded-lg cursor-pointer ${
                file.isFavorite
                  ? 'text-amber-500'
                  : 'text-stone-300 dark:text-stone-600 hover:text-stone-500'
              }`}
            >
              <Star
                className="w-4 h-4"
                fill={file.isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isMenuOpen && renderDropdownMenu()}
        </div>
      </div>
    </div>
  );
};
