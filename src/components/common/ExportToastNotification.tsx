import React, { useState, useEffect } from 'react';
import {
  Download,
  CheckCircle2,
  Copy,
  Check,
  X,
  FileCode,
  FileSpreadsheet,
  FileText,
  Sparkles,
  FolderDown
} from 'lucide-react';

export interface ExportEventDetail {
  filename: string;
  format?: string;
  mimeType?: string;
  path?: string;
  size?: number;
  timestamp?: string;
}

export const ExportToastNotification: React.FC = () => {
  const [activeExport, setActiveExport] = useState<ExportEventDetail | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleExportEvent = (e: CustomEvent<ExportEventDetail>) => {
      if (e.detail) {
        setActiveExport(e.detail);
        setCopied(false);
      }
    };

    window.addEventListener('nihomi-export-download' as any, handleExportEvent);

    return () => {
      window.removeEventListener('nihomi-export-download' as any, handleExportEvent);
    };
  }, []);

  useEffect(() => {
    if (!activeExport) return;
    const timer = setTimeout(() => {
      setActiveExport(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeExport]);

  const copyPath = () => {
    if (!activeExport?.path) return;
    navigator.clipboard.writeText(activeExport.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!activeExport) return null;

  const isAnki = activeExport.filename.includes('.csv');
  const isJson = activeExport.filename.includes('.json');
  const isPdf = activeExport.filename.includes('.pdf');

  return (
    <div
      id="nihomi-export-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] sm:w-96 bg-stone-900/95 dark:bg-stone-950/95 text-white p-4 rounded-2xl border border-stone-700 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 text-left transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        
        {/* Left Icon */}
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
          {isJson ? (
            <FileCode className="w-5 h-5" />
          ) : isAnki ? (
            <FileSpreadsheet className="w-5 h-5" />
          ) : (
            <FolderDown className="w-5 h-5" />
          )}
        </div>

        {/* Middle Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Export Complete
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <h4 className="text-xs font-bold text-white truncate" title={activeExport.filename}>
            {activeExport.filename}
          </h4>

          {/* Download Path Preview Pill */}
          <div className="mt-1.5 pt-1.5 border-t border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 block font-medium">Download Destination:</span>
            <div className="flex items-center justify-between gap-2 p-1.5 bg-stone-950 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-300">
              <span className="truncate" title={activeExport.path}>
                {activeExport.path || `~/Downloads/${activeExport.filename}`}
              </span>
              <button
                type="button"
                onClick={copyPath}
                className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition shrink-0 cursor-pointer"
                title="Copy local download path"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setActiveExport(null)}
          className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition shrink-0 cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
