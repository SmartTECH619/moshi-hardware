import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppButton';
import { ConfigWarning } from './ui';
import { isFirebaseConfigured } from '../firebase/config';

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{isFirebaseConfigured ? <Outlet /> : <ConfigWarning />}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
