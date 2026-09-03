import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  errorMsg: string;
  errorStack?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: '',
    errorStack: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMsg: error.message || 'Unknown UI Error',
      errorStack: error.stack || ''
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nihomi Telemetry Caught UI Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-2xl mx-auto my-12">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4 text-xl font-bold shadow-sm">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Component Failed to Load</h2>
          <p className="text-xs text-neutral-500 mb-4">
            {this.props.fallbackMessage || 'An unexpected rendering error occurred.'}
          </p>

          {/* Real-time Diagnostic Log */}
          <div className="w-full bg-neutral-950 text-rose-400 p-4 rounded-2xl text-left font-mono text-xs overflow-x-auto shadow-inner mb-6 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Diagnostic Reason:</div>
            <div className="font-semibold text-rose-300">{this.state.errorMsg}</div>
            {this.state.errorStack && (
              <div className="text-neutral-500 text-[11px] mt-2 whitespace-pre-wrap max-h-36 overflow-y-auto">
                {this.state.errorStack.split('\n').slice(0, 4).join('\n')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow transition-all"
            >
              Try Again
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold border border-neutral-300 transition-all"
            >
              Clear Cache & Reset
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;