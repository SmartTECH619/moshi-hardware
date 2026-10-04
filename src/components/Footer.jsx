import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { BUSINESS } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">Moshi Hardware</p>
          <p className="mt-1 text-sm">Building materials and tools, delivered across Tanzania.</p>
        </div>
        <div className="space-y-1 text-sm">
          {BUSINESS.phone && <p className="flex items-center gap-2"><Phone size={15} /> {BUSINESS.phone}</p>}
          <p className="flex items-center gap-2"><MapPin size={15} /> {BUSINESS.location}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link to="/shop" className="hover:text-white">Shop</Link>
          <Link to="/cart" className="hover:text-white">Cart</Link>
        </div>
      </div>
      <div className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Moshi Hardware. All rights reserved.
      </div>
    </footer>
  );
}
