const Booking = require('../models/Booking.model');

// @desc  Create booking (public)
// @route POST /api/bookings
// @access Public
const createBooking = async (req, res) => {
  try {
    const { name, phone, service, serviceLabel, preferredDate, preferredTimeSlot, address, additionalNotes } = req.body;

    // Only include service if it's a valid ObjectId
    const bookingData = {
      name, phone, serviceLabel,
      preferredDate, preferredTimeSlot,
      address, additionalNotes,
    };

    // Add service only if it's a valid ObjectId (24 hex characters)
    if (service && /^[0-9a-fA-F]{24}$/.test(service)) {
      bookingData.service = service;
    }

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking received! We will contact you shortly.',
      bookingRef: booking.bookingRef,
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all bookings
// @route GET /api/bookings
// @access Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .populate('service', 'title startingPrice')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single booking
// @route GET /api/bookings/:id
// @access Private (Admin)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service', 'title');
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update booking status
// @route PUT /api/bookings/:id/status
// @access Private (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminRemarks },
      { new: true, runValidators: true }
    );
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete booking
// @route DELETE /api/bookings/:id
// @access Private (Admin)
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBooking, getAllBookings, getBookingById, updateBookingStatus, deleteBooking };
