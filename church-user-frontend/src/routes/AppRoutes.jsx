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
import Blogs from "../pages/blogs/Blogs";
import BlogDetails from "../pages/blogs/BlogDetails";
import Events from "../pages/events/Events";
import EventDetails from "../pages/events/EventDetails";
import Sermons from "../pages/sermons/Sermons";
import SermonDetails from "../pages/sermons/SermonDetails";
import WatchSermon from "../pages/sermons/WatchSermon";
import SermonCategory from "../pages/sermons/SermonCategory";
import Prayers from "../pages/prayers/Prayers";
import PrayerDetails from "../pages/prayers/PrayerDetails";
import CreatePrayer from "../pages/prayers/CreatePrayer";
import MyPrayers from "../pages/prayers/MyPrayers";
import Notifications from "../pages/notifications/Notifications";
import NotificationDetails from "../pages/notifications/NotificationDetails";
import WaitApproval from "../pages/wait-approval/WaitApproval";
import NotFound from "../pages/errors/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Wait Approval Route - Authenticated but not approved */}
      <Route path="/wait-approval" element={<WaitApproval />} />

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
              <Sermons />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sermons/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SermonDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sermons/watch/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WatchSermon />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sermons/category"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SermonCategory />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Blogs />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/:slug"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BlogDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Events />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EventDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prayers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Prayers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prayers/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PrayerDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prayers/create"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreatePrayer />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prayers/my-prayers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyPrayers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Notifications />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ color: "#0F172A" }}>Profile Page - Coming Soon</div>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

