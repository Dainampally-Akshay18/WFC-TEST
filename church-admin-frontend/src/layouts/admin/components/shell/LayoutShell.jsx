import { useSidebarStore } from '../../../../store/sidebarStore';

const LayoutShell = ({ children }) => {
  const { isOpen, isCollapsed } = useSidebarStore();
  const sidebarWidth = !isOpen ? 0 : isCollapsed ? 72 : 260;

  return (
    <div
      className="min-h-screen transition-all duration-300 flex flex-col"
      style={{
        marginLeft: `${sidebarWidth}px`,
        paddingTop: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      {children}
    </div>
  );
};

export default LayoutShell;
