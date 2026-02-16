import type { Budget } from '../../types';
import { categoryLabels, categoryColors } from '../../data/mockData';

interface BudgetProgressProps {
  budget: Budget;
}

export default function BudgetProgress({ budget }: BudgetProgressProps) {
  const percent = Math.min((budget.spent / budget.limit) * 100, 100);
  const remaining = budget.limit - budget.spent;
  const color = categoryColors[budget.category] || '#64748b';
  const barColor = percent > 90 ? '#ef4444' : percent > 70 ? '#f59e0b' : color;

  return (
    <div className="w-full space-y-3">
      {/* Category name + color dot */}
      <div className="flex items-center gap-2.5">
        <div
          className="h-3 w-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-base font-semibold text-surface-900 dark:text-white">
          {categoryLabels[budget.category]}
        </span>
      </div>

      {/* Amount row */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-surface-900 dark:text-white">
            ${budget.spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-sm text-surface-400">
            of ${budget.limit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
        <span className="text-sm font-semibold" style={{ color: barColor }}>
          {percent.toFixed(0)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full rounded-full bg-surface-100 dark:bg-surface-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      {/* Remaining text */}
      <p className={`text-sm font-medium ${
        remaining > 0
          ? 'text-surface-500 dark:text-surface-400'
          : 'text-danger-500'
      }`}>
        {remaining > 0
          ? `$${remaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} remaining`
          : 'Budget exceeded!'}
      </p>
    </div>
  );
}
