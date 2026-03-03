import type { Income, ServiceResponse, CreateIncomeDTO, UpdateIncomeDTO } from '../types';
import { STORAGE_KEYS } from '../types';
import { mockIncome } from '../data/mockData';

// Re-export so existing consumers don't break
export type { ServiceResponse, CreateIncomeDTO, UpdateIncomeDTO } from '../types';

// ─── Storage ─────────────────────────────────────────────────────
const STORAGE_KEY = STORAGE_KEYS.INCOME;

/**
 * Load income records from localStorage, falling back to mock data on first use.
 */
function loadIncome(): Income[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Income[];
    }
  } catch (error) {
    console.warn('Failed to load income from localStorage:', error);
  }
  // First run — seed with mock data
  saveIncome(mockIncome);
  return [...mockIncome];
}

/**
 * Persist the current income array to localStorage.
 */
function saveIncome(income: Income[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(income));
  } catch (error) {
    console.warn('Failed to save income to localStorage:', error);
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
 * Fetch all income records for a given user (or all if no userId).
 * Simulates loading delay and occasional server error (500).
 */
export async function getIncome(userId?: string): Promise<ServiceResponse<Income[]>> {
  await simulateDelay(500);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to fetch income. Please try again.' };
  }

  const income = loadIncome();
  const filtered = userId ? income.filter((i) => i.userId === userId) : income;
  return { success: true, data: filtered };
}

/**
 * Get a single income record by ID.
 */
export async function getIncomeById(id: string): Promise<ServiceResponse<Income>> {
  await simulateDelay(300);

  const income = loadIncome();
  const record = income.find((i) => i.id === id);

  if (!record) {
    return { success: false, error: `Income record with ID "${id}" not found.` };
  }

  return { success: true, data: record };
}

/**
 * Create a new income record.
 * Validates required fields before saving.
 */
export async function addIncome(
  userId: string,
  dto: CreateIncomeDTO
): Promise<ServiceResponse<Income>> {
  await simulateDelay(600);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to create income record. Please try again.' };
  }

  // Validation
  if (!dto.source.trim()) {
    return { success: false, error: 'Income source is required.' };
  }
  if (dto.amount <= 0) {
    return { success: false, error: 'Amount must be greater than zero.' };
  }
  if (!dto.date) {
    return { success: false, error: 'Date is required.' };
  }

  const newIncome: Income = {
    id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    source: dto.source.trim(),
    amount: dto.amount,
    category: dto.category,
    date: dto.date,
    notes: dto.notes?.trim() || undefined,
    status: 'completed',
  };

  const income = loadIncome();
  income.unshift(newIncome);
  saveIncome(income);

  return { success: true, data: newIncome };
}

/**
 * Update an existing income record by ID.
 */
export async function updateIncome(
  id: string,
  dto: UpdateIncomeDTO
): Promise<ServiceResponse<Income>> {
  await simulateDelay(500);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to update income record. Please try again.' };
  }

  const income = loadIncome();
  const index = income.findIndex((i) => i.id === id);

  if (index === -1) {
    return { success: false, error: `Income record with ID "${id}" not found.` };
  }

  const updated: Income = {
    ...income[index],
    ...(dto.source !== undefined && { source: dto.source.trim() }),
    ...(dto.amount !== undefined && { amount: dto.amount }),
    ...(dto.category !== undefined && { category: dto.category }),
    ...(dto.date !== undefined && { date: dto.date }),
    ...(dto.notes !== undefined && { notes: dto.notes?.trim() || undefined }),
    ...(dto.status !== undefined && { status: dto.status }),
  };

  income[index] = updated;
  saveIncome(income);

  return { success: true, data: updated };
}

/**
 * Delete an income record by ID.
 */
export async function deleteIncome(id: string): Promise<ServiceResponse<void>> {
  await simulateDelay(400);

  if (shouldSimulateError()) {
    return { success: false, error: 'Internal server error: Failed to delete income record. Please try again.' };
  }

  const income = loadIncome();
  const index = income.findIndex((i) => i.id === id);

  if (index === -1) {
    return { success: false, error: `Income record with ID "${id}" not found.` };
  }

  income.splice(index, 1);
  saveIncome(income);

  return { success: true };
}
