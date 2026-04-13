import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { TokenStore } from '../../store/auth/tokenStore';

export const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);
  const token = TokenStore.get();

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};