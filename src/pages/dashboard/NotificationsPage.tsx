import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Info,
  TrendingDown,
  Wallet,
  DollarSign,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';

// ── Types ────────────────────────────────────────────────────────
type NotificationType = 'budget' | 'expense' | 'income' | 'system' | 'security';
type NotificationPriority = 'low' | 'medium' | 'high';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
}

// ── Mock data ────────────────────────────────────────────────────
const generateMockNotifications = (_userId: string): Notification[] => [
  {
    id: 'n-1',
    title: 'Budget limit approaching',
    message: 'You\'ve used 85% of your Food & Groceries budget this month. Consider reducing spending to stay within limits.',
    type: 'budget',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    read: false,
  },
  {
    id: 'n-2',
    title: 'Large expense recorded',
    message: 'A transaction of $245.50 was recorded at Kaufland. This is above your average purchase amount.',
    type: 'expense',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
    read: false,
  },
  {
    id: 'n-3',
    title: 'Income received',
    message: 'Salary deposit of $3,200.00 has been recorded to your account.',
    type: 'income',
    priority: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hrs ago
    read: false,
  },
  {
    id: 'n-4',
    title: 'Weekly spending report',
    message: 'Your total spending this week is $567.30, which is 12% higher than last week. Top category: Entertainment.',
    type: 'system',
    priority: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: 'n-5',
    title: 'Budget exceeded!',
    message: 'Your Entertainment budget has been exceeded by $45.00. You\'ve spent $345.00 out of the $300.00 limit.',
    type: 'budget',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: false,
  },
  {
    id: 'n-6',
    title: 'New login detected',
    message: 'A new login was detected from Windows device. If this wasn\'t you, please secure your account.',
    type: 'security',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: true,
  },
  {
    id: 'n-7',
    title: 'Subscription renewal',
    message: 'Your Netflix subscription of $15.99 will renew in 3 days. Ensure sufficient budget allocation.',
    type: 'expense',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    read: true,
  },
  {
    id: 'n-8',
    title: 'Monthly summary available',
    message: 'Your February 2026 financial summary is ready. View your reports for a detailed breakdown.',
    type: 'system',
    priority: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    read: true,
  },
  {
    id: 'n-9',
    title: 'Savings goal milestone',
    message: 'Congratulations! You\'ve saved $1,000 this month — 25% more than your target.',
    type: 'income',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    read: true,
  },
  {
    id: 'n-10',
    title: 'Unusual spending pattern',
    message: 'We noticed multiple transactions at gas stations today totaling $89.40. Just keeping you informed.',
    type: 'expense',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    read: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────────
const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'budget':
      return <Wallet size={18} />;
    case 'expense':
      return <TrendingDown size={18} />;
    case 'income':
      return <DollarSign size={18} />;
    case 'security':
      return <ShieldAlert size={18} />;
    default:
      return <Info size={18} />;
  }
};

const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case 'budget':
      return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-500/20';
    case 'expense':
      return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-500/20';
    case 'income':
      return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-500/20';
    case 'security':
      return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-500/20';
    default:
      return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-500/20';
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  switch (priority) {
    case 'high':
      return 'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400';
    case 'medium':
      return 'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400';
    default:
      return 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400';
  }
};

