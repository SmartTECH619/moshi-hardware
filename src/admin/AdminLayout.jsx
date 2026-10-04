import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const links = [
  { to: '/admin', label: 'navDashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'navProducts', icon: Package },
  { to: '/admin/orders', label: 'navOrders', icon: ClipboardList },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const { t } = useLang();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-slate-900 text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-bold">{t('adminTitle')}</span>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-slate-300 hover:text-white sm:flex"><ExternalLink size={14} /> {t('viewSite')}</a>
            <span className="hidden text-slate-400 md:inline">{user?.email}</span>
            <LanguageSwitcher />
            <button onClick={logout} className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700"><LogOut size={14} /> {t('logout')}</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Icon size={16} /> {t(label)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6"><Outlet /></main>
    </div>
  );
}
