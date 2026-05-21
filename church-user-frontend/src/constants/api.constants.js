/**
 * API CONSTANTS
 * Centralized API endpoint definitions
 * Prevents hardcoded URLs in application code
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // AUTH ENDPOINTS
  AUTH: {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  },

  // USER ENDPOINTS
  USER: {
    GET_PROFILE: `${BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
    GET_ALL: `${BASE_URL}/users`,
    GET_ONE: (id) => `${BASE_URL}/users/${id}`,
  },

  // SERMON ENDPOINTS
  SERMON: {
    GET_ALL: `${BASE_URL}/sermons`,
    GET_ONE: (id) => `${BASE_URL}/sermons/${id}`,
    CREATE: `${BASE_URL}/sermons`,
    UPDATE: (id) => `${BASE_URL}/sermons/${id}`,
    DELETE: (id) => `${BASE_URL}/sermons/${id}`,
    PUBLISH: (id) => `${BASE_URL}/sermons/${id}/publish`,
    UNPUBLISH: (id) => `${BASE_URL}/sermons/${id}/unpublish`,
    GET_CATEGORIES: `${BASE_URL}/sermons/categories`,
    CREATE_CATEGORY: `${BASE_URL}/sermons/categories`,
    UPDATE_CATEGORY: (id) => `${BASE_URL}/sermons/categories/${id}`,
    DELETE_CATEGORY: (id) => `${BASE_URL}/sermons/categories/${id}`,
  },

  // BLOG ENDPOINTS
  BLOG: {
    GET_ALL: `${BASE_URL}/blogs`,
    GET_ONE: (id) => `${BASE_URL}/blogs/${id}`,
    CREATE: `${BASE_URL}/blogs`,
    UPDATE: (id) => `${BASE_URL}/blogs/${id}`,
    DELETE: (id) => `${BASE_URL}/blogs/${id}`,
    SEARCH: `${BASE_URL}/blogs/search`,
    GET_BY_TAG: (tag) => `${BASE_URL}/blogs/tags/${tag}`,
  },

  // EVENT ENDPOINTS
  EVENT: {
    GET_ALL: `${BASE_URL}/events`,
    GET_ONE: (id) => `${BASE_URL}/events/${id}`,
    CREATE: `${BASE_URL}/events`,
    UPDATE: (id) => `${BASE_URL}/events/${id}`,
    DELETE: (id) => `${BASE_URL}/events/${id}`,
    GET_BY_BRANCH: (branch) => `${BASE_URL}/events/branch/${branch}`,
  },

  // PRAYER ENDPOINTS
  PRAYER: {
    GET_ALL: `${BASE_URL}/prayers`,
    GET_ONE: (id) => `${BASE_URL}/prayers/${id}`,
    CREATE: `${BASE_URL}/prayers`,
    UPDATE: (id) => `${BASE_URL}/prayers/${id}`,
    DELETE: (id) => `${BASE_URL}/prayers/${id}`,
    GET_MY_PRAYERS: `${BASE_URL}/prayers/my-prayers`,
  },

  // NOTIFICATION ENDPOINTS
  NOTIFICATION: {
    GET_ALL: `${BASE_URL}/notifications`,
    GET_ONE: (id) => `${BASE_URL}/notifications/${id}`,
    MARK_READ: (id) => `${BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${BASE_URL}/notifications/read-all`,
    DELETE: (id) => `${BASE_URL}/notifications/${id}`,
  },

  // AUDIT ENDPOINTS
  AUDIT: {
    GET_ALL: `${BASE_URL}/audit`,
    GET_ONE: (id) => `${BASE_URL}/audit/${id}`,
  },
};

export default API_ENDPOINTS;
