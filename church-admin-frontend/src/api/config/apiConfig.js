export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  EVENTS: '/events',
  BLOGS: '/blogs',
  SERMONS: '/sermons',
  PRAYERS: '/prayers',
  NOTIFICATIONS: '/notifications',
  BRANCHES: '/branches',
  DASHBOARD: '/dashboard',
  AUDIT: '/audit',
  UPLOAD: '/upload',
};
