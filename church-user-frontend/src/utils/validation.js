/**
 * VALIDATION UTILITIES
 * Reusable validation functions for forms and data
 */

export const validation = {
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password, minLength = 8) => {
    if (password.length < minLength) return false;
    // At least one uppercase, one lowercase, one number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    return strongRegex.test(password);
  },

  /**
   * Validate phone number
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^\+?1?\d{9,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  },

  /**
   * Validate URL
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate required field
   */
  isRequired: (value) => {
    if (typeof value === "string") return value.trim().length > 0;
    return value !== null && value !== undefined;
  },

  /**
   * Validate min length
   */
  hasMinLength: (value, minLength) => {
    return value && value.length >= minLength;
  },

  /**
   * Validate max length
   */
  hasMaxLength: (value, maxLength) => {
    return !value || value.length <= maxLength;
  },
};

export default validation;
