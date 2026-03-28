import type { Budget, ServiceResponse, CreateBudgetDTO, UpdateBudgetDTO } from '../types';
import {
  extractServiceError,
  mapBudgetFromApi,
  mapCreateBudgetToApi,
  mapUpdateBudgetToApi,
} from './apiMappers';
import { getApiClient } from './httpClient';

export type { CreateBudgetDTO, UpdateBudgetDTO } from '../types';

export async function getBudgets(userId?: string): Promise<ServiceResponse<Budget[]>> {
  try {
    const response = await getApiClient().get('/api/budgets/getAll');

    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map((item) => mapBudgetFromApi(item, userId)) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, 'Failed to fetch budgets.') };
  }
}

export async function getBudgetById(id: string, _userId?: string): Promise<ServiceResponse<Budget>> {
  try {
    const response = await getApiClient().get(`/api/budgets/getById/${id}`);
    return { success: true, data: mapBudgetFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Budget with ID "${id}" not found.`) };
  }
}

export async function addBudget(userId: string, dto: CreateBudgetDTO): Promise<ServiceResponse<Budget>> {
  try {
    const response = await getApiClient().post('/api/budgets/create', mapCreateBudgetToApi(dto));

    return { success: true, data: mapBudgetFromApi(response.data, userId) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, 'Failed to create budget.') };
  }
}

export async function updateBudget(id: string, dto: UpdateBudgetDTO, userId?: string): Promise<ServiceResponse<Budget>> {
  try {
    const response = await getApiClient().put(`/api/budgets/update/${id}`, mapUpdateBudgetToApi(dto));
    return { success: true, data: mapBudgetFromApi(response.data, userId) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Budget with ID "${id}" not found.`) };
  }
}

export async function deleteBudget(id: string, _userId?: string): Promise<ServiceResponse<void>> {
  try {
    await getApiClient().delete(`/api/budgets/delete/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Budget with ID "${id}" not found.`) };
  }
}
