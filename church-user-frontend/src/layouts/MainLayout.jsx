/**
 * MAIN LAYOUT
 * Primary layout wrapper for authenticated routes
 * Combines navbar, sidebar, and main content area
 */

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUIStore } from "../store/uiStore";

const MainLayout = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          <div className="mx-auto max-w-7xl p-6">
            {/* Placeholder for page content */}
            <div className="rounded-lg border border-white/10 p-8 text-center">
              <h1 className="text-2xl font-bold">Welcome to WFC Platform</h1>
              <p className="mt-2 text-gray-500">
                Page content will be rendered here
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
