import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { translations, type Language, type TranslationKey } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');

  const profilePrefsKey = user ? `profile_prefs_${user.id}` : 'profile_prefs_guest';

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(profilePrefsKey);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.language && (parsed.language === 'en' || parsed.language === 'ro')) {
          setLanguageState(parsed.language as Language);
        }
      }
    } catch {
      // Ignore
    }
  }, [profilePrefsKey, user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      const savedPrefs = localStorage.getItem(profilePrefsKey);
      const parsed = savedPrefs ? JSON.parse(savedPrefs) : {};
      parsed.language = lang;
      localStorage.setItem(profilePrefsKey, JSON.stringify(parsed));
    } catch {
      // Ignore
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
