import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import AdminLayout from '../layouts/admin/AdminLayout';
import AuthLayout from '../layouts/auth/AuthLayout';
import MinimalLayout from '../layouts/minimal/MinimalLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';

// Dashboard Pages
import DashboardHome from '../pages/dashboard/DashboardHome';

// Error Pages
import NotFound from '../pages/errors/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardHome />} />
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route element={<MinimalLayout />}>
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
