// src/components/cloud/CloudStorageBar.tsx
// Nihomi Cloud V1 — Storage Meter & Plan Capacity Widget

import React from 'react';
import { HardDrive, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { CloudUsageMetrics } from '../../types/cloud';

interface CloudStorageBarProps {
  usage: CloudUsageMetrics | null;
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const CloudStorageBar: React.FC<CloudStorageBarProps> = ({
  usage,
  onUpgradeClick,
  compact = false,
}) => {
  if (!usage) {
    return (
      <div className="animate-pulse bg-stone-100 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-800">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24 mb-2"></div>
        <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
      </div>
    );
  }

  const { storageBytes, quotaBytes, percentage, plan, fileCount } = usage;
  const isNearLimit = percentage >= 80;
  const isCritical = percentage >= 95;

  const planLabels: Record<string, string> = {
    free: 'Free (1 GB)',
    starter: 'Starter (10 GB)',
    pro: 'Pro (50 GB)',
    japan_ready: 'Japan Ready (200 GB)',
  };

  const planName = planLabels[plan] || 'Personal Cloud';

  return (
    <div
      id="nihomi-cloud-storage-bar"
      className={`rounded-2xl border transition-all ${
        isCritical
          ? 'bg-red-500/5 border-red-500/30'
          : isNearLimit
          ? 'bg-amber-500/5 border-amber-500/30'
          : 'bg-stone-100/80 dark:bg-stone-900/70 border-stone-200 dark:border-stone-800/80'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isCritical
                ? 'bg-red-500/20 text-red-500'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {planName}
              </span>
              {plan === 'japan_ready' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                  VIP
                </span>
              )}
            </div>
            {!compact && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {fileCount} {fileCount === 1 ? 'file' : 'files'} stored securely
              </p>
            )}
          </div>
        </div>

        <span className="text-xs font-mono font-semibold text-stone-700 dark:text-stone-300">
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2 overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isCritical
              ? 'bg-red-500'
              : isNearLimit
              ? 'bg-amber-500'
              : 'bg-gradient-to-r from-red-600 to-amber-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
        <span>
          {formatBytes(storageBytes)} used of {formatBytes(quotaBytes)}
        </span>

        {plan !== 'japan_ready' && onUpgradeClick && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="inline-flex items-center font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
          >
            <span>Upgrade</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      {isNearLimit && !compact && (
        <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-start gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            {isCritical
              ? 'Storage almost full. Upgrade your plan to prevent upload disruptions.'
              : 'Over 80% used. Consider upgrading to Pro or Japan Ready for up to 200 GB.'}
          </span>
        </div>
      )}
    </div>
  );
};
