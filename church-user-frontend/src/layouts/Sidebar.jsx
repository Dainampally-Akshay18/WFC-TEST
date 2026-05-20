/**
 * SIDEBAR COMPONENT
 * Left navigation with all platform features
 * Glassmorphic design with responsive behavior
 * Desktop: Always visible, Mobile: Collapsible
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

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        style={sidebarStyle}
        className={`fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-64 transform overflow-y-auto border-r transition-transform duration-300 ease-in-out md:relative md:top-0 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-current px-4 py-3 md:hidden"
          style={{
            borderColor: `1px solid ${colors.border.glass}`,
          }}>
          <span className="font-semibold">Menu</span>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-1 p-3 md:p-4">
          {/* Main Group */}
          <div>
            {menuItems
              .filter((item) => item.group === "main")
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
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r text-white"
                        : "hover:bg-white/10"
                    }`}
                    style={
                      active
                        ? {
                            background: isDarkMode
                              ? `linear-gradient(135deg, ${colors.accent.purple}40, ${colors.accent.pink}30)`
                              : `linear-gradient(135deg, ${colors.accent.purple}30, ${colors.accent.pink}20)`,
                            borderLeft: `3px solid ${colors.accent.purple}`,
                            color: isDarkMode ? colors.text.primary : colors.text.primary,
                            boxShadow: isDarkMode
                              ? `inset 0 0 12px ${colors.glow.purple}`
                              : "none",
                          }
                        : {}
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
          </div>

          {/* Divider */}
          <div
            className="my-2 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
            }}
          />

          {/* Content Group */}
          <div>
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.text.muted }}
            >
              Content
            </div>
            {menuItems
              .filter((item) => item.group === "content")
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
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active ? "bg-white/10 text-white" : "hover:bg-white/10"
                    }`}
                    style={
                      active
                        ? {
                            borderLeft: `3px solid ${colors.accent.blue}`,
                            boxShadow: isDarkMode
                              ? `inset 0 0 8px ${colors.glow.blue}`
                              : "none",
                          }
                        : {}
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
          </div>

          {/* Divider */}
          <div
            className="my-2 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
            }}
          />

          {/* Community Group */}
          <div>
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.text.muted }}
            >
              Community
            </div>
            {menuItems
              .filter((item) => item.group === "community")
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
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active ? "bg-white/10 text-white" : "hover:bg-white/10"
                    }`}
                    style={
                      active
                        ? {
                            borderLeft: `3px solid ${colors.accent.pink}`,
                            boxShadow: isDarkMode
                              ? `inset 0 0 8px ${colors.glow.pink}`
                              : "none",
                          }
                        : {}
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
          </div>

          {/* Divider */}
          <div
            className="my-2 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.border.glass}, transparent)`,
            }}
          />

          {/* Account Group */}
          <div>
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.text.muted }}
            >
              Account
            </div>
            {menuItems
              .filter((item) => item.group === "account")
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
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      active ? "bg-white/10 text-white" : "hover:bg-white/10"
                    }`}
                    style={
                      active
                        ? {
                            borderLeft: `3px solid ${colors.accent.purple}`,
                          }
                        : {}
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/10"
            style={{
              color: colors.text.secondary,
              borderTop: `1px solid ${colors.border.glass}`,
            }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
