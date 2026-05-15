import Blog from './blog.model.js';
import User from '../auth/auth.model.js';
import { generateSlug } from '../../utils/generateSlug.js';
import { notificationHelper } from '../../services/notification.helper.js';
import { auditHelper } from '../../services/audit.helper.js';

/**
 * ============================================
 * BLOG SERVICE - ALL BUSINESS LOGIC
 * ============================================
 * 
 * Handles:
 * - Creating blogs (MASTER_ADMIN only)
 * - Updating blogs (MASTER_ADMIN only)
 * - Publishing/unpublishing blogs
 * - Deleting blogs
 * - Fetching blogs (with visibility rules)
 * - Searching & filtering
 */

export const blogService = {
  /**
   * 📝 CREATE BLOG
   * Creates a new draft blog
   * Only MASTER_ADMIN can create blogs
   * 
   * @param {Object} blogData - { title, content, tags, thumbnail }
   * @param {String} userId - MASTER_ADMIN user ID
   * @returns {Promise<Object>} Created blog document
   */
  async createBlog(blogData, userId) {
    try {
      // ✅ Get author info
      const author = await User.findById(userId);
      if (!author) {
        throw new Error('Author not found');
      }

      // ✅ Generate SEO-friendly slug from title
      const slug = generateSlug(blogData.title);

      // ✅ Check if slug already exists
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        throw new Error(`Blog with slug "${slug}" already exists. Please use a different title.`);
      }

      // ✅ Create blog with draft status
      const blog = new Blog({
        title: blogData.title,
        content: blogData.content,
        authorId: userId,
        authorName: author.name,
        tags: blogData.tags || [],
        thumbnail: blogData.thumbnail || null,
        slug,
        isPublished: false, // ✅ Always create as draft
        publishedAt: null,
      });

      await blog.save();

      // ✅ Log audit trail
      await auditHelper.logBlogAction(
        'CREATE_BLOG',
        userId,
        'MASTER_ADMIN',
        blog._id,
        { title: blog.title, slug: blog.slug }
      );

      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        isPublished: blog.isPublished,
        createdAt: blog.createdAt,
        message: 'Blog created as draft',
      };
    } catch (error) {
      throw new Error(`Blog creation failed: ${error.message}`);
    }
  },

  /**
   * 📝 UPDATE BLOG
   * Updates blog content, title, tags, thumbnail
   * Only MASTER_ADMIN who created it can update
   * 
   * @param {String} blogId - Blog ID
   * @param {Object} updateData - { title, content, tags, thumbnail }
   * @param {String} userId - MASTER_ADMIN user ID
   * @returns {Promise<Object>} Updated blog document
   */
  async updateBlog(blogId, updateData, userId) {
    try {
      // ✅ Find blog
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }

      // ✅ Verify ownership (only creator can update)
      if (blog.authorId.toString() !== userId) {
        throw new Error('Unauthorized: Only blog author can update');
      }

      // ✅ Update allowed fields
      if (updateData.title) {
        blog.title = updateData.title;
        
        // Regenerate slug if title changed
        const newSlug = generateSlug(updateData.title);
        
        // Check if new slug is unique (excluding current blog)
        const conflictingBlog = await Blog.findOne({ 
          slug: newSlug,
          _id: { $ne: blogId }
        });
        
        if (conflictingBlog) {
          throw new Error(`Blog with slug "${newSlug}" already exists`);
        }
        
        blog.slug = newSlug;
      }

      if (updateData.content) {
        blog.content = updateData.content;
      }

      if (updateData.tags !== undefined) {
        blog.tags = updateData.tags || [];
      }

      if (updateData.thumbnail !== undefined) {
        blog.thumbnail = updateData.thumbnail || null;
      }

      await blog.save();

      // ✅ Log audit trail
      await auditHelper.logBlogAction(
        'UPDATE_BLOG',
        userId,
        'MASTER_ADMIN',
        blog._id,
        { title: blog.title, updated_fields: Object.keys(updateData) }
      );

      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        isPublished: blog.isPublished,
        updatedAt: blog.updatedAt,
        message: 'Blog updated successfully',
      };
    } catch (error) {
      throw new Error(`Blog update failed: ${error.message}`);
    }
  },

  /**
   * 🚀 PUBLISH BLOG
   * Publishes a draft blog (makes it visible to users)
   * Sets isPublished = true and publishedAt = now
   * 
   * @param {String} blogId - Blog ID
   * @param {String} userId - MASTER_ADMIN user ID
   * @returns {Promise<Object>} Published blog document
   */
  async publishBlog(blogId, userId) {
    try {
      // ✅ Find blog
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }

      // ✅ Verify ownership
      if (blog.authorId.toString() !== userId) {
        throw new Error('Unauthorized: Only blog author can publish');
      }

      // ✅ Validate content exists
      if (!blog.content || blog.content.trim().length === 0) {
        throw new Error('Cannot publish: Blog must have content');
      }

      // ✅ Already published?
      if (blog.isPublished) {
        throw new Error('Blog is already published');
      }

      // ✅ Publish blog
      blog.isPublished = true;
      blog.publishedAt = new Date();

      await blog.save();

      // ✅ Create notifications for all approved users
      const notificationCount = await notificationHelper.notifyAllApprovedUsers(
        'New Blog Post Published',
        `Pastor has published a new blog: "${blog.title}"`,
        'BLOG',
        blog._id
      );

      // ✅ Log audit trail
      await auditHelper.logBlogAction(
        'PUBLISH_BLOG',
        userId,
        'MASTER_ADMIN',
        blog._id,
        { title: blog.title, notified_users: notificationCount }
      );

      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        isPublished: blog.isPublished,
        publishedAt: blog.publishedAt,
        notifications_sent: notificationCount,
        message: 'Blog published successfully',
      };
    } catch (error) {
      throw new Error(`Blog publish failed: ${error.message}`);
    }
  },

  /**
   * 📁 UNPUBLISH BLOG
   * Unpublishes a blog (makes it invisible to users)
   * Sets isPublished = false
   * 
   * @param {String} blogId - Blog ID
   * @param {String} userId - MASTER_ADMIN user ID
   * @returns {Promise<Object>} Unpublished blog document
   */
  async unpublishBlog(blogId, userId) {
    try {
      // ✅ Find blog
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }

      // ✅ Verify ownership
      if (blog.authorId.toString() !== userId) {
        throw new Error('Unauthorized: Only blog author can unpublish');
      }

      // ✅ Already unpublished?
      if (!blog.isPublished) {
        throw new Error('Blog is already in draft mode');
      }

      // ✅ Unpublish blog
      blog.isPublished = false;

      await blog.save();

      // ✅ Log audit trail
      await auditHelper.logBlogAction(
        'UNPUBLISH_BLOG',
        userId,
        'MASTER_ADMIN',
        blog._id,
        { title: blog.title }
      );

      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        isPublished: blog.isPublished,
        message: 'Blog unpublished successfully',
      };
    } catch (error) {
      throw new Error(`Blog unpublish failed: ${error.message}`);
    }
  },

  /**
   * ❌ DELETE BLOG
   * Deletes a blog permanently
   * 
   * @param {String} blogId - Blog ID
   * @param {String} userId - MASTER_ADMIN user ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteBlog(blogId, userId) {
    try {
      // ✅ Find blog
      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }

      // ✅ Verify ownership
      if (blog.authorId.toString() !== userId) {
        throw new Error('Unauthorized: Only blog author can delete');
      }

      // ✅ Delete blog
      await Blog.findByIdAndDelete(blogId);

      // ✅ Log audit trail
      await auditHelper.logBlogAction(
        'DELETE_BLOG',
        userId,
        'MASTER_ADMIN',
        blogId,
        { title: blog.title, slug: blog.slug, was_published: blog.isPublished }
      );

      return {
        _id: blog._id,
        title: blog.title,
        message: 'Blog deleted successfully',
      };
    } catch (error) {
      throw new Error(`Blog deletion failed: ${error.message}`);
    }
  },

  /**
   * 📖 GET ALL BLOGS
   * Fetches blogs with filters and search
   * USERS see only published blogs
   * ADMIN/LEADER see all blogs (draft + published)
   * 
   * @param {String} userRole - User role (USER, LEADER, MASTER_ADMIN)
   * @param {Object} filters - { search, tags, isPublished }
   * @returns {Promise<Array>} Array of blogs
   */
  async getAllBlogs(userRole, filters = {}) {
    try {
      let query = {};

      // ✅ Access control: USERS only see published blogs
      if (userRole === 'USER') {
        query.isPublished = true;
      }
      // ✅ ADMIN/LEADER see all blogs

      // ✅ Search by title or content (full-text search)
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      // ✅ Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      // ✅ Query and sort (newest first)
      const blogs = await Blog.find(query)
        .select('-content') // Exclude content for list view (performance)
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean();

      return blogs;
    } catch (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }
  },

  /**
   * 📖 GET SINGLE BLOG BY SLUG
   * Fetches a single published blog by slug
   * USERS can only access published blogs
   * ADMIN/LEADER can access any blog (draft or published)
   * 
   * @param {String} slug - Blog slug
   * @param {String} userRole - User role
   * @returns {Promise<Object>} Blog document
   */
  async getBlogBySlug(slug, userRole) {
    try {
      let query = { slug };

      // ✅ Access control
      if (userRole === 'USER') {
        query.isPublished = true;
      }

      const blog = await Blog.findOne(query);

      if (!blog) {
        throw new Error('Blog not found');
      }

      return blog;
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  },

  /**
   * 📖 GET SINGLE BLOG BY ID
   * Internal method to get blog by ID
   * Used by controllers for admin operations
   * 
   * @param {String} blogId - Blog ID
   * @returns {Promise<Object>} Blog document
   */
  async getBlogById(blogId) {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        throw new Error('Blog not found');
      }

      return blog;
    } catch (error) {
      throw new Error(`Failed to fetch blog: ${error.message}`);
    }
  },
};

export default blogService;
