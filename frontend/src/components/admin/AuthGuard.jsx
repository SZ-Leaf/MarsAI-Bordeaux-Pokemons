import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';


export default function AuthGuard({ children }) {
  const { user, isLoading, initialized } = useAuth();
  if (!initialized || isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
