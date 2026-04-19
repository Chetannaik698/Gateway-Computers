const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload  = require('../middleware/upload.middleware');

const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

// Public routes
router.get('/',               getAllProducts);
router.get('/category/:cat',  getProductsByCategory);
router.get('/:id',            getProductById);

// Admin protected routes
router.post('/',      protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id',    protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
