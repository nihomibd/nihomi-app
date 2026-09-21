// src/components/cloud/CloudUploadModal.tsx
// Nihomi Cloud V1 — File Upload Modal with Multi-File & Progress Engine

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  File,
  CheckCircle2,
  AlertCircle,
  Folder,
  ShieldCheck,
  GraduationCap,
  Award,
  Briefcase,
  Layers,
} from 'lucide-react';
import { CloudCategory, CloudFolder, JapanLockerSection } from '../../types/cloud';
import { cloudApi } from '../../lib/cloudApi';
import { formatBytes } from './CloudStorageBar';

interface CloudUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  folders: CloudFolder[];
  initialFolderId?: string | null;
  initialCategory?: CloudCategory;
  initialJapanLockerSection?: JapanLockerSection | null;
  onUpgradeClick?: () => void;
}

interface QueuedFile {
  id: string;
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const CloudUploadModal: React.FC<CloudUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  folders,
  initialFolderId = null,
  initialCategory = 'general',
  initialJapanLockerSection = null,
  onUpgradeClick,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId);
  const [selectedCategory, setSelectedCategory] = useState<CloudCategory>(initialCategory);
  const [selectedJapanSection, setSelectedJapanSection] = useState<JapanLockerSection | null>(
    initialJapanLockerSection
  );
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setGeneralError(null);

    const newQueued: QueuedFile[] = Array.from(files).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file: f,
      progress: 0,
      status: 'idle',
    }));

    setQueuedFiles((prev) => [...prev, ...newQueued]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleRemoveQueued = (id: string) => {
    setQueuedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartUpload = async () => {
    if (queuedFiles.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setGeneralError(null);
    let anySuccess = false;

    for (const item of queuedFiles) {
      if (item.status === 'success') continue;

      setQueuedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading', progress: 5 } : f))
      );

      try {
        await cloudApi.uploadFile(
          item.file,
          {
            folderId: selectedFolderId,
            category: selectedCategory,
            japanLockerSection: selectedCategory === 'japan' ? selectedJapanSection : null,
          },
          (progress) => {
            setQueuedFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
            );
          }
        );

        setQueuedFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'success', progress: 100 } : f))
        );
        anySuccess = true;
      } catch (err: any) {
        setQueuedFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: err.message || 'Upload failed.',
                }
              : f
          )
        );
        if (err.code === 'QUOTA_EXCEEDED') {
          setGeneralError(err.message);
        }
      }
    }

    setIsSubmitting(false);
    if (anySuccess) {
      onUploadSuccess();
    }
  };

  const japanSections: { id: JapanLockerSection; label: string }[] = [
    { id: 'passport', label: 'Passport (パスポート)' },
    { id: 'coe', label: 'COE (在留資格認定証明書)' },
    { id: 'visa', label: 'Visa & Residence Card (ビザ・在留カード)' },
    { id: 'school', label: 'School / University Admission' },
    { id: 'certificates', label: 'JLPT & Official Certificates' },
    { id: 'housing', label: 'Housing & Dormitory Guarantee' },
    { id: 'employment', label: 'Employment Offer & SSW Contracts' },
    { id: 'career', label: 'Rirekisho & Career Documents' },
    { id: 'other', label: 'Other Japan Documents' },
  ];

  return (
    <div
      id="cloud-upload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="cloud-upload-modal"
        className="w-full max-w-xl bg-white dark:bg-[#0e0e18] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Upload to Nihomi Cloud
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Private, encrypted storage for Japanese study & relocation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* General Error Alert */}
          {generalError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{generalError}</p>
                {onUpgradeClick && (
                  <button
                    type="button"
                    onClick={onUpgradeClick}
                    className="mt-2 text-xs font-bold underline cursor-pointer"
                  >
                    Upgrade plan to increase storage capacity →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Vault Destination Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'general' as CloudCategory, label: 'General', icon: Layers },
                { id: 'learning' as CloudCategory, label: 'Learning', icon: GraduationCap },
                { id: 'japan' as CloudCategory, label: 'Japan Locker', icon: ShieldCheck },
                { id: 'career' as CloudCategory, label: 'Career', icon: Briefcase },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 border-transparent shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Japan Locker Section */}
          {selectedCategory === 'japan' && (
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-in fade-in">
              <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                Japan Readiness Locker Section
              </label>
              <select
                value={selectedJapanSection || ''}
                onChange={(e) => setSelectedJapanSection((e.target.value as JapanLockerSection) || null)}
                className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select section (optional)</option>
                {japanSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Optional Folder Select */}
          {folders.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Target Folder (Optional)
              </label>
              <select
                value={selectedFolderId || ''}
                onChange={(e) => setSelectedFolderId(e.target.value || null)}
                className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Root (No folder)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-red-500 bg-red-500/5'
                : 'border-stone-300 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFilesAdded(e.target.files)}
            />
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Drag and drop files here, or <span className="text-red-600 dark:text-red-400">browse</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Supports PDF, DOCX, PPTX, TXT, CSV, JPEG, PNG, MP3, MP4, and ZIP
            </p>
          </div>

          {/* File Queue List */}
          {queuedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>Selected Files ({queuedFiles.length})</span>
                <span>
                  {formatBytes(queuedFiles.reduce((acc, curr) => acc + curr.file.size, 0))}
                </span>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {queuedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <File className="w-4 h-4 text-stone-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {item.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400">
                          <span>{formatBytes(item.file.size)}</span>
                          {item.status === 'error' && (
                            <span className="text-red-500 font-medium truncate">
                              {item.errorMessage}
                            </span>
                          )}
                        </div>

                        {item.status === 'uploading' && (
                          <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1 mt-1.5 overflow-hidden">
                            <div
                              className="bg-red-600 h-full transition-all duration-200"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {item.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : item.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleRemoveQueued(item.id)}
                          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800/80 bg-stone-50 dark:bg-stone-900/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={queuedFiles.length === 0 || isSubmitting}
            onClick={handleStartUpload}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isSubmitting ? 'Uploading...' : `Upload (${queuedFiles.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};
