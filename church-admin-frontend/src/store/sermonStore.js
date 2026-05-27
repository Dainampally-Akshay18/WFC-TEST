import { create } from 'zustand';
import { sermonService } from '../api/services/sermon.service';

export const useSermonStore = create((set, get) => ({
  sermons: [],
  filteredSermons: [],
  selectedSermon: null,
  isLoading: false,
  isMutating: false,
  error: null,
  detailsModalOpen: false,
  deleteModalOpen: false,
  sermonToDelete: null,
  categories: [],
  
  filters: {
    search: '',
    categoryId: '',
    status: '', // 'published', 'draft', or ''
  },

  // UI Actions
  setDetailsModalOpen: (open) => set({ detailsModalOpen: open }),
  setDeleteModalOpen: (open) => set({ deleteModalOpen: open }),
  setSelectedSermon: (sermon) => set({ selectedSermon: sermon }),
  setSermonToDelete: (sermon) => set({ sermonToDelete: sermon }),

  // Filter Actions
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () =>
    set({
      filters: {
        search: '',
        categoryId: '',
        status: '',
      },
    }),

  // Apply filters to sermons
  applyFilters: () => {
    const { sermons, filters } = get();
    
    let filtered = [...sermons];

    // Search by title or description
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (sermon) =>
          sermon.title?.toLowerCase().includes(searchLower) ||
          sermon.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category - handle multiple response structures
    if (filters.categoryId) {
      const normalizedCategoryId = String(filters.categoryId).trim();
      filtered = filtered.filter((sermon) => {
        // Direct match: sermon.categoryId === filters.categoryId
        if (sermon.categoryId && String(sermon.categoryId).trim() === normalizedCategoryId) return true;
        // Nested reference: sermon.category._id === filters.categoryId
        if (sermon.category?._id && String(sermon.category._id).trim() === normalizedCategoryId) return true;
        // String reference: sermon.category === filters.categoryId
        if (sermon.category && String(sermon.category).trim() === normalizedCategoryId) return true;
        return false;
      });
    }

    // Filter by status
    if (filters.status === 'published') {
      filtered = filtered.filter((sermon) => sermon.isPublished);
    } else if (filters.status === 'draft') {
      filtered = filtered.filter((sermon) => !sermon.isPublished);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    set({ filteredSermons: filtered });
  },

  // Fetch all sermons
  fetchSermons: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sermonService.getSermons(params);
      set({ sermons: response.data || [], isLoading: false });
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to fetch sermons';
      set({ error: errorMsg, isLoading: false });
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await sermonService.getCategories();
      set({ categories: response.data || [] });
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  },

  // Fetch single sermon
  fetchSermonDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await sermonService.getSermon(id);
      set({ selectedSermon: response.data, isLoading: false });
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to fetch sermon';
      set({ error: errorMsg, isLoading: false });
    }
  },

  // Create sermon
  createSermon: async (sermonData) => {
    set({ isMutating: true, error: null });
    try {
      const response = await sermonService.createSermon(sermonData);
      const newSermon = response.data || {};
      
      set((state) => ({
        sermons: [newSermon, ...state.sermons],
        isMutating: false,
      }));
      
      get().applyFilters();
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to create sermon';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Update sermon
  updateSermon: async (id, sermonData) => {
    set({ isMutating: true, error: null });
    try {
      const response = await sermonService.updateSermon(id, sermonData);
      const updatedSermon = response.data || {};
      
      set((state) => ({
        sermons: state.sermons.map((sermon) =>
          sermon._id === id ? { ...sermon, ...updatedSermon } : sermon
        ),
        selectedSermon: state.selectedSermon?._id === id ? { ...state.selectedSermon, ...updatedSermon } : state.selectedSermon,
        isMutating: false,
      }));
      
      get().applyFilters();
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to update sermon';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Delete sermon
  deleteSermon: async (id) => {
    set({ isMutating: true, error: null });
    try {
      await sermonService.deleteSermon(id);
      
      set((state) => ({
        sermons: state.sermons.filter((sermon) => sermon._id !== id),
        selectedSermon: state.selectedSermon?._id === id ? null : state.selectedSermon,
        sermonToDelete: null,
        deleteModalOpen: false,
        isMutating: false,
      }));
      
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to delete sermon';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Publish sermon
  publishSermon: async (id) => {
    set({ isMutating: true, error: null });
    try {
      // Optimistic update
      set((state) => ({
        sermons: state.sermons.map((sermon) =>
          sermon._id === id ? { ...sermon, isPublished: true } : sermon
        ),
      }));

      await sermonService.publishSermon(id);
      get().applyFilters();
      set({ isMutating: false });
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to publish sermon';
      set({ error: errorMsg, isMutating: false });
      // Revert optimistic update
      await get().fetchSermons();
      throw error;
    }
  },

  // Unpublish sermon
  unpublishSermon: async (id) => {
    set({ isMutating: true, error: null });
    try {
      // Optimistic update
      set((state) => ({
        sermons: state.sermons.map((sermon) =>
          sermon._id === id ? { ...sermon, isPublished: false } : sermon
        ),
      }));

      await sermonService.unpublishSermon(id);
      get().applyFilters();
      set({ isMutating: false });
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to unpublish sermon';
      set({ error: errorMsg, isMutating: false });
      // Revert optimistic update
      await get().fetchSermons();
      throw error;
    }
  },
}));
