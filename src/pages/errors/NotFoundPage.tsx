import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search, MapPinOff } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/[0.03]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-danger-500/5 blur-3xl dark:bg-danger-500/[0.03]" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Animated illustration */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-surface-200 dark:border-surface-700 animate-[spin_20s_linear_infinite]" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-surface-200/60 dark:border-surface-700/60 animate-[spin_15s_linear_infinite_reverse]" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 shadow-lg shadow-primary-500/10 ring-1 ring-primary-200/50 dark:from-primary-500/20 dark:to-primary-500/5 dark:ring-primary-500/20 dark:shadow-primary-500/5">
                <MapPinOff size={40} className="text-primary-600 dark:text-primary-400" />
              </div>
              {/* Floating search icon */}
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-surface-100 dark:bg-surface-800 dark:ring-surface-700" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <Search size={14} className="text-surface-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:ring-primary-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
            Error 404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-base text-surface-500 dark:text-surface-400 mb-2 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-surface-400 dark:text-surface-500 mb-8 font-mono">
          {location.pathname}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full sm:w-auto"
          >
            <Home size={18} />
            Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-xs text-surface-400 dark:text-surface-600">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
