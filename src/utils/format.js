export const formatTZS = (n) => `TZS ${Number(n || 0).toLocaleString('en-US')}`;

export const formatDate = (ts, lang = 'en') => {
  const d = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
  if (!d) return '—';
  return d.toLocaleString(lang === 'sw' ? 'sw-TZ' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
