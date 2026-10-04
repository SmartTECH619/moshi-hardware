import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { BUSINESS } from '../utils/constants';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-12 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">Moshi Hardware</p>
          <p className="mt-1 text-sm">{t('footerTagline')}</p>
        </div>
        <div className="space-y-1 text-sm">
          {BUSINESS.phone && <p className="flex items-center gap-2"><Phone size={15} /> {BUSINESS.phone}</p>}
          <p className="flex items-center gap-2"><MapPin size={15} /> {BUSINESS.location}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link to="/shop" className="hover:text-white">{t('shop')}</Link>
          <Link to="/cart" className="hover:text-white">{t('cart')}</Link>
        </div>
      </div>
      <div className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Moshi Hardware. {t('rights')}
      </div>
    </footer>
  );
}
