/**
 * LOCALSTORAGE SERVICE
 * Centralized localStorage management
 * Type-safe and consistent
 */

export const localStorageService = {
  /**
   * Get item from localStorage with JSON parsing
   */
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage with JSON stringify
   */
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear entire localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },

  /**
   * Check if key exists
   */
  hasItem: (key) => {
    return localStorage.getItem(key) !== null;
  },
};
