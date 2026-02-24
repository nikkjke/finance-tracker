import { Link } from 'react-router-dom';
import {
  DollarSign,
  Wallet,
  ScanLine,
  TrendingUp,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import TransactionTable from '../../components/ui/TransactionTable';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';
import BudgetProgress from '../../components/ui/BudgetProgress';
import {
  mockExpenses,
  mockMonthlyStats,
  mockMonthlySpending,
  mockSpendingByCategory,
  mockBudgets,
  categoryLabels,
} from '../../data/mockData';

export default function DashboardPage() {
  const stats = mockMonthlyStats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Here&#39;s what&#39;s happening with your finances this month.
          </p>
        </div>
        <Link to="/add-expense" className="btn-primary">
          <PlusCircle size={18} />
          Add Expense
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total This Month"
          value={stats.totalSpent}
          icon={<DollarSign size={20} />}
          change={stats.comparedToLastMonth}
          changeLabel="vs last month"
        />
        <StatCard
          title="Budget Remaining"
          value={stats.budgetRemaining}
          icon={<Wallet size={20} />}
        />
        <StatCard
          title="Receipts Scanned"
          value={stats.receiptsScanned.toString()}
          icon={<ScanLine size={20} />}
        />
        <StatCard
          title="Top Category"
          value={categoryLabels[stats.topCategory]}
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Spending Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                Monthly Spending
              </h2>
              <p className="text-sm text-surface-400">Last 6 months overview</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <BarChart data={mockMonthlySpending} height={220} />
          </div>
        </div>

        {/* Spending By Category */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              By Category
            </h2>
            <p className="text-sm text-surface-400">This month</p>
          </div>
          <DonutChart data={mockSpendingByCategory} />
        </div>
      </div>

      {/* Budget Progress */}
      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              Budget Progress
            </h2>
            <p className="text-sm text-surface-400">February 2026</p>
          </div>
          <Link to="/budgets" className="btn-ghost text-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {mockBudgets.slice(0, 4).map((budget) => (
            <BudgetProgress key={budget.id} budget={budget} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              Recent Transactions
            </h2>
            <p className="text-sm text-surface-400">Latest activity</p>
          </div>
          <Link to="/reports" className="btn-ghost text-sm">
            See All <ArrowRight size={14} />
          </Link>
        </div>
        <TransactionTable expenses={mockExpenses} limit={5} />
      </div>
    </div>
  );
}
