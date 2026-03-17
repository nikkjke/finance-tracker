import { useState, useCallback, useRef } from 'react';
import {
  ScanLine,
  Upload,
  Camera,
  Check,
  X,
  Loader2,
  Tag,
  CreditCard,
  AlertCircle,
  FileImage,
} from 'lucide-react';
import type { Expense, ExpenseCategory } from '../../types';
import { categoryLabels } from '../../data/mockData';
import Dropdown from '../../components/ui/Dropdown';
import DatePicker from '../../components/ui/DatePicker';
import { DebouncedInput, DebouncedTextarea } from '../../components/ui/DebouncedInput';
import { useAuth } from '../../contexts/AuthContext';
import { useExpenses } from '../../contexts/ExpenseContext';

interface FormData {
  storeName: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
  notes: string;
  paymentMethod: Expense['paymentMethod'];
}

interface FormErrors {
  storeName?: string;
  amount?: string;
  category?: string;
  date?: string;
  paymentMethod?: string;
  notes?: string;
}

type ScanState = 'idle' | 'scanning' | 'success' | 'error';
type ElectronicReceiptState = 'idle' | 'processing' | 'success' | 'error';

const initialFormData: FormData = {
  storeName: '',
  amount: '',
  category: 'food',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  paymentMethod: 'card',
};

