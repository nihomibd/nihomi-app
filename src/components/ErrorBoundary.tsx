import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  autoRetry?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isChunkError: boolean;
  autoRetryCountdown: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryInterval: any = null;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isChunkError: false,
    autoRetryCountdown: 4,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorMsg = error?.message || '';
    const isChunkError =
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Loading chunk') ||
      errorMsg.includes('dynamically imported module') ||
      error?.name === 'ChunkLoadError';

    return {
      hasError: true,
      error,
      isChunkError,
      autoRetryCountdown: 4,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Nihomi Global Crash Protection]:', error, errorInfo);
    this.setState({ errorInfo });

    const errorMsg = error?.message || '';
    const isChunkError =
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Loading chunk') ||
      errorMsg.includes('dynamically imported module');

    // Auto-reload on lazy import failure (max once every 12 seconds to prevent infinite reload loops)
    if (isChunkError && typeof window !== 'undefined') {
      const lastReload = sessionStorage.getItem('nihomi_chunk_fail_ts');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 12000) {
        sessionStorage.setItem('nihomi_chunk_fail_ts', now.toString());
        window.location.reload();
        return;
      }
    }

    // Start auto-recovery countdown
    if (this.props.autoRetry !== false) {
      this.startCountdown();
    }

    // Telemetry logging
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'frontend_exception',
          properties: {
            message: error?.message || 'Unknown error',
            name: error?.name,
            isChunkError,
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        })
      }).catch(() => {});
    } catch {}
  }

  public componentWillUnmount() {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
    }
  }

  private startCountdown = () => {
    if (this.retryInterval) clearInterval(this.retryInterval);
    this.retryInterval = setInterval(() => {
      this.setState((prev) => {
        if (prev.autoRetryCountdown <= 1) {
          clearInterval(this.retryInterval);
          window.location.reload();
          return { autoRetryCountdown: 0 };
        }
        return { autoRetryCountdown: prev.autoRetryCountdown - 1 };
      });
    }, 1000);
  };

  private cancelAutoRetry = () => {
    if (this.retryInterval) {
      clearInterval(this.retryInterval);
      this.retryInterval = null;
    }
    this.setState({ autoRetryCountdown: 0 });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear local keys while preserving essential user credentials
      const keysToClear = [
        'nihomi_theme_mode_v1',
        'nihomi_offline_cache_v2',
        'nihomi_active_tab',
        'nihomi_last_lesson_id',
        'nihomi_chunk_fail_ts'
      ];
      keysToClear.forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          id="nihomi-global-error-recovery"
          className="min-h-screen bg-[#0a0a12] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans select-none"
        >
          <div className="max-w-lg w-full bg-[#121222] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center backdrop-blur-xl relative overflow-hidden">
            {/* Subtle Japanese Background Watermark */}
            <div className="absolute top-2 right-4 text-7xl font-japanese font-black text-white/5 pointer-events-none">
              護
            </div>

            {/* Glowing Icon Badge */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold font-serif shadow-xl shadow-red-600/30">
              日
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>অটো রিকভারি মোড (Crash Protection Active)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                অ্যাপ্লিকেশন রিকভারি প্রটেকশন
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                নিহোমি একটি সাময়িক ব্রাউজার ক্যাশ বা নেটওয়ার্ক বিচ্ছিন্নতার মুখোমুখি হয়েছে। আপনার অ্যাকাউন্টের প্রগ্রেস ও ডেটা সুরক্ষিত আছে।
              </p>
            </div>

            {/* Auto-Retry Timer Notice */}
            {this.state.autoRetryCountdown > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{this.state.autoRetryCountdown} সেকেন্ডে স্বয়ংক্রিয়ভাবে রিলোড হবে...</span>
                </div>
                <button
                  type="button"
                  onClick={this.cancelAutoRetry}
                  className="text-[11px] underline hover:text-amber-100 cursor-pointer font-medium"
                >
                  বাতিল করুন
                </button>
              </div>
            )}

            {/* Error Message Snippet */}
            {this.state.error && (
              <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-left overflow-hidden">
                <p className="text-[11px] font-mono text-red-400 truncate">
                  {this.state.error.message || 'System Runtime State Exception'}
                </p>
                {this.state.isChunkError && (
                  <p className="text-[10px] text-slate-400 pt-1">
                    চিহ্নিত কারণ: নতুন ভার্সন রিলিজের কারণে ক্যাশ আপডেট প্রয়োজন।
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="btn-recover-reload"
                type="button"
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-red-600/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>এখনই রিলোড করুন</span>
              </button>

              <button
                id="btn-recover-reset-cache"
                type="button"
                onClick={this.handleResetCache}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all border border-slate-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ক্যাশ রিসেট ও হোম</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/5">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>নিহোমি হোমপেজে ফিরে যান</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const GlobalErrorBoundary = ErrorBoundary;
export default ErrorBoundary;
