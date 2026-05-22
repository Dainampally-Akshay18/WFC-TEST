import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { hasMinimumRole } from '../utils/permissions';
import AccessDenied from '../layouts/admin/components/shared/AccessDenied';

const RoleBasedRoute = ({ minimumRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!hasMinimumRole(user, minimumRole)) {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
