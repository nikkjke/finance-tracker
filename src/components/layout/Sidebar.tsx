import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Wallet,
  User,
  Settings,
  LogOut,
  X,
  Users,
  Activity,
  AlertCircle,
} from 'lucide-react';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export default function Sidebar({ open, onClose, collapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/add-expense', label: 'Add Expense', icon: PlusCircle },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/budgets', label: 'Budgets', icon: Wallet },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/transactions', label: 'Transactions', icon: Activity },
    { to: '/admin/alerts', label: 'Alerts', icon: AlertCircle },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
        : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700/50'
    }`;

  const collapsedLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center rounded-lg p-2.5 transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
        : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700/50'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900 lg:static ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          collapsed ? 'lg:w-[68px]' : 'w-64'
        }`}
        style={{ transitionProperty: 'transform, width', transitionDuration: '300ms' }}
      >
        {/* Logo */}
        <div className={`flex h-16 items-center border-b border-surface-200 dark:border-surface-700 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
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

        {/* Bottom actions */}
        <div className={`border-t border-surface-200 dark:border-surface-700 ${collapsed ? 'p-2' : 'p-3'}`}>
          <NavLink
            to="/profile"
            className={`flex items-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'}`}
            onClick={onClose}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings size={18} className="text-surface-400" />
            {!collapsed && <span className="text-sm text-surface-600 dark:text-surface-400">Settings</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className={`flex w-full items-center rounded-lg text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'}`}
            title={collapsed ? 'Log out' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
