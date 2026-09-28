import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tAny: <T = unknown>(key: string) => T;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'shayish.lang';
const SUPPORTED: Language[] = ['he', 'ar', 'en', 'ru'];

const readInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'he';
  try {
    // Honor a manual choice the visitor made previously.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED as string[]).includes(stored)) return stored as Language;
  } catch {
    // ignore storage errors (private mode, etc.)
  }
  // Hebrew is the default for every new visitor. We deliberately do NOT read
  // navigator.language — the site should not open in English just because the
  // browser is set to English.
  return 'he';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);
  const dir: 'ltr' | 'rtl' = language === 'en' || language === 'ru' ? 'ltr' : 'rtl';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [language, dir]);

  const resolve = useCallback(
    (path: string): unknown => {
      const keys = path.split('.');
      let current: unknown = translations[language];
      for (const key of keys) {
        if (current === null || typeof current !== 'object' || !(key in (current as Record<string, unknown>))) {
          return undefined;
        }
        current = (current as Record<string, unknown>)[key];
      }
      return current;
    },
    [language]
  );

  const t = useCallback(
    (path: string): string => {
      const value = resolve(path);
      if (value === undefined) {
        if (language !== 'he') {
          // Fallback to Hebrew if translation is missing in the current language.
          let fallback: unknown = translations.he;
          for (const key of path.split('.')) {
            if (fallback === null || typeof fallback !== 'object' || !(key in (fallback as Record<string, unknown>))) {
              return path;
            }
            fallback = (fallback as Record<string, unknown>)[key];
          }
          if (typeof fallback === 'string') return fallback;
        }
        return path;
      }
      return typeof value === 'string' ? value : path;
    },
    [language, resolve]
  );

  const tAny = useCallback(<T,>(path: string): T => {
    const value = resolve(path);
    return (value === undefined ? path : value) as T;
  }, [resolve]);

  const value = useMemo(
    () => ({ language, setLanguage, t, tAny, dir }),
    [language, setLanguage, t, tAny, dir]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
