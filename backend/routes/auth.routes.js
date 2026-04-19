const express = require('express');
const router  = express.Router();
const { registerUser, loginUser, getMe, getAllUsers, updateUserRole } = require('../controllers/auth.controller');
const { protect, adminOnly, superAdminOnly } = require('../middleware/auth.middleware');

// Public
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Private — any logged-in user
router.get('/me', protect, getMe);

// Admin only
router.get('/users',            protect, adminOnly, getAllUsers);

// Superadmin only
router.put('/users/:id/role',   protect, superAdminOnly, updateUserRole);

module.exports = router;
