const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/razorpay.controller');

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify payment signature
router.post('/verify-payment', verifyPayment);

module.exports = router;
