import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { isAxiosError, type AxiosInstance } from 'axios';
import { createApiClient, setApiClient } from '../services/httpClient';

export interface ApiErrorEventDetail {
  status: number;
  message: string;
  path?: string;
}

interface AxiosContextValue {
  axios: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextValue | undefined>(undefined);

function getGlobalErrorMessage(status: number): string {
  if (status === 400) return 'Invalid request. Please check your input.';
  if (status === 401) return 'You are not authenticated. Please sign in again.';
  if (status === 403) return 'You are not allowed to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  if (status >= 500) return 'Server error. Please try again later.';
  return 'Unexpected API error.';
}

function emitApiError(detail: ApiErrorEventDetail): void {
  window.dispatchEvent(new CustomEvent<ApiErrorEventDetail>('api:error', { detail }));
}

export function AxiosProvider({ children }: { children: ReactNode }) {
  const axiosInstance = useMemo(() => createApiClient(), []);

  useEffect(() => {
    setApiClient(axiosInstance);

    const interceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const path = error.config?.url;

          if (status === undefined) {
            emitApiError({
              status: 0,
              message: 'Network error. Check your connection and backend server.',
              path,
            });
            return Promise.reject(error);
          }

          emitApiError({
            status,
            message: getGlobalErrorMessage(status),
            path,
          });

          if (status === 401 && window.location.pathname !== '/401') {
            window.location.assign('/401');
          } else if (status === 403 && window.location.pathname !== '/403') {
            window.location.assign('/403');
          } else if (status >= 500 && window.location.pathname !== '/500') {
            window.location.assign('/500');
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, [axiosInstance]);

  return <AxiosContext.Provider value={{ axios: axiosInstance }}>{children}</AxiosContext.Provider>;
}

export function useAxios(): AxiosInstance {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within AxiosProvider');
  }

  return context.axios;
}

