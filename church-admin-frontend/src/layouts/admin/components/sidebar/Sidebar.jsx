import { useSidebarStore } from '../../../../store/sidebarStore';
import { sidebarConfig } from '../../config/sidebar.config';
import SidebarItem from './SidebarItem';
import SidebarFooter from './SidebarFooter';
import Logo from '../shared/Logo';

const Sidebar = () => {
  const { isOpen, isCollapsed } = useSidebarStore();

  const width = isCollapsed ? 72 : 260;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen z-30 hidden md:flex flex-col transition-all duration-300"
        style={{
          width: `${width}px`,
          background: 'var(--glass-sidebar)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-medium)',
        }}
      >
        {/* Header / Branding */}
        <div
          className="flex-shrink-0 flex items-center px-4 border-b"
          style={{
            height: 'var(--navbar-height)',
            borderColor: 'var(--border-soft)',
          }}
        >
          <Logo collapsed={isCollapsed} />
        </div>

        {/* Navigation — scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
          {sidebarConfig.map((item) => (
            <SidebarItem key={item.id} item={item} collapsed={isCollapsed} />
          ))}
        </nav>

        {/* Footer */}
        <SidebarFooter collapsed={isCollapsed} />
      </aside>
    </>
  );
};

export default Sidebar;
