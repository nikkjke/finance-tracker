import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Shield,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import Dropdown from '../../components/ui/Dropdown';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import StatCard from '../../components/ui/StatCard';
import { applyFilters, exportUsers, adminService } from '../../services';
import { useNotification } from '../../contexts/NotificationContext';
import type { User } from '../../types';
import type { FilterPipelineConfig, SortConfig } from '../../services/filterService';

export default function AdminUsers() {
  const { pushNotification } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'date-desc' | 'date-asc' | 'role-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users. You might not have permission.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, sortBy]);

  const sortConfig: SortConfig<User> =
    sortBy === 'name-asc'
      ? { key: 'name', direction: 'asc' as const }
      : sortBy === 'date-asc'
        ? { key: 'createdAt', direction: 'asc' as const }
        : sortBy === 'role-asc'
          ? { key: 'role', direction: 'asc' as const }
          : { key: 'createdAt', direction: 'desc' as const };

  const filterConfig: FilterPipelineConfig<User> = {
    searchQuery,
    searchFields: ['name', 'email'],
    filters: {
      role: roleFilter,
    },
    sort: sortConfig,
  };

  const filteredResult = applyFilters(users, filterConfig);
  const pipelineResult = applyFilters(users, {
    ...filterConfig,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const filteredUsers = filteredResult.items;
  const filteredUsersCount = filteredResult.totalItems;
  const paginatedUsers = pipelineResult.items;
  const totalPages = pipelineResult.pagination?.totalPages ?? 1;

  const handleDeleteUser = async (id: string) => {
    const userToDelete = users.find((u) => u.id === id);
    if (window.confirm(`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        pushNotification({
          title: 'Admin deleted user',
          message: `${userToDelete?.name ?? 'A user'} was removed from the platform.`,
          type: 'security',
          priority: 'high',
        });
      } catch (err) {
        pushNotification({
          title: 'Error',
          message: 'Failed to delete user.',
          type: 'error',
          priority: 'high',
        });
      }
    }
  };

  const handleToggleRole = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    // Check if the role is matching Title Case for Backend (User/Admin)
    const currentRole = targetUser.role.toLowerCase() === 'admin' ? 'Admin' : 'User';
    const nextRole = currentRole === 'Admin' ? 'User' : 'Admin';
    
    try {
      await adminService.changeUserRole(id, nextRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role: nextRole.toLowerCase() as 'user' | 'admin' } : u
        )
      );

      pushNotification({
        title: 'Admin changed role',
        message: `${targetUser.name} role changed to ${nextRole}.`,
        type: 'security',
        priority: 'high',
      });
    } catch (err) {
      pushNotification({
        title: 'Error',
        message: 'Failed to change user role.',
        type: 'error',
        priority: 'high',
      });
    }
  };

  const handleExport = () => {
    exportUsers(filteredUsers, { filename: 'users', format: 'csv' });
    pushNotification({
      title: 'Users export generated',
      message: `Admin exported ${filteredUsers.length} user records.`,
      type: 'system',
      priority: 'low',
    });
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.role.toLowerCase() === 'user').length,
    admins: users.filter((u) => u.role.toLowerCase() === 'admin').length,
  };

  return (
    <div className="space-y-6">
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
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="card flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading users...</p>
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="card">
          <ErrorState
            title="Access Denied or Error"
            message={error}
            onRetry={fetchUsers}
          />
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Users"
              value={stats.total}
              icon={<Users size={20} />}
              isCurrency={false}
            />
            <StatCard
              title="Active Users"
              value={stats.active}
              icon={<CheckCircle size={20} />}
              isCurrency={false}
            />
            <StatCard
              title="Administrators"
              value={stats.admins}
              icon={<Shield size={20} />}
              isCurrency={false}
            />
          </div>

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
                  onChange={(val) => setSortBy(val as 'name-asc' | 'date-desc' | 'date-asc' | 'role-asc')}
                  options={[
                    { value: 'date-desc', label: 'Newest First' },
                    { value: 'date-asc', label: 'Oldest First' },
                    { value: 'name-asc', label: 'Name (A-Z)' },
                    { value: 'role-asc', label: 'Role (A-Z)' },
                  ]}
                />
              </div>
            </div>

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
                  {paginatedUsers.map((user) => (
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
                            user.role.toLowerCase() === 'admin' ? 'badge-primary' : 'badge-success'
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
                            title={`Change to ${user.role.toLowerCase() === 'admin' ? 'user' : 'admin'}`}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="rounded-lg p-2 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10 dark:hover:text-danger-400 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <EmptyState
                icon={Users}
                title="No users found"
                description="Try adjusting your search query or role filter to find what you're looking for."
                className="rounded-lg border border-surface-200 dark:border-surface-700"
                action={
                  <button
                    onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                }
              />
            )}

            {filteredUsersCount > 0 && (
              <div className="mt-4 border-t border-surface-200 pt-4 dark:border-surface-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(count) => {
                    setItemsPerPage(count);
                    setCurrentPage(1);
                  }}
                  totalItems={filteredUsersCount}
                  loading={isLoading}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
