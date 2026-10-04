import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui';
import { useLang } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLang();
  return <EmptyState title={t('pageNotFound')} text={t('pageNotFoundText')}><Link to="/" className="btn-primary">{t('goHome')}</Link></EmptyState>;
}
