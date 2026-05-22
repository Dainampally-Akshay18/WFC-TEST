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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        <span className="text-sm">{user?.firstName || 'User'}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
          style={{
            background: 'var(--glass-card)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <button
            onClick={() => navigate(ROUTES.PROFILE)}
            className="w-full px-4 py-2 text-left hover:bg-white/5"
          >
            Profile
          </button>
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="w-full px-4 py-2 text-left hover:bg-white/5"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left hover:bg-white/5 text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
