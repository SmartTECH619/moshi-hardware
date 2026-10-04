import { useCallback, useEffect, useState } from 'react';
import { listProducts } from '../services/products';
import { isFirebaseConfigured } from '../firebase/config';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    setLoading(true); setError('');
    try { setProducts(await listProducts()); }
    catch (e) { console.error(e); setError('Could not load products. Check your internet connection and try again.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { products, loading, error, reload: load };
}
