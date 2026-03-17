import { Inbox } from 'lucide-react';
import type { ReactNode, ElementType } from 'react';

interface EmptyStateProps {
  icon?: ElementType;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are no items to display at this time.',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* Icon container with subtle background */}
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800 ring-1 ring-surface-200 dark:ring-surface-700">
          <Icon size={32} className="text-surface-300 dark:text-surface-600" />
        </div>
        {/* Decorative dot */}
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-surface-200 dark:bg-surface-700" />
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-surface-700 dark:text-surface-300 mb-1.5 text-center">
        {title}
      </h3>
      <p className="text-sm text-surface-400 dark:text-surface-500 max-w-xs text-center leading-relaxed">
        {description}
      </p>

      {/* Optional action button */}
      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}
