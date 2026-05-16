import Joi from 'joi';

/**
 * ============================================
 * EVENT VALIDATION SCHEMAS (JOI)
 * ============================================
 * 
 * Validates all event-related requests
 * Used with validateRequest middleware
 */

export const eventValidation = {
  /**
   * Schema for creating an event
   * Required: title, description, date, time, location, visibility
   * Optional: branch (required if visibility = BRANCH)
   */
  createEventSchema: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(100)
      .messages({
        'string.empty': 'Event title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 100 characters',
      }),

    description: Joi.string()
      .required()
      .min(10)
      .messages({
        'string.empty': 'Event description is required',
        'string.min': 'Description must be at least 10 characters',
      }),

    date: Joi.date()
      .required()
      .greater('now')
      .messages({
        'date.base': 'Date must be a valid date',
        'date.greater': 'Date must be in the future',
      }),

    time: Joi.string()
      .required()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        'string.empty': 'Time is required',
        'string.pattern.base': 'Time must be in HH:MM format (24-hour)',
      }),

    location: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(100)
      .messages({
        'string.empty': 'Location is required',
      }),

    visibility: Joi.string()
      .required()
      .valid('BRANCH', 'GLOBAL')
      .messages({
        'any.only': 'Visibility must be either BRANCH or GLOBAL',
      }),

    branch: Joi.string()
      .valid('BRANCH1', 'BRANCH2')
      .optional()
      .allow(null)
      .messages({
        'any.only': 'Branch must be BRANCH1 or BRANCH2',
      }),
  }),

  /**
   * Schema for updating an event
   * All fields optional (can update any of them)
   */
  updateEventSchema: Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 100 characters',
      }),

    description: Joi.string()
      .min(10)
      .optional()
      .messages({
        'string.min': 'Description must be at least 10 characters',
      }),

    date: Joi.date()
      .greater('now')
      .optional()
      .messages({
        'date.greater': 'Date must be in the future',
      }),

    time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional()
      .messages({
        'string.pattern.base': 'Time must be in HH:MM format',
      }),

    location: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .optional(),

    visibility: Joi.string()
      .valid('BRANCH', 'GLOBAL')
      .optional()
      .messages({
        'any.only': 'Visibility must be BRANCH or GLOBAL',
      }),

    branch: Joi.string()
      .valid('BRANCH1', 'BRANCH2')
      .optional()
      .allow(null),
  }).min(1), // At least one field must be provided
};

export default eventValidation;
