import type { Expense, ServiceResponse, CreateExpenseDTO, UpdateExpenseDTO } from '../types';
import {
  extractServiceError,
  mapExpenseFromApi,
  mapCreateExpenseToApi,
  mapUpdateExpenseToApi,
} from './apiMappers';
import { getApiClient } from './httpClient';

export type { ServiceResponse, CreateExpenseDTO, UpdateExpenseDTO } from '../types';

export async function getExpenses(userId?: string): Promise<ServiceResponse<Expense[]>> {
  try {
    const response = await getApiClient().get('/api/expenses/getAll');

    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map((item) => mapExpenseFromApi(item, userId)) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, 'Failed to fetch expenses.') };
  }
}

export async function getExpenseById(id: string, _userId?: string): Promise<ServiceResponse<Expense>> {
  try {
    const response = await getApiClient().get(`/api/expenses/getById/${id}`);
    return { success: true, data: mapExpenseFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Expense with ID "${id}" not found.`) };
  }
}

export async function addExpense(userId: string, dto: CreateExpenseDTO): Promise<ServiceResponse<Expense>> {
  try {
    const response = await getApiClient().post('/api/expenses/create', mapCreateExpenseToApi(dto));

    return { success: true, data: mapExpenseFromApi(response.data, userId) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, 'Failed to create expense.') };
  }
}

export async function updateExpense(id: string, dto: UpdateExpenseDTO, userId?: string): Promise<ServiceResponse<Expense>> {
  try {
    const response = await getApiClient().put(`/api/expenses/update/${id}`, mapUpdateExpenseToApi(dto));
    return { success: true, data: mapExpenseFromApi(response.data, userId) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Expense with ID "${id}" not found.`) };
  }
}

export async function deleteExpense(id: string, _userId?: string): Promise<ServiceResponse<void>> {
  try {
    await getApiClient().delete(`/api/expenses/delete/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Expense with ID "${id}" not found.`) };
  }
}
