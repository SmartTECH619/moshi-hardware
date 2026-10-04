import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Hammer, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { isFirebaseConfigured } from '../firebase/config';
import { ConfigWarning } from '../components/ui';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function AdminLogin() {
  const { user, isAdmin, loading, login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isFirebaseConfigured) return <ConfigWarning />;
  if (!loading && user && isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error(err);
      const wrongCreds = ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(err.code);
      setError(wrongCreds ? t('errLogin') : t('errLoginOther', { code: err.code || err.message }));
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="absolute right-4 top-4"><LanguageSwitcher /></div>
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-6">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white"><Hammer /></span>
          <h1 className="mt-3 text-xl font-bold">{t('adminLogin')}</h1>
          <p className="text-sm text-slate-500">Moshi Hardware</p>
        </div>
        <div>
          <label htmlFor="email" className="label">{t('email')}</label>
          <input id="email" type="email" className="input" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="label">{t('password')}</label>
          <input id="password" type="password" className="input" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full py-3" disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} {t('signIn')}</button>
      </form>
    </div>
  );
}
