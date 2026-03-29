import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Income, CreateIncomeDTO, UpdateIncomeDTO, ServiceResponse } from '../types';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import {
  getIncome as fetchIncome,
  addIncome as createIncome,
  updateIncome as editIncome,
  deleteIncome as removeIncome,
} from '../services/incomeService';

interface IncomeContextType {
  income: Income[];
  getIncome: (userId?: string) => Income[];
  getIncomeById: (id: string) => Income | undefined;
  addIncome: (userId: string, dto: CreateIncomeDTO) => Promise<ServiceResponse<Income>>;
  updateIncome: (id: string, dto: UpdateIncomeDTO) => Promise<ServiceResponse<Income>>;
  deleteIncome: (id: string) => Promise<ServiceResponse<null>>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pushNotification } = useNotification();
  const [income, setIncome] = useState<Income[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadIncome = async () => {
      const result = await fetchIncome(user?.id);
      if (!isMounted || !result.success) {
        return;
      }

      setIncome(result.data ?? []);
    };

    void loadIncome();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const getIncome = useCallback((userId?: string) => {
    if (!userId) return income;
    return income.filter((inc) => inc.userId === userId);
  }, [income]);

  const getIncomeById = useCallback((id: string) => {
    return income.find((inc) => inc.id === id);
  }, [income]);

  const addIncome = useCallback(async (userId: string, dto: CreateIncomeDTO): Promise<ServiceResponse<Income>> => {
    const result = await createIncome(userId, dto);

    if (!result.success || !result.data) {
      return result;
    }

    setIncome((prev) => [result.data as Income, ...prev]);
    pushNotification({
      title: 'Transaction added',
      message: `Income from ${result.data.source} for $${result.data.amount.toFixed(2)} was added.`,
      type: 'income',
      priority: 'low',
    });
    return result;
  }, [pushNotification]);

  const updateIncome = useCallback(async (id: string, dto: UpdateIncomeDTO): Promise<ServiceResponse<Income>> => {
    const previousIncome = income.find((entry) => entry.id === id);
    const result = await editIncome(id, dto, user?.id);

    if (!result.success || !result.data) {
      return result;
    }

    setIncome((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...result.data } : entry)));
    const source = result.data.source ?? previousIncome?.source ?? 'income transaction';
    const amount = result.data.amount ?? previousIncome?.amount;
    const amountText = typeof amount === 'number' ? `$${amount.toFixed(2)}` : 'new amount';
    pushNotification({
      title: 'Transaction updated',
      message: `Income from ${source} was updated (${amountText}).`,
      type: 'income',
      priority: 'low',
    });
    return result;
  }, [income, user?.id, pushNotification]);

  const deleteIncome = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const deletedIncome = income.find((entry) => entry.id === id);
    const result = await removeIncome(id, user?.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setIncome((prev) => prev.filter((entry) => entry.id !== id));
    pushNotification({
      title: 'Transaction deleted',
      message: `Income from ${deletedIncome?.source ?? 'income transaction'} was deleted.`,
      type: 'income',
      priority: 'medium',
    });
    return { success: true, data: null };
  }, [income, user?.id, pushNotification]);

  const value = useMemo(
    () => ({
      income,
      getIncome,
      getIncomeById,
      addIncome,
      updateIncome,
      deleteIncome,
    }),
    [income, getIncome, getIncomeById, addIncome, updateIncome, deleteIncome],
  );

  return <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>;
}

export function useIncome() {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
}
