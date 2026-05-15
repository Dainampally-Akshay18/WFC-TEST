import mongoose from 'mongoose';

/**
 * ============================================
 * NOTIFICATION SCHEMA
 * ============================================
 * 
 * Stores user notifications for:
 * - Blog publications
 * - Event creations
 * - Prayer requests
 * - User approvals
 * 
 * Schema:
 * - userId: who receives the notification
 * - type: BLOG, EVENT, PRAYER, APPROVAL
 * - title: short message
 * - message: detailed message
 * - referenceId: link to entity (blogId, eventId, etc.)
 * - isRead: unread status
 * - timestamps: createdAt
 */

const notificationSchema = new mongoose.Schema(
  {
    // 👤 Recipient
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🏷️ Type
    type: {
      type: String,
      enum: ['BLOG', 'EVENT', 'PRAYER', 'APPROVAL'],
      required: true,
    },

    // 📝 Content
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // 🔗 Reference
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can reference Blog, Event, Prayer, or User
    },

    // 👀 Status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ============= INDEXES =============

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

// ============= EXPORTS =============

export const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

