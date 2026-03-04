import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Filter, Calendar, CalendarDays, ArrowUpRight, Hash, BarChart3, Search, ArrowUpDown, Wallet, ListFilter, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import TransactionTable from '../../components/ui/TransactionTable';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import { categoryLabels, incomeLabels } from '../../data/mockData';
import { useExpenses } from '../../contexts/ExpenseContext';
import { useIncome } from '../../contexts/IncomeContext';
import { useAuth } from '../../contexts/AuthContext';
import { applyFilters, presetToDateRange, exportReport } from '../../services';
import type { FilterPipelineConfig, SortConfig } from '../../services/filterService';
import type { Expense, Income, ExpenseCategory, PaymentMethod, IncomeCategory } from '../../types';

export default function ReportsPage() {
  const { expenses: storeExpenses, updateExpense, deleteExpense } = useExpenses();
  const { income: storeIncome, updateIncome, deleteIncome } = useIncome();
  const { user } = useAuth();

  // Filter by current user (stable references via useMemo)
  const userExpenses = useMemo(() => storeExpenses.filter((e) => !user || e.userId === user.id), [storeExpenses, user]);
  const userIncome = useMemo(() => storeIncome.filter((i) => !user || i.userId === user.id), [storeIncome, user]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('6months');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [incomeSearchQuery, setIncomeSearchQuery] = useState('');
  const [incomeDateRange, setIncomeDateRange] = useState('6months');
  const [incomeCategoryFilter, setIncomeCategoryFilter] = useState('all');
  const [incomeStatusFilter, setIncomeStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [incomeSortBy, setIncomeSortBy] = useState('date-desc');
  const [incomePage, setIncomePage] = useState(1);
  const [incomeItemsPerPage, setIncomeItemsPerPage] = useState(5);

  // ── Expense edit / delete state ──
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({ storeName: '', amount: '', category: 'food' as ExpenseCategory, date: '', notes: '', paymentMethod: 'card' as PaymentMethod });

  // ── Income edit / delete state ──
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [deletingIncome, setDeletingIncome] = useState<Income | null>(null);
  const [incomeForm, setIncomeForm] = useState({ source: '', amount: '', category: 'salary' as IncomeCategory, date: '', notes: '' });

  // ── Expense handlers ──
  const handleEditExpense = useCallback((expense: Expense) => {
    setExpenseForm({
      storeName: expense.storeName,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes ?? '',
      paymentMethod: expense.paymentMethod,
    });
    setEditingExpense(expense);
  }, []);

  const handleSaveExpense = useCallback(async () => {
    if (!editingExpense) return;
    await updateExpense(editingExpense.id, {
      storeName: expenseForm.storeName.trim(),
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      date: expenseForm.date,
      notes: expenseForm.notes || undefined,
      paymentMethod: expenseForm.paymentMethod,
    });
    setEditingExpense(null);
  }, [editingExpense, expenseForm, updateExpense]);

  const handleDeleteExpense = useCallback((expense: Expense) => {
    setDeletingExpense(expense);
  }, []);

  const confirmDeleteExpense = useCallback(async () => {
    if (!deletingExpense) return;
    await deleteExpense(deletingExpense.id);
    setDeletingExpense(null);
  }, [deletingExpense, deleteExpense]);

  // ── Income handlers ──
  const handleEditIncome = useCallback((income: Income) => {
    setIncomeForm({
      source: income.source,
      amount: income.amount.toString(),
      category: income.category,
      date: income.date,
      notes: income.notes ?? '',
    });
    setEditingIncome(income);
  }, []);

  const handleSaveIncome = useCallback(async () => {
    if (!editingIncome) return;
    await updateIncome(editingIncome.id, {
      source: incomeForm.source.trim(),
      amount: parseFloat(incomeForm.amount),
      category: incomeForm.category,
      date: incomeForm.date,
      notes: incomeForm.notes || undefined,
    });
    setEditingIncome(null);
  }, [editingIncome, incomeForm, updateIncome]);

  const handleDeleteIncome = useCallback((income: Income) => {
    setDeletingIncome(income);
  }, []);

  const confirmDeleteIncome = useCallback(async () => {
    if (!deletingIncome) return;
    await deleteIncome(deletingIncome.id);
    setDeletingIncome(null);
  }, [deletingIncome, deleteIncome]);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const sortConfig: SortConfig<Expense> =
    sortBy === 'amount-asc'
      ? { key: 'amount', direction: 'asc' as const }
      : sortBy === 'amount-desc'
        ? { key: 'amount', direction: 'desc' as const }
        : sortBy === 'date-asc'
          ? { key: 'date', direction: 'asc' as const }
          : sortBy === 'store-asc'
            ? { key: 'storeName', direction: 'asc' as const }
            : { key: 'date', direction: 'desc' as const };

  const filterConfig: FilterPipelineConfig<Expense> = {
    searchQuery,
    searchFields: ['storeName', 'notes'],
    filters: {
      category: categoryFilter,
      status: statusFilter,
    },
    sort: sortConfig,
    dateField: 'date',
    dateRange: presetToDateRange(dateRange as '7days' | '30days' | '6months' | '1year'),
  };

  const filteredResult = applyFilters(userExpenses, filterConfig);

  const pipelineResult = applyFilters(userExpenses, {
    ...filterConfig,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const filteredExpenses = filteredResult.items;
  const filteredExpensesCount = filteredResult.totalItems;
  const paginatedExpenses = pipelineResult.items;
  const totalPages = pipelineResult.pagination?.totalPages ?? 1;

  const incomeSortConfig: SortConfig<Income> =
    incomeSortBy === 'amount-asc'
      ? { key: 'amount', direction: 'asc' as const }
      : incomeSortBy === 'amount-desc'
        ? { key: 'amount', direction: 'desc' as const }
        : incomeSortBy === 'date-asc'
          ? { key: 'date', direction: 'asc' as const }
          : incomeSortBy === 'source-asc'
            ? { key: 'source', direction: 'asc' as const }
            : { key: 'date', direction: 'desc' as const };

  const incomeFilterConfig: FilterPipelineConfig<Income> = {
    searchQuery: incomeSearchQuery,
    searchFields: ['source', 'notes'],
    filters: {
      category: incomeCategoryFilter,
      status: incomeStatusFilter,
    },
    sort: incomeSortConfig,
    dateField: 'date',
    dateRange: presetToDateRange(incomeDateRange as '7days' | '30days' | '6months' | '1year'),
  };

  const filteredIncomeResult = applyFilters(userIncome, incomeFilterConfig);

  const incomePipelineResult = applyFilters(userIncome, {
    ...incomeFilterConfig,
    page: incomePage,
    pageSize: incomeItemsPerPage,
  });

  const filteredIncomeCount = filteredIncomeResult.totalItems;
  const paginatedIncome = incomePipelineResult.items;
  const totalIncomePages = incomePipelineResult.pagination?.totalPages ?? 1;

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const highestExpense = filteredExpenses.reduce((max, expense) => Math.max(max, expense.amount), 0);
  const averageExpense = filteredExpensesCount > 0 ? totalSpent / filteredExpensesCount : 0;

  const sortedAmounts = [...filteredExpenses].map((expense) => expense.amount).sort((a, b) => a - b);
  const medianExpense =
    sortedAmounts.length === 0
      ? 0
      : sortedAmounts.length % 2 === 0
        ? (sortedAmounts[sortedAmounts.length / 2 - 1] + sortedAmounts[sortedAmounts.length / 2]) / 2
        : sortedAmounts[Math.floor(sortedAmounts.length / 2)];

  const activeDateRange = presetToDateRange(dateRange as '7days' | '30days' | '6months' | '1year');
  const daysInRange = Math.max(1, Math.ceil((activeDateRange.end.getTime() - activeDateRange.start.getTime()) / (1000 * 60 * 60 * 24)));
  const averageDaily = totalSpent / daysInRange;

  const merchantMap = filteredExpenses.reduce<Record<string, { total: number; count: number }>>((acc, expense) => {
    const key = expense.storeName.trim() || 'Unknown';
    if (!acc[key]) {
      acc[key] = { total: 0, count: 0 };
    }
    acc[key].total += expense.amount;
    acc[key].count += 1;
    return acc;
  }, {});

  const topMerchants = Object.entries(merchantMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const categoryMap = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      share: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, dateRange, sortBy]);

  useEffect(() => {
    setIncomePage(1);
  }, [userIncome]);

  useEffect(() => {
    setIncomePage(1);
  }, [incomeSearchQuery, incomeCategoryFilter, incomeStatusFilter, incomeDateRange, incomeSortBy]);

  const handleExportReport = async () => {
    await exportReport('financial', {
      expenses: filteredExpenses,
      income: paginatedIncome,
      summary: {
        totalSpent,
        totalIncome: paginatedIncome.reduce((sum, inc) => sum + inc.amount, 0),
        periodStart: presetToDateRange(dateRange as '7days' | '30days' | '6months' | '1year').start,
        periodEnd: presetToDateRange(dateRange as '7days' | '30days' | '6months' | '1year').end,
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Analyze your spending patterns and trends.
          </p>
        </div>
        <button className="btn-secondary" onClick={handleExportReport}>
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500" />
          {filteredExpensesCount} transactions found
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search store or notes..."
            className="input w-full pl-9"
          />
        </div>
        <Dropdown
          value={dateRange}
          onChange={setDateRange}
          icon={<Calendar size={16} />}
          options={[
            { value: '7days', label: 'Last 7 Days' },
            { value: '30days', label: 'Last 30 Days' },
            { value: '6months', label: 'Last 6 Months' },
            { value: '1year', label: 'Last Year' },
          ]}
        />
        <Dropdown
          value={categoryFilter}
          onChange={setCategoryFilter}
          icon={<Filter size={16} />}
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'food', label: 'Food & Groceries' },
            { value: 'transport', label: 'Transport' },
            { value: 'entertainment', label: 'Entertainment' },
            { value: 'shopping', label: 'Shopping' },
            { value: 'bills', label: 'Bills & Utilities' },
            { value: 'health', label: 'Health' },
            { value: 'education', label: 'Education' },
            { value: 'travel', label: 'Travel' },
          ]}
        />
        <Dropdown
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as typeof statusFilter)}
          icon={<Filter size={16} />}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
        <Dropdown
          value={sortBy}
          onChange={setSortBy}
          icon={<ArrowUpDown size={16} />}
          options={[
            { value: 'date-desc', label: 'Date: Newest First' },
            { value: 'date-asc', label: 'Date: Oldest First' },
            { value: 'amount-desc', label: 'Amount: High to Low' },
            { value: 'amount-asc', label: 'Amount: Low to High' },
            { value: 'store-asc', label: 'Store: A-Z' },
          ]}
          minWidth="min-w-[220px]"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading reports...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="card">
          <ErrorState
            title="Failed to load reports"
            message={error}
            onRetry={() => setError(null)}
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && userExpenses.length === 0 && (
        <div className="card">
          <EmptyState
            icon={BarChart3}
            title="No report data available"
            description="There are no transactions to generate reports from. Add some expenses to see analytics."
            className="rounded-lg border border-surface-200 dark:border-surface-700"
          />
        </div>
      )}

      {/* Content (only when loaded, no error, and has data) */}
      {!isLoading && !error && userExpenses.length > 0 && (
        <>
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Average Daily',
            value: `$${averageDaily.toFixed(2)}`,
            icon: CalendarDays,
            valueColor: 'text-surface-900 dark:text-white',
          },
          {
            label: 'Highest Expense',
            value: `$${highestExpense.toFixed(2)}`,
            icon: ArrowUpRight,
            valueColor: 'text-surface-900 dark:text-white',
          },
          {
            label: 'Total Transactions',
            value: filteredExpensesCount.toString(),
            icon: Hash,
            valueColor: 'text-surface-900 dark:text-white',
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

      {/* All Transactions (Top) */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-6">
          All Transactions
        </h2>
        <div className="space-y-4">
          <TransactionTable expenses={paginatedExpenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
          {filteredExpensesCount > 0 && (
            <div className="border-t border-surface-200 pt-4 dark:border-surface-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(count) => {
                  setItemsPerPage(count);
                  setCurrentPage(1);
                }}
                totalItems={filteredExpensesCount}
                loading={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            All Income
          </h2>
          <p className="text-xs text-surface-400 dark:text-surface-500">{filteredIncomeCount} entries found</p>
        </div>
        <div className="space-y-5">

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                value={incomeSearchQuery}
                onChange={(e) => setIncomeSearchQuery(e.target.value)}
                placeholder="Search source or notes..."
                className="input w-full pl-9"
              />
            </div>

            <Dropdown
              value={incomeDateRange}
              onChange={setIncomeDateRange}
              icon={<CalendarDays size={16} />}
              options={[
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '6months', label: 'Last 6 Months' },
                { value: '1year', label: 'Last Year' },
              ]}
            />

            <Dropdown
              value={incomeCategoryFilter}
              onChange={setIncomeCategoryFilter}
              icon={<Filter size={16} />}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'salary', label: 'Salary' },
                { value: 'freelance', label: 'Freelance' },
                { value: 'investment', label: 'Investment' },
                { value: 'bonus', label: 'Bonus' },
                { value: 'gift', label: 'Gift' },
                { value: 'other_income', label: 'Other Income' },
              ]}
            />

            <Dropdown
              value={incomeStatusFilter}
              onChange={(val) => setIncomeStatusFilter(val as typeof incomeStatusFilter)}
              icon={<Filter size={16} />}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
              ]}
            />

            <Dropdown
              value={incomeSortBy}
              onChange={setIncomeSortBy}
              icon={<ArrowUpDown size={16} />}
              options={[
                { value: 'date-desc', label: 'Date: Newest First' },
                { value: 'date-asc', label: 'Date: Oldest First' },
                { value: 'amount-desc', label: 'Amount: High to Low' },
                { value: 'amount-asc', label: 'Amount: Low to High' },
                { value: 'source-asc', label: 'Source: A-Z' },
              ]}
              minWidth="min-w-[220px]"
            />
          </div>

          <div className="space-y-3">
            {paginatedIncome.length === 0 ? (
              <div className="rounded-xl border border-dashed border-surface-300 px-4 py-10 text-center dark:border-surface-700">
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">No income records found</p>
                <p className="mt-1 text-xs text-surface-400">Try adjusting your filters or add a new income entry.</p>
              </div>
            ) : (
              paginatedIncome.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3 dark:border-surface-700 dark:bg-surface-800/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-surface-900 dark:text-white">{entry.source}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                      <span>{incomeLabels[entry.category]}</span>
                      <span>•</span>
                      <span>{new Date(entry.date).toLocaleDateString('en-US')}</span>
                      {entry.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[220px]">{entry.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-success-600 dark:text-success-500">+${entry.amount.toFixed(2)}</p>
                      <p className={`mt-1 text-[11px] font-medium ${entry.status === 'completed' ? 'text-success-600 dark:text-success-500' : 'text-warning-600 dark:text-warning-500'}`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <button
                        onClick={() => handleEditIncome(entry)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteIncome(entry)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10 dark:hover:text-danger-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredIncomeCount > 0 && (
            <div className="border-t border-surface-200 pt-4 dark:border-surface-700">
              <Pagination
                currentPage={incomePage}
                totalPages={totalIncomePages}
                onPageChange={setIncomePage}
                itemsPerPage={incomeItemsPerPage}
                onItemsPerPageChange={(count) => {
                  setIncomeItemsPerPage(count);
                  setIncomePage(1);
                }}
                totalItems={filteredIncomeCount}
                loading={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="mb-5 flex items-center gap-2">
          <Wallet size={18} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            Spending Diagnostics
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-200 p-4 dark:border-surface-700">
            <p className="text-xs uppercase tracking-wide text-surface-400">Total Spend</p>
            <p className="mt-2 text-xl font-bold text-surface-900 dark:text-white">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-surface-200 p-4 dark:border-surface-700">
            <p className="text-xs uppercase tracking-wide text-surface-400">Average Expense</p>
            <p className="mt-2 text-xl font-bold text-surface-900 dark:text-white">${averageExpense.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-surface-200 p-4 dark:border-surface-700">
            <p className="text-xs uppercase tracking-wide text-surface-400">Median Expense</p>
            <p className="mt-2 text-xl font-bold text-surface-900 dark:text-white">${medianExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-5 flex items-center gap-2">
          <ListFilter size={18} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">Category Concentration</h2>
        </div>
        <div className="space-y-3">
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-surface-400">No category data for the selected filters.</p>
          ) : (
            categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-surface-600 dark:text-surface-300">{categoryLabels[item.category as keyof typeof categoryLabels]}</span>
                  <span className="text-surface-500">{item.share.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-700">
                  <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.min(item.share, 100)}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-5 text-base font-semibold text-surface-900 dark:text-white">Top Merchants</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topMerchants.length === 0 ? (
            <p className="text-sm text-surface-400 col-span-full">No merchant data for the selected filters.</p>
          ) : (
            topMerchants.map((merchant) => (
              <div key={merchant.name} className="flex items-center justify-between rounded-lg border border-surface-200 px-3 py-2 dark:border-surface-700">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{merchant.name}</p>
                  <p className="text-xs text-surface-400">{merchant.count} transactions</p>
                </div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white ml-2">${merchant.total.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
        </>
      )}

      {/* ── Edit Expense Modal ── */}
      <Modal open={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        <div className="space-y-4">
          <div>
            <label className="label">Store Name</label>
            <input className="input w-full" value={expenseForm.storeName} onChange={(e) => setExpenseForm((f) => ({ ...f, storeName: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount ($)</label>
              <input type="number" min="0.01" step="0.01" className="input w-full" value={expenseForm.amount} onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input w-full" value={expenseForm.date} onChange={(e) => setExpenseForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input w-full" value={expenseForm.category} onChange={(e) => setExpenseForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}>
                {Object.entries(categoryLabels).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select className="input w-full" value={expenseForm.paymentMethod} onChange={(e) => setExpenseForm((f) => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="qr_scan">QR Scan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <input className="input w-full" value={expenseForm.notes} onChange={(e) => setExpenseForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button className="btn-secondary" onClick={() => setEditingExpense(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveExpense} disabled={!expenseForm.storeName.trim() || !expenseForm.amount || parseFloat(expenseForm.amount) <= 0 || !expenseForm.date}>Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Expense Confirmation ── */}
      <Modal open={!!deletingExpense} onClose={() => setDeletingExpense(null)} title="Delete Expense">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/10">
            <AlertTriangle size={24} className="text-danger-500" />
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Are you sure you want to delete the expense <strong className="text-surface-900 dark:text-white">&quot;{deletingExpense?.storeName}&quot;</strong> for <strong className="text-surface-900 dark:text-white">${deletingExpense?.amount.toFixed(2)}</strong>?
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button className="btn-secondary" onClick={() => setDeletingExpense(null)}>Cancel</button>
            <button className="rounded-lg bg-danger-500 px-4 py-2 text-sm font-medium text-white hover:bg-danger-600 transition-colors" onClick={confirmDeleteExpense}>Delete</button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Income Modal ── */}
      <Modal open={!!editingIncome} onClose={() => setEditingIncome(null)} title="Edit Income">
        <div className="space-y-4">
          <div>
            <label className="label">Source</label>
            <input className="input w-full" value={incomeForm.source} onChange={(e) => setIncomeForm((f) => ({ ...f, source: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Amount ($)</label>
              <input type="number" min="0.01" step="0.01" className="input w-full" value={incomeForm.amount} onChange={(e) => setIncomeForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input w-full" value={incomeForm.date} onChange={(e) => setIncomeForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input w-full" value={incomeForm.category} onChange={(e) => setIncomeForm((f) => ({ ...f, category: e.target.value as IncomeCategory }))}>
              {Object.entries(incomeLabels).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <input className="input w-full" value={incomeForm.notes} onChange={(e) => setIncomeForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button className="btn-secondary" onClick={() => setEditingIncome(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveIncome} disabled={!incomeForm.source.trim() || !incomeForm.amount || parseFloat(incomeForm.amount) <= 0 || !incomeForm.date}>Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Income Confirmation ── */}
      <Modal open={!!deletingIncome} onClose={() => setDeletingIncome(null)} title="Delete Income">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/10">
            <AlertTriangle size={24} className="text-danger-500" />
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Are you sure you want to delete the income <strong className="text-surface-900 dark:text-white">&quot;{deletingIncome?.source}&quot;</strong> for <strong className="text-surface-900 dark:text-white">${deletingIncome?.amount.toFixed(2)}</strong>?
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button className="btn-secondary" onClick={() => setDeletingIncome(null)}>Cancel</button>
            <button className="rounded-lg bg-danger-500 px-4 py-2 text-sm font-medium text-white hover:bg-danger-600 transition-colors" onClick={confirmDeleteIncome}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
