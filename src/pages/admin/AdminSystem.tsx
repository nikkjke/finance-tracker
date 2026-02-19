import { Database, Server, HardDrive, Cpu, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminSystem() {
  const systemMetrics = [
    { label: 'API Server', status: 'healthy', uptime: '99.97%', latency: '45ms', color: 'success' },
    { label: 'Database', status: 'healthy', uptime: '99.95%', storage: '42% used', color: 'success' },
    { label: 'QR Service', status: 'degraded', uptime: '98.12%', queue: '12 pending', color: 'warning' },
    { label: 'Email Service', status: 'healthy', uptime: '99.89%', sent: '1,234 today', color: 'success' },
  ];

  const serverStats = [
    { name: 'Server 1 (US-East)', cpu: 45, memory: 67, disk: 52, status: 'healthy' },
    { name: 'Server 2 (EU-West)', cpu: 38, memory: 58, disk: 48, status: 'healthy' },
    { name: 'Server 3 (Asia-Pacific)', cpu: 72, memory: 81, disk: 65, status: 'warning' },
  ];

  const recentLogs = [
    { time: '2026-02-19 14:32:15', level: 'info', message: 'Database backup completed successfully' },
    { time: '2026-02-19 14:15:03', level: 'warning', message: 'High memory usage detected on Server 3' },
    { time: '2026-02-19 13:45:22', level: 'error', message: 'QR Service: Queue processor timeout' },
    { time: '2026-02-19 12:30:11', level: 'info', message: 'Scheduled maintenance window started' },
    { time: '2026-02-19 11:22:45', level: 'info', message: 'Security patches applied successfully' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Database size={20} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">System Health</h1>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Monitor system performance and infrastructure health.
        </p>
      </div>

      {/* System Status */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  metric.color === 'success' ? 'bg-success-500' : 'bg-warning-500'
                }`}
              />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                {metric.label}
              </h3>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-surface-400">Status: {metric.status}</p>
              <p className="text-xs text-surface-400">Uptime: {metric.uptime}</p>
              <p className="text-xs text-surface-400">
                {metric.latency || metric.storage || metric.queue || metric.sent}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Server Statistics */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            Server Resources
          </h2>
          <p className="text-sm text-surface-400">Real-time resource utilization</p>
        </div>

        <div className="space-y-6">
          {serverStats.map((server, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-surface-400" />
                  <span className="text-sm font-medium text-surface-900 dark:text-white">
                    {server.name}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                    server.status === 'healthy'
                      ? 'bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400'
                      : 'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400'
                  }`}
                >
                  {server.status === 'healthy' ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )}
                  {server.status}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* CPU */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Cpu size={12} className="text-surface-400" />
                      <span className="text-xs text-surface-500">CPU</span>
                    </div>
                    <span className="text-xs font-medium text-surface-900 dark:text-white">
                      {server.cpu}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        server.cpu > 70
                          ? 'bg-warning-500'
                          : server.cpu > 50
                          ? 'bg-primary-500'
                          : 'bg-success-500'
                      }`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Activity size={12} className="text-surface-400" />
                      <span className="text-xs text-surface-500">Memory</span>
                    </div>
                    <span className="text-xs font-medium text-surface-900 dark:text-white">
                      {server.memory}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        server.memory > 70
                          ? 'bg-warning-500'
                          : server.memory > 50
                          ? 'bg-primary-500'
                          : 'bg-success-500'
                      }`}
                      style={{ width: `${server.memory}%` }}
                    />
                  </div>
                </div>

                {/* Disk */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <HardDrive size={12} className="text-surface-400" />
                      <span className="text-xs text-surface-500">Disk</span>
                    </div>
                    <span className="text-xs font-medium text-surface-900 dark:text-white">
                      {server.disk}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        server.disk > 70
                          ? 'bg-warning-500'
                          : server.disk > 50
                          ? 'bg-primary-500'
                          : 'bg-success-500'
                      }`}
                      style={{ width: `${server.disk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Logs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              System Logs
            </h2>
            <p className="text-sm text-surface-400">Recent system events</p>
          </div>
          <button className="btn-secondary btn-sm">View All Logs</button>
        </div>

        <div className="space-y-2">
          {recentLogs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800"
            >
              <div
                className={`mt-1 h-2 w-2 rounded-full ${
                  log.level === 'error'
                    ? 'bg-danger-500'
                    : log.level === 'warning'
                    ? 'bg-warning-500'
                    : 'bg-success-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-surface-900 dark:text-white">{log.message}</p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${
                      log.level === 'error'
                        ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400'
                        : log.level === 'warning'
                        ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400'
                        : 'bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400'
                    }`}
                  >
                    {log.level}
                  </span>
                </div>
                <p className="text-xs text-surface-400 mt-1">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            System Actions
          </h2>
          <p className="text-sm text-surface-400">Manage system operations</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button className="btn-secondary justify-start">
            <Database size={16} />
            Backup Database
          </button>
          <button className="btn-secondary justify-start">
            <Activity size={16} />
            Run Diagnostics
          </button>
          <button className="btn-secondary justify-start">
            <Server size={16} />
            Restart Services
          </button>
          <button className="btn-secondary justify-start">
            <CheckCircle size={16} />
            Clear Cache
          </button>
          <button className="btn-secondary justify-start">
            <AlertTriangle size={16} />
            View Error Logs
          </button>
          <button className="btn-secondary justify-start">
            <Cpu size={16} />
            Performance Test
          </button>
        </div>
      </div>
    </div>
  );
}
