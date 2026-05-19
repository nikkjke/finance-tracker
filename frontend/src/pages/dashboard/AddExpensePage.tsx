import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import {
  ScanLine,
  Camera,
  Check,
  X,
  Loader2,
  Tag,
  CreditCard,
  AlertCircle,
  QrCode,
  Zap,
  Store,
  DollarSign,
  Calendar,
  Notebook,
} from 'lucide-react';
import type { Expense, ExpenseCategory } from '../../types';
import Dropdown from '../../components/ui/Dropdown';
import DatePicker from '../../components/ui/DatePicker';
import { DebouncedInput, DebouncedTextarea } from '../../components/ui/DebouncedInput';
import { useAuth } from '../../contexts/AuthContext';
import { useExpenses } from '../../contexts/ExpenseContext';
import { useContent } from '../../contexts/ContentContext';
import { scanReceipt, type ReceiptScanResult } from '../../services/receiptScanService';

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

type ScanState = 'idle' | 'scanning' | 'processing' | 'confirm' | 'success' | 'error';

const initialFormData: FormData = {
  storeName: '',
  amount: '',
  category: 'food',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  paymentMethod: 'card',
};

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const { expenseCategoryOptions, getExpenseCategoryLabel } = useContent();
  const [activeTab, setActiveTab] = useState<'manual' | 'scan'>('scan');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // QR Scan states
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);

  // Camera refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const detectedQrRef = useRef<string | null>(null);

  const categories = expenseCategoryOptions;
  const validPaymentMethods: Expense['paymentMethod'][] = ['card', 'cash', 'bank_transfer', 'qr_scan'];

  useEffect(() => {
    if (categories.length === 0) return;
    const hasCurrent = categories.some((option) => option.value === formData.category);
    if (!hasCurrent) {
      setFormData((prev) => ({ ...prev, category: categories[0].value }));
    }
  }, [categories, formData.category]);

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

  // ── Camera helpers ────────────────────────────────────────────────────────

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    detectedQrRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setScanState('scanning');
    setScanError(null);
    setScanResult(null);
    detectedQrRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scheduleQrScan();
      }
    } catch {
      setScanState('error');
      setScanError('Camera access was denied. Please allow camera permission and try again.');
    }
  }, []);

  const scheduleQrScan = useCallback(() => {
    const loop = () => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data && !detectedQrRef.current) {
        detectedQrRef.current = code.data;
        stopCamera();
        handleQrDetected(code.data);
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
  }, [stopCamera]);

  const handleQrDetected = useCallback(async (qrUrl: string) => {
    setScanState('processing');
    const result = await scanReceipt(qrUrl);

    if (!result.success || !result.data) {
      setScanState('error');
      setScanError(result.error ?? 'Could not extract receipt data. Please try again.');
      return;
    }

    setScanResult(result.data);
    setScanState('confirm');
  }, []);

  const handleConfirmAndAdd = useCallback(async () => {
    if (!scanResult) return;
    
    setScanState('processing');
    const result = await addExpense(user?.id ?? 'guest', {
      storeName: scanResult.storeName ?? 'Unknown Store',
      amount: scanResult.amount ?? 0,
      category: (scanResult.category as ExpenseCategory) ?? 'other',
      date: scanResult.date ?? new Date().toISOString().split('T')[0],
      notes: scanResult.notes ?? undefined,
      paymentMethod: (scanResult.paymentMethod as Expense['paymentMethod']) ?? 'qr_scan',
    });

    if (!result.success) {
      setScanState('error');
      setScanError(result.error ?? 'Failed to add expense. Please try again.');
      return;
    }

    setScanResult(null);
    setScanState('success');
  }, [scanResult, addExpense, user?.id]);

  const resetScan = useCallback(() => {
    stopCamera();
    setScanState('idle');
    setScanError(null);
    setScanResult(null);
  }, [stopCamera]);

  const handleScanAgain = useCallback(() => {
    stopCamera();
    startCamera();
  }, [stopCamera, startCamera]);

  // Stop camera when leaving the scan tab
  useEffect(() => {
    if (activeTab !== 'scan') stopCamera();
  }, [activeTab, stopCamera]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Add Expense</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Add a new expense manually or scan a receipt.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex rounded-lg border border-surface-200 bg-surface-50 p-1 dark:border-surface-700 dark:bg-surface-800">
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
      </div>

      {/* QR Scan Section */}
      {activeTab === 'scan' && (
        <div className="card min-h-[500px] flex flex-col justify-center">
          {/* ── IDLE ────────────────────────────────────────────────────── */}
          {scanState === 'idle' && (
            <div className="text-center py-4 flex flex-col items-center justify-center w-full max-w-md mx-auto">
              <div className="relative mx-auto mb-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-[-1rem] rounded-full border border-primary-500/20" />
                <div className="absolute inset-[-2rem] rounded-full border border-primary-500/10" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary-500/10 shadow-inner border border-primary-500/20">
                  <QrCode size={56} className="text-primary-500" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-3">
                Scan Receipt QR Code
              </h2>
              <p className="text-base text-surface-500 dark:text-surface-400 mb-10 leading-relaxed max-w-sm mx-auto">
                Point your camera at the QR code printed on your receipt. We will automatically extract the store, amount, and date.
              </p>
              <button onClick={startCamera} className="btn-primary mx-auto px-8">
                <Camera size={16} />
                Open Camera
              </button>
            </div>
          )}

          {/* ── SCANNING (live feed) ─────────────────────────────────── */}
          {scanState === 'scanning' && (
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-1">Scanning…</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400">Hold the QR code steady inside the frame</p>
              </div>

              {/* Live video */}
              <div className="relative mx-auto w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden bg-black shadow-xl border-2 border-surface-200 dark:border-surface-700">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover block"
                />
                
                {/* Corner-bracket overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-52 h-52">
                    {/* TL */}
                    <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                    {/* TR */}
                    <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                    {/* BL */}
                    <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                    {/* BR */}
                    <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                    {/* scan line */}
                    <span className="absolute left-2 right-2 top-1/2 h-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Hidden canvas used for pixel capture */}
              <canvas ref={canvasRef} className="hidden" />

              <div className="mt-4 text-center">
                <button onClick={resetScan} className="btn-secondary px-6 py-2 text-sm">
                  <X size={14} className="mr-2" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── PROCESSING (Extracting Data) ───────────────────────────── */}
          {scanState === 'processing' && (
            <div className="flex flex-col items-center justify-center w-full py-8 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-8">
                <Zap size={36} className="text-primary-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Processing Receipt…</h2>
              <p className="text-base text-surface-500 dark:text-surface-400 max-w-xs">
                Extracting transaction details. <br />
                Please wait a moment.
              </p>
              <div className="mt-10">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
              </div>
            </div>
          )}

          {/* ── CONFIRM ──────────────────────────────────────────────── */}
          {scanState === 'confirm' && scanResult && (
            <div className="w-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-500/10">
                  <Check size={20} className="text-success-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-900 dark:text-white">Receipt Detected</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Review the extracted data before adding</p>
                </div>
              </div>

              <div className="grid gap-2 mb-6">
                {([
                  { 
                    label: 'Store / Vendor', 
                    value: scanResult.storeName, 
                    icon: <Store size={16} className="text-surface-400" /> 
                  },
                  { 
                    label: 'Amount', 
                    value: scanResult.amount != null ? `$${scanResult.amount.toFixed(2)}` : null, 
                    icon: <DollarSign size={16} className="text-surface-400" /> 
                  },
                  { 
                    label: 'Category', 
                    value: getExpenseCategoryLabel(scanResult.category as ExpenseCategory) || scanResult.category,
                    icon: <Tag size={16} className="text-surface-400" /> 
                  },
                  { 
                    label: 'Date', 
                    value: scanResult.date ? new Date(scanResult.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null, 
                    icon: <Calendar size={16} className="text-surface-400" /> 
                  },
                  { 
                    label: 'Payment', 
                    value: scanResult.paymentMethod ? scanResult.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : null, 
                    icon: <CreditCard size={16} className="text-surface-400" /> 
                  },
                  { 
                    label: 'Notes', 
                    value: scanResult.notes, 
                    icon: <Notebook size={16} className="text-surface-400" /> 
                  },
                ] as { label: string; value: string | null; icon: React.ReactNode }[]).map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-surface-50/50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      {icon}
                      <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">
                      {value ?? <span className="text-surface-400 font-normal italic">Not detected</span>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={handleScanAgain} className="btn-secondary flex-1 py-2">
                  Scan Again
                </button>
                <button onClick={handleConfirmAndAdd} className="btn-primary flex-1 py-2">
                  <Check size={18} className="mr-2" /> Confirm & Add
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ──────────────────────────────────────────────── */}
          {scanState === 'success' && (
            <div className="flex flex-col items-center justify-center w-full py-12 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-success-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success-500/10 border-2 border-success-500/20 shadow-lg shadow-success-500/10">
                  <Check size={48} className="text-success-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Expense Added!</h2>
              <p className="text-base text-surface-500 dark:text-surface-400 max-w-xs mb-10">
                Your receipt has been processed and the transaction was successfully recorded.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-sm">
                <button onClick={resetScan} className="btn-secondary flex-1 py-3">
                  Scan Another
                </button>
                <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1 py-3">
                  View Dashboard
                </button>
              </div>
            </div>
          )}

          {/* ── ERROR ────────────────────────────────────────────────── */}
          {scanState === 'error' && (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/10">
                <X size={32} className="text-danger-500" />
              </div>
              <h2 className="text-base font-semibold text-danger-600 dark:text-danger-400 mb-1">Scan Failed</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-xs mx-auto">
                {scanError ?? 'Could not extract receipt data.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={resetScan} className="btn-secondary">
                  Try Again
                </button>
                <button onClick={() => setActiveTab('manual')} className="btn-primary">
                  Enter Manually
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Form */}
      {activeTab === 'manual' && (
        <div className="card min-h-[500px]">
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
                    options={categories}
                    icon={<Tag size={16} />}
                    fullWidth
                  />
                  {errors.category && (
                    <p className="mt-1.5 text-xs text-danger-500">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Date + Payment Method */}
              <div className="grid gap-5 sm:grid-cols-2">
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
