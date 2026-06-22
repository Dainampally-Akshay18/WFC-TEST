import { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUIStore } from "../store/uiStore";

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useUIStore();

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
