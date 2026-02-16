import { useState } from 'react';
import { Save, Camera, DollarSign, Globe } from 'lucide-react';
import Dropdown from '../../components/ui/Dropdown';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReport: true,
    receiptScans: false,
    promotions: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile Settings</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          Profile Photo
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
              <span className="text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 rounded-full bg-primary-600 p-1.5 text-white shadow-sm hover:bg-primary-700 transition-colors">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">{name}</p>
            <p className="text-xs text-surface-400">{email}</p>
            <span className="badge-primary mt-1">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          Personal Information
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Currency</label>
              <Dropdown
                value={currency}
                onChange={setCurrency}
                icon={<DollarSign size={16} />}
                fullWidth
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'RON', label: 'RON (lei)' },
                  { value: 'GBP', label: 'GBP (£)' },
                ]}
              />
            </div>
            <div>
              <label className="label">Language</label>
              <Dropdown
                value={language}
                onChange={setLanguage}
                icon={<Globe size={16} />}
                fullWidth
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'ro', label: 'Română' },
                  { value: 'de', label: 'Deutsch' },
                  { value: 'fr', label: 'Français' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Dark Mode</p>
            <p className="text-xs text-surface-400">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-primary-600' : 'bg-surface-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: 'budgetAlerts' as const, label: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
            { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly spending summary' },
            { key: 'receiptScans' as const, label: 'Receipt Scans', desc: 'Notifications for scanned receipt processing' },
            { key: 'promotions' as const, label: 'Promotions', desc: 'Updates about new features and offers' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{item.label}</p>
                <p className="text-xs text-surface-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-primary-600' : 'bg-surface-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary">
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
        {saved && (
          <span className="text-sm text-success-500">Profile updated successfully.</span>
        )}
      </div>
    </div>
  );
}
