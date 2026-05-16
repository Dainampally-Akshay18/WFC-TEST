import Joi from 'joi';

/**
 * ============================================
 * SERMON VALIDATION SCHEMAS (JOI)
 * ============================================
 *
 * Validates all sermon-related requests
 * Used with validateRequest middleware
 */

export const sermonValidation = {
  // ============================================
  // SERMON CATEGORY SCHEMAS
  // ============================================

  /**
   * Schema for creating a sermon category
   * Required: name, description
   */
  createCategorySchema: Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(50)
      .messages({
        'string.empty': 'Category name is required',
        'string.min': 'Category name must be at least 3 characters',
        'string.max': 'Category name cannot exceed 50 characters',
      }),

    description: Joi.string()
      .required()
      .trim()
      .min(10)
      .max(500)
      .messages({
        'string.empty': 'Category description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 500 characters',
      }),
  }),

  /**
   * Schema for updating a sermon category
   * Optional: name, description (at least one required)
   */
  updateCategorySchema: Joi.object({
    name: Joi.string().trim().min(3).max(50).messages({
      'string.min': 'Category name must be at least 3 characters',
      'string.max': 'Category name cannot exceed 50 characters',
    }),

    description: Joi.string().trim().min(10).max(500).messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 500 characters',
    }),
  }).min(1).messages({
    'object.min': 'At least one field (name or description) is required to update',
  }),

  // ============================================
  // SERMON SCHEMAS
  // ============================================

  /**
   * Schema for creating a sermon
   * Required: title, description, youtubeLink, categoryId
   * Optional: speakerName, thumbnail
   */
  createSermonSchema: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(200)
      .messages({
        'string.empty': 'Sermon title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 200 characters',
      }),

    description: Joi.string()
      .required()
      .trim()
      .min(10)
      .max(3000)
      .messages({
        'string.empty': 'Sermon description is required',
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 3000 characters',
      }),

    youtubeLink: Joi.string()
      .required()
      .uri()
      .pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
      .messages({
        'string.empty': 'YouTube link is required',
        'string.uri': 'YouTube link must be a valid URL',
        'string.pattern.base': 'Invalid YouTube URL. Please use youtube.com or youtu.be',
      }),

    categoryId: Joi.string()
      .required()
      .hex()
      .length(24)
      .messages({
        'string.empty': 'Category ID is required',
        'string.hex': 'Invalid category ID format',
        'string.length': 'Invalid category ID format',
      }),

    speakerName: Joi.string().trim().max(100).messages({
      'string.max': 'Speaker name cannot exceed 100 characters',
    }),

    thumbnail: Joi.string()
      .uri()
      .messages({
        'string.uri': 'Thumbnail must be a valid URL if provided',
      }),
  }),

  /**
   * Schema for updating a sermon
   * Optional: title, description, youtubeLink, categoryId, speakerName, thumbnail
   * (at least one field required)
   */
  updateSermonSchema: Joi.object({
    title: Joi.string().trim().min(3).max(200).messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 200 characters',
    }),

    description: Joi.string().trim().min(10).max(3000).messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 3000 characters',
    }),

    youtubeLink: Joi.string()
      .uri()
      .pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
      .messages({
        'string.uri': 'YouTube link must be a valid URL',
        'string.pattern.base': 'Invalid YouTube URL. Please use youtube.com or youtu.be',
      }),

    categoryId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.hex': 'Invalid category ID format',
        'string.length': 'Invalid category ID format',
      }),

    speakerName: Joi.string().trim().max(100).messages({
      'string.max': 'Speaker name cannot exceed 100 characters',
    }),

    thumbnail: Joi.string()
      .uri()
      .messages({
        'string.uri': 'Thumbnail must be a valid URL if provided',
      }),
  }).min(1).messages({
    'object.min': 'At least one field is required to update',
  }),
};

export default sermonValidation;
