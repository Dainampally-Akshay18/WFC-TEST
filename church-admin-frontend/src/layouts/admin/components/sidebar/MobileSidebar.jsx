import { useSidebarStore } from '../../../../store/sidebarStore';
import { sidebarConfig } from '../../config/sidebar.config';
import SidebarItem from './SidebarItem';

const MobileSidebar = () => {
  const { isOpen, closeSidebar } = useSidebarStore();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={closeSidebar}
      />
      <aside
        className="fixed left-0 top-0 h-screen w-64 z-50 md:hidden"
        style={{
          background: 'var(--glass-sidebar)',
          backdropFilter: 'blur(18px)',
          borderRight: '1px solid var(--border-glass)',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Church Admin</h1>
            <button onClick={closeSidebar}>✕</button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2">
            {sidebarConfig.map((item) => (
              <SidebarItem key={item.id} item={item} collapsed={false} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
