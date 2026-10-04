import { ImageOff } from 'lucide-react';

export default function ProductImage({ src, alt, className = '' }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        <ImageOff size={32} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}
