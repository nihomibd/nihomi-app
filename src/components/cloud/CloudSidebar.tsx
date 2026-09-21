// src/components/cloud/CloudSidebar.tsx
// Nihomi Cloud V1 — Navigation Sidebar & Folder Hierarchy Tree

import React, { useState } from 'react';
import {
  Folder,
  FolderPlus,
  GraduationCap,
  ShieldCheck,
  Award,
  Briefcase,
  Star,
  Clock,
  Trash2,
  ChevronRight,
  ChevronDown,
  HardDrive,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CloudCategory, CloudFolder, CloudUsageMetrics } from '../../types/cloud';
import { CloudStorageBar } from './CloudStorageBar';

export type CloudNavigationTab =
  | 'all'
  | 'learning'
  | 'japan_locker'
  | 'certificates'
  | 'career'
  | 'favorites'
  | 'recent'
  | 'trash';

interface CloudSidebarProps {
  currentTab: CloudNavigationTab;
  currentFolderId: string | null;
  folders: CloudFolder[];
  usage: CloudUsageMetrics | null;
  onSelectTab: (tab: CloudNavigationTab) => void;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onUpgradeClick?: () => void;
  className?: string;
}

export const CloudSidebar: React.FC<CloudSidebarProps> = ({
  currentTab,
  currentFolderId,
  folders,
  usage,
  onSelectTab,
  onSelectFolder,
  onCreateFolder,
  onUpgradeClick,
  className = '',
}) => {
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);

  const navItems = [
    {
      id: 'all' as CloudNavigationTab,
      label: 'All Files',
      labelJa: 'すべてのファイル',
      icon: Layers,
    },
    {
      id: 'learning' as CloudNavigationTab,
      label: 'My Learning',
      labelJa: '学習ノート・教材',
      icon: GraduationCap,
      badge: 'N5-N1',
    },
    {
      id: 'japan_locker' as CloudNavigationTab,
      label: 'My Japan Locker',
      labelJa: '渡航・在留金庫',
      icon: ShieldCheck,
      badge: 'Private Vault',
      highlight: true,
    },
    {
      id: 'certificates' as CloudNavigationTab,
      label: 'My Certificates',
      labelJa: '公式修了証',
      icon: Award,
    },
    {
      id: 'career' as CloudNavigationTab,
      label: 'My Career & Baito',
      labelJa: '履歴書・就職',
      icon: Briefcase,
    },
    {
      id: 'favorites' as CloudNavigationTab,
      label: 'Starred',
      labelJa: 'お気に入り',
      icon: Star,
    },
    {
      id: 'recent' as CloudNavigationTab,
      label: 'Recent',
      labelJa: '最近のファイル',
      icon: Clock,
    },
    {
      id: 'trash' as CloudNavigationTab,
      label: 'Trash',
      labelJa: 'ゴミ箱',
      icon: Trash2,
    },
  ];

  return (
    <aside
      id="nihomi-cloud-sidebar"
      className={`flex flex-col h-full bg-[#FAF9F6]/80 dark:bg-[#0a0a12]/90 border-r border-stone-200 dark:border-stone-800/80 p-4 select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20">
          <HardDrive className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-black tracking-tight text-stone-900 dark:text-stone-100">
              NIHOMI CLOUD
            </h2>
            <span className="text-[10px] px-1 py-0.2 rounded font-bold bg-red-600/10 text-red-600 dark:text-red-400">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Personal Japan Readiness Vault
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1 mb-6 flex-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id && currentFolderId === null;

          return (
            <button
              key={item.id}
              id={`cloud-nav-${item.id}`}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                onSelectFolder(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    item.highlight && !isActive ? 'text-amber-500' : ''
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                      : item.highlight
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Folders Accordion */}
        <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800/80">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
              className="flex items-center gap-1 hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              {isFoldersExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span>Folders</span>
            </button>

            <button
              type="button"
              onClick={onCreateFolder}
              title="Create New Folder"
              className="p-1 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isFoldersExpanded && (
            <div className="mt-1 space-y-0.5 pl-2">
              {folders.length === 0 ? (
                <p className="px-3 py-2 text-[11px] text-stone-400 dark:text-stone-600 italic">
                  No folders yet
                </p>
              ) : (
                folders.map((folder) => {
                  const isFolderActive = currentFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      id={`cloud-folder-${folder.id}`}
                      type="button"
                      onClick={() => onSelectFolder(folder.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        isFolderActive
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-900/50'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500/80" />
                      <span className="truncate">{folder.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Storage Gauge */}
      <div className="pt-2">
        <CloudStorageBar usage={usage} onUpgradeClick={onUpgradeClick} />
      </div>
    </aside>
  );
};
