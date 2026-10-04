import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Spinner, ErrorState, EmptyState } from '../components/ui';
import { CATEGORIES } from '../utils/constants';
import { useLang } from '../context/LanguageContext';

export default function Shop() {
  const { products, loading, error, reload } = useProducts();
  const { t, tCat } = useLang();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };

  // Show the standard categories plus any extra ones that exist on products
  const categories = useMemo(() => [...new Set([...CATEGORIES, ...products.map((p) => p.category).filter(Boolean)])], [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) =>
      (!category || p.category === category) &&
      (!term || p.name?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term)));
  }, [products, q, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">{t('shop')}</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
          <input className="input pl-10" type="search" placeholder={t('searchPlaceholder')} value={q} onChange={(e) => setParam('q', e.target.value)} />
        </div>
        <select className="input sm:w-56" value={category} onChange={(e) => setParam('category', e.target.value)} aria-label={t('allCategories')}>
          <option value="">{t('allCategories')}</option>
          {categories.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
        </select>
      </div>

      {loading ? <Spinner label={t('loading')} /> : error ? <ErrorState message={t('loadProductsError')} retryLabel={t('tryAgain')} onRetry={reload} /> : filtered.length === 0 ? (
        <EmptyState title={t('noProducts')} text={products.length === 0 ? t('noProductsYet') : t('tryDifferent')}>
          {(q || category) && <button className="btn-outline" onClick={() => setParams({}, { replace: true })}>{t('clearFilters')}</button>}
        </EmptyState>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
