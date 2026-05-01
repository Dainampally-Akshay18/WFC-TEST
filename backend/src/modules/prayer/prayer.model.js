import mongoose from 'mongoose';

const prayerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    prayerCategory: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    prayersFor: [String],
  },
  { timestamps: true }
);

export const PrayerModel = mongoose.model('Prayer', prayerSchema);

export default PrayerModel;
