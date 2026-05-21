/**
 * SIDEBAR COMPONENT
 * Left navigation with all platform features
 * Glassmorphic design with responsive behavior
 * Desktop: Always visible, Mobile: Drawer overlay
 * 
 * Z-index hierarchy (Mobile):
 * - Backdrop/Overlay: z-50
 * - Sidebar Drawer: z-60
 * - Navbar: z-40 (fixed, always visible above)
 */

import { useTheme } from "../context/ThemeProvider";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  FileText,
  Calendar,
  Heart,
  Bell,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = () => {
  const { isDarkMode, colors, glassmorphism, shadows } = useTheme();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout } = useAuth();
  const location = useLocation();

  const sidebarStyle = {
    background: glassmorphism.card.background,
    border: `1px solid ${glassmorphism.card.border}`,
    backdropFilter: glassmorphism.card.backdropFilter,
    boxShadow: shadows.lg,
  };

  const menuItems = [
    { label: "Home", icon: Home, path: "/home", group: "main" },
    { label: "Sermons", icon: BookOpen, path: "/sermons", group: "content" },
    { label: "Blogs", icon: FileText, path: "/blogs", group: "content" },
    { label: "Events", icon: Calendar, path: "/events", group: "community" },
    { label: "Prayers", icon: Heart, path: "/prayers", group: "community" },
    { label: "Notifications", icon: Bell, path: "/notifications", group: "activity" },
    { label: "Profile", icon: User, path: "/profile", group: "account" },
    { label: "Settings", icon: Settings, path: "/profile/settings", group: "account" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const getMenuItemStyle = (active, accentColor) => {
    if (!active) {
      return {
        color: colors.text.primary,
        transition: "all 200ms ease-in-out",
      };
    }

    return {
      background: isDarkMode
        ? `linear-gradient(135deg, ${accentColor}40, ${colors.accent.pink}30)`
        : `linear-gradient(135deg, ${accentColor}20, ${colors.accent.pink}15)`,
      borderLeft: `3px solid ${accentColor}`,
      color: colors.text.primary,
      boxShadow: isDarkMode
        ? `inset 0 0 12px ${accentColor.replace(')', ', 0.2)')}`
        : "none",
      transition: "all 200ms ease-in-out",
    };
  };

  const renderMenuGroup = (groupName, displayName, accentColorKey) => {
    const accentColor = colors.accent[accentColorKey] || colors.accent.purple;

    return (
      <div key={groupName}>
        {groupName !== "main" && (
          <>
            {/* Divider */}
            <div
              className="my-2 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
              }}
            />

            {/* Group Label */}
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.text.muted }}
            >
              {displayName}
            </div>
          </>
        )}

        {menuItems
          .filter((item) => item.group === groupName)
          .map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.path;
                  handleMenuItemClick();
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
                style={getMenuItemStyle(active, accentColor)}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(109,40,217,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}
      </div>
    );
  };

  return (
    <>
      {/* MOBILE OVERLAY - z-50 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{
            background: isDarkMode
              ? "rgba(0,0,0,0.6)"
              : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          }}
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* SIDEBAR - z-60 on mobile, relative on desktop */}
      <aside
        style={sidebarStyle}
        className={`fixed left-0 z-60 h-[calc(100vh-3.5rem)] w-64 transform overflow-y-auto border-r transition-transform duration-300 ease-in-out md:relative md:h-[calc(100vh-3.5rem)] md:z-auto md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* MOBILE HEADER - Close Button and Title */}
        <div 
          className="sticky top-0 flex items-center justify-between border-b px-4 py-3 md:hidden"
          style={{
            background: glassmorphism.card.background,
            borderColor: colors.border.glass,
            backdropFilter: glassmorphism.card.backdropFilter,
          }}
        >
          <span 
            className="font-semibold"
            style={{ color: colors.text.primary }}
          >
            Menu
          </span>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1 transition-all duration-200"
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
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION GROUPS */}
        <nav className="space-y-1 p-3 md:p-4">
          {/* Main Group */}
          {renderMenuGroup("main", "Main", "purple")}

          {/* Content Group */}
          {renderMenuGroup("content", "Content", "blue")}

          {/* Community Group */}
          {renderMenuGroup("community", "Community", "pink")}

          {/* Activity Group */}
          {renderMenuGroup("activity", "Activity", "blue")}

          {/* Account Group */}
          {renderMenuGroup("account", "Account", "purple")}

          {/* Logout Button */}
          <div
            className="mt-4 border-t"
            style={{ borderColor: colors.border.glass }}
          >
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
              style={{
                color: colors.text.secondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode
                  ? "rgba(255,0,0,0.1)"
                  : "rgba(255,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
