import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
  const isAutenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    isAutenticated ? <Outlet /> : <Navigate to='/login' />
  );
};

export default PrivateRoutes;