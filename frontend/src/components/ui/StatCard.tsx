import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  isCurrency?: boolean;
}

export default function StatCard({ title, value, icon, change, changeLabel, isCurrency = true }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white p-5 transition-all duration-300 hover:border-primary-200/60 hover:shadow-md dark:border-surface-700/50 dark:bg-surface-800/80 dark:hover:border-primary-500/25">

      <div className="relative flex items-start justify-between">
        {/* Content */}
        <div className="space-y-3 flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">
            {title}
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white truncate">
            {typeof value === 'number' 
              ? (isCurrency 
                  ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                  : value.toLocaleString('en-US')) 
              : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isNeutral
                    ? 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                    : isPositive
                    ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                    : 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400'
                }`}
              >
                {isNeutral ? (
                  <Minus size={12} />
                ) : isPositive ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {change >= 0 ? '+' : ''}{change}%
              </div>
              {changeLabel && (
                <span className="text-[11px] text-surface-400 dark:text-surface-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="relative ml-4 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-sm ring-1 ring-primary-100 transition-all duration-300 group-hover:shadow-md group-hover:ring-primary-200 dark:from-primary-500/15 dark:to-primary-500/5 dark:ring-primary-500/20 dark:group-hover:ring-primary-500/30">
            <div className="text-primary-600 dark:text-primary-400">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
