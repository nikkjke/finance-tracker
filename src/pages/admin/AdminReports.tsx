import { useState } from 'react';
import {
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Calendar,
  BarChart3,
} from 'lucide-react';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('month');

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

  const handleExportReport = (type: string) => {
    alert(`Exporting ${type} report... (Feature in development)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={20} className="text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Analytics & Reports
            </h1>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Comprehensive analytics and downloadable reports.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-auto"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Revenue</p>
              <p className="text-xl font-bold text-surface-900 dark:text-white">€19,090</p>
              <p className="text-xs text-success-600 dark:text-success-400">+15.3%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center">
              <Users size={24} className="text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Active Users</p>
              <p className="text-xl font-bold text-surface-900 dark:text-white">1,247</p>
              <p className="text-xs text-success-600 dark:text-success-400">+8.2%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center">
              <Activity size={24} className="text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Transactions</p>
              <p className="text-xl font-bold text-surface-900 dark:text-white">3,845</p>
              <p className="text-xs text-success-600 dark:text-success-400">+12.1%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-danger-600 dark:text-danger-400" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Avg. Transaction</p>
              <p className="text-xl font-bold text-surface-900 dark:text-white">€128.45</p>
              <p className="text-xs text-danger-600 dark:text-danger-400">-3.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
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
            onClick={() => handleExportReport('user-analytics')}
            className="flex items-center gap-3 p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-success-100 dark:bg-success-500/20 flex items-center justify-center">
              <Users size={20} className="text-success-600 dark:text-success-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                User Analytics
              </p>
              <p className="text-xs text-surface-400">CSV, JSON</p>
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
