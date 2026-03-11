import { useState } from 'react';
import { Save, Shield, Bell, Database, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import Dropdown from '../../components/ui/Dropdown';

export default function AdminSettings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // System Settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [dataRetention, setDataRetention] = useState('365');
  const [sessionTimeout, setSessionTimeout] = useState('60');

  // Security Settings
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState('5');

  // Alert Settings
  const [suspiciousActivityAlerts, setSuspiciousActivityAlerts] = useState(true);
  const [systemErrorAlerts, setSystemErrorAlerts] = useState(true);
  const [userRegistrationAlerts, setUserRegistrationAlerts] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Backup Settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Admin Settings</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Configure system-wide settings and preferences.
        </p>
      </div>

      {/* Admin Profile */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          Admin Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
            <Shield size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-surface-400">{user?.email}</p>
            <span className="badge-primary mt-1">Administrator</span>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Database size={18} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            System Settings
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Maintenance Mode</p>
              <p className="text-xs text-surface-400">Temporarily disable user access for maintenance</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                maintenanceMode ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Data Retention (days)</label>
              <Dropdown
                value={dataRetention}
                onChange={setDataRetention}
                icon={<Database size={16} />}
                fullWidth
                options={[
                  { value: '90', label: '90 Days' },
                  { value: '180', label: '180 Days' },
                  { value: '365', label: '1 Year' },
                  { value: '730', label: '2 Years' },
                  { value: 'unlimited', label: 'Unlimited' },
                ]}
              />
            </div>
            <div>
              <label className="label">Session Timeout (minutes)</label>
              <Dropdown
                value={sessionTimeout}
                onChange={setSessionTimeout}
                icon={<Clock size={16} />}
                fullWidth
                options={[
                  { value: '15', label: '15 Minutes' },
                  { value: '30', label: '30 Minutes' },
                  { value: '60', label: '1 Hour' },
                  { value: '120', label: '2 Hours' },
                  { value: '480', label: '8 Hours' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-surface-400">Toggle between light and dark themes</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Shield size={18} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            Security Settings
          </h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Password Min Length</label>
              <Dropdown
                value={passwordMinLength}
                onChange={setPasswordMinLength}
                icon={<Shield size={16} />}
                fullWidth
                options={[
                  { value: '6', label: '6 Characters' },
                  { value: '8', label: '8 Characters' },
                  { value: '10', label: '10 Characters' },
                  { value: '12', label: '12 Characters' },
                ]}
              />
            </div>
            <div>
              <label className="label">Max Login Attempts</label>
              <Dropdown
                value={loginAttempts}
                onChange={setLoginAttempts}
                icon={<Shield size={16} />}
                fullWidth
                options={[
                  { value: '3', label: '3 Attempts' },
                  { value: '5', label: '5 Attempts' },
                  { value: '10', label: '10 Attempts' },
                  { value: 'unlimited', label: 'Unlimited' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Require Special Characters</p>
              <p className="text-xs text-surface-400">Passwords must contain special characters</p>
            </div>
            <button
              onClick={() => setRequireSpecialChars(!requireSpecialChars)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                requireSpecialChars ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  requireSpecialChars ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-xs text-surface-400">Require 2FA for all admin accounts</p>
            </div>
            <button
              onClick={() => setTwoFactorAuth(!twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorAuth ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Bell size={18} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            Admin Notifications
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Suspicious Activity Alerts</p>
              <p className="text-xs text-surface-400">Get notified of unusual user behavior</p>
            </div>
            <button
              onClick={() => setSuspiciousActivityAlerts(!suspiciousActivityAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                suspiciousActivityAlerts ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  suspiciousActivityAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">System Error Alerts</p>
              <p className="text-xs text-surface-400">Critical system errors and failures</p>
            </div>
            <button
              onClick={() => setSystemErrorAlerts(!systemErrorAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                systemErrorAlerts ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemErrorAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">New User Registrations</p>
              <p className="text-xs text-surface-400">Alert when new users sign up</p>
            </div>
            <button
              onClick={() => setUserRegistrationAlerts(!userRegistrationAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userRegistrationAlerts ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userRegistrationAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Daily Digest</p>
              <p className="text-xs text-surface-400">Daily summary of platform activity</p>
            </div>
            <button
              onClick={() => setDailyDigest(!dailyDigest)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                dailyDigest ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  dailyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={18} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">
            Backup & Data
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4 dark:border-surface-700">
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">Automatic Backups</p>
              <p className="text-xs text-surface-400">Automatically backup database on schedule</p>
            </div>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoBackup ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {autoBackup && (
            <div>
              <label className="label">Backup Frequency</label>
              <Dropdown
                value={backupFrequency}
                onChange={setBackupFrequency}
                icon={<Clock size={16} />}
                fullWidth
                options={[
                  { value: 'hourly', label: 'Every Hour' },
                  { value: 'daily', label: 'Daily at 2 AM' },
                  { value: 'weekly', label: 'Weekly (Sundays)' },
                  { value: 'monthly', label: 'Monthly (1st of month)' },
                ]}
              />
            </div>
          )}

          <button className="btn-secondary w-full sm:w-auto">
            <Database size={16} />
            Create Backup Now
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-success-50 px-4 py-2 text-sm font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">
            Settings saved successfully
          </div>
        )}
        <button onClick={handleSave} className="btn-primary">
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
