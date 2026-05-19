import Prayer from './prayer.model.js';
import { Notification } from '../notification/notification.model.js';
import User from '../auth/auth.model.js';
import { auditHelper } from '../../services/audit.helper.js';

/**
 * ============================================
 * PRAYER SERVICE - ALL BUSINESS LOGIC
 * ============================================
 *
 * IMPORTANT: All business logic MUST be here
 * Controllers should only call service methods
 * and return responses
 */

export const prayerService = {
  /**
   * 🙏 CREATE PRAYER REQUEST
   * Logic:
   * - If isAnonymous = true → creatorName = "Anonymous"
   * - Otherwise → creatorName = user.name
   * - Default status = "ACTIVE"
   * - Default prayerCount = 0, prayedBy = []
   *
   * Audit: logs CREATE_PRAYER action
   */
  async createPrayer(prayerData, userId, userRole) {
    try {
      // ✅ Get user to get their name
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // ✅ Prepare creator name based on isAnonymous flag
      const creatorName = prayerData.isAnonymous ? 'Anonymous' : user.name;

      // ✅ Create prayer request
      const newPrayer = new Prayer({
        title: prayerData.title,
        description: prayerData.description,
        isAnonymous: prayerData.isAnonymous || false,
        createdBy: userId,
        creatorName,
        status: 'ACTIVE',
        prayerCount: 0,
        prayedBy: [],
      });

      await newPrayer.save();

      // ✅ Log audit action
      await auditHelper.logAction({
        action: 'CREATE_PRAYER',
        performedBy: userId,
        performerRole: userRole,
        targetId: newPrayer._id,
        targetType: 'PRAYER',
        metadata: {
          title: newPrayer.title,
          isAnonymous: newPrayer.isAnonymous,
        },
      });

      return newPrayer;
    } catch (error) {
      throw new Error(`Failed to create prayer: ${error.message}`);
    }
  },

  /**
   * 📖 GET ALL PRAYERS
   * Logic:
   * - Return all prayers
   * - Sort by createdAt descending (newest first)
   * - Include prayerCount and hasPrayed for current user
   *
   * For each prayer:
   * - hasPrayed = whether current user has prayed
   */
  async getAllPrayers(userId) {
    try {
      // ✅ Fetch all prayers sorted by newest first
      const prayers = await Prayer.find({})
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name email')
        .lean();

      // ✅ Enrich with hasPrayed flag for current user
      const enrichedPrayers = prayers.map((prayer) => ({
        ...prayer,
        prayerCount: prayer.prayedBy.length,
        hasPrayed: prayer.prayedBy.some(
          (prayedById) => prayedById.toString() === userId.toString()
        ),
      }));

      return enrichedPrayers;
    } catch (error) {
      throw new Error(`Failed to fetch prayers: ${error.message}`);
    }
  },

  /**
   * 🔍 GET PRAYER BY ID
   * Logic:
   * - Find prayer by ID
   * - Include prayerCount and hasPrayed for current user
   */
  async getPrayerById(prayerId, userId) {
    try {
      // ✅ Find prayer by ID
      const prayer = await Prayer.findById(prayerId)
        .populate('createdBy', 'name email')
        .lean();

      if (!prayer) {
        throw new Error('Prayer request not found');
      }

      // ✅ Enrich with hasPrayed flag
      return {
        ...prayer,
        prayerCount: prayer.prayedBy.length,
        hasPrayed: prayer.prayedBy.some(
          (prayedById) => prayedById.toString() === userId.toString()
        ),
      };
    } catch (error) {
      throw new Error(`Failed to fetch prayer: ${error.message}`);
    }
  },

  /**
   * ✏️ UPDATE PRAYER REQUEST
   * Rules:
   * - USER: can only update their own prayers
   * - LEADER/MASTER_ADMIN: can update any prayer
   *
   * Audit: logs UPDATE_PRAYER action
   */
  async updatePrayer(prayerId, updateData, userId, userRole) {
    try {
      // ✅ Find prayer
      const prayer = await Prayer.findById(prayerId);
      if (!prayer) {
        throw new Error('Prayer request not found');
      }

      // ✅ Check ownership (unless admin/leader)
      const isOwner = prayer.createdBy.toString() === userId.toString();
      const isAdmin = ['LEADER', 'MASTER_ADMIN'].includes(userRole);

      if (!isOwner && !isAdmin) {
        throw new Error('You can only update your own prayer requests');
      }

      // ✅ Prepare update data
      const updateFields = {};
      if (updateData.title !== undefined) updateFields.title = updateData.title;
      if (updateData.description !== undefined)
        updateFields.description = updateData.description;
      if (updateData.isAnonymous !== undefined) {
        updateFields.isAnonymous = updateData.isAnonymous;
        // Update creatorName based on anonymous flag
        if (updateData.isAnonymous) {
          updateFields.creatorName = 'Anonymous';
        } else {
          const user = await User.findById(userId);
          updateFields.creatorName = user.name;
        }
      }

      // ✅ Update prayer
      const updatedPrayer = await Prayer.findByIdAndUpdate(
        prayerId,
        updateFields,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      // ✅ Log audit action
      await auditHelper.logAction({
        action: 'UPDATE_PRAYER',
        performedBy: userId,
        performerRole: userRole,
        targetId: prayerId,
        targetType: 'PRAYER',
        metadata: {
          updatedFields: Object.keys(updateFields),
        },
      });

      return updatedPrayer;
    } catch (error) {
      throw new Error(`Failed to update prayer: ${error.message}`);
    }
  },

  /**
   * ❌ DELETE PRAYER REQUEST
   * Rules:
   * - USER: can only delete their own prayers
   * - LEADER/MASTER_ADMIN: can delete any prayer
   *
   * Audit: logs DELETE_PRAYER action
   */
  async deletePrayer(prayerId, userId, userRole) {
    try {
      // ✅ Find prayer
      const prayer = await Prayer.findById(prayerId);
      if (!prayer) {
        throw new Error('Prayer request not found');
      }

      // ✅ Check ownership (unless admin/leader)
      const isOwner = prayer.createdBy.toString() === userId.toString();
      const isAdmin = ['LEADER', 'MASTER_ADMIN'].includes(userRole);

      if (!isOwner && !isAdmin) {
        throw new Error('You can only delete your own prayer requests');
      }

      // ✅ Delete prayer
      await Prayer.findByIdAndDelete(prayerId);

      // ✅ Log audit action
      await auditHelper.logAction({
        action: 'DELETE_PRAYER',
        performedBy: userId,
        performerRole: userRole,
        targetId: prayerId,
        targetType: 'PRAYER',
        metadata: {
          title: prayer.title,
        },
      });

      return { message: 'Prayer request deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete prayer: ${error.message}`);
    }
  },

  /**
   * 🔄 UPDATE PRAYER STATUS (ADMIN ONLY)
   * Only LEADER/MASTER_ADMIN can change status
   *
   * Allowed transitions:
   * ACTIVE → PRAYED → ARCHIVED
   *
   * Audit: logs status change
   */
  async updatePrayerStatus(prayerId, newStatus, userId, userRole) {
    try {
      // ✅ Check if user is authorized (LEADER or MASTER_ADMIN)
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only Leaders and Admins can change prayer status');
      }

      // ✅ Find prayer
      const prayer = await Prayer.findById(prayerId);
      if (!prayer) {
        throw new Error('Prayer request not found');
      }

      // ✅ Validate status value
      const validStatuses = ['ACTIVE', 'PRAYED', 'ARCHIVED'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status. Must be ACTIVE, PRAYED, or ARCHIVED');
      }

      const previousStatus = prayer.status;

      // ✅ Update status
      const updatedPrayer = await Prayer.findByIdAndUpdate(
        prayerId,
        { status: newStatus },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      // ✅ Log audit action
      await auditHelper.logAction({
        action: 'UPDATE_PRAYER_STATUS',
        performedBy: userId,
        performerRole: userRole,
        targetId: prayerId,
        targetType: 'PRAYER',
        metadata: {
          previousStatus,
          newStatus,
          title: prayer.title,
        },
      });

      return updatedPrayer;
    } catch (error) {
      throw new Error(`Failed to update prayer status: ${error.message}`);
    }
  },

  /**
   * 🙏 TOGGLE "I PRAYED" (IMPORTANT FEATURE)
   * Logic:
   * - If user has NOT prayed → add userId to prayedBy, increment prayerCount
   * - If user already prayed → remove userId from prayedBy, decrement prayerCount
   *
   * Notification:
   * - Send notification to prayer creator
   * - Don't notify if user is praying for their own request
   *
   * Audit: logs PRAYED action
   */
  async togglePrayed(prayerId, userId, userRole) {
    try {
      // ✅ Find prayer
      const prayer = await Prayer.findById(prayerId);
      if (!prayer) {
        throw new Error('Prayer request not found');
      }

      // ✅ Check if user has already prayed
      const userIndex = prayer.prayedBy.findIndex(
        (id) => id.toString() === userId.toString()
      );

      let hasPrayed = false;
      let notificationMessage = '';

      if (userIndex === -1) {
        // ✅ User hasn't prayed yet → add to prayedBy
        prayer.prayedBy.push(userId);
        prayer.prayerCount += 1;
        hasPrayed = true;
        notificationMessage = 'Someone prayed for your prayer request';
      } else {
        // ✅ User already prayed → remove from prayedBy
        prayer.prayedBy.splice(userIndex, 1);
        prayer.prayerCount = Math.max(0, prayer.prayerCount - 1);
        hasPrayed = false;
      }

      // ✅ Save updated prayer
      await prayer.save();

      // ✅ Send notification to creator (only when praying, not when unpraying)
      // IMPORTANT: Don't notify user for their own prayer
      if (
        hasPrayed &&
        prayer.createdBy.toString() !== userId.toString()
      ) {
        // Get creator info for notification
        const creator = await User.findById(prayer.createdBy);

        if (creator) {
          const notification = new Notification({
            userId: prayer.createdBy,
            type: 'PRAYER',
            title: 'Someone prayed for your request',
            message: notificationMessage,
            referenceId: prayer._id,
            isRead: false,
          });
          await notification.save();
        }
      }

      // ✅ Log audit action
      await auditHelper.logAction({
        action: 'PRAYED',
        performedBy: userId,
        performerRole: userRole,
        targetId: prayerId,
        targetType: 'PRAYER',
        metadata: {
          hasPrayed,
          title: prayer.title,
        },
      });

      // ✅ Return updated prayer with hasPrayed status
      const updatedPrayer = await Prayer.findById(prayerId)
        .populate('createdBy', 'name email')
        .lean();

      return {
        ...updatedPrayer,
        prayerCount: updatedPrayer.prayedBy.length,
        hasPrayed,
      };
    } catch (error) {
      throw new Error(`Failed to toggle prayed status: ${error.message}`);
    }
  },
};

export default prayerService;
