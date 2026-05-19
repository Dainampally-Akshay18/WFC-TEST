import Joi from 'joi';

/**
 * ============================================
 * AUDIT VALIDATION SCHEMAS (JOI)
 * ============================================
 *
 * Validates all audit-related requests
 * Used with validateRequest middleware
 */

export const auditValidation = {
  /**
   * Schema for audit log query parameters
   * Used by GET /api/audit
   */
  getAuditLogsSchema: Joi.object({
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
      .messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100',
      }),

    action: Joi.string()
      .optional()
      .messages({
        'string.base': 'Action must be a string',
      }),

    performerRole: Joi.string()
      .valid('USER', 'LEADER', 'MASTER_ADMIN')
      .optional()
      .messages({
        'any.only': 'Performer role must be USER, LEADER, or MASTER_ADMIN',
      }),

    targetType: Joi.string()
      .valid('USER', 'BLOG', 'EVENT', 'PRAYER', 'SERMON', 'NOTIFICATION', 'SERMON_CATEGORY')
      .optional()
      .messages({
        'any.only': 'Target type must be USER, BLOG, EVENT, PRAYER, SERMON, NOTIFICATION, or SERMON_CATEGORY',
      }),

    branch: Joi.string()
      .optional()
      .messages({
        'string.base': 'Branch must be a string',
      }),

    startDate: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Start date must be a valid ISO date',
      }),

    endDate: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'End date must be a valid ISO date',
      }),
  }).unknown(false),

  /**
   * Schema for audit statistics query parameters
   * Used by GET /api/audit/statistics
   */
  getAuditStatisticsSchema: Joi.object({
    startDate: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Start date must be a valid ISO date',
      }),

    endDate: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'End date must be a valid ISO date',
      }),

    branch: Joi.string()
      .optional()
      .messages({
        'string.base': 'Branch must be a string',
      }),
  }).unknown(false),
};

export default auditValidation;
