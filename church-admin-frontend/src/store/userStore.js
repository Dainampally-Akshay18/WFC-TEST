import { create } from 'zustand';
import { userService } from '../api/services/user.service';

export const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  drawerOpen: false,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    search: '',
    role: '',
    status: '',
    branch: '',
  },
  
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  updateFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 }, // reset page on filter change
  })),
  
  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, page },
  })),
  
  clearFilters: () => set({
    filters: { search: '', role: '', status: '', branch: '' },
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      
      const rawParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      // Remove empty string filters to prevent 400 Bad Request from backend
      const params = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
      
      const response = await userService.getUsers(params);
      set({
        users: response.data.users,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error?.response?.data?.error?.message || 'Failed to fetch users', isLoading: false });
    }
  },
}));
