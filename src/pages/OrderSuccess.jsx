import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { formatTZS } from '../utils/format';
import { BUSINESS } from '../utils/constants';
import { businessWaLink, customerOrderMessage } from '../utils/whatsapp';
import { useLang } from '../context/LanguageContext';
import { EmptyState } from '../components/ui';

export default function OrderSuccess() {
  const { state } = useLocation();
  const { t, lang } = useLang();
  let order = state?.order;
  if (!order) {
    try { order = JSON.parse(sessionStorage.getItem('mh_last_order')); } catch { order = null; }
  }
  if (!order) {
    return <EmptyState title={t('noRecentOrder')}><Link to="/shop" className="btn-primary">{t('goToShop')}</Link></EmptyState>;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-500" />
        <h1 className="mt-3 text-2xl font-bold">{t('orderSubmitted')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('orderSubmittedText')}</p>
      </div>

      <div className="card mt-6 space-y-3 p-4 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">{t('orderNumber')}</span><span className="font-bold">{order.orderNumber}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">{t('customer')}</span><span>{order.customerName}</span></div>
        <ul className="space-y-1 border-t pt-3">
          {order.items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2"><span>{i.name} × {i.quantity}</span><span>{formatTZS(i.price * i.quantity)}</span></li>
          ))}
        </ul>
        {order.orderType === 'delivery' && <div className="flex justify-between text-slate-500"><span>{t('deliveryFee')}</span><span>{t('toBeConfirmed')}</span></div>}
        <div className="flex justify-between border-t pt-3 text-base font-bold"><span>{t('total')}</span><span>{formatTZS(order.total)}</span></div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to="/shop" className="btn-outline flex-1 py-3">{t('continueShopping')}</Link>
        {BUSINESS.whatsapp ? (
          <a href={businessWaLink(customerOrderMessage(order, lang))} target="_blank" rel="noopener noreferrer" className="btn-green flex-1 py-3">
            <MessageCircle size={18} /> {t('contactWhatsAppBtn')}
          </a>
        ) : (
          <p className="flex-1 text-center text-xs text-amber-700">{t('waNotConfigured')}</p>
        )}
      </div>
    </div>
  );
}
