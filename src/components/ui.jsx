import { Loader2, AlertTriangle, PackageOpen, X } from 'lucide-react';

export const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
    <Loader2 className="animate-spin" size={22} /> <span>{label}</span>
  </div>
);

export const EmptyState = ({ title, text, children, icon: Icon = PackageOpen }) => (
  <div className="flex flex-col items-center px-4 py-14 text-center">
    <Icon size={44} className="text-slate-300" />
    <h3 className="mt-3 text-lg font-semibold text-slate-700">{title}</h3>
    {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
    {children && <div className="mt-4">{children}</div>}
  </div>
);

export const ErrorState = ({ message, onRetry, retryLabel = 'Try again' }) => (
  <div className="flex flex-col items-center px-4 py-14 text-center">
    <AlertTriangle size={44} className="text-red-400" />
    <p className="mt-3 max-w-sm text-sm text-slate-600">{message}</p>
    {onRetry && <button className="btn-outline mt-4" onClick={onRetry}>{retryLabel}</button>}
  </div>
);

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, busy, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-outline" onClick={onCancel} disabled={busy}>{cancelLabel}</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}{confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" role="dialog" aria-modal="true">
    <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose} aria-label="Close"><X size={22} /></button>
      </div>
      {children}
    </div>
  </div>
);

export const ConfigWarning = () => (
  <div className="mx-auto my-10 max-w-lg rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
    <p className="font-semibold">Firebase is not configured yet.</p>
    <p className="mt-1">Copy <code>.env.example</code> to <code>.env</code>, fill in your Firebase values, then restart <code>npm run dev</code>. See the README.</p>
  </div>
);
