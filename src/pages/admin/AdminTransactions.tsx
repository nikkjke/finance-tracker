import { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileText,
  Settings,
  ArrowUpDown,
} from 'lucide-react';
import { useExpenses } from '../../contexts/ExpenseContext';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';
import Dropdown from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { applyFilters, presetToDateRange, exportTransactions, exportReport } from '../../services';
import { categoryLabels } from '../../data/mockData';
import type { Expense, ExpenseStatus } from '../../types';
import type { FilterPipelineConfig, SortConfig } from '../../services/filterService';

interface StatusChangeFormData {
  status: ExpenseStatus;
  adminNotes: string;
}

interface StatusChangeFormErrors {
  status?: string;
  adminNotes?: string;
}

const initialStatusForm: StatusChangeFormData = {
  status: 'completed',
  adminNotes: '',
};

export default function AdminTransactions() {
  const { expenses: storeExpenses, updateExpense } = useExpenses();
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('month');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'store-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);
  const [statusForm, setStatusForm] = useState<StatusChangeFormData>(initialStatusForm);
  const [formErrors, setFormErrors] = useState<StatusChangeFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchTransactions = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setTransactions(storeExpenses);
        setIsLoading(false);
      } catch {
        setError('Failed to load transactions. The service might be unavailable.');
        setIsLoading(false);
      }
    }, 250);
  };

  useEffect(() => {
    fetchTransactions();
  }, [storeExpenses]);

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
      status: statusFilter,
      category: categoryFilter,
    },
    sort: sortConfig,
    dateField: 'date',
    dateRange: presetToDateRange(dateRange as 'week' | 'month' | 'quarter' | 'year'),
  };

  const filteredResult = applyFilters(transactions, filterConfig);
  const pipelineResult = applyFilters(transactions, {
    ...filterConfig,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const filteredTransactions = filteredResult.items;
  const filteredTransactionsCount = filteredResult.totalItems;
  const paginatedTransactions = pipelineResult.items;
  const totalPages = pipelineResult.pagination?.totalPages ?? 1;

  const stats = {
    total: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    completed: transactions.filter((tx) => tx.status === 'completed').length,
    pending: transactions.filter((tx) => tx.status === 'pending').length,
    cancelled: transactions.filter((tx) => tx.status === 'cancelled').length,
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, dateRange, sortBy]);

  const handleExport = () => {
    // Export filtered transactions to CSV
    exportTransactions(filteredTransactions, { filename: 'transactions', format: 'csv' });
  };

  const handleExportReport = (type: string) => {
    // Export formatted report (PDF/Excel in production)
    exportReport(type as any);
  };

  const revenueData = [
    { label: 'Sep', value: 2450 },
    { label: 'Oct', value: 3200 },
    { label: 'Nov', value: 2890 },
    { label: 'Dec', value: 4100 },
    { label: 'Jan', value: 3650 },
    { label: 'Feb', value: 3800 },
  ];

  const categoryData = [
    { label: 'Food', value: 35, color: '#22c55e' },
    { label: 'Transport', value: 20, color: '#3b82f6' },
    { label: 'Shopping', value: 15, color: '#ec4899' },
    { label: 'Bills', value: 18, color: '#f97316' },
    { label: 'Other', value: 12, color: '#8b5cf6' },
  ];

  const userActivityData = [
    { label: 'Mon', value: 156 },
    { label: 'Tue', value: 189 },
    { label: 'Wed', value: 175 },
    { label: 'Thu', value: 201 },
    { label: 'Fri', value: 234 },
    { label: 'Sat', value: 145 },
    { label: 'Sun', value: 98 },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
      transport: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
      shopping: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
      bills: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
      health: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
      education: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
      travel: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    };
    return colors[category] || 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-400';
  };

  const validateForm = () => {
    const nextErrors: StatusChangeFormErrors = {};

    if (!statusForm.status) {
      nextErrors.status = 'Status is required';
    }

    if (statusForm.adminNotes.trim().length > 500) {
      nextErrors.adminNotes = 'Admin notes must be at most 500 characters';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOpenChangeStatus = (transaction: Expense) => {
    setSelectedTransaction(transaction);
    setStatusForm({
      status: transaction.status,
      adminNotes: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm() || !selectedTransaction) return;

    setIsSaving(true);

    const updateResult = await updateExpense(selectedTransaction.id, {
      status: statusForm.status,
    });

    if (!updateResult.success) {
      setError(updateResult.error ?? 'Failed to update transaction status.');
    }

    setIsSaving(false);
    setShowModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={20} className="text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Transactions & Analytics
            </h1>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Monitor transactions, view analytics, and export reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Dropdown
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
          />
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading transactions...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="card">
          <ErrorState
            title="Failed to load transactions"
            message={error}
            onRetry={fetchTransactions}
          />
        </div>
      )}

      {/* Content (only when loaded and no error) */}
      {!isLoading && !error && (
        <>
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Volume</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                ${stats.total.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <DollarSign size={24} className="text-primary-600 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-success-600 dark:text-success-400">
            <TrendingUp size={12} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Completed</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <ArrowUpRight size={24} className="text-success-600 dark:text-success-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Pending</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <Calendar size={24} className="text-warning-600 dark:text-warning-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Cancelled</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.cancelled}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <ArrowDownRight size={24} className="text-danger-600 dark:text-danger-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Transactions */}
      <div className="card">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  statusFilter === 'cancelled'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                Cancelled
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="input pl-9 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Dropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'food', label: 'Food' },
                { value: 'transport', label: 'Transport' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'shopping', label: 'Shopping' },
                { value: 'bills', label: 'Bills' },
                { value: 'health', label: 'Health' },
                { value: 'education', label: 'Education' },
                { value: 'travel', label: 'Travel' },
              ]}
            />
            <Dropdown
              value={sortBy}
              onChange={(val) => setSortBy(val as typeof sortBy)}
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
        </div>

        <p className="mb-4 text-xs text-surface-400 dark:text-surface-500">
          {filteredTransactionsCount} transactions found
        </p>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Store
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden md:table-cell">
                  Category
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden sm:table-cell">
                  Date
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Amount
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden lg:table-cell">
                  Payment
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Status
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50">
                  <td className="py-4 pr-4">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        {tx.storeName}
                      </p>
                      {tx.notes && (
                        <p className="text-xs text-surface-400 mt-0.5">{tx.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(tx.category)}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <span className="text-sm text-surface-500">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">
                      ${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden lg:table-cell">
                    <span className="text-sm text-surface-500 capitalize">
                      {tx.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        tx.status === 'completed'
                          ? 'bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400'
                          : tx.status === 'pending'
                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400'
                          : 'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleOpenChangeStatus(tx)}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-surface-100 transition-colors"
                      aria-label="Change transaction status"
                    >
                      <Settings size={14} />
                      <span>Change Status</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <EmptyState
            icon={Activity}
            title="No transactions found"
            description="Try adjusting your search query or filters to find what you're looking for."
            action={
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCategoryFilter('all'); }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            }
          />
        )}

        {filteredTransactionsCount > 0 && (
          <div className="mt-4 border-t border-surface-200 pt-4 dark:border-surface-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(count) => {
                setItemsPerPage(count);
                setCurrentPage(1);
              }}
              totalItems={filteredTransactionsCount}
              loading={isLoading}
            />
          </div>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTransaction(null);
          setFormErrors({});
        }}
        title="Change Transaction Status"
      >
        <div className="space-y-4">
          {/* Transaction Details (Read-Only) */}
          {selectedTransaction && (
            <div className="rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
              <h3 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Store:</span>
                  <span className="font-medium text-surface-900 dark:text-white">
                    {selectedTransaction.storeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Amount:</span>
                  <span className="font-semibold text-surface-900 dark:text-white">
                    ${selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Category:</span>
                  <span className="text-surface-900 dark:text-white">
                    {categoryLabels[selectedTransaction.category]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Date:</span>
                  <span className="text-surface-900 dark:text-white">
                    {new Date(selectedTransaction.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Payment Method:</span>
                  <span className="capitalize text-surface-900 dark:text-white">
                    {selectedTransaction.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                {selectedTransaction.notes && (
                  <div className="mt-3 border-t border-surface-200 pt-2 dark:border-surface-700">
                    <span className="text-surface-500 dark:text-surface-400">User Notes:</span>
                    <p className="mt-1 text-surface-700 dark:text-surface-300">
                      {selectedTransaction.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Change */}
          <div>
            <label className="label">Change Status</label>
            <Dropdown
              value={statusForm.status}
              onChange={(val) => {
                setStatusForm((prev) => ({ ...prev, status: val as ExpenseStatus }));
                setFormErrors((prev) => ({ ...prev, status: undefined }));
              }}
              options={[
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              fullWidth
            />
            {formErrors.status && <p className="mt-1 text-xs text-danger-500">{formErrors.status}</p>}
          </div>

          {/* Admin Notes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label" htmlFor="admin-notes">
                Admin Notes <span className="font-normal text-surface-400">(optional, internal only)</span>
              </label>
              <span className={`text-xs ${statusForm.adminNotes.length > 450 ? 'text-warning-500' : 'text-surface-400'}`}>
                {statusForm.adminNotes.length}/500
              </span>
            </div>
            <textarea
              id="admin-notes"
              rows={3}
              maxLength={500}
              value={statusForm.adminNotes}
              onChange={(e) => {
                setStatusForm((prev) => ({ ...prev, adminNotes: e.target.value }));
                setFormErrors((prev) => ({ ...prev, adminNotes: undefined }));
              }}
              className={`input resize-none ${formErrors.adminNotes ? 'border-danger-500' : ''}`}
              placeholder="Add internal notes about this status change (e.g., reason for marking as cancelled)..."
            />
            {formErrors.adminNotes && <p className="mt-1 text-xs text-danger-500">{formErrors.adminNotes}</p>}
            <p className="mt-1 text-xs text-surface-400">
              These notes are for internal tracking only and not visible to users.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedTransaction(null);
              }}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Analytics Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trends */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                Revenue Trends
              </h2>
              <p className="text-sm text-surface-400">Monthly revenue overview</p>
            </div>
            <button
              onClick={() => handleExportReport('revenue')}
              className="btn-secondary btn-sm flex items-center gap-2"
            >
              <Download size={14} />
              Export
            </button>
          </div>
          <BarChart data={revenueData} height={250} color="#3b82f6" />
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                Expense Categories
              </h2>
              <p className="text-sm text-surface-400">Distribution by category</p>
            </div>
            <button
              onClick={() => handleExportReport('categories')}
              className="btn-secondary btn-sm flex items-center gap-2"
            >
              <Download size={14} />
              Export
            </button>
          </div>
          <DonutChart data={categoryData} size={200} />
        </div>
      </div>

      {/* User Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              User Activity
            </h2>
            <p className="text-sm text-surface-400">Daily active users this week</p>
          </div>
          <button
            onClick={() => handleExportReport('activity')}
            className="btn-secondary btn-sm flex items-center gap-2"
          >
            <Download size={14} />
            Export
          </button>
        </div>
        <BarChart data={userActivityData} height={200} color="#22c55e" />
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            Export Reports
          </h2>
          <p className="text-sm text-surface-400">Download detailed reports</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => handleExportReport('financial')}
            className="flex items-center gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
              <FileText size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                Financial Report
              </p>
              <p className="text-xs text-surface-400">PDF, Excel</p>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('transaction-log')}
            className="flex items-center gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center">
              <Activity size={20} className="text-warning-600 dark:text-warning-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                Transaction Log
              </p>
              <p className="text-xs text-surface-400">CSV, Excel</p>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('category-breakdown')}
            className="flex items-center gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
              <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                Category Analysis
              </p>
              <p className="text-xs text-surface-400">PDF, CSV</p>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('monthly-summary')}
            className="flex items-center gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
              <Calendar size={20} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                Monthly Summary
              </p>
              <p className="text-xs text-surface-400">PDF, Email</p>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('custom')}
            className="flex items-center gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
              <Download size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                Custom Report
              </p>
              <p className="text-xs text-surface-400">Build your own</p>
            </div>
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
