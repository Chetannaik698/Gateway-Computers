const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original Price cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    size: {
      type: String,
      enum: ['small', 'large'],
      default: 'small',
    },
    images: [
      {
        type: String, // image file paths / URLs
      },
    ],
    specs: [
      {
        type: String, // e.g. "16GB RAM", "512GB SSD"
      },
    ],
    badge: {
      type: String,
      enum: ['New', 'Bestseller', 'Popular', 'Second-hand', 'Pro', null],
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    whatsappEnquiryEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto set isAvailable false if stock hits 0
productSchema.pre('save', function (next) {
  if (this.stock === 0) this.isAvailable = false;
  next();
});

module.exports = mongoose.model('Product', productSchema);
