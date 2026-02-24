import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw, ServerCrash, Flame } from 'lucide-react';

export default function ServerErrorPage() {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate a retry attempt with delay
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-danger-500/5 blur-3xl dark:bg-danger-500/[0.03]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-500/[0.03]" />
        {/* Extra glow for dramatic effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-danger-500/[0.03] blur-3xl dark:bg-danger-500/[0.02]" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Animated illustration */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          {/* Outer ring - pulsing */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-danger-200 dark:border-danger-500/20 animate-[spin_20s_linear_infinite]" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-orange-200/60 dark:border-orange-500/10 animate-[spin_15s_linear_infinite_reverse]" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className={`flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-danger-100 to-orange-50 shadow-lg shadow-danger-500/10 ring-1 ring-danger-200/50 dark:from-danger-500/20 dark:to-orange-500/5 dark:ring-danger-500/20 dark:shadow-danger-500/5 transition-transform duration-300 ${isRetrying ? 'scale-95' : ''}`}>
                <ServerCrash size={40} className={`text-danger-600 dark:text-danger-400 transition-transform duration-300 ${isRetrying ? 'animate-pulse' : ''}`} />
              </div>
              {/* Floating flame icon */}
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-surface-100 dark:bg-surface-800 dark:ring-surface-700" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <Flame size={14} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-danger-50 px-4 py-1.5 text-sm font-semibold text-danger-700 ring-1 ring-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-danger-500 animate-pulse" />
            Error 500
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-3">
          Server Error
        </h1>

        {/* Description */}
        <p className="text-base text-surface-500 dark:text-surface-400 mb-2 max-w-md mx-auto leading-relaxed">
          Something went wrong on our end. The server encountered an internal error and couldn't complete your request.
        </p>
        <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
          Our team has been notified and is working on a fix.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="btn-primary w-full sm:w-auto"
          >
            <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full sm:w-auto"
          >
            <Home size={18} />
            Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Technical details card */}
        <div className="mt-8 rounded-lg border border-surface-200 bg-white/50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-2">
            Error Details
          </p>
          <div className="rounded-md bg-surface-100 dark:bg-surface-900 p-3 text-left font-mono text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
            <p><span className="text-danger-500">Status:</span> 500 Internal Server Error</p>
            <p><span className="text-danger-500">Time:</span> {new Date().toLocaleString()}</p>
            <p><span className="text-danger-500">Message:</span> Mock service unavailable</p>
            <p><span className="text-danger-500">Request ID:</span> {`req_${Date.now().toString(36)}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
