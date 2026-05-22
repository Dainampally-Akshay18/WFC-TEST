import { useSidebarStore } from '../../../../store/sidebarStore';

const LayoutShell = ({ children }) => {
  const { isOpen, isCollapsed } = useSidebarStore();
  const sidebarWidth = !isOpen ? 0 : isCollapsed ? 80 : 256;

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        marginLeft: `${sidebarWidth}px`,
        marginTop: '64px',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      {children}
    </div>
  );
};

export default LayoutShell;
