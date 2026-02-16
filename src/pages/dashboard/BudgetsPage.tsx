import { useState } from 'react';
import { Plus, Edit2, Trash2, PiggyBank, Receipt, TrendingUp, Tag } from 'lucide-react';
import BudgetProgress from '../../components/ui/BudgetProgress';
import Modal from '../../components/ui/Modal';
import Dropdown from '../../components/ui/Dropdown';
import { mockBudgets, categoryLabels } from '../../data/mockData';
import type { Budget, ExpenseCategory } from '../../types';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('food');
  const [formLimit, setFormLimit] = useState('');

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const handleAdd = () => {
    setEditingBudget(null);
    setFormCategory('food');
    setFormLimit('');
    setShowModal(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormCategory(budget.category);
    setFormLimit(budget.limit.toString());
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSave = () => {
    if (!formLimit || parseFloat(formLimit) <= 0) return;

    if (editingBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editingBudget.id
            ? { ...b, category: formCategory, limit: parseFloat(formLimit) }
            : b
        )
      );
    } else {
      const newBudget: Budget = {
        id: `b-${Date.now()}`,
        userId: '1',
        category: formCategory,
        limit: parseFloat(formLimit),
        spent: 0,
        month: '2026-02',
      };
      setBudgets((prev) => [...prev, newBudget]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Budget Management</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Set and track monthly spending limits per category.
          </p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={18} />
          Add Budget
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Total Budget',
            value: `$${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: PiggyBank,
            valueColor: 'text-surface-900 dark:text-white',
          },
          {
            label: 'Total Spent',
            value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: Receipt,
            valueColor: 'text-surface-900 dark:text-white',
          },
          {
            label: 'Remaining',
            value: `$${(totalBudget - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            valueColor: totalBudget - totalSpent >= 0 ? 'text-success-500' : 'text-danger-500',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:border-surface-700/50 dark:bg-surface-800/80 dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]"
          >
            {/* Shimmer */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
            {/* Corner glow */}
            <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />

            <div className="relative flex items-start justify-between">
              <div className="space-y-3 flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">
                  {card.label}
                </p>
                <p className={`text-2xl font-extrabold tracking-tight truncate ${card.valueColor}`}>
                  {card.value}
                </p>
              </div>
              <div className="relative ml-4 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-sm ring-1 ring-primary-100 transition-all duration-300 group-hover:rotate-6 group-hover:shadow-md group-hover:ring-primary-200 dark:from-primary-500/15 dark:to-primary-500/5 dark:ring-primary-500/20 dark:group-hover:ring-primary-500/30">
                  <card.icon size={20} className="text-primary-600 transition-transform duration-300 group-hover:scale-110 dark:text-primary-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {budgets.map((budget) => (
          <div key={budget.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <BudgetProgress budget={budget} />
              </div>
              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={() => handleEdit(budget)}
                  className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-700 dark:hover:text-surface-300 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="rounded-lg p-2 text-surface-400 hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Category</label>
            <Dropdown
              value={formCategory}
              onChange={(val) => setFormCategory(val as ExpenseCategory)}
              options={(Object.entries(categoryLabels) as [ExpenseCategory, string][]).map(([value, label]) => ({ value, label }))}
              icon={<Tag size={16} />}
              fullWidth
            />
          </div>
          <div>
            <label className="label">Monthly Limit ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formLimit}
              onChange={(e) => setFormLimit(e.target.value)}
              placeholder="0.00"
              className="input"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="btn-primary flex-1">
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </button>
            <button onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
