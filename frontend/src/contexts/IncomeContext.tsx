import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Income, CreateIncomeDTO, UpdateIncomeDTO, ServiceResponse } from '../types';
import { useAuth } from './AuthContext';
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
    return result;
  }, []);

  const updateIncome = useCallback(async (id: string, dto: UpdateIncomeDTO): Promise<ServiceResponse<Income>> => {
    const result = await editIncome(id, dto, user?.id);

    if (!result.success || !result.data) {
      return result;
    }

    setIncome((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...result.data } : entry)));
    return result;
  }, [user?.id]);

  const deleteIncome = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const result = await removeIncome(id, user?.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setIncome((prev) => prev.filter((entry) => entry.id !== id));
    return { success: true, data: null };
  }, [user?.id]);

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
