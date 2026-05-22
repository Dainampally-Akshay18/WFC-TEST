import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{
          background: 'var(--gradient-button)',
        }}>
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {user.name}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {user.role}
          </div>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-20"
            style={{
              background: 'var(--glass-card)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </div>
              {user.branch && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {user.branch}
                </div>
              )}
            </div>
            
            <div className="py-2">
              <button
                onClick={() => {
                  navigate(ROUTES.PROFILE);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => {
                  navigate(ROUTES.SETTINGS);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                ⚙️ Settings
              </button>
            </div>

            <div className="border-t py-2" style={{ borderColor: 'var(--border-soft)' }}>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                style={{ color: 'var(--status-error)' }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
