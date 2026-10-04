import { useState } from 'react';
import { Plus, Pencil, Trash2, Database } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { deleteProduct, setAvailability, loadSampleProducts } from '../services/products';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LanguageContext';
import { Spinner, ErrorState, EmptyState, ConfirmDialog } from '../components/ui';
import ProductImage from '../components/ProductImage';
import ProductForm from './ProductForm';
import { formatTZS } from '../utils/format';

export default function AdminProducts() {
  const { products, loading, error, reload } = useProducts();
  const toast = useToast();
  const { t, tCat, tUnit } = useLang();
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try { await deleteProduct(toDelete); toast.success(t('productDeleted')); setToDelete(null); reload(); }
    catch (e) { console.error(e); toast.error(t('deleteFailed')); }
    finally { setBusy(false); }
  };

  const toggle = async (p) => {
    try { await setAvailability(p.id, !p.isAvailable); reload(); }
    catch (e) { console.error(e); toast.error(t('availabilityFailed')); }
  };

  const seed = async () => {
    setBusy(true);
    try { await loadSampleProducts(); toast.success(t('sampleAdded')); reload(); }
    catch (e) { console.error(e); toast.error(t('sampleFailed')); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('navProducts')}</h1>
        <button className="btn-primary" onClick={() => setEditing('new')}><Plus size={16} /> {t('addProduct')}</button>
      </div>

      {loading ? <Spinner label={t('loading')} /> : error ? <ErrorState message={t('loadProductsError')} retryLabel={t('tryAgain')} onRetry={reload} /> : products.length === 0 ? (
        <EmptyState title={t('noProductsAdmin')} text={t('noProductsAdminText')}>
          <button className="btn-outline" onClick={seed} disabled={busy}><Database size={16} /> {t('loadSample')}</button>
        </EmptyState>
      ) : (
        <ul className="card mt-4 divide-y">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              <ProductImage src={p.imageUrl} alt={p.name} className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">{tCat(p.category)} · {formatTZS(p.price)} / {tUnit(p.unit)}</p>
                <button onClick={() => toggle(p)} className={`mt-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.isAvailable ? t('available') : t('unavailable')}
                </button>
              </div>
              <button className="p-2 text-slate-600 hover:text-brand-700" onClick={() => setEditing(p)} aria-label={t('editItem', { name: p.name })}><Pencil size={18} /></button>
              <button className="p-2 text-slate-600 hover:text-red-600" onClick={() => setToDelete(p)} aria-label={t('deleteItem', { name: p.name })}><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}

      {editing && <ProductForm product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
      <ConfirmDialog open={Boolean(toDelete)} danger busy={busy} title={t('deleteProductTitle')} confirmLabel={t('delete')} cancelLabel={t('cancel')}
        message={toDelete ? t('deleteProductMsg', { name: toDelete.name }) : ''} onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
