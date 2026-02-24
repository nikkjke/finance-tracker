import type { Expense, ExpenseCategory } from '../types';
import { mockExpenses } from '../data/mockData';

// ─── Types ───────────────────────────────────────────────────────
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateExpenseDTO {
  storeName: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  paymentMethod: Expense['paymentMethod'];
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {
  status?: Expense['status'];
}

// ─── Storage ─────────────────────────────────────────────────────
const STORAGE_KEY = 'expenses';

/**
 * Load expenses from localStorage, falling back to mock data on first use.
 */
function loadExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Expense[];
    }
  } catch (error) {
    console.warn('Failed to load expenses from localStorage:', error);
  }
  // First run — seed with mock data
  saveExpenses(mockExpenses);
  return [...mockExpenses];
}

/**
 * Persist the current expenses array to localStorage.
 */
function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.warn('Failed to save expenses to localStorage:', error);
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
 * Fetch all expenses for a given user (or all if no userId).
 * Simulates loading delay and occasional server error (500).
 */
export async function getExpenses(userId?: string): Promise<ServiceResponse<Expense[]>> {
  await simulateDelay(500);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to fetch expenses. Please try again.' };
  }

  const expenses = loadExpenses();
  const filtered = userId ? expenses.filter((e) => e.userId === userId) : expenses;
  return { success: true, data: filtered };
}

/**
 * Get a single expense by ID.
 */
export async function getExpenseById(id: string): Promise<ServiceResponse<Expense>> {
  await simulateDelay(300);

  const expenses = loadExpenses();
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return { success: false, error: `Expense with ID "${id}" not found.` };
  }

  return { success: true, data: expense };
}

/**
 * Create a new expense.
 * Validates required fields before saving.
 */
export async function addExpense(
  userId: string,
  dto: CreateExpenseDTO
): Promise<ServiceResponse<Expense>> {
  await simulateDelay(600);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to create expense. Please try again.' };
  }

  // Validation
  if (!dto.storeName.trim()) {
    return { success: false, error: 'Store name is required.' };
  }
  if (dto.amount <= 0) {
    return { success: false, error: 'Amount must be greater than zero.' };
  }
  if (!dto.date) {
    return { success: false, error: 'Date is required.' };
  }

  const newExpense: Expense = {
    id: `e-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    storeName: dto.storeName.trim(),
    amount: dto.amount,
    category: dto.category,
    date: dto.date,
    notes: dto.notes?.trim() || undefined,
    paymentMethod: dto.paymentMethod,
    status: 'completed',
  };

  const expenses = loadExpenses();
  expenses.unshift(newExpense);
  saveExpenses(expenses);

  return { success: true, data: newExpense };
}

/**
 * Update an existing expense by ID.
 */
export async function updateExpense(
  id: string,
  dto: UpdateExpenseDTO
): Promise<ServiceResponse<Expense>> {
  await simulateDelay(500);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to update expense. Please try again.' };
  }

  const expenses = loadExpenses();
  const index = expenses.findIndex((e) => e.id === id);

  if (index === -1) {
    return { success: false, error: `Expense with ID "${id}" not found.` };
  }

  const updated: Expense = {
    ...expenses[index],
    ...(dto.storeName !== undefined && { storeName: dto.storeName.trim() }),
    ...(dto.amount !== undefined && { amount: dto.amount }),
    ...(dto.category !== undefined && { category: dto.category }),
    ...(dto.date !== undefined && { date: dto.date }),
    ...(dto.notes !== undefined && { notes: dto.notes?.trim() || undefined }),
    ...(dto.paymentMethod !== undefined && { paymentMethod: dto.paymentMethod }),
    ...(dto.status !== undefined && { status: dto.status }),
  };

  expenses[index] = updated;
  saveExpenses(expenses);

  return { success: true, data: updated };
}

/**
 * Delete an expense by ID.
 */
export async function deleteExpense(id: string): Promise<ServiceResponse<void>> {
  await simulateDelay(400);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to delete expense. Please try again.' };
  }

  const expenses = loadExpenses();
  const index = expenses.findIndex((e) => e.id === id);

  if (index === -1) {
    return { success: false, error: `Expense with ID "${id}" not found.` };
  }

  expenses.splice(index, 1);
  saveExpenses(expenses);

  return { success: true };
}
