import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, X, Database, ShieldCheck, CheckCircle, Cloud, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { SrsVocabularyService } from '../../lib/srsService';
import { studentService } from '../../features/student-dashboard/studentService';

export const OfflineNotificationBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showDismissed, setShowDismissed] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => SrsVocabularyService.getLastSyncTimestamp());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const updateSyncTimestamp = useCallback(() => {
    setLastSyncTime(SrsVocabularyService.getLastSyncTimestamp());
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setJustCameOnline(true);
      setShowDismissed(false);
      
      // Auto-trigger sync when coming back online
      setIsSyncing(true);
      try {
        await SrsVocabularyService.syncPendingRecordsToSupabase(user?.id);
        await studentService.syncOfflineProgress(user?.id);
        updateSyncTimestamp();
      } catch (err) {
        console.error('Auto sync error:', err);
      } finally {
        setIsSyncing(false);
      }

      const timer = setTimeout(() => {
        setJustCameOnline(false);
      }, 5000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    updateSyncTimestamp();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user?.id, updateSyncTimestamp]);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const success = await SrsVocabularyService.syncPendingRecordsToSupabase(user?.id);
      updateSyncTimestamp();
      if (success) {
        setSyncStatusMsg('Supabase synced successfully');
      } else {
        setSyncStatusMsg('Saved locally (will sync when online)');
      }
    } catch (e) {
      setSyncStatusMsg('Sync failed');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }
  };

  const formatLastSync = (isoString: string | null) => {
    if (!isoString) return 'Not synced yet';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  // If online and not just came online and dismissed, don't show full banner
  if (isOnline && !justCameOnline && showDismissed) {
    return null;
  }

  // Toast when restored
  if (justCameOnline) {
    return (
      <div
        id="online-restored-toast"
        className="fixed bottom-4 right-4 z-50 max-w-md bg-stone-900 text-stone-100 border border-emerald-500/50 rounded-2xl shadow-2xl p-4 flex items-center space-x-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <span>ইন্টারনেট পুনঃসংযোগ সম্পন্ন (Back Online)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-[11px] text-stone-300 mt-0.5">
            Offline SRS study progress successfully synchronized with Supabase cloud.
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <Cloud className="w-3 h-3" /> Last Synced: {formatLastSync(lastSyncTime)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setJustCameOnline(false)}
          className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // When Offline: Show full informative offline banner with Supabase sync timestamp and local cache status
  if (!isOnline) {
    return (
      <aside
        id="offline-notification-banner"
        aria-label="Offline Mode Active"
        className="bg-amber-600 dark:bg-amber-700 sepia:bg-amber-800 text-white px-4 py-2.5 text-xs font-medium sticky top-0 z-50 shadow-md transition-all animate-in fade-in duration-200"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-amber-700/80 dark:bg-amber-800 rounded-lg shrink-0">
              <WifiOff className="w-4 h-4 text-amber-200" />
            </span>
            <div>
              <span className="font-bold text-white">অফলাইন মোড সক্রিয় (Offline Mode Active):</span>{' '}
              <span className="text-amber-100">
                You are offline — Flashcards, Kanji Canvas, and saved Lessons remain fully accessible.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
            {/* Visual Supabase Sync Status Indicator */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-800/80 rounded-lg text-[11px] text-amber-100 border border-amber-500/40">
              <Cloud className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono">Last Supabase Sync: <strong className="text-white">{formatLastSync(lastSyncTime)}</strong></span>
            </div>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="p-1 hover:bg-amber-700/80 rounded-md text-amber-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              title="Force Sync Check"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDismissed(true)}
              className="p-1 hover:bg-amber-700/80 rounded-md text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
