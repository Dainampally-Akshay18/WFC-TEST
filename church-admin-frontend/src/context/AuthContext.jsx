import { createContext, useState, useEffect } from 'react';
import { authService } from '../api/services/auth.service';
import { setToken, setRefreshToken, clearTokens, getToken } from '../api/utils/tokenManager';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getToken();
      if (token) {
        const response = await authService.getMe();
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    setUser(response.data.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
