import { useMemo } from 'react';
import enModule from '@/locales/en/resume.json';
import ptBRModule from '@/locales/pt-BR/resume.json';

type Locale = 'en' | 'pt-BR';

// Garantir que temos os dados corretos
const en = enModule as any;
const ptBR = ptBRModule as any;

const translations: Record<string, any> = {
  en: en,
  'pt-BR': ptBR,
};

/**
 * Simple i18n hook for accessing resume translations
 * @param locale - Current locale ('en' or 'pt-BR')
 * @returns Translation object for the resume
 */
export function useResumeTranslation(locale: Locale = 'en') {
  return useMemo(() => {
    // Fallback chain: requested locale -> en -> empty object
    const t = translations[locale] || translations['en'] || {};
    return t.resume || {};
  }, [locale]);
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Locale[] {
  return ['en', 'pt-BR'];
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    'pt-BR': 'Português (BR)',
  };
  return names[locale];
}
