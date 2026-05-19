import Joi from 'joi';

/**
 * ============================================
 * NOTIFICATION VALIDATION SCHEMAS (JOI)
 * ============================================
 *
 * Validates all notification-related requests
 * Used with validateRequest middleware
 */

export const notificationValidation = {
  /**
   * Schema for GET /api/notifications query parameters
   * Supports:
   * - Pagination: page, limit
   * - Filtering: isRead
   */
  getNotificationsSchema: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
      }),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional()
      .default(20)
      .messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100',
      }),

    isRead: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'isRead must be true or false',
      }),
  }),

  /**
   * Schema for PATCH /api/notifications/read-all
   * No body required - marks all unread as read
   */
  markAllAsReadSchema: Joi.object({})
    .allow()
    .messages({
      'object.base': 'Request body must be an object',
    }),

  /**
   * Schema for PATCH /api/notifications/:id/read
   * No body required - marks single notification as read
   */
  markAsReadSchema: Joi.object({})
    .allow()
    .messages({
      'object.base': 'Request body must be an object',
    }),
};
