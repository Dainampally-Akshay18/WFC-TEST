/**
 * NAVBAR COMPONENT
 * Premium minimal navigation bar with glassmorphism
 * Sticky top bar with theme toggle
 * Mobile-responsive with hamburger menu
 * 
 * Z-index: z-40 (below overlay, above sidebar on desktop)
 * Height: py-3 (mobile) / py-4 (desktop) for consistent sizing
 */

import { useTheme } from "../context/ThemeProvider";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { Sun, Moon, Menu, X } from "lucide-react";

const Navbar = () => {
  const { isDarkMode, toggleTheme, colors, glassmorphism, shadows } = useTheme();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuth();

  const navStyle = {
    background: glassmorphism.nav.background,
    border: `1px solid ${glassmorphism.nav.border}`,
    backdropFilter: glassmorphism.nav.backdropFilter,
    boxShadow: shadows.md,
  };

  return (
    <nav 
      style={navStyle} 
      className="sticky top-0 z-40 w-full px-4 py-3 md:px-6 md:py-4"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* LEFT: Logo and Menu Toggle */}
        <div className="flex items-center gap-3 md:gap-6">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 transition-colors duration-200 md:hidden"
              style={{
                color: colors.text.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode 
                  ? "rgba(255,255,255,0.1)" 
                  : "rgba(109,40,217,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Logo and Church Name */}
          <div className="flex flex-col items-start gap-0">
            <div className="text-lg md:text-2xl font-bold">
              <span
                key={`wfc-logo-${isDarkMode}`}
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.pink})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                  minWidth: "100%",
                }}
              >
                WFC
              </span>
            </div>
            <span
              className="hidden md:block text-xs font-medium"
              style={{ color: colors.text.secondary }}
            >
              Community Platform
            </span>
          </div>
        </div>

        {/* RIGHT: Theme Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2.5 md:p-3 transition-all duration-200 group"
            style={{
              color: colors.text.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? "rgba(255,255,255,0.1)" 
                : "rgba(109,40,217,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Toggle dark mode"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <Sun
                className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:rotate-12"
                style={{
                  color: colors.accent.blue,
                  filter: `drop-shadow(0 0 8px ${colors.glow.blue})`,
                }}
              />
            ) : (
              <Moon
                className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:rotate-12"
                style={{
                  color: colors.accent.purple,
                  filter: `drop-shadow(0 0 8px ${colors.glow.purple})`,
                }}
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
