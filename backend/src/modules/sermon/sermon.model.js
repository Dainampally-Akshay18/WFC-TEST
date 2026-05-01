import mongoose from 'mongoose';

const sermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    preacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    youtubeUrl: String,
    youtubeId: String,
    sermonDate: Date,
    duration: Number,
    category: String,
    tags: [String],
    status: {
      type: String,
      default: 'DRAFT',
    },
  },
  { timestamps: true }
);

export const SermonModel = mongoose.model('Sermon', sermonSchema);

export default SermonModel;
