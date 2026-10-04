import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';

export default function ProtectedRoute() {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (!isAdmin) {
    return (
      <div className="mx-auto mt-16 max-w-sm px-4 text-center">
        <h1 className="text-xl font-bold">Not authorised</h1>
        <p className="mt-2 text-sm text-slate-600">This account is not an admin account.</p>
        <button className="btn-outline mt-4" onClick={logout}>Sign out</button>
      </div>
    );
  }
  return <Outlet />;
}
