// ─── Domain Types ───────────────────────────────────────────────

/** Allowed user roles in the application. */
export type UserRole = 'user' | 'admin';

/** Available payment methods for expenses. */
export type PaymentMethod = 'card' | 'cash' | 'bank_transfer' | 'qr_scan';

/** Possible statuses for an expense record. */
export type ExpenseStatus = 'completed' | 'pending' | 'cancelled';

/** Categories that can be assigned to expenses and budgets. */
export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'education'
  | 'travel'
  | 'other';

/** Represents a registered user in the system. */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

/** A single expense (transaction) record. */
export interface Expense {
  id: string;
  userId: string;
  storeName: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  receiptUrl?: string;
}

/** A monthly budget target for a specific category. */
export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  limit: number;
  spent: number;
  /** Format: "YYYY-MM" */
  month: string;
}

/** An in-app notification shown to users. */
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

/** Aggregated monthly spending statistics for the dashboard. */
export interface MonthlyStats {
  totalSpent: number;
  budgetRemaining: number;
  receiptsScanned: number;
  topCategory: ExpenseCategory;
  /** Percentage change compared to the previous month. */
  comparedToLastMonth: number;
}

/** A single data point used by chart components. */
export interface ChartDataPoint {
  label: string;
  value: number;
}

/** Aggregated statistics for the admin dashboard. */
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalExpenses: number;
  newUsersThisMonth: number;
}

// ─── Service Types ──────────────────────────────────────────────

/**
 * Standard response wrapper used by all service functions.
 * Mirrors a typical REST API response shape.
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Result returned by authentication operations (login / register).
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// ─── Data Transfer Objects (DTOs) ───────────────────────────────

/** Payload required to create a new expense. */
export interface CreateExpenseDTO {
  storeName: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

/** Payload for updating an existing expense (all fields optional). */
export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {
  status?: ExpenseStatus;
}

/** Payload required to create a new budget. */
export interface CreateBudgetDTO {
  category: ExpenseCategory;
  limit: number;
  /** Format: "YYYY-MM" */
  month: string;
}

/** Payload for updating an existing budget (all fields optional). */
export interface UpdateBudgetDTO {
  category?: ExpenseCategory;
  limit?: number;
  spent?: number;
  month?: string;
}

// ─── Constants ──────────────────────────────────────────────────

/**
 * Centralised localStorage key map.
 * Prevents typos and makes it easy to find every persistence point.
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  EXPENSES: 'expenses',
  BUDGETS: 'budgets',
  THEME: 'theme',
} as const;
