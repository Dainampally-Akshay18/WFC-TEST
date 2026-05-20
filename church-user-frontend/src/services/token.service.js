/**
 * TOKEN SERVICE
 * Handles JWT token management
 * Extraction, validation, and persistence
 */

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenService = {
  /**
   * Get token from localStorage
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Set token in localStorage
   */
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Remove token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Set refresh token in localStorage
   */
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  /**
   * Remove refresh token from localStorage
   */
  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Decode JWT token and extract claims
   */
  decodeToken: (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%".concat(("00".concat(c.charCodeAt(0).toString(16))).slice(-2)))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode token", error);
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token) => {
    try {
      const decoded = tokenService.decodeToken(token);
      if (!decoded || !decoded.exp) return true;

      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  },

  /**
   * Clear all auth tokens
   */
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
