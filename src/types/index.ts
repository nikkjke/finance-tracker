export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  storeName: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  paymentMethod: 'card' | 'cash' | 'bank_transfer' | 'qr_scan';
  status: 'completed' | 'pending' | 'cancelled';
  receiptUrl?: string;
}

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

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  limit: number;
  spent: number;
  month: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface MonthlyStats {
  totalSpent: number;
  budgetRemaining: number;
  receiptsScanned: number;
  topCategory: ExpenseCategory;
  comparedToLastMonth: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalExpenses: number;
  newUsersThisMonth: number;
}
