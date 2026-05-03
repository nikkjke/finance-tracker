import type { User, AuthResult } from '../types';
import { STORAGE_KEYS } from '../types';
import { getApiClient } from './httpClient';

// Re-export so existing consumers don't break
export type { AuthResult } from '../types';

// ─── Storage helpers ──────────────────────────────────────────────

function saveToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
  } catch {
    console.warn('Failed to save token');
  }
}

function saveUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch {
    console.warn('Failed to save user');
  }
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// ─── Auth Service ─────────────────────────────────────────────────

/**
 * Authenticate a user with email and password against the real backend.
 * On success the JWT token and user object are persisted to localStorage.
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    const response = await getApiClient().post<{ token: string; user: User }>('/api/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;
    saveToken(token);
    saveUser(user);
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
): Promise<AuthResult> {
  try {
    const response = await getApiClient().post<{ token: string; user: User }>('/api/auth/register', {
      name,
      email,
      password,
    });

    const { token, user } = response.data;
    saveToken(token);
    saveUser(user);
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
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (!token || !stored) return null;

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

    const user = JSON.parse(stored) as User;
    if (user && user.id && user.email && user.role) {
      return user;
    }
    return null;
  } catch {
    clearSession();
    return null;
  }
}
