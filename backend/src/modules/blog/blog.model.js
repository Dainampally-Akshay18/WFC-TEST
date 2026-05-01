import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: String,
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'DRAFT',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const BlogModel = mongoose.model('Blog', blogSchema);

export default BlogModel;
