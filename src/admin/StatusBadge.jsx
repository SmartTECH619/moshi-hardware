import { STATUS_STYLES } from '../utils/constants';
import { useLang } from '../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { t } = useLang();
  const key = `status_${status}`;
  const label = t(key);
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700'}`}>{label === key ? status : label}</span>;
}
