/**
 * MAIN LAYOUT
 * Primary layout for authenticated routes
 * Combines navbar, sidebar, and responsive content area
 * Mobile-responsive with collapsible sidebar
 */

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUIStore } from "../store/uiStore";
import { useTheme } from "../context/ThemeProvider";

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useUIStore();
  const { isDarkMode, colors } = useTheme();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: colors.background.primary }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
