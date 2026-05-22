import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSidebarStore = create(
  persist(
    (set) => ({
      isOpen: true,
      isCollapsed: false,
      
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      
      openSidebar: () => set({ isOpen: true }),
      
      closeSidebar: () => set({ isOpen: false }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);
