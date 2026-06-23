import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Referral = mongoose.model('Referral', referralSchema);
