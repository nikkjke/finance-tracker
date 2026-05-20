import { getApiClient } from './httpClient';
import type { AdminContent } from './adminService';

export const contentService = {
  async getContent(): Promise<AdminContent> {
    const response = await getApiClient().get<AdminContent>('/api/content');
    return response.data;
  },
};
