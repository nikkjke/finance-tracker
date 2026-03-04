import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import {
  DollarSign,
  Wallet,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  TrendingDown,
  Target,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import TransactionTable from '../../components/ui/TransactionTable';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';
import BudgetProgress from '../../components/ui/BudgetProgress';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import {
  categoryLabels,
  mockMonthlySpending,
} from '../../data/mockData';
import { useExpenses } from '../../contexts/ExpenseContext';
import { useIncome } from '../../contexts/IncomeContext';
import { useBudgets } from '../../contexts/BudgetContext';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { expenses } = useExpenses();
  const { income } = useIncome();
  const { budgets } = useBudgets();
  const { user } = useAuth();

  // Filter data for the current user
  const userExpenses = useMemo(() => {
    return user ? expenses.filter((e) => e.userId === user.id) : expenses;
  }, [expenses, user]);

  const userIncome = useMemo(() => {
    return user ? income.filter((i) => i.userId === user.id) : income;
  }, [income, user]);

  // Compute live stats from context data
  const totalSpent = useMemo(() => userExpenses.reduce((sum, e) => sum + e.amount, 0), [userExpenses]);

  const { totalIncome, netIncome } = useMemo(() => {
    const total = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const net = total - totalSpent;
    return { totalIncome: total, netIncome: net };
  }, [userIncome, totalSpent]);

  const budgetRemaining = useMemo(() => {
    // Get user's actual budgets from context
    const userBudgets = user ? budgets.filter(b => b.userId === user.id) : [];
    
    if (userBudgets.length === 0) {
      return 0;
    }
    
    const totalLimit = userBudgets.reduce((sum, b) => sum + b.limit, 0);
    return totalLimit - totalSpent;
  }, [totalSpent, budgets, user]);

  // Spending by category (live from context)
  const spendingByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    userExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([key, value]) => ({ label: categoryLabels[key as keyof typeof categoryLabels] || key, value }))
      .sort((a, b) => b.value - a.value);
  }, [userExpenses]);

  // Memoized budget utilization with percentages
  const budgetData = useMemo(() => {
    // Get user's actual budgets from context
    const userBudgets = user ? budgets.filter(b => b.userId === user.id) : [];
    
    if (userBudgets.length === 0) {
      return [];
    }
    
    // Calculate spent amount for each budget based on user expenses
    return userBudgets.map(budget => {
      // Calculate spent for this budget's category
      const spent = userExpenses
        .filter(e => e.category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      const remaining = budget.limit - spent;
      const status = percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'good';
      
      return {
        ...budget,
        spent, // Use calculated spent amount
        percentage: percentage.toFixed(1),
        remaining,
        status
      };
    });
  }, [budgets, user, userExpenses]);

  // Memoized monthly spending trends
  const monthlyTrendsData = useMemo(() => {
    // For demo user (ID '1'), show mock data with historical months
    const isDemoUser = user?.id === '1';
    
    if (isDemoUser) {
      const sorted = [...mockMonthlySpending].sort((a, b) => a.value - b.value);
      const avgSpending = mockMonthlySpending.reduce((sum, m) => sum + m.value, 0) / mockMonthlySpending.length;
      
      return {
        data: mockMonthlySpending,
        average: avgSpending,
        highest: sorted[sorted.length - 1],
        lowest: sorted[0]
      };
    }
    
    // For new users, calculate real spending by day this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const dailySpending: Record<string, number> = {};
    
    // Aggregate user expenses by day for this month
    userExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear) {
        const dayLabel = expenseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailySpending[dayLabel] = (dailySpending[dayLabel] || 0) + expense.amount;
      }
    });
    
    // Convert to chart data format
    const chartData = Object.entries(dailySpending).map(([label, value]) => ({
      label,
      value
    }));
    
    // If no data for this month, return empty array to trigger empty state
    if (chartData.length === 0) {
      return {
        data: [],
        average: 0,
        highest: { label: '', value: 0 },
        lowest: { label: '', value: 0 }
      };
    }
    
    const avgSpending = chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length;
    const sorted = [...chartData].sort((a, b) => a.value - b.value);
    
    return {
      data: chartData,
      average: avgSpending,
      highest: sorted[sorted.length - 1],
      lowest: sorted[0]
    };
  }, [userExpenses, user?.id]);

  // Memoized recent transactions summary (live from context)
  const transactionsData = useMemo(() => {
    const recent = userExpenses.slice(0, 5);
    const totalRecent = recent.reduce((sum, exp) => sum + exp.amount, 0);
    
    return {
      transactions: recent,
      total: totalRecent,
      count: recent.length
    };
  }, [userExpenses]);

  // Simulate loading statistics with setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size={40} />
          <p className="mt-4 text-surface-600 dark:text-surface-300">Loading your statistics...</p>
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Here&#39;s what&#39;s happening with your finances this month.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/add-income" className="btn-secondary">
                <TrendingUp size={18} />
                Record Income
              </Link>
              <Link to="/add-expense" className="btn-primary">
                <PlusCircle size={18} />
                Add Expense
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Income"
              value={totalIncome}
              icon={<TrendingUp size={20} />}
            />
            <StatCard
              title="Total Expenses"
              value={totalSpent}
              icon={<TrendingDown size={20} />}
            />
            <StatCard
              title="Net Income"
              value={netIncome}
              icon={<DollarSign size={20} />}
            />
            <StatCard
              title="Budget Remaining"
              value={budgetRemaining}
              icon={<Wallet size={20} />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Monthly Spending Chart */}
            <div className="card lg:col-span-2 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {user?.id === '1' ? 'Monthly Spending' : 'Spending Activity'}
                  </h2>
                  <p className="text-sm text-surface-400">
                    {user?.id === '1' ? 'Last 6 months overview' : 'This month by day'}
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <BarChart data={monthlyTrendsData.data} height={220} />
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
              <DonutChart data={spendingByCategory} />
            </div>
          </div>

          {/* Budget Progress */}
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Budget Progress
                </h2>
                <p className="text-sm text-surface-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
              <Link to="/budgets" className="btn-ghost text-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {budgetData.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No budgets set"
                description="Create your first budget to start tracking and managing your spending limits."
                className="rounded-lg border border-surface-200 dark:border-surface-700"
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {budgetData.slice(0, 4).map((budget) => (
                  <BudgetProgress key={budget.id} budget={budget} />
                ))}
              </div>
            )}
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
            <TransactionTable expenses={transactionsData.transactions} limit={5} />
          </div>
        </>
      )}
    </div>
  );
}
