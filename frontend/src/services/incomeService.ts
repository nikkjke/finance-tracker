import type { Income, ServiceResponse, CreateIncomeDTO, UpdateIncomeDTO } from '../types';
import {
  extractServiceError,
  mapIncomeFromApi,
  mapCreateIncomeToApi,
  mapUpdateIncomeToApi,
} from './apiMappers';
import { getApiClient } from './httpClient';

export type { ServiceResponse, CreateIncomeDTO, UpdateIncomeDTO } from '../types';

export async function getIncome(userId?: string): Promise<ServiceResponse<Income[]>> {
  try {
    const response = await getApiClient().get('/api/incomes/getAll');

    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map((item) => mapIncomeFromApi(item, userId)) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, 'Failed to fetch income records.') };
  }
}

export async function getIncomeById(id: string, _userId?: string): Promise<ServiceResponse<Income>> {
  try {
    const response = await getApiClient().get(`/api/incomes/getById/${id}`);
    return { success: true, data: mapIncomeFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Income record with ID "${id}" not found.`) };
  }
}

export async function addIncome(userId: string, dto: CreateIncomeDTO): Promise<ServiceResponse<Income>> {
  try {
    const response = await getApiClient().post('/api/incomes/create', mapCreateIncomeToApi(dto));

    return { success: true, data: mapIncomeFromApi(response.data, userId) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, 'Failed to create income record.') };
  }
}

export async function updateIncome(id: string, dto: UpdateIncomeDTO, userId?: string): Promise<ServiceResponse<Income>> {
  try {
    const response = await getApiClient().put(`/api/incomes/update/${id}`, mapUpdateIncomeToApi(dto));
    return { success: true, data: mapIncomeFromApi(response.data, userId) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Income record with ID "${id}" not found.`) };
  }
}

export async function deleteIncome(id: string, _userId?: string): Promise<ServiceResponse<void>> {
  try {
    await getApiClient().delete(`/api/incomes/delete/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractServiceError(error, `Income record with ID "${id}" not found.`) };
  }
}
