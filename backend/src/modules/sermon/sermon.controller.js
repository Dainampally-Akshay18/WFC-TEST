import sermonService from './sermon.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * SERMON CONTROLLER - HTTP HANDLERS
 * ============================================
 *
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 *
 * Handlers:
 * - Category: createCategory, getCategories, updateCategory, deleteCategory
 * - Sermon: createSermon, getAllSermons, getSermonById, updateSermon, deleteSermon, publishSermon, unpublishSermon
 */

export const sermonController = {
  // ============================================
  // SERMON CATEGORY HANDLERS
  // ============================================

  /**
   * 📂 POST /api/sermons/categories
   * Create new sermon category
   */
  createCategory: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.createCategory(
      req.body,
      userId,
      userRole
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Sermon category created successfully',
    });
  }),

  /**
   * 📂 GET /api/sermons/categories
   * Get all sermon categories
   */
  getCategories: asyncHandler(async (req, res, next) => {
    const result = await sermonService.getCategories();

    res.status(200).json({
      success: true,
      data: result,
      count: result.length,
      message: 'Categories retrieved successfully',
    });
  }),

  /**
   * 📂 PUT /api/sermons/categories/:id
   * Update sermon category
   */
  updateCategory: asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.updateCategory(
      categoryId,
      req.body,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon category updated successfully',
    });
  }),

  /**
   * 📂 DELETE /api/sermons/categories/:id
   * Delete sermon category
   */
  deleteCategory: asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.deleteCategory(
      categoryId,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon category deleted successfully',
    });
  }),

  // ============================================
  // SERMON HANDLERS
  // ============================================

  /**
   * 🎥 POST /api/sermons
   * Create new sermon
   */
  createSermon: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.createSermon(
      req.body,
      userId,
      userRole
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Sermon created successfully',
    });
  }),

  /**
   * 🎥 GET /api/sermons
   * Get all sermons with optional filters
   * Query params: ?categoryId=xxx&search=yyy
   */
  getAllSermons: asyncHandler(async (req, res, next) => {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const filters = {
      ...(req.query.categoryId && { categoryId: req.query.categoryId }),
      ...(req.query.search && { search: req.query.search }),
    };

    const result = await sermonService.getAllSermons(
      userId,
      userRole,
      filters
    );

    res.status(200).json({
      success: true,
      data: result,
      count: result.length,
      message: 'Sermons retrieved successfully',
    });
  }),

  /**
   * 🎥 GET /api/sermons/:id
   * Get single sermon by ID
   */
  getSermonById: asyncHandler(async (req, res, next) => {
    const sermonId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.getSermonById(
      sermonId,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon retrieved successfully',
    });
  }),

  /**
   * 🎥 PUT /api/sermons/:id
   * Update sermon
   */
  updateSermon: asyncHandler(async (req, res, next) => {
    const sermonId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.updateSermon(
      sermonId,
      req.body,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon updated successfully',
    });
  }),

  /**
   * 🎥 DELETE /api/sermons/:id
   * Delete sermon
   */
  deleteSermon: asyncHandler(async (req, res, next) => {
    const sermonId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.deleteSermon(
      sermonId,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon deleted successfully',
    });
  }),

  /**
   * 📌 PATCH /api/sermons/:id/publish
   * Publish sermon
   */
  publishSermon: asyncHandler(async (req, res, next) => {
    const sermonId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.publishSermon(
      sermonId,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon published successfully',
    });
  }),

  /**
   * 📌 PATCH /api/sermons/:id/unpublish
   * Unpublish sermon
   */
  unpublishSermon: asyncHandler(async (req, res, next) => {
    const sermonId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const result = await sermonService.unpublishSermon(
      sermonId,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      data: result,
      message: 'Sermon unpublished successfully',
    });
  }),
};

export default sermonController;
