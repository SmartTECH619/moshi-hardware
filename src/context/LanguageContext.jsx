import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, categoryNames, unitNames } from '../i18n/translations';

const KEY = 'mh_lang';
const LanguageContext = createContext(null);
export const useLang = () => useContext(LanguageContext);

// Default language for first-time visitors. Change 'sw' to 'en' to make English the default.
const DEFAULT_LANG = 'sw';

function initial() {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'en' || v === 'sw') return v;
  } catch { /* storage blocked */ }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initial);

  useEffect(() => {
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key, vars = {}) => {
    let s = translations[lang][key] ?? translations.en[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => { s = s.split(`{${k}}`).join(v); });
    return s;
  }, [lang]);

  const value = useMemo(() => ({
    lang, setLang, t,
    tCat: (c) => (lang === 'sw' && categoryNames[c]) || c,
    tUnit: (u) => (lang === 'sw' && unitNames[u]) || u,
  }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
