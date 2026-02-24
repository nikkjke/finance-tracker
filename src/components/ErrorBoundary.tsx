import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ServerCrash, Flame, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: null, isRetrying: false });
    }, 1500);
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, isRetrying: false });
    window.location.href = '/';
  };

  handleGoBack = () => {
    this.setState({ hasError: false, error: null, isRetrying: false });
    window.history.back();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error, isRetrying } = this.state;

    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-danger-500/5 blur-3xl dark:bg-danger-500/[0.03]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-500/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-danger-500/[0.03] blur-3xl dark:bg-danger-500/[0.02]" />
        </div>

        <div className="relative w-full max-w-lg text-center">
          {/* Animated illustration */}
          <div className="relative mx-auto mb-8 w-48 h-48">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-danger-200 dark:border-danger-500/20 animate-[spin_20s_linear_infinite]" />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-orange-200/60 dark:border-orange-500/10 animate-[spin_15s_linear_infinite_reverse]" />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-danger-100 to-orange-50 shadow-lg shadow-danger-500/10 ring-1 ring-danger-200/50 dark:from-danger-500/20 dark:to-orange-500/5 dark:ring-danger-500/20 dark:shadow-danger-500/5 transition-transform duration-300 ${isRetrying ? 'scale-95' : ''}`}
                >
                  <ServerCrash
                    size={40}
                    className={`text-danger-600 dark:text-danger-400 transition-transform duration-300 ${isRetrying ? 'animate-pulse' : ''}`}
                  />
                </div>
                {/* Floating flame icon */}
                <div
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-surface-100 dark:bg-surface-800 dark:ring-surface-700"
                  style={{ animation: 'float 3s ease-in-out infinite' }}
                >
                  <Flame size={14} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Error badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-danger-50 px-4 py-1.5 text-sm font-semibold text-danger-700 ring-1 ring-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-danger-500 animate-pulse" />
              Runtime Error
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-3">
            Something Broke
          </h1>

          {/* Description */}
          <p className="text-base text-surface-500 dark:text-surface-400 mb-2 max-w-md mx-auto leading-relaxed">
            The application encountered an unexpected error and couldn't recover automatically.
          </p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
            Try refreshing or go back to the homepage.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              disabled={isRetrying}
              className="btn-primary w-full sm:w-auto"
            >
              <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
            <button
              onClick={this.handleGoHome}
              className="btn-secondary w-full sm:w-auto"
            >
              <Home size={18} />
              Go to Homepage
            </button>
            <button
              onClick={this.handleGoBack}
              className="btn-ghost w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Error details (dev-friendly) */}
          {error && (
            <div className="mt-10 rounded-xl border border-surface-200 bg-white/60 p-5 backdrop-blur dark:border-surface-700/50 dark:bg-surface-800/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-3">
                Error Details
              </h3>
              <div className="space-y-2 text-left">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-xs font-medium text-surface-400 dark:text-surface-500 w-16 pt-0.5">
                    Name
                  </span>
                  <span className="text-sm font-mono text-danger-600 dark:text-danger-400 break-all">
                    {error.name}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-xs font-medium text-surface-400 dark:text-surface-500 w-16 pt-0.5">
                    Message
                  </span>
                  <span className="text-sm font-mono text-surface-600 dark:text-surface-300 break-all">
                    {error.message}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-xs font-medium text-surface-400 dark:text-surface-500 w-16 pt-0.5">
                    Time
                  </span>
                  <span className="text-sm font-mono text-surface-600 dark:text-surface-300">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
