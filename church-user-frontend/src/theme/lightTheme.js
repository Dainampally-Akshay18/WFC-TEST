/**
 * LIGHT THEME CONFIGURATION
 * Premium 2026 professional design
 * Clean, minimal, elegant aesthetic
 */

import { colors } from "./colors";
import { gradients } from "./gradients";
import { glassmorphism } from "./glassmorphism";
import { shadows } from "./shadows";

export const lightTheme = {
  mode: "light",
  colors: colors.light,
  gradients: gradients.light,
  glassmorphism: glassmorphism.light,
  shadows: shadows.light,

  // Component specific configurations
  components: {
    // Card styling
    card: {
      backgroundColor: colors.light.background.secondary,
      borderColor: colors.light.border,
      textColor: colors.light.text.primary,
      borderRadius: "12px",
      padding: "20px",
      ...glassmorphism.light.card,
    },

    // Button styling
    button: {
      primary: {
        background: colors.light.semantic.primary,
        color: "#FFFFFF",
        borderRadius: "8px",
        padding: "10px 24px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: shadows.light.sm,
        hover: {
          background: colors.light.semantic.primaryHover,
          boxShadow: shadows.light.md,
        },
      },
      secondary: {
        background: "transparent",
        color: colors.light.semantic.primary,
        border: `1px solid ${colors.light.border}`,
        borderRadius: "8px",
        padding: "10px 24px",
        hover: {
          background: colors.light.background.hover,
        },
      },
    },

    // Input styling
    input: {
      backgroundColor: colors.light.background.primary,
      borderColor: colors.light.border,
      color: colors.light.text.primary,
      placeholderColor: colors.light.text.muted,
      focusBorder: colors.light.semantic.primary,
      borderRadius: "8px",
      padding: "10px 16px",
    },

    // Navigation styling
    navbar: {
      backgroundColor: colors.light.navbar,
      borderColor: colors.light.border,
      textColor: colors.light.text.light,
      activeColor: colors.light.semantic.primary,
      height: "64px",
    },
  },

  // Design tokens
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "80px",
  },

  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "32px",
    "5xl": "36px",
    "6xl": "48px",
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};
