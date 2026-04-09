import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { jwtDecode } from 'jwt-decode';

export const PrivateRoute = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if ((decoded.exp ?? 0) * 1000 < Date.now()) {
      logout();
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Token inválido:", error);
    logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
