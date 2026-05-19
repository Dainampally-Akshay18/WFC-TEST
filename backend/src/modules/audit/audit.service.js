import Audit from './audit.model.js';
import User from '../auth/auth.model.js';

/**
 * ============================================
 * AUDIT SERVICE - BUSINESS LOGIC
 * ============================================
 *
 * Two main responsibilities:
 * 1. Centralized logging helper (logAction) - used by other modules
 * 2. Admin audit viewing (getAuditLogs, getAuditLogById) - for dashboard
 *
 * IMPORTANT:
 * - Audit logs are IMMUTABLE (no updates/deletes)
 * - All business logic here
 * - Controllers only call service methods
 */

export const auditService = {
  // ============================================
  // CENTRALIZED LOGGING HELPER (Used by all modules)
  // ============================================

  /**
   * 📝 LOG ACTION
   * Centralized helper for logging any action across the system
   *
   * Called by: Auth, Events, Prayers, Sermons, Blogs modules
   *
   * @param {Object} options - Logging options
   * @param {String} options.action - Action name (CREATE_EVENT, UPDATE_BLOG, APPROVE_USER, etc.)
   * @param {String} options.performedBy - User ID who performed action
   * @param {String} options.performerRole - User role (USER, LEADER, MASTER_ADMIN)
   * @param {String} options.targetId - Entity ID being affected (blogId, userId, etc.)
   * @param {String} options.targetType - Entity type (BLOG, USER, EVENT, PRAYER, SERMON, etc.)
   * @param {Object} options.metadata - Optional extra info (branch, title, previous values, etc.)
   * @returns {Promise<Object>} Audit log entry
   *
   * @example
   * await auditService.logAction({
   *   action: 'CREATE_BLOG',
   *   performedBy: user._id,
   *   performerRole: user.role,
   *   targetId: blog._id,
   *   targetType: 'BLOG',
   *   metadata: { title: 'New Blog Post', branch: user.branch }
   * });
   */
  async logAction({
    action,
    performedBy,
    performerRole,
    targetId,
    targetType,
    metadata = {},
  }) {
    try {
      const auditLog = new Audit({
        action,
        performedBy,
        performerRole,
        targetId,
        targetType,
        metadata,
      });

      await auditLog.save();
      console.log(`✅ Audit logged: ${action} by ${performerRole}`);
      return auditLog;
    } catch (error) {
      // Don't throw - audit failure shouldn't break main operation
      console.error('❌ Audit log failed:', error.message);
      return null;
    }
  },

  // ============================================
  // ADMIN VIEWING - GET AUDIT LOGS
  // ============================================

  /**
   * 📖 GET AUDIT LOGS
   * Retrieve audit logs with pagination and filtering
   *
   * Access Control:
   * - MASTER_ADMIN: Can see ALL logs
   * - LEADER: Can see logs for their branch + global logs
   * - USER: No access (403)
   *
   * @param {String} userId - Who's requesting
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @param {String} userBranch - User's branch (if LEADER)
   * @param {Object} options - Query options
   * @param {Number} options.page - Page number (default: 1)
   * @param {Number} options.limit - Results per page (default: 20, max: 100)
   * @param {String} options.action - Filter by action
   * @param {String} options.performerRole - Filter by role
   * @param {String} options.targetType - Filter by target type
   * @param {String} options.branch - Filter by branch
   * @param {String} options.startDate - Filter from date (ISO string)
   * @param {String} options.endDate - Filter to date (ISO string)
   * @returns {Promise<Object>} { logs, total, page, limit, pages }
   */
  async getAuditLogs(
    userId,
    userRole,
    userBranch,
    options = {}
  ) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can view audit logs');
      }

      // ✅ Pagination defaults
      let page = parseInt(options.page) || 1;
      let limit = parseInt(options.limit) || 20;

      // Validate pagination
      if (page < 1) page = 1;
      if (limit < 1) limit = 20;
      if (limit > 100) limit = 100; // Max 100 per page

      const skip = (page - 1) * limit;

      // ✅ Build query filter
      let query = {};

      // --- Access Control Filter ---
      if (userRole === 'LEADER') {
        // LEADER sees: logs for their branch OR global logs (no branch)
        query.$or = [
          { 'metadata.branch': userBranch },
          { 'metadata.branch': { $exists: false } },
          { 'metadata.branch': null },
          { 'metadata.branch': 'GLOBAL' },
        ];
      }
      // MASTER_ADMIN sees ALL (no filter needed)

      // --- Action Filter ---
      if (options.action) {
        query.action = options.action;
      }

      // --- Performer Role Filter ---
      if (options.performerRole) {
        query.performerRole = options.performerRole;
      }

      // --- Target Type Filter ---
      if (options.targetType) {
        query.targetType = options.targetType;
      }

      // --- Branch Filter (for MASTER_ADMIN only) ---
      if (options.branch && userRole === 'MASTER_ADMIN') {
        query['metadata.branch'] = options.branch;
      }

      // --- Date Range Filter ---
      if (options.startDate || options.endDate) {
        query.createdAt = {};
        if (options.startDate) {
          query.createdAt.$gte = new Date(options.startDate);
        }
        if (options.endDate) {
          query.createdAt.$lte = new Date(options.endDate);
        }
      }

      // ✅ Execute query
      const logs = await Audit.find(query)
        .populate('performedBy', 'name email role branch')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(); // Use lean for better performance on read-only data

      // ✅ Get total count for pagination
      const total = await Audit.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch audit logs: ${error.message}`);
    }
  },

  /**
   * 📖 GET SINGLE AUDIT LOG
   * Retrieve a single audit log entry
   *
   * Access Control:
   * - MASTER_ADMIN: Can see ANY log
   * - LEADER: Can see logs for their branch + global logs
   *
   * @param {String} auditId - Audit log ID
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @param {String} userBranch - User's branch (if LEADER)
   * @returns {Promise<Object>} Audit log details
   */
  async getAuditLogById(auditId, userRole, userBranch) {
    try {
      // ✅ Access Control: Only LEADER and MASTER_ADMIN
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can view audit logs');
      }

      // ✅ Find audit log
      const auditLog = await Audit.findById(auditId).populate(
        'performedBy',
        'name email role branch'
      );

      if (!auditLog) {
        throw new Error('Audit log not found');
      }

      // ✅ Access Control: LEADER branch filter
      if (userRole === 'LEADER') {
        const logBranch = auditLog.metadata?.branch || null;
        if (
          logBranch &&
          logBranch !== 'GLOBAL' &&
          logBranch !== userBranch
        ) {
          throw new Error(
            'You do not have permission to view this audit log'
          );
        }
      }

      return auditLog;
    } catch (error) {
      throw new Error(`Failed to fetch audit log: ${error.message}`);
    }
  },

  /**
   * 📊 GET AUDIT STATISTICS
   * Get summary statistics about audit logs
   *
   * @param {String} userRole - USER/LEADER/MASTER_ADMIN
   * @param {String} userBranch - User's branch (if LEADER)
   * @param {Object} options - Optional filters (startDate, endDate, branch)
   * @returns {Promise<Object>} Statistics
   */
  async getAuditStatistics(userRole, userBranch, options = {}) {
    try {
      // ✅ Access Control
      if (!['LEADER', 'MASTER_ADMIN'].includes(userRole)) {
        throw new Error('Only LEADER and MASTER_ADMIN can view audit stats');
      }

      // ✅ Build query filter
      let query = {};

      if (userRole === 'LEADER') {
        query.$or = [
          { 'metadata.branch': userBranch },
          { 'metadata.branch': { $exists: false } },
          { 'metadata.branch': null },
          { 'metadata.branch': 'GLOBAL' },
        ];
      }

      // Add date range if provided
      if (options.startDate || options.endDate) {
        query.createdAt = {};
        if (options.startDate) {
          query.createdAt.$gte = new Date(options.startDate);
        }
        if (options.endDate) {
          query.createdAt.$lte = new Date(options.endDate);
        }
      }

      // ✅ Get statistics
      const stats = await Audit.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalLogs: { $sum: 1 },
            actionCounts: { $push: '$action' },
            roleCounts: { $push: '$performerRole' },
            targetTypes: { $push: '$targetType' },
          },
        },
      ]);

      if (!stats || stats.length === 0) {
        return {
          totalLogs: 0,
          actionBreakdown: {},
          roleBreakdown: {},
          targetTypeBreakdown: {},
        };
      }

      const stat = stats[0];

      // Count frequencies
      const countFrequencies = (arr) =>
        arr.reduce((acc, item) => {
          acc[item] = (acc[item] || 0) + 1;
          return acc;
        }, {});

      return {
        totalLogs: stat.totalLogs,
        actionBreakdown: countFrequencies(stat.actionCounts),
        roleBreakdown: countFrequencies(stat.roleCounts),
        targetTypeBreakdown: countFrequencies(stat.targetTypes),
      };
    } catch (error) {
      throw new Error(`Failed to fetch audit statistics: ${error.message}`);
    }
  },
};

export default auditService;
