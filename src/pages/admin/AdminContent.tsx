import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, DollarSign, FileText } from 'lucide-react';
import Modal from '../../components/ui/Modal';

interface Category {
  id: string;
  label: string;
  key: string;
}

interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
}

interface StatusOption {
  id: string;
  value: string;
  label: string;
  color: string;
}

export default function AdminContent() {
  // Expense Categories
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([
    { id: '1', key: 'food', label: 'Food & Groceries' },
    { id: '2', key: 'transport', label: 'Transport' },
    { id: '3', key: 'entertainment', label: 'Entertainment' },
    { id: '4', key: 'shopping', label: 'Shopping' },
    { id: '5', key: 'bills', label: 'Bills & Utilities' },
    { id: '6', key: 'health', label: 'Health' },
    { id: '7', key: 'education', label: 'Education' },
    { id: '8', key: 'travel', label: 'Travel' },
    { id: '9', key: 'other', label: 'Other' },
  ]);

  // Income Categories
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([
    { id: '1', key: 'salary', label: 'Salary' },
    { id: '2', key: 'freelance', label: 'Freelance' },
    { id: '3', key: 'investment', label: 'Investment' },
    { id: '4', key: 'bonus', label: 'Bonus' },
    { id: '5', key: 'gift', label: 'Gift' },
    { id: '6', key: 'other_income', label: 'Other Income' },
  ]);

  // Currencies
  const [currencies, setCurrencies] = useState<Currency[]>([
    { id: '1', code: 'USD', symbol: '$', name: 'US Dollar' },
    { id: '2', code: 'EUR', symbol: '€', name: 'Euro' },
    { id: '3', code: 'GBP', symbol: '£', name: 'British Pound' },
    { id: '4', code: 'MDL', symbol: 'lei', name: 'Moldovan Leu' },
  ]);

  // Transaction Statuses
  const [transactionStatuses, setTransactionStatuses] = useState<StatusOption[]>([
    { id: '1', value: 'completed', label: 'Completed', color: '#10b981' },
    { id: '2', value: 'pending', label: 'Pending', color: '#f59e0b' },
    { id: '3', value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
  ]);

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingIncome, setEditingIncome] = useState<Category | null>(null);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [editingStatus, setEditingStatus] = useState<StatusOption | null>(null);

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

  const handleEditExpenseCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ key: category.key, label: category.label });
    setShowCategoryModal(true);
  };

  const handleSaveExpenseCategory = () => {
    if (!categoryForm.key || !categoryForm.label) return;

    if (editingCategory) {
      setExpenseCategories(prev =>
        prev.map(cat => cat.id === editingCategory.id
          ? { ...cat, key: categoryForm.key, label: categoryForm.label }
          : cat
        )
      );
    } else {
      setExpenseCategories(prev => [
        ...prev,
        { id: Date.now().toString(), key: categoryForm.key, label: categoryForm.label }
      ]);
    }

    setShowCategoryModal(false);
    setCategoryForm({ key: '', label: '' });
    setEditingCategory(null);
  };

  const handleDeleteExpenseCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  // Income Category handlers
  const handleAddIncomeCategory = () => {
    setEditingIncome(null);
    setIncomeForm({ key: '', label: '' });
    setShowIncomeModal(true);
  };

  const handleEditIncomeCategory = (category: Category) => {
    setEditingIncome(category);
    setIncomeForm({ key: category.key, label: category.label });
    setShowIncomeModal(true);
  };

  const handleSaveIncomeCategory = () => {
    if (!incomeForm.key || !incomeForm.label) return;

    if (editingIncome) {
      setIncomeCategories(prev =>
        prev.map(cat => cat.id === editingIncome.id
          ? { ...cat, key: incomeForm.key, label: incomeForm.label }
          : cat
        )
      );
    } else {
      setIncomeCategories(prev => [
        ...prev,
        { id: Date.now().toString(), key: incomeForm.key, label: incomeForm.label }
      ]);
    }

    setShowIncomeModal(false);
    setIncomeForm({ key: '', label: '' });
    setEditingIncome(null);
  };

  const handleDeleteIncomeCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setIncomeCategories(prev => prev.filter(cat => cat.id !== id));
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

  const handleSaveCurrency = () => {
    if (!currencyForm.code || !currencyForm.symbol || !currencyForm.name) return;

    if (editingCurrency) {
      setCurrencies(prev =>
        prev.map(curr => curr.id === editingCurrency.id
          ? { ...curr, ...currencyForm }
          : curr
        )
      );
    } else {
      setCurrencies(prev => [
        ...prev,
        { id: Date.now().toString(), ...currencyForm }
      ]);
    }

    setShowCurrencyModal(false);
    setCurrencyForm({ code: '', symbol: '', name: '' });
    setEditingCurrency(null);
  };

  const handleDeleteCurrency = (id: string) => {
    if (confirm('Are you sure you want to delete this currency? This action cannot be undone.')) {
      setCurrencies(prev => prev.filter(curr => curr.id !== id));
    }
  };

  // Status handlers
  const handleAddStatus = () => {
    setEditingStatus(null);
    setStatusForm({ value: '', label: '', color: '#10b981' });
    setShowStatusModal(true);
  };

  const handleEditStatus = (status: StatusOption) => {
    setEditingStatus(status);
    setStatusForm({ value: status.value, label: status.label, color: status.color });
    setShowStatusModal(true);
  };

  const handleSaveStatus = () => {
    if (!statusForm.value || !statusForm.label) return;

    if (editingStatus) {
      setTransactionStatuses(prev =>
        prev.map(stat => stat.id === editingStatus.id
          ? { ...stat, ...statusForm }
          : stat
        )
      );
    } else {
      setTransactionStatuses(prev => [
        ...prev,
        { id: Date.now().toString(), ...statusForm }
      ]);
    }

    setShowStatusModal(false);
    setStatusForm({ value: '', label: '', color: '#10b981' });
    setEditingStatus(null);
  };

  const handleDeleteStatus = (id: string) => {
    if (confirm('Are you sure you want to delete this status? This action cannot be undone.')) {
      setTransactionStatuses(prev => prev.filter(stat => stat.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Content Management</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Manage categories, currencies, and other app content.
        </p>
      </div>

      {/* Expense Categories */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-primary-500" />
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Expense Categories
            </h2>
          </div>
          <button onClick={handleAddExpenseCategory} className="btn-primary">
            <Plus size={16} />
            Add Category
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
                <p className="text-xs text-surface-400">Key: {category.key}</p>
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
              Income Categories
            </h2>
          </div>
          <button onClick={handleAddIncomeCategory} className="btn-primary">
            <Plus size={16} />
            Add Category
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
                <p className="text-xs text-surface-400">Key: {category.key}</p>
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
              Currencies
            </h2>
          </div>
          <button onClick={handleAddCurrency} className="btn-primary">
            <Plus size={16} />
            Add Currency
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
              Transaction Statuses
            </h2>
          </div>
          <button onClick={handleAddStatus} className="btn-primary">
            <Plus size={16} />
            Add Status
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
                  <p className="text-xs text-surface-400">Value: {status.value}</p>
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

      {/* Expense Category Modal */}
      <Modal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={`${editingCategory ? 'Edit' : 'Add'} Expense Category`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Category Key</label>
            <input
              type="text"
              value={categoryForm.key}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., food"
              className="input"
            />
          </div>
          <div>
            <label className="label">Display Label</label>
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
              Save
            </button>
            <button onClick={() => setShowCategoryModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Income Category Modal */}
      <Modal
        open={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        title={`${editingIncome ? 'Edit' : 'Add'} Income Category`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Category Key</label>
            <input
              type="text"
              value={incomeForm.key}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., salary"
              className="input"
            />
          </div>
          <div>
            <label className="label">Display Label</label>
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
              Save
            </button>
            <button onClick={() => setShowIncomeModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Currency Modal */}
      <Modal
        open={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        title={`${editingCurrency ? 'Edit' : 'Add'} Currency`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Currency Code</label>
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
            <label className="label">Symbol</label>
            <input
              type="text"
              value={currencyForm.symbol}
              onChange={(e) => setCurrencyForm(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="e.g., $"
              className="input"
            />
          </div>
          <div>
            <label className="label">Currency Name</label>
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
              Save
            </button>
            <button onClick={() => setShowCurrencyModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`${editingStatus ? 'Edit' : 'Add'} Status`}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Status Value</label>
            <input
              type="text"
              value={statusForm.value}
              onChange={(e) => setStatusForm(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., completed"
              className="input"
            />
          </div>
          <div>
            <label className="label">Display Label</label>
            <input
              type="text"
              value={statusForm.label}
              onChange={(e) => setStatusForm(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Completed"
              className="input"
            />
          </div>
          <div>
            <label className="label">Color</label>
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
              Save
            </button>
            <button onClick={() => setShowStatusModal(false)} className="btn-secondary flex-1">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
