// src/views/NihomiCloudView.tsx
// Nihomi Cloud V1 — Master Personal Japanese Cloud & Japan Readiness Locker View

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Grid,
  List,
  UploadCloud,
  FolderPlus,
  Filter,
  ArrowUpDown,
  HardDrive,
  Folder,
  Layers,
  ChevronRight,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Trash2,
  Lock,
} from 'lucide-react';
import {
  CloudCategory,
  CloudFile,
  CloudFolder,
  CloudUsageMetrics,
  JapanLockerSection,
} from '../types/cloud';
import { cloudApi } from '../lib/cloudApi';
import { CloudSidebar, CloudNavigationTab } from '../components/cloud/CloudSidebar';
import { CloudFileCard } from '../components/cloud/CloudFileCard';
import { CloudJapanLockerView } from '../components/cloud/CloudJapanLockerView';
import { CloudUploadModal } from '../components/cloud/CloudUploadModal';
import { CloudAiModal } from '../components/cloud/CloudAiModal';
import { CloudShareModal } from '../components/cloud/CloudShareModal';

interface NihomiCloudViewProps {
  onUpgradeClick?: () => void;
}

export const NihomiCloudView: React.FC<NihomiCloudViewProps> = ({ onUpgradeClick }) => {
  const [currentTab, setCurrentTab] = useState<CloudNavigationTab>('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<CloudFolder[]>([]);
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [usage, setUsage] = useState<CloudUsageMetrics | null>(null);
  const [isGrid, setIsGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'sizeBytes'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTargetSection, setUploadTargetSection] = useState<JapanLockerSection | null>(null);
  const [uploadCategory, setUploadCategory] = useState<CloudCategory>('general');

  const [aiModalFile, setAiModalFile] = useState<CloudFile | null>(null);
  const [shareModalFile, setShareModalFile] = useState<CloudFile | null>(null);

  // Prompt / simple dialogs
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState('');
  const [renameFileModal, setRenameFileModal] = useState<CloudFile | null>(null);
  const [newFileNameInput, setNewFileNameInput] = useState('');

  // 1. Fetch initial data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Resolve category filter from current tab
      let categoryFilter: CloudCategory | undefined = undefined;
      let isTrash = false;
      let isFavorite: boolean | undefined = undefined;

      if (currentTab === 'learning') categoryFilter = 'learning';
      if (currentTab === 'japan_locker') categoryFilter = 'japan';
      if (currentTab === 'certificates') categoryFilter = 'certificate';
      if (currentTab === 'career') categoryFilter = 'career';
      if (currentTab === 'favorites') isFavorite = true;
      if (currentTab === 'trash') isTrash = true;

      const [usageData, folderData, fileData] = await Promise.all([
        cloudApi.getUsage(),
        cloudApi.getFolders(categoryFilter),
        cloudApi.getFiles({
          folderId: currentTab === 'japan_locker' ? 'all' : (currentFolderId || 'all'),
          category: categoryFilter,
          favorite: isFavorite,
          trash: isTrash,
          search: searchQuery || undefined,
          sortBy: sortBy,
          sortOrder: sortOrder,
        }),
      ]);

      setUsage(usageData);
      setFolders(folderData);
      setFiles(fileData.files);
    } catch (err: any) {
      setError(err.message || 'Failed to load cloud files');
    } finally {
      setIsLoading(false);
    }
  }, [currentTab, currentFolderId, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // File action handlers
  const handleDownload = async (file: CloudFile) => {
    try {
      const { downloadUrl } = await cloudApi.getDownloadUrl(file.id);
      window.open(downloadUrl, '_blank');
    } catch (err: any) {
      alert(err.message || 'Failed to download file.');
    }
  };

  const handleToggleFavorite = async (file: CloudFile) => {
    try {
      const updated = await cloudApi.updateFile(file.id, { isFavorite: !file.isFavorite });
      setFiles((prev) => prev.map((f) => (f.id === file.id ? updated : f)));
    } catch (err: any) {
      alert(err.message || 'Failed to update star status.');
    }
  };

  const handleTrash = async (file: CloudFile) => {
    if (!confirm(`Are you sure you want to move "${file.name}" to Trash?`)) return;
    try {
      await cloudApi.trashFile(file.id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to trash file.');
    }
  };

  const handleRestore = async (file: CloudFile) => {
    try {
      await cloudApi.restoreFile(file.id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to restore file.');
    }
  };

  const handlePermanentDelete = async (file: CloudFile) => {
    if (!confirm(`Permanently delete "${file.name}"? This action cannot be undone.`)) return;
    try {
      await cloudApi.deleteFilePermanently(file.id);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to permanently delete file.');
    }
  };

  const handleCreateFolder = async () => {
    if (!folderNameInput.trim()) return;
    try {
      let category: CloudCategory = 'general';
      if (currentTab === 'learning') category = 'learning';
      if (currentTab === 'japan_locker') category = 'japan';
      if (currentTab === 'certificates') category = 'certificate';
      if (currentTab === 'career') category = 'career';

      await cloudApi.createFolder(folderNameInput.trim(), currentFolderId, category);
      setFolderNameInput('');
      setFolderModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create folder.');
    }
  };

  const handleRenameFile = async () => {
    if (!renameFileModal || !newFileNameInput.trim()) return;
    try {
      await cloudApi.updateFile(renameFileModal.id, { name: newFileNameInput.trim() });
      setRenameFileModal(null);
      setNewFileNameInput('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to rename file.');
    }
  };

  const handleUploadFromSection = (section: JapanLockerSection) => {
    setUploadCategory('japan');
    setUploadTargetSection(section);
    setIsUploadOpen(true);
  };

  const handleGeneralUpload = () => {
    let cat: CloudCategory = 'general';
    if (currentTab === 'learning') cat = 'learning';
    if (currentTab === 'japan_locker') cat = 'japan';
    if (currentTab === 'certificates') cat = 'certificate';
    if (currentTab === 'career') cat = 'career';

    setUploadCategory(cat);
    setUploadTargetSection(null);
    setIsUploadOpen(true);
  };

  const activeFolder = folders.find((f) => f.id === currentFolderId);

  return (
    <div
      id="nihomi-cloud-master-view"
      className="min-h-screen bg-[#FAF9F6] dark:bg-[#0a0a12] text-stone-900 dark:text-stone-100 flex flex-col md:flex-row"
    >
      {/* Sidebar navigation */}
      <CloudSidebar
        currentTab={currentTab}
        currentFolderId={currentFolderId}
        folders={folders}
        usage={usage}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setCurrentFolderId(null);
        }}
        onSelectFolder={(folderId) => setCurrentFolderId(folderId)}
        onCreateFolder={() => {
          setFolderNameInput('');
          setFolderModalOpen(true);
        }}
        onUpgradeClick={onUpgradeClick}
        className="w-full md:w-64 shrink-0"
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Top bar: Breadcrumb & Search & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Breadcrumbs & View Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>Nihomi Cloud</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="capitalize font-medium text-stone-700 dark:text-stone-300">
                {currentTab.replace('_', ' ')}
              </span>
              {activeFolder && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {activeFolder.name}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 mt-1">
              {currentTab === 'japan_locker'
                ? '🇯🇵 Japan Readiness Locker'
                : currentTab === 'learning'
                ? '🎓 Learning Vault'
                : currentTab === 'certificates'
                ? '📜 Official Certificates'
                : currentTab === 'career'
                ? '💼 Career & Baito Locker'
                : currentTab === 'trash'
                ? '🗑️ Trash'
                : activeFolder
                ? `📁 ${activeFolder.name}`
                : 'All Documents'}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {currentTab !== 'trash' && (
              <>
                <button
                  type="button"
                  id="cloud-create-folder-btn"
                  onClick={() => {
                    setFolderNameInput('');
                    setFolderModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 transition-all cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">New Folder</span>
                </button>

                <button
                  type="button"
                  id="cloud-upload-main-btn"
                  onClick={handleGeneralUpload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-md shadow-red-500/20 transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Files</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Toolbar: Search, Sort, View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-3 rounded-2xl bg-white dark:bg-[#12121e] border border-stone-200 dark:border-stone-800/80">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              id="cloud-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, notes, or Japanese terms..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800">
            {/* Sort selection */}
            <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-stone-700 dark:text-stone-300 focus:outline-none font-medium cursor-pointer"
              >
                <option value="createdAt">Date Created</option>
                <option value="name">File Name</option>
                <option value="sizeBytes">File Size</option>
              </select>
            </div>

            <div className="h-4 w-px bg-stone-200 dark:bg-stone-800" />

            {/* Grid / List switcher */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsGrid(true)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isGrid
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsGrid(false)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  !isGrid
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic View Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Accessing encrypted Nihomi Cloud vault...
            </p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Unable to load vault files
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mb-4">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchData}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : currentTab === 'japan_locker' ? (
          <CloudJapanLockerView
            files={files}
            onUploadSection={handleUploadFromSection}
            onDownload={handleDownload}
            onShare={(f) => setShareModalFile(f)}
            onAskAi={(f) => setAiModalFile(f)}
            onToggleFavorite={handleToggleFavorite}
            onRename={(f) => {
              setRenameFileModal(f);
              setNewFileNameInput(f.name);
            }}
            onMove={() => {}}
            onTrash={handleTrash}
          />
        ) : files.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl bg-white/40 dark:bg-[#12121e]/40 p-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <HardDrive className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {currentTab === 'trash' ? 'Trash is Empty' : 'Your vault is ready for files'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mb-6">
              {currentTab === 'trash'
                ? 'Files deleted from your personal cloud will appear here before being permanently removed.'
                : 'Upload your Japanese study materials, Kanji cheat sheets, voice clips, or visa documents securely.'}
            </p>

            {currentTab !== 'trash' && (
              <button
                type="button"
                onClick={handleGeneralUpload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md shadow-red-500/20 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload First Document</span>
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              isGrid
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-2'
            }
          >
            {files.map((file) => (
              <CloudFileCard
                key={file.id}
                file={file}
                isGrid={isGrid}
                onDownload={handleDownload}
                onShare={(f) => setShareModalFile(f)}
                onAskAi={(f) => setAiModalFile(f)}
                onToggleFavorite={handleToggleFavorite}
                onRename={(f) => {
                  setRenameFileModal(f);
                  setNewFileNameInput(f.name);
                }}
                onMove={() => {}}
                onTrash={handleTrash}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <CloudUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          setIsUploadOpen(false);
          fetchData();
        }}
        folders={folders}
        initialFolderId={currentFolderId}
        initialCategory={uploadCategory}
        initialJapanLockerSection={uploadTargetSection}
        onUpgradeClick={onUpgradeClick}
      />

      {/* AI Sensei Modal */}
      <CloudAiModal
        file={aiModalFile}
        isOpen={Boolean(aiModalFile)}
        onClose={() => setAiModalFile(null)}
      />

      {/* Share Modal */}
      <CloudShareModal
        file={shareModalFile}
        isOpen={Boolean(shareModalFile)}
        onClose={() => setShareModalFile(null)}
      />

      {/* Create Folder Dialog */}
      {folderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#12121e] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              Create New Folder
            </h3>
            <input
              type="text"
              value={folderNameInput}
              onChange={(e) => setFolderNameInput(e.target.value)}
              placeholder="Folder name (e.g. JLPT N4 Grammar)"
              className="w-full text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFolderModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename File Dialog */}
      {renameFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#12121e] border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
              Rename File
            </h3>
            <input
              type="text"
              value={newFileNameInput}
              onChange={(e) => setNewFileNameInput(e.target.value)}
              placeholder="New file name"
              className="w-full text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameFileModal(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRenameFile}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
