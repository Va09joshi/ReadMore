import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
