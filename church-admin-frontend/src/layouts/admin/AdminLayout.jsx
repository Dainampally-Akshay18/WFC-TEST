import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import MobileSidebar from './components/sidebar/MobileSidebar';
import Navbar from './components/navbar/Navbar';
import LayoutShell from './components/shell/LayoutShell';
import MainContent from './components/shell/MainContent';

const AdminLayout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar />

      {/* Top Navbar — spans full width minus sidebar on desktop */}
      <Navbar />

      {/* Main content area */}
      <LayoutShell>
        <MainContent>
          <Outlet />
        </MainContent>
      </LayoutShell>
    </div>
  );
};

export default AdminLayout;
