import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: String,
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      entityType: String,
      entityId: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
