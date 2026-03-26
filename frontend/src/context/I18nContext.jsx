/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { translations } from '../i18n/translations';

const SUPPORTED_LANGS = ['pt', 'en', 'es', 'de'];

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    return SUPPORTED_LANGS.includes(stored) ? stored : 'pt';
  });

  const t = (key) => {
    const dict = translations[lang] || translations['pt'];
    const fallback = translations['pt'];
    const parts = key.split('.');
    const fromDict = parts.reduce((obj, k) => obj?.[k], dict);
    if (fromDict !== undefined) return fromDict;
    const fromFallback = parts.reduce((obj, k) => obj?.[k], fallback);
    return fromFallback !== undefined ? fromFallback : key;
  };

  const setLanguage = (newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    localStorage.setItem('lang', newLang);
    setLang(newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
