import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import { contentService } from '../services/contentService';
import type { ContentCategory, Currency, TransactionStatus } from '../services/adminService';
import { categoryColors, categoryLabels, incomeColors, incomeLabels } from '../data/mockData';
import { extractServiceError } from '../services/apiMappers';
import { useAuth } from './AuthContext';

interface ContentContextValue {
  expenseCategories: ContentCategory[];
  incomeCategories: ContentCategory[];
  currencies: Currency[];
  transactionStatuses: TransactionStatus[];
  expenseCategoryOptions: Array<{ value: string; label: string }>;
  incomeCategoryOptions: Array<{ value: string; label: string }>;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  getExpenseCategoryLabel: (key: string) => string;
  getIncomeCategoryLabel: (key: string) => string;
  getExpenseCategoryColor: (key: string) => string;
  getIncomeCategoryColor: (key: string) => string;
  getTransactionStatus: (value: string) => TransactionStatus | undefined;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

function buildLabelMap(items: ContentCategory[]): Record<string, string> {
  return items.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.label;
    return acc;
  }, {});
}

function buildOptions(items: ContentCategory[]): Array<{ value: string; label: string }> {
  return [...items]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((item) => ({ value: item.key, label: item.label }));
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenseCategories, setExpenseCategories] = useState<ContentCategory[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<ContentCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [transactionStatuses, setTransactionStatuses] = useState<TransactionStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await contentService.getContent();
      setExpenseCategories(data.expenseCategories ?? []);
      setIncomeCategories(data.incomeCategories ?? []);
      setCurrencies(data.currencies ?? []);
      setTransactionStatuses(data.transactionStatuses ?? []);
    } catch (err) {
      setError(extractServiceError(err, 'Failed to load content settings.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const init = async () => {
      if (!isActive) return;

      if (!user) {
        setExpenseCategories([]);
        setIncomeCategories([]);
        setCurrencies([]);
        setTransactionStatuses([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      await loadContent();
    };

    void init();

    return () => {
      isActive = false;
    };
  }, [loadContent, user]);

  const fallbackExpenseLabels = useMemo(() => categoryLabels, []);
  const fallbackIncomeLabels = useMemo(() => incomeLabels, []);

  const expenseLabelMap = useMemo(() => {
    if (expenseCategories.length > 0) {
      return buildLabelMap(expenseCategories);
    }
    return fallbackExpenseLabels;
  }, [expenseCategories, fallbackExpenseLabels]);

  const incomeLabelMap = useMemo(() => {
    if (incomeCategories.length > 0) {
      return buildLabelMap(incomeCategories);
    }
    return fallbackIncomeLabels;
  }, [incomeCategories, fallbackIncomeLabels]);

  const expenseCategoryOptions = useMemo(() => {
    if (expenseCategories.length > 0) {
      return buildOptions(expenseCategories);
    }
    return Object.entries(fallbackExpenseLabels).map(([value, label]) => ({ value, label }));
  }, [expenseCategories, fallbackExpenseLabels]);

  const incomeCategoryOptions = useMemo(() => {
    if (incomeCategories.length > 0) {
      return buildOptions(incomeCategories);
    }
    return Object.entries(fallbackIncomeLabels).map(([value, label]) => ({ value, label }));
  }, [incomeCategories, fallbackIncomeLabels]);

  const transactionStatusMap = useMemo(() => {
    return transactionStatuses.reduce<Record<string, TransactionStatus>>((acc, status) => {
      acc[status.value] = status;
      return acc;
    }, {});
  }, [transactionStatuses]);

  const value = useMemo<ContentContextValue>(() => ({
    expenseCategories,
    incomeCategories,
    currencies,
    transactionStatuses,
    expenseCategoryOptions,
    incomeCategoryOptions,
    isLoading,
    error,
    reload: loadContent,
    getExpenseCategoryLabel: (key: string) => expenseLabelMap[key] ?? key,
    getIncomeCategoryLabel: (key: string) => incomeLabelMap[key] ?? key,
    getExpenseCategoryColor: (key: string) => categoryColors[key] ?? '#64748b',
    getIncomeCategoryColor: (key: string) => incomeColors[key] ?? '#64748b',
    getTransactionStatus: (value: string) => transactionStatusMap[value],
  }), [
    expenseCategories,
    incomeCategories,
    currencies,
    transactionStatuses,
    expenseCategoryOptions,
    incomeCategoryOptions,
    isLoading,
    error,
    loadContent,
    expenseLabelMap,
    incomeLabelMap,
    transactionStatusMap,
  ]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
