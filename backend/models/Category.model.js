const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Category ID is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: [true, 'Category label is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: 'fa-box',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
