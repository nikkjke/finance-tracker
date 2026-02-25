import type { Budget, ServiceResponse, CreateBudgetDTO, UpdateBudgetDTO } from '../types';
import { STORAGE_KEYS } from '../types';
import { mockBudgets } from '../data/mockData';

// Re-export so existing consumers don't break
export type { CreateBudgetDTO, UpdateBudgetDTO } from '../types';

// ─── Storage ─────────────────────────────────────────────────────
const STORAGE_KEY = STORAGE_KEYS.BUDGETS;

/**
 * Load budgets from localStorage, falling back to mock data on first use.
 */
function loadBudgets(): Budget[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Budget[];
    }
  } catch (error) {
    console.warn('Failed to load budgets from localStorage:', error);
  }
  // First run — seed with mock data
  saveBudgets(mockBudgets);
  return [...mockBudgets];
}

/**
 * Persist the current budgets array to localStorage.
 */
function saveBudgets(budgets: Budget[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.warn('Failed to save budgets to localStorage:', error);
  }
}

// ─── Simulated network delay ────────────────────────────────────
function simulateDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Error simulation (5% chance) ───────────────────────────────
const ERROR_RATE = 0.05;

function shouldSimulateError(): boolean {
  return Math.random() < ERROR_RATE;
}

// ─── CRUD Operations ─────────────────────────────────────────────

/**
 * Fetch all budgets for a given user (or all if no userId).
 */
export async function getBudgets(userId?: string): Promise<ServiceResponse<Budget[]>> {
  await simulateDelay(400);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to fetch budgets. Please try again.' };
  }

  const budgets = loadBudgets();
  const filtered = userId ? budgets.filter((b) => b.userId === userId) : budgets;
  return { success: true, data: filtered };
}

/**
 * Get a single budget by ID.
 */
export async function getBudgetById(id: string): Promise<ServiceResponse<Budget>> {
  await simulateDelay(300);

  const budgets = loadBudgets();
  const budget = budgets.find((b) => b.id === id);

  if (!budget) {
    return { success: false, error: `Budget with ID "${id}" not found.` };
  }

  return { success: true, data: budget };
}

/**
 * Create a new budget.
 * Validates that the limit is positive and no duplicate category+month exists.
 */
export async function addBudget(
  userId: string,
  dto: CreateBudgetDTO
): Promise<ServiceResponse<Budget>> {
  await simulateDelay(500);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to create budget. Please try again.' };
  }

  // Validation
  if (dto.limit <= 0) {
    return { success: false, error: 'Budget limit must be greater than zero.' };
  }
  if (!dto.month) {
    return { success: false, error: 'Month is required.' };
  }

  // Check for duplicate category in the same month for the same user
  const budgets = loadBudgets();
  const duplicate = budgets.find(
    (b) => b.userId === userId && b.category === dto.category && b.month === dto.month
  );
  if (duplicate) {
    return {
      success: false,
      error: `A budget for "${dto.category}" already exists for ${dto.month}.`,
    };
  }

  const newBudget: Budget = {
    id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    category: dto.category,
    limit: dto.limit,
    spent: 0,
    month: dto.month,
  };

  budgets.push(newBudget);
  saveBudgets(budgets);

  return { success: true, data: newBudget };
}

/**
 * Update an existing budget by ID.
 */
export async function updateBudget(
  id: string,
  dto: UpdateBudgetDTO
): Promise<ServiceResponse<Budget>> {
  await simulateDelay(400);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to update budget. Please try again.' };
  }

  const budgets = loadBudgets();
  const index = budgets.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: `Budget with ID "${id}" not found.` };
  }

  // Validate limit if provided
  if (dto.limit !== undefined && dto.limit <= 0) {
    return { success: false, error: 'Budget limit must be greater than zero.' };
  }

  const updated: Budget = {
    ...budgets[index],
    ...(dto.category !== undefined && { category: dto.category }),
    ...(dto.limit !== undefined && { limit: dto.limit }),
    ...(dto.spent !== undefined && { spent: dto.spent }),
    ...(dto.month !== undefined && { month: dto.month }),
  };

  budgets[index] = updated;
  saveBudgets(budgets);

  return { success: true, data: updated };
}

/**
 * Delete a budget by ID.
 */
export async function deleteBudget(id: string): Promise<ServiceResponse<void>> {
  await simulateDelay(300);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to delete budget. Please try again.' };
  }

  const budgets = loadBudgets();
  const index = budgets.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: `Budget with ID "${id}" not found.` };
  }

  budgets.splice(index, 1);
  saveBudgets(budgets);

  return { success: true };
}
