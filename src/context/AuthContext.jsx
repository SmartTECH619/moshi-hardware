import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) { setIsAdmin(false); setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setIsAdmin(snap.exists() && snap.data().role === 'admin');
      } catch { setIsAdmin(false); }
      setLoading(false);
    });
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>{children}</AuthContext.Provider>;
}
