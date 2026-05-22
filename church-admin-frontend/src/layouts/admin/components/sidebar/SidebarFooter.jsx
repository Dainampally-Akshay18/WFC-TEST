import { useSidebarStore } from '../../../../store/sidebarStore';
import { useAuth } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SidebarFooter = ({ collapsed }) => {
  const { toggleCollapse } = useSidebarStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      className="flex-shrink-0 border-t p-3"
      style={{ borderColor: 'var(--border-soft)' }}
    >
      {/* User mini card (only when expanded) */}
      {!collapsed && user && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-3 cursor-pointer transition-all duration-200"
          style={{
            background: 'var(--gradient-accent)',
            border: '1px solid var(--border-glass)',
          }}
          onClick={() => navigate(ROUTES.PROFILE)}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'var(--gradient-button)' }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {user?.name || 'Admin'}
            </div>
            <div
              className="text-xs truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              {user?.email || ''}
            </div>
          </div>
          {/* Logout icon */}
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            title="Logout"
            className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-150"
            style={{ color: 'var(--status-error)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(220,38,38,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}

      {/* Collapse toggle button */}
      <button
        onClick={toggleCollapse}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all duration-200"
        style={{
          color: 'var(--text-muted)',
          background: 'transparent',
          border: '1px solid var(--border-soft)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-card)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {!collapsed && (
          <span className="text-xs font-medium">Collapse</span>
        )}
      </button>
    </div>
  );
};

export default SidebarFooter;
