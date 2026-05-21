/**
 * USE PRAYERS HOOKS
 * Custom hooks for prayer data fetching and mutations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prayerApi } from "../api/prayer.api";

/**
 * Hook for fetching all prayers
 * @returns {Object} Query result with prayers data, loading, error states
 */
export const usePrayers = () => {
  return useQuery({
    queryKey: ["prayers"],
    queryFn: async () => {
      const response = await prayerApi.getPrayers();
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching single prayer by ID
 * @param {string} id - Prayer ID
 * @returns {Object} Query result with prayer data, loading, error states
 */
export const usePrayerDetails = (id) => {
  return useQuery({
    queryKey: ["prayer", id],
    queryFn: async () => {
      const response = await prayerApi.getPrayerById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for creating a new prayer
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useCreatePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prayerData) => {
      const response = await prayerApi.createPrayer(prayerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
};

/**
 * Hook for updating an existing prayer
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useUpdatePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await prayerApi.updatePrayer(id, updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prayer", data._id] });
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
};

/**
 * Hook for deleting a prayer
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useDeletePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await prayerApi.deletePrayer(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
};

/**
 * Hook for toggling prayed status
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useTogglePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await prayerApi.togglePrayer(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prayer", data._id] });
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
};

/**
 * Hook for updating prayer status (admin only)
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useUpdatePrayerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await prayerApi.updatePrayerStatus(id, status);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prayer", data._id] });
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
};
