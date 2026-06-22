import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { navigationItems } from "../config/navigation.config";
import { Menu, X, ChevronRight, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const { isAuthenticated, logout } = useAuth();

  const isLandingPage = location.pathname === "/";
  const isActive = (path) => location.pathname === path || (path !== "/home" && location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Hamburger (mobile only for auth pages) + Logo */}
          <div className="flex items-center gap-3">
            {isAuthenticated && !isLandingPage && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg lg:hidden text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
                W
              </div>
              <span className="text-base font-bold text-white tracking-tight">WFC</span>
              <span className="hidden sm:inline text-xs text-white/50 font-medium">Community</span>
            </div>
          </div>

          {/* CENTER: Desktop Nav Links (authenticated inner pages only) */}
          {isAuthenticated && !isLandingPage && (
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* RIGHT: CTAs */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Landing — Unauthenticated */}
            {isLandingPage && !isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-white/80 hover:text-white hover:bg-white/8 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5"
                >
                  Get Started
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Landing — Authenticated */}
            {isLandingPage && isAuthenticated && (
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5"
              >
                Dashboard
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Inner pages — Authenticated: Profile + Logout */}
            {!isLandingPage && isAuthenticated && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate("/profile")}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/8 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
