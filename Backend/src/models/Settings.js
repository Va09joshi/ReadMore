import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    platformFeePercentage: {
      type: Number,
      default: 5, // 5% fee
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    contactEmail: {
      type: String,
      default: 'support@marketplace.com',
    },
    companyName: {
      type: String,
      default: 'SuperMarketplace Inc',
    },
    socialLinks: {
      twitter: String,
      facebook: String,
      instagram: String,
    }
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
