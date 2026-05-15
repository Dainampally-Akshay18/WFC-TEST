import mongoose from 'mongoose';

/**
 * ============================================
 * BLOG SCHEMA (PASTOR'S BLOG SYSTEM)
 * ============================================
 * 
 * ONLY MASTER_ADMIN (Pastor) can create/edit/publish blogs
 * USERS & LEADERS: read-only access
 * 
 * Schema Fields:
 * - title: Blog post title (required)
 * - content: Rich text/HTML content (required)
 * - authorId: MASTER_ADMIN user ID (required)
 * - authorName: MASTER_ADMIN name (required)
 * - thumbnail: Optional featured image URL (Cloudinary)
 * - tags: Array of tags for filtering (optional)
 * - slug: SEO-friendly URL slug (auto-generated from title)
 * - isPublished: Draft vs Live status (default: false)
 * - publishedAt: Timestamp when blog was published
 * - timestamps: createdAt, updatedAt
 */

const blogSchema = new mongoose.Schema(
  {
    // 📝 Content Fields
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    content: {
      type: String,
      required: [true, 'Blog content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },

    // 👤 Author Fields
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required'],
    },

    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },

    // 🖼️ Media
    thumbnail: {
      type: String,
      trim: true,
      // Optional: URL to Cloudinary image
    },

    // 🏷️ Tags & Organization
    tags: {
      type: [String],
      default: [],
      // e.g., ["faith", "hope", "love"]
    },

    // 🔗 SEO-friendly slug
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Auto-generated from title
    },

    // 📊 Publishing Status
    isPublished: {
      type: Boolean,
      default: false,
      // false = draft, true = published
    },

    publishedAt: {
      type: Date,
      // Set when blog is published
    },
  },
  { 
    timestamps: true,
    // createdAt & updatedAt automatically added
  }
);

// ============= INDEXES =============

// Index for fast queries
blogSchema.index({ slug: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ authorId: 1 });
blogSchema.index({ tags: 1 });

// Text search index for title and content
blogSchema.index({ title: 'text', content: 'text' });

// ============= EXPORTS =============

export const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
