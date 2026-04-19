const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/service.controller');

// Public
router.get('/',    getAllServices);
router.get('/:id', getServiceById);

// Admin protected
router.post('/',      protect, adminOnly, createService);
router.put('/:id',    protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
