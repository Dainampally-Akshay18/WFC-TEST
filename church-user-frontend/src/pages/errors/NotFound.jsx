/**
 * NOT FOUND PAGE (404)
 * Futuristic glassmorphism error page
 * Displayed when user navigates to non-existent route
 */

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const { colors, glassmorphism } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${colors.background.primary}, ${colors.background.secondary})`,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: colors.accent.purple }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: colors.accent.pink, animationDelay: "1s" }}
        />
      </div>

      {/* Content Card */}
      <div
        className="relative max-w-2xl w-full rounded-2xl p-8 md:p-12 text-center"
        style={{
          background: glassmorphism.card.background,
          backdropFilter: glassmorphism.card.backdropFilter,
          border: glassmorphism.card.border,
          boxShadow: glassmorphism.card.boxShadow,
        }}
      >
        {/* 404 Icon */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.purple}20, ${colors.accent.pink}20)`,
              border: `2px solid ${colors.accent.purple}40`,
            }}
          >
            <Search
              className="w-12 h-12"
              style={{ color: colors.accent.purple }}
            />
          </div>

          {/* 404 Text */}
          <h1
            className="text-8xl md:text-9xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Page Not Found
          </h2>
          <p
            className="text-base md:text-lg"
            style={{ color: colors.text.secondary }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: glassmorphism.input.background,
              border: `1px solid ${colors.border.glass}`,
              color: colors.text.primary,
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          {/* Home Button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
              color: colors.text.primary,
              boxShadow: `0 0 20px ${colors.glow.purple}`,
            }}
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Decorative Line */}
        <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${colors.border.glass}` }}>
          <p className="text-sm" style={{ color: colors.text.muted }}>
            Lost in the digital wilderness? We'll guide you back.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
