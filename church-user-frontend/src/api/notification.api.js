/**
 * NOTIFICATION API
 * Integration with notification endpoints
 */

import { apiClient } from "./axios";

export const notificationApi = {
  /**
   * Get user notifications with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {boolean} params.isRead - Filter by read status
   * @returns {Promise} Response with notifications array and pagination
   */
  getNotifications: async (params = {}) => {
    const response = await apiClient.get("/notifications", { params });
    return response;
  },

  /**
   * Get unread notification count
   * @returns {Promise} Response with unread count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get("/notifications/unread-count");
    return response;
  },

  /**
   * Get single notification by ID
   * @param {string} id - Notification ID
   * @returns {Promise} Response with notification data
   */
  getNotificationById: async (id) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response;
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} Response with updated notification
   */
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Response with updated count
   */
  markAllAsRead: async () => {
    const response = await apiClient.patch("/notifications/read-all");
    return response;
  },
};
