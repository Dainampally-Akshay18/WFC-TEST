/**
 * TYPOGRAPHY SYSTEM
 * Consistent font sizes, weights, and line heights
 */

export const typography = {
  fontFamily: {
    base: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    mono: "'Courier New', 'Monaco', monospace",
  },

  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
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
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Predefined text styles
  heading: {
    h1: {
      fontSize: "36px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "30px",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.4,
    },
  },

  body: {
    lg: {
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    base: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    sm: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    xs: {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },

  caption: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.01em",
  },
};
