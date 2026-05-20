/**
 * DARK THEME CONFIGURATION
 * Cinematic futuristic spiritual experience
 * Primary design for immersive, premium feel
 */

import { colors } from "./colors";
import { gradients } from "./gradients";
import { glassmorphism } from "./glassmorphism";
import { shadows } from "./shadows";

export const darkTheme = {
  mode: "dark",
  colors: colors.dark,
  gradients: gradients.dark,
  glassmorphism: glassmorphism.dark,
  shadows: shadows.dark,

  // Component specific configurations
  components: {
    // Card styling
    card: {
      backgroundColor: colors.dark.background.secondary,
      borderColor: colors.dark.border.glass,
      textColor: colors.dark.text.primary,
      ...glassmorphism.dark.card,
    },

    // Button styling
    button: {
      primary: {
        background: gradients.dark.button,
        color: colors.dark.text.primary,
        borderRadius: "12px",
        padding: "10px 24px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: shadows.dark.glow,
      },
      secondary: {
        background: "transparent",
        color: colors.dark.accent.purple,
        border: `1px solid ${colors.dark.border.glass}`,
        borderRadius: "12px",
        padding: "10px 24px",
      },
    },

    // Input styling
    input: {
      backgroundColor: glassmorphism.dark.input.background,
      borderColor: colors.dark.border.glass,
      color: colors.dark.text.primary,
      placeholderColor: colors.dark.text.muted,
      ...glassmorphism.dark.input,
    },

    // Navigation styling
    navbar: {
      backgroundColor: glassmorphism.dark.nav.background,
      borderColor: colors.dark.border.glass,
      textColor: colors.dark.text.primary,
      activeColor: colors.dark.accent.purple,
      ...glassmorphism.dark.nav,
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
