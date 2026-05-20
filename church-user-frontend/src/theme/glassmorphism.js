/**
 * GLASSMORPHISM EFFECTS
 * Reusable frosted glass presets for consistent UI aesthetic
 * Maintains premium futuristic spiritual design
 */

export const glassmorphism = {
  // Dark mode glass effects
  dark: {
    card: {
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    },
    cardHover: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(25px)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 12px 48px rgba(176,38,255,0.15)",
    },
    nav: {
      background: "rgba(5,1,10,0.7)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    },
    modal: {
      background: "rgba(18,5,31,0.9)",
      backdropFilter: "blur(30px)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    },
    input: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255,255,255,0.2)",
    },
  },

  // Light mode glass effects
  light: {
    card: {
      background: "rgba(255,255,255,0.45)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    },
    cardHover: {
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(25px)",
      border: "1px solid rgba(255,255,255,0.5)",
      boxShadow: "0 12px 48px rgba(139,92,246,0.12)",
    },
    nav: {
      background: "rgba(248,245,255,0.8)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    },
    modal: {
      background: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(30px)",
      border: "1px solid rgba(255,255,255,0.5)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    },
    input: {
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255,255,255,0.3)",
    },
  },
};
