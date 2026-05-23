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

// Admin Placeholder Pages
import UserList from '../pages/users/UserList';
import EventList from '../pages/events/EventList';
import BlogList from '../pages/blogs/BlogList';
import SermonList from '../pages/sermons/SermonList';
import PrayerList from '../pages/prayers/PrayerList';
import NotificationList from '../pages/notifications/NotificationList';
import AuditLogs from '../pages/audit-logs/AuditLogs';
import GeneralSettings from '../pages/settings/GeneralSettings';

// Error Pages
import NotFound from '../pages/errors/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* ─── Public / Auth Routes ─── */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
          </Route>
        </Route>

        {/* ─── Protected / Admin Routes ─── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Dashboard */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardHome />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/admin/dashboard" element={<DashboardHome />} />

            {/* Users */}
            <Route path={ROUTES.USERS} element={<UserList />} />
            <Route path="/admin/users" element={<UserList />} />

            {/* Events */}
            <Route path={ROUTES.EVENTS} element={<EventList />} />
            <Route path="/admin/events" element={<EventList />} />

            {/* Blogs */}
            <Route path={ROUTES.BLOGS} element={<BlogList />} />
            <Route path="/admin/blogs" element={<BlogList />} />

            {/* Sermons */}
            <Route path={ROUTES.SERMONS} element={<SermonList />} />
            <Route path="/admin/sermons" element={<SermonList />} />

            {/* Prayers */}
            <Route path={ROUTES.PRAYERS} element={<PrayerList />} />
            <Route path="/admin/prayers" element={<PrayerList />} />

            {/* Notifications */}
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationList />} />
            <Route path="/admin/notifications" element={<NotificationList />} />

            {/* Audit Logs */}
            <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogs />} />
            <Route path="/admin/audits" element={<AuditLogs />} />
            <Route path="/admin/audits/:id" element={<AuditLogs />} />

            {/* Settings */}
            <Route path={ROUTES.SETTINGS} element={<GeneralSettings />} />
            <Route path={ROUTES.SETTINGS_GENERAL} element={<GeneralSettings />} />
            <Route path="/admin/settings" element={<GeneralSettings />} />
          </Route>
        </Route>

        {/* ─── Error / Fallback Routes ─── */}
        <Route element={<MinimalLayout />}>
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
