import { useEffect, useMemo, useRef, useState } from 'react';
import { Save, Camera, DollarSign, Globe } from 'lucide-react';
import Dropdown from '../../components/ui/Dropdown';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useNotification } from '../../contexts/NotificationContext';
import { useContent } from '../../contexts/ContentContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { pushNotification } = useNotification();
  const { currencies } = useContent();
  const { currency, setCurrency } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReport: true,
    receiptScans: false,
  });
  const [saved, setSaved] = useState(false);

  const profilePrefsKey = user ? `profile_prefs_${user.id}` : 'profile_prefs_guest';

  const fallbackCurrencyOptions = useMemo(() => ([
    { value: 'USD', label: 'USD ($)' },
    { value: 'MDL', label: 'MDL (lei)' },
  ]), []);

  const currencyOptions = useMemo(() => {
    if (currencies.length === 0) {
      return fallbackCurrencyOptions;
    }

    return [...currencies]
      .filter((curr) => curr.code === 'USD' || curr.code === 'MDL')
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((curr) => ({ value: curr.code, label: `${curr.code} (${curr.symbol})` }));
  }, [currencies, fallbackCurrencyOptions]);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatar(user?.avatar || '');
  }, [user?.name, user?.email, user?.avatar]);

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(profilePrefsKey);
      if (!savedPrefs) {
        return;
      }

      const parsed = JSON.parse(savedPrefs) as {
        currency?: string;
        language?: string;
        notifications?: {
          budgetAlerts?: boolean;
          weeklyReport?: boolean;
          receiptScans?: boolean;
        };
      };

      if (parsed.notifications) {
        setNotifications((prev) => ({
          ...prev,
          ...parsed.notifications,
        }));
      }
    } catch {
      // Ignore malformed local data.
    }
  }, [profilePrefsKey]);

  useEffect(() => {
    if (currencyOptions.length === 0) return;
    const hasCurrent = currencyOptions.some((option) => option.value === currency);
    if (!hasCurrent) {
      setCurrency(currencyOptions[0].value as 'USD' | 'MDL');
    }
  }, [currency, currencyOptions]);

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

    try {
      localStorage.setItem(
        profilePrefsKey,
        JSON.stringify({
          notifications,
        }),
      );
    } catch {
      // Ignore localStorage failures (private mode, quota, etc.).
    }

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
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">{t('profileSettings')}</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {t('manageSettings')}
        </p>
      </div>

      {/* Avatar Section */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          {t('profilePhoto')}
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
          {t('personalInfo')}
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t('fullName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">{t('email')}</label>
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
              <label className="label">{t('currency')}</label>
              <Dropdown
                value={currency}
                onChange={(val) => setCurrency(val as 'USD' | 'MDL')}
                icon={<DollarSign size={16} />}
                fullWidth
                options={currencyOptions}
              />
            </div>
            <div>
              <label className="label">{t('language')}</label>
              <Dropdown
                value={language}
                onChange={(val) => setLanguage(val as 'en' | 'ro')}
                icon={<Globe size={16} />}
                fullWidth
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'ro', label: 'Română' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          {t('appearance')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{t('darkMode')}</p>
            <p className="text-xs text-surface-400">{t('darkModeDesc')}</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
          {t('notificationsTitle')}
        </h2>
        <div className="space-y-4">
          {[
            { key: 'budgetAlerts' as const, label: t('budgetAlerts'), desc: t('budgetAlertsDesc') },
            { key: 'weeklyReport' as const, label: t('weeklyReport'), desc: t('weeklyReportDesc') },
            { key: 'receiptScans' as const, label: t('receiptScans'), desc: t('receiptScansDesc') },
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
          {saved ? t('saved') : t('saveChanges')}
        </button>
        {saved && (
          <span className="text-sm text-success-500">{t('profileUpdated')}</span>
        )}
      </div>
    </div>
  );
}
