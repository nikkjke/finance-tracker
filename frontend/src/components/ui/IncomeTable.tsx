import { Briefcase, Laptop, TrendingUp, Award, Gift, MoreHorizontal, Edit2, Trash2, Building2 } from 'lucide-react';
import type { Income } from '../../types';
import { incomeLabels } from '../../data/mockData';
import EmptyState from './EmptyState';

interface IncomeTableProps {
  income: Income[];
  limit?: number;
  onEdit?: (income: Income) => void;
  onDelete?: (income: Income) => void;
}

const incomeCategoryIcons: Record<string, any> = {
  salary: Briefcase,
  freelance: Laptop,
  investment: TrendingUp,
  bonus: Award,
  gift: Gift,
  other_income: MoreHorizontal,
};

const incomeCategoryColors: Record<string, string> = {
  salary: '#2563eb', // blue-600
  freelance: '#7c3aed', // violet-600
  investment: '#10b981', // emerald-500
  bonus: '#f59e0b', // amber-500
  gift: '#ec4899', // pink-500
  other_income: '#64748b', // slate-500
};

export default function IncomeTable({ income, limit, onEdit, onDelete }: IncomeTableProps) {
  const hasActions = !!(onEdit || onDelete);
  const displayed = limit ? income.slice(0, limit) : income;

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {displayed.map((item) => {
        const CategoryIcon = incomeCategoryIcons[item.category] || MoreHorizontal;
        const catColor = incomeCategoryColors[item.category] || '#64748b';

        return (
          <div
            key={item.id}
            className="group flex items-center gap-4 rounded-xl border border-surface-100 bg-white p-4 transition-all duration-150 hover:border-surface-200 hover:shadow-sm dark:border-surface-700/50 dark:bg-surface-800/50 dark:hover:border-surface-600 dark:hover:bg-surface-800"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: catColor + '15' }}
              >
                <CategoryIcon size={20} style={{ color: catColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">{item.source}</p>
                  <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${item.status === 'completed' ? 'bg-success-50 dark:bg-success-500/10' : 'bg-warning-50 dark:bg-warning-500/10'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${item.status === 'completed' ? 'bg-success-500' : 'bg-warning-500'}`} />
                    <span className={`text-[10px] font-medium ${item.status === 'completed' ? 'text-success-600 dark:text-success-500' : 'text-warning-600 dark:text-warning-500'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                  <span>{incomeLabels[item.category]}</span>
                  {item.notes && (
                    <>
                      <span className="text-surface-300 dark:text-surface-600">&middot;</span>
                      <span className="truncate max-w-[220px]">{item.notes}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-success-600 dark:text-success-500">+${item.amount.toFixed(2)}</p>
              <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-surface-400">
                <Building2 size={12} />
                <span>Deposit</span>
              </div>
            </div>

            {/* Date */}
            <div className="hidden sm:block shrink-0 text-right min-w-[90px]">
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-[10px] text-surface-400 mt-0.5">
                {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric' })}
              </p>
            </div>

            {hasActions && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10 dark:hover:text-danger-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {displayed.length === 0 && (
        <EmptyState
          icon={TrendingUp}
          title="No income records found"
          description="Your income entries will appear here"
          className="rounded-lg border border-surface-200 dark:border-surface-700"
        />
      )}
    </div>
  );
}
