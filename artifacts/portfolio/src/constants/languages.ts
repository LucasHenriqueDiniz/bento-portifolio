export interface LanguageData {
  name: string;
  level: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  levelLabel: {
    pt: string;
    en: string;
  };
}

export const languages: LanguageData[] = [
  {
    name: 'Português',
    level: 'native',
    levelLabel: {
      pt: 'Nativo',
      en: 'Native',
    },
  },
  {
    name: 'English',
    level: 'fluent',
    levelLabel: {
      pt: 'Fluente',
      en: 'Fluent',
    },
  },
  {
    name: 'Español',
    level: 'intermediate',
    levelLabel: {
      pt: 'Intermediário',
      en: 'Limited Working',
    },
  },
  {
    name: '日本語',
    level: 'basic',
    levelLabel: {
      pt: 'Básico',
      en: 'Basic',
    },
  },
];
