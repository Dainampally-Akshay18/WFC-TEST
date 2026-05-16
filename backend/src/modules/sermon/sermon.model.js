import mongoose from 'mongoose';

/**
 * ============================================
 * SERMON CATEGORY SCHEMA
 * ============================================
 *
 * CORE FEATURES:
 * - Category organization for sermons
 * - Created and managed by LEADER/MASTER_ADMIN only
 * - Tracks creation metadata
 *
 * IMPORTANT FIELDS:
 * - name: Category name (e.g., "Faith", "Prayer", "Grace")
 * - description: Category description
 * - createdBy: Admin/Leader who created the category
 */

const sermonCategorySchema = new mongoose.Schema(
  {
    // 📝 Category Info
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
      unique: true,
    },

    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // 👤 Creator Info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },
  },
  { timestamps: true }
);

/**
 * ============================================
 * SERMON SCHEMA
 * ============================================
 *
 * CORE FEATURES:
 * - Global sermon management
 * - YouTube video integration with ID extraction
 * - Category-based organization
 * - Publishing workflow (draft/published)
 * - Created and managed by LEADER/MASTER_ADMIN
 * - Viewable by all users (if published)
 *
 * IMPORTANT FIELDS:
 * - youtubeLink: Original YouTube URL (for reference)
 * - youtubeVideoId: Extracted video ID (for embedding/display)
 * - categoryId: Reference to SermonCategory
 * - isPublished: Workflow state (default = false)
 * - createdBy: Admin/Leader who created
 */

const sermonSchema = new mongoose.Schema(
  {
    // 📝 Content
    title: {
      type: String,
      required: [true, 'Sermon title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Sermon description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },

    // 🎥 YouTube Integration
    youtubeLink: {
      type: String,
      required: [true, 'YouTube link is required'],
      validate: {
        validator: function (value) {
          // Accept both youtube.com and youtu.be formats
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
          return youtubeRegex.test(value);
        },
        message: 'Invalid YouTube URL format',
      },
    },

    youtubeVideoId: {
      type: String,
      required: [true, 'YouTube video ID is required'],
      unique: true, // Prevent duplicate videos
      sparse: true, // Allow null for updates in progress
    },

    // 📂 Category Reference
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SermonCategory',
      required: [true, 'Sermon category is required'],
    },

    // 👤 Speaker Info
    speakerName: {
      type: String,
      trim: true,
      maxlength: [100, 'Speaker name cannot exceed 100 characters'],
    },

    // 🖼️ Thumbnail
    thumbnail: {
      type: String,
      // Can be URL or auto-generated from YouTube ID
      // Default format: https://img.youtube.com/vi/{videoId}/maxresdefault.jpg
    },

    // 📌 Publishing Workflow
    isPublished: {
      type: Boolean,
      default: false,
      // false = DRAFT (only LEADER/MASTER_ADMIN can see)
      // true = PUBLISHED (all users can see)
    },

    // 👤 Creator Info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },
  },
  { timestamps: true }
);

// ============================================
// INDEXES (For Query Optimization)
// ============================================

// Category Indexes
sermonCategorySchema.index({ name: 1 });
sermonCategorySchema.index({ createdBy: 1 });
sermonCategorySchema.index({ createdAt: -1 });

// Sermon Indexes
sermonSchema.index({ categoryId: 1 }); // Filter by category
sermonSchema.index({ youtubeVideoId: 1 }); // Prevent duplicates + fast lookup
sermonSchema.index({ createdAt: -1 }); // Newest first sorting
sermonSchema.index({ isPublished: 1 }); // Show published only for users
sermonSchema.index({ isPublished: 1, createdAt: -1 }); // Combined: published + sort
sermonSchema.index({ createdBy: 1 }); // Admin/Leader's sermons
sermonSchema.index({ title: 'text', description: 'text' }); // Full-text search

// ============================================
// MODELS
// ============================================

const SermonCategory = mongoose.model('SermonCategory', sermonCategorySchema);
const Sermon = mongoose.model('Sermon', sermonSchema);

export { SermonCategory, Sermon };
export default Sermon;
