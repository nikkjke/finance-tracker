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
import IncomeTable from '../../components/ui/IncomeTable';
import { AreaChart, Area, Grid, XAxis, ChartTooltip } from '../../components/ui/AreaChart';
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
import type { BudgetPeriod } from '../../types';

// ─── Period range helper (mirrors BudgetsPage) ───────────────────────────────
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
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: iso(start), end: iso(end) };
}

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
    
    // Calculate remaining for each budget category filtered by period
    let totalRemaining = 0;
    userBudgets.forEach(budget => {
      const { start, end } = getBudgetPeriodRange(budget.period ?? 'monthly', budget.startDate, budget.endDate);
      const spentInCategory = userExpenses
        .filter(e => e.category === budget.category && e.date >= start && e.date <= end)
        .reduce((sum, e) => sum + e.amount, 0);
      totalRemaining += (budget.limit - spentInCategory);
    });
    
    return totalRemaining;
  }, [budgets, user, userExpenses]);

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
    
    // Calculate spent amount for each budget based on user expenses filtered by period
    return userBudgets.map(budget => {
      const { start, end } = getBudgetPeriodRange(budget.period ?? 'monthly', budget.startDate, budget.endDate);
      const spent = userExpenses
        .filter(e => e.category === budget.category && e.date >= start && e.date <= end)
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

  // Memoized monthly spending + income trends
  const monthlyTrendsData = useMemo(() => {
    const isDemoUser = user?.id === '1';

    if (isDemoUser) {
      // Build 6-month date-keyed data for demo user
      const monthMap: Record<string, { month: number; year: number }> = {
        'Sep': { month: 8, year: 2025 }, 'Oct': { month: 9, year: 2025 },
        'Nov': { month: 10, year: 2025 }, 'Dec': { month: 11, year: 2025 },
        'Jan': { month: 0, year: 2026 }, 'Feb': { month: 1, year: 2026 },
      };
      const mockIncomeByMonth: Record<string, number> = {
        'Sep': 3800, 'Oct': 4200, 'Nov': 4100, 'Dec': 5200, 'Jan': 4500, 'Feb': 6870,
      };
      const chartData = mockMonthlySpending.map((d) => {
        const mapping = monthMap[d.label];
        return {
          date: mapping ? new Date(mapping.year, mapping.month, 1) : new Date(),
          spending: d.value,
          income: mockIncomeByMonth[d.label] ?? 0,
        };
      });
      const avgSpending = mockMonthlySpending.reduce((s, m) => s + m.value, 0) / mockMonthlySpending.length;
      const sorted = [...mockMonthlySpending].sort((a, b) => a.value - b.value);
      return { data: chartData, average: avgSpending, highest: sorted[sorted.length - 1], lowest: sorted[0] };
    }

    // For real users: aggregate by day this month
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const dailyMap: Record<string, { date: Date; spending: number; income: number }> = {};

    userExpenses.forEach((expense) => {
      const d = new Date(expense.date);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        const key = d.toISOString().slice(0, 10);
        if (!dailyMap[key]) dailyMap[key] = { date: new Date(d.getFullYear(), d.getMonth(), d.getDate()), spending: 0, income: 0 };
        dailyMap[key].spending += expense.amount;
      }
    });
    userIncome.forEach((inc) => {
      const d = new Date(inc.date);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        const key = d.toISOString().slice(0, 10);
        if (!dailyMap[key]) dailyMap[key] = { date: new Date(d.getFullYear(), d.getMonth(), d.getDate()), spending: 0, income: 0 };
        dailyMap[key].income += inc.amount;
      }
    });

    const chartData = Object.values(dailyMap).sort((a, b) => a.date.getTime() - b.date.getTime());
    if (chartData.length === 0) return { data: [], average: 0, highest: { label: '', value: 0 }, lowest: { label: '', value: 0 } };

    const avgSpending = chartData.reduce((s, d) => s + d.spending, 0) / chartData.length;
    const sortedBySpend = [...chartData].sort((a, b) => a.spending - b.spending);
    return {
      data: chartData,
      average: avgSpending,
      highest: { label: '', value: sortedBySpend[sortedBySpend.length - 1]?.spending ?? 0 },
      lowest: { label: '', value: sortedBySpend[0]?.spending ?? 0 },
    };
  }, [userExpenses, userIncome, user?.id]);

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

  const recentIncomeData = useMemo(() => {
    const recent = [...userIncome]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    return {
      income: recent,
      count: recent.length
    };
  }, [userIncome]);

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
                    {user?.id === '1' ? 'Income and Expenses' : 'Income & Spending Activity'}
                  </h2>
                  <p className="text-sm text-surface-400">
                    {user?.id === '1' ? 'Last 6 months overview' : 'This month by day'}
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end">
                {monthlyTrendsData.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800 mb-4">
                      <TrendingDown size={28} className="text-surface-300 dark:text-surface-600" />
                    </div>
                    <h3 className="text-base font-semibold text-surface-700 dark:text-surface-300 mb-1">No spending data</h3>
                    <p className="text-sm text-surface-400 dark:text-surface-500 max-w-xs text-center">Start adding expenses to see your spending activity</p>
                  </div>
                ) : (
                  <AreaChart
                    data={monthlyTrendsData.data as Record<string, unknown>[]}
                    xDataKey="date"
                    margin={{ top: 20, right: 4, bottom: 36, left: 4 }}
                    className="h-full w-full min-h-[250px]"
                  >
                    <Grid horizontal />
                    <Area
                      dataKey="income"
                      fill="#22c55e"
                      fillOpacity={0.25}
                    />
                    <Area
                      dataKey="spending"
                      fill="var(--chart-line-secondary)"
                      fillOpacity={0.2}
                    />
                    <XAxis 
                      numTicks={6} 
                      tickFormat={(d) => user?.id === '1' ? d.toLocaleDateString('en-US', { month: 'short' }) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <ChartTooltip
                      rows={(point) => [
                        {
                          color: '#22c55e',
                          label: 'Income',
                          value: `$${((point.income as number) ?? 0).toLocaleString()}`,
                        },
                        {
                          color: 'var(--chart-line-secondary)',
                          label: 'Spending',
                          value: `$${((point.spending as number) ?? 0).toLocaleString()}`,
                        },
                      ]}
                    />
                  </AreaChart>
                )}
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

          {/* Recent Income */}
          <div className="card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Recent Income
                </h2>
                <p className="text-sm text-surface-400">Latest activity</p>
              </div>
              <Link to="/reports" className="btn-ghost text-sm">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            <IncomeTable income={recentIncomeData.income} limit={5} />
          </div>
        </>
      )}
    </div>
  );
}
