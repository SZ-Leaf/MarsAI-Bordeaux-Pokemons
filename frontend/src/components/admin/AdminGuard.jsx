import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

/**
 * Redirige vers / si l'utilisateur n'est pas connecté ou n'a pas le rôle admin (2 ou 3).
 */
export default function AdminGuard({ children }) {
  const { user, isLoading, initialized } = useAuth();
  const userData = user?.data ?? user;
  const isAdmin = userData && [2, 3].includes(Number(userData.role_id));

  if (!initialized || isLoading) {
    return <p style={{ color: 'var(--color-white)', padding: '1rem' }}>Chargement...</p>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
