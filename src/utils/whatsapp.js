import { BUSINESS } from './constants';
import { formatTZS } from './format';

export const waLink = (number, text) => {
  const digits = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const businessWaLink = (text = 'Hello Moshi Hardware, I would like to ask about your products.') =>
  waLink(BUSINESS.whatsapp, text);

const itemsText = (items) => items.map((i) => `${i.name} × ${i.quantity}`).join('\n');

// Message the customer sends to the business after ordering (English or Swahili)
export function customerOrderMessage(order, lang = 'en') {
  const delivery = order.orderType === 'delivery';
  if (lang === 'sw') {
    return `Habari Moshi Hardware,

Nimeweka oda.

Oda: ${order.orderNumber}

Mteja: ${order.customerName}

Bidhaa:
${itemsText(order.items)}

Jumla: ${formatTZS(order.total)}${delivery ? ' (gharama ya usafirishaji itathibitishwa)' : ''}

Eneo: ${order.location}`;
  }
  return `Hello Moshi Hardware,

I have placed an order.

Order: ${order.orderNumber}

Customer: ${order.customerName}

Products:
${itemsText(order.items)}

Total: ${formatTZS(order.total)}${delivery ? ' (delivery fee to be confirmed)' : ''}

Location: ${order.location}`;
}

// Message the admin sends to the customer
export function adminToCustomerMessage(order, lang = 'en') {
  if (lang === 'sw') return `Habari ${order.customerName}, huyu ni Moshi Hardware kuhusu oda yako ${order.orderNumber}.`;
  return `Hello ${order.customerName}, this is Moshi Hardware about your order ${order.orderNumber}.`;
}
