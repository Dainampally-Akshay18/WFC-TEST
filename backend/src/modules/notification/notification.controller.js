import notificationService from './notification.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * NOTIFICATION CONTROLLER - HTTP HANDLERS
 * ============================================
 *
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 *
 * Handlers:
 * - getNotifications: Get user's notifications with pagination
 * - getNotificationById: Get single notification
 * - markAsRead: Mark notification as read
 * - markAllAsRead: Mark all unread as read
 * - getUnreadCount: Get unread notification count
 */

export const notificationController = {
  /**
   * 📖 GET /api/notifications
   * Get all notifications for logged-in user
   *
   * Query params:
   * - page: page number (default: 1)
   * - limit: items per page (default: 20, max: 100)
   * - isRead: filter by read status (optional, true/false)
   *
   * Response:
   * {
   *   success: true,
   *   data: {
   *     notifications: [],
   *     unreadCount: 5,
   *     pagination: { total, page, limit, pages }
   *   },
   *   message: '...'
   * }
   */
  getNotifications: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const { page, limit, isRead } = req.query;

    // Parse isRead filter
    let isReadFilter = undefined;
    if (isRead !== undefined) {
      isReadFilter = isRead === 'true';
    }

    const result = await notificationService.getNotifications(userId, {
      page,
      limit,
      isRead: isReadFilter,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Notifications retrieved successfully',
    });
  }),

  /**
   * 📄 GET /api/notifications/:id
   * Get single notification by ID
   *
   * Validates:
   * - Notification exists
   * - User is owner of notification
   *
   * Response:
   * {
   *   success: true,
   *   data: { notification },
   *   message: '...'
   * }
   */
  getNotificationById: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const { id: notificationId } = req.params;

    const notification = await notificationService.getNotificationById(
      notificationId,
      userId
    );

    res.status(200).json({
      success: true,
      data: { notification },
      message: 'Notification retrieved successfully',
    });
  }),

  /**
   * ✔️ PATCH /api/notifications/:id/read
   * Mark single notification as read
   *
   * Validates:
   * - Notification exists
   * - User is owner of notification
   *
   * Response:
   * {
   *   success: true,
   *   data: { notification },
   *   message: '...'
   * }
   */
  markAsRead: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const { id: notificationId } = req.params;

    const notification = await notificationService.markAsRead(
      notificationId,
      userId
    );

    res.status(200).json({
      success: true,
      data: { notification },
      message: 'Notification marked as read',
    });
  }),

  /**
   * ✔️ PATCH /api/notifications/read-all
   * Mark all unread notifications as read for user
   *
   * Response:
   * {
   *   success: true,
   *   data: { modifiedCount },
   *   message: '...'
   * }
   */
  markAllAsRead: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;

    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'All notifications marked as read',
    });
  }),

  /**
   * 🔢 GET /api/notifications/unread-count
   * Get count of unread notifications
   *
   * Response:
   * {
   *   success: true,
   *   data: { unreadCount },
   *   message: '...'
   * }
   */
  getUnreadCount: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;

    const unreadCount = await notificationService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount },
      message: 'Unread count retrieved successfully',
    });
  }),
};

export default notificationController;
