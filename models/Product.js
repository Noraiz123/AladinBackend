const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: {
      type: [{ name: String, image: String }],
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    childCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    tags: [String],
    flashSale: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: String,
      default: 'Show',
      enum: ['Show', 'Hide'],
    },
    approved: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
