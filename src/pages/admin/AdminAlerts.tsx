import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Bell,
  Search,
  Trash2,
  Eye,
} from 'lucide-react';
import Dropdown from '../../components/ui/Dropdown';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  resolved: boolean;
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Payment Gateway Latency',
      message: 'Spike in payment processing time detected. Monitoring for stability.',
      type: 'warning',
      severity: 'high',
      timestamp: '2026-02-19T14:10:00',
      read: false,
      resolved: false,
    },
    {
      id: '2',
      title: 'QR Service Degraded',
      message: 'QR scanning service has 12 pending requests in queue. Processing time increased.',
      type: 'warning',
      severity: 'medium',
      timestamp: '2026-02-19T13:45:00',
      read: false,
      resolved: false,
    },
    {
      id: '3',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully. 2.4GB backed up to cloud storage.',
      type: 'success',
      severity: 'low',
      timestamp: '2026-02-19T12:00:00',
      read: true,
      resolved: true,
    },
    {
      id: '4',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected from IP 192.168.1.45. Possible security threat.',
      type: 'error',
      severity: 'critical',
      timestamp: '2026-02-19T11:30:00',
      read: false,
      resolved: false,
    },
    {
      id: '5',
      title: 'New Users Spike',
      message: 'Unusual increase in new user registrations (+45% above average). Monitor for spam.',
      type: 'info',
      severity: 'medium',
      timestamp: '2026-02-19T10:15:00',
      read: true,
      resolved: false,
    },
    {
      id: '6',
      title: 'Payment Gateway Update',
      message: 'Payment gateway will undergo maintenance on Feb 21, 2026 from 2:00 AM - 4:00 AM.',
      type: 'info',
      severity: 'low',
      timestamp: '2026-02-18T16:00:00',
      read: true,
      resolved: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'unresolved'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unread' && !alert.read) ||
      (statusFilter === 'unresolved' && !alert.resolved);
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, resolved: true, read: true } : alert
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }
  };

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const stats = {
    total: alerts.length,
    unread: alerts.filter((a) => !a.read).length,
    critical: alerts.filter((a) => a.severity === 'critical' && !a.resolved).length,
    unresolved: alerts.filter((a) => !a.resolved).length,
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-500/20';
      case 'warning':
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-500/20';
      case 'success':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-500/20';
      default:
        return 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-500/20';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-danger-500 text-white',
      high: 'bg-warning-500 text-white',
      medium: 'bg-primary-500 text-white',
      low: 'bg-surface-300 text-surface-700 dark:bg-surface-700 dark:text-surface-300',
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={20} className="text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Alerts & Notifications
            </h1>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Monitor system alerts and notifications.
          </p>
        </div>
        <button onClick={handleMarkAllAsRead} className="btn-secondary">
          Mark All as Read
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Alerts</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <Bell size={24} className="text-primary-600 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Unread</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.unread}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-info-100 dark:bg-info-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <Info size={24} className="text-info-600 dark:text-info-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Critical</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.critical}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <AlertCircle size={24} className="text-danger-600 dark:text-danger-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>

        <div className="card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-500/[0.06] dark:hover:border-primary-500/25 dark:hover:shadow-primary-500/[0.08]">
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full dark:via-white/[0.04]" />
          <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary-400/0 blur-2xl transition-all duration-500 group-hover:bg-primary-400/10 dark:group-hover:bg-primary-400/[0.07]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Unresolved</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats.unresolved}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-6">
              <AlertTriangle size={24} className="text-warning-600 dark:text-warning-400 transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setTypeFilter('error')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  typeFilter === 'error'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                Errors
              </button>
              <button
                onClick={() => setTypeFilter('warning')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  typeFilter === 'warning'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                Warnings
              </button>
              <button
                onClick={() => setTypeFilter('info')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  typeFilter === 'info'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                }`}
              >
                Info
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search alerts..."
                  className="input pl-9 w-full sm:w-64"
                />
              </div>
              <Dropdown
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as 'all' | 'unread' | 'unresolved')}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'unread', label: 'Unread' },
                  { value: 'unresolved', label: 'Unresolved' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-colors ${
                alert.read
                  ? 'border-surface-200 bg-surface-50/50 dark:border-surface-700 dark:bg-surface-800/50'
                  : 'border-surface-300 bg-white dark:border-surface-600 dark:bg-surface-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${getAlertColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                        {alert.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityBadge(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      {!alert.read && (
                        <span className="h-2 w-2 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {!alert.read && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                          title="Mark as read"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      {!alert.resolved && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="rounded-lg p-1.5 text-surface-400 hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-500/10 transition-colors"
                          title="Resolve"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-surface-400">
                    <span>
                      {new Date(alert.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {alert.resolved && (
                      <span className="inline-flex items-center gap-1 text-success-600 dark:text-success-400">
                        <CheckCircle size={12} />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-surface-300 dark:text-surface-700 mb-3" />
            <p className="text-surface-500 dark:text-surface-400">No alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
