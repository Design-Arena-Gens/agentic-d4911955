const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../config/constants');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    qty: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [orderItemSchema],
      validate: [(val) => val.length > 0, 'Order must contain at least one item']
    },
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    paymentIntentId: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
