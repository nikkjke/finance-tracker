import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Budget, CreateBudgetDTO, UpdateBudgetDTO, ServiceResponse } from '../types';
import { useAuth } from './AuthContext';
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

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
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
    return result;
  }, []);

  const updateBudget = useCallback(async (id: string, dto: UpdateBudgetDTO): Promise<ServiceResponse<Budget>> => {
    const result = await editBudget(id, dto, user?.id);

    if (!result.success || !result.data) {
      return result;
    }

    setBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...result.data } : budget)));
    return result;
  }, [user?.id]);

  const deleteBudget = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const result = await removeBudget(id, user?.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    return { success: true, data: null };
  }, [user?.id]);

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
