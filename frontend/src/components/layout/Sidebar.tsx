import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Wallet,
  X,
  Users,
  TrendingUp,
  FileText,
  Bell,
} from 'lucide-react';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export default function Sidebar({ open, onClose, collapsed }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const userLinks = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/add-expense', label: t('addExpense'), icon: PlusCircle },
    { to: '/add-income', label: t('addIncome'), icon: TrendingUp },
    { to: '/budgets', label: t('budgets'), icon: Wallet },
    { to: '/reports', label: t('reports'), icon: BarChart3 },
    { to: '/notifications', label: t('notifications'), icon: Bell },
  ];

  const adminLinks = [
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/content', label: 'Content', icon: FileText },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200/50 dark:bg-primary-500/10 dark:text-primary-400 dark:ring-primary-500/20'
        : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800/50'
    }`;

  const collapsedLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center rounded-lg p-2.5 transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200/50 dark:bg-primary-500/10 dark:text-primary-400 dark:ring-primary-500/20'
        : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800/50'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[210] flex flex-col border-r border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900 lg:static ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          collapsed ? 'lg:w-[68px]' : 'w-64'
        }`}
        style={{ transitionProperty: 'transform, width', transitionDuration: '300ms' }}
      >
        {/* Logo */}
        <div className={`flex h-16 items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-1">
            <img src={fintrackLogo} alt="FinTrack" className="h-12 w-12 shrink-0" />
            {!collapsed && (
              <span className="text-lg font-bold text-surface-900 dark:text-white">
                FinTrack
              </span>
            )}
          </NavLink>
          {!collapsed && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 lg:hidden dark:hover:bg-surface-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-4 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-surface-400">
              {user?.role === 'admin' ? 'Admin Panel' : 'Menu'}
            </p>
          )}
          
          {/* Show admin links for admin, user links for regular users */}
          {user?.role === 'admin' ? (
            adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={collapsed ? collapsedLinkClass : linkClass}
                onClick={onClose}
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={18} />
                {!collapsed && link.label}
              </NavLink>
            ))
          ) : (
            userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={collapsed ? collapsedLinkClass : linkClass}
                onClick={onClose}
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={18} />
                {!collapsed && link.label}
              </NavLink>
            ))
          )}
        </nav>

        {/* Bottom actions removed in favor of profile menu */}
      </aside>
    </>
  );
}
