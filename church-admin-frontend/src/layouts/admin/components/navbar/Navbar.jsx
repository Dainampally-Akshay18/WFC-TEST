import SearchBar from './SearchBar';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import { useSidebarStore } from '../../../../store/sidebarStore';

const Navbar = () => {
  const { isOpen, isCollapsed } = useSidebarStore();
  const sidebarWidth = !isOpen ? 0 : isCollapsed ? 80 : 256;

  return (
    <nav
      className="fixed top-0 right-0 h-16 z-40 transition-all duration-300"
      style={{
        left: `${sidebarWidth}px`,
        background: 'var(--glass-navbar)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
      }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <SearchBar />

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotificationDropdown />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
