import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
}

export default function StatCard({ title, value, icon, change, changeLabel }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:border-surface-700/50 dark:bg-surface-800/80 dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
      {/* Animated shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />

      {/* Corner glow */}
      <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />

      <div className="relative flex items-start justify-between">
        {/* Content */}
        <div className="space-y-3 flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">
            {title}
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white truncate">
            {typeof value === 'number' ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : value}
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-sm ring-1 ring-primary-100 transition-all duration-300 group-hover:rotate-6 group-hover:shadow-md group-hover:ring-primary-200 dark:from-primary-500/15 dark:to-primary-500/5 dark:ring-primary-500/20 dark:group-hover:ring-primary-500/30">
            <div className="text-primary-600 transition-transform duration-300 group-hover:scale-110 dark:text-primary-400">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
