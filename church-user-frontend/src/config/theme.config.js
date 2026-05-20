/**
 * THEME CONFIG
 * Tailwind and design system configuration
 */

export const themeConfig = {
  // Color palette
  colors: {
    dark: {
      background: "#05010A",
      surface: "#12051F",
      surfaceHigh: "#1A0B2E",
      primary: "#B026FF",
      secondary: "#FF2CDF",
      accent: "#3B82FF",
      text: "#FFFFFF",
      textSecondary: "#B8B8C5",
      textMuted: "#7E7E94",
    },
    light: {
      background: "#F8F5FF",
      surface: "#FFFFFF",
      surfaceHigh: "#FFFFFF",
      primary: "#6D28D9",
      secondary: "#8B5CF6",
      accent: "#60A5FA",
      text: "#2E1065",
      textSecondary: "#5B4B7A",
      textMuted: "#8E8AA5",
    },
  },

  // Spacing scale
  spacing: {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
    8: "32px",
    12: "48px",
    16: "64px",
  },

  // Border radius
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },

  // Transitions
  transition: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },
};

export default themeConfig;
