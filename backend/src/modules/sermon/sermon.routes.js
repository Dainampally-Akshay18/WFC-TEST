import { Router } from 'express';
import sermonController from './sermon.controller.js';
import sermonValidation from './sermon.validation.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';

const sermonRouter = Router();

/**
 * ============================================
 * SERMON API ROUTES
 * ============================================
 *
 * Structure:
 * - Category management: /categories
 * - Sermon management: /
 * - Sermon actions: /:id/publish, /:id/unpublish
 *
 * Access Control:
 * - PUBLIC: Get categories, get published sermons
 * - USERS: View only
 * - LEADER/MASTER_ADMIN: Full CRUD + publish/unpublish
 */

// ============================================
// SERMON CATEGORY ROUTES
// ============================================

/**
 * POST /api/sermons/categories
 * Create new sermon category
 * Protected: LEADER/MASTER_ADMIN only
 */
sermonRouter.post(
  '/categories',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(sermonValidation.createCategorySchema),
  sermonController.createCategory
);

/**
 * GET /api/sermons/categories
 * Get all sermon categories
 * Protected: Authentication required (but visible to all roles)
 */
sermonRouter.get(
  '/categories',
  authMiddleware,
  sermonController.getCategories
);

/**
 * PUT /api/sermons/categories/:id
 * Update sermon category
 * Protected: LEADER/MASTER_ADMIN only
 */
sermonRouter.put(
  '/categories/:id',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(sermonValidation.updateCategorySchema),
  sermonController.updateCategory
);

/**
 * DELETE /api/sermons/categories/:id
 * Delete sermon category
 * Protected: LEADER/MASTER_ADMIN only
 * Note: Cannot delete if sermons exist in category
 */
sermonRouter.delete(
  '/categories/:id',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  sermonController.deleteCategory
);

// ============================================
// SERMON ROUTES
// ============================================

/**
 * POST /api/sermons
 * Create new sermon
 * Protected: LEADER/MASTER_ADMIN only
 * Note: Created in draft mode (isPublished = false)
 */
sermonRouter.post(
  '/',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(sermonValidation.createSermonSchema),
  sermonController.createSermon
);

/**
 * GET /api/sermons
 * Get all sermons (with filters)
 * Protected: Authentication required
 * Access Control:
 * - USERS: Only published sermons
 * - LEADER/MASTER_ADMIN: All sermons (draft + published)
 *
 * Optional Query Params:
 * - ?categoryId=xxx - Filter by category
 * - ?search=keywords - Search in title/description
 *
 * Examples:
 * GET /api/sermons
 * GET /api/sermons?categoryId=507f1f77bcf86cd799439011
 * GET /api/sermons?search=faith
 * GET /api/sermons?categoryId=507f1f77bcf86cd799439011&search=grace
 */
sermonRouter.get(
  '/',
  authMiddleware,
  sermonController.getAllSermons
);

/**
 * GET /api/sermons/:id
 * Get single sermon by ID
 * Protected: Authentication required
 * Access Control:
 * - USERS: Only published sermons
 * - LEADER/MASTER_ADMIN: All sermons
 */
sermonRouter.get(
  '/:id',
  authMiddleware,
  sermonController.getSermonById
);

/**
 * PUT /api/sermons/:id
 * Update sermon
 * Protected: LEADER/MASTER_ADMIN only
 * Note: If youtubeLink changes, videoId is regenerated
 */
sermonRouter.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  validateRequest(sermonValidation.updateSermonSchema),
  sermonController.updateSermon
);

/**
 * DELETE /api/sermons/:id
 * Delete sermon
 * Protected: LEADER/MASTER_ADMIN only
 */
sermonRouter.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  sermonController.deleteSermon
);

/**
 * PATCH /api/sermons/:id/publish
 * Publish sermon (make visible to users)
 * Protected: LEADER/MASTER_ADMIN only
 * Note: Sends notification to all approved users
 */
sermonRouter.patch(
  '/:id/publish',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  sermonController.publishSermon
);

/**
 * PATCH /api/sermons/:id/unpublish
 * Unpublish sermon (hide from users)
 * Protected: LEADER/MASTER_ADMIN only
 */
sermonRouter.patch(
  '/:id/unpublish',
  authMiddleware,
  roleMiddleware(['LEADER', 'MASTER_ADMIN']),
  sermonController.unpublishSermon
);

export default sermonRouter;
