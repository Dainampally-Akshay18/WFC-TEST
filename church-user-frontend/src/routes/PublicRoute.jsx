/**
 * PUBLIC ROUTE
 * Route wrapper for unauthenticated routes
 * Redirects to home if already authenticated
 */

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
