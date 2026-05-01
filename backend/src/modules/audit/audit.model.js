import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: String,
    resource: String,
    resourceId: String,
    changes: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export const AuditModel = mongoose.model('Audit', auditSchema);

export default AuditModel;
