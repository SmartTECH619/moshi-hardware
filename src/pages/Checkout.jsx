import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LanguageContext';
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
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: '', phone: '', location: '', notes: '', orderType: 'delivery' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState({ message: '', cart: false });

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.customerName.trim().length < 2) e.customerName = t('errName');
    if (!normalizeTzPhone(form.phone)) e.phone = t('errPhone');
    if (form.orderType === 'delivery' && form.location.trim().length < 3) e.location = t('errLocation');
    if (form.location.length > 300) e.location = t('errLocationLong');
    if (form.notes.length > 500) e.notes = t('errNotesLong');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setSubmitError({ message: '', cart: false });
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
      if (err.code === 'PRODUCT_MISSING') setSubmitError({ message: t('errMissing', { name: err.productName }), cart: true });
      else if (err.code === 'PRODUCT_UNAVAILABLE') setSubmitError({ message: t('errUnavailable', { name: err.productName }), cart: true });
      else setSubmitError({ message: t('orderFailed'), cart: false });
      toast.error(t('orderNotPlaced'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold">{t('checkout')}</h1>
      <div className="mt-4 grid gap-5 md:grid-cols-5">
        <form onSubmit={submit} noValidate className="card space-y-4 p-4 md:col-span-3">
          <div className="grid grid-cols-2 gap-2">
            {['delivery', 'pickup'].map((type) => (
              <label key={type} className={`cursor-pointer rounded-lg border p-3 text-center text-sm font-semibold ${form.orderType === type ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-300'}`}>
                <input type="radio" name="orderType" value={type} checked={form.orderType === type} onChange={set('orderType')} className="sr-only" />
                {t(type)}
              </label>
            ))}
          </div>

          <Field id="name" label={t('fullName')} error={errors.customerName}>
            <input id="name" className="input" autoComplete="name" value={form.customerName} onChange={set('customerName')} />
          </Field>
          <Field id="phone" label={t('phoneNumber')} error={errors.phone}>
            <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="0712345678" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field id="location" label={form.orderType === 'delivery' ? t('deliveryLocation') : t('yourLocationOptional')} error={errors.location}>
            <input id="location" className="input" autoComplete="street-address" value={form.location} onChange={set('location')} />
          </Field>
          <Field id="notes" label={t('notesOptional')} error={errors.notes}>
            <textarea id="notes" rows={3} className="input" value={form.notes} onChange={set('notes')} />
          </Field>

          {submitError.message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {submitError.message} {submitError.cart && <Link to="/cart" className="font-semibold underline">{t('goToCart')}</Link>}
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-base" disabled={submitting}>
            {submitting && <Loader2 size={18} className="animate-spin" />} {t('placeOrder')}
          </button>
        </form>

        <aside className="card h-fit p-4 md:col-span-2">
          <h2 className="font-semibold">{t('orderSummary')}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span>{i.name} × {i.quantity}</span><span className="shrink-0">{formatTZS(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t pt-3 text-sm">
            <div className="flex justify-between"><span>{t('subtotal')}</span><span>{formatTZS(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>{t('deliveryFee')}</span><span>{form.orderType === 'delivery' ? t('toBeConfirmed') : t('none')}</span></div>
            <div className="mt-2 flex justify-between text-base font-bold"><span>{t('total')}</span><span>{formatTZS(subtotal)}</span></div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{t('noPaymentNote')}</p>
        </aside>
      </div>
    </div>
  );
}
