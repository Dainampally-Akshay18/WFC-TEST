import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import { notificationValidation } from './notification.validation.js';
import { validateRequest } from '../../middleware/validate.middleware.js';

/**
 * ============================================
 * NOTIFICATION ROUTES
 * ============================================
 *
 * IMPORTANT:
 * - All routes require authMiddleware (applied in app.js)
 * - Routes are user-specific (notifications for logged-in user)
 * - Proper middleware order: validateRequest before controller
 *
 * Routes:
 * - GET /api/notifications - List user notifications
 * - GET /api/notifications/unread-count - Get unread count
 * - GET /api/notifications/:id - Get single notification
 * - PATCH /api/notifications/:id/read - Mark as read
 * - PATCH /api/notifications/read-all - Mark all as read
 */

const notificationRouter = Router();

// ============================================
// GET NOTIFICATIONS
// ============================================

/**
 * 📖 GET /api/notifications
 * Get all notifications for logged-in user
 * Supports pagination and filtering
 */
notificationRouter.get(
  '/',
  validateRequest(notificationValidation.getNotificationsSchema),
  notificationController.getNotifications
);

// ============================================
// UNREAD COUNT
// ============================================

/**
 * 🔢 GET /api/notifications/unread-count
 * Get count of unread notifications
 * Must come BEFORE /:id route
 */
notificationRouter.get(
  '/unread-count',
  notificationController.getUnreadCount
);

// ============================================
// MARK ALL AS READ
// ============================================

/**
 * ✔️ PATCH /api/notifications/read-all
 * Mark all unread notifications as read
 * Must come BEFORE /:id route
 */
notificationRouter.patch(
  '/read-all',
  validateRequest(notificationValidation.markAllAsReadSchema),
  notificationController.markAllAsRead
);

// ============================================
// SINGLE NOTIFICATION ROUTES
// ============================================

/**
 * 📄 GET /api/notifications/:id
 * Get single notification by ID
 * Validates ownership before returning
 */
notificationRouter.get(
  '/:id',
  notificationController.getNotificationById
);

/**
 * ✔️ PATCH /api/notifications/:id/read
 * Mark single notification as read
 * Validates ownership before updating
 */
notificationRouter.patch(
  '/:id/read',
  validateRequest(notificationValidation.markAsReadSchema),
  notificationController.markAsRead
);

export { notificationRouter };
