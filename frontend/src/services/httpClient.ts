import axios, { type AxiosInstance } from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5200';

let apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiClient(): AxiosInstance {
  return apiClient;
}

export function setApiClient(client: AxiosInstance): void {
  apiClient = client;
}

export function createApiClient(): AxiosInstance {
  return axios.create({
    baseURL: apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export { apiBaseUrl };



