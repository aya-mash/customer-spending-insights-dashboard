import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import af from './locales/af.json';
import xh from './locales/xh.json';
import zu from './locales/zu.json';
import st from './locales/st.json';

const resources = {
  en: { translation: en },
  af: { translation: af },
  xh: { translation: xh },
  zu: { translation: zu },
  st: { translation: st },
};

// Language names for display
export const languages = {
  en: 'English',
  af: 'Afrikaans',
  xh: 'isiXhosa',
//   zu: 'isiZulu',
  st: 'Sesotho',
} as const;

export type LanguageCode = keyof typeof languages;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Save language preference
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
