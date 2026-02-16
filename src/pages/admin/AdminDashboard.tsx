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
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/ui/BarChart';
import { mockUsers, mockAdminStats } from '../../data/mockData';
import type { User } from '../../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const stats = mockAdminStats;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleToggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const userGrowthData = [
    { label: 'Sep', value: 45 },
    { label: 'Oct', value: 62 },
    { label: 'Nov', value: 58 },
    { label: 'Dec', value: 91 },
    { label: 'Jan', value: 78 },
    { label: 'Feb', value: stats.newUsersThisMonth },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          System overview and user management.
        </p>
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
          value={stats.totalRevenue}
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              User Management
            </h2>
            <p className="text-sm text-surface-400">{filteredUsers.length} users found</p>
          </div>
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">User</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden sm:table-cell">Role</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden md:table-cell">Joined</th>
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
                  <td className="py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-700 dark:hover:text-surface-300 transition-colors"
                        title="Toggle role"
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
