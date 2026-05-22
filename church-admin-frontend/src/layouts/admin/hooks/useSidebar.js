import { useSidebarStore } from '../../../store/sidebarStore';

export const useSidebar = () => {
  const { isOpen, isCollapsed, toggleSidebar, toggleCollapse, openSidebar, closeSidebar } = useSidebarStore();

  return {
    isOpen,
    isCollapsed,
    toggleSidebar,
    toggleCollapse,
    openSidebar,
    closeSidebar,
  };
};
