import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading data. Please try again.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    if (!onRetry) return;
    setIsRetrying(true);
    // Simulate async retry with brief delay
    setTimeout(() => {
      onRetry();
      setIsRetrying(false);
    }, 1000);
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* Icon container with danger background */}
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger-50 dark:bg-danger-500/10 ring-1 ring-danger-100 dark:ring-danger-500/20">
          <AlertTriangle size={32} className="text-danger-500 dark:text-danger-400" />
        </div>
        {/* Pulsing dot to indicate error */}
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-danger-500 animate-pulse" />
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-surface-700 dark:text-surface-300 mb-1.5 text-center">
        {title}
      </h3>
      <p className="text-sm text-surface-400 dark:text-surface-500 max-w-sm text-center leading-relaxed">
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="btn-secondary mt-5"
        >
          <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
    </div>
  );
}
