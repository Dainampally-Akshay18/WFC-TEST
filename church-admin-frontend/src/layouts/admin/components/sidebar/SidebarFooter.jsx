import { useSidebarStore } from '../../../../store/sidebarStore';

const SidebarFooter = ({ collapsed }) => {
  const { toggleCollapse } = useSidebarStore();

  return (
    <div className="p-4 border-t border-white/10">
      <button
        onClick={toggleCollapse}
        className="w-full px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        {collapsed ? '→' : '←'}
      </button>
    </div>
  );
};

export default SidebarFooter;
