import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, ServiceResponse } from '../types';
import { useAuth } from './AuthContext';
import {
  getExpenses as fetchExpenses,
  addExpense as createExpense,
  updateExpense as editExpense,
  deleteExpense as removeExpense,
} from '../services/expenseService';

interface ExpenseContextType {
  expenses: Expense[];
  getExpenses: (userId?: string) => Expense[];
  getExpenseById: (id: string) => Expense | undefined;
  addExpense: (userId: string, dto: CreateExpenseDTO) => Promise<ServiceResponse<Expense>>;
  updateExpense: (id: string, dto: UpdateExpenseDTO) => Promise<ServiceResponse<Expense>>;
  deleteExpense: (id: string) => Promise<ServiceResponse<null>>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadExpenses = async () => {
      const result = await fetchExpenses(user?.id);
      if (!isMounted || !result.success) {
        return;
      }

      setExpenses(result.data ?? []);
    };

    void loadExpenses();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const getExpenses = useCallback((userId?: string) => {
    if (!userId) return expenses;
    return expenses.filter((expense) => expense.userId === userId);
  }, [expenses]);

  const getExpenseById = useCallback((id: string) => {
    return expenses.find((expense) => expense.id === id);
  }, [expenses]);

  const addExpense = useCallback(async (userId: string, dto: CreateExpenseDTO): Promise<ServiceResponse<Expense>> => {
    const result = await createExpense(userId, dto);

    if (!result.success || !result.data) {
      return result;
    }

    setExpenses((prev) => [result.data as Expense, ...prev]);
    return result;
  }, []);

  const updateExpense = useCallback(async (id: string, dto: UpdateExpenseDTO): Promise<ServiceResponse<Expense>> => {
    const result = await editExpense(id, dto, user?.id);

    if (!result.success || !result.data) {
      return result;
    }

    setExpenses((prev) =>
      prev.map((expense) => (expense.id === id ? { ...expense, ...result.data } : expense)),
    );

    return result;
  }, [user?.id]);

  const deleteExpense = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const result = await removeExpense(id, user?.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    return { success: true, data: null };
  }, [user?.id]);

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
