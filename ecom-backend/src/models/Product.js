const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    images: [String],
    category: {
      type: String,
      index: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    attributes: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
