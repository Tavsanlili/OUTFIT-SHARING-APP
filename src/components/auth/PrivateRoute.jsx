import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Eğer giriş yapıldıysa sayfayı göster (Outlet), yapılmadıysa Login'e at
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;