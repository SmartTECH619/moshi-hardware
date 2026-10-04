import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { sampleProducts } from '../seed/sampleProducts';

const col = () => collection(db, 'products');

export async function listProducts() {
  const snap = await getDocs(col());
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Sort in the browser (newest first) so no Firestore index is needed
  return items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, 'products', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createProduct(data) {
  return addDoc(col(), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
}

export async function setAvailability(id, isAvailable) {
  return updateDoc(doc(db, 'products', id), { isAvailable, updatedAt: serverTimestamp() });
}

export async function deleteProduct(product) {
  await deleteDoc(doc(db, 'products', product.id));
  if (product.imageUrl) {
    try { await deleteObject(ref(storage, product.imageUrl)); } catch { /* image may already be gone */ }
  }
}

export async function uploadProductImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 2 * 1024 * 1024) throw new Error('Image must be smaller than 2 MB.');
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const r = ref(storage, `products/${Date.now()}_${safe}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function loadSampleProducts() {
  const batch = writeBatch(db);
  sampleProducts.forEach((p) => {
    batch.set(doc(col()), { ...p, imageUrl: '', isAvailable: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
