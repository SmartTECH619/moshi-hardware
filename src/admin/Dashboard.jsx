import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, Clock } from 'lucide-react';
import { listProducts } from '../services/products';
import { listOrders } from '../services/orders';
import { useLang } from '../context/LanguageContext';
import { Spinner, ErrorState } from '../components/ui';
import StatusBadge from './StatusBadge';
import { formatDate, formatTZS } from '../utils/format';

export default function Dashboard() {
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const load = async () => {
    setError(false); setData(null);
    try {
      const [products, orders] = await Promise.all([listProducts(), listOrders()]);
      setData({ products, orders });
    } catch (e) { console.error(e); setError(true); }
  };
  useEffect(() => { load(); }, []);

  if (error) return <ErrorState message={t('loadDashboardError')} retryLabel={t('tryAgain')} onRetry={load} />;
  if (!data) return <Spinner label={t('loading')} />;

  const pending = data.orders.filter((o) => o.status === 'PENDING').length;
  const stats = [
    { label: t('totalProducts'), value: data.products.length, icon: Package },
    { label: t('totalOrders'), value: data.orders.length, icon: ClipboardList },
    { label: t('pendingOrders'), value: pending, icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('navDashboard')}</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <span className="rounded-lg bg-brand-50 p-2.5 text-brand-600"><Icon size={22} /></span>
            <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('recentOrders')}</h2>
        <Link to="/admin/orders" className="text-sm font-semibold text-brand-700">{t('viewAll')}</Link>
      </div>
      {data.orders.length === 0 ? <p className="py-8 text-center text-slate-500">{t('noOrdersYet')}</p> : (
        <ul className="card mt-3 divide-y">
          {data.orders.slice(0, 5).map((o) => (
            <li key={o.id}>
              <Link to={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 p-3 hover:bg-slate-50">
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-sm text-slate-500">{o.customerName} · {formatDate(o.createdAt, lang)}</p>
                </div>
                <div className="text-right"><p className="text-sm font-semibold">{formatTZS(o.total)}</p><StatusBadge status={o.status} /></div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
