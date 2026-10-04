import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';
import { EmptyState, ConfirmDialog } from '../components/ui';
import { formatTZS } from '../utils/format';

export default function Cart() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (items.length === 0) {
    return (
      <EmptyState icon={ShoppingCart} title="Your cart is empty" text="Add some products to get started.">
        <Link to="/shop" className="btn-primary">Browse products</Link>
      </EmptyState>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your cart</h1>
        <button className="text-sm font-medium text-red-600" onClick={() => setConfirmClear(true)}>Clear cart</button>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.productId} className="card flex gap-3 p-3">
            <ProductImage src={i.imageUrl} alt={i.name} className="h-20 w-20 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between gap-2">
                <div>
                  <Link to={`/product/${i.productId}`} className="font-semibold leading-snug">{i.name}</Link>
                  <p className="text-sm text-slate-500">{formatTZS(i.price)} / {i.unit}</p>
                </div>
                <button onClick={() => removeItem(i.productId)} aria-label={`Remove ${i.name}`} className="self-start p-1 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button className="p-2" onClick={() => setQty(i.productId, i.quantity - 1)} disabled={i.quantity <= 1} aria-label="Decrease"><Minus size={14} /></button>
                  <span className="w-10 text-center text-sm font-medium">{i.quantity}</span>
                  <button className="p-2" onClick={() => setQty(i.productId, i.quantity + 1)} aria-label="Increase"><Plus size={14} /></button>
                </div>
                <p className="font-bold">{formatTZS(i.price * i.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="card mt-5 p-4">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatTZS(subtotal)}</span></div>
        <div className="mt-1 flex justify-between text-sm text-slate-500"><span>Delivery fee</span><span>To be confirmed</span></div>
        <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{formatTZS(subtotal)}</span></div>
        <Link to="/checkout" className="btn-primary mt-4 w-full py-3 text-base">Proceed to Checkout</Link>
        <Link to="/shop" className="btn-outline mt-2 w-full">Continue Shopping</Link>
      </div>

      <ConfirmDialog open={confirmClear} danger title="Clear cart?" message="All items will be removed from your cart."
        confirmLabel="Clear cart" onCancel={() => setConfirmClear(false)} onConfirm={() => { clear(); setConfirmClear(false); }} />
    </div>
  );
}
