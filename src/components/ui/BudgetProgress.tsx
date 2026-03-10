import type { ReactNode } from 'react';
import type { Budget, BudgetPeriod } from '../../types';
import { categoryLabels, categoryColors } from '../../data/mockData';

const periodLabels: Record<BudgetPeriod, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
  custom: 'Custom',
};

function getBudgetPeriodRange(period: BudgetPeriod, startDate?: string, endDate?: string): { start: string; end: string } {
  if (period === 'custom' && startDate && endDate) {
    return { start: startDate, end: endDate };
  }

  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const toIsoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  if (period === 'weekly') {
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: toIsoDate(monday), end: toIsoDate(sunday) };
  }

  if (period === 'quarterly') {
    const quarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), quarter * 3, 1);
    const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }

  if (period === 'yearly') {
    return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toIsoDate(start), end: toIsoDate(end) };
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatCompactDate(value: string, referenceYear: number): string {
  const date = parseDate(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== referenceYear ? { year: 'numeric' } : {}),
  }).format(date);
}

function getCustomDurationLabel(startDate: string, endDate: string): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const monthCount = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  const isWholeMonthRange =
    start.getDate() === 1 &&
    end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();

  if (isWholeMonthRange && monthCount > 0) {
    return `${monthCount} month${monthCount === 1 ? '' : 's'}`;
  }

  const dayCount = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  return `${dayCount} day${dayCount === 1 ? '' : 's'}`;
}

function getBudgetBadgeLabel(budget: Budget): string {
  const period = budget.period ?? 'monthly';
  const { start, end } = getBudgetPeriodRange(period, budget.startDate, budget.endDate);
  const referenceYear = new Date().getFullYear();
  const rangeLabel = `${formatCompactDate(start, referenceYear)} - ${formatCompactDate(end, referenceYear)}`;

  if (period === 'custom' && budget.startDate && budget.endDate) {
    return `${getCustomDurationLabel(budget.startDate, budget.endDate)} • ${rangeLabel}`;
  }

  return `${periodLabels[period]} • ${rangeLabel}`;
}

interface BudgetProgressProps {
  budget: Budget;
  actions?: ReactNode;
}

export default function BudgetProgress({ budget, actions }: BudgetProgressProps) {
  const percent = Math.min((budget.spent / budget.limit) * 100, 100);
  const remaining = budget.limit - budget.spent;
  const color = categoryColors[budget.category] || '#64748b';
  const barColor = percent > 90 ? '#ef4444' : percent > 70 ? '#f59e0b' : color;
  const badgeLabel = getBudgetBadgeLabel(budget);

  return (
    <div className="w-full space-y-3">
      {/* Category name + color dot */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="truncate text-base font-semibold text-surface-900 dark:text-white">
            {categoryLabels[budget.category]}
          </span>
        </div>
        <div className="grid w-full min-w-0 grid-cols-[1fr_auto] items-center gap-2 sm:flex sm:w-auto sm:shrink-0 sm:grid-cols-none">
          <span className="min-w-0 truncate rounded-md bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500 dark:bg-surface-700 dark:text-surface-400">
            {badgeLabel}
          </span>
          <div className="flex items-center justify-end gap-1">
            {actions}
          </div>
        </div>
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
