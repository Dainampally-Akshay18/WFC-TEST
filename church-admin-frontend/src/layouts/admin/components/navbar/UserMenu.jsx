import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  const menuItems = [
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: 'Profile',
      action: () => { navigate(ROUTES.PROFILE); setIsOpen(false); },
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2" />
        </svg>
      ),
      label: 'Settings',
      action: () => { navigate(ROUTES.SETTINGS); setIsOpen(false); },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl transition-all duration-200"
        style={{
          background: isOpen ? 'var(--gradient-accent)' : 'var(--glass-card)',
          border: '1px solid var(--border-glass)',
          boxShadow: isOpen ? 'var(--shadow-small)' : 'none',
        }}
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-sm"
          style={{ background: 'var(--gradient-button)' }}
        >
          {getInitials(user.name)}
        </div>

        {/* Name / Role — hidden on small screens */}
        <div className="text-left hidden md:block">
          <div
            className="text-sm font-semibold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {user.name?.split(' ')[0] || 'User'}
          </div>
          <div
            className="text-[11px] leading-tight capitalize"
            style={{ color: 'var(--text-muted)' }}
          >
            {user.role || 'Admin'}
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hidden md:block transition-transform duration-200"
          style={{
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-60 rounded-2xl overflow-hidden animate-scale-in z-50"
          style={{
            background: 'var(--glass-modal)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-large)',
          }}
        >
          {/* User info */}
          <div
            className="px-4 py-4 border-b"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white mb-3"
              style={{ background: 'var(--gradient-button)' }}
            >
              {getInitials(user.name)}
            </div>
            <div
              className="font-semibold text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              {user.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {user.email}
            </div>
            {user.role && (
              <span
                className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  background: 'var(--gradient-accent)',
                  color: 'rgba(123,44,191,0.9)',
                  border: '1px solid rgba(123,44,191,0.2)',
                }}
              >
                {user.role}
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-150"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-card)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div
            className="border-t py-2"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-150"
              style={{ color: 'var(--status-error)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
