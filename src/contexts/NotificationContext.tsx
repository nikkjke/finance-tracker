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
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

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
          return JSON.parse(saved);
        } catch {
          // If parsing fails, return appropriate default
          return user.id === '1' ? initialNotifications : [];
        }
      }
    }
    
    // For demo user (ID '1'), return mock notifications
    // For new users, return empty array
    return user.id === '1' ? initialNotifications : [];
  });

  // Update notifications when user changes
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
          setNotifications(JSON.parse(saved));
        } catch {
          setNotifications(user.id === '1' ? initialNotifications : []);
        }
      } else {
        // No saved notifications, set based on user type
        setNotifications(user.id === '1' ? initialNotifications : []);
      }
    }
  }, [user]);

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const storageKey = `notifications_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

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
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    markAsRead,
    markAsUnread,
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
