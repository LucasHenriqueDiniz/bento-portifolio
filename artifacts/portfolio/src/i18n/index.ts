import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptCommon from './locales/pt/common.json';
import ptHome from './locales/pt/home.json';
import ptResume from './locales/pt/resume.json';
import ptProjects from './locales/pt/projects.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enResume from './locales/en/resume.json';
import enProjects from './locales/en/projects.json';

const resources = {
  pt: {
    common: ptCommon,
    home: ptHome,
    resume: ptResume,
    projects: ptProjects,
  },
  en: {
    common: enCommon,
    home: enHome,
    resume: enResume,
    projects: enProjects,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    ns: ['common', 'home', 'resume', 'projects'],
    defaultNS: 'common',
    react: {
      useSuspense: false,
    },
    returnObjects: true,
  });

export default i18n;
