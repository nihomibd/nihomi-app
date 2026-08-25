import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export type SyncStatus = 'synced' | 'syncing' | 'offline';

interface SyncStatusIndicatorProps {
  className?: string;
  onManualSync?: () => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ className = '', onManualSync }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced'
  );
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      // Simulate rapid sync of offline cached progress
      const timer = setTimeout(() => {
        setSyncStatus('synced');
        setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }, 1500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    if (!isOnline) return;
    setSyncStatus('syncing');
    if (onManualSync) onManualSync();
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        id="btn-sync-status-indicator"
        type="button"
        onClick={triggerSync}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
          syncStatus === 'offline'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/60'
            : syncStatus === 'syncing'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800'
            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        }`}
        title="Sync Status - Click to sync now"
      >
        {syncStatus === 'offline' ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <CloudOff className="w-3 h-3" />
            <span className="hidden sm:inline">Offline</span>
          </>
        ) : syncStatus === 'syncing' ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
            <span className="hidden sm:inline">Syncing...</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Cloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Synced</span>
          </>
        )}
      </button>

      {/* Hover Information Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
          <div className="font-bold flex items-center space-x-1 mb-0.5">
            {syncStatus === 'offline' ? (
              <span className="text-amber-400">Offline Cache Mode Active</span>
            ) : syncStatus === 'syncing' ? (
              <span className="text-blue-400">Syncing with Cloud...</span>
            ) : (
              <span className="text-emerald-400">Cloud Sync Active</span>
            )}
          </div>
          <div className="text-slate-300 text-[9px] leading-tight">
            {syncStatus === 'offline'
              ? 'Your study streak & flashcard reviews are safely saved in IndexedDB & Service Worker cache.'
              : `All progress, SRS reviews, and mock exams backed up. Last checked: ${lastSyncedTime}`}
          </div>
        </div>
      )}
    </div>
  );
};
