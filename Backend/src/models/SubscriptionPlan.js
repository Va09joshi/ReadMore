import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    frequency: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
      required: true,
    },
    duration: {
      type: Number,
      required: true, // Duration in terms of frequency (e.g., 1 month)
    },
    price: {
      type: Number,
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ['PHYSICAL', 'DIGITAL', 'BOTH'],
      default: 'PHYSICAL',
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
