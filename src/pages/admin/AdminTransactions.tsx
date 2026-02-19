import { useState } from 'react';
import {
  Activity,
  Search,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { mockExpenses } from '../../data/mockData';
import type { Expense } from '../../types';

export default function AdminTransactions() {
  const [transactions] = useState<Expense[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    completed: transactions.filter((tx) => tx.status === 'completed').length,
    pending: transactions.filter((tx) => tx.status === 'pending').length,
    cancelled: transactions.filter((tx) => tx.status === 'cancelled').length,
  };

  const handleExport = () => {
    alert('Exporting transaction data... (Feature in development)');
  };

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
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Transaction Monitor
            </h1>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Monitor all user transactions across the platform.
          </p>
        </div>
        <button onClick={handleExport} className="btn-primary flex items-center gap-2">
          <Download size={16} />
          <span className="hidden sm:inline">Export Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Volume</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                €{stats.total.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-success-600 dark:text-success-400">
            <TrendingUp size={12} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Completed</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center">
              <ArrowUpRight size={24} className="text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Pending</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center">
              <Calendar size={24} className="text-warning-600 dark:text-warning-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Cancelled</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.cancelled}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center">
              <ArrowDownRight size={24} className="text-danger-600 dark:text-danger-400" />
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="bills">Bills</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="travel">Travel</option>
            </select>
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
    </div>
  );
}
