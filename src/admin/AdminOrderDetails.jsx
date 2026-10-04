import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { getOrder, updateOrderStatus, updateDeliveryFee } from '../services/orders';
import { useToast } from '../context/ToastContext';
import { Spinner, ErrorState, EmptyState } from '../components/ui';
import StatusBadge from './StatusBadge';
import { ORDER_STATUSES } from '../utils/constants';
import { formatDate, formatTZS } from '../utils/format';
import { waLink, adminToCustomerMessage } from '../utils/whatsapp';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState('loading');
  const [fee, setFee] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setState('loading');
    try {
      const o = await getOrder(id);
      setOrder(o); setFee(o ? String(o.deliveryFee || 0) : ''); setState(o ? 'ok' : 'missing');
    } catch (e) { console.error(e); setState('error'); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (state === 'loading') return <Spinner />;
  if (state === 'error') return <ErrorState message="Could not load this order." onRetry={load} />;
  if (state === 'missing') return <EmptyState title="Order not found"><Link to="/admin/orders" className="btn-primary">Back to orders</Link></EmptyState>;

  const changeStatus = async (status) => {
    setSaving(true);
    try { await updateOrderStatus(order.id, status); setOrder((o) => ({ ...o, status })); toast.success(`Status changed to ${status}`); }
    catch (e) { console.error(e); toast.error('Could not update status'); }
    finally { setSaving(false); }
  };

  const saveFee = async () => {
    const n = Math.max(0, Math.round(Number(fee) || 0));
    setSaving(true);
    try { await updateDeliveryFee(order.id, n, order.subtotal); setOrder((o) => ({ ...o, deliveryFee: n, total: o.subtotal + n })); setFee(String(n)); toast.success('Delivery fee saved'); }
    catch (e) { console.error(e); toast.error('Could not save delivery fee'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-slate-600"><ArrowLeft size={16} /> Orders</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-slate-500">{formatDate(order.createdAt)} · <span className="capitalize">{order.orderType}</span></p>

      <div className="card mt-4 p-4">
        <h2 className="font-semibold">Customer</h2>
        <dl className="mt-2 space-y-1 text-sm">
          <div><dt className="inline text-slate-500">Name: </dt><dd className="inline">{order.customerName}</dd></div>
          <div><dt className="inline text-slate-500">Phone: </dt><dd className="inline">{order.phone}</dd></div>
          <div><dt className="inline text-slate-500">Location: </dt><dd className="inline">{order.location}</dd></div>
          <div><dt className="inline text-slate-500">Notes: </dt><dd className="inline">{order.notes || '—'}</dd></div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${order.phone}`} className="btn-outline"><Phone size={16} /> Call Customer</a>
          <a href={waLink(order.phone, adminToCustomerMessage(order))} target="_blank" rel="noopener noreferrer" className="btn-green"><MessageCircle size={16} /> WhatsApp Customer</a>
        </div>
      </div>

      <div className="card mt-4 p-4">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-2 divide-y text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-2 py-2">
              <span>{i.name} <span className="text-slate-500">× {i.quantity} @ {formatTZS(i.price)}</span></span>
              <span className="shrink-0 font-medium">{formatTZS(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatTZS(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span>{order.deliveryFee ? formatTZS(order.deliveryFee) : order.orderType === 'delivery' ? 'To be confirmed' : 'None'}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatTZS(order.total)}</span></div>
        </div>
        {order.orderType === 'delivery' && (
          <div className="mt-4 flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="fee" className="label">Confirm delivery fee (TZS)</label>
              <input id="fee" className="input" inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value.replace(/\D/g, ''))} />
            </div>
            <button className="btn-primary" onClick={saveFee} disabled={saving}>Save</button>
          </div>
        )}
      </div>

      <div className="card mt-4 p-4">
        <h2 className="font-semibold">Change status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button key={s} disabled={saving || s === order.status} onClick={() => changeStatus(s)}
              className={s === order.status ? 'btn bg-slate-800 text-white' : 'btn-outline'}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
