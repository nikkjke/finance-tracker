import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Download,
  Shield,
  Trash2,
  Edit,
  CheckCircle,
} from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import Dropdown from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { applyFilters } from '../../services';
import type { User } from '../../types';
import type { FilterPipelineConfig, SortConfig } from '../../services/filterService';

interface UserFormData {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UserFormErrors {
  name?: string;
  email?: string;
  role?: string;
}

const initialFormData: UserFormData = {
  name: '',
  email: '',
  role: 'user',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'date-desc' | 'date-asc' | 'role-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<UserFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = () => {
    setIsLoading(true);
    setError(null);
    // Simulate API call with delay
    setTimeout(() => {
      try {
        setUsers(mockUsers);
        setIsLoading(false);
      } catch {
        setError('Failed to load users. The service might be unavailable.');
        setIsLoading(false);
      }
    }, 800);
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

  const validateForm = () => {
    const nextErrors: UserFormErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      nextErrors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 100) {
      nextErrors.name = 'Name must be at most 100 characters';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Email must be valid';
    }

    if (!formData.role) {
      nextErrors.role = 'Role is required';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
              }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setIsSaving(false);
    setShowModal(false);
    setEditingUser(null);
  };

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

  const handleExport = () => {
    alert('Exporting user data... (Feature in development)');
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.role === 'user').length,
    admins: users.filter((u) => u.role === 'admin').length,
  };

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
          <button onClick={handleOpenCreate} className="btn-secondary flex items-center gap-2">
            <UserPlus size={16} />
            <span className="hidden sm:inline">Add User</span>
          </button>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="card">
          <ErrorState
            title="Failed to load users"
            message={error}
            onRetry={fetchUsers}
          />
        </div>
      )}

      {/* Content (only when loaded and no error) */}
      {!isLoading && !error && (
        <>
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
                        onClick={() => handleOpenEdit(user)}
                        className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg p-2 text-danger-500 hover:bg-danger-50 hover:text-danger-600 dark:text-danger-400 dark:hover:bg-danger-500/10 dark:hover:text-danger-300 transition-colors"
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

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          setFormErrors({});
        }}
        title={editingUser ? 'Edit User' : 'Create New User'}
      >
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="user-name">
              Full Name
            </label>
            <input
              id="user-name"
              type="text"
              maxLength={100}
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                setFormErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`input ${formErrors.name ? 'border-danger-500' : ''}`}
              placeholder="e.g. John Doe"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-danger-500">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="user-email">
              Email Address
            </label>
            <input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                setFormErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`input ${formErrors.email ? 'border-danger-500' : ''}`}
              placeholder="e.g. john@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-danger-500">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="label">Role</label>
            <Dropdown
              value={formData.role}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, role: val as 'user' | 'admin' }));
                setFormErrors((prev) => ({ ...prev, role: undefined }));
              }}
              options={[
                { value: 'user', label: 'Regular User' },
                { value: 'admin', label: 'Administrator' },
              ]}
              fullWidth
            />
            {formErrors.role && (
              <p className="mt-1 text-xs text-danger-500">{formErrors.role}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
              }}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </div>
      </Modal>
        </>
      )}
    </div>
  );
}
