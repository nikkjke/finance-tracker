import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { mockNotifications as initialNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

export type NotificationType = 'budget' | 'expense' | 'income' | 'system' | 'security';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  resolved: boolean;
}

type CreateNotificationInput = {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
};

interface NotificationContextType {
  notifications: Notification[];
  pushNotification: (input: CreateNotificationInput) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  resolveNotification: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const normalizeNotifications = (items: Notification[]) =>
  items.map((notification) => ({
    ...notification,
    resolved: notification.resolved ?? false,
  }));

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // If no user is logged in, return empty array
    if (!user) return [];
    
    // Load user-specific notifications from localStorage
    if (typeof window !== 'undefined') {
      const storageKey = `notifications_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return normalizeNotifications(JSON.parse(saved) as Notification[]);
        } catch {
          // If parsing fails, return appropriate default
          return user.id === '1' ? normalizeNotifications(initialNotifications) : [];
        }
      }
    }
    
    // For demo user (ID '1'), return mock notifications
    // For new users, return empty array
    return user.id === '1' ? normalizeNotifications(initialNotifications) : [];
  });

  // Reload notifications only when account identity changes.
  // Profile updates (name/email/avatar) should not reset in-memory notifications.
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Load user-specific notifications
    if (typeof window !== 'undefined') {
      const storageKey = `notifications_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setNotifications(normalizeNotifications(JSON.parse(saved) as Notification[]));
        } catch {
          setNotifications(user.id === '1' ? normalizeNotifications(initialNotifications) : []);
        }
      } else {
        // No saved notifications, set based on user type
        setNotifications(user.id === '1' ? normalizeNotifications(initialNotifications) : []);
      }
    }
  }, [user?.id]);

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const storageKey = `notifications_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const pushNotification = useCallback((input: CreateNotificationInput) => {
    if (!user) {
      return;
    }

    const notification: Notification = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: input.title,
      message: input.message,
      type: input.type,
      priority: input.priority ?? 'low',
      timestamp: new Date().toISOString(),
      read: false,
      resolved: false,
    };

    setNotifications((prev) => [notification, ...prev]);
  }, [user]);

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

  const resolveNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, resolved: true, read: true } : n))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    pushNotification,
    markAsRead,
    markAsUnread,
    resolveNotification,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
