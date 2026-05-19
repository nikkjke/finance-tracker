import type { User, AuthResult } from '../types';
import { STORAGE_KEYS } from '../types';
import { getApiClient } from './httpClient';

// Re-export so existing consumers don't break
export type { AuthResult } from '../types';

// ─── Storage helpers ──────────────────────────────────────────────

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    console.warn('Failed to persist session data');
  }
}

function safeRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage errors.
  }
}

function saveSession(token: string, user: User, rememberMe: boolean): void {
  const target = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  safeSet(target, STORAGE_KEYS.JWT_TOKEN, token);
  safeSet(target, STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  safeRemove(other, STORAGE_KEYS.JWT_TOKEN);
  safeRemove(other, STORAGE_KEYS.CURRENT_USER);
}

function clearSession(): void {
  safeRemove(localStorage, STORAGE_KEYS.JWT_TOKEN);
  safeRemove(localStorage, STORAGE_KEYS.CURRENT_USER);
  safeRemove(sessionStorage, STORAGE_KEYS.JWT_TOKEN);
  safeRemove(sessionStorage, STORAGE_KEYS.CURRENT_USER);
}

function getStoredSession(): { token: string; user: User } | null {
  const localToken = safeGet(localStorage, STORAGE_KEYS.JWT_TOKEN);
  const localUser = safeGet(localStorage, STORAGE_KEYS.CURRENT_USER);
  if (localToken && localUser) {
    return { token: localToken, user: JSON.parse(localUser) as User };
  }

  const sessionToken = safeGet(sessionStorage, STORAGE_KEYS.JWT_TOKEN);
  const sessionUser = safeGet(sessionStorage, STORAGE_KEYS.CURRENT_USER);
  if (sessionToken && sessionUser) {
    return { token: sessionToken, user: JSON.parse(sessionUser) as User };
  }

  return null;
}

// ─── Auth Service ─────────────────────────────────────────────────

/**
 * Authenticate a user with email and password against the real backend.
 * On success the JWT token and user object are persisted to localStorage.
 */
export async function loginUser(email: string, password: string, rememberMe = true): Promise<AuthResult> {
  try {
    const response = await getApiClient().post<{ token: string; user: User }>('/api/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;
    saveSession(token, user, rememberMe);
    return { success: true, user };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    const message =
      axiosError?.response?.data?.message ??
      (axiosError?.response?.status === 401
        ? 'Invalid email or password.'
        : 'Login failed. Please try again.');
    return { success: false, error: message };
  }
}

/**
 * Register a new user account.
 * On success the JWT token and user object are persisted to localStorage.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  termsAccepted: boolean,
): Promise<AuthResult> {
  try {
    const response = await getApiClient().post<{ token: string; user: User }>('/api/auth/register', {
      name,
      email,
      password,
      termsAccepted,
    });

    const { token, user } = response.data;
    saveSession(token, user, true);
    return { success: true, user };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number }, message?: string };
    
    // First try to use the backend's explicit message
    let message = axiosError?.response?.data?.message;
    
    // If no backend message, determine based on status or network error
    if (!message) {
      if (axiosError?.response?.status === 409) {
        message = 'This email is already registered.';
      } else if (axiosError?.response?.status === 500) {
        message = 'Server error during registration. (Please check console)';
      } else if (!axiosError?.response) {
        message = `Network error: ${axiosError.message || 'Unable to reach the server'}`;
      } else {
        message = `Registration failed (Status: ${axiosError.response.status}). Please try again.`;
      }
    }
    
    console.error("Register Error:", error);
    return { success: false, error: message };
  }
}

/**
 * Log the current user out and clear the persisted session.
 */
export function logoutUser(): void {
  clearSession();
}

/**
 * Restore a previously saved session from localStorage.
 * Reads both the stored user object and validates the JWT has not expired.
 * Returns null if no valid session exists.
 */
export function restoreSession(): User | null {
  try {
    const session = getStoredSession();
    if (!session) return null;

    const { token, user } = session;

    // Decode JWT payload to check expiry (no signature verification — server does that)
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    const payload = JSON.parse(atob(payloadBase64)) as { exp?: number };
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      // Token has expired — remove stale session
      clearSession();
      return null;
    }

    if (user && user.id && user.email && user.role) {
      return user;
    }
    return null;
  } catch {
    clearSession();
    return null;
  }
}
