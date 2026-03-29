import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, ServiceResponse } from '../types';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
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
  updateExpense: (
    id: string,
    dto: UpdateExpenseDTO,
    options?: { notify?: boolean }
  ) => Promise<ServiceResponse<Expense>>;
  deleteExpense: (id: string) => Promise<ServiceResponse<null>>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pushNotification } = useNotification();
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
    pushNotification({
      title: 'Transaction added',
      message: `Expense at ${result.data.storeName} for $${result.data.amount.toFixed(2)} was added.`,
      type: 'expense',
      priority: 'low',
    });
    return result;
  }, [pushNotification]);

  const updateExpense = useCallback(async (
    id: string,
    dto: UpdateExpenseDTO,
    options?: { notify?: boolean },
  ): Promise<ServiceResponse<Expense>> => {
    const previousExpense = expenses.find((expense) => expense.id === id);
    const result = await editExpense(id, dto, user?.id);

    if (!result.success || !result.data) {
      return result;
    }

    setExpenses((prev) =>
      prev.map((expense) => (expense.id === id ? { ...expense, ...result.data } : expense)),
    );

    const storeName = result.data.storeName ?? previousExpense?.storeName ?? 'transaction';
    const amount = result.data.amount ?? previousExpense?.amount;
    const amountText = typeof amount === 'number' ? `$${amount.toFixed(2)}` : 'new amount';
    if (options?.notify !== false) {
      pushNotification({
        title: 'Transaction updated',
        message: `Expense at ${storeName} was updated (${amountText}).`,
        type: 'expense',
        priority: 'low',
      });
    }

    return result;
  }, [expenses, user?.id, pushNotification]);

  const deleteExpense = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const deletedExpense = expenses.find((expense) => expense.id === id);
    const result = await removeExpense(id, user?.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    pushNotification({
      title: 'Transaction deleted',
      message: `Expense at ${deletedExpense?.storeName ?? 'transaction'} was deleted.`,
      type: 'expense',
      priority: 'medium',
    });
    return { success: true, data: null };
  }, [expenses, user?.id, pushNotification]);

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
