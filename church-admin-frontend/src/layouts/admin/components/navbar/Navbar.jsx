import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import Logo from '../shared/Logo';
import { useSidebarStore } from '../../../../store/sidebarStore';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';

const HamburgerIcon = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    aria-label="Toggle sidebar"
    className="p-2 rounded-xl transition-all duration-200 shrink-0"
    style={{
      background: 'var(--glass-card)',
      border: '1px solid var(--border-glass)',
      color: 'var(--text-secondary)',
    }}
  >
    <div className="w-5 h-5 flex flex-col justify-center gap-1.5 relative">
      <span
        className="block h-0.5 w-full rounded-full transition-all duration-300"
        style={{
          background: 'var(--text-secondary)',
          transform: isOpen ? 'rotate(45deg) translateY(8px)' : 'none',
        }}
      />
      <span
        className="block h-0.5 w-full rounded-full transition-all duration-300"
        style={{
          background: 'var(--text-secondary)',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'translateX(-8px)' : 'none',
        }}
      />
      <span
        className="block h-0.5 w-full rounded-full transition-all duration-300"
        style={{
          background: 'var(--text-secondary)',
          transform: isOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
        }}
      />
    </div>
  </button>
);

const Navbar = () => {
  const { isOpen, isCollapsed, toggleSidebar, toggleCollapse } = useSidebarStore();
  const { isAuthenticated } = useAuth();

  return (
    <nav
      className="sticky top-0 z-40 shrink-0 transition-all duration-300"
      style={{
        height: 'var(--navbar-height)',
        background: 'var(--glass-navbar)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-small)',
      }}
    >
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Hamburger + Logo (shown on mobile or when sidebar is closed) */}
        <div className="flex items-center gap-3">
          {/* Hamburger — on mobile: open the drawer; on desktop: collapse/expand */}
          {isAuthenticated && (
            <>
              {/* Mobile: Toggle open/close of sidebar drawer */}
              <div className="md:hidden">
                <HamburgerIcon onClick={toggleSidebar} isOpen={isOpen} />
              </div>

              {/* Desktop: Collapse/expand sidebar */}
              <div className="hidden md:block">
                <HamburgerIcon onClick={toggleCollapse} isOpen={!isCollapsed} />
              </div>
            </>
          )}

          {/* Logo — show only when sidebar is collapsed or on desktop without sidebar */}
          {(!isAuthenticated || isCollapsed) && (
            <div className="hidden md:block">
              <Logo collapsed />
            </div>
          )}

          {/* Logo for unauthenticated on mobile */}
          {!isAuthenticated && (
            <div className="block md:hidden">
              <Logo collapsed />
            </div>
          )}
        </div>

        {/* Center — Search (only when authenticated) */}
        {isAuthenticated && (
          <div className="hidden sm:flex flex-1 max-w-sm">
            <SearchBar />
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {isAuthenticated ? (
            /* Authenticated actions */
            <>
              <NotificationDropdown />
              <UserMenu />
            </>
          ) : (
            /* Unauthenticated actions */
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: 'var(--text-primary)',
                  background: 'var(--glass-card)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                Login
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: 'var(--gradient-button)',
                  color: 'white',
                  boxShadow: 'var(--shadow-small)',
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
