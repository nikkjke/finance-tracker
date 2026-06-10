import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Currency = 'USD' | 'MDL';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
  convertToBase: (amount: number) => number;
  convertToBaseFrom: (amount: number, fromCurrency: Currency) => number;
  convertFromBase: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Hardcoded Exchange Rates (Base: USD)
const EXCHANGE_RATES = {
  USD: 1,
  MDL: 18.25, // e.g. 1 USD = 18.25 MDL
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const profilePrefsKey = user ? `profile_prefs_${user.id}` : 'profile_prefs_guest';

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(profilePrefsKey);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.currency && (parsed.currency === 'USD' || parsed.currency === 'MDL')) {
          setCurrencyState(parsed.currency as Currency);
        }
      }
    } catch {
      // Ignore
    }
  }, [profilePrefsKey, user]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      const savedPrefs = localStorage.getItem(profilePrefsKey);
      const parsed = savedPrefs ? JSON.parse(savedPrefs) : {};
      parsed.currency = newCurrency;
      localStorage.setItem(profilePrefsKey, JSON.stringify(parsed));
    } catch {
      // Ignore
    }
  };

  const currencySymbol = currency === 'MDL' ? 'MDL' : '$';

  const convertFromBase = (amount: number) => {
    return amount * EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES];
  };

  const convertToBase = (amount: number) => {
    return amount / EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES];
  };

  const convertToBaseFrom = (amount: number, fromCurrency: Currency) => {
    return amount / EXCHANGE_RATES[fromCurrency];
  };

  const formatCurrency = (amount: number) => {
    const convertedAmount = convertFromBase(amount);
    if (currency === 'MDL') {
      return `${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} MDL`;
    }
    return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, currencySymbol, convertToBase, convertToBaseFrom, convertFromBase }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
