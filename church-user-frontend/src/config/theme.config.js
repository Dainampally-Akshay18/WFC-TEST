/**
 * THEME CONFIG
 * Design system configuration — Single Light Theme
 */

export const themeConfig = {
  colors: {
    light: {
      background: "#F5F9FF",
      surface: "#FFFFFF",
      surfaceHigh: "#FFFFFF",
      primary: "#2563EB",
      secondary: "#3B82F6",
      accent: "#0EA5E9",
      text: "#0F172A",
      textSecondary: "#64748B",
      textMuted: "#94A3B8",
    },
  },

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

  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },

  transition: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },
};

export default themeConfig;
