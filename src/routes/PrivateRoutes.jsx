import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Helpers from '../Helpers';

const PrivateRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userType = useSelector((state) => state.auth.user?.userType);
  const expirationTime = useSelector((state) => state.auth.user?.expirationTime);
  const currentTime = new Date().getTime();
  const isTokenExpired = expirationTime && Helpers.DateHelper.isAfter(currentTime, expirationTime);

  const location = useLocation();

  if (!isAuthenticated || isTokenExpired) {
    return <Navigate to="/login" />;
  }

  if (location.pathname === "/" && userType === "MONITOR") {
    return <Navigate to="/monitor" />;
  }

  if (location.pathname === "/" && userType === "ALUNO") {
    return <Navigate to="/aluno" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;