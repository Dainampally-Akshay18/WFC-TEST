/**
 * TYPOGRAPHY SYSTEM
 * Premium 2026 professional typography
 * Based on Inter font family
 */

export const typography = {
  fontFamily: {
    base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    mono: "'Menlo', 'Monaco', 'Courier New', monospace",
  },

  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
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

  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.75,
  },

  letterSpacing: {
    tighter: "-0.02em",
    tight: "-0.01em",
    normal: "0em",
    wide: "0.01em",
    wider: "0.02em",
  },

  heading: {
    h1: { fontSize: "48px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" },
    h2: { fontSize: "36px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em" },
    h3: { fontSize: "28px", fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: "20px", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "18px", fontWeight: 600, lineHeight: 1.4 },
  },

  body: {
    lg: { fontSize: "18px", fontWeight: 400, lineHeight: 1.6 },
    base: { fontSize: "16px", fontWeight: 400, lineHeight: 1.5 },
    sm: { fontSize: "14px", fontWeight: 400, lineHeight: 1.5 },
    xs: { fontSize: "12px", fontWeight: 400, lineHeight: 1.4 },
  },

  label: {
    base: { fontSize: "14px", fontWeight: 500, lineHeight: 1.4 },
    sm: { fontSize: "12px", fontWeight: 500, lineHeight: 1.3 },
  },

  caption: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.01em",
  },
};
