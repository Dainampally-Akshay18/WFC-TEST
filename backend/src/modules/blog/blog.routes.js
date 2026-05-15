import { Router } from 'express';
import blogController from './blog.controller.js';
import blogValidation from './blog.validation.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';

const blogRouter = Router();

/**
 * ============================================
 * PUBLIC ROUTES (No authentication required)
 * ============================================
 */

/**
 * GET /api/blogs
 * Get all published blogs
 * Users can search and filter by tags
 */
blogRouter.get(
  '/',
  blogController.getAllBlogs
);

/**
 * GET /api/blogs/:slug
 * Get single published blog by slug
 */
blogRouter.get(
  '/:slug',
  blogController.getBlogBySlug
);

/**
 * ============================================
 * ADMIN ROUTES (MASTER_ADMIN only)
 * ============================================
 */

/**
 * POST /api/blogs
 * Create new blog (draft)
 * ONLY MASTER_ADMIN can create
 */
blogRouter.post(
  '/',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validateRequest(blogValidation.createBlogSchema),
  blogController.createBlog
);

/**
 * PUT /api/blogs/:id
 * Update blog (title, content, tags, thumbnail)
 * ONLY MASTER_ADMIN who created it can update
 */
blogRouter.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  validateRequest(blogValidation.updateBlogSchema),
  blogController.updateBlog
);

/**
 * PATCH /api/blogs/:id/publish
 * Publish blog (make it visible to users)
 * ONLY MASTER_ADMIN who created it can publish
 */
blogRouter.patch(
  '/:id/publish',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  blogController.publishBlog
);

/**
 * PATCH /api/blogs/:id/unpublish
 * Unpublish blog (make it invisible to users)
 * ONLY MASTER_ADMIN who created it can unpublish
 */
blogRouter.patch(
  '/:id/unpublish',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  blogController.unpublishBlog
);

/**
 * DELETE /api/blogs/:id
 * Delete blog permanently
 * ONLY MASTER_ADMIN who created it can delete
 */
blogRouter.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['MASTER_ADMIN']),
  blogController.deleteBlog
);

export default blogRouter;
