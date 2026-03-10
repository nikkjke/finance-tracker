import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { mockBudgets } from '../data/mockData';
import { STORAGE_KEYS } from '../types';
import type { Budget, CreateBudgetDTO, UpdateBudgetDTO, ServiceResponse } from '../types';

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

/** Load budgets from localStorage, seeding demo user with mock data on first load. */
function loadInitialBudgets(): Budget[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (stored) {
      const budgets = JSON.parse(stored) as Budget[];
      // If storage exists but is empty, check if we should seed demo user
      if (budgets.length === 0) {
        // Seed demo user budgets on first load
        const demoUserBudgets = mockBudgets.filter(b => b.userId === '1');
        if (demoUserBudgets.length > 0) {
          localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(demoUserBudgets));
          return demoUserBudgets;
        }
      }
      return budgets;
    } else {
      // First time - seed with demo user budgets only
      const demoUserBudgets = mockBudgets.filter(b => b.userId === '1');
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(demoUserBudgets));
      return demoUserBudgets;
    }
  } catch {
    // ignore
  }
  return [];
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>(loadInitialBudgets);

  // Persist budgets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch {
      console.warn('Failed to persist budgets to localStorage');
    }
  }, [budgets]);

  const getBudgets = useCallback((userId?: string) => {
    if (!userId) return budgets;
    return budgets.filter((budget) => budget.userId === userId);
  }, [budgets]);

  const getBudgetById = useCallback((id: string) => {
    return budgets.find((budget) => budget.id === id);
  }, [budgets]);

  const addBudget = useCallback(async (userId: string, dto: CreateBudgetDTO): Promise<ServiceResponse<Budget>> => {
    // Validation
    if (dto.limit <= 0) {
      return { success: false, error: 'Budget limit must be greater than zero.' };
    }
    if (!dto.month) {
      return { success: false, error: 'Month is required.' };
    }

    // Check for duplicate: same category + same period (+ same date range for custom)
    const duplicate = budgets.find((b) => {
      if (b.userId !== userId || b.category !== dto.category) return false;
      if (b.period !== dto.period) return false;
      if (dto.period === 'custom') {
        return b.startDate === dto.startDate && b.endDate === dto.endDate;
      }
      return true;
    });
    if (duplicate) {
      const periodLabel: Record<string, string> = {
        weekly: 'this week', monthly: 'this month', quarterly: 'this quarter',
        yearly: 'this year', custom: 'that date range',
      };
      return {
        success: false,
        error: `A ${dto.period} budget for "${dto.category}" already exists for ${periodLabel[dto.period] ?? dto.period}.`,
      };
    }

    const newBudget: Budget = {
      id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      category: dto.category,
      limit: dto.limit,
      spent: 0,
      month: dto.month,
      period: dto.period,
      startDate: dto.startDate,
      endDate: dto.endDate,
    };

    setBudgets((prev) => [newBudget, ...prev]);
    return { success: true, data: newBudget };
  }, [budgets]);

  const updateBudget = useCallback(async (id: string, dto: UpdateBudgetDTO): Promise<ServiceResponse<Budget>> => {
    let updatedBudget: Budget | undefined;

    setBudgets((prev) =>
      prev.map((budget) => {
        if (budget.id !== id) return budget;

        // Validate limit if provided
        if (dto.limit !== undefined && dto.limit <= 0) {
          return budget; // Skip update if invalid
        }

        updatedBudget = {
          ...budget,
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.limit !== undefined && { limit: dto.limit }),
          ...(dto.spent !== undefined && { spent: dto.spent }),
          ...(dto.month !== undefined && { month: dto.month }),
          ...(dto.period !== undefined && { period: dto.period }),
          ...(dto.startDate !== undefined && { startDate: dto.startDate }),
          ...(dto.endDate !== undefined && { endDate: dto.endDate }),
        };

        return updatedBudget;
      }),
    );

    if (!updatedBudget) {
      return { success: false, error: `Budget with ID "${id}" not found or validation failed.` };
    }

    return { success: true, data: updatedBudget };
  }, []);

  const deleteBudget = useCallback(async (id: string): Promise<ServiceResponse<null>> => {
    const budgetExists = budgets.some((b) => b.id === id);

    if (!budgetExists) {
      return { success: false, error: `Budget with ID "${id}" not found.` };
    }

    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    return { success: true, data: null };
  }, [budgets]);

  const refreshBudgets = useCallback(() => {
    const stored = loadInitialBudgets();
    setBudgets(stored);
  }, []);

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
