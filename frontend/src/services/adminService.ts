import { getApiClient } from './httpClient';
import type { User } from '../types';

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
  }
};
