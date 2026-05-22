import { Outlet } from 'react-router-dom';
import Navbar from '../admin/components/navbar/Navbar';

const MinimalLayout = () => {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <Navbar />
      <div style={{ paddingTop: 'var(--navbar-height)' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MinimalLayout;
