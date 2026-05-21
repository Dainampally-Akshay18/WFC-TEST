/**
 * USE SERMONS HOOKS
 * Custom hooks for sermon data fetching and mutations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sermonApi } from "../api/sermon.api";

// ===== CATEGORY HOOKS =====

/**
 * Hook for fetching all sermon categories
 * @returns {Object} Query result with categories data, loading, error states
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["sermon-categories"],
    queryFn: async () => {
      const response = await sermonApi.getCategories();
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for creating a new sermon category
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await sermonApi.createCategory(categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-categories"] });
    },
  });
};

/**
 * Hook for updating a sermon category
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await sermonApi.updateCategory(id, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-categories"] });
    },
  });
};

/**
 * Hook for deleting a sermon category
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await sermonApi.deleteCategory(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermon-categories"] });
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
};

// ===== SERMON HOOKS =====

/**
 * Hook for fetching all sermons with optional filtering
 * @param {Object} options - Configuration
 * @param {string} options.categoryId - Filter by category ID
 * @param {string} options.search - Search term
 * @returns {Object} Query result with sermons data, loading, error states
 */
export const useSermons = (options = {}) => {
  const { categoryId = "", search = "" } = options;

  return useQuery({
    queryKey: ["sermons", categoryId, search],
    queryFn: async () => {
      const params = {};
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;

      const response = await sermonApi.getSermons(params);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching single sermon by ID
 * @param {string} id - Sermon ID
 * @returns {Object} Query result with sermon data, loading, error states
 */
export const useSermonDetails = (id) => {
  return useQuery({
    queryKey: ["sermon", id],
    queryFn: async () => {
      const response = await sermonApi.getSermonById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for creating a new sermon
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useCreateSermon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sermonData) => {
      const response = await sermonApi.createSermon(sermonData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
};

/**
 * Hook for updating an existing sermon
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useUpdateSermon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await sermonApi.updateSermon(id, updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sermon", data._id] });
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
};

/**
 * Hook for deleting a sermon
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useDeleteSermon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await sermonApi.deleteSermon(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["sermon", data._id] });
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
};

/**
 * Hook for publishing a sermon
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const usePublishSermon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await sermonApi.publishSermon(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sermon", data._id] });
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
};

/**
 * Hook for unpublishing a sermon
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useUnpublishSermon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await sermonApi.unpublishSermon(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sermon", data._id] });
      queryClient.invalidateQueries({ queryKey: ["sermons"] });
    },
  });
};
