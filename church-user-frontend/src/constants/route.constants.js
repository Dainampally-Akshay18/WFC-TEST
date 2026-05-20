/**
 * ROUTE CONSTANTS
 * Centralized route path definitions
 * Prevents hardcoded paths in application code
 */

export const ROUTES = {
  // PUBLIC ROUTES
  PUBLIC: {
    HOME: "/",
  },

  // AUTH ROUTES
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
  },

  // PROTECTED ROUTES
  HOME: "/",

  // SERMON ROUTES
  SERMON: {
    ROOT: "/sermons",
    LIST: "/sermons",
    DETAILS: (id) => `/sermons/${id}`,
    CATEGORY: (category) => `/sermons/category/${category}`,
    WATCH: (id) => `/sermons/${id}/watch`,
  },

  // BLOG ROUTES
  BLOG: {
    ROOT: "/blogs",
    LIST: "/blogs",
    DETAILS: (id) => `/blogs/${id}`,
    SEARCH: "/blogs/search",
    TAG: (tag) => `/blogs/tag/${tag}`,
  },

  // EVENT ROUTES
  EVENT: {
    ROOT: "/events",
    LIST: "/events",
    DETAILS: (id) => `/events/${id}`,
    UPCOMING: "/events/upcoming",
    BRANCH: (branch) => `/events/branch/${branch}`,
  },

  // PRAYER ROUTES
  PRAYER: {
    ROOT: "/prayers",
    LIST: "/prayers",
    DETAILS: (id) => `/prayers/${id}`,
    CREATE: "/prayers/create",
    MY_PRAYERS: "/prayers/my-prayers",
  },

  // NOTIFICATION ROUTES
  NOTIFICATION: {
    ROOT: "/notifications",
    LIST: "/notifications",
    DETAILS: (id) => `/notifications/${id}`,
  },

  // PROFILE ROUTES
  PROFILE: {
    ROOT: "/profile",
    VIEW: "/profile",
    EDIT: "/profile/edit",
    CHANGE_PASSWORD: "/profile/change-password",
    SETTINGS: "/profile/settings",
  },

  // ACTIVITY ROUTES
  ACTIVITY: {
    ROOT: "/activity",
    PRAYER: "/activity/prayer",
    EVENT: "/activity/event",
    NOTIFICATION: "/activity/notification",
  },

  // ERROR ROUTES
  ERROR: {
    NOT_FOUND: "/errors/not-found",
    UNAUTHORIZED: "/errors/unauthorized",
    SERVER_ERROR: "/errors/server-error",
  },

  // DASHBOARD ROUTES
  DASHBOARD: "/dashboard",
};

export default ROUTES;
