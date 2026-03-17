import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, ChevronDown, PanelLeftClose, PanelLeftOpen, Check, Trash2 } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import type { UserRole } from '../../types';

interface NavbarProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function Navbar({ onMenuClick, onToggleSidebar, sidebarCollapsed }: NavbarProps) {
  const { user, switchRole } = useAuth();
  const { notifications, markAsRead, deleteNotification, unreadCount } = useNotification();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Remove document event listener. Instead, handle click capture at root header.
  const handleRootClick = (e: React.MouseEvent<HTMLElement>) => {
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
      setShowNotifications(false);
    }
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
      setShowProfile(false);
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowProfile(false);
    // Navigate to the correct dashboard for the new role
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-4 backdrop-blur-md dark:border-surface-700 dark:bg-surface-900/80 lg:px-6" onClickCapture={handleRootClick}>
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 lg:hidden dark:hover:bg-surface-700"
        >
          <Menu size={20} />
        </button>
        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Welcome back,{' '}
            <span className="font-semibold text-surface-900 dark:text-white">
              {user?.name || 'User'}
            </span>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <ThemeToggle className="mx-1" />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-surface-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-800 z-50">
              <div className="border-b border-surface-200 px-4 py-3 flex items-center justify-between dark:border-surface-700">
                <div>
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">
                    Notifications
                  </h4>
                  <p className="text-xs text-surface-500">{unreadCount} unread</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell size={32} className="mx-auto text-surface-300 dark:text-surface-700 mb-2" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`border-b border-surface-100 px-4 py-3 last:border-0 dark:border-surface-700 group hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors ${
                        !notif.read ? 'bg-primary-50/50 dark:bg-primary-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900 dark:text-white leading-snug">
                            {notif.title}
                          </p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif.id);
                              }}
                              className="rounded p-1 text-surface-400 hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-500/10 dark:hover:text-success-400 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={12} />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="rounded p-1 text-surface-400 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-500/10 dark:hover:text-danger-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 5 && (
                <div className="border-t border-surface-200 px-4 py-2 text-center dark:border-surface-700">
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
                  >
                    View {notifications.length - 5} more notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <ChevronDown size={14} className="text-surface-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-surface-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-800">
              <div className="border-b border-surface-200 px-4 py-3 dark:border-surface-700">
                <p className="text-sm font-semibold text-surface-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-surface-400">{user?.email}</p>
                <span className="badge-primary mt-1.5">{user?.role}</span>
              </div>
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-surface-400">
                  Switch Role
                </p>
                <button
                  onClick={() => handleRoleSwitch('user')}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    user?.role === 'user'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700'
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    user?.role === 'admin'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
