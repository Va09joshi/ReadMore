import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  frequency: {
    type: String,
    default: 'Daily',
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to calculate totalPrice
cartSchema.pre('save', function () {
  this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

export const Cart = mongoose.model('Cart', cartSchema);
