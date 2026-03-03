import { useState, useCallback } from 'react';
import { Check, AlertCircle, Loader2, Tag } from 'lucide-react';
import type { IncomeCategory } from '../../types';
import { incomeLabels } from '../../data/mockData';
import Dropdown from '../../components/ui/Dropdown';
import DatePicker from '../../components/ui/DatePicker';
import { useAuth } from '../../contexts/AuthContext';
import { addIncome } from '../../services/incomeService';

interface FormData {
  source: string;
  amount: string;
  category: IncomeCategory;
  date: string;
  notes: string;
}

interface FormErrors {
  source?: string;
  amount?: string;
  category?: string;
  date?: string;
}

const initialFormData: FormData = {
  source: '',
  amount: '',
  category: 'salary',
  date: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function AddIncomePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const categories = Object.entries(incomeLabels) as [IncomeCategory, string][];

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.source.trim()) newErrors.source = 'Income source is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.source, formData.amount, formData.date]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServiceError(null);

    const result = await addIncome(user?.id ?? 'guest', {
      source: formData.source.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setServiceError(result.error ?? 'Failed to save income. Please try again.');
      return;
    }

    setSubmitted(true);

    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ ...initialFormData, date: new Date().toISOString().split('T')[0] });
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Record Income</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Add a new income source to track your earnings and calculate net income.
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        {submitted ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
              <Check size={32} className="text-success-500" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Income Recorded!
            </h3>
            <p className="text-sm text-surface-500 mt-1">
              Your income has been added successfully.
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

            {/* Income Source */}
            <div>
              <label htmlFor="source" className="label">
                Income Source
              </label>
              <input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                placeholder="e.g. Acme Corp, Freelance Project, Investment"
                className={`input ${errors.source ? 'border-danger-500' : ''}`}
              />
              {errors.source && (
                <p className="mt-1.5 text-xs text-danger-500">{errors.source}</p>
              )}
            </div>

            {/* Amount + Category */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="label">
                  Amount ($)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
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

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="label">
                Notes <span className="text-surface-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add any additional details about this income..."
                className="input resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Record Income'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...initialFormData, date: new Date().toISOString().split('T')[0] });
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
    </div>
  );
}
