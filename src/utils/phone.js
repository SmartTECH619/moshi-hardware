// Accepts 0712345678, 255712345678, +255712345678 (spaces and dashes ignored).
// Tanzanian mobile numbers start with 6 or 7 after the country code.
const clean = (v) => String(v || '').replace(/[\s-]/g, '');

export function normalizeTzPhone(value) {
  const v = clean(value);
  let m = v.match(/^\+?255([67]\d{8})$/);
  if (m) return `+255${m[1]}`;
  m = v.match(/^0([67]\d{8})$/);
  if (m) return `+255${m[1]}`;
  return null;
}

export const isValidTzPhone = (value) => normalizeTzPhone(value) !== null;
