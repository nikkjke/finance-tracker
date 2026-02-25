import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft, Lock, KeyRound } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-warning-500/5 blur-3xl dark:bg-warning-500/[0.03]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/[0.03]" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Animated illustration */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-warning-200 dark:border-warning-500/20 animate-[spin_20s_linear_infinite]" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-warning-200/60 dark:border-warning-500/10 animate-[spin_15s_linear_infinite_reverse]" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-warning-100 to-warning-50 shadow-lg shadow-warning-500/10 ring-1 ring-warning-200/50 dark:from-warning-500/20 dark:to-warning-500/5 dark:ring-warning-500/20 dark:shadow-warning-500/5">
                <Lock size={40} className="text-warning-600 dark:text-warning-400" />
              </div>
              {/* Floating key icon */}
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-surface-100 dark:bg-surface-800 dark:ring-surface-700" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <KeyRound size={14} className="text-warning-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-warning-50 px-4 py-1.5 text-sm font-semibold text-warning-700 ring-1 ring-warning-100 dark:bg-warning-500/10 dark:text-warning-400 dark:ring-warning-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse" />
            Error 401
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-3">
          Authentication Required
        </h1>

        {/* Description */}
        <p className="text-base text-surface-500 dark:text-surface-400 mb-2 max-w-md mx-auto leading-relaxed">
          You need to sign in before accessing this page. Please log in with your credentials to continue.
        </p>
        <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
          Your session may have expired or you haven't logged in yet.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full sm:w-auto"
          >
            <LogIn size={18} />
            Sign In
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
        <div className="mt-8 rounded-lg border border-surface-200 bg-white/50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
