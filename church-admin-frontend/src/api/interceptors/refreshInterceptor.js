import { clearTokens } from '../utils/tokenManager';

export const refreshInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 and not already retried, clear tokens and redirect to login
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        clearTokens();
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};
