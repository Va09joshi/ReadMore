import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    commissionPercentage: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const Provider = mongoose.model('Provider', providerSchema);
