import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,
  filters: {
    search: '',
    role: '',
    status: '',
  },
  
  setUsers: (users) => set({ users }),
  
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  updateFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  clearFilters: () => set({
    filters: { search: '', role: '', status: '' },
  }),
}));
