import { useSidebarStore } from '../../../../store/sidebarStore';
import { sidebarConfig } from '../../config/sidebar.config';
import SidebarItem from './SidebarItem';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const { isOpen, isCollapsed } = useSidebarStore();

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        background: 'var(--glass-sidebar)',
        backdropFilter: 'blur(18px)',
        borderRight: '1px solid var(--border-glass)',
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h1 className="text-xl font-bold">Church Admin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-2">
          {sidebarConfig.map((item) => (
            <SidebarItem key={item.id} item={item} collapsed={isCollapsed} />
          ))}
        </nav>

        <SidebarFooter collapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
