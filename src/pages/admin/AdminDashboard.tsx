import { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
  Search,
  MoreHorizontal,
  Shield,
  Trash2,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/ui/BarChart';
import { mockUsers, mockAdminStats, mockExpenses } from '../../data/mockData';
import type { User } from '../../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'admin'>('all');
  const stats = mockAdminStats;

  const recentTransactions = mockExpenses.slice(0, 5);
  const activityLog = [
    { id: 1, user: 'Mariana Popescu', action: 'Added expense', details: '€245.50 at Kaufland', time: '2 hours ago', type: 'expense' },
    { id: 2, user: 'Admin User', action: 'Created new user', details: 'Andrei Vasile', time: '5 hours ago', type: 'admin' },
    { id: 3, user: 'Elena Dumitrescu', action: 'Updated budget', details: 'Food category', time: '1 day ago', type: 'budget' },
    { id: 4, user: 'Ion Ionescu', action: 'Deleted expense', details: '€89.00 transaction', time: '2 days ago', type: 'expense' },
    { id: 5, user: 'Admin User', action: 'Changed user role', details: 'Promoted to admin', time: '3 days ago', type: 'admin' },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'admin' && u.role === 'admin') ||
      (selectedFilter === 'active' && u.role === 'user');
    return matchesSearch && matchesFilter;
  });

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleToggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const handleExportData = (type: 'users' | 'transactions' | 'all') => {
    alert(`Exporting ${type} data... (Feature in development)`);
  };

  const userGrowthData = [
    { label: 'Sep', value: 45 },
    { label: 'Oct', value: 62 },
    { label: 'Nov', value: 58 },
    { label: 'Dec', value: 91 },
    { label: 'Jan', value: 78 },
    { label: 'Feb', value: stats.newUsersThisMonth },
  ];

  const revenueData = [
    { label: 'Sep', value: 2450 },
    { label: 'Oct', value: 3200 },
    { label: 'Nov', value: 2890 },
    { label: 'Dec', value: 4100 },
    { label: 'Jan', value: 3650 },
    { label: 'Feb', value: stats.totalRevenue || 3800 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            System overview and user management.
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
          value={`€${stats.totalRevenue.toLocaleString()}`}
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
          <BarChart data={userGrowthData} height={200} color="#22c55e" />
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Revenue Trends
            </h2>
            <p className="text-sm text-surface-400">Monthly revenue overview</p>
          </div>
          <BarChart data={revenueData} height={200} color="#3b82f6" />
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
                    €{tx.amount.toFixed(2)}
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

      {/* User Management */}
      <div className="card">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                User Management
              </h2>
              <p className="text-sm text-surface-400">{filteredUsers.length} users found</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="input pl-9 w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => handleExportData('users')}
                className="btn-secondary p-2"
                title="Export users"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFilter === 'active'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSelectedFilter('admin')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFilter === 'admin'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              }`}
            >
              Admins
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">User</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden sm:table-cell">Role</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden md:table-cell">Joined</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden lg:table-cell">Status</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                        <span className="text-sm font-semibold">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-surface-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 hidden sm:table-cell">
                    <span className={u.role === 'admin' ? 'badge-primary' : 'badge-success'}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 hidden md:table-cell">
                    <span className="text-sm text-surface-500">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <div className="h-2 w-2 rounded-full bg-success-500" />
                      <span className="text-surface-500">Active</span>
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors"
                        title={`Change to ${u.role === 'admin' ? 'user' : 'admin'}`}
                      >
                        <TrendingUp size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
