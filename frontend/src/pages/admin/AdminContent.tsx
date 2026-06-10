import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, DollarSign, FileText } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useContent } from '../../contexts/ContentContext';
import { adminService } from '../../services';
import type { ContentCategory, Currency, TransactionStatus } from '../../services/adminService';
import { extractServiceError } from '../../services/apiMappers';

export default function AdminContent() {
  const { pushNotification } = useNotification();
  const { t } = useLanguage();
  const { reload: reloadUserContent } = useContent();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expense Categories
  const [expenseCategories, setExpenseCategories] = useState<ContentCategory[]>([]);

  // Income Categories
  const [incomeCategories, setIncomeCategories] = useState<ContentCategory[]>([]);

  // Currencies
  const [currencies, setCurrencies] = useState<Currency[]>([
    { id: '1', code: 'USD', symbol: '$', name: 'US Dollar' },
    { id: '2', code: 'EUR', symbol: '€', name: 'Euro' },
    { id: '3', code: 'GBP', symbol: '£', name: 'British Pound' },
    { id: '4', code: 'MDL', symbol: 'lei', name: 'Moldovan Leu' },
  ]);

  // Transaction Statuses
  const [transactionStatuses, setTransactionStatuses] = useState<TransactionStatus[]>([]);

  const reloadContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getAdminContent();
      setExpenseCategories(data.expenseCategories ?? []);
      setIncomeCategories(data.incomeCategories ?? []);
      setCurrencies(data.currencies ?? []);
      setTransactionStatuses(data.transactionStatuses ?? []);
    } catch (err) {
      setError(extractServiceError(err, 'Failed to load content settings.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await adminService.getAdminContent();
        if (!isActive) return;

        setExpenseCategories(data.expenseCategories ?? []);
        setIncomeCategories(data.incomeCategories ?? []);
        setCurrencies(data.currencies ?? []);
        setTransactionStatuses(data.transactionStatuses ?? []);
      } catch (err) {
        if (!isActive) return;
        setError(extractServiceError(err, 'Failed to load content settings.'));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadContent();
    return () => {
      isActive = false;
    };
  }, []);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<ContentCategory | null>(null);
  const [editingIncome, setEditingIncome] = useState<ContentCategory | null>(null);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [editingStatus, setEditingStatus] = useState<TransactionStatus | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({ key: '', label: '' });
  const [incomeForm, setIncomeForm] = useState({ key: '', label: '' });
  const [currencyForm, setCurrencyForm] = useState({ code: '', symbol: '', name: '' });
  const [statusForm, setStatusForm] = useState({ value: '', label: '', color: '#10b981' });

  // Expense Category handlers
  const handleAddExpenseCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ key: '', label: '' });
    setShowCategoryModal(true);
  };

  const handleEditExpenseCategory = (category: ContentCategory) => {
    setEditingCategory(category);
    setCategoryForm({ key: category.key, label: category.label });
    setShowCategoryModal(true);
  };

  const handleSaveExpenseCategory = async () => {
    if (!categoryForm.key || !categoryForm.label) return;

    try {
      if (editingCategory) {
        const previousLabel = editingCategory.label;
        const updated = await adminService.updateExpenseCategory(editingCategory.id, {
          key: categoryForm.key,
          label: categoryForm.label,
        });

        setExpenseCategories(prev =>
          prev.map(cat => cat.id === editingCategory.id ? updated : cat)
        );

        pushNotification({
          title: t('contentUpdated'),
          message: `${t('expenseCategory')} "${previousLabel}" ${t('wasUpdated')}.`,
          type: 'system',
          priority: 'medium',
        });
      } else {
        const created = await adminService.createExpenseCategory({
          key: categoryForm.key,
          label: categoryForm.label,
        });

        setExpenseCategories(prev => [...prev, created]);
        pushNotification({
          title: t('categoryAdded'),
          message: `${t('expenseCategory')} "${created.label}" ${t('wasAdded')}.`,
          type: 'system',
          priority: 'low',
        });
      }

      await reloadUserContent();

      setShowCategoryModal(false);
      setCategoryForm({ key: '', label: '' });
      setEditingCategory(null);
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToSaveExpenseCategory')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  const handleDeleteExpenseCategory = async (id: string) => {
    if (!confirm(t('confirmDeleteCategory'))) {
      return;
    }

    try {
      const categoryToDelete = expenseCategories.find((cat) => cat.id === id);
      await adminService.deleteExpenseCategory(id);
      setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
      await reloadUserContent();
      pushNotification({
        title: t('categoryDeleted'),
        message: `${t('expenseCategory')} "${categoryToDelete?.label ?? 'Unknown'}" ${t('wasDeleted')}.`,
        type: 'security',
        priority: 'high',
      });
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToDeleteExpenseCategory')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  // Income Category handlers
  const handleAddIncomeCategory = () => {
    setEditingIncome(null);
    setIncomeForm({ key: '', label: '' });
    setShowIncomeModal(true);
  };

  const handleEditIncomeCategory = (category: ContentCategory) => {
    setEditingIncome(category);
    setIncomeForm({ key: category.key, label: category.label });
    setShowIncomeModal(true);
  };

  const handleSaveIncomeCategory = async () => {
    if (!incomeForm.key || !incomeForm.label) return;

    try {
      if (editingIncome) {
        const previousLabel = editingIncome.label;
        const updated = await adminService.updateIncomeCategory(editingIncome.id, {
          key: incomeForm.key,
          label: incomeForm.label,
        });

        setIncomeCategories(prev =>
          prev.map(cat => cat.id === editingIncome.id ? updated : cat)
        );

        pushNotification({
          title: t('contentUpdated'),
          message: `${t('incomeCategory')} "${previousLabel}" ${t('wasUpdated')}.`,
          type: 'system',
          priority: 'medium',
        });
      } else {
        const created = await adminService.createIncomeCategory({
          key: incomeForm.key,
          label: incomeForm.label,
        });

        setIncomeCategories(prev => [...prev, created]);
        pushNotification({
          title: t('categoryAdded'),
          message: `${t('incomeCategory')} "${created.label}" ${t('wasAdded')}.`,
          type: 'system',
          priority: 'low',
        });
      }

      await reloadUserContent();

      setShowIncomeModal(false);
      setIncomeForm({ key: '', label: '' });
      setEditingIncome(null);
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToSaveIncomeCategory')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  const handleDeleteIncomeCategory = async (id: string) => {
    if (!confirm(t('confirmDeleteCategory'))) {
      return;
    }

    try {
      const categoryToDelete = incomeCategories.find((cat) => cat.id === id);
      await adminService.deleteIncomeCategory(id);
      setIncomeCategories(prev => prev.filter(cat => cat.id !== id));
      await reloadUserContent();
      pushNotification({
        title: t('categoryDeleted'),
        message: `${t('incomeCategory')} "${categoryToDelete?.label ?? 'Unknown'}" ${t('wasDeleted')}.`,
        type: 'security',
        priority: 'high',
      });
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToDeleteIncomeCategory')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  // Currency handlers
  const handleAddCurrency = () => {
    setEditingCurrency(null);
    setCurrencyForm({ code: '', symbol: '', name: '' });
    setShowCurrencyModal(true);
  };

  const handleEditCurrency = (currency: Currency) => {
    setEditingCurrency(currency);
    setCurrencyForm({ code: currency.code, symbol: currency.symbol, name: currency.name });
    setShowCurrencyModal(true);
  };

  const handleSaveCurrency = async () => {
    if (!currencyForm.code || !currencyForm.symbol || !currencyForm.name) return;

    try {
      if (editingCurrency) {
        const previousCode = editingCurrency.code;
        const updated = await adminService.updateCurrency(editingCurrency.id, {
          code: currencyForm.code,
          symbol: currencyForm.symbol,
          name: currencyForm.name,
        });

        setCurrencies(prev =>
          prev.map(curr => curr.id === editingCurrency.id ? updated : curr)
        );

        pushNotification({
          title: t('currencyUpdated'),
          message: `Currency "${previousCode}" ${t('wasUpdated')} to "${updated.code}".`,
          type: 'system',
          priority: 'medium',
        });
      } else {
        const created = await adminService.createCurrency({
          code: currencyForm.code,
          symbol: currencyForm.symbol,
          name: currencyForm.name,
        });

        setCurrencies(prev => [...prev, created]);
        pushNotification({
          title: t('currencyAdded'),
          message: `Currency "${created.code}" ${t('wasAdded')}.`,
          type: 'system',
          priority: 'low',
        });
      }

      await reloadUserContent();

      setShowCurrencyModal(false);
      setCurrencyForm({ code: '', symbol: '', name: '' });
      setEditingCurrency(null);
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToSaveCurrency')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  const handleDeleteCurrency = async (id: string) => {
    if (!confirm(t('confirmDeleteCurrency'))) {
      return;
    }

    try {
      const currencyToDelete = currencies.find((curr) => curr.id === id);
      await adminService.deleteCurrency(id);
      setCurrencies(prev => prev.filter(curr => curr.id !== id));
      await reloadUserContent();
      pushNotification({
        title: t('currencyDeleted'),
        message: `Currency "${currencyToDelete?.code ?? 'Unknown'}" ${t('wasDeleted')}.`,
        type: 'security',
        priority: 'high',
      });
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToDeleteCurrency')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  // Status handlers
  const handleAddStatus = () => {
    setEditingStatus(null);
    setStatusForm({ value: '', label: '', color: '#10b981' });
    setShowStatusModal(true);
  };

  const handleEditStatus = (status: TransactionStatus) => {
    setEditingStatus(status);
    setStatusForm({ value: status.value, label: status.label, color: status.color });
    setShowStatusModal(true);
  };

  const handleSaveStatus = async () => {
    if (!statusForm.value || !statusForm.label) return;

    try {
      if (editingStatus) {
        const previousLabel = editingStatus.label;
        const updated = await adminService.updateTransactionStatus(editingStatus.id, {
          value: statusForm.value,
          label: statusForm.label,
          color: statusForm.color,
        });

        setTransactionStatuses(prev =>
          prev.map(stat => stat.id === editingStatus.id ? updated : stat)
        );

        pushNotification({
          title: t('statusUpdated'),
          message: `Transaction status "${previousLabel}" ${t('wasUpdated')}.`,
          type: 'system',
          priority: 'medium',
        });
      } else {
        const created = await adminService.createTransactionStatus({
          value: statusForm.value,
          label: statusForm.label,
          color: statusForm.color,
        });

        setTransactionStatuses(prev => [...prev, created]);
        pushNotification({
          title: t('statusAdded'),
          message: `Transaction status "${created.label}" ${t('wasAdded')}.`,
          type: 'system',
          priority: 'low',
        });
      }

      await reloadUserContent();

      setShowStatusModal(false);
      setStatusForm({ value: '', label: '', color: '#10b981' });
      setEditingStatus(null);
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToSaveTransactionStatus')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  const handleDeleteStatus = async (id: string) => {
    if (!confirm(t('confirmDeleteStatus'))) {
      return;
    }

    try {
      const statusToDelete = transactionStatuses.find((stat) => stat.id === id);
      await adminService.deleteTransactionStatus(id);
      setTransactionStatuses(prev => prev.filter(stat => stat.id !== id));
      await reloadUserContent();
      pushNotification({
        title: t('statusDeleted'),
        message: `Transaction status "${statusToDelete?.label ?? 'Unknown'}" ${t('wasDeleted')}.`,
        type: 'security',
        priority: 'high',
      });
    } catch (err) {
      pushNotification({
        title: t('error'),
        message: extractServiceError(err, t('failedToDeleteTransactionStatus')),
        type: 'system',
        priority: 'high',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">{t('adminContentTitle')}</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {t('adminContentDesc')}
        </p>
      </div>

      {isLoading && (
        <div className="card flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={32} />
            <p className="text-sm text-surface-500 dark:text-surface-400">{t('loadingContent')}</p>
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="card">
          <ErrorState
            title={t('unableToLoadContent')}
            message={error}
            onRetry={reloadContent}
          />
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Expense Categories */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-primary-500" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  {t('expenseCategoriesTitle')}
                </h2>
              </div>
              <button onClick={handleAddExpenseCategory} className="btn-primary">
                <Plus size={16} />
                {t('addCategory')}
              </button>
            </div>
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-surface-200 bg-white px-4 py-3 dark:border-surface-700 dark:bg-surface-800/60"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{category.label}</p>
                    <p className="text-xs text-surface-400">{t('categoryKey')}: {category.key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditExpenseCategory(category)}
                      className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExpenseCategory(category.id)}
                      className="rounded-lg p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:text-danger-400 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-success-500" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  {t('incomeCategoriesTitle')}
                </h2>
              </div>
              <button onClick={handleAddIncomeCategory} className="btn-primary">
                <Plus size={16} />
                {t('addCategory')}
              </button>
            </div>
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-surface-200 bg-white px-4 py-3 dark:border-surface-700 dark:bg-surface-800/60"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{category.label}</p>
                    <p className="text-xs text-surface-400">{t('categoryKey')}: {category.key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditIncomeCategory(category)}
                      className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteIncomeCategory(category.id)}
                      className="rounded-lg p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:text-danger-400 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currencies */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-primary-500" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  {t('currenciesTitle')}
                </h2>
              </div>
              <button onClick={handleAddCurrency} className="btn-primary">
                <Plus size={16} />
                {t('addCurrency')}
              </button>
            </div>
            <div className="space-y-2">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="flex items-center justify-between rounded-lg border border-surface-200 bg-white px-4 py-3 dark:border-surface-700 dark:bg-surface-800/60"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      {currency.code} ({currency.symbol}) - {currency.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCurrency(currency)}
                      className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCurrency(currency.id)}
                      className="rounded-lg p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:text-danger-400 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Statuses */}
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary-500" />
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                  {t('transactionStatusesTitle')}
                </h2>
              </div>
              <button onClick={handleAddStatus} className="btn-primary">
                <Plus size={16} />
                {t('addStatus')}
              </button>
            </div>
            <div className="space-y-2">
              {transactionStatuses.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between rounded-lg border border-surface-200 bg-white px-4 py-3 dark:border-surface-700 dark:bg-surface-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{status.label}</p>
                      <p className="text-xs text-surface-400">{t('statusValue')}: {status.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditStatus(status)}
                      className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStatus(status.id)}
                      className="rounded-lg p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:text-danger-400 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Expense Category Modal */}
      <Modal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={editingCategory ? t('editExpenseCategory') : t('addExpenseCategoryTitle')}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('categoryKey')}</label>
            <input
              type="text"
              value={categoryForm.key}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., food"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('displayLabel')}</label>
            <input
              type="text"
              value={categoryForm.label}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Food & Groceries"
              className="input"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveExpenseCategory} className="btn-primary flex-1">
              <Save size={16} />
              {t('save')}
            </button>
            <button onClick={() => setShowCategoryModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              {t('cancel')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Income Category Modal */}
      <Modal
        open={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        title={editingIncome ? t('editIncomeCategory') : t('addIncomeCategoryTitle')}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('categoryKey')}</label>
            <input
              type="text"
              value={incomeForm.key}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., salary"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('displayLabel')}</label>
            <input
              type="text"
              value={incomeForm.label}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Salary"
              className="input"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveIncomeCategory} className="btn-primary flex-1">
              <Save size={16} />
              {t('save')}
            </button>
            <button onClick={() => setShowIncomeModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              {t('cancel')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Currency Modal */}
      <Modal
        open={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        title={editingCurrency ? t('editCurrency') : t('addCurrencyTitle')}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('currencyCode')}</label>
            <input
              type="text"
              value={currencyForm.code}
              onChange={(e) => setCurrencyForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="e.g., USD"
              maxLength={3}
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('symbolLabel')}</label>
            <input
              type="text"
              value={currencyForm.symbol}
              onChange={(e) => setCurrencyForm(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="e.g., $"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('currencyName')}</label>
            <input
              type="text"
              value={currencyForm.name}
              onChange={(e) => setCurrencyForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., US Dollar"
              className="input"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveCurrency} className="btn-primary flex-1">
              <Save size={16} />
              {t('save')}
            </button>
            <button onClick={() => setShowCurrencyModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              {t('cancel')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={editingStatus ? t('editStatus') : t('addStatusTitle')}
      >
        <div className="space-y-4">
          <div>
            <label className="label">{t('statusValue')}</label>
            <input
              type="text"
              value={statusForm.value}
              onChange={(e) => setStatusForm(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., completed"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('displayLabel')}</label>
            <input
              type="text"
              value={statusForm.label}
              onChange={(e) => setStatusForm(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Completed"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('colorLabel')}</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={statusForm.color}
                onChange={(e) => setStatusForm(prev => ({ ...prev, color: e.target.value }))}
                className="h-10 w-20 rounded-lg border border-surface-200 dark:border-surface-700"
              />
              <input
                type="text"
                value={statusForm.color}
                onChange={(e) => setStatusForm(prev => ({ ...prev, color: e.target.value }))}
                placeholder="#10b981"
                className="input flex-1"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSaveStatus} className="btn-primary flex-1">
              <Save size={16} />
              {t('save')}
            </button>
            <button onClick={() => setShowStatusModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              {t('cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
