import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Nihomi Error Boundary caught an unhandled exception]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear potentially corrupt local state
      const keysToClear = [
        'nihomi_theme_mode_v1',
        'nihomi_offline_cache_v2',
        'nihomi_active_tab',
        'nihomi_last_lesson_id',
      ];
      keysToClear.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          id="nihomi-runtime-error-boundary"
          className="min-h-screen bg-[#0a0a12] text-slate-100 flex flex-col items-center justify-center p-6 font-sans"
        >
          <div className="max-w-md w-full bg-[#121222] border border-red-500/30 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-3xl font-bold font-serif shadow-lg shadow-red-500/20">
              日
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Application Recovery
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nihomi encountered an unexpected UI state. Your data is safe. Click below to refresh or reset cached session parameters.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-left overflow-hidden">
                <p className="text-[11px] font-mono text-red-400 truncate">
                  {this.state.error.message || 'Unknown runtime exception'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="btn-reload-nihomi"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Reload Nihomi
              </button>
              <button
                id="btn-reset-cache"
                onClick={this.handleResetCache}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold tracking-wide transition-all border border-slate-700 active:scale-95 cursor-pointer"
              >
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
