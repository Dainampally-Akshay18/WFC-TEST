/**
 * PROTECTED ROUTE COMPONENT
 * Route guard for authenticated routes
 * Redirects to login if not authenticated
 * Redirects to wait-approval if user is not approved
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user is approved (case-insensitive)
  if (user?.status?.toUpperCase() !== "APPROVED") {
    return <Navigate to="/wait-approval" replace />;
  }

  return children;
};

export default ProtectedRoute;
