import axiosClient from '../client/axiosClient';
import { NOTIFICATION_ENDPOINTS } from '../endpoints/notification.endpoints';

export const notificationService = {
  getNotifications: (params) => axiosClient.get(NOTIFICATION_ENDPOINTS.LIST, { params }),
  
  getNotification: (id) => axiosClient.get(NOTIFICATION_ENDPOINTS.GET(id)),
  
  markAsRead: (id) => axiosClient.patch(NOTIFICATION_ENDPOINTS.MARK_READ(id)),
  
  markAllAsRead: () => axiosClient.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_READ),
  
  deleteNotification: (id) => axiosClient.delete(NOTIFICATION_ENDPOINTS.DELETE(id)),
};
