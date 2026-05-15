import blogService from './blog.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

/**
 * ============================================
 * BLOG CONTROLLER - HANDLES HTTP REQUESTS
 * ============================================
 * 
 * IMPORTANT:
 * - Only handles request/response
 * - ALL business logic in service layer
 * - Calls service and returns response
 * - Uses asyncHandler to catch errors
 */

export const blogController = {
  /**
   * 📝 POST /api/blogs
   * Create a new blog (draft)
   * ONLY MASTER_ADMIN can create blogs
   */
  createBlog: asyncHandler(async (req, res, next) => {
    const { title, content, tags, thumbnail } = req.body;
    const userId = req.user.userId; // From auth middleware

    const result = await blogService.createBlog(
      { title, content, tags, thumbnail },
      userId
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 📝 PUT /api/blogs/:id
   * Update blog content, title, tags, thumbnail
   * ONLY MASTER_ADMIN who created it can update
   */
  updateBlog: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, content, tags, thumbnail } = req.body;
    const userId = req.user.userId;

    const result = await blogService.updateBlog(
      id,
      { title, content, tags, thumbnail },
      userId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 🚀 PATCH /api/blogs/:id/publish
   * Publish a draft blog
   * Makes blog visible to all users
   * ONLY MASTER_ADMIN who created it can publish
   */
  publishBlog: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await blogService.publishBlog(id, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 📁 PATCH /api/blogs/:id/unpublish
   * Unpublish a published blog
   * Makes blog invisible to users (becomes draft)
   * ONLY MASTER_ADMIN who created it can unpublish
   */
  unpublishBlog: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await blogService.unpublishBlog(id, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * ❌ DELETE /api/blogs/:id
   * Delete a blog permanently
   * ONLY MASTER_ADMIN who created it can delete
   */
  deleteBlog: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await blogService.deleteBlog(id, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * 📖 GET /api/blogs
   * Get all blogs
   * USERS see only published blogs
   * ADMIN/LEADER see all blogs (draft + published)
   * 
   * Query params:
   * - search: Search by title/content
   * - tags: Filter by tags (comma-separated)
   */
  getAllBlogs: asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role || 'USER'; // From auth middleware
    const { search, tags } = req.query;

    // Parse tags array from comma-separated string
    const tagArray = tags ? tags.split(',').map(t => t.trim()) : [];

    const filters = {
      search: search || undefined,
      tags: tagArray.length > 0 ? tagArray : undefined,
    };
      const blogs = await blogService.getAllBlogs(userRole, filters);  // ✅ Add userRole

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  }),

  /**
   * 📖 GET /api/blogs/:slug
   * Get single published blog by slug
   * USERS can only access published blogs
   * ADMIN/LEADER can access any blog
   */
  getBlogBySlug: asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const userRole = req.user?.role || 'USER';

    const blog = await blogService.getBlogBySlug(slug, userRole);

    res.status(200).json({
      success: true,
      data: blog,
    });
  }),
};

export default blogController;
