import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  isDark?: boolean;
  className?: string;
}

export function LanguageSwitcher({ isDark = false, className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  // Normalize language code (pt-BR -> pt, en-US -> en)
  const currentLang = i18n.language?.split('-')[0] || 'pt';

  const toggleLanguage = () => {
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
        isDark
          ? 'text-gray-400 border-gray-700 hover:text-gray-200 hover:border-gray-600'
          : 'text-gray-600 border-gray-300 hover:text-gray-900 hover:border-gray-400'
      } ${className}`}
    >
      <Globe size={13} />
      <span>{currentLang === 'pt' ? 'EN' : 'PT'}</span>
    </button>
  );
}
