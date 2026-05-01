import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    eventType: String,
    startDate: Date,
    endDate: Date,
    location: String,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const EventModel = mongoose.model('Event', eventSchema);

export default EventModel;
