import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  Trash2,
  Search,
  Loader2,
  Tag,
  Calendar,
  CreditCard,
  ShoppingBag,
  Car,
  Film,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  UtensilsCrossed,
  MoreHorizontal,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useExpenses } from '../../contexts/ExpenseContext';
import { useBudgets } from '../../contexts/BudgetContext';
import Modal from '../ui/Modal';
import Dropdown from '../ui/Dropdown';
import DatePicker from '../ui/DatePicker';
import { DebouncedInput, DebouncedTextarea } from '../ui/DebouncedInput';
import { categoryLabels, categoryColors } from '../../data/mockData';
import type { UserRole } from '../../types';

interface NavbarProps {
  onMenuClick: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  isScrolled?: boolean;
}

type SearchResultItem = {
  type: 'expense' | 'budget';
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  category: string;
  original: any;
};

const categoryIcons: Record<string, typeof ShoppingBag> = {
  food: UtensilsCrossed,
  transport: Car,
  entertainment: Film,
  shopping: ShoppingBag,
  bills: Zap,
  health: Heart,
  education: GraduationCap,
  travel: Plane,
  other: MoreHorizontal,
};

export default function Navbar({ onMenuClick, onToggleSidebar, sidebarCollapsed, isScrolled = false }: NavbarProps) {
  const { user, switchRole } = useAuth();
  const { notifications, markAsRead, deleteNotification, unreadCount } = useNotification();
  const { getExpenses, updateExpense } = useExpenses();
  const { getBudgets, updateBudget } = useBudgets();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [searchInteractionMode, setSearchInteractionMode] = useState<'mouse' | 'keyboard' | null>(null);
  
  // Edit Modal State
  const [selectedItem, setSelectedItem] = useState<{ type: 'expense' | 'budget'; data: any } | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const isSearchDropdownOpen = isSearchOpen && !!searchQuery.trim();
  const hasAnyOverlayOpen = showNotifications || showProfile || isSearchDropdownOpen;

  const closeAllOverlays = () => {
    setShowNotifications(false);
    setShowProfile(false);
    setIsSearchOpen(false);
    setActiveSearchIndex(null);
    setSearchInteractionMode(null);
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowProfile(false);
    // Navigate to the correct dashboard for the new role
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const searchResults = useMemo<SearchResultItem[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const rawTransactions = getExpenses(user?.role === 'admin' ? undefined : user?.id);
    const rawBudgets = getBudgets(user?.role === 'admin' ? undefined : user?.id);

    const expResults = rawTransactions
      .filter((t) =>
        t.storeName.toLowerCase().includes(query) ||
        (categoryLabels[t.category] || t.category).toLowerCase().includes(query)
      )
      .map((t) => ({
        type: 'expense' as const,
        id: t.id,
        title: t.storeName,
        subtitle: `${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} in ${categoryLabels[t.category] || t.category}`,
        amount: t.amount,
        category: t.category,
        original: t,
      }));

    const budResults = rawBudgets
      .filter((b) => (categoryLabels[b.category] || b.category).toLowerCase().includes(query))
      .map((b) => ({
        type: 'budget' as const,
        id: b.id,
        title: `${categoryLabels[b.category] || b.category} Budget`,
        subtitle: b.period ? `${b.period} budget target` : 'Budget target',
        amount: b.limit,
        category: b.category,
        original: b,
      }));

    const byBestMatch = (a: SearchResultItem, b: SearchResultItem) => {
      const rank = (value: string) => {
        const lower = value.toLowerCase();
        if (lower.startsWith(query)) return 0;
        if (lower.includes(query)) return 1;
        return 2;
      };
      return rank(a.title) - rank(b.title);
    };

    return [...expResults.sort(byBestMatch), ...budResults.sort(byBestMatch)].slice(0, 8);
  }, [searchQuery, getExpenses, getBudgets, user?.id, user?.role]);

  useEffect(() => {
    setActiveSearchIndex(null);
    setSearchInteractionMode(null);
  }, [searchQuery]);

  const handleSelectSearchItem = (item: SearchResultItem) => {
    setSelectedItem({ type: item.type, data: item.original });
    setEditForm({
      ...item.original,
      amount: item.type === 'expense' ? item.original.amount : item.original.limit,
    });
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {hasAnyOverlayOpen && (
        <button
          type="button"
          aria-label="Close open menus"
          className="fixed inset-0 z-20 cursor-default bg-transparent"
          onClick={closeAllOverlays}
        />
      )}
      <header 
      className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md transition-all duration-200 lg:px-6 ${
        isScrolled 
          ? 'border-transparent shadow-sm dark:border-transparent dark:bg-surface-900/90' 
          : 'border-surface-200 dark:border-surface-700 dark:bg-surface-900/80'
      }`}
    >
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

      {/* Global Search Center */}
      <div className="hidden flex-1 items-center justify-center px-6 md:flex lg:px-12 pointer-events-auto">
        <div className="group relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
            <Search size={16} className="text-surface-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={(e) => {
              if (!isSearchOpen || searchResults.length === 0) {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                }
                return;
              }

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSearchInteractionMode('keyboard');
                setActiveSearchIndex((prev) => (prev === null ? 0 : (prev + 1) % searchResults.length));
                return;
              }

              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSearchInteractionMode('keyboard');
                setActiveSearchIndex((prev) => (prev === null ? searchResults.length - 1 : (prev - 1 + searchResults.length) % searchResults.length));
                return;
              }

              if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSearchIndex !== null) {
                  handleSelectSearchItem(searchResults[activeSearchIndex]);
                }
                return;
              }

              if (e.key === 'Escape') {
                e.preventDefault();
                setIsSearchOpen(false);
              }
            }}
            placeholder="Search transactions, budgets..."
            className="h-10 w-full rounded-full border border-surface-200 bg-surface-50/50 py-2 pl-10 pr-4 text-sm text-surface-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:border-surface-700 dark:bg-surface-800/50 dark:text-white dark:focus:border-primary-500 dark:focus:bg-surface-900"
          />

          {/* Search Autocomplete Dropdown */}
          {isSearchDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-xl shadow-surface-900/10 dark:border-surface-700 dark:bg-surface-800 dark:shadow-surface-950/40 animate-in fade-in slide-in-from-top-2">
                {searchResults.length > 0 ? (
                  <>
                    <div
                      className="max-h-69.5 overflow-y-auto pt-1.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onMouseLeave={() => {
                        setActiveSearchIndex(null);
                        setSearchInteractionMode(null);
                      }}
                    >
                    {searchResults.map((t, idx) => {
                        const ItemIcon = categoryIcons[t.category] || MoreHorizontal;
                        const categoryColor = categoryColors[t.category] || '#64748b';
                        const showTypeHeader = idx === 0 || searchResults[idx - 1].type !== t.type;
                        return (
                          <div key={`${t.type}-${t.id}`}>
                            {showTypeHeader && (
                              <div className="px-4 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-surface-400 dark:text-surface-500">
                                {t.type === 'expense' ? 'Transactions' : 'Budgets'}
                              </div>
                            )}
                            <button
                              onClick={() => handleSelectSearchItem(t)}
                              onMouseEnter={() => {
                                setSearchInteractionMode('mouse');
                                setActiveSearchIndex(idx);
                              }}
                              className={`mx-2 my-0.5 flex w-[calc(100%-1rem)] items-center justify-between gap-3 rounded-xl border p-2.5 transition-colors text-left ${
                                idx === activeSearchIndex
                                  ? 'border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-700/50'
                                  : searchInteractionMode === 'keyboard'
                                  ? 'border-transparent'
                                  : 'border-transparent hover:border-surface-200 hover:bg-surface-50 dark:hover:border-surface-600 dark:hover:bg-surface-700/40'
                              }`}
                            >
                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                <div
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                  style={{ backgroundColor: `${categoryColor}15` }}
                                >
                                  <ItemIcon size={16} style={{ color: categoryColor }} />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-sm font-medium text-surface-900 dark:text-white truncate">{t.title} <span className="text-[10px] ml-1 bg-surface-100 dark:bg-surface-700 px-1 rounded uppercase tracking-wider text-surface-500">{t.type}</span></span>
                                  <span className="text-xs text-surface-500 dark:text-surface-400 truncate">{t.subtitle}</span>
                                </div>
                              </div>
                              <span className="ml-3 shrink-0 whitespace-nowrap text-sm font-semibold text-surface-900 dark:text-white">
                                ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700">
                      <Search size={16} className="text-surface-400" />
                    </div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300">No results for "{searchQuery}"</p>
                    <p className="mt-1 text-xs text-surface-400">Try a store name or category like food, transport, or shopping.</p>
                  </div>
                )}
              </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <ThemeToggle className="mx-1" />

        {/* Notifications */}
        <div className="relative">
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
        <div className="relative">
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
              <div className="p-3">
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-surface-400">
                  Switch Role
                </p>
                <div className="relative flex w-full rounded-lg bg-surface-100 p-1 dark:bg-surface-900">
                  {/* Sliding Background */}
                  <div
                    className="absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-md bg-white shadow-sm transition-transform duration-200 ease-out dark:bg-surface-700"
                    style={{
                      transform: user?.role === 'admin' ? 'translateX(100%)' : 'translateX(0)',
                    }}
                  />
                  <button
                    onClick={() => handleRoleSwitch('user')}
                    className={`relative z-10 flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                      user?.role === 'user' ? 'text-surface-900 dark:text-white' : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300'
                    }`}
                  >
                    User
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`relative z-10 flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                      user?.role === 'admin' ? 'text-surface-900 dark:text-white' : 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Quick Edit Modal */}
      <Modal 
        open={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title={selectedItem?.type === 'expense' ? 'Edit Transaction' : 'Edit Budget'}
      >
        {selectedItem && (
          <div className="space-y-4">
            {selectedItem?.type === 'expense' && (
              <>
                <div>
                  <label className="label">Store Name</label>
                  <DebouncedInput 
                    type="text" 
                    className="input" 
                    value={editForm.storeName || ''} 
                    onChange={(val) => setEditForm({...editForm, storeName: val})} 
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Amount ($)</label>
                    <DebouncedInput 
                      type="number" 
                      step="0.01" 
                      className="input" 
                      value={editForm.amount?.toString() || ''} 
                      onChange={(val) => setEditForm({...editForm, amount: val})} 
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-surface-700 dark:text-surface-300">Date</label>
                      {editForm.date === new Date().toISOString().split('T')[0] && (
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">Today</span>
                      )}
                    </div>
                    <DatePicker 
                      value={editForm.date || ''} 
                      onChange={(val) => setEditForm({...editForm, date: val})} 
                    />
                  </div>
                </div> 
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Category</label>
                    <Dropdown 
                      value={editForm.category || ''} 
                      onChange={(val) => setEditForm({...editForm, category: val})}
                      options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))}
                      icon={<Tag size={16} />}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="label">Payment Method</label>
                    <Dropdown 
                      value={editForm.paymentMethod || 'card'} 
                      onChange={(val) => setEditForm({...editForm, paymentMethod: val})}
                      options={[
                        { value: 'card', label: 'Card' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'bank_transfer', label: 'Bank Transfer' },
                        { value: 'qr_scan', label: 'Receipt Scan' },
                      ]}
                      icon={<CreditCard size={16} />}
                      fullWidth
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Notes <span className="text-surface-400 font-normal">(optional)</span></label>
                  <DebouncedTextarea 
                    rows={2}
                    maxLength={300}
                    value={editForm.notes || ''} 
                    onChange={(val) => setEditForm({...editForm, notes: val})} 
                    className="input resize-none"
                    placeholder="Add details..."
                  />
                </div>
              </>
            )}
            
            {selectedItem?.type === 'budget' && (
              <>
                <div>
                  <label className="label">Category</label>
                  <Dropdown 
                    value={editForm.category || ''} 
                    onChange={(val) => setEditForm({...editForm, category: val})}
                    options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))}
                    icon={<Tag size={16} />}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="label">Budget Period</label>
                  <Dropdown 
                    value={editForm.period || ''} 
                    onChange={(val) => setEditForm({...editForm, period: val})}
                    options={[
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'quarterly', label: 'Quarterly' },
                      { value: 'yearly', label: 'Yearly' },
                    ]}
                    icon={<Calendar size={16} />}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="label">Spending Limit ($)</label>
                  <DebouncedInput 
                    type="number" 
                    step="0.01" 
                    className="input" 
                    value={editForm.amount?.toString() || ''} 
                    onChange={(val) => setEditForm({...editForm, amount: val})} 
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    className="btn-primary flex-1" 
                    disabled={isSaving}
                    onClick={async () => {
                      if (!selectedItem) return;
                      setIsSaving(true);
                      await updateBudget(selectedItem.data.id, {
                        limit: parseFloat(editForm.amount),
                        category: editForm.category,
                        period: editForm.period,
                      });
                      setIsSaving(false);
                      setSelectedItem(null);
                    }}
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedItem(null)}>Cancel</button>
                </div>
              </>
            )}

            {selectedItem?.type === 'expense' && (
              <div className="flex justify-end gap-3 mt-4">
                <button className="btn-secondary" onClick={() => setSelectedItem(null)}>Cancel</button>
                <button 
                  className="btn-primary min-w-[100px]" 
                  disabled={isSaving}
                  onClick={async () => {
                    if (!selectedItem) return;
                    setIsSaving(true);
                    await updateExpense(selectedItem.data.id, {
                      storeName: editForm.storeName,
                      amount: parseFloat(editForm.amount),
                      category: editForm.category,
                      date: editForm.date,
                      paymentMethod: editForm.paymentMethod,
                      notes: editForm.notes,
                    });
                    setIsSaving(false);
                    setSelectedItem(null);
                  }}
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
