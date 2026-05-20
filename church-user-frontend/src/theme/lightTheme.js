/**
 * LIGHT THEME CONFIGURATION
 * Elegant soft glassmorphism experience
 * Creates peaceful, calming, modern aesthetic
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
      backgroundColor: colors.light.background.elevated,
      borderColor: colors.light.border.glass,
      textColor: colors.light.text.primary,
      ...glassmorphism.light.card,
    },

    // Button styling
    button: {
      primary: {
        background: gradients.light.button,
        color: "#FFFFFF",
        borderRadius: "12px",
        padding: "10px 24px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: shadows.light.glow,
      },
      secondary: {
        background: "transparent",
        color: colors.light.accent.purple,
        border: `1px solid ${colors.light.border.glass}`,
        borderRadius: "12px",
        padding: "10px 24px",
      },
    },

    // Input styling
    input: {
      backgroundColor: glassmorphism.light.input.background,
      borderColor: colors.light.border.glass,
      color: colors.light.text.primary,
      placeholderColor: colors.light.text.muted,
      ...glassmorphism.light.input,
    },

    // Navigation styling
    navbar: {
      backgroundColor: glassmorphism.light.nav.background,
      borderColor: colors.light.border.glass,
      textColor: colors.light.text.primary,
      activeColor: colors.light.accent.purple,
      ...glassmorphism.light.nav,
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
  },

  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
};
