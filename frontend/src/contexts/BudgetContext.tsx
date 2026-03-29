import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Budget, CreateBudgetDTO, UpdateBudgetDTO, ServiceResponse } from '../types';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import {
  getBudgets as fetchBudgets,
  addBudget as createBudget,
  updateBudget as editBudget,
  deleteBudget as removeBudget,
} from '../services/budgetService';

interface BudgetContextType {
  budgets: Budget[];
  getBudgets: (userId?: string) => Budget[];
  getBudgetById: (id: string) => Budget | undefined;
  addBudget: (userId: string, dto: CreateBudgetDTO) => Promise<ServiceResponse<Budget>>;
  updateBudget: (id: string, dto: UpdateBudgetDTO) => Promise<ServiceResponse<Budget>>;
  deleteBudget: (id: string) => Promise<ServiceResponse<null>>;
  refreshBudgets: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const formatBudgetLabel = (value?: string) => {
  if (!value) {
    return 'Budget';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pushNotification } = useNotification();
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const loadBudgets = useCallback(async () => {
    const result = await fetchBudgets(user?.id);
    if (!result.success) {
      return;
    }

    setBudgets(result.data ?? []);
  }, [user?.id]);

  useEffect(() => {
    void loadBudgets();
  }, [loadBudgets]);

  const getBudgets = useCallback((userId?: string) => {
    if (!userId) return budgets;
    return budgets.filter((budget) => budget.userId === userId);
  }, [budgets]);

  const getBudgetById = useCallback((id: string) => {
    return budgets.find((budget) => budget.id === id);
  }, [budgets]);

  const addBudget = useCallback(async (userId: string, dto: CreateBudgetDTO): Promise<ServiceResponse<Budget>> => {
    const result = await createBudget(userId, dto);

    if (!result.success || !result.data) {
      return result;
    }

    setBudgets((prev) => [result.data as Budget, ...prev]);
    const budgetLabel = formatBudgetLabel(result.data.category);
    pushNotification({
      title: 'Budget added',
      message: `${budgetLabel} budget set to $${result.data.limit.toFixed(2)}.`,
      type: 'budget',
      priority: 'medium',
    });
    return result;
  }, [pushNotification]);

  const updateBudget = useCallback(async (id: string, dto: UpdateBudgetDTO): Promise<ServiceResponse<Budget>> => {
    const previousBudget = budgets.find((budget) => budget.id === id);
    const result = await editBudget(id, dto, user?.id);

    if (!result.success || !result.data) {
      return result;
    }

    setBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...result.data } : budget)));
    const category = formatBudgetLabel(result.data.category ?? previousBudget?.category);
    const limit = result.data.limit ?? previousBudget?.limit;
    const amount = typeof limit === 'number' ? `$${limit.toFixed(2)}` : 'new amount';
    pushNotification({
      title: 'Budget updated',
      message: `${category} budget was updated to ${amount}.`,
      type: 'budget',
      priority: 'medium',
    });
    return result;
  }, [budgets, user?.id, pushNotification]);

  const deleteBudget = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const deletedBudget = budgets.find((budget) => budget.id === id);
    const result = await removeBudget(id, user?.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    const category = formatBudgetLabel(deletedBudget?.category);
    pushNotification({
      title: 'Budget deleted',
      message: `${category} budget was removed.`,
      type: 'budget',
      priority: 'medium',
    });
    return { success: true, data: null };
  }, [budgets, user?.id, pushNotification]);

  const refreshBudgets = useCallback(() => {
    void loadBudgets();
  }, [loadBudgets]);

  const value: BudgetContextType = {
    budgets,
    getBudgets,
    getBudgetById,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within BudgetProvider');
  }
  return context;
}
