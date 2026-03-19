import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, PiggyBank, Receipt, TrendingUp, Tag, Search, Filter, AlertTriangle, Calendar } from 'lucide-react';
import BudgetProgress from '../../components/ui/BudgetProgress';
import DatePicker from '../../components/ui/DatePicker';
import Modal from '../../components/ui/Modal';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { categoryLabels } from '../../data/mockData';
import { sortItems } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import { useBudgets } from '../../contexts/BudgetContext';
import { useExpenses } from '../../contexts/ExpenseContext';
import StatCard from '../../components/ui/StatCard';
import type { Budget, ExpenseCategory, BudgetPeriod } from '../../types';

// ─── Period range helper ──────────────────────────────────────────────────────
function getBudgetPeriodRange(period: BudgetPeriod, startDate?: string, endDate?: string): { start: string; end: string } {
  if (period === 'custom' && startDate && endDate) return { start: startDate, end: endDate };
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (period === 'weekly') {
    const day = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { start: iso(mon), end: iso(sun) };
  }
  if (period === 'quarterly') {
    const q = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), q * 3, 1);
    const end = new Date(now.getFullYear(), q * 3 + 3, 0);
    return { start: iso(start), end: iso(end) };
  }
  if (period === 'yearly') {
    return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
  }
  // monthly (default)
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: iso(start), end: iso(end) };
}

