import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, BadgeDollarSign, MessageCircle, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Spinner, ErrorState } from '../components/ui';
import { CATEGORIES, BUSINESS } from '../utils/constants';
import { businessWaLink } from '../utils/whatsapp';

const WHY = [
  { icon: BadgeDollarSign, title: 'Fair prices', text: 'Clear prices in TZS, no surprises.' },
  { icon: ShieldCheck, title: 'Quality materials', text: 'Trusted brands for lasting work.' },
  { icon: Truck, title: 'Delivery or pickup', text: 'We deliver to your site, or you collect.' },
];

export default function Home() {
  const { products, loading, error, reload } = useProducts();
  const featured = products.filter((p) => p.isAvailable).slice(0, 4);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
          <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">Everything you need to build, delivered.</h1>
          <p className="mt-3 max-w-lg text-brand-100">Cement, roofing, paint, plumbing, electrical and tools. Order online and we will confirm with you.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-brand-700 hover:bg-brand-50">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold">Shop by category</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-brand-500 hover:text-brand-700">{c}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">Featured products</h2>
          <Link to="/shop" className="text-sm font-semibold text-brand-700">View all</Link>
        </div>
        {loading ? <Spinner /> : error ? <ErrorState message={error} onRetry={reload} /> : featured.length === 0 ? (
          <p className="py-10 text-center text-slate-500">Products will appear here soon.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <h2 className="text-xl font-bold">Why choose us</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {WHY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card flex items-start gap-3 p-4">
              <span className="rounded-lg bg-brand-50 p-2 text-brand-600"><Icon size={22} /></span>
              <div><p className="font-semibold">{title}</p><p className="text-sm text-slate-500">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm">
            <h2 className="text-xl font-bold">Contact us</h2>
            {BUSINESS.phone && <p className="flex items-center gap-2"><Phone size={16} className="text-brand-600" /> {BUSINESS.phone}</p>}
            <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-600" /> {BUSINESS.location}</p>
          </div>
          {BUSINESS.whatsapp && (
            <a href={businessWaLink()} target="_blank" rel="noopener noreferrer" className="btn-green">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          )}
        </div>
      </section>
    </>
  );
}
