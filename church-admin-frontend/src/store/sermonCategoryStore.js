import { create } from 'zustand';
import { sermonService } from '../api/services/sermon.service';

export const useSermonCategoryStore = create((set, get) => ({
  categories: [],
  filteredCategories: [],
  selectedCategory: null,
  isLoading: false,
  isMutating: false,
  error: null,
  deleteModalOpen: false,
  categoryToDelete: null,
  
  filters: {
    search: '',
  },

  // UI Actions
  setDeleteModalOpen: (open) => set({ deleteModalOpen: open }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCategoryToDelete: (category) => set({ categoryToDelete: category }),

  // Filter Actions
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () =>
    set({
      filters: {
        search: '',
      },
    }),

  // Apply filters to categories
  applyFilters: () => {
    const { categories, filters } = get();
    
    let filtered = [...categories];

    // Search by name or description
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(searchLower) ||
          cat.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    set({ filteredCategories: filtered });
  },

  // Fetch all categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await sermonService.getCategories();
      set({ categories: response.data || [], isLoading: false });
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to fetch categories';
      set({ error: errorMsg, isLoading: false });
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    set({ isMutating: true, error: null });
    try {
      const response = await sermonService.createCategory(categoryData);
      const newCategory = response.data || {};
      
      set((state) => ({
        categories: [newCategory, ...state.categories],
        isMutating: false,
      }));
      
      get().applyFilters();
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to create category';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    set({ isMutating: true, error: null });
    try {
      const response = await sermonService.updateCategory(id, categoryData);
      const updatedCategory = response.data || {};
      
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? { ...cat, ...updatedCategory } : cat
        ),
        selectedCategory: state.selectedCategory?._id === id ? { ...state.selectedCategory, ...updatedCategory } : state.selectedCategory,
        isMutating: false,
      }));
      
      get().applyFilters();
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to update category';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    set({ isMutating: true, error: null });
    try {
      await sermonService.deleteCategory(id);
      
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        selectedCategory: state.selectedCategory?._id === id ? null : state.selectedCategory,
        categoryToDelete: null,
        deleteModalOpen: false,
        isMutating: false,
      }));
      
      get().applyFilters();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.message || 'Failed to delete category';
      set({ error: errorMsg, isMutating: false });
      throw error;
    }
  },
}));
