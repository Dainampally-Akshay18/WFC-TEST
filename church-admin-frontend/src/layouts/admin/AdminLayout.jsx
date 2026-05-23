import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import MobileSidebar from './components/sidebar/MobileSidebar';
import Navbar from './components/navbar/Navbar';
import LayoutShell from './components/shell/LayoutShell';
import MainContent from './components/shell/MainContent';

const AdminLayout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Mobile Sidebar Drawer */}
      <MobileSidebar />

      <div className="flex min-h-screen min-w-0">
        {/* Desktop Sidebar */}
        <Sidebar />

        <LayoutShell>
          {/* Top Navbar */}
          <Navbar />

          {/* Main content area */}
          <MainContent>
            <Outlet />
          </MainContent>
        </LayoutShell>
      </div>
    </div>
  );
};

export default AdminLayout;
