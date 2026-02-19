import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationFR from './locales/fr.json';
import translationDE from './locales/de.json';
import translationZH from './locales/zh.json';

const resources = {
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  zh: {
    translation: translationZH
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "ru", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;