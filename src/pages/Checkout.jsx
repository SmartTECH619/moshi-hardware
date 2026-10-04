import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { placeOrder } from '../services/orders';
import { normalizeTzPhone } from '../utils/phone';
import { formatTZS } from '../utils/format';

// Defined outside Checkout so inputs keep focus while typing
const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: '', phone: '', location: '', notes: '', orderType: 'delivery' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.customerName.trim().length < 2) e.customerName = 'Please enter your full name.';
    if (!normalizeTzPhone(form.phone)) e.phone = 'Enter a valid Tanzanian number, e.g. 0712345678 or +255712345678.';
    if (form.orderType === 'delivery' && form.location.trim().length < 3) e.location = 'Please enter your delivery location.';
    if (form.location.length > 300) e.location = 'Location is too long.';
    if (form.notes.length > 500) e.notes = 'Notes are too long (max 500 characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const order = await placeOrder({
        customerName: form.customerName.trim(),
        phone: normalizeTzPhone(form.phone),
        location: form.orderType === 'pickup' && !form.location.trim() ? 'Pickup at shop' : form.location.trim(),
        notes: form.notes.trim(),
        orderType: form.orderType,
        cartItems: items,
      });
      sessionStorage.setItem('mh_last_order', JSON.stringify(order));
      clear();
      navigate('/order-success', { replace: true, state: { order } });
    } catch (err) {
      console.error(err);
      const msg = err.message?.startsWith('"') ? err.message : 'We could not place your order. Please check your connection and try again.';
      setSubmitError(msg);
      toast.error('Order not placed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-4 grid gap-5 md:grid-cols-5">
        <form onSubmit={submit} noValidate className="card space-y-4 p-4 md:col-span-3">
          <div className="grid grid-cols-2 gap-2">
            {['delivery', 'pickup'].map((t) => (
              <label key={t} className={`cursor-pointer rounded-lg border p-3 text-center text-sm font-semibold capitalize ${form.orderType === t ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-300'}`}>
                <input type="radio" name="orderType" value={t} checked={form.orderType === t} onChange={set('orderType')} className="sr-only" />
                {t}
              </label>
            ))}
          </div>

          <Field id="name" label="Full name" error={errors.customerName}>
            <input id="name" className="input" autoComplete="name" value={form.customerName} onChange={set('customerName')} />
          </Field>
          <Field id="phone" label="Phone number" error={errors.phone}>
            <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="0712345678" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field id="location" label={form.orderType === 'delivery' ? 'Delivery location / address' : 'Your location (optional)'} error={errors.location}>
            <input id="location" className="input" autoComplete="street-address" value={form.location} onChange={set('location')} />
          </Field>
          <Field id="notes" label="Notes (optional)" error={errors.notes}>
            <textarea id="notes" rows={3} className="input" value={form.notes} onChange={set('notes')} />
          </Field>

          {submitError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError} {submitError.includes('cart') && <Link to="/cart" className="font-semibold underline">Go to cart</Link>}</p>}

          <button type="submit" className="btn-primary w-full py-3 text-base" disabled={submitting}>
            {submitting && <Loader2 size={18} className="animate-spin" />} Place Order
          </button>
        </form>

        <aside className="card h-fit p-4 md:col-span-2">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span>{i.name} × {i.quantity}</span><span className="shrink-0">{formatTZS(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatTZS(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Delivery fee</span><span>{form.orderType === 'delivery' ? 'To be confirmed' : 'None'}</span></div>
            <div className="mt-2 flex justify-between text-base font-bold"><span>Total</span><span>{formatTZS(subtotal)}</span></div>
          </div>
          <p className="mt-3 text-xs text-slate-500">No payment is taken online. We will contact you to confirm your order.</p>
        </aside>
      </div>
    </div>
  );
}
