import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  UserPlus,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Shield,
  ExternalLink,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { AreaChart, Area, Grid, XAxis, ChartTooltip } from '../../components/ui/AreaChart';
import Spinner from '../../components/ui/Spinner';
import { mockUsers, mockAdminStats, mockExpenses } from '../../data/mockData';
import { exportUsers, exportTransactions } from '../../services';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading admin statistics with setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  // Memoized admin statistics calculation
  const { users, stats, recentTransactions, recentUsers } = useMemo(() => {
    const usersList = mockUsers;
    const adminStats = mockAdminStats;
    const transactions = mockExpenses.slice(0, 5);
    const recentUsersList = usersList.slice(0, 5);
    
    return { users: usersList, stats: adminStats, recentTransactions: transactions, recentUsers: recentUsersList };
  }, []);

  const activityLog = [
    { id: 1, user: 'Mariana Popescu', action: 'Added expense', details: '$245.50 at Kaufland', time: '2 hours ago', type: 'expense' },
    { id: 2, user: 'Admin User', action: 'Created new user', details: 'Andrei Vasile', time: '5 hours ago', type: 'admin' },
    { id: 3, user: 'Elena Dumitrescu', action: 'Updated budget', details: 'Food category', time: '1 day ago', type: 'budget' },
    { id: 4, user: 'Ion Ionescu', action: 'Deleted expense', details: '$89.00 transaction', time: '2 days ago', type: 'expense' },
    { id: 5, user: 'Admin User', action: 'Changed user role', details: 'Promoted to admin', time: '3 days ago', type: 'admin' },
  ];

  const handleExportData = (type: 'users' | 'transactions' | 'all') => {
    if (type === 'users') {
      exportUsers(users, { filename: 'users', format: 'csv' });
    } else if (type === 'transactions') {
      exportTransactions(mockExpenses, { filename: 'transactions', format: 'csv' });
    } else {
      // Export both datasets
      exportUsers(users, { filename: 'users', format: 'csv' });
      setTimeout(() => {
        exportTransactions(mockExpenses, { filename: 'transactions', format: 'csv' });
      }, 100);
    }
  };

  // Convert month-label data to Date-keyed format for AreaChart
  const monthToDate: Record<string, Date> = {
    'Sep': new Date(2025, 8, 1), 'Oct': new Date(2025, 9, 1),
    'Nov': new Date(2025, 10, 1), 'Dec': new Date(2025, 11, 1),
    'Jan': new Date(2026, 0, 1), 'Feb': new Date(2026, 1, 1),
  };

  const userGrowthChartData = [
    { date: monthToDate['Sep'], value: 45 },
    { date: monthToDate['Oct'], value: 62 },
    { date: monthToDate['Nov'], value: 58 },
    { date: monthToDate['Dec'], value: 91 },
    { date: monthToDate['Jan'], value: 78 },
    { date: monthToDate['Feb'], value: stats.newUsersThisMonth },
  ];

  const revenueChartData = [
    { date: monthToDate['Sep'], value: 2450 },
    { date: monthToDate['Oct'], value: 3200 },
    { date: monthToDate['Nov'], value: 2890 },
    { date: monthToDate['Dec'], value: 4100 },
    { date: monthToDate['Jan'], value: 3650 },
    { date: monthToDate['Feb'], value: stats.totalRevenue || 3800 },
  ];

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size={40} />
          <p className="mt-4 text-surface-600 dark:text-surface-300">Loading admin dashboard...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={20} className="text-primary-600 dark:text-primary-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Admin Dashboard</h1>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                System overview and key metrics.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportData('users')}
                className="btn-secondary flex items-center gap-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export Users</span>
              </button>
              <button
                onClick={() => handleExportData('all')}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export All</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={<Users size={20} />}
              change={7.2}
              changeLabel="this month"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              icon={<Activity size={20} />}
              change={3.1}
              changeLabel="this month"
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign size={20} />}
              change={12.5}
              changeLabel="this month"
            />
            <StatCard
              title="New Users"
              value={stats.newUsersThisMonth.toString()}
              icon={<UserPlus size={20} />}
              change={-2.3}
              changeLabel="vs last month"
            />
          </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              User Growth
            </h2>
            <p className="text-sm text-surface-400">New users per month</p>
          </div>
          <AreaChart
            data={userGrowthChartData as Record<string, unknown>[]}
            xDataKey="date"
            className="h-[250px] w-full"
            margin={{ top: 16, right: 4, bottom: 32, left: 4 }}
          >
            <Grid horizontal />
            <Area dataKey="value" fill="#22c55e" fillOpacity={0.3} />
            <XAxis numTicks={6} tickFormat={(d) => d.toLocaleDateString('en-US', { month: 'short' })} />
            <ChartTooltip rows={(p) => [{ color: '#22c55e', label: 'New Users', value: (p.value as number) ?? 0 }]} />
          </AreaChart>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Revenue Trends
            </h2>
            <p className="text-sm text-surface-400">Monthly revenue overview</p>
          </div>
          <AreaChart
            data={revenueChartData as Record<string, unknown>[]}
            xDataKey="date"
            className="h-[250px] w-full"
            margin={{ top: 16, right: 4, bottom: 32, left: 4 }}
          >
            <Grid horizontal />
            <Area dataKey="value" fill="#3b82f6" fillOpacity={0.3} />
            <XAxis numTicks={6} tickFormat={(d) => d.toLocaleDateString('en-US', { month: 'short' })} />
            <ChartTooltip rows={(p) => [{ color: '#3b82f6', label: 'Revenue', value: `$${((p.value as number) ?? 0).toLocaleString()}` }]} />
          </AreaChart>
        </div>
      </div>

      {/* Activity & Transactions Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity Log */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-sm text-surface-400">Latest system events</p>
            </div>
            <Clock size={18} className="text-surface-400" />
          </div>
          <div className="space-y-3">
            {activityLog.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800"
              >
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  activity.type === 'admin' ? 'bg-primary-500' :
                  activity.type === 'expense' ? 'bg-success-500' :
                  'bg-warning-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-xs text-surface-500">
                    {activity.action} • {activity.details}
                  </p>
                  <p className="text-xs text-surface-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                Recent Transactions
              </h2>
              <p className="text-sm text-surface-400">Latest platform activity</p>
            </div>
            <Activity size={18} className="text-surface-400" />
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-500/20">
                    {tx.status === 'completed' ? (
                      <ArrowUpRight size={16} className="text-success-600 dark:text-success-400" />
                    ) : (
                      <ArrowDownRight size={16} className="text-warning-600 dark:text-warning-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      {tx.storeName}
                    </p>
                    <p className="text-xs text-surface-400">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    ${tx.amount.toFixed(2)}
                  </p>
                  <p className={`text-xs ${
                    tx.status === 'completed' ? 'text-success-500' :
                    tx.status === 'pending' ? 'text-warning-500' :
                    'text-danger-500'
                  }`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2.5 w-2.5 rounded-full bg-success-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">API Server</h3>
          </div>
          <p className="text-xs text-surface-400">Uptime: 99.97%</p>
          <p className="text-xs text-surface-400">Latency: 45ms</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2.5 w-2.5 rounded-full bg-success-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Database</h3>
          </div>
          <p className="text-xs text-surface-400">Status: Healthy</p>
          <p className="text-xs text-surface-400">Storage: 42% used</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2.5 w-2.5 rounded-full bg-warning-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">QR Service</h3>
          </div>
          <p className="text-xs text-surface-400">Status: Degraded</p>
          <p className="text-xs text-surface-400">Queue: 12 pending</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Recent Users
            </h2>
            <p className="text-sm text-surface-400">Latest registered users</p>
          </div>
          <Link
            to="/admin/users"
            className="btn-secondary btn-sm flex items-center gap-2"
          >
            View All
            <ExternalLink size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {recentUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                  <span className="text-sm font-semibold">{u.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{u.name}</p>
                  <p className="text-xs text-surface-400">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge-sm ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                  {u.role}
                </span>
                <span className="text-xs text-surface-400 hidden sm:block">
                  {new Date(u.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
