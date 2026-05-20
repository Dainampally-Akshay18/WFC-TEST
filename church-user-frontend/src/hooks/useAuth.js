/**
 * USE AUTH HOOK
 * Custom hook for accessing authentication state and actions
 * Simplifies auth store usage throughout the app
 */

import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,

    // Actions
    login,
    logout,
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
    updateUser,
  };
};

export default useAuth;
