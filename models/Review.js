const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const review = mongoose.models.Sku || mongoose.model('Review', reviewSchema);

module.exports = review;
