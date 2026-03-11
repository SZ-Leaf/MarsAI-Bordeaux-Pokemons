import { useAuth } from './useAuth';
import { useNavigate } from 'react-router';
export const useLogout = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();              
    } catch (error) {
      console.error('Error logging out:', error);
    }
    finally {
      user = null;          
      isLoading = false;
      navigate('/login');
    }
  };
  return { handleLogout, isLoading };
};