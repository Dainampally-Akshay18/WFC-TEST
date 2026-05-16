import mongoose from 'mongoose';

/**
 * ============================================
 * PRAYER REQUEST SCHEMA
 * ============================================
 *
 * CORE FEATURES:
 * - Global feature (no branch restrictions)
 * - Tracking: title, description, anonymous status
 * - Creator: createdBy (userId), creatorName
 * - Status: ACTIVE | PRAYED | ARCHIVED
 * - Prayer counter: prayerCount, prayedBy[]
 * - Timestamps: createdAt, updatedAt
 *
 * IMPORTANT FIELDS:
 * - isAnonymous: if true, creatorName = "Anonymous" but createdBy still tracked
 * - prayedBy: array of userIds to prevent duplicates and enable toggle
 * - prayerCount: incremented/decremented with prayedBy changes
 */

const prayerSchema = new mongoose.Schema(
  {
    // 📝 Content
    title: {
      type: String,
      required: [true, 'Prayer title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      required: [true, 'Prayer description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // 👤 Creator Info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },

    creatorName: {
      type: String,
      required: [true, 'Creator name is required'],
      trim: true,
      // If isAnonymous = true, this will be "Anonymous"
      // Otherwise, it will be the actual user name
    },

    // 🔐 Privacy
    isAnonymous: {
      type: Boolean,
      default: false,
      // true = creator name hidden (but createdBy still tracked internally)
      // false = creator name visible
    },

    // 📊 Status
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'PRAYED', 'ARCHIVED'],
        message: 'Status must be ACTIVE, PRAYED, or ARCHIVED',
      },
      default: 'ACTIVE',
      // ACTIVE = needs prayer
      // PRAYED = someone prayed / acknowledged
      // ARCHIVED = old/closed
    },

    // 🙏 Prayer Counter
    prayerCount: {
      type: Number,
      default: 0,
      min: 0,
      // Incremented when user prays, decremented when user "unprays"
    },

    prayedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      // Array of userIds who have prayed for this request
      // Used to prevent duplicates and enable toggle behavior
    },
  },
  {
    timestamps: true,
    // createdAt & updatedAt automatically added
  }
);

// ============= INDEXES =============

// For sorting by creation date (newest first)
prayerSchema.index({ createdAt: -1 });

// For filtering by status
prayerSchema.index({ status: 1 });

// For finding prayers by creator
prayerSchema.index({ createdBy: 1 });

// Combined index for common queries
prayerSchema.index({ status: 1, createdAt: -1 });

// ============= EXPORTS =============

export const Prayer = mongoose.model('Prayer', prayerSchema);

export default Prayer;