export default function BudgetsPage() {
  const { user } = useAuth();
  const { budgets: allBudgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { expenses } = useExpenses();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('food');
  const [formLimit, setFormLimit] = useState('');
  const [formPeriod, setFormPeriod] = useState<BudgetPeriod>('monthly');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formErrors, setFormErrors] = useState<{ category?: string; limit?: string; startDate?: string; endDate?: string }>({});
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'over-budget' | 'under-budget'>('all');
  const [sortBy, setSortBy] = useState<'limit-asc' | 'limit-desc' | 'spent-asc' | 'spent-desc'>('limit-asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Get user's budgets and calculate spent amounts
  const budgets = useMemo(() => {
    const userBudgets = user ? allBudgets.filter(b => b.userId === user.id) : [];
    const userExpenses = user ? expenses.filter(e => e.userId === user.id) : [];
    
    // Calculate spent for each budget based on actual expenses filtered by period
    return userBudgets.map(budget => {
      const { start, end } = getBudgetPeriodRange(budget.period ?? 'monthly', budget.startDate, budget.endDate);
      const spent = userExpenses
        .filter(e => e.category === budget.category && e.date >= start && e.date <= end)
        .reduce((sum, e) => sum + e.amount, 0);
      return { ...budget, spent };
    });
  }, [allBudgets, expenses, user]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [user?.id]);

  const getFilteredBudgets = () => {
    let result = [...budgets];

    // Apply search by category name
    const categoryNames = categoryLabels as Record<ExpenseCategory, string>;

    // Search by category label (e.g. "Food & Groceries") instead of raw value
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter((b) => {
        const label = categoryNames[b.category]?.toLowerCase() || b.category;
        return label.includes(lower) || b.category.includes(lower);
      });
    }

    // Apply status filter
    if (filterStatus === 'over-budget') {
      result = result.filter((b) => b.spent > b.limit);
    } else if (filterStatus === 'under-budget') {
      result = result.filter((b) => b.spent <= b.limit);
    }

    // Apply sorting
    if (sortBy === 'limit-asc') {
      result = sortItems(result, { key: 'limit', direction: 'asc' });
    } else if (sortBy === 'limit-desc') {
      result = sortItems(result, { key: 'limit', direction: 'desc' });
    } else if (sortBy === 'spent-asc') {
      result = sortItems(result, { key: 'spent', direction: 'asc' });
    } else if (sortBy === 'spent-desc') {
      result = sortItems(result, { key: 'spent', direction: 'desc' });
    }

    return result;
  };

  const filteredBudgets = getFilteredBudgets();

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const handleAdd = () => {
    setEditingBudget(null);
    setFormCategory('food');
    setFormLimit('');
    setFormPeriod('monthly');
    setFormStartDate('');
    setFormEndDate('');
    setFormErrors({});
    setModalError(null);
    setIsSaving(false);
    setShowModal(true);
  };

  const validateForm = (): boolean => {
    const newErrors: { category?: string; limit?: string; startDate?: string; endDate?: string } = {};

    if (!formCategory) {
      newErrors.category = 'Category is required';
    }

    if (!formLimit.trim()) {
      newErrors.limit = 'Limit is required';
    } else if (isNaN(parseFloat(formLimit))) {
      newErrors.limit = 'Limit must be a valid number';
    } else if (parseFloat(formLimit) <= 0) {
      newErrors.limit = 'Limit must be greater than $0';
    }

    if (formPeriod === 'custom') {
      if (!formStartDate) newErrors.startDate = 'Start date is required';
      if (!formEndDate) newErrors.endDate = 'End date is required';
      if (formStartDate && formEndDate && formStartDate > formEndDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSaving || !validateForm() || !user) return;

    setIsSaving(true);
    setModalError(null);

    try {
      if (editingBudget) {
        // Update existing budget
        const result = await updateBudget(editingBudget.id, {
          category: formCategory,
          limit: parseFloat(formLimit),
          period: formPeriod,
          startDate: formPeriod === 'custom' ? formStartDate : undefined,
          endDate: formPeriod === 'custom' ? formEndDate : undefined,
        });

        if (!result.success) {
          setModalError(result.error || 'Failed to update budget');
          return;
        }
      } else {
        // Create new budget
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const result = await addBudget(user.id, {
          category: formCategory,
          limit: parseFloat(formLimit),
          month: currentMonth,
          period: formPeriod,
          startDate: formPeriod === 'custom' ? formStartDate : undefined,
          endDate: formPeriod === 'custom' ? formEndDate : undefined,
        });

        if (!result.success) {
          setModalError(result.error || 'Failed to create budget');
          return;
        }
      }

      setShowModal(false);
      setModalError(null);
      setFormErrors({});
    } catch {
      setModalError('Something went wrong while saving the budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormCategory(budget.category);
    setFormLimit(budget.limit.toString());
    setFormPeriod(budget.period ?? 'monthly');
    setFormStartDate(budget.startDate ?? '');
    setFormEndDate(budget.endDate ?? '');
    setFormErrors({});
    setModalError(null);
    setIsSaving(false);
    setShowModal(true);
  };

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteConfirmId) {
      const result = await deleteBudget(deleteConfirmId);
      if (!result.success) {
        setError(result.error || 'Failed to delete budget');
      }
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, deleteBudget]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Budget Management</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Set and track spending limits per category and time period.
          </p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={18} />
          Add Budget
        </button>
      </div>

      {/* Search, Filter, Sort Controls */}
      {!isLoading && !error && budgets.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search by category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <Dropdown
              value={filterStatus}
              onChange={(val) => setFilterStatus(val as typeof filterStatus)}
              options={[
                { value: 'all', label: 'All Budgets' },
                { value: 'under-budget', label: 'Under Budget' },
                { value: 'over-budget', label: 'Over Budget' },
              ]}
              icon={<Filter size={16} />}
            />
            <Dropdown
              value={sortBy}
              onChange={(val) => setSortBy(val as typeof sortBy)}
              options={[
                { value: 'limit-asc', label: 'Limit: Low to High' },
                { value: 'limit-desc', label: 'Limit: High to Low' },
                { value: 'spent-asc', label: 'Spent: Low to High' },
                { value: 'spent-desc', label: 'Spent: High to Low' },
              ]}
              minWidth="min-w-[195px]"
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="card flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading budgets...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="card">
          <ErrorState
            title="Failed to load budgets"
            message={error}
            onRetry={() => setError(null)}
          />
        </div>
      )}

      {/* Content (only when loaded and no error) */}
      {!isLoading && !error && (
        <>
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Budget"
          value={totalBudget}
          icon={<PiggyBank size={20} />}
        />
        <StatCard
          title="Total Spent"
          value={totalSpent}
          icon={<Receipt size={20} />}
        />
        <StatCard
          title="Remaining"
          value={totalBudget - totalSpent}
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={PiggyBank}
            title="No budgets yet"
            description="Create your first budget to start tracking your spending limits by category."
            className="rounded-lg border border-surface-200 dark:border-surface-700"
          />
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={PiggyBank}
            title="No results found"
            description="Try adjusting your search or filter criteria."
            className="rounded-lg border border-surface-200 dark:border-surface-700"
            action={
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setSortBy('limit-asc');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            }
          />
        </div>
      ) : (
      <div className="grid gap-5 sm:grid-cols-2">
        {filteredBudgets.map((budget) => (
          <div key={budget.id} className="card hover:shadow-md transition-shadow duration-200">
            <BudgetProgress
              budget={budget}
              actions={(
                <div className="flex items-center gap-1">
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
              )}
            />
          </div>
        ))}
      </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setModalError(null); }}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <div className="space-y-4">
          {modalError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-400">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}
          <div>
            <label className="label">Category</label>
            <Dropdown
              value={formCategory}
              onChange={(val) => setFormCategory(val as ExpenseCategory)}
              options={(Object.entries(categoryLabels) as [ExpenseCategory, string][]).map(([value, label]) => ({ value, label }))}
              icon={<Tag size={16} />}
              fullWidth
            />
            {formErrors.category && (
              <p className="mt-1 text-sm text-danger-500">{formErrors.category}</p>
            )}
          </div>
          <div>
            <label className="label">Budget Period</label>
            <Dropdown
              value={formPeriod}
              onChange={(val) => {
                setFormPeriod(val as BudgetPeriod);
                setFormStartDate('');
                setFormEndDate('');
                setFormErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
              }}
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
                { value: 'custom', label: 'Custom range' },
              ]}
              icon={<Calendar size={16} />}
              fullWidth
            />
          </div>
          {formPeriod === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <DatePicker
                  value={formStartDate}
                  onChange={setFormStartDate}
                  label="Start Date"
                  error={!!formErrors.startDate}
                />
                {formErrors.startDate && (
                  <p className="mt-1 text-sm text-danger-500">{formErrors.startDate}</p>
                )}
              </div>
              <div>
                <DatePicker
                  value={formEndDate}
                  onChange={setFormEndDate}
                  label="End Date"
                  error={!!formErrors.endDate}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-sm text-danger-500">{formErrors.endDate}</p>
                )}
              </div>
            </div>
          )}
          <div>
            <label className="label">Spending Limit ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formLimit}
              onChange={(e) => setFormLimit(e.target.value)}
              placeholder="0.00"
              className={`input ${formErrors.limit ? 'border-danger-300 dark:border-danger-500' : ''}`}
            />
            {formErrors.limit && (
              <p className="mt-1 text-sm text-danger-500">{formErrors.limit}</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`btn-primary flex-1 ${isSaving ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size={16} className="text-current" />
                  Saving...
                </span>
              ) : (
                editingBudget ? 'Save Changes' : 'Create Budget'
              )}
            </button>
            <button
              onClick={() => {
                if (isSaving) return;
                setShowModal(false);
                setModalError(null);
              }}
              disabled={isSaving}
              className={`btn-secondary ${isSaving ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Budget"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/10">
              <AlertTriangle size={20} className="text-danger-500" />
            </div>
            <div>
              <p className="text-sm text-surface-700 dark:text-surface-300">
                Are you sure you want to delete this budget? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={confirmDelete} className="btn-danger flex-1">
              Delete Budget
            </button>
            <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
        </>
      )}
    </div>
  );
}
