/**
 * SIDEBAR COMPONENT
 * Left navigation for authenticated users
 * Desktop: always visible | Mobile: drawer overlay
 */

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
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout } = useAuth();
  const location = useLocation();

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
    if (window.innerWidth < 768) toggleSidebar();
  };

  const groupLabels = {
    content: "Content",
    community: "Community",
    activity: "Activity",
    account: "Account",
  };

  const renderMenuGroup = (groupName) => {
    const items = menuItems.filter((item) => item.group === groupName);
    if (items.length === 0) return null;

    return (
      <div key={groupName}>
        {groupName !== "main" && (
          <>
            <div className="my-3 h-px" style={{ background: "#E2E8F0" }} />
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#94A3B8" }}
            >
              {groupLabels[groupName]}
            </div>
          </>
        )}

        {items.map((item) => {
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
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{
                background: active ? "rgba(37,99,235,0.08)" : "transparent",
                color: active ? "#2563EB" : "#0F172A",
                borderLeft: active ? "3px solid #2563EB" : "3px solid transparent",
                paddingLeft: active ? "13px" : "16px",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "#F1F5F9";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          }}
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 md:top-16 z-60 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-64 transform overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
        }}
      >
        {/* Mobile Header */}
        <div
          className="sticky top-0 flex items-center justify-between border-b px-4 py-3 md:hidden"
          style={{
            background: "#FFFFFF",
            borderColor: "#E2E8F0",
          }}
        >
          <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>
            Menu
          </span>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-slate-100"
            style={{ color: "#0F172A" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3 md:p-4">
          {renderMenuGroup("main")}
          {renderMenuGroup("content")}
          {renderMenuGroup("community")}
          {renderMenuGroup("activity")}
          {renderMenuGroup("account")}

          {/* Logout */}
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid #E2E8F0" }}>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                e.currentTarget.style.color = "#EF4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748B";
              }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
