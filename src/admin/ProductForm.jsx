import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../components/ui';
import ProductImage from '../components/ProductImage';
import { CATEGORIES, UNITS } from '../utils/constants';
import { createProduct, updateProduct } from '../services/products';
import { uploadProductImage } from '../services/imageUpload';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LanguageContext';

export default function ProductForm({ product, onClose, onSaved }) {
  const toast = useToast();
  const { t, tCat, tUnit } = useLang();
  const editing = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    category: product?.category || CATEGORIES[0],
    unit: product?.unit || UNITS[0],
    isAvailable: product?.isAvailable ?? true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(product?.imageUrl || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError(t('errImageType'));
    if (f.size > 2 * 1024 * 1024) return setError(t('errImageSize'));
    setError(''); setFile(f); setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    const price = Number(form.price);
    if (form.name.trim().length < 2) return setError(t('errProductName'));
    if (!Number.isFinite(price) || price < 0 || form.price === '') return setError(t('errPrice'));
    setBusy(true); setError('');
    try {
      let imageUrl = product?.imageUrl || '';
      if (file) imageUrl = await uploadProductImage(file);
      const data = {
        name: form.name.trim(), description: form.description.trim(), price: Math.round(price),
        category: form.category, unit: form.unit, isAvailable: form.isAvailable, imageUrl,
      };
      if (editing) await updateProduct(product.id, data); else await createProduct(data);
      toast.success(editing ? t('productUpdated') : t('productAdded'));
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.message || t('saveFailed'));
    } finally { setBusy(false); }
  };

  return (
    <Modal title={editing ? t('editProduct') : t('addProduct')} onClose={busy ? () => {} : onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="label" htmlFor="pname">{t('name')}</label>
          <input id="pname" className="input" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label" htmlFor="pdesc">{t('description')}</label>
          <textarea id="pdesc" rows={3} className="input" value={form.description} onChange={set('description')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="pprice">{t('priceTZS')}</label>
            <input id="pprice" className="input" inputMode="numeric" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value.replace(/[^\d]/g, '') }))} />
          </div>
          <div>
            <label className="label" htmlFor="punit">{t('unit')}</label>
            <select id="punit" className="input" value={form.unit} onChange={set('unit')}>
              {[...new Set([...UNITS, form.unit])].map((u) => <option key={u} value={u}>{tUnit(u)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="pcat">{t('category')}</label>
          <select id="pcat" className="input" value={form.category} onChange={set('category')}>
            {[...new Set([...CATEGORIES, form.category])].map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pimg">{t('image')}</label>
          <div className="flex items-center gap-3">
            <ProductImage src={preview} alt="Preview" className="h-16 w-16 rounded-lg" />
            <input id="pimg" type="file" accept="image/*" onChange={pickFile} className="text-sm" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="h-4 w-4" checked={form.isAvailable} onChange={set('isAvailable')} /> {t('availableForSale')}
        </label>
        {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-outline" onClick={onClose} disabled={busy}>{t('cancel')}</button>
          <button className="btn-primary" disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} {t('save')}</button>
        </div>
      </form>
    </Modal>
  );
}
