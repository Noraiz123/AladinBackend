const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    warranty: {
      type: String,
      required: false,
    },
    bestBefore: {
      type: String,
      required: false,
    },
    purchaseDate: {
      type: String,
      required: false,
    },
    specs: {
      type: [{ name: String, description: String }],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const sku = mongoose.models.Sku || mongoose.model('Sku', skuSchema);

module.exports = sku;
