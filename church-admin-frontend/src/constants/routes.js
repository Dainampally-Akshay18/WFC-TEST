export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_OTP: '/verify-otp',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  ANALYTICS: '/dashboard/analytics',
  REPORTS: '/dashboard/reports',
  
  // User routes
  USERS: '/users',
  USER_DETAILS: '/users/:id',
  USER_CREATE: '/users/create',
  USER_EDIT: '/users/:id/edit',
  USER_APPROVAL: '/users/approval',
  
  // Event routes
  EVENTS: '/events',
  EVENT_DETAILS: '/events/:id',
  EVENT_CREATE: '/events/create',
  EVENT_EDIT: '/events/:id/edit',
  
  // Blog routes
  BLOGS: '/blogs',
  BLOG_DETAILS: '/blogs/:id',
  BLOG_CREATE: '/blogs/create',
  BLOG_EDIT: '/blogs/:id/edit',
  
  // Sermon routes
  SERMONS: '/sermons',
  SERMON_DETAILS: '/sermons/:id',
  SERMON_CREATE: '/sermons/create',
  SERMON_EDIT: '/sermons/:id/edit',
  SERMON_CATEGORIES: '/sermons/categories',
  
  // Prayer routes
  PRAYERS: '/prayers',
  PRAYER_DETAILS: '/prayers/:id',
  PRAYER_CREATE: '/prayers/create',
  PRAYER_MODERATION: '/prayers/moderation',
  
  // Notification routes
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_CENTER: '/notifications/center',
  
  // Branch routes
  BRANCHES: '/branches',
  BRANCH_CREATE: '/branches/create',
  BRANCH_EDIT: '/branches/:id/edit',
  
  // Audit routes
  AUDIT_LOGS: '/audit-logs',
  
  // Settings routes
  SETTINGS: '/settings',
  SETTINGS_GENERAL: '/settings/general',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_SECURITY: '/settings/security',
  
  // Profile routes
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  
  // Error routes
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
};
