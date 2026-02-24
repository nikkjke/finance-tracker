import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

// ─── Storage Keys ────────────────────────────────────────────────
const STORAGE_KEY = 'currentUser';

// ─── Types ───────────────────────────────────────────────────────
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// ─── Mock credentials (for demo login) ──────────────────────────
const MOCK_CREDENTIALS: Record<string, string> = {
  'mariana@example.com': 'user123',
  'admin@fintrack.com': 'admin123',
  'ion@example.com': 'user123',
  'elena@example.com': 'user123',
  'andrei@example.com': 'user123',
};

// ─── Simulated network delay ────────────────────────────────────
function simulateDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Auth Service ────────────────────────────────────────────────

/**
 * Authenticate a user with email and password.
 * Checks mock credentials first, then allows any email for demo purposes.
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  await simulateDelay(600);

  // Check if user exists in mock data
  const existingUser = mockUsers.find((u) => u.email === email);

  if (existingUser) {
    // Validate password for known mock users
    const expectedPassword = MOCK_CREDENTIALS[email];
    if (expectedPassword && password !== expectedPassword) {
      return { success: false, error: 'Invalid password. Try "user123" or "admin123".' };
    }
    // Persist session
    persistSession(existingUser);
    return { success: true, user: existingUser };
  }

  // For demo: allow any email/password to create a temporary user
  const newUser: User = {
    id: crypto.randomUUID(),
    name: email.split('@')[0],
    email,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  persistSession(newUser);
  return { success: true, user: newUser };
}

/**
 * Register a new user account.
 * In a real app this would call a backend API.
 */
export async function registerUser(
  name: string,
  email: string,
  _password: string
): Promise<AuthResult> {
  await simulateDelay(600);

  // Check if email is already taken
  const exists = mockUsers.find((u) => u.email === email);
  if (exists) {
    return { success: false, error: 'This email is already registered.' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  persistSession(newUser);
  return { success: true, user: newUser };
}

/**
 * Log the current user out and clear the persisted session.
 */
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Switch the current user's role (for demo/testing purposes).
 */
export function switchUserRole(user: User, role: UserRole): User {
  const updatedUser = { ...user, role };
  persistSession(updatedUser);
  return updatedUser;
}

// ─── Session Persistence ─────────────────────────────────────────

/**
 * Save the user object to localStorage for session persistence.
 */
function persistSession(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn('Failed to persist session:', error);
  }
}

/**
 * Restore a previously saved session from localStorage.
 * Returns null if no valid session exists.
 */
export function restoreSession(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored) as User;
    // Basic validation — ensure required fields exist
    if (user && user.id && user.email && user.role) {
      return user;
    }
    return null;
  } catch (error) {
    console.warn('Failed to restore session:', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
