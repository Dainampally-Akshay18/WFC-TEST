/**
 * AUTH API MODULE
 * Centralized authentication API calls
 * Uses axios instance with automatic token injection
 * Clean, modular, reusable API architecture
 */

import apiClient from "./axios";

const API_ENDPOINTS = {
  SIGNUP: "/auth/signup",
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  GET_CURRENT_USER: "/auth/me",
  UPDATE_PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout", // Implicit logout (just clear local state)
};

/**
 * User Registration
 * POST /api/auth/signup
 */
export const authAPI = {
  signup: async (name, email, password, branch) => {
    const response = await apiClient.post(API_ENDPOINTS.SIGNUP, {
      name,
      email,
      password,
      branch,
    });
    return response;
  },

  /**
   * User Login
   * POST /api/auth/login
   */
  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response;
  },

  /**
   * Initiate Password Recovery
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email) => {
    const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response;
  },

  /**
   * Complete Password Reset with Token
   * POST /api/auth/reset-password/:token
   */
  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.RESET_PASSWORD}/${token}`,
      {
        newPassword,
        confirmPassword,
      }
    );
    return response;
  },

  /**
   * Get Current User Profile
   * GET /api/auth/me
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.GET_CURRENT_USER);
    return response;
  },

  /**
   * Update Current User Profile
   * PUT /api/auth/profile
   */
  updateProfile: async (updateData) => {
    const response = await apiClient.put(
      API_ENDPOINTS.UPDATE_PROFILE,
      updateData
    );
    return response;
  },
};

export default authAPI;
