const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    approved: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);

module.exports = seller;
