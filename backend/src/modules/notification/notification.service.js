import { Notification } from './notification.model.js';
import User from '../auth/auth.model.js';

/**
 * ============================================
 * NOTIFICATION SERVICE - BUSINESS LOGIC
 * ============================================
 *
 * Responsibilities:
 * 1. Centralized helper for creating notifications (createNotification)
 * 2. User notification queries (getNotifications, getNotificationById)
 * 3. Notification management (markAsRead, markAllAsRead, getUnreadCount)
 *
 * IMPORTANT:
 * - All business logic here
 * - Controllers only call service methods
 * - Database operations only in service
 * - Branch-aware filtering handled here
 */

export const notificationService = {
  // ============================================
  // CENTRALIZED NOTIFICATION CREATION HELPER
  // ============================================

  /**
   * 🔔 CREATE NOTIFICATION (Centralized Helper)
   * Called by: Auth, Events, Prayers, Sermons, Blogs modules
   *
   * Used across modules for consistent notification creation.
   * Non-blocking: never throws, returns null on error.
   *
   * @param {Object} options - Notification options
   * @param {String|String[]} options.userId - User ID or array of user IDs to notify
   * @param {String} options.title - Short notification title
   * @param {String} options.message - Detailed notification message
   * @param {String} options.type - Type: APPROVAL, EVENT, BLOG, PRAYER, SERMON
   * @param {String} options.referenceId - Entity ID (blogId, eventId, etc.)
   * @returns {Promise<Object|null>} Notification document or null on error
   *
   * @example
   * // Single user notification
   * await notificationService.createNotification({
   *   userId: user._id,
   *   title: 'Your account has been approved',
   *   message: 'Welcome! Your account is now active.',
   *   type: 'APPROVAL',
   *   referenceId: user._id
   * });
   *
   * @example
   * // Bulk notification (multiple users)
   * const allUsers = await User.find({ status: 'APPROVED' });
   * await notificationService.createNotification({
   *   userId: allUsers.map(u => u._id),
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
      // Handle single userId or array of userIds
      const userIds = Array.isArray(userId) ? userId : [userId];

      if (userIds.length === 0) {
        return null;
      }

      // Create notifications for each user
      const notifications = userIds.map(id => ({
        userId: id,
        title,
        message,
        type,
        referenceId,
        isRead: false,
      }));

      const result = await Notification.insertMany(notifications);
      return result;
    } catch (error) {
      // Non-blocking: log error but don't throw
      console.error('❌ Error creating notification:', error.message);
      return null;
    }
  },

  // ============================================
  // NOTIFICATION QUERIES
  // ============================================

  /**
   * 📖 GET USER NOTIFICATIONS
   * Returns notifications for authenticated user with pagination and filtering
   *
   * @param {String} userId - User ID requesting notifications
   * @param {Object} options - Query options
   * @param {Number} options.page - Page number (default: 1)
   * @param {Number} options.limit - Items per page (default: 20, max: 100)
   * @param {Boolean} options.isRead - Filter by read status (optional)
   * @returns {Promise<Object>} {notifications: [], unreadCount: Number, pagination: {}}
   */
  async getNotifications(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        isRead = undefined,
      } = options;

      // Validate pagination
      const parsedPage = Math.max(1, parseInt(page) || 1);
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
      const skip = (parsedPage - 1) * parsedLimit;

      // Build query
      const query = { userId };

      if (isRead !== undefined) {
        query.isRead = isRead;
      }

      // Execute query with pagination
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(parsedLimit)
        .skip(skip)
        .lean();

      // Get total count
      const total = await Notification.countDocuments(query);

      // Get unread count
      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false,
      });

      return {
        notifications,
        unreadCount,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          pages: Math.ceil(total / parsedLimit),
        },
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 📄 GET SINGLE NOTIFICATION
   * Returns notification with ownership validation
   *
   * IMPORTANT: User can only access their own notifications
   *
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID requesting (for ownership check)
   * @returns {Promise<Object>} Notification document
   * @throws {Error} If notification not found or user not owner
   */
  async getNotificationById(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId).lean();

      if (!notification) {
        const error = new Error('Notification not found');
        error.status = 404;
        throw error;
      }

      // ⚠️ CRITICAL: Verify ownership
      if (notification.userId.toString() !== userId.toString()) {
        const error = new Error('Unauthorized: You cannot access this notification');
        error.status = 403;
        throw error;
      }

      return notification;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // NOTIFICATION MANAGEMENT
  // ============================================

  /**
   * ✔️ MARK AS READ
   * Marks single notification as read with ownership validation
   *
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID requesting (for ownership check)
   * @returns {Promise<Object>} Updated notification
   * @throws {Error} If notification not found or user not owner
   */
  async markAsRead(notificationId, userId) {
    try {
      // ⚠️ CRITICAL: Verify ownership first
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        const error = new Error('Notification not found');
        error.status = 404;
        throw error;
      }

      if (notification.userId.toString() !== userId.toString()) {
        const error = new Error('Unauthorized: You cannot modify this notification');
        error.status = 403;
        throw error;
      }

      // Mark as read
      notification.isRead = true;
      await notification.save();

      return notification;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ✔️ MARK ALL AS READ
   * Marks all unread notifications as read for user
   *
   * @param {String} userId - User ID
   * @returns {Promise<Object>} {modifiedCount: Number}
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      return {
        modifiedCount: result.modifiedCount || 0,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 🔢 GET UNREAD COUNT
   * Returns count of unread notifications for user
   *
   * @param {String} userId - User ID
   * @returns {Promise<Number>} Unread count
   */
  async getUnreadCount(userId) {
    try {
      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false,
      });

      return unreadCount;
    } catch (error) {
      throw error;
    }
  },
};
