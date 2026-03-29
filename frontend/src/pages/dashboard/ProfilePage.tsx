import { useEffect, useRef, useState } from 'react';
import { Save, Camera, DollarSign, Globe } from 'lucide-react';
import Dropdown from '../../components/ui/Dropdown';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useNotification } from '../../contexts/NotificationContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { pushNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReport: true,
    receiptScans: false,
    promotions: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatar || '');
  }, [user?.name, user?.email, user?.avatar]);

  const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      pushNotification({
        title: 'Profile picture not updated',
        message: 'Please select a valid image file for your profile photo.',
        type: 'system',
        priority: 'medium',
      });
      event.target.value = '';
      return;
    }

    const fileSizeLimit = 2 * 1024 * 1024;
    if (file.size > fileSizeLimit) {
      pushNotification({
        title: 'Profile picture too large',
        message: 'Please select an image smaller than 2MB.',
        type: 'system',
        priority: 'medium',
      });
      event.target.value = '';
      return;
    }

    const imageAsBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('Unable to read selected image.'));
      reader.readAsDataURL(file);
    }).catch(() => '');

    if (!imageAsBase64) {
      pushNotification({
        title: 'Profile picture not updated',
        message: 'We could not process the selected image. Please try another one.',
        type: 'system',
        priority: 'medium',
      });
      event.target.value = '';
      return;
    }

    setAvatar(imageAsBase64);
    event.target.value = '';
  };

  const handleSave = () => {
    if (!user) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const changedFields: string[] = [];

    if (trimmedName !== user.name) {
      changedFields.push('name');
    }
    if (trimmedEmail !== user.email) {
      changedFields.push('email');
    }
    if ((avatar || '') !== (user.avatar || '')) {
      changedFields.push('profile picture');
    }

    updateUser({ name: trimmedName, email: trimmedEmail, avatar });

    if (changedFields.length > 0) {
      const fields = changedFields.join(', ');
      pushNotification({
        title: 'Profile updated',
        message: `Your ${fields} ${changedFields.length === 1 ? 'was' : 'were'} updated.`,
        type: 'system',
        priority: 'low',
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Profile Settings</h1>
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
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                <span className="text-2xl font-bold">{(name || user?.name || 'U').charAt(0).toUpperCase()}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full bg-primary-600 p-1.5 text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void handleAvatarSelect(event);
              }}
            />
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
                  { value: 'MDL', label: 'MDL (lei)' },
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
                  { value: 'ro', label: 'Română' },
                  { value: 'en', label: 'English' },
                  { value: 'ru', label: 'Русский' },
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
          <ThemeToggle />
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key] ? 'bg-primary-600' : 'bg-surface-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
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
