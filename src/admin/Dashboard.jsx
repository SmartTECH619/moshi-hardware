import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, Clock } from 'lucide-react';
import { listProducts } from '../services/products';
import { listOrders } from '../services/orders';
import { Spinner, ErrorState } from '../components/ui';
import StatusBadge from './StatusBadge';
import { formatDate, formatTZS } from '../utils/format';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setError(''); setData(null);
    try {
      const [products, orders] = await Promise.all([listProducts(), listOrders()]);
      setData({ products, orders });
    } catch (e) { console.error(e); setError('Could not load dashboard data. Check that your account is an admin and the Firestore rules are published.'); }
  };
  useEffect(() => { load(); }, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <Spinner />;

  const pending = data.orders.filter((o) => o.status === 'PENDING').length;
  const stats = [
    { label: 'Total products', value: data.products.length, icon: Package },
    { label: 'Total orders', value: data.orders.length, icon: ClipboardList },
    { label: 'Pending orders', value: pending, icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <span className="rounded-lg bg-brand-50 p-2.5 text-brand-600"><Icon size={22} /></span>
            <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent orders</h2>
        <Link to="/admin/orders" className="text-sm font-semibold text-brand-700">View all</Link>
      </div>
      {data.orders.length === 0 ? <p className="py-8 text-center text-slate-500">No orders yet.</p> : (
        <ul className="card mt-3 divide-y">
          {data.orders.slice(0, 5).map((o) => (
            <li key={o.id}>
              <Link to={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 p-3 hover:bg-slate-50">
                <div>
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="text-sm text-slate-500">{o.customerName} · {formatDate(o.createdAt)}</p>
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
