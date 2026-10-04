import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ProductImage from './ProductImage';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatTZS } from '../utils/format';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();
  const available = product.isAvailable;

  const add = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link to={`/product/${product.id}`} className="relative block">
        <ProductImage src={product.imageUrl} alt={product.name} className="aspect-square w-full" />
        {!available && <span className="absolute left-2 top-2 rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-white">Unavailable</span>}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs text-slate-500">{product.category}</p>
        <Link to={`/product/${product.id}`} className="line-clamp-2 font-semibold leading-snug hover:text-brand-700">{product.name}</Link>
        <p className="mt-1 font-bold text-brand-700">{formatTZS(product.price)} <span className="text-xs font-normal text-slate-500">/ {product.unit}</span></p>
        <p className={`text-xs ${available ? 'text-green-600' : 'text-red-600'}`}>{available ? 'In stock' : 'Out of stock'}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link to={`/product/${product.id}`} className="btn-outline px-2 text-xs sm:text-sm">Details</Link>
          <button className="btn-primary px-2 text-xs sm:text-sm" onClick={add} disabled={!available}>
            <ShoppingCart size={15} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
