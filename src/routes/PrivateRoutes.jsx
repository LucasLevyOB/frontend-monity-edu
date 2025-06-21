import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Helpers from '../Helpers';

const PrivateRoutes = () => {
  const isAutenticated = useSelector((state) => state.auth.isAuthenticated);
  const expirationTime = useSelector((state) => state.auth.user?.expirationTime);
  const currentTime = new Date().getTime();
  const isTokenExpired = expirationTime && Helpers.DateHelper.isAfter(currentTime, expirationTime);

  return (
    isAutenticated && !isTokenExpired ? <Outlet /> : <Navigate to='/login' />
  );
};

export default PrivateRoutes;