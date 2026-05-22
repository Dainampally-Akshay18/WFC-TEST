import { NavLink } from 'react-router-dom';
import { useState } from 'react';

// Icon registry — SVG icons for each sidebar item
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  blog: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  sermon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  prayer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  notifications: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  branch: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
  audit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2" />
    </svg>
  ),
};

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      flexShrink: 0,
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SidebarItem = ({ item, collapsed }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const icon = icons[item.icon] || icons.settings;

  if (hasChildren) {
    return (
      <div className="mb-0.5">
        <button
          onClick={() => !collapsed && setIsExpanded(!isExpanded)}
          title={collapsed ? item.label : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-card)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {/* Icon */}
          <span className="flex-shrink-0 transition-colors duration-200 group-hover:text-purple-500">
            {icon}
          </span>

          {!collapsed && (
            <>
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              <ChevronIcon isOpen={isExpanded} />
            </>
          )}

          {/* Collapsed tooltip */}
          {collapsed && (
            <div
              className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50"
              style={{
                background: 'var(--glass-modal)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-medium)',
              }}
            >
              {item.label}
            </div>
          )}
        </button>

        {isExpanded && !collapsed && (
          <div className="ml-4 mt-0.5 pl-3 border-l" style={{ borderColor: 'var(--border-soft)' }}>
            {item.children.map((child) => (
              <NavLink
                key={child.id}
                to={child.path}
                className="flex items-center gap-2 px-3 py-2 mb-0.5 rounded-lg text-sm transition-all duration-200"
                style={({ isActive }) => ({
                  color: isActive ? 'rgba(123,44,191,0.9)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--gradient-sidebar-active)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                })}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'currentColor' }}
                />
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className="relative flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-xl transition-all duration-200 group"
      style={({ isActive }) => ({
        color: isActive ? 'rgba(123,44,191,0.95)' : 'var(--text-secondary)',
        background: isActive ? 'var(--gradient-sidebar-active)' : 'transparent',
        fontWeight: isActive ? '600' : '400',
        boxShadow: isActive ? 'var(--shadow-purple-glow)' : 'none',
        border: isActive ? '1px solid rgba(123,44,191,0.15)' : '1px solid transparent',
      })}
      onMouseEnter={(e) => {
        const link = e.currentTarget;
        if (!link.classList.contains('active-nav')) {
          link.style.background = 'var(--glass-card)';
        }
      }}
      onMouseLeave={(e) => {
        // NavLink manages its own active style via the style prop
      }}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && (
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
              style={{ background: 'var(--gradient-button)' }}
            />
          )}

          {/* Icon */}
          <span
            className="flex-shrink-0 transition-colors duration-200"
            style={{ color: isActive ? 'rgba(123,44,191,0.9)' : 'var(--text-muted)' }}
          >
            {icon}
          </span>

          {/* Label */}
          {!collapsed && (
            <span className="text-sm flex-1">{item.label}</span>
          )}

          {/* Collapsed tooltip */}
          {collapsed && (
            <div
              className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50"
              style={{
                background: 'var(--glass-modal)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-medium)',
              }}
            >
              {item.label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