export default function AddExpensePage() {
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const [activeTab, setActiveTab] = useState<'manual' | 'scan' | 'electronic'>('manual');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // QR Scan states
  const [scanState, setScanState] = useState<ScanState>('idle');

  // Electronic receipt photo states (frontend-only for now)
  const [electronicReceiptState, setElectronicReceiptState] = useState<ElectronicReceiptState>('idle');
  const [electronicReceiptFile, setElectronicReceiptFile] = useState<File | null>(null);
  const electronicReceiptInputRef = useRef<HTMLInputElement | null>(null);

  const categories = Object.entries(categoryLabels) as [ExpenseCategory, string][];
  const validPaymentMethods: Expense['paymentMethod'][] = ['card', 'cash', 'bank_transfer', 'qr_scan'];

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const trimmedStoreName = formData.storeName.trim();
    const parsedAmount = parseFloat(formData.amount);
    const parsedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (!trimmedStoreName) {
      newErrors.storeName = 'Store name is required';
    } else if (trimmedStoreName.length < 2) {
      newErrors.storeName = 'Store name must be at least 2 characters';
    } else if (trimmedStoreName.length > 100) {
      newErrors.storeName = 'Store name must be at most 100 characters';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (!Number.isFinite(parsedAmount)) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (Number.isNaN(parsedDate.getTime())) {
      newErrors.date = 'Date is invalid';
    } else if (parsedDate > today) {
      newErrors.date = 'Date cannot be in the future';
    }

    if (!validPaymentMethods.includes(formData.paymentMethod)) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (formData.notes.trim().length > 300) {
      newErrors.notes = 'Notes must be at most 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.storeName, formData.amount, formData.category, formData.date, formData.paymentMethod, formData.notes, validPaymentMethods]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServiceError(null);
  }, []);

  const isBasicInvalid =
    !formData.storeName.trim() ||
    !formData.amount.trim() ||
    !formData.date ||
    Number.isNaN(parseFloat(formData.amount)) ||
    parseFloat(formData.amount) <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServiceError(null);

    const result = await addExpense(user?.id ?? 'guest', {
      storeName: formData.storeName.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes || undefined,
      paymentMethod: formData.paymentMethod,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setServiceError(result.error ?? 'Failed to save expense. Please try again.');
      return;
    }

    setSubmitted(true);

    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ ...initialFormData, date: new Date().toISOString().split('T')[0] });
    }, 3000);
  };

  const handleScan = useCallback(async () => {
    setScanState('scanning');
    // Simulate QR scan
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setScanState('success');

    // Auto-fill form after scan
    setFormData({
      storeName: 'Kaufland',
      amount: '187.45',
      category: 'food',
      date: '2026-02-15',
      notes: 'Auto-scanned receipt - Weekly groceries',
      paymentMethod: 'card',
    });
    setErrors({});
    setServiceError(null);
    setActiveTab('manual');
  }, []);

  const resetScan = useCallback(() => {
    setScanState('idle');
  }, []);

  const handleElectronicReceiptSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setElectronicReceiptState('error');
      setElectronicReceiptFile(null);
      return;
    }

    setElectronicReceiptFile(selectedFile);
    setElectronicReceiptState('idle');
  }, []);

  const processElectronicReceipt = useCallback(async () => {
    if (!electronicReceiptFile) return;

    setElectronicReceiptState('processing');
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Frontend placeholder for future OCR/data extraction integration.
    setElectronicReceiptState('success');
  }, [electronicReceiptFile]);

  const resetElectronicReceipt = useCallback(() => {
    setElectronicReceiptState('idle');
    setElectronicReceiptFile(null);
    if (electronicReceiptInputRef.current) {
      electronicReceiptInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Add Expense</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Add a new expense manually, scan a receipt, or upload a receipt photo.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex rounded-lg border border-surface-200 bg-surface-50 p-1 dark:border-surface-700 dark:bg-surface-800">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'manual'
              ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          }`}
        >
          <Check size={16} />
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('electronic')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'electronic'
              ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          }`}
        >
          <FileImage size={16} />
          Receipt Photo
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'scan'
              ? 'bg-white text-surface-900 shadow-sm dark:bg-surface-700 dark:text-white'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          }`}
        >
          <ScanLine size={16} />
          Scan Receipt
        </button>
      </div>

      {/* Electronic Receipt Section */}
      {activeTab === 'electronic' && (
        <div className="card">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
              Upload Receipt Photo
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
              Upload a screenshot or photo of your receipt.
            </p>

            <div className="mx-auto max-w-sm">
              <input
                ref={electronicReceiptInputRef}
                type="file"
                accept="image/*"
                onChange={handleElectronicReceiptSelect}
                className="hidden"
                id="electronic-receipt-input"
              />

              <div className="relative aspect-square rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-900 flex items-center justify-center overflow-hidden">
                {!electronicReceiptFile && electronicReceiptState !== 'error' && (
                  <div className="text-center p-6 space-y-3">
                    <FileImage size={44} className="mx-auto text-surface-400" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Choose a receipt image to continue
                    </p>
                  </div>
                )}

                {electronicReceiptState === 'error' && (
                  <div className="text-center p-6 space-y-2">
                    <X size={40} className="mx-auto text-danger-500" />
                    <p className="text-sm font-medium text-danger-600 dark:text-danger-400">
                      Invalid file type
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      Please upload an image file (JPG, PNG, WEBP).
                    </p>
                  </div>
                )}

                {electronicReceiptFile && electronicReceiptState !== 'processing' && (
                  <div className="text-center p-6 space-y-2">
                    <FileImage size={40} className="mx-auto text-primary-500" />
                    <p className="text-sm font-medium text-surface-900 dark:text-white break-all">
                      {electronicReceiptFile.name}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {(electronicReceiptFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {electronicReceiptState === 'processing' && (
                  <div className="text-center p-6">
                    <Loader2 size={48} className="mx-auto text-primary-500 animate-spin mb-4" />
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Processing receipt...
                    </p>
                  </div>
                )}

                {electronicReceiptState === 'success' && (
                  <div className="text-center p-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
                      <Check size={32} className="text-success-500" />
                    </div>
                    <p className="text-sm font-medium text-success-600 dark:text-success-500">
                      Receipt processed successfully!
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      Ready for automatic transaction input
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                {electronicReceiptState !== 'processing' && (
                  <button
                    type="button"
                    onClick={() => electronicReceiptInputRef.current?.click()}
                    className="btn-secondary flex-1"
                  >
                    <Upload size={16} />
                    {electronicReceiptFile ? 'Choose Another Image' : 'Upload Image'}
                  </button>
                )}

                {electronicReceiptState === 'idle' || electronicReceiptState === 'error' ? (
                  <button
                    type="button"
                    onClick={processElectronicReceipt}
                    disabled={!electronicReceiptFile}
                    className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Process Receipt
                  </button>
                ) : null}

                {electronicReceiptState === 'processing' && (
                  <button
                    type="button"
                    onClick={resetElectronicReceipt}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                )}

                {electronicReceiptState === 'success' && (
                  <>
                    <button
                      type="button"
                      onClick={resetElectronicReceipt}
                      className="btn-secondary flex-1"
                    >
                      Upload Another
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('manual')}
                      className="btn-primary flex-1"
                    >
                      Review & Submit
                    </button>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scan Section */}
      {activeTab === 'scan' && (
        <div className="card">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
              Scan Receipt
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
              Point your camera at your receipt or upload an image.
            </p>

            {/* Camera Area */}
            <div className="mx-auto max-w-sm">
              <div className="relative aspect-square rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-900 flex items-center justify-center overflow-hidden">
                {scanState === 'idle' && (
                  <div className="text-center p-6">
                    <Camera size={48} className="mx-auto text-surface-300 dark:text-surface-600 mb-4" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Camera preview will appear here
                    </p>
                  </div>
                )}

                {scanState === 'scanning' && (
                  <div className="text-center p-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-lg border-2 border-primary-500 animate-pulse" />
                      <Loader2 size={48} className="mx-auto text-primary-500 animate-spin mb-4" />
                    </div>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Scanning receipt...
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      Extracting purchase data
                    </p>
                  </div>
                )}

                {scanState === 'success' && (
                  <div className="text-center p-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
                      <Check size={32} className="text-success-500" />
                    </div>
                    <p className="text-sm font-medium text-success-600 dark:text-success-500">
                      Receipt scanned successfully!
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      Data has been auto-filled in the form
                    </p>
                  </div>
                )}

                {scanState === 'error' && (
                  <div className="text-center p-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/10">
                      <X size={32} className="text-danger-500" />
                    </div>
                    <p className="text-sm font-medium text-danger-600 dark:text-danger-500">
                      Could not read receipt
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      Please try again or enter manually
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                {scanState === 'idle' && (
                  <>
                    <button className="btn-secondary flex-1">
                      <Upload size={16} />
                      Upload Image
                    </button>
                    <button onClick={handleScan} className="btn-primary flex-1">
                      <Camera size={16} />
                      Start Scanning
                    </button>
                  </>
                )}
                {scanState === 'scanning' && (
                  <button
                    onClick={resetScan}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                )}
                {(scanState === 'success' || scanState === 'error') && (
                  <>
                    <button onClick={resetScan} className="btn-secondary flex-1">
                      Scan Again
                    </button>
                    {scanState === 'success' && (
                      <button
                        onClick={() => setActiveTab('manual')}
                        className="btn-primary flex-1"
                      >
                        Review & Submit
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Form */}
      {activeTab === 'manual' && (
        <div className="card">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
                <Check size={32} className="text-success-500" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                Expense Added!
              </h3>
              <p className="text-sm text-surface-500 mt-1">
                Your expense has been recorded successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Error Banner */}
              {serviceError && (
                <div className="flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-400">
                  <AlertCircle size={16} className="shrink-0" />
                  {serviceError}
                </div>
              )}

              {/* Store Name */}
              <div>
                <label htmlFor="storeName" className="label">
                  Store / Vendor Name
                </label>
                <DebouncedInput
                  id="storeName"
                  type="text"
                  maxLength={100}
                  value={formData.storeName}
                  onChange={(val) => handleChange('storeName', val)}
                  placeholder="e.g. Kaufland, Amazon, Bolt"
                  className={`input ${errors.storeName ? 'border-danger-500' : ''}`}
                />
                {errors.storeName && (
                  <p className="mt-1.5 text-xs text-danger-500">{errors.storeName}</p>
                )}
              </div>

              {/* Amount + Category */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="amount" className="label">
                    Total Amount ($)
                  </label>
                  <DebouncedInput
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(val) => handleChange('amount', val)}
                    placeholder="0.00"
                    className={`input ${errors.amount ? 'border-danger-500' : ''}`}
                  />
                  {errors.amount && (
                    <p className="mt-1.5 text-xs text-danger-500">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="label">
                    Category
                  </label>
                  <Dropdown
                    value={formData.category}
                    onChange={(val) => handleChange('category', val)}
                    options={categories.map(([value, label]) => ({ value, label }))}
                    icon={<Tag size={16} />}
                    fullWidth
                  />
                  {errors.category && (
                    <p className="mt-1.5 text-xs text-danger-500">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <DatePicker
                  value={formData.date}
                  onChange={(val) => handleChange('date', val)}
                  label="Date"
                  error={!!errors.date}
                />
                {errors.date && (
                  <p className="mt-1.5 text-xs text-danger-500">{errors.date}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="label">Payment Method</label>
                <Dropdown
                  value={formData.paymentMethod}
                  onChange={(val) => handleChange('paymentMethod', val)}
                  options={[
                    { value: 'card', label: 'Card' },
                    { value: 'cash', label: 'Cash' },
                    { value: 'bank_transfer', label: 'Bank Transfer' },
                    { value: 'qr_scan', label: 'Receipt Scan' },
                  ]}
                  icon={<CreditCard size={16} />}
                  fullWidth
                />
                {errors.paymentMethod && (
                  <p className="mt-1.5 text-xs text-danger-500">{errors.paymentMethod}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="notes" className="label">
                    Notes <span className="text-surface-400 font-normal">(optional)</span>
                  </label>
                  <span className={`text-xs ${formData.notes.length > 270 ? 'text-warning-500' : 'text-surface-400'}`}>
                    {formData.notes.length}/300
                  </span>
                </div>
                <DebouncedTextarea
                  id="notes"
                  rows={3}
                  maxLength={300}
                  value={formData.notes}
                  onChange={(val) => handleChange('notes', val)}
                  placeholder="Add any additional details..."
                  className={`input resize-none ${errors.notes ? 'border-danger-500' : ''}`}
                />
                {errors.notes && (
                  <p className="mt-1.5 text-xs text-danger-500">{errors.notes}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isBasicInvalid}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Expense'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...initialFormData, date: new Date().toISOString().split('T')[0] });
                    setErrors({});
                    setServiceError(null);
                  }}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
