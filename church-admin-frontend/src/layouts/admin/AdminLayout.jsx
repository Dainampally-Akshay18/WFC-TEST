import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import LayoutShell from './components/shell/LayoutShell';
import MainContent from './components/shell/MainContent';

const AdminLayout = () => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Navbar />
      <LayoutShell>
        <MainContent>
          <Outlet />
        </MainContent>
      </LayoutShell>
    </div>
  );
};

export default AdminLayout;
