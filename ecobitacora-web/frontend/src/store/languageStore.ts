import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';
import pt from '@/i18n/pt.json';

type Language = 'es' | 'en' | 'pt';
type Translations = typeof es;

interface LanguageState {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations: Record<Language, Translations> = { es, en, pt };

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'es',
      translations: es,
      setLanguage: (lang: Language) => {
        set({ language: lang, translations: translations[lang] });
      },
      t: (key: string, params?: Record<string, string>) => {
        const keys = key.split('.');
        let value: any = get().translations;
        
        for (const k of keys) {
          value = value?.[k];
        }
        
        if (typeof value === 'string' && params) {
          return Object.entries(params).reduce(
            (str, [key, val]) => str.replace(`{${key}}`, val),
            value
          );
        }
        
        return value || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
