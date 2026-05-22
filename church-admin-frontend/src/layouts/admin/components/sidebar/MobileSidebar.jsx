import { useEffect } from 'react';
import { useSidebarStore } from '../../../../store/sidebarStore';
import { sidebarConfig } from '../../config/sidebar.config';
import SidebarItem from './SidebarItem';
import Logo from '../shared/Logo';

const MobileSidebar = () => {
  const { isOpen, closeSidebar } = useSidebarStore();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          background: isOpen ? 'rgba(0,0,0,0.45)' : 'transparent',
          backdropFilter: isOpen ? 'blur(4px)' : 'none',
          pointerEvents: isOpen ? 'all' : 'none',
          opacity: isOpen ? 1 : 0,
        }}
        onClick={closeSidebar}
      />

      {/* Drawer */}
      <aside
        className="fixed left-0 top-0 h-screen z-50 md:hidden flex flex-col transition-all duration-300"
        style={{
          width: '260px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          background: 'var(--glass-sidebar)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-large)',
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 border-b"
          style={{
            height: 'var(--navbar-height)',
            borderColor: 'var(--border-soft)',
          }}
        >
          <Logo />
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="p-2 rounded-lg transition-all duration-150"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--glass-card)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation — scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
          {sidebarConfig.map((item) => (
            <div key={item.id} onClick={closeSidebar}>
              <SidebarItem item={item} collapsed={false} />
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="flex-shrink-0 border-t p-3"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <p
            className="text-[10px] text-center font-medium tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Church Admin Portal
          </p>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
