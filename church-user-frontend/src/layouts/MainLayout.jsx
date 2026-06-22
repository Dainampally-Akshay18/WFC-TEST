/**
 * MAIN LAYOUT
 * Primary layout for authenticated routes
 * Navbar + Sidebar + Content area
 * Mobile-responsive with collapsible sidebar
 */

import { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUIStore } from "../store/uiStore";

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useUIStore();

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
    <div className="flex flex-col min-h-screen" style={{ background: "#F5F9FF" }}>
      <Navbar />

      <div className="relative flex flex-1">
        <Sidebar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden md:ml-64">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
