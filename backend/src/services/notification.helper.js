import Notification from '../modules/notification/notification.model.js';
import User from '../modules/auth/auth.model.js';

/**
 * ============================================
 * NOTIFICATION HELPER SERVICE
 * ============================================
 * 
 * Creates notifications for users
 * Used by blog, events, and other modules
 */

export const notificationHelper = {
  /**
   * Create notification for a single user
   * @param {String} userId - Target user ID
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type (BLOG, EVENT, PRAYER, APPROVAL)
   * @param {String} referenceId - Reference to entity (blogId, eventId, etc.)
   */
  async createNotification(userId, title, message, type, referenceId) {
    try {
      const notification = new Notification({
        userId,
        title,
        message,
        type,
        referenceId,
        isRead: false,
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('❌ Notification creation failed:', error.message);
      // Don't throw - notifications are not critical
      return null;
    }
  },

  /**
   * Create notifications for multiple users
   * @param {Array} userIds - Array of user IDs
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @param {String} referenceId - Reference to entity
   */
  async createNotificationsForUsers(userIds, title, message, type, referenceId) {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        title,
        message,
        type,
        referenceId,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
      return notifications.length;
    } catch (error) {
      console.error('❌ Bulk notification creation failed:', error.message);
      return 0;
    }
  },

  /**
   * Create notifications for all approved users
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @param {String} referenceId - Reference to entity
   */
  async notifyAllApprovedUsers(title, message, type, referenceId) {
    try {
      // Get all approved users
      const approvedUsers = await User.find({
        status: 'APPROVED'
      }).select('_id');

      if (approvedUsers.length === 0) {
        return 0;
      }

      const userIds = approvedUsers.map(user => user._id);
      return await this.createNotificationsForUsers(
        userIds,
        title,
        message,
        type,
        referenceId
      );
    } catch (error) {
      console.error('❌ Failed to notify approved users:', error.message);
      return 0;
    }
  },
};

export default notificationHelper;
