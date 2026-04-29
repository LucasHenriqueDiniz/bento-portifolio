import { useMemo } from 'react';
import enModule from '@/locales/en/resume.json';
import ptBRModule from '@/locales/pt-BR/resume.json';

// Debug: verificar estrutura dos imports
console.log('[i18n] EN module:', enModule);
console.log('[i18n] PT-BR module:', ptBRModule);

type Locale = 'en' | 'pt-BR';

const translations = {
  en: enModule,
  'pt-BR': ptBRModule,
};

/**
 * Simple i18n hook for accessing resume translations
 * @param locale - Current locale ('en' or 'pt-BR')
 * @returns Translation object for the resume
 */
export function useResumeTranslation(locale: Locale = 'en') {
  return useMemo(() => {
    console.log('[i18n] Requested locale:', locale);
    console.log('[i18n] Available:', Object.keys(translations));
    console.log('[i18n] Has translation:', !!translations[locale]);
    
    const t = translations[locale] || translations['en'];
    if (!t || !t.resume) {
      console.warn(`[i18n] Translation not found for locale: ${locale}`);
      return translations['en']?.resume || {};
    }
    return t.resume;
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
