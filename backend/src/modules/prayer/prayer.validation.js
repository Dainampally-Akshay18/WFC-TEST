import Joi from 'joi';

/**
 * ============================================
 * PRAYER VALIDATION SCHEMAS (JOI)
 * ============================================
 *
 * Validates all prayer-related requests
 * Used with validateRequest middleware
 */

export const prayerValidation = {
  /**
   * Schema for creating a prayer request
   * Required: title, description
   * Optional: isAnonymous
   */
  createPrayerSchema: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(150)
      .messages({
        'string.empty': 'Prayer title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 150 characters',
      }),

    description: Joi.string()
      .required()
      .trim()
      .min(10)
      .max(2000)
      .messages({
        'string.empty': 'Prayer description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 2000 characters',
      }),

    isAnonymous: Joi.boolean()
      .optional()
      .default(false)
      .messages({
        'boolean.base': 'isAnonymous must be a boolean',
      }),
  }),

  /**
   * Schema for updating a prayer request
   * All fields optional (can update any of them)
   */
  updatePrayerSchema: Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .max(150)
      .optional()
      .messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 150 characters',
      }),

    description: Joi.string()
      .trim()
      .min(10)
      .max(2000)
      .optional()
      .messages({
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 2000 characters',
      }),

    isAnonymous: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'isAnonymous must be a boolean',
      }),
  }).min(1), // At least one field must be provided

  /**
   * Schema for updating prayer status
   * Only LEADER/MASTER_ADMIN can use this
   */
  updateStatusSchema: Joi.object({
    status: Joi.string()
      .required()
      .valid('ACTIVE', 'PRAYED', 'ARCHIVED')
      .messages({
        'string.empty': 'Status is required',
        'any.only': 'Status must be ACTIVE, PRAYED, or ARCHIVED',
      }),
  }),
};

export default prayerValidation;
