import mongoose from 'mongoose';

/**
 * ============================================
 * AUDIT LOG SCHEMA
 * ============================================
 *
 * IMMUTABLE audit trail for all important actions
 * Provides accountability and debugging capability
 *
 * Core Design:
 * - action: action type (CREATE_BLOG, APPROVE_USER, etc.)
 * - performedBy: userId who performed action
 * - performerRole: role of performer (USER, LEADER, MASTER_ADMIN)
 * - targetId: entity affected (blogId, userId, etc.)
 * - targetType: entity type (BLOG, USER, EVENT, etc.)
 * - metadata: flexible object for storing extra info, branch info, etc.
 * - createdAt: immutable timestamp
 *
 * IMPORTANT: No updates or deletes - append-only log
 */

const auditSchema = new mongoose.Schema(
  {
    // ⚙️ ACTION
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
      // Examples:
      // AUTH: SIGNUP, LOGIN, APPROVE_USER, REJECT_USER, CHANGE_ROLE
      // EVENTS: CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT
      // PRAYERS: CREATE_PRAYER, UPDATE_PRAYER, DELETE_PRAYER, PRAYED
      // SERMONS: CREATE_SERMON, UPDATE_SERMON, DELETE_SERMON, PUBLISH_SERMON
      // BLOGS: CREATE_BLOG, UPDATE_BLOG, DELETE_BLOG, PUBLISH_BLOG
    },

    // 👤 PERFORMER INFO
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Performer ID is required'],
      index: true,
    },

    performerRole: {
      type: String,
      enum: {
        values: ['USER', 'LEADER', 'MASTER_ADMIN'],
        message: 'Role must be USER, LEADER, or MASTER_ADMIN',
      },
      required: [true, 'Performer role is required'],
      index: true,
    },

    // 🎯 TARGET INFO
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
      index: true,
      // Can be userId, blogId, eventId, prayerId, sermonId, etc.
    },

    targetType: {
      type: String,
      enum: {
        values: ['USER', 'BLOG', 'EVENT', 'PRAYER', 'SERMON', 'NOTIFICATION', 'SERMON_CATEGORY'],
        message: 'Target type must be USER, BLOG, EVENT, PRAYER, SERMON, NOTIFICATION, or SERMON_CATEGORY',
      },
      required: [true, 'Target type is required'],
      index: true,
    },

    // 📋 METADATA (FLEXIBLE)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Optional: store context-specific info
      // Examples:
      // { branch: "BRANCH1", blogTitle: "...", previousStatus: "draft" }
      // { branch: "GLOBAL", eventTitle: "Sunday Service" }
      // { previousRole: "USER", newRole: "LEADER" }
      // For branch-aware filtering by LEADERs
    },
  },
  {
    timestamps: true, // createdAt, updatedAt (immutable after creation)
    collection: 'audits',
  }
);

// ============================================
// INDEXES (For Query Optimization)
// ============================================

// Fast lookup by action type with date
auditSchema.index({ action: 1, createdAt: -1 });

// User activity history
auditSchema.index({ performedBy: 1, createdAt: -1 });

// Role-based queries
auditSchema.index({ performerRole: 1, createdAt: -1 });

// Entity tracking
auditSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

// Combined for common queries (action + date)
auditSchema.index({ action: 1, performedBy: 1, createdAt: -1 });

// For branch-aware filtering (in metadata)
auditSchema.index({ 'metadata.branch': 1, createdAt: -1 });

// ============================================
// MODEL
// ============================================

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;