const formatRelativeTime = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ── Component ────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | NotificationType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Load notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(generateMockNotifications(user?.id || '1'));
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [user?.id]);

  // ── Actions ──────────────────────────────────────────────────
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDeleteConfirmId(null);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setClearAllConfirm(false);
  }, []);

  // ── Filtered list ────────────────────────────────────────────
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || n.type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !n.read) ||
        (statusFilter === 'read' && n.read);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter]);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    highPriority: notifications.filter((n) => n.priority === 'high' && !n.read).length,
  }), [notifications]);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size={40} />
          <p className="mt-4 text-surface-600 dark:text-surface-300">Loading notifications...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell size={20} className="text-primary-600 dark:text-primary-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                  Notifications
                </h1>
                {stats.unread > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-600 px-2 text-xs font-bold text-white">
                    {stats.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Stay updated with your financial activity and alerts.
              </p>
            </div>
            <div className="flex gap-2">
              {stats.unread > 0 && (
                <button onClick={markAllAsRead} className="btn-secondary">
                  <CheckCheck size={16} />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => setClearAllConfirm(true)}
                  className="btn-ghost text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                >
                  <Trash2 size={16} />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Total</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                  <Bell size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Unread</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{stats.unread}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center">
                  <BellOff size={20} className="text-warning-600 dark:text-warning-400" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">High Priority</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{stats.highPriority}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-danger-600 dark:text-danger-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          {notifications.length > 0 && (
            <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <Dropdown
                  value={typeFilter}
                  onChange={(val) => setTypeFilter(val as typeof typeFilter)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'budget', label: 'Budget' },
                    { value: 'expense', label: 'Expense' },
                    { value: 'income', label: 'Income' },
                    { value: 'security', label: 'Security' },
                    { value: 'system', label: 'System' },
                  ]}
                  icon={<Filter size={16} />}
                />
                <Dropdown
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val as typeof statusFilter)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'unread', label: 'Unread' },
                    { value: 'read', label: 'Read' },
                  ]}
                  icon={<Bell size={16} />}
                />
              </div>
            </div>
          )}

          {/* Notification list */}
          {notifications.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title="No notifications"
              description="You're all caught up! We'll notify you when something important happens."
            />
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching notifications"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`card group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                    !notification.read
                      ? 'border-l-4 border-l-primary-500 dark:border-l-primary-400'
                      : 'opacity-80'
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (!notification.read) markAsRead(notification.id);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-semibold ${!notification.read ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'}`}>
                              {notification.title}
                            </h3>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${getPriorityBadge(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>

                        {/* Actions — shown on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.read ? (
                            <button
                              onClick={() => markAsUnread(notification.id)}
                              className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-700 dark:hover:text-surface-300 transition-colors"
                              title="Mark as unread"
                            >
                              <BellOff size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="rounded-lg p-1.5 text-surface-400 hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-500/10 dark:hover:text-success-400 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmId(notification.id)}
                            className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10 dark:hover:text-danger-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Timestamp & type */}
                      <div className="mt-2 flex items-center gap-3 text-xs text-surface-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <Modal
            open={deleteConfirmId !== null}
            onClose={() => setDeleteConfirmId(null)}
            title="Delete Notification"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 p-3">
                <AlertTriangle size={20} className="text-danger-600 dark:text-danger-400 shrink-0 mt-0.5" />
                <p className="text-sm text-danger-700 dark:text-danger-300">
                  Are you sure you want to delete this notification? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="btn-ghost">
                  Cancel
                </button>
                <button
                  onClick={() => deleteConfirmId && deleteNotification(deleteConfirmId)}
                  className="btn-primary bg-danger-600 hover:bg-danger-700"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </Modal>

          {/* Clear All Confirmation Modal */}
          <Modal
            open={clearAllConfirm}
            onClose={() => setClearAllConfirm(false)}
            title="Clear All Notifications"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 p-3">
                <AlertTriangle size={20} className="text-danger-600 dark:text-danger-400 shrink-0 mt-0.5" />
                <p className="text-sm text-danger-700 dark:text-danger-300">
                  This will permanently remove all {notifications.length} notifications. This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setClearAllConfirm(false)} className="btn-ghost">
                  Cancel
                </button>
                <button
                  onClick={clearAll}
                  className="btn-primary bg-danger-600 hover:bg-danger-700"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>
          </Modal>

          {/* Notification Detail Modal */}
          <Modal
            open={selectedNotification !== null}
            onClose={() => setSelectedNotification(null)}
            title="Notification Details"
          >
            {selectedNotification && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getTypeColor(selectedNotification.type)}`}>
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white">
                      {selectedNotification.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${getPriorityBadge(selectedNotification.priority)}`}>
                        {selectedNotification.priority}
                      </span>
                      <span className="text-xs text-surface-400 capitalize">{selectedNotification.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
                  {selectedNotification.message}
                </p>

                <div className="flex items-center gap-2 text-xs text-surface-400 border-t border-surface-200 dark:border-surface-700 pt-3">
                  <Clock size={12} />
                  {new Date(selectedNotification.timestamp).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {selectedNotification.read ? (
                    <button
                      onClick={() => {
                        markAsUnread(selectedNotification.id);
                        setSelectedNotification({ ...selectedNotification, read: false });
                      }}
                      className="btn-secondary"
                    >
                      <BellOff size={16} />
                      Mark as unread
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        setSelectedNotification({ ...selectedNotification, read: true });
                      }}
                      className="btn-secondary"
                    >
                      <Check size={16} />
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedNotification(null);
                      setDeleteConfirmId(selectedNotification.id);
                    }}
                    className="btn-primary bg-danger-600 hover:bg-danger-700"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}
