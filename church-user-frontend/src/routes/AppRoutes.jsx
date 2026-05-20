/**
 * APP ROUTES
 * Central route configuration
 * Handles all application routes with proper guards
 */

import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleBasedRoute from "./RoleBasedRoute";

// Page imports (will be implemented later)
// For now, we just have placeholders

export const AppRoutes = () => {
  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Auth Module</h1>
                <p className="mt-2 text-gray-600">
                  Auth routes will be implemented here
                </p>
              </div>
            </div>
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />

      {/* 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/errors/not-found" replace />} />
    </Routes>
  );
};

export default AppRoutes;
