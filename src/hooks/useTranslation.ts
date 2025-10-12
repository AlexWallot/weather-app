import { useState, useEffect } from 'react';
import frTranslations from '../locales/fr.json';
import enTranslations from '../locales/en.json';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: any;
}

const translations: { [key in Language]: Translations } = {
  fr: frTranslations,
  en: enTranslations
};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [t, setT] = useState<Translations>(translations.fr);

  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('weather-app-language', newLanguage);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('weather-app-language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const getNestedTranslation = (keys: string[]): string => {
    let current: any = t;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return keys.join('.');
      }
    }
    return typeof current === 'string' ? current : keys.join('.');
  };

  const translate = (key: string): string => {
    const keys = key.split('.');
    return getNestedTranslation(keys);
  };

  return {
    t: translate,
    language,
    changeLanguage,
    isLoading: Object.keys(t).length === 0
  };
};
