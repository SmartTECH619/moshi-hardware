import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { getProduct } from '../services/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LanguageContext';
import ProductImage from '../components/ProductImage';
import { Spinner, ErrorState, EmptyState } from '../components/ui';
import { formatTZS } from '../utils/format';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();
  const { t, tCat, tUnit } = useLang();
  const [product, setProduct] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | missing | error
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let alive = true;
    setState('loading');
    getProduct(id)
      .then((p) => { if (!alive) return; setProduct(p); setState(p ? 'ok' : 'missing'); })
      .catch((e) => { console.error(e); if (alive) setState('error'); });
    return () => { alive = false; };
  }, [id]);

  if (state === 'loading') return <Spinner label={t('loading')} />;
  if (state === 'error') return <ErrorState message={t('loadProductError')} retryLabel={t('tryAgain')} onRetry={() => navigate(0)} />;
  if (state === 'missing') return <EmptyState title={t('productNotFound')}><Link to="/shop" className="btn-primary">{t('back')}</Link></EmptyState>;

  const change = (n) => setQty((q) => Math.max(1, Math.min(999, q + n)));
  const add = () => {
    if (!product.isAvailable) return;
    addItem(product, qty);
    toast.success(t('addedQtyToCart', { qty, name: product.name }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand-700"><ArrowLeft size={16} /> {t('back')}</Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <ProductImage src={product.imageUrl} alt={product.name} className="aspect-square w-full rounded-xl" />
        <div>
          <p className="text-sm text-slate-500">{tCat(product.category)}</p>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-extrabold text-brand-700">{formatTZS(product.price)} <span className="text-sm font-normal text-slate-500">{t('perUnit', { unit: tUnit(product.unit) })}</span></p>
          <p className={`mt-1 text-sm font-medium ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>{product.isAvailable ? t('available') : t('currentlyUnavailable')}</p>
          <p className="mt-4 whitespace-pre-line text-slate-600">{product.description || t('noDescription')}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-300 bg-white">
              <button className="p-3" onClick={() => change(-1)} aria-label={t('decreaseQty')} disabled={!product.isAvailable}><Minus size={16} /></button>
              <input className="w-14 border-0 text-center focus:outline-none" inputMode="numeric" value={qty} disabled={!product.isAvailable}
                onChange={(e) => setQty(Math.max(1, Math.min(999, parseInt(e.target.value, 10) || 1)))} aria-label={t('quantity')} />
              <button className="p-3" onClick={() => change(1)} aria-label={t('increaseQty')} disabled={!product.isAvailable}><Plus size={16} /></button>
            </div>
            <button className="btn-primary flex-1 py-3" onClick={add} disabled={!product.isAvailable}>
              <ShoppingCart size={18} /> {product.isAvailable ? t('addToCart') : t('unavailable')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
