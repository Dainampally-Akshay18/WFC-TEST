import { create } from 'zustand';
import { dashboardService } from '../api/services/dashboard.service';

export const useDashboardStore = create((set) => ({
  statistics: null,
  isLoading: false,
  error: null,

  fetchStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardService.getStatistics();
      set({ statistics: response.data, isLoading: false });
    } catch (error) {
      set({ error: error?.response?.data?.error?.message || 'Failed to fetch statistics', isLoading: false });
    }
  },
}));
