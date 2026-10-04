import { MessageCircle } from 'lucide-react';
import { BUSINESS } from '../utils/constants';
import { businessWaLink } from '../utils/whatsapp';
import { useLang } from '../context/LanguageContext';

// Floating button shown on customer pages. Hidden if the WhatsApp number is not configured.
export default function WhatsAppFloat() {
  const { t } = useLang();
  if (!BUSINESS.whatsapp) return null;
  return (
    <a href={businessWaLink(t('waGreeting'))} target="_blank" rel="noopener noreferrer" aria-label={t('chatWhatsApp')}
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600">
      <MessageCircle size={26} />
    </a>
  );
}
