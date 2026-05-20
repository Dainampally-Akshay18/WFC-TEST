/**
 * CENTRALIZED COLOR PALETTE
 * Single source of truth for all theme colors
 * Supports both dark and light modes
 */

export const colors = {
  // DARK MODE
  dark: {
    // Backgrounds
    background: {
      primary: "#05010A",
      secondary: "#12051F",
      elevated: "#1A0B2E",
    },
    // Text
    text: {
      primary: "#FFFFFF",
      secondary: "#B8B8C5",
      muted: "#7E7E94",
    },
    // Accents
    accent: {
      purple: "#B026FF",
      pink: "#FF2CDF",
      blue: "#3B82FF",
    },
    // Borders
    border: {
      glass: "rgba(255,255,255,0.1)",
      active: "rgba(176,38,255,0.5)",
    },
    // Glows
    glow: {
      purple: "rgba(176,38,255,0.35)",
      pink: "rgba(255,44,223,0.25)",
      blue: "rgba(59,130,255,0.2)",
    },
  },

  // LIGHT MODE
  light: {
    // Backgrounds
    background: {
      primary: "#F8F5FF",
      secondary: "#EFE7FF",
      elevated: "#FFFFFF",
    },
    // Text
    text: {
      primary: "#2E1065",
      secondary: "#5B4B7A",
      muted: "#8E8AA5",
    },
    // Accents
    accent: {
      purple: "#6D28D9",
      violet: "#8B5CF6",
      pink: "#D946EF",
      blue: "#60A5FA",
    },
    // Borders
    border: {
      glass: "rgba(109,40,217,0.15)",
      active: "rgba(109,40,217,0.35)",
    },
    // Glows
    glow: {
      purple: "rgba(139,92,246,0.18)",
      pink: "rgba(217,70,239,0.15)",
      blue: "rgba(96,165,250,0.12)",
    },
  },
};
