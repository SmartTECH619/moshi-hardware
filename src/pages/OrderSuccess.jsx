import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { formatTZS } from '../utils/format';
import { BUSINESS } from '../utils/constants';
import { businessWaLink, customerOrderMessage } from '../utils/whatsapp';
import { EmptyState } from '../components/ui';

export default function OrderSuccess() {
  const { state } = useLocation();
  let order = state?.order;
  if (!order) {
    try { order = JSON.parse(sessionStorage.getItem('mh_last_order')); } catch { order = null; }
  }
  if (!order) {
    return <EmptyState title="No recent order"><Link to="/shop" className="btn-primary">Go to shop</Link></EmptyState>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-500" />
        <h1 className="mt-3 text-2xl font-bold">Order Submitted Successfully</h1>
        <p className="mt-1 text-sm text-slate-500">We will contact you to confirm your order.</p>
      </div>

      <div className="card mt-6 space-y-3 p-4 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Order number</span><span className="font-bold">{order.orderNumber}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Customer</span><span>{order.customerName}</span></div>
        <ul className="space-y-1 border-t pt-3">
          {order.items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2"><span>{i.name} × {i.quantity}</span><span>{formatTZS(i.price * i.quantity)}</span></li>
          ))}
        </ul>
        {order.orderType === 'delivery' && <div className="flex justify-between text-slate-500"><span>Delivery fee</span><span>To be confirmed</span></div>}
        <div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{formatTZS(order.total)}</span></div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to="/shop" className="btn-outline flex-1 py-3">Continue Shopping</Link>
        {BUSINESS.whatsapp ? (
          <a href={businessWaLink(customerOrderMessage(order))} target="_blank" rel="noopener noreferrer" className="btn-green flex-1 py-3">
            <MessageCircle size={18} /> Contact Moshi Hardware on WhatsApp
          </a>
        ) : (
          <p className="flex-1 text-center text-xs text-amber-700">WhatsApp number not configured (VITE_WHATSAPP_NUMBER).</p>
        )}
      </div>
    </div>
  );
}
