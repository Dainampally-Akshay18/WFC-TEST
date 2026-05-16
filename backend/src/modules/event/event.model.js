import mongoose from 'mongoose';

/**
 * ============================================
 * EVENT SCHEMA (EVENT MANAGEMENT SYSTEM)
 * ============================================
 * 
 * IMPORTANT: Visibility vs Branch
 * - visibility: "GLOBAL" | "BRANCH"
 * - branch: "BRANCH1" | "BRANCH2" | null
 * 
 * Rules:
 * - USER: Can only create BRANCH events for their own branch
 * - LEADER: Can create BRANCH + GLOBAL events
 * - MASTER_ADMIN: Can create any event, any visibility
 * 
 * If visibility === "GLOBAL" → branch MUST be null
 */

const eventSchema = new mongoose.Schema(
  {
    // 📝 Event Details
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Event description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },

    // 📅 Date & Time
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },

    time: {
      type: String, // HH:MM format
      required: [true, 'Event time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
    },

    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },

    // 🌍 Visibility & Branch
    visibility: {
      type: String,
      enum: {
        values: ['BRANCH', 'GLOBAL'],
        message: 'Visibility must be either BRANCH or GLOBAL',
      },
      required: [true, 'Event visibility is required'],
    },

    branch: {
      type: String,
      enum: {
        values: ['BRANCH1', 'BRANCH2'],
        message: 'Branch must be BRANCH1 or BRANCH2',
      },
      // ⚠️ IMPORTANT: If visibility = "GLOBAL", branch MUST be null
      validate: {
        validator: function (value) {
          if (this.visibility === 'GLOBAL' && value !== null) {
            return false;
          }
          if (this.visibility === 'BRANCH' && !value) {
            return false;
          }
          return true;
        },
        message: 'If visibility is GLOBAL, branch must be null. If visibility is BRANCH, branch is required.',
      },
    },

    // 👤 Creator Info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },

    createdByRole: {
      type: String,
      enum: ['USER', 'LEADER', 'MASTER_ADMIN'],
      required: [true, 'Creator role is required'],
    },

    createdByBranch: String,
  },
  { 
    timestamps: true,
    // createdAt & updatedAt automatically added
  }
);

// ============= INDEXES =============

// For filtering by branch + visibility
eventSchema.index({ visibility: 1, branch: 1 });

// For sorting by date (upcoming events first)
eventSchema.index({ date: 1 });

// For finding user's events
eventSchema.index({ createdBy: 1, createdAt: -1 });

// For branch filtering
eventSchema.index({ branch: 1, date: 1 });

// For global events
eventSchema.index({ visibility: 1, date: 1 });

// ============= EXPORTS =============

export const Event = mongoose.model('Event', eventSchema);

export default Event;
