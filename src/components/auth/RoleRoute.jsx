import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const RoleRoute = ({ allowedRoles }) => {
  const { role, isAuthenticated } = useAuthStore();

  // 1. Giriş yapmamışsa Login'e
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Rolü yetiyorsa sayfayı göster
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // 3. Giriş yapmış ama yetkisi yoksa Ana Sayfaya (veya 403 sayfasına)
  return <Navigate to="/" replace />;
};

export default RoleRoute;