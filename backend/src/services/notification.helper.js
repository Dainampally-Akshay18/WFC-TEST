import { notificationService } from '../modules/notification/notification.service.js';
import User from '../modules/auth/auth.model.js';

/**
 * ============================================
 * NOTIFICATION HELPER SERVICE
 * ============================================
 *
 * Centralized helper for creating notifications across modules
 * Used by: Auth, Blog, Events, Prayers, Sermons
 *
 * IMPORTANT:
 * - Non-blocking: never throws
 * - Always returns result (success or null)
 * - Notifications are user-specific
 *
 * Benefits:
 * - Reusable across all modules
 * - Consistent notification format
 * - Centralized error handling
 * - Branch-aware notifications (if needed)
 */

export const notificationHelper = {
  /**
   * 🔔 CREATE NOTIFICATION
   * Wrapper around notificationService for ease of use
   *
   * @param {Object} options
   * @param {String|Array} options.userId - User ID or array of user IDs
   * @param {String} options.title - Short notification title
   * @param {String} options.message - Detailed message
   * @param {String} options.type - APPROVAL, EVENT, BLOG, PRAYER, SERMON
   * @param {String} options.referenceId - Entity ID (blogId, eventId, etc.)
   * @returns {Promise<Array|null>} Array of notifications or null
   *
   * @example
   * // Single user
   * await notificationHelper.createNotification({
   *   userId: user._id,
   *   title: 'Your account has been approved',
   *   message: 'Welcome! Your account is now active.',
   *   type: 'APPROVAL',
   *   referenceId: user._id
   * });
   *
   * @example
   * // Multiple users
   * await notificationHelper.createNotification({
   *   userId: [userId1, userId2, userId3],
   *   title: 'New blog published',
   *   message: 'Pastor has published a new blog post',
   *   type: 'BLOG',
   *   referenceId: blog._id
   * });
   */
  async createNotification({
    userId,
    title,
    message,
    type,
    referenceId,
  }) {
    try {
      const result = await notificationService.createNotification({
        userId,
        title,
        message,
        type,
        referenceId,
      });

      if (result) {
        console.log(`✅ Notification created for ${Array.isArray(userId) ? userId.length : 1} user(s): ${title}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Notification creation failed:', error.message);
      // Non-blocking: return null on error
      return null;
    }
  },

  /**
   * 🔔 NOTIFY ALL APPROVED USERS
   * Notify all approved users in system
   * Used for: blog publications, global events, sermons
   *
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type (BLOG, EVENT, SERMON, etc.)
   * @param {String} referenceId - Reference ID (blogId, eventId, etc.)
   * @returns {Promise<Number>} Count of notifications created
   *
   * @example
   * // Notify all users when blog published
   * await notificationHelper.notifyAllApprovedUsers(
   *   'New blog published',
   *   'Pastor has published a new article',
   *   'BLOG',
   *   blog._id
   * );
   */
  async notifyAllApprovedUsers(title, message, type, referenceId) {
    try {
      // Get all approved users
      const approvedUsers = await User.find({
        status: 'APPROVED',
      }).select('_id');

      if (approvedUsers.length === 0) {
        console.log('⚠️ No approved users found for notification');
        return 0;
      }

      const userIds = approvedUsers.map(user => user._id);

      const result = await notificationService.createNotification({
        userId: userIds,
        title,
        message,
        type,
        referenceId,
      });

      if (result) {
        console.log(`✅ Notified ${approvedUsers.length} approved users: ${title}`);
        return approvedUsers.length;
      }

      return 0;
    } catch (error) {
      console.error('❌ Failed to notify approved users:', error.message);
      return 0;
    }
  },

  /**
   * 🔔 NOTIFY BRANCH USERS
   * Notify all users of specific branch + admins/leaders of that branch
   * Used for: branch-specific events
   *
   * @param {String} branch - Branch identifier
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @param {String} referenceId - Reference ID
   * @returns {Promise<Number>} Count of notifications created
   *
   * @example
   * // Notify branch members about event
   * await notificationHelper.notifyBranchUsers(
   *   'BRANCH1',
   *   'Branch Event Scheduled',
   *   'An important event has been scheduled for your branch',
   *   'EVENT',
   *   event._id
   * );
   */
  async notifyBranchUsers(branch, title, message, type, referenceId) {
    try {
      // Get:
      // 1. All approved users of this branch
      // 2. All LEADER and MASTER_ADMIN of this branch
      const branchUsers = await User.find({
        status: 'APPROVED',
        branch: branch,
      }).select('_id');

      const branchLeaders = await User.find({
        status: 'APPROVED',
        $or: [
          { role: 'LEADER', branch: branch },
          { role: 'MASTER_ADMIN' },
        ],
      }).select('_id');

      // Combine and deduplicate
      const userIds = Array.from(new Set([
        ...branchUsers.map(u => u._id.toString()),
        ...branchLeaders.map(u => u._id.toString()),
      ])).map(id => id);

      if (userIds.length === 0) {
        console.log(`⚠️ No branch users found for branch: ${branch}`);
        return 0;
      }

      const result = await notificationService.createNotification({
        userId: userIds,
        title,
        message,
        type,
        referenceId,
      });

      if (result) {
        console.log(`✅ Notified ${userIds.length} branch users: ${title}`);
        return userIds.length;
      }

      return 0;
    } catch (error) {
      console.error('❌ Failed to notify branch users:', error.message);
      return 0;
    }
  },

  /**
   * 🔔 NOTIFY EXCLUDE SELF
   * Notify all approved users EXCEPT the specified user
   * Used for: prayer requests (don't notify prayer creator), etc.
   *
   * @param {String} excludeUserId - User ID to exclude
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @param {String} referenceId - Reference ID
   * @returns {Promise<Number>} Count of notifications created
   *
   * @example
   * // Notify all users except prayer creator
   * await notificationHelper.notifyExcludeSelf(
   *   prayer.createdBy,
   *   'Someone prayed for your request',
   *   'A community member has prayed for this request',
   *   'PRAYER',
   *   prayer._id
   * );
   */
  async notifyExcludeSelf(excludeUserId, title, message, type, referenceId) {
    try {
      // Get all approved users EXCEPT the one specified
      const approvedUsers = await User.find({
        status: 'APPROVED',
        _id: { $ne: excludeUserId },
      }).select('_id');

      if (approvedUsers.length === 0) {
        console.log('⚠️ No users available for notification (excluding self)');
        return 0;
      }

      const userIds = approvedUsers.map(user => user._id);

      const result = await notificationService.createNotification({
        userId: userIds,
        title,
        message,
        type,
        referenceId,
      });

      if (result) {
        console.log(`✅ Notified ${approvedUsers.length} users (excluding self): ${title}`);
        return approvedUsers.length;
      }

      return 0;
    } catch (error) {
      console.error('❌ Failed to notify (exclude self):', error.message);
      return 0;
    }
  },

  /**
   * 🔔 NOTIFY SINGLE USER
   * Notify a single user
   * Used for: user approvals, personal notifications
   *
   * @param {String} userId - User ID to notify
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {String} type - Notification type
   * @param {String} referenceId - Reference ID
   * @returns {Promise<Object|null>} Notification or null
   *
   * @example
   * // Notify user of approval
   * await notificationHelper.notifySingleUser(
   *   user._id,
   *   'Your account has been approved',
   *   'Welcome! Your account is now active.',
   *   'APPROVAL',
   *   user._id
   * );
   */
  async notifySingleUser(userId, title, message, type, referenceId) {
    try {
      const result = await notificationService.createNotification({
        userId,
        title,
        message,
        type,
        referenceId,
      });

      if (result) {
        console.log(`✅ User notified: ${title}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to notify user:', error.message);
      return null;
    }
  },
};

export default notificationHelper;

export default notificationHelper;
