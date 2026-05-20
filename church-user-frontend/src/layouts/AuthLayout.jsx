/**
 * AUTH LAYOUT
 * Layout for authentication pages (login, register, etc.)
 * Glassmorphism design with centered form area
 * Mobile-responsive with full-height centered content
 */

import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeProvider";

const AuthLayout = ({ children }) => {
  const { isDarkMode, colors, glassmorphism, gradients } = useTheme();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: colors.background.primary }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Auth Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        {/* Background gradient effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: gradients.primary,
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        {/* Form Container */}
        <div
          className="relative w-full max-w-md rounded-2xl p-8 md:p-10"
          style={{
            ...glassmorphism.card,
            boxShadow: isDarkMode
              ? `0 20px 60px rgba(176,38,255,0.15), inset 0 1px 1px rgba(255,255,255,0.1)`
              : `0 20px 60px rgba(0,0,0,0.1)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
