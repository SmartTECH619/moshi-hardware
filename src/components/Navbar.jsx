import { Link, NavLink } from 'react-router-dom';
import { Hammer, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { count } = useCart();
  const { t } = useLang();
  const link = ({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white"><Hammer size={18} /></span>
          Moshi Hardware
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <NavLink to="/" end className={(s) => `hidden sm:inline ${link(s)}`}>{t('home')}</NavLink>
          <NavLink to="/shop" className={link}>{t('shop')}</NavLink>
          <NavLink to="/cart" className="relative flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1.5 text-sm font-semibold text-brand-700" aria-label={t('cart')}>
            <ShoppingCart size={18} /> <span className="hidden sm:inline">{t('cart')}</span>
            {count > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-xs text-white">{count}</span>}
          </NavLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
