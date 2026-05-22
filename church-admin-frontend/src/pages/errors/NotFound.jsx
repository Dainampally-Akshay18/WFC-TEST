import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Background blob */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'var(--gradient-primary)',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div className="relative text-center animate-fade-in-up max-w-md">
        {/* 404 number */}
        <div
          className="text-8xl md:text-9xl font-black mb-4 select-none"
          style={{
            background: 'var(--gradient-button)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}
        >
          404
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-3xl"
          style={{
            background: 'var(--glass-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-glass)',
          }}
        >
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Page Not Found
          </h1>
          <p
            className="text-sm mb-8 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>

          <button
            onClick={() => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN)}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: 'var(--gradient-button)',
              boxShadow: 'var(--shadow-small)',
            }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
