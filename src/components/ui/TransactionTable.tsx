import { CreditCard, Banknote, Building2, ScanLine, ShoppingBag, Car, Film, Zap, Heart, GraduationCap, Plane, UtensilsCrossed, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import type { Expense } from '../../types';
import { categoryLabels, categoryColors } from '../../data/mockData';
import EmptyState from './EmptyState';

interface TransactionTableProps {
  expenses: Expense[];
  limit?: number;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

const categoryIcons: Record<string, typeof ShoppingBag> = {
  food: UtensilsCrossed,
  transport: Car,
  entertainment: Film,
  shopping: ShoppingBag,
  bills: Zap,
  health: Heart,
  education: GraduationCap,
  travel: Plane,
  other: MoreHorizontal,
};

const methodConfig: Record<string, { icon: typeof CreditCard; label: string }> = {
  card: { icon: CreditCard, label: 'Card' },
  cash: { icon: Banknote, label: 'Cash' },
  bank_transfer: { icon: Building2, label: 'Bank Transfer' },
  qr_scan: { icon: ScanLine, label: 'QR Scan' },
};

export default function TransactionTable({ expenses, limit, onEdit, onDelete }: TransactionTableProps) {
  const hasActions = !!(onEdit || onDelete);
  const displayed = limit ? expenses.slice(0, limit) : expenses;

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    completed: { bg: 'bg-success-50 dark:bg-success-500/10', text: 'text-success-600 dark:text-success-500', dot: 'bg-success-500' },
    pending: { bg: 'bg-warning-50 dark:bg-warning-500/10', text: 'text-warning-600 dark:text-warning-500', dot: 'bg-warning-500' },
    cancelled: { bg: 'bg-danger-50 dark:bg-danger-500/10', text: 'text-danger-600 dark:text-danger-500', dot: 'bg-danger-500' },
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {displayed.map((expense) => {
        const status = statusConfig[expense.status];
        const CategoryIcon = categoryIcons[expense.category] || MoreHorizontal;
        const catColor = categoryColors[expense.category] || '#64748b';
        const method = methodConfig[expense.paymentMethod] || methodConfig.card;
        const MethodIcon = method.icon;

        return (
          <div
            key={expense.id}
            className="group flex items-center gap-4 rounded-xl border border-surface-100 bg-white p-4 transition-colors duration-150 hover:border-surface-200 hover:shadow-sm dark:border-surface-700/50 dark:bg-surface-800/50 dark:hover:border-surface-600 dark:hover:bg-surface-800"
          >
            {/* Category icon */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: catColor + '15' }}
            >
              <CategoryIcon size={20} style={{ color: catColor }} />
            </div>

            {/* Store + notes */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                  {expense.storeName}
                </p>
                <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${status.bg}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  <span className={`text-[10px] font-medium ${status.text}`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-surface-400">
                <span>{categoryLabels[expense.category]}</span>
                {expense.notes && (
                  <>
                    <span className="text-surface-300 dark:text-surface-600">&middot;</span>
                    <span className="truncate">{expense.notes}</span>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-surface-900 dark:text-white">
                ${expense.amount.toFixed(2)}
              </p>
              <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-surface-400">
                <MethodIcon size={12} />
                <span>{method.label}</span>
              </div>
            </div>

            {/* Date */}
            <div className="hidden sm:block shrink-0 text-right min-w-[90px]">
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {new Date(expense.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-[10px] text-surface-400 mt-0.5">
                {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric' })}
              </p>
            </div>

            {/* Actions */}
            {hasActions && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {onEdit && (
                  <button
                    onClick={() => onEdit(expense)}
                    className="rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(expense)}
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
          icon={ShoppingBag}
          title="No transactions found"
          description="Your transactions will appear here"
          className="rounded-lg border border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/50"
        />
      )}
    </div>
  );
}
