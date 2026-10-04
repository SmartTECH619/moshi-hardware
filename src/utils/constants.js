export const CATEGORIES = ['Cement', 'Paint', 'Plumbing', 'Electrical', 'Tools', 'Roofing', 'Building Materials'];
export const UNITS = ['bag', 'piece', 'sheet', 'metre', 'roll', 'litre', 'tin', 'kg', 'box', 'bundle', 'set'];
export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'];
export const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  READY: 'bg-teal-100 text-teal-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
export const BUSINESS = {
  name: 'Moshi Hardware',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  phone: import.meta.env.VITE_CONTACT_PHONE || '',
  location: import.meta.env.VITE_CONTACT_LOCATION || 'Tanzania',
};
