import { useState, useMemo, useCallback } from 'react';
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
} from 'lucide-react';
import { mockExpenses } from '../../data/mockData';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';
import Dropdown from '../../components/ui/Dropdown';
import { applyFilters } from '../../services/filterService';
import type { Expense } from '../../types';

export default function AdminTransactions() {
  const [transactions] = useState<Expense[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('month');

  // Memoize filtered & sorted transactions — recalculates only when dependencies change
  const filteredTransactions = useMemo(
    () =>
      applyFilters(transactions, {
        searchQuery,
        searchFields: ['storeName', 'notes'],
        filters: { status: statusFilter, category: categoryFilter },
        sort: { key: 'date', direction: 'desc' },
      }).items,
    [transactions, searchQuery, statusFilter, categoryFilter],
  );

  // Memoize stats — recalculates only when transactions array changes
  const stats = useMemo(
    () => ({
      total: transactions.reduce((sum, tx) => sum + tx.amount, 0),
      completed: transactions.filter((tx) => tx.status === 'completed').length,
      pending: transactions.filter((tx) => tx.status === 'pending').length,
      cancelled: transactions.filter((tx) => tx.status === 'cancelled').length,
    }),
    [transactions],
  );

  const handleExport = useCallback(() => {
    alert('Exporting transaction data... (Feature in development)');
  }, []);

  const handleExportReport = useCallback((type: string) => {
    alert(`Exporting ${type} report... (Feature in development)`);
  }, []);

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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Volume</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                €{stats.total.toFixed(2)}
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

          <div className="flex gap-2">
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
          </div>
        </div>

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
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {filteredTransactions.map((tx) => (
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
                      €{tx.amount.toFixed(2)}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-surface-300 dark:text-surface-700 mb-3" />
            <p className="text-surface-500 dark:text-surface-400">No transactions found</p>
          </div>
        )}
      </div>

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
    </div>
  );
}
