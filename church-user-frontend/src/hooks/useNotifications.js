/**
 * USE NOTIFICATIONS HOOKS
 * Custom hooks for notification data fetching and mutations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";

/**
 * Hook for fetching notifications with pagination
 * @param {Object} options - Configuration
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {boolean} options.isRead - Filter by read status
 * @returns {Object} Query result with notifications data, loading, error states
 */
export const useNotifications = (options = {}) => {
  const { page = 1, limit = 20, isRead } = options;

  return useQuery({
    queryKey: ["notifications", page, limit, isRead],
    queryFn: async () => {
      const params = { page, limit };
      if (isRead !== undefined) params.isRead = isRead;

      const response = await notificationApi.getNotifications(params);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching unread notification count with polling
 * @param {Object} options - Configuration
 * @param {number} options.refetchInterval - Polling interval in ms (default: 30000)
 * @returns {Object} Query result with unread count, loading, error states
 */
export const useUnreadCount = (options = {}) => {
  const { refetchInterval = 30000 } = options;

  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const response = await notificationApi.getUnreadCount();
      return response.data?.unreadCount || 0;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval, // Poll every 30 seconds
    refetchIntervalInBackground: true,
  });
};

/**
 * Hook for fetching single notification by ID
 * @param {string} id - Notification ID
 * @returns {Object} Query result with notification data, loading, error states
 */
export const useNotificationDetails = (id) => {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: async () => {
      const response = await notificationApi.getNotificationById(id);
      return response.data?.notification;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for marking notification as read
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await notificationApi.markAsRead(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notification", data.notification?._id] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
};

/**
 * Hook for marking all notifications as read
 * @returns {Object} Mutation object with mutate, status, data, error
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationApi.markAllAsRead();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
};
