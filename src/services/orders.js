import {
  collection, doc, getDoc, getDocs, runTransaction, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const pad = (n, l = 2) => String(n).padStart(l, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

/**
 * Creates an order with a sequential number like MH-20261004-001.
 * Uses a small counter document inside a transaction so two customers never get the same number.
 * Prices are re-read from Firestore so a stale cart cannot submit an old price.
 */
export async function placeOrder({ customerName, phone, location, notes, orderType, cartItems }) {
  // 1. Check every product is still available and use the current price
  const items = [];
  for (const ci of cartItems) {
    const snap = await getDoc(doc(db, 'products', ci.productId));
    if (!snap.exists()) throw Object.assign(new Error('missing'), { code: 'PRODUCT_MISSING', productName: ci.name });
    const p = snap.data();
    if (!p.isAvailable) throw Object.assign(new Error('unavailable'), { code: 'PRODUCT_UNAVAILABLE', productName: p.name });
    items.push({ productId: snap.id, name: p.name, price: p.price, unit: p.unit || '', quantity: ci.quantity });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // 2. Number + save in one transaction
  const key = dayKey();
  const counterRef = doc(db, 'counters', key);
  return runTransaction(db, async (tx) => {
    const c = await tx.get(counterRef);
    const next = c.exists() ? c.data().count + 1 : 1;
    const orderNumber = `MH-${key}-${pad(next, 3)}`;
    tx.set(counterRef, { count: next });
    tx.set(doc(db, 'orders', orderNumber), {
      orderNumber, customerName, phone, location, notes, orderType, items,
      subtotal, deliveryFee: 0, total: subtotal, status: 'PENDING', createdAt: serverTimestamp(),
    });
    // createdAt is a server timestamp, so return a local date for the success page
    return { orderNumber, customerName, phone, location, notes, orderType, items, subtotal, deliveryFee: 0, total: subtotal, status: 'PENDING' };
  });
}

export async function listOrders() {
  const snap = await getDocs(collection(db, 'orders'));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function getOrder(id) {
  const snap = await getDoc(doc(db, 'orders', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export const updateOrderStatus = (id, status) => updateDoc(doc(db, 'orders', id), { status });

// Admin confirms the delivery cost by hand
export const updateDeliveryFee = (id, deliveryFee, subtotal) =>
  updateDoc(doc(db, 'orders', id), { deliveryFee, total: subtotal + deliveryFee });
