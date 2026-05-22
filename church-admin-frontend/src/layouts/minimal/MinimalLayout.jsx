import { Outlet } from 'react-router-dom';

const MinimalLayout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <Outlet />
    </div>
  );
};

export default MinimalLayout;
