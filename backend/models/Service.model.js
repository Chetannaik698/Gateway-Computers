const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 200,
    },
    icon: {
      type: String, // Font Awesome class e.g. "fa-camera"
      default: 'fa-wrench',
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
      min: 0,
    },
    features: [
      {
        type: String, // e.g. "Site Survey", "Remote View Config"
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number, // display order on frontend
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
