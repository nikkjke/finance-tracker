import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import { mockExpenses } from '../data/mockData';
import { STORAGE_KEYS } from '../types';
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, ServiceResponse } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  getExpenses: (userId?: string) => Expense[];
  getExpenseById: (id: string) => Expense | undefined;
  addExpense: (userId: string, dto: CreateExpenseDTO) => Promise<ServiceResponse<Expense>>;
  updateExpense: (id: string, dto: UpdateExpenseDTO) => Promise<ServiceResponse<Expense>>;
  deleteExpense: (id: string) => Promise<ServiceResponse<null>>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

/** Load expenses from localStorage, falling back to mock data on first use. */
function loadInitialExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (stored) return JSON.parse(stored) as Expense[];
  } catch {
    // ignore
  }
  return [...mockExpenses];
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(loadInitialExpenses);

  // Persist expenses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch {
      console.warn('Failed to persist expenses to localStorage');
    }
  }, [expenses]);

  const getExpenses = useCallback((userId?: string) => {
    if (!userId) return expenses;
    return expenses.filter((expense) => expense.userId === userId);
  }, [expenses]);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find((expense) => expense.id === id);
  }, [expenses]);

  const addExpense = useCallback(async (userId: string, dto: CreateExpenseDTO): Promise<ServiceResponse<Expense>> => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      userId,
      storeName: dto.storeName.trim(),
      amount: dto.amount,
      category: dto.category,
      date: dto.date,
      notes: dto.notes,
      paymentMethod: dto.paymentMethod,
      status: 'completed',
    };

    setExpenses((prev) => [newExpense, ...prev]);
    return { success: true, data: newExpense };
  }, []);

  const updateExpense = useCallback(async (id: string, dto: UpdateExpenseDTO): Promise<ServiceResponse<Expense>> => {
    let updatedExpense: Expense | undefined;

    setExpenses((prev) =>
      prev.map((expense) => {
        if (expense.id !== id) return expense;

        updatedExpense = {
          ...expense,
          ...dto,
          storeName: dto.storeName?.trim() ?? expense.storeName,
        };

        return updatedExpense;
      }),
    );

    if (!updatedExpense) {
      return { success: false, error: `Expense with ID "${id}" not found.` };
    }

    return { success: true, data: updatedExpense };
  }, []);

  const deleteExpense = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    let found = false;

    setExpenses((prev) =>
      prev.filter((expense) => {
        const isMatch = expense.id === id;
        if (isMatch) found = true;
        return !isMatch;
      }),
    );

    if (!found) {
      return { success: false, error: `Expense with ID "${id}" not found.` };
    }

    return { success: true, data: null };
  }, []);

  const value = useMemo(
    () => ({
      expenses,
      getExpenses,
      getExpenseById,
      addExpense,
      updateExpense,
      deleteExpense,
    }),
    [expenses, getExpenses, getExpenseById, addExpense, updateExpense, deleteExpense],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
