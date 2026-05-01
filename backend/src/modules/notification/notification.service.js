import NotificationModel from './notification.model.js';

export const notificationModuleService = {
  async getNotifications(userId, limit = 20, skip = 0) {
    // TODO: Implement business logic
    // - Query notifications for user
    // - Return paginated results
  },

  async markAsRead(notificationId, userId) {
    // TODO: Implement business logic
    // - Mark notification as read
  },

  async deleteNotification(notificationId, userId) {
    // TODO: Implement business logic
    // - Delete notification
  },

  async clearAllNotifications(userId) {
    // TODO: Implement business logic
    // - Delete all notifications for user
  },
};

export default notificationModuleService;
