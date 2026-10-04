import { BUSINESS } from './constants';
import { formatTZS } from './format';

export const waLink = (number, text) => {
  const digits = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const businessWaLink = (text = 'Hello Moshi Hardware, I would like to ask about your products.') =>
  waLink(BUSINESS.whatsapp, text);

const itemsText = (items) => items.map((i) => `${i.name} × ${i.quantity}`).join('\n');

// Message the customer sends to the business after ordering
export function customerOrderMessage(order) {
  return `Hello Moshi Hardware,

I have placed an order.

Order: ${order.orderNumber}

Customer: ${order.customerName}

Products:
${itemsText(order.items)}

Total: ${formatTZS(order.total)}${order.orderType === 'delivery' ? ' (delivery fee to be confirmed)' : ''}

Location: ${order.location}`;
}

// Message the admin sends to the customer
export function adminToCustomerMessage(order) {
  return `Hello ${order.customerName}, this is Moshi Hardware about your order ${order.orderNumber}.`;
}
