import { SermonCategory, Sermon } from './sermon.model.js';
import User from '../auth/auth.model.js';
import { Notification } from '../notification/notification.model.js';
import { auditHelper } from '../../services/audit.helper.js';
import { notificationHelper } from '../../services/notification.helper.js';
import extractYoutubeId from '../../utils/extractYoutubeId.js';

/**
 * ============================================
 * SERMON SERVICE - ALL BUSINESS LOGIC
 * ============================================
 *
 * IMPORTANT: All business logic MUST be here
 * Controllers should only call service methods
 * and return responses
 *
 * Features:
 * - Category Management (CREATE, READ, UPDATE, DELETE)
 * - Sermon Management (CREATE, READ, UPDATE, DELETE, PUBLISH, UNPUBLISH)
 * - YouTube video ID extraction
 * - Access control validation
 * - Audit logging
 * - Notification integration
 */

export const sermonService = {
  // ============================================
  // SERMON CATEGORY OPERATIONS
  // ============================================

  /**
   * 📂 CREATE SERMON CATEGORY
   * Only LEADER/MASTER_ADMIN can create categories
   *
   * @param {Object} categoryData - { name, description }
   * @param {String} userId - Who's creating it
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can create categories');
      }

      // ✅ Check for duplicate category name
      const existingCategory = await SermonCategory.findOne({
        name: categoryData.name,
      });
      if (existingCategory) {
        throw new Error('Category with this name already exists');
      }

      // ✅ Create category
      const newCategory = new SermonCategory({
        name: categoryData.name,
        description: categoryData.description,
        createdBy: userId,
      });

      await newCategory.save();

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'CREATE_SERMON_CATEGORY',
        performedBy: userId,
        performerRole: userRole,
        targetId: newCategory._id,
        targetType: 'SERMON_CATEGORY',
        metadata: { categoryName: categoryData.name },
      });

      return newCategory;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  },

  /**
   * 📂 GET ALL SERMON CATEGORIES
   * Anyone can view categories
   *
   * @returns {Promise<Array>} All categories
   */
  async getCategories() {
    try {
      const categories = await SermonCategory.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },

  /**
   * 📂 UPDATE SERMON CATEGORY
   * Only LEADER/MASTER_ADMIN can update
   *
   * @param {String} categoryId - Category ID
   * @param {Object} updateData - { name?, description? }
   * @param {String} userId - Who's updating
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(categoryId, updateData, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can update categories');
      }

      // ✅ Check if category exists
      const category = await SermonCategory.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // ✅ If name is being updated, check for duplicates
      if (updateData.name && updateData.name !== category.name) {
        const existingCategory = await SermonCategory.findOne({
          name: updateData.name,
        });
        if (existingCategory) {
          throw new Error('Another category with this name already exists');
        }
      }

      // ✅ Update category
      const updatedCategory = await SermonCategory.findByIdAndUpdate(
        categoryId,
        {
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.description && {
            description: updateData.description,
          }),
        },
        { new: true, runValidators: true }
      );

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'UPDATE_SERMON_CATEGORY',
        performedBy: userId,
        performerRole: userRole,
        targetId: categoryId,
        targetType: 'SERMON_CATEGORY',
        metadata: { updatedFields: Object.keys(updateData) },
      });

      return updatedCategory;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  },

  /**
   * 📂 DELETE SERMON CATEGORY
   * Only LEADER/MASTER_ADMIN can delete
   * Cannot delete if sermons exist in this category
   *
   * @param {String} categoryId - Category ID
   * @param {String} userId - Who's deleting
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteCategory(categoryId, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can delete categories');
      }

      // ✅ Check if category exists
      const category = await SermonCategory.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // ✅ Check if sermons exist in this category
      const sermonCount = await Sermon.countDocuments({ categoryId });
      if (sermonCount > 0) {
        throw new Error(
          `Cannot delete category with ${sermonCount} sermon(s). Delete or reassign sermons first.`
        );
      }

      // ✅ Delete category
      await SermonCategory.findByIdAndDelete(categoryId);

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'DELETE_SERMON_CATEGORY',
        performedBy: userId,
        performerRole: userRole,
        targetId: categoryId,
        targetType: 'SERMON_CATEGORY',
        metadata: { categoryName: category.name },
      });

      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  },

  // ============================================
  // SERMON OPERATIONS
  // ============================================

  /**
   * 🎥 CREATE SERMON
   * Only LEADER/MASTER_ADMIN can create sermons
   * - Extract youtubeVideoId from youtubeLink
   * - Default isPublished = false
   * - Generate default thumbnail if not provided
   *
   * @param {Object} sermonData - Sermon details
   * @param {String} userId - Who's creating
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Created sermon
   */
  async createSermon(sermonData, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can create sermons');
      }

      // ✅ Validate YouTube link and extract video ID
      const youtubeVideoId = extractYoutubeId(sermonData.youtubeLink);
      if (!youtubeVideoId) {
        throw new Error('Invalid YouTube URL. Please use a valid YouTube link.');
      }

      // ✅ Check if video already exists
      const existingSermon = await Sermon.findOne({ youtubeVideoId });
      if (existingSermon) {
        throw new Error(
          'A sermon with this YouTube video already exists in the system'
        );
      }

      // ✅ Validate category exists
      const category = await SermonCategory.findById(sermonData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // ✅ Generate default thumbnail if not provided
      const thumbnail =
        sermonData.thumbnail ||
        `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;

      // ✅ Create sermon
      const newSermon = new Sermon({
        title: sermonData.title,
        description: sermonData.description,
        youtubeLink: sermonData.youtubeLink,
        youtubeVideoId,
        categoryId: sermonData.categoryId,
        speakerName: sermonData.speakerName || null,
        thumbnail,
        isPublished: false, // Default: draft
        createdBy: userId,
      });

      await newSermon.save();

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'CREATE_SERMON',
        performedBy: userId,
        performerRole: userRole,
        targetId: newSermon._id,
        targetType: 'SERMON',
        metadata: { title: sermonData.title, videoId: youtubeVideoId },
      });

      return newSermon;
    } catch (error) {
      throw new Error(`Failed to create sermon: ${error.message}`);
    }
  },

  /**
   * 🎥 GET ALL SERMONS
   * USERS: Only see published sermons
   * LEADER/MASTER_ADMIN: See all sermons (draft + published)
   *
   * Supports filtering:
   * - categoryId: Filter by category
   * - search: Search in title and description
   *
   * @param {String} userId - Who's requesting
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @param {Object} filters - { categoryId?, search? }
   * @returns {Promise<Array>} Sermons
   */
  async getAllSermons(userId, userRole, filters = {}) {
    try {
      let query = {};

      // ✅ Access Control: USERS only see published
      if (userRole === 'USER') {
        query.isPublished = true;
      }

      // ✅ Apply category filter if provided
      if (filters.categoryId) {
        query.categoryId = filters.categoryId;
      }

      // ✅ Apply search filter if provided
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      // ✅ Query sermons
      const sermons = await Sermon.find(query)
        .populate('categoryId', 'name description')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      return sermons;
    } catch (error) {
      throw new Error(`Failed to fetch sermons: ${error.message}`);
    }
  },

  /**
   * 🎥 GET SINGLE SERMON
   * USERS: Only see published sermons
   * LEADER/MASTER_ADMIN: See any sermon
   *
   * @param {String} sermonId - Sermon ID
   * @param {String} userId - Who's requesting
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Sermon details
   */
  async getSermonById(sermonId, userId, userRole) {
    try {
      // ✅ Query sermon
      const sermon = await Sermon.findById(sermonId)
        .populate('categoryId', 'name description')
        .populate('createdBy', 'name email');

      if (!sermon) {
        throw new Error('Sermon not found');
      }

      // ✅ Access Control: USERS only see published
      if (userRole === 'USER' && !sermon.isPublished) {
        throw new Error('You do not have permission to view this sermon');
      }

      return sermon;
    } catch (error) {
      throw new Error(`Failed to fetch sermon: ${error.message}`);
    }
  },

  /**
   * 🎥 UPDATE SERMON
   * Only LEADER/MASTER_ADMIN can update
   * If youtubeLink changes, regenerate youtubeVideoId
   *
   * @param {String} sermonId - Sermon ID
   * @param {Object} updateData - Updated fields
   * @param {String} userId - Who's updating
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Updated sermon
   */
  async updateSermon(sermonId, updateData, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can update sermons');
      }

      // ✅ Check if sermon exists
      const sermon = await Sermon.findById(sermonId);
      if (!sermon) {
        throw new Error('Sermon not found');
      }

      // ✅ If YouTube link is being updated, extract new video ID
      let youtubeVideoId = sermon.youtubeVideoId;
      let thumbnail = sermon.thumbnail;

      if (updateData.youtubeLink && updateData.youtubeLink !== sermon.youtubeLink) {
        youtubeVideoId = extractYoutubeId(updateData.youtubeLink);
        if (!youtubeVideoId) {
          throw new Error('Invalid YouTube URL');
        }

        // Check for duplicate
        const existingSermon = await Sermon.findOne({
          youtubeVideoId,
          _id: { $ne: sermonId }, // Exclude current sermon
        });
        if (existingSermon) {
          throw new Error(
            'A sermon with this YouTube video already exists in the system'
          );
        }

        // Update thumbnail if link changed
        if (!updateData.thumbnail) {
          thumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
        }
      }

      // ✅ If category is being updated, validate it exists
      if (updateData.categoryId) {
        const category = await SermonCategory.findById(updateData.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }
      }

      // ✅ Update sermon
      const updatedSermon = await Sermon.findByIdAndUpdate(
        sermonId,
        {
          ...(updateData.title && { title: updateData.title }),
          ...(updateData.description && { description: updateData.description }),
          ...(updateData.youtubeLink && {
            youtubeLink: updateData.youtubeLink,
            youtubeVideoId,
          }),
          ...(updateData.categoryId && { categoryId: updateData.categoryId }),
          ...(updateData.speakerName !== undefined && {
            speakerName: updateData.speakerName,
          }),
          ...(updateData.thumbnail !== undefined && { thumbnail: updateData.thumbnail || thumbnail }),
        },
        { new: true, runValidators: true }
      )
        .populate('categoryId', 'name description')
        .populate('createdBy', 'name email');

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'UPDATE_SERMON',
        performedBy: userId,
        performerRole: userRole,
        targetId: sermonId,
        targetType: 'SERMON',
        metadata: { updatedFields: Object.keys(updateData) },
      });

      return updatedSermon;
    } catch (error) {
      throw new Error(`Failed to update sermon: ${error.message}`);
    }
  },

  /**
   * 🎥 DELETE SERMON
   * Only LEADER/MASTER_ADMIN can delete
   *
   * @param {String} sermonId - Sermon ID
   * @param {String} userId - Who's deleting
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteSermon(sermonId, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can delete sermons');
      }

      // ✅ Check if sermon exists
      const sermon = await Sermon.findById(sermonId);
      if (!sermon) {
        throw new Error('Sermon not found');
      }

      // ✅ Delete sermon
      await Sermon.findByIdAndDelete(sermonId);

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'DELETE_SERMON',
        performedBy: userId,
        performerRole: userRole,
        targetId: sermonId,
        targetType: 'SERMON',
        metadata: { title: sermon.title },
      });

      return { message: 'Sermon deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete sermon: ${error.message}`);
    }
  },

  /**
   * 📌 PUBLISH SERMON
   * Only LEADER/MASTER_ADMIN can publish
   * Sets isPublished = true
   * Sends notification to all approved users
   *
   * @param {String} sermonId - Sermon ID
   * @param {String} userId - Who's publishing
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Updated sermon
   */
  async publishSermon(sermonId, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error(
          'Only LEADER and MASTER_ADMIN can publish sermons'
        );
      }

      // ✅ Check if sermon exists
      const sermon = await Sermon.findById(sermonId);
      if (!sermon) {
        throw new Error('Sermon not found');
      }

      // ✅ Already published?
      if (sermon.isPublished) {
        throw new Error('Sermon is already published');
      }

      // ✅ Publish sermon
      const publishedSermon = await Sermon.findByIdAndUpdate(
        sermonId,
        { isPublished: true },
        { new: true }
      )
        .populate('categoryId', 'name description')
        .populate('createdBy', 'name email');

      // ✅ Notify all approved users
      const approvedUsers = await User.find({ status: 'APPROVED' }).select('_id');
      const userIds = approvedUsers.map((user) => user._id);

      if (userIds.length > 0) {
        await notificationHelper.createNotificationsForUsers(
          userIds,
          '🎤 New Sermon Published',
          `New sermon: "${publishedSermon.title}" is now available to watch`,
          'SERMON',
          sermonId
        );
      }

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'PUBLISH_SERMON',
        performedBy: userId,
        performerRole: userRole,
        targetId: sermonId,
        targetType: 'SERMON',
        metadata: { title: sermon.title },
      });

      return publishedSermon;
    } catch (error) {
      throw new Error(`Failed to publish sermon: ${error.message}`);
    }
  },

  /**
   * 📌 UNPUBLISH SERMON
   * Only LEADER/MASTER_ADMIN can unpublish
   * Sets isPublished = false
   *
   * @param {String} sermonId - Sermon ID
   * @param {String} userId - Who's unpublishing
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @returns {Promise<Object>} Updated sermon
   */
  async unpublishSermon(sermonId, userId, userRole) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error(
          'Only LEADER and MASTER_ADMIN can unpublish sermons'
        );
      }

      // ✅ Check if sermon exists
      const sermon = await Sermon.findById(sermonId);
      if (!sermon) {
        throw new Error('Sermon not found');
      }

      // ✅ Not published?
      if (!sermon.isPublished) {
        throw new Error('Sermon is already unpublished');
      }

      // ✅ Unpublish sermon
      const unpublishedSermon = await Sermon.findByIdAndUpdate(
        sermonId,
        { isPublished: false },
        { new: true }
      )
        .populate('categoryId', 'name description')
        .populate('createdBy', 'name email');

      // ✅ Audit Log
      await auditHelper.logAction({
        action: 'UNPUBLISH_SERMON',
        performedBy: userId,
        performerRole: userRole,
        targetId: sermonId,
        targetType: 'SERMON',
        metadata: { title: sermon.title },
      });

      return unpublishedSermon;
    } catch (error) {
      throw new Error(`Failed to unpublish sermon: ${error.message}`);
    }
  },
};

export default sermonService;
