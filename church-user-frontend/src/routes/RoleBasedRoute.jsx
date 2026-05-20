/**
 * ROLE BASED ROUTE
 * Route wrapper for role-based access control
 * Redirects to unauthorized if user lacks required role
 */

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const RoleBasedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/errors/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
