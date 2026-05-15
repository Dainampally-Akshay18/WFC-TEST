import mongoose from 'mongoose';

/**
 * ============================================
 * AUDIT LOG SCHEMA
 * ============================================
 * 
 * Immutable audit trail for all important actions
 * Provides accountability and debugging capability
 * 
 * Schema:
 * - action: action type (CREATE_BLOG, APPROVE_USER, etc.)
 * - performedBy: userId who performed action
 * - performerRole: role of performer (USER, LEADER, MASTER_ADMIN)
 * - targetId: entity affected (blogId, userId, etc.)
 * - targetType: entity type (BLOG, USER, EVENT, etc.)
 * - metadata: extra info (previous state, details, etc.)
 * - createdAt: timestamp
 */

const auditSchema = new mongoose.Schema(
  {
    // ⚙️ Action
    action: {
      type: String,
      required: true,
      // e.g., CREATE_BLOG, UPDATE_BLOG, PUBLISH_BLOG, DELETE_BLOG
      // APPROVE_USER, REJECT_USER, PROMOTE_USER
      // CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT
    },

    // 👤 Performer
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    performerRole: {
      type: String,
      enum: ['USER', 'LEADER', 'MASTER_ADMIN'],
      required: true,
    },

    // 🎯 Target
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Can be userId, blogId, eventId, etc.
    },

    targetType: {
      type: String,
      required: true,
      enum: ['USER', 'BLOG', 'EVENT', 'PRAYER', 'SERMON', 'NOTIFICATION'],
    },

    // 📋 Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      // Optional: store previous values, details, etc.
      // e.g., { previousRole: 'USER', newRole: 'LEADER' }
      // e.g., { blogTitle: 'How to Strengthen Faith', previousStatus: 'draft' }
    },
  },
  { timestamps: true }
  // createdAt is automatically added (immutable)
);

// ============= INDEXES =============

// For fast lookups by action type
auditSchema.index({ action: 1, createdAt: -1 });

// For user activity history
auditSchema.index({ performedBy: 1, createdAt: -1 });

// For entity tracking
auditSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

// ============= IMMUTABILITY =============

// Make schema immutable (no updates allowed)
auditSchema.set('collection', 'audits');

// ============= EXPORTS =============

export const Audit = mongoose.model('Audit', auditSchema);

export default Audit;

