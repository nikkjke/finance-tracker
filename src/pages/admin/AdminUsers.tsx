import { useState, useMemo, useCallback } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Download,
  MoreVertical,
  Shield,
  Trash2,
  Edit,
  CheckCircle,
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import Dropdown from '../../components/ui/Dropdown';
import { applyFilters } from '../../services/filterService';
import type { SortConfig } from '../../services/filterService';
import type { User } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'role'>('date');

  // Map UI sort key to filterService SortConfig (memoized – only changes if sortBy changes)
  const sortConfig = useMemo<SortConfig<User>>(() => {
    const map: Record<string, SortConfig<User>> = {
      name: { key: 'name', direction: 'asc' },
      date: { key: 'createdAt', direction: 'desc' },
      role: { key: 'role', direction: 'asc' },
    };
    return map[sortBy];
  }, [sortBy]);

  // Memoize filtered & sorted user list — recalculates only when users, searchQuery, roleFilter or sortConfig change
  const filteredUsers = useMemo(
    () =>
      applyFilters(users, {
        searchQuery,
        searchFields: ['name', 'email'],
        filters: { role: roleFilter },
        sort: sortConfig,
      }).items,
    [users, searchQuery, roleFilter, sortConfig],
  );

  const handleDeleteUser = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  }, []);

  const handleToggleRole = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  }, []);

  const handleExport = useCallback(() => {
    alert('Exporting user data... (Feature in development)');
  }, []);

  // Memoize stats — recalculates only when users array changes
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.role === 'user').length,
      admins: users.filter((u) => u.role === 'admin').length,
    }),
    [users],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={20} className="text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">User Management</h1>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Manage all users and their permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <UserPlus size={16} />
            <span className="hidden sm:inline">Add User</span>
          </button>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Users</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <Users size={24} className="text-primary-600 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Active Users</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.active}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <CheckCircle size={24} className="text-success-600 dark:text-success-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Administrators</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.admins}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <Shield size={24} className="text-warning-600 dark:text-warning-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                roleFilter === 'all'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setRoleFilter('user')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                roleFilter === 'user'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              }`}
            >
              Regular Users
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                roleFilter === 'admin'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              }`}
            >
              Admins
            </button>
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
            <Dropdown
              value={sortBy}
              onChange={(val) => setSortBy(val as 'name' | 'date' | 'role')}
              options={[
                { value: 'date', label: 'Sort by Date' },
                { value: 'name', label: 'Sort by Name' },
                { value: 'role', label: 'Sort by Role' },
              ]}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                  User
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden md:table-cell">
                  Email
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden sm:table-cell">
                  Role
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden lg:table-cell">
                  Joined
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 hidden lg:table-cell">
                  Status
                </th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                        <span className="text-sm font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-surface-400 md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <span className="text-sm text-surface-600 dark:text-surface-400">
                      {user.email}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <span
                      className={
                        user.role === 'admin' ? 'badge-primary' : 'badge-success'
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden lg:table-cell">
                    <span className="text-sm text-surface-500">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-success-500" />
                      <span className="text-sm text-surface-500">Active</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleRole(user.id)}
                        className="rounded-lg p-2 text-surface-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 transition-colors"
                        title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                      >
                        <Shield size={16} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg p-2 text-surface-400 hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        title="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-surface-300 dark:text-surface-700 mb-3" />
            <p className="text-surface-500 dark:text-surface-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
