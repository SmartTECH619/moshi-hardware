import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui';

export default function NotFound() {
  return <EmptyState title="Page not found" text="The page you are looking for does not exist."><Link to="/" className="btn-primary">Go home</Link></EmptyState>;
}
