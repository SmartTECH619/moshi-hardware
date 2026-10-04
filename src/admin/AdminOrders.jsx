import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders } from '../services/orders';
import { Spinner, ErrorState, EmptyState } from '../components/ui';
import StatusBadge from './StatusBadge';
import { ORDER_STATUSES } from '../utils/constants';
import { formatDate, formatTZS } from '../utils/format';

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const load = async () => {
    setError(''); setOrders(null);
    try { setOrders(await listOrders()); } catch (e) { console.error(e); setError('Could not load orders.'); }
  };
  useEffect(() => { load(); }, []);

  const shown = useMemo(() => (orders || []).filter((o) => !filter || o.status === filter), [orders, filter]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!orders) return <Spinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select className="input w-44" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {shown.length === 0 ? <EmptyState title="No orders" text={filter ? 'No orders with this status.' : 'Orders will appear here when customers place them.'} /> : (
        <>
          {/* Desktop table */}
          <div className="card mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>{['Order', 'Customer', 'Phone', 'Total', 'Type', 'Status', 'Date'].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {shown.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2"><Link to={`/admin/orders/${o.id}`} className="font-semibold text-brand-700">{o.orderNumber}</Link></td>
                    <td className="px-3 py-2">{o.customerName}</td>
                    <td className="px-3 py-2">{o.phone}</td>
                    <td className="px-3 py-2">{formatTZS(o.total)}</td>
                    <td className="px-3 py-2 capitalize">{o.orderType}</td>
                    <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
                    <td className="px-3 py-2 text-slate-500">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <ul className="mt-4 space-y-3 md:hidden">
            {shown.map((o) => (
              <li key={o.id}>
                <Link to={`/admin/orders/${o.id}`} className="card block p-3">
                  <div className="flex justify-between"><span className="font-semibold">{o.orderNumber}</span><StatusBadge status={o.status} /></div>
                  <p className="mt-1 text-sm">{o.customerName} · {o.phone}</p>
                  <p className="text-sm text-slate-500"><span className="capitalize">{o.orderType}</span> · {formatDate(o.createdAt)}</p>
                  <p className="mt-1 font-bold">{formatTZS(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
