const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Customer details
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },

    // Service booked
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      // Optional - serviceLabel is used for display
    },
    serviceLabel: {
      type: String, // store label directly for easy display
      required: true,
    },

    // Schedule
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    preferredTimeSlot: {
      type: String,
      enum: [
        '9:00 AM – 11:00 AM',
        '11:00 AM – 1:00 PM',
        '2:00 PM – 4:00 PM',
        '4:00 PM – 6:00 PM',
      ],
      default: '9:00 AM – 11:00 AM',
    },

    // Notes
    additionalNotes: {
      type: String,
      default: '',
    },

    // Status tracking
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'done', 'cancelled'],
      default: 'pending',
    },

    // Admin notes
    adminRemarks: {
      type: String,
      default: '',
    },

    // Reference ID shown to customer (e.g. #B0001)
    bookingRef: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate booking reference before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingRef) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingRef = `#B${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
