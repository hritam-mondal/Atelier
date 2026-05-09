import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/account';

interface Props {
  children: React.ReactNode;
  /** Optional role gate. Admin can access everything. */
  role?: UserRole;
}

export function RequireAuth({ children, role }: Props) {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.signedIn) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (role && state.role !== role && state.role !== 'admin') {
    return <Navigate to="/learning" replace />;
  }

  return <>{children}</>;
}
