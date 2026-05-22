import { Outlet } from 'react-router-dom';
import Navbar from '../admin/components/navbar/Navbar';

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Navbar at top */}
      <Navbar />

      {/* Animated gradient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-60"
          style={{
            background: 'var(--gradient-primary)',
            top: '-200px',
            left: '-200px',
            animation: 'floatBlob 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-40"
          style={{
            background: 'var(--gradient-primary)',
            bottom: '-150px',
            right: '-150px',
            animation: 'floatBlob 10s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(212,240,240,0.8), rgba(224,195,252,0.5))',
            top: '50%',
            left: '60%',
            transform: 'translate(-50%,-50%)',
            animation: 'floatBlob 12s ease-in-out infinite',
          }}
        />
      </div>

      {/* Centered card */}
      <div
        className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8"
        style={{ paddingTop: 'calc(var(--navbar-height) + 32px)' }}
      >
        <div
          className="w-full max-w-md animate-scale-in"
        >
          <div
            className="rounded-3xl p-8 md:p-10"
            style={{
              background: 'var(--glass-card)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-glass)',
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
