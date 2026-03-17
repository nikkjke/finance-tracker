import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { STORAGE_KEYS } from '../types';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    if (theme === 'dark') {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#e2e8f0';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const toggleTheme = () => {
    // Disable transitions temporarily to avoid visual delay
    const css = document.createElement('style');
    css.textContent = '*, *::before, *::after { transition: none !important; }';
    document.head.appendChild(css);

    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.head.removeChild(css);
      });
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
