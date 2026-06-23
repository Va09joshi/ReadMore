import mongoose from 'mongoose';

const deliveryTrackingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'],
      default: 'PENDING',
    },
    currentLocation: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const DeliveryTracking = mongoose.model('DeliveryTracking', deliveryTrackingSchema);
