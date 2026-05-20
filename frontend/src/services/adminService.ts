import { getApiClient } from './httpClient';
import type { User } from '../types';

export interface ContentCategory {
  id: string;
  key: string;
  label: string;
}

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
}

export interface TransactionStatus {
  id: string;
  value: string;
  label: string;
  color: string;
}

export interface AdminContent {
  expenseCategories: ContentCategory[];
  incomeCategories: ContentCategory[];
  currencies: Currency[];
  transactionStatuses: TransactionStatus[];
}

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const response = await getApiClient().get<User[]>('/api/admin/users');
    return response.data;
  },

  async changeUserRole(userId: string, newRole: string): Promise<void> {
    await getApiClient().put(`/api/admin/users/${userId}/role`, { newRole });
  },

  async deleteUser(userId: string): Promise<void> {
    await getApiClient().delete(`/api/admin/users/${userId}`);
  },

  async getAdminContent(): Promise<AdminContent> {
    const response = await getApiClient().get<AdminContent>('/api/admin/content');
    return response.data;
  },

  async createExpenseCategory(payload: { key: string; label: string }): Promise<ContentCategory> {
    const response = await getApiClient().post<ContentCategory>('/api/admin/content/expense-categories', payload);
    return response.data;
  },

  async updateExpenseCategory(id: string, payload: { key: string; label: string }): Promise<ContentCategory> {
    const response = await getApiClient().put<ContentCategory>(`/api/admin/content/expense-categories/${id}`, payload);
    return response.data;
  },

  async deleteExpenseCategory(id: string): Promise<void> {
    await getApiClient().delete(`/api/admin/content/expense-categories/${id}`);
  },

  async createIncomeCategory(payload: { key: string; label: string }): Promise<ContentCategory> {
    const response = await getApiClient().post<ContentCategory>('/api/admin/content/income-categories', payload);
    return response.data;
  },

  async updateIncomeCategory(id: string, payload: { key: string; label: string }): Promise<ContentCategory> {
    const response = await getApiClient().put<ContentCategory>(`/api/admin/content/income-categories/${id}`, payload);
    return response.data;
  },

  async deleteIncomeCategory(id: string): Promise<void> {
    await getApiClient().delete(`/api/admin/content/income-categories/${id}`);
  },

  async createCurrency(payload: { code: string; symbol: string; name: string }): Promise<Currency> {
    const response = await getApiClient().post<Currency>('/api/admin/content/currencies', payload);
    return response.data;
  },

  async updateCurrency(id: string, payload: { code: string; symbol: string; name: string }): Promise<Currency> {
    const response = await getApiClient().put<Currency>(`/api/admin/content/currencies/${id}`, payload);
    return response.data;
  },

  async deleteCurrency(id: string): Promise<void> {
    await getApiClient().delete(`/api/admin/content/currencies/${id}`);
  },

  async createTransactionStatus(payload: { value: string; label: string; color: string }): Promise<TransactionStatus> {
    const response = await getApiClient().post<TransactionStatus>('/api/admin/content/transaction-statuses', payload);
    return response.data;
  },

  async updateTransactionStatus(id: string, payload: { value: string; label: string; color: string }): Promise<TransactionStatus> {
    const response = await getApiClient().put<TransactionStatus>(`/api/admin/content/transaction-statuses/${id}`, payload);
    return response.data;
  },

  async deleteTransactionStatus(id: string): Promise<void> {
    await getApiClient().delete(`/api/admin/content/transaction-statuses/${id}`);
  }
};
