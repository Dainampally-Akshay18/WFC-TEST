/**
 * AXIOS INSTANCE
 * Centralized HTTP client with interceptors
 * Handles authentication, errors, and request/response transformation
 */

import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Create axios instance with base config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Adds authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handles errors and token refresh logic
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly for cleaner usage
    return response.data;
  },
  (error) => {
    const { logout } = useAuthStore.getState();

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      logout();
      window.location.href = "/auth/login";
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden", error.response.data);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found", error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error", error.response.data);
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
