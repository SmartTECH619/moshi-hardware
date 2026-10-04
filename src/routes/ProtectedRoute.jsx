import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Spinner } from '../components/ui';

export default function ProtectedRoute() {
  const { user, isAdmin, loading, logout } = useAuth();
  const { t } = useLang();
  const location = useLocation();

  if (loading) return <Spinner label={t('loading')} />;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (!isAdmin) {
    return (
      <div className="mx-auto mt-16 max-w-sm px-4 text-center">
        <h1 className="text-xl font-bold">{t('notAuthorised')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('notAdminText')}</p>
        <button className="btn-outline mt-4" onClick={logout}>{t('signOut')}</button>
      </div>
    );
  }
  return <Outlet />;
}
