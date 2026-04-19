const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/booking.controller');

// Public — customer submits booking
router.post('/', createBooking);

// Admin protected
router.get('/',           protect, adminOnly, getAllBookings);
router.get('/:id',        protect, adminOnly, getBookingById);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.delete('/:id',     protect, adminOnly, deleteBooking);

module.exports = router;
