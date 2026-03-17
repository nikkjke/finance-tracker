import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import { mockIncome } from '../data/mockData';
import { STORAGE_KEYS } from '../types';
import type { Income, CreateIncomeDTO, UpdateIncomeDTO, ServiceResponse } from '../types';

interface IncomeContextType {
  income: Income[];
  getIncome: (userId?: string) => Income[];
  getIncomeById: (id: string) => Income | undefined;
  addIncome: (userId: string, dto: CreateIncomeDTO) => Promise<ServiceResponse<Income>>;
  updateIncome: (id: string, dto: UpdateIncomeDTO) => Promise<ServiceResponse<Income>>;
  deleteIncome: (id: string) => Promise<ServiceResponse<null>>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

/** Load income from localStorage, falling back to mock data on first use. */
function loadInitialIncome(): Income[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INCOME);
    if (stored) return JSON.parse(stored) as Income[];
  } catch {
    // ignore
  }
  return [...mockIncome];
}

export function IncomeProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState<Income[]>(loadInitialIncome);

  // Persist income to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCOME, JSON.stringify(income));
    } catch {
      console.warn('Failed to persist income to localStorage');
    }
  }, [income]);

  const getIncome = useCallback((userId?: string) => {
    if (!userId) return income;
    return income.filter((inc) => inc.userId === userId);
  }, [income]);

  const getIncomeById = useCallback((id: string) => {
    return income.find((inc) => inc.id === id);
  }, [income]);

  const addIncome = useCallback(async (userId: string, dto: CreateIncomeDTO): Promise<ServiceResponse<Income>> => {
    const newIncome: Income = {
      id: `inc-${Date.now()}`,
      userId,
      source: dto.source.trim(),
      amount: dto.amount,
      category: dto.category,
      date: dto.date,
      notes: dto.notes,
      status: 'completed',
    };

    setIncome((prev) => [newIncome, ...prev]);
    return { success: true, data: newIncome };
  }, []);

  const updateIncome = useCallback(async (id: string, dto: UpdateIncomeDTO): Promise<ServiceResponse<Income>> => {
    let updatedIncome: Income | undefined;

    setIncome((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;

        updatedIncome = {
          ...inc,
          ...dto,
          source: dto.source?.trim() ?? inc.source,
        };

        return updatedIncome;
      }),
    );

    if (!updatedIncome) {
      return { success: false, error: `Income with ID "${id}" not found.` };
    }

    return { success: true, data: updatedIncome };
  }, []);

  const deleteIncome = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    let found = false;

    setIncome((prev) =>
      prev.filter((inc) => {
        const isMatch = inc.id === id;
        if (isMatch) found = true;
        return !isMatch;
      }),
    );

    if (!found) {
      return { success: false, error: `Income with ID "${id}" not found.` };
    }

    return { success: true, data: null };
  }, []);

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
