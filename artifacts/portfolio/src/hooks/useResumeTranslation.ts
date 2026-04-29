import { useMemo } from 'react';
import { en, ptBR } from '@/locales';

type Locale = 'en' | 'pt-BR';

const translations = {
  en: en,
  'pt-BR': ptBR,
};

/**
 * Simple i18n hook for accessing resume translations
 * @param locale - Current locale ('en' or 'pt-BR')
 * @returns Translation object for the resume
 */
export function useResumeTranslation(locale: Locale = 'en') {
  return useMemo(() => translations[locale].resume, [locale]);
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
