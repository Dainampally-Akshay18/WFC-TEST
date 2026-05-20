/**
 * NAVBAR COMPONENT
 * Top navigation bar with theme toggle
 * Glassmorphic design with premium aesthetics
 */

import { useTheme } from "../context/ThemeProvider";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

const Navbar = () => {
  const { isDarkMode, toggleTheme, currentTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const navStyle = isDarkMode
    ? {
        background: currentTheme.glassmorphism.nav.background,
        border: `1px solid ${currentTheme.glassmorphism.nav.border}`,
        backdropFilter: currentTheme.glassmorphism.nav.backdropFilter,
        boxShadow: currentTheme.shadows.md,
      }
    : {
        background: currentTheme.glassmorphism.nav.background,
        border: `1px solid ${currentTheme.glassmorphism.nav.border}`,
        backdropFilter: currentTheme.glassmorphism.nav.backdropFilter,
        boxShadow: currentTheme.shadows.md,
      };

  return (
    <nav
      style={navStyle}
      className="sticky top-0 z-40 w-full px-6 py-4"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="text-xl font-bold">
            <span
              style={{
                background: currentTheme.gradients.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WFC
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-white/10"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM5.757 5.757a1 1 0 000 1.414L4.343 8.586a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 0zm5.464 9.172a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414L10.22 16.22a1 1 0 010-1.414zM4.464 4.465L5.878 3.05a1 1 0 011.414 1.414L5.878 5.879a1 1 0 01-1.414-1.414zM2.05 5.878l1.414-1.414a1 1 0 111.414 1.414L3.464 7.293a1 1 0 01-1.414-1.414zm9.172 5.464a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zM3 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
