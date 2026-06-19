'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Lang, TranslationKey } from '@/lib/translations';

// Any DB object that may have translations
interface Translatable {
  name: string;
  description?: string;
  translations?: {
    hi?: { name?: string; description?: string } | null;
  } | null;
}

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKey;
  /** Returns the translated field value for a DB object, falls back to English */
  localize: (item: Translatable, field?: 'name' | 'description') => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
  localize: (item) => item.name,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'hi') setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('lang', l);
  }

  function localize(item: Translatable, field: 'name' | 'description' = 'name'): string {
    if (lang === 'en') return item[field] ?? '';
    const translated = item.translations?.[lang]?.[field];
    // Fall back to English if no translation exists
    return translated?.trim() ? translated : (item[field] ?? '');
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], localize }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
