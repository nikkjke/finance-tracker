import { isAxiosError } from 'axios';
import type {
  Budget,
  CreateBudgetDTO,
  CreateExpenseDTO,
  CreateIncomeDTO,
  BudgetPeriod,
  Expense,
  ExpenseCategory,
  ExpenseStatus,
  Income,
  IncomeCategory,
  PaymentMethod,
  UpdateBudgetDTO,
  UpdateExpenseDTO,
  UpdateIncomeDTO,
} from '../types';

const expenseCategoryValues: ExpenseCategory[] = [
  'food',
  'transport',
  'entertainment',
  'shopping',
  'bills',
  'health',
  'education',
  'travel',
  'other',
];

const paymentMethodValues: PaymentMethod[] = ['card', 'cash', 'bank_transfer', 'qr_scan'];
const expenseStatusValues: ExpenseStatus[] = ['completed', 'pending', 'cancelled'];
const incomeCategoryValues: IncomeCategory[] = ['salary', 'freelance', 'investment', 'bonus', 'gift', 'other_income'];
const incomeStatusValues: Income['status'][] = ['completed', 'pending'];
const budgetPeriodValues: BudgetPeriod[] = ['weekly', 'monthly', 'quarterly', 'yearly', 'custom'];

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeDateString(value: unknown, fallback: string): string {
  const raw = asString(value, fallback);
  const datePrefixMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (datePrefixMatch) {
    return datePrefixMatch[1];
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString().split('T')[0];
}

function mapEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  if (typeof value === 'string') {
    return allowed.includes(value as T) ? (value as T) : fallback;
  }

  if (typeof value === 'number' && Number.isInteger(value)) {
    const mapped = allowed[value];
    return mapped ?? fallback;
  }

  return fallback;
}


export function mapCreateExpenseToApi(dto: CreateExpenseDTO): {
  storeName: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  paymentMethod: string;
  status: string;
} {
  return {
    storeName: dto.storeName,
    amount: dto.amount,
    category: dto.category,
    date: dto.date,
    notes: dto.notes,
    paymentMethod: dto.paymentMethod,
    status: 'completed',
  };
}

export function mapUpdateExpenseToApi(dto: UpdateExpenseDTO): Record<string, unknown> {
  return {
    ...(dto.storeName !== undefined ? { storeName: dto.storeName } : {}),
    ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
    ...(dto.category !== undefined ? { category: dto.category } : {}),
    ...(dto.date !== undefined ? { date: dto.date } : {}),
    ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    ...(dto.paymentMethod !== undefined ? { paymentMethod: dto.paymentMethod } : {}),
    ...(dto.status !== undefined ? { status: dto.status } : {}),
  };
}

export function mapCreateIncomeToApi(dto: CreateIncomeDTO): {
  source: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  status: string;
} {
  return {
    source: dto.source,
    amount: dto.amount,
    category: dto.category,
    date: dto.date,
    notes: dto.notes,
    status: 'completed',
  };
}

export function mapUpdateIncomeToApi(dto: UpdateIncomeDTO): Record<string, unknown> {
  return {
    ...(dto.source !== undefined ? { source: dto.source } : {}),
    ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
    ...(dto.category !== undefined ? { category: dto.category } : {}),
    ...(dto.date !== undefined ? { date: dto.date } : {}),
    ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    ...(dto.status !== undefined ? { status: dto.status } : {}),
  };
}

export function mapCreateBudgetToApi(dto: CreateBudgetDTO): {
  category: string;
  limit: number;
  month: string;
  period: string;
  startDate?: string;
  endDate?: string;
} {
  return {
    category: dto.category,
    limit: dto.limit,
    month: dto.month,
    period: dto.period,
    startDate: dto.startDate,
    endDate: dto.endDate,
  };
}

export function mapUpdateBudgetToApi(dto: UpdateBudgetDTO): Record<string, unknown> {
  return {
    ...(dto.category !== undefined ? { category: dto.category } : {}),
    ...(dto.limit !== undefined ? { limit: dto.limit } : {}),
    ...(dto.spent !== undefined ? { spent: dto.spent } : {}),
    ...(dto.month !== undefined ? { month: dto.month } : {}),
    ...(dto.period !== undefined ? { period: dto.period } : {}),
    ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
    ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
  };
}

export function mapExpenseFromApi(payload: unknown, fallbackUserId?: string): Expense {
  const value = asRecord(payload);

  return {
    id: asString(value.id, crypto.randomUUID()),
    userId: fallbackUserId ?? asString(value.userId),
    storeName: asString(value.storeName),
    amount: asNumber(value.amount),
    category: mapEnum(value.category, expenseCategoryValues, 'other'),
    date: normalizeDateString(value.date, new Date().toISOString().split('T')[0]),
    notes: asString(value.notes) || undefined,
    paymentMethod: mapEnum(value.paymentMethod, paymentMethodValues, 'card'),
    status: mapEnum(value.status, expenseStatusValues, 'completed'),
    receiptUrl: asString(value.receiptUrl) || undefined,
  };
}

export function mapIncomeFromApi(payload: unknown, fallbackUserId?: string): Income {
  const value = asRecord(payload);

  return {
    id: asString(value.id, crypto.randomUUID()),
    userId: fallbackUserId ?? asString(value.userId),
    source: asString(value.source),
    amount: asNumber(value.amount),
    category: mapEnum(value.category, incomeCategoryValues, 'other_income'),
    date: normalizeDateString(value.date, new Date().toISOString().split('T')[0]),
    notes: asString(value.notes) || undefined,
    status: mapEnum(value.status, incomeStatusValues, 'completed'),
  };
}

export function mapBudgetFromApi(payload: unknown, fallbackUserId?: string): Budget {
  const value = asRecord(payload);

  return {
    id: asString(value.id, crypto.randomUUID()),
    userId: fallbackUserId ?? asString(value.userId),
    category: mapEnum(value.category, expenseCategoryValues, 'other'),
    limit: asNumber(value.limit),
    spent: asNumber(value.spent),
    month: asString(value.month),
    period: mapEnum(value.period, budgetPeriodValues, 'monthly'),
    startDate: value.startDate ? normalizeDateString(value.startDate, '') || undefined : undefined,
    endDate: value.endDate ? normalizeDateString(value.endDate, '') || undefined : undefined,
  };
}

function messageFromPayload(payload: unknown): string | undefined {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (typeof payload === 'object' && payload !== null) {
    const value = payload as { message?: unknown; title?: unknown; error?: unknown };
    if (typeof value.message === 'string' && value.message.trim()) return value.message;
    if (typeof value.title === 'string' && value.title.trim()) return value.title;
    if (typeof value.error === 'string' && value.error.trim()) return value.error;
  }

  return undefined;
}

export function extractServiceError(error: unknown, fallbackMessage: string): string {
  if (isAxiosError(error)) {
    const payloadMessage = messageFromPayload(error.response?.data);
    if (payloadMessage) {
      return payloadMessage;
    }

    if (!error.response) {
      return 'Cannot connect to backend. Make sure API is running.';
    }

    if (error.response.status === 404) return 'Resource not found.';
    if (error.response.status === 400) return 'Invalid request data.';
    if (error.response.status === 401) return 'Unauthorized request.';
    if (error.response.status === 403) return 'Forbidden request.';
    if (error.response.status >= 500) return 'Server error. Please try again.';
  }

  return fallbackMessage;
}