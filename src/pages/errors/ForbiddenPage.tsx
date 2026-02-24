import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShieldOff, Ban } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const goHome = () => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-danger-500/5 blur-3xl dark:bg-danger-500/[0.03]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-warning-500/5 blur-3xl dark:bg-warning-500/[0.03]" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Animated illustration */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-danger-200 dark:border-danger-500/20 animate-[spin_20s_linear_infinite]" />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-danger-200/60 dark:border-danger-500/10 animate-[spin_15s_linear_infinite_reverse]" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-danger-100 to-danger-50 shadow-lg shadow-danger-500/10 ring-1 ring-danger-200/50 dark:from-danger-500/20 dark:to-danger-500/5 dark:ring-danger-500/20 dark:shadow-danger-500/5">
                <ShieldOff size={40} className="text-danger-600 dark:text-danger-400" />
              </div>
              {/* Floating ban icon */}
              <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-surface-100 dark:bg-surface-800 dark:ring-surface-700" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <Ban size={14} className="text-danger-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-danger-50 px-4 py-1.5 text-sm font-semibold text-danger-700 ring-1 ring-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-danger-500 animate-pulse" />
            Error 403
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-3">
          Access Forbidden
        </h1>

        {/* Description */}
        <p className="text-base text-surface-500 dark:text-surface-400 mb-2 max-w-md mx-auto leading-relaxed">
          You don't have permission to access this page. This area is restricted to authorized roles only.
        </p>
        <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
          {isAuthenticated
            ? `Logged in as ${user?.name} (${user?.role})`
            : 'You are not logged in'}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={goHome}
            className="btn-primary w-full sm:w-auto"
          >
            <Home size={18} />
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Homepage'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Info card */}
        <div className="mt-8 rounded-lg border border-danger-100 bg-danger-50/50 p-4 dark:border-danger-500/10 dark:bg-danger-500/5">
          <div className="flex items-start gap-3 text-left">
            <ShieldOff size={18} className="mt-0.5 shrink-0 text-danger-500 dark:text-danger-400" />
            <div>
              <p className="text-sm font-medium text-danger-800 dark:text-danger-300">
                Why am I seeing this?
              </p>
              <p className="mt-1 text-xs text-danger-600/80 dark:text-danger-400/70 leading-relaxed">
                Your current role does not have the required permissions for this section. 
                If you believe this is an error, contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
