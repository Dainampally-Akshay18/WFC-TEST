import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--gradient-primary)',
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: 'var(--glass-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-glass)',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
