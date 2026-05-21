/**
 * MAIN LAYOUT
 * Primary layout for authenticated routes
 * Combines navbar, sidebar, and responsive content area
 * Mobile-responsive with collapsible sidebar
 * 
 * Z-index hierarchy:
 * - Navbar: z-40
 * - Mobile Overlay: z-50  
 * - Mobile Sidebar: z-60
 */

import { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUIStore } from "../store/uiStore";
import { useTheme } from "../context/ThemeProvider";

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useUIStore();
  const { colors } = useTheme();

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <div 
      className="flex min-h-screen flex-col" 
      style={{ background: colors.background.primary }}
    >
      {/* Navbar - z-40 */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - includes mobile overlay and sidebar */}
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
