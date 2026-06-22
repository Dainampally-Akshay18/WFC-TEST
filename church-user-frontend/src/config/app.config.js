/**
 * APP CONFIG
 * Application-wide configuration
 */

export const appConfig = {
  // App metadata
  app: {
    name: "WFC Platform",
    version: "1.0.0",
    description: "Church Community Platform",
  },

  // API configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  },

  // Authentication
  auth: {
    tokenKey: "auth_token",
    refreshTokenKey: "refresh_token",
    tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    defaultPage: 1,
    maxPageSize: 100,
  },

  // Cache settings
  cache: {
    queryStaleTime: 5 * 60 * 1000, // 5 minutes
    queryGcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  },

  // Feature flags
  features: {
    darkMode: false,
    notifications: true,
    prayers: true,
  },

  // Validation
  validation: {
    minPasswordLength: 8,
    maxNameLength: 50,
    maxEmailLength: 100,
  },
};

export default appConfig;
