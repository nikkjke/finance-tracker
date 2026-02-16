import { useState } from 'react';
import { Download, Filter, Calendar, CalendarDays, ArrowUpRight, Hash } from 'lucide-react';
import TransactionTable from '../../components/ui/TransactionTable';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';
import Dropdown from '../../components/ui/Dropdown';
import {
  mockExpenses,
  mockMonthlySpending,
  mockSpendingByCategory,
} from '../../data/mockData';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('6months');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredExpenses = categoryFilter === 'all'
    ? mockExpenses
    : mockExpenses.filter((e) => e.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Analyze your spending patterns and trends.
          </p>
        </div>
        <button className="btn-secondary">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
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
        <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500" />
          {filteredExpenses.length} transactions found
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2 flex flex-col">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Spending Over Time
            </h2>
            <p className="text-sm text-surface-400">Last 6 months overview</p>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <BarChart data={mockMonthlySpending} height={220} />
          </div>
        </div>
        <div className="card">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Category Breakdown
            </h2>
            <p className="text-sm text-surface-400">This month</p>
          </div>
          <DonutChart data={mockSpendingByCategory} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Average Daily',
            value: '$54.56',
            icon: CalendarDays,
            valueColor: 'text-surface-900 dark:text-white',
          },
          {
            label: 'Highest Expense',
            value: '$450.00',
            icon: ArrowUpRight,
            valueColor: 'text-surface-900 dark:text-white',
          },
          {
            label: 'Total Transactions',
            value: filteredExpenses.length.toString(),
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

      {/* All Transactions */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-6">
          All Transactions
        </h2>
        <TransactionTable expenses={filteredExpenses} />
      </div>
    </div>
  );
}
