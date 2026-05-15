import Joi from 'joi';

/**
 * ============================================
 * BLOG VALIDATION SCHEMAS (JOI)
 * ============================================
 * 
 * Validates all blog-related requests
 * Used with validateRequest middleware
 */

export const blogValidation = {
  /**
   * Schema for creating a blog
   * Required: title, content
   * Optional: tags, thumbnail
   */
  createBlogSchema: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(200)
      .messages({
        'string.empty': 'Blog title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 200 characters',
      }),

    content: Joi.string()
      .required()
      .min(10)
      .messages({
        'string.empty': 'Blog content is required',
        'string.min': 'Content must be at least 10 characters',
      }),

    tags: Joi.array()
      .items(Joi.string().trim().min(1).max(50))
      .optional()
      .default([]),

    thumbnail: Joi.string()
      .uri()
      .optional()
      .allow(null, ''),
  }),

  /**
   * Schema for updating a blog
   * All fields optional (can update any of them)
   */
  updateBlogSchema: Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 200 characters',
      }),

    content: Joi.string()
      .min(10)
      .optional()
      .messages({
        'string.min': 'Content must be at least 10 characters',
      }),

    tags: Joi.array()
      .items(Joi.string().trim().min(1).max(50))
      .optional(),

    thumbnail: Joi.string()
      .uri()
      .optional()
      .allow(null, ''),
  }).min(1), // At least one field must be provided

  /**
   * Schema for search and filter params
   */
  searchBlogsSchema: Joi.object({
    search: Joi.string()
      .trim()
      .optional()
      .max(200),

    tags: Joi.string()
      .trim()
      .optional()
      // Comma-separated tags will be parsed in controller
      .messages({
        'string.base': 'Tags must be a comma-separated string',
      }),
  }),
};

export default blogValidation;
