const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');

const {
  submitContact,
  getAllContacts,
  markAsRead,
  deleteContact,
} = require('../controllers/contact.controller');

// Public — customer sends message
router.post('/', submitContact);

// Admin protected
router.get('/',       protect, adminOnly, getAllContacts);
router.put('/:id',    protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
