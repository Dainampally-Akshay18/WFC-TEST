/**
 * SIDEBAR COMPONENT
 * Left navigation sidebar
 * Glassmorphic design with smooth animations
 */

import { useTheme } from "../context/ThemeProvider";
import { useUIStore } from "../store/uiStore";

const Sidebar = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const { sidebarOpen } = useUIStore();

  const sidebarStyle = isDarkMode
    ? {
        background: currentTheme.glassmorphism.card.background,
        border: `1px solid ${currentTheme.glassmorphism.card.border}`,
        backdropFilter: currentTheme.glassmorphism.card.backdropFilter,
        boxShadow: currentTheme.shadows.lg,
      }
    : {
        background: currentTheme.glassmorphism.card.background,
        border: `1px solid ${currentTheme.glassmorphism.card.border}`,
        backdropFilter: currentTheme.glassmorphism.card.backdropFilter,
        boxShadow: currentTheme.shadows.lg,
      };

  const menuItems = [
    { label: "Home", icon: "🏠", path: "/" },
    { label: "Sermons", icon: "📖", path: "/sermons" },
    { label: "Blogs", icon: "📝", path: "/blogs" },
    { label: "Events", icon: "📅", path: "/events" },
    { label: "Prayers", icon: "🙏", path: "/prayers" },
    { label: "Notifications", icon: "🔔", path: "/notifications" },
    { label: "Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <aside
      style={sidebarStyle}
      className={`fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-y-auto border-r`}
    >
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              isDarkMode
                ? "text-gray-300 hover:bg-white/10 hover:text-white"
                : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
