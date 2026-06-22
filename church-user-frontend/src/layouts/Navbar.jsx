/**
 * NAVBAR COMPONENT
 * Navy blue (#0F172A) sticky navbar with white text
 * Compact height, modern hover states, responsive
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuth();

  const isLandingPage = location.pathname === "/";

  return (
    <nav
      className="sticky top-0 z-40 w-full"
      style={{
        background: "#0F172A",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* LEFT: Menu + Logo */}
          <div className="flex items-center gap-3">
            {isAuthenticated && !isLandingPage && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg md:hidden transition-colors duration-200 hover:bg-white/10"
                style={{ color: "#FFFFFF" }}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              {/* Logo Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  color: "#FFFFFF",
                }}
              >
                W
              </div>
              <div>
                <span className="text-base md:text-lg font-bold text-white tracking-tight">
                  WFC
                </span>
                <span className="hidden sm:inline text-xs text-white/60 ml-2 font-medium">
                  Community
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Navigation CTAs */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Landing Page — Unauthenticated */}
            {isLandingPage && !isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-white/90 hover:text-white hover:bg-white/8"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 group"
                  style={{
                    background: "#2563EB",
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1D4ED8";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#2563EB";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Get Started
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}

            {/* Landing Page — Authenticated */}
            {isLandingPage && isAuthenticated && (
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 group"
                style={{
                  background: "#2563EB",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1D4ED8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#2563EB";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Dashboard
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Inner pages — Authenticated */}
            {!isLandingPage && isAuthenticated && (
              <button
                onClick={() => navigate("/profile")}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all duration-200"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
