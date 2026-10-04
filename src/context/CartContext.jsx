import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const KEY = 'mh_cart_v1';
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const clampQty = (n) => Math.max(1, Math.min(999, Math.floor(Number(n) || 1)));

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

function reducer(items, a) {
  switch (a.type) {
    case 'add': {
      const p = a.product;
      const found = items.find((i) => i.productId === p.id);
      if (found) return items.map((i) => (i.productId === p.id ? { ...i, quantity: clampQty(i.quantity + a.qty), price: p.price } : i));
      return [...items, { productId: p.id, name: p.name, price: p.price, unit: p.unit || '', imageUrl: p.imageUrl || '', quantity: clampQty(a.qty) }];
    }
    case 'setQty': return items.map((i) => (i.productId === a.id ? { ...i, quantity: clampQty(a.qty) } : i));
    case 'remove': return items.filter((i) => i.productId !== a.id);
    case 'clear': return [];
    default: return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage full/blocked */ }
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
    addItem: (product, qty = 1) => dispatch({ type: 'add', product, qty }),
    setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
    removeItem: (id) => dispatch({ type: 'remove', id }),
    clear: () => dispatch({ type: 'clear' }),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
