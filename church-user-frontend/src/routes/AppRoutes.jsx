/**
 * APP ROUTES
 * Central routing configuration for the application
 * Public routes, auth routes, and protected routes
 * Role-based access control
 */

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "../layouts/MainLayout";

// Pages
import LandingPage from "../pages/landing/LandingPage";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/verify-otp"
        element={
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Authenticated User Only */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Placeholder Routes - To be implemented */}
      <Route
        path="/sermons"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#fff" }}>Sermons Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#fff" }}>Blogs Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#fff" }}>Events Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prayers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#fff" }}>Prayers Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#fff" }}>Notifications Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#fff" }}>Profile Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div
            style={{ color: "#fff" }}
            className="flex items-center justify-center h-screen"
          >
            <div className="text-center">
              <h1 className="text-6xl font-bold">404</h1>
              <p className="text-xl mt-4">Page not found</p>
              <a href="/" className="mt-6 inline-block text-purple-500 hover:underline">
                Go back home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

