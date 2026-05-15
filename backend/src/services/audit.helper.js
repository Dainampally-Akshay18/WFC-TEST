import Audit from '../modules/audit/audit.model.js';

/**
 * ============================================
 * AUDIT LOG HELPER SERVICE
 * ============================================
 * 
 * Logs all important system actions
 * Provides audit trail for compliance and debugging
 * 
 * Used by: Auth, Blog, Events, Prayers, etc.
 */

export const auditHelper = {
  /**
   * Log an action in the audit trail
   * 
   * @param {Object} options - Logging options
   * @param {String} options.action - Action name (CREATE_BLOG, UPDATE_BLOG, etc.)
   * @param {String} options.performedBy - User ID who performed action
   * @param {String} options.performerRole - User role (USER, LEADER, MASTER_ADMIN)
   * @param {String} options.targetId - Entity ID being affected (blogId, userId, etc.)
   * @param {String} options.targetType - Entity type (BLOG, USER, EVENT, etc.)
   * @param {Object} options.metadata - Optional extra info (previous state, etc.)
   * @returns {Promise<Object>} Audit log entry
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
      console.error('❌ Audit log failed:', error.message);
      // Don't throw - audit failure shouldn't break main operation
      return null;
    }
  },

  /**
   * Log blog-related actions
   */
  async logBlogAction(action, performedBy, performerRole, blogId, metadata = {}) {
    return this.logAction({
      action,
      performedBy,
      performerRole,
      targetId: blogId,
      targetType: 'BLOG',
      metadata,
    });
  },
};

export default auditHelper;
