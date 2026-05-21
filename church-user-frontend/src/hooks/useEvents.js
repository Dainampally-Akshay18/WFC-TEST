/**
 * USE EVENTS HOOKS
 * Custom hooks for event data fetching and mutations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";

/**
 * Hook for fetching all visible events
 * @returns {Object} Query result with data, loading, error states
 */
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await eventApi.getEvents();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching single event by ID
 * @param {string} id - Event ID
 * @returns {Object} Query result with event data, loading, error states
 */
export const useEventDetails = (id) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await eventApi.getEventById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for creating a new event
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const response = await eventApi.createEvent(eventData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

/**
 * Hook for updating an existing event
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await eventApi.updateEvent(id, updates);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specific event and events list
      queryClient.invalidateQueries({ queryKey: ["event", data._id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

/**
 * Hook for deleting an event
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await eventApi.deleteEvent(id);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specific event and events list
      queryClient.removeQueries({ queryKey: ["event", data._id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
