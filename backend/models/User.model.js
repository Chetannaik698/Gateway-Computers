const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, 'Enter a valid 10-digit phone number'],
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries
    },

    // ── Role ──
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },

    // ── User-only fields ──
    address: {
      type: String,
      default: '',
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],

    // ── Account status ──
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Password reset ──
    resetPasswordToken:   { type: String,  default: null },
    resetPasswordExpires: { type: Date,    default: null },
  },
  { timestamps: true }
);

// ── Hash password before save ──
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Compare entered password with stored hash ──
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Helper: check if user is admin or superadmin ──
userSchema.methods.isAdmin = function () {
  return this.role === 'admin' || this.role === 'superadmin';
};

module.exports = mongoose.model('User', userSchema);
