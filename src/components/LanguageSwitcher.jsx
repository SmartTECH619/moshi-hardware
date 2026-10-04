import { useLang } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="flex overflow-hidden rounded-lg border border-slate-300 text-xs font-bold" role="group" aria-label={t('language')}>
      {['sw', 'en'].map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`px-2 py-1.5 uppercase ${lang === l ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}>{l}</button>
      ))}
    </div>
  );
}
